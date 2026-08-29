import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { compileCatalog } from './compile-content.mjs';

const basePublication = {
  id: 'base-paper',
  kind: 'Journal',
  year: 2025,
  title: 'A verified base paper',
  authors: 'Weikun Deng',
  venue: 'Verified Journal',
  topic: { en: 'Base topic', zh: '基础主题' },
  links: [{ label: 'Publisher', href: 'https://doi.org/10.1234/base.1' }],
};

const validManifest = {
  id: '2026-new-paper',
  status: 'published',
  kind: 'Journal',
  publishedAt: '2026-03-01',
  title: 'A newly published paper',
  authors: 'Weikun Deng, Coauthor',
  venue: 'Verified Journal 2',
  doi: '10.1234/new.2',
  topic: { en: 'New topic', zh: '新主题' },
  projectKind: { en: 'Research project', zh: '研究项目' },
  projectTitle: { en: 'New project', zh: '新项目' },
  summary: { en: 'Verified published result.', zh: '经验证的已发表结果。' },
  imageAlt: { en: 'Result figure', zh: '结果图' },
  files: ['paper.pdf'],
  figures: ['figure.png'],
  links: [{ label: { en: 'Article', zh: '论文' }, href: 'https://doi.org/10.1234/new.2' }],
  rightsConfirmed: true,
};

async function createFixture(manifest = validManifest) {
  const root = await mkdtemp(join(tmpdir(), 'portfolio-content-'));
  await mkdir(join(root, 'data'), { recursive: true });
  await mkdir(join(root, 'content', 'publications', manifest.id), { recursive: true });
  await mkdir(join(root, 'public'), { recursive: true });
  await Promise.all([
    writeFile(join(root, 'data', 'publications.json'), JSON.stringify([basePublication]), 'utf8'),
    writeFile(join(root, 'data', 'projects.json'), JSON.stringify([{ id: 'base-project', year: 2025, publicationIds: ['base-paper'] }]), 'utf8'),
    writeFile(join(root, 'data', 'scholar.json'), JSON.stringify({ ignoredScholarIds: [], works: {} }), 'utf8'),
    writeFile(join(root, 'content', 'publications', manifest.id, 'publication.json'), JSON.stringify(manifest), 'utf8'),
    writeFile(join(root, 'content', 'publications', manifest.id, 'paper.pdf'), Buffer.from('%PDF-1.7 test paper')),
    writeFile(join(root, 'content', 'publications', manifest.id, 'figure.png'), Buffer.from('PNG test figure')),
  ]);
  return root;
}

test('a complete published upload extends both catalogues', async () => {
  const root = await createFixture();
  try {
    const result = await compileCatalog({ projectRoot: root, write: false });
    assert.equal(result.uploads, 1);
    assert.equal(result.publications.length, 2);
    assert.equal(result.projects.length, 2);
    assert.equal(result.projects[0].title.zh, '新项目');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('duplicate DOI is rejected before publication', async () => {
  const manifest = structuredClone(validManifest);
  manifest.doi = '10.1234/base.1';
  manifest.links[0].href = 'https://doi.org/10.1234/base.1';
  const root = await createFixture(manifest);
  try {
    await assert.rejects(() => compileCatalog({ projectRoot: root, write: false }), /DOI duplicates base-paper/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('anything not marked published is rejected', async () => {
  const manifest = structuredClone(validManifest);
  manifest.status = 'draft';
  const root = await createFixture(manifest);
  try {
    await assert.rejects(() => compileCatalog({ projectRoot: root, write: false }), /not marked published/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('asset traversal is rejected', async () => {
  const manifest = structuredClone(validManifest);
  manifest.files = ['../paper.pdf'];
  const root = await createFixture(manifest);
  try {
    await assert.rejects(() => compileCatalog({ projectRoot: root, write: false }), /must be a file name/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
