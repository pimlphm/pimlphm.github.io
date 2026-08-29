import { createHash } from 'node:crypto';
import { cp, lstat, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(SCRIPT_DIR, '..');
const ALLOWED_KINDS = new Set(['Journal', 'Conference', 'Thesis']);
const ALLOWED_ASSET_EXTENSIONS = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.gif']);
const MAX_ASSET_BYTES = 50 * 1024 * 1024;

const normalizedTitle = (value) => value
  .normalize('NFKD')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const normalizedDoi = (value) => value
  .trim()
  .toLowerCase()
  .replace(/^https?:\/\/(?:dx\.)?doi\.org\//, '')
  .replace(/^doi:\s*/, '');

const doiFromLinks = (links = []) => {
  for (const link of links) {
    const match = String(link.href ?? '').match(/^https:\/\/(?:dx\.)?doi\.org\/(10\.[^?#]+)/i);
    if (match) return normalizedDoi(match[1]);
  }
  return '';
};

function requireString(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be a non-empty string.`);
  return value.trim();
}

function requireLocalized(value, label) {
  if (typeof value === 'string') {
    const en = requireString(value, label);
    return { en, zh: en };
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${label} must contain English text.`);
  const en = requireString(value.en, `${label}.en`);
  return {
    en,
    zh: typeof value.zh === 'string' && value.zh.trim() ? value.zh.trim() : en,
  };
}

function requireHttps(value, label) {
  const url = new URL(requireString(value, label));
  if (url.protocol !== 'https:') throw new Error(`${label} must use https.`);
  return url.href;
}

function safeRelativeAsset(value, label) {
  const path = requireString(value, label);
  if (isAbsolute(path) || path.includes('..') || path.includes('/') || path.includes('\\')) {
    throw new Error(`${label} must be a file name inside its publication folder.`);
  }
  const extension = extname(path).toLowerCase();
  if (!ALLOWED_ASSET_EXTENSIONS.has(extension)) throw new Error(`${label} has an unsupported file type: ${extension || '(none)'}.`);
  return path;
}

async function sha256(path) {
  const bytes = await readFile(path);
  return createHash('sha256').update(bytes).digest('hex');
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read valid JSON from ${path}: ${error.message}`);
  }
}

function addUnique(map, key, id, label, versionOf = '') {
  if (!key) return;
  const existing = map.get(key);
  if (existing && versionOf !== existing && versionOf !== id) {
    throw new Error(`${label} duplicates ${existing}: ${id}.`);
  }
  if (!existing) map.set(key, id);
}

async function validateAsset(folder, fileName, id, assetHashes) {
  const sourcePath = resolve(folder, fileName);
  const rel = relative(folder, sourcePath);
  if (rel.startsWith(`..${sep}`) || rel === '..' || isAbsolute(rel)) throw new Error(`Asset escapes publication folder: ${id}/${fileName}.`);
  const info = await lstat(sourcePath);
  if (info.isSymbolicLink() || !info.isFile()) throw new Error(`Asset must be a regular file: ${id}/${fileName}.`);
  if (info.size < 1 || info.size > MAX_ASSET_BYTES) throw new Error(`Asset size is invalid: ${id}/${fileName}.`);
  const hash = await sha256(sourcePath);
  const prior = assetHashes.get(hash);
  if (prior) throw new Error(`Duplicate uploaded asset: ${id}/${fileName} matches ${prior}.`);
  assetHashes.set(hash, `${id}/${fileName}`);
  return sourcePath;
}

export async function compileCatalog({ projectRoot = DEFAULT_ROOT, write = true } = {}) {
  const root = resolve(projectRoot);
  const dataDir = join(root, 'data');
  const contentRoot = join(root, 'content', 'publications');
  const generatedAssets = join(root, 'public', 'uploads-generated');
  const [basePublications, baseProjects, scholar] = await Promise.all([
    readJson(join(dataDir, 'publications.json')),
    readJson(join(dataDir, 'projects.json')),
    readJson(join(dataDir, 'scholar.json')),
  ]);

  const ids = new Set();
  const dois = new Map();
  const titles = new Map();
  const scholarIds = new Map();
  const ignoredScholarIds = new Set(scholar.ignoredScholarIds ?? []);
  const assetHashes = new Map();

  for (const publication of basePublications) {
    const id = requireString(publication.id, 'Base publication id');
    if (ids.has(id)) throw new Error(`Duplicate base publication id: ${id}.`);
    ids.add(id);
    addUnique(dois, doiFromLinks(publication.links), id, 'Base DOI');
    addUnique(titles, normalizedTitle(publication.title), id, 'Base title');
  }
  for (const [publicationId, work] of Object.entries(scholar.works ?? {})) {
    addUnique(scholarIds, work.scholarId, publicationId, 'Scholar id');
  }

  let entries = [];
  try {
    entries = await readdir(contentRoot, { withFileTypes: true });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  const uploadedPublications = [];
  const uploadedProjects = [];
  const copyQueue = [];

  for (const entry of entries.filter((item) => item.isDirectory() && !item.name.startsWith('_')).sort((a, b) => a.name.localeCompare(b.name))) {
    const folder = join(contentRoot, entry.name);
    const manifestPath = join(folder, 'publication.json');
    const manifestInfo = await lstat(manifestPath);
    if (manifestInfo.isSymbolicLink() || !manifestInfo.isFile()) throw new Error(`publication.json must be a regular file: ${entry.name}.`);
    const manifest = await readJson(manifestPath);
    const id = requireString(manifest.id, `${entry.name}.id`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) || id !== entry.name) throw new Error(`Folder and slug id must match: ${entry.name}.`);
    if (manifest.status !== 'published') throw new Error(`${id} is not marked published.`);
    if (manifest.rightsConfirmed !== true) throw new Error(`${id} requires rightsConfirmed: true.`);
    if (ids.has(id)) throw new Error(`Duplicate publication id: ${id}.`);
    ids.add(id);

    const kind = requireString(manifest.kind, `${id}.kind`);
    if (!ALLOWED_KINDS.has(kind)) throw new Error(`${id}.kind is invalid.`);
    const publishedAt = requireString(manifest.publishedAt, `${id}.publishedAt`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt) || Number.isNaN(Date.parse(`${publishedAt}T00:00:00Z`))) {
      throw new Error(`${id}.publishedAt must be YYYY-MM-DD.`);
    }
    const year = Number(publishedAt.slice(0, 4));
    const title = requireString(manifest.title, `${id}.title`);
    const authors = requireString(manifest.authors, `${id}.authors`);
    const venue = requireString(manifest.venue, `${id}.venue`);
    const topic = requireLocalized(manifest.topic, `${id}.topic`);
    const projectTitle = requireLocalized(manifest.projectTitle, `${id}.projectTitle`);
    const summary = requireLocalized(manifest.summary, `${id}.summary`);
    const projectKind = requireLocalized(manifest.projectKind ?? 'Publication', `${id}.projectKind`);
    const versionOf = typeof manifest.versionOf === 'string' ? manifest.versionOf : '';
    if (versionOf && !ids.has(versionOf)) throw new Error(`${id}.versionOf does not reference an earlier publication.`);

    const doi = normalizedDoi(requireString(manifest.doi, `${id}.doi`));
    if (!/^10\.\d{4,9}\/.+/.test(doi)) throw new Error(`${id}.doi is invalid.`);
    addUnique(dois, doi, id, 'DOI', versionOf);
    addUnique(titles, normalizedTitle(title), id, 'Title', versionOf);

    const scholarId = manifest.scholarId ? requireString(manifest.scholarId, `${id}.scholarId`) : '';
    if (ignoredScholarIds.has(scholarId)) throw new Error(`${id}.scholarId is currently ignored.`);
    addUnique(scholarIds, scholarId, id, 'Scholar id', versionOf);

    const links = Array.isArray(manifest.links) ? manifest.links.map((link, index) => ({
      label: requireLocalized(link.label, `${id}.links[${index}].label`),
      href: requireHttps(link.href, `${id}.links[${index}].href`),
    })) : [];
    const doiUrl = `https://doi.org/${doi}`;
    if (!links.some((link) => normalizedDoi(link.href) === doi)) {
      links.unshift({ label: { en: 'Published article', zh: 'Published article' }, href: doiUrl });
    }

    const files = Array.isArray(manifest.files) ? manifest.files.map((value, index) => safeRelativeAsset(value, `${id}.files[${index}]`)) : [];
    const figures = Array.isArray(manifest.figures) ? manifest.figures.map((value, index) => safeRelativeAsset(value, `${id}.figures[${index}]`)) : [];
    const uniqueAssets = [...new Set([...files, ...figures])];
    for (const fileName of uniqueAssets) {
      const sourcePath = await validateAsset(folder, fileName, id, assetHashes);
      copyQueue.push({ sourcePath, destination: join(generatedAssets, id, fileName) });
    }
    for (const fileName of files.filter((name) => extname(name).toLowerCase() === '.pdf')) {
      links.push({ label: { en: 'Full text', zh: 'Full text' }, href: `/uploads-generated/${id}/${encodeURIComponent(fileName)}` });
    }

    const figure = figures[0] ? `/uploads-generated/${id}/${encodeURIComponent(figures[0])}` : undefined;
    const imageAlt = figure ? requireLocalized(manifest.imageAlt, `${id}.imageAlt`) : undefined;
    uploadedPublications.push({ id, kind, year, title, authors, venue, topic, links, ...(scholarId ? { scholarId } : {}) });
    uploadedProjects.push({
      id: `publication-${id}`,
      year,
      kind: projectKind,
      title: projectTitle,
      summary,
      tags: topic,
      ...(figure ? { image: figure, imageAlt } : {}),
      publicationIds: [id],
      links,
    });
  }

  const publications = [...basePublications, ...uploadedPublications]
    .sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));
  const projects = [...baseProjects, ...uploadedProjects]
    .sort((a, b) => b.year - a.year || a.id.localeCompare(b.id));

  const publicationIds = new Set(publications.map((publication) => publication.id));
  for (const project of projects) {
    for (const publicationId of project.publicationIds ?? []) {
      if (!publicationIds.has(publicationId)) throw new Error(`Project ${project.id} references missing publication ${publicationId}.`);
    }
  }

  if (write) {
    const safeAssets = resolve(generatedAssets);
    const publicRoot = `${resolve(root, 'public')}${sep}`;
    if (!`${safeAssets}${sep}`.startsWith(publicRoot)) throw new Error('Generated asset directory escaped public/.');
    await rm(safeAssets, { recursive: true, force: true });
    for (const item of copyQueue) {
      await mkdir(dirname(item.destination), { recursive: true });
      await cp(item.sourcePath, item.destination, { force: true });
    }
    await Promise.all([
      writeFile(join(dataDir, 'publications.generated.json'), `${JSON.stringify(publications, null, 2)}\n`, 'utf8'),
      writeFile(join(dataDir, 'projects.generated.json'), `${JSON.stringify(projects, null, 2)}\n`, 'utf8'),
    ]);
  }

  return { publications, projects, uploads: uploadedPublications.length };
}

async function main() {
  const result = await compileCatalog({ write: !process.argv.includes('--check') });
  process.stdout.write(`Content ${process.argv.includes('--check') ? 'check' : 'build'} passed: ${result.publications.length} publications, ${result.projects.length} projects, ${result.uploads} uploaded publication folders.\n`);
}

const entryPoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === entryPoint) {
  main().catch((error) => {
    process.stderr.write(`Content build failed: ${error.message}\n`);
    process.exitCode = 1;
  });
}
