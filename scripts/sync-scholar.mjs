import { readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(SCRIPT_DIR, '../data/scholar.json');
const SCHOLAR_ORIGIN = 'https://scholar.google.com';
const MAX_PROFILE_ROWS = 99;
const BOT_MARKERS = [
  'automated queries',
  'unusual traffic',
  'recaptcha',
  '/sorry/',
  'not a robot',
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeHtml(value) {
  const named = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value.replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi, (entity, code) => {
    if (code[0] !== '#') return named[code.toLowerCase()] ?? entity;
    const radix = code[1].toLowerCase() === 'x' ? 16 : 10;
    const digits = radix === 16 ? code.slice(2) : code.slice(1);
    const point = Number.parseInt(digits, radix);
    return Number.isFinite(point) ? String.fromCodePoint(point) : entity;
  });
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${escapeRegExp(name)}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? decodeHtml(match[2]) : null;
}

function openingTagWithClass(fragment, tagName, className) {
  const tags = fragment.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
  return tags.find((tag) => (getAttribute(tag, 'class') ?? '').split(/\s+/).includes(className)) ?? null;
}

function elementContentWithClass(fragment, tagName, className) {
  const expression = new RegExp(`<${tagName}\\b([^>]*)>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
  for (const match of fragment.matchAll(expression)) {
    const openingTag = `<${tagName}${match[1]}>`;
    if ((getAttribute(openingTag, 'class') ?? '').split(/\s+/).includes(className)) return match[2];
  }
  return null;
}

function scholarUrl(href) {
  const url = new URL(href, SCHOLAR_ORIGIN);
  if (url.protocol !== 'https:' || url.hostname !== 'scholar.google.com') {
    throw new Error(`Unexpected Scholar link host: ${url.hostname}`);
  }
  return url.href;
}

function parseNonNegativeInteger(value, label) {
  const normalized = stripTags(value).replaceAll(',', '');
  if (!/^\d+$/.test(normalized)) throw new Error(`Invalid numeric value for ${label}.`);
  return Number.parseInt(normalized, 10);
}

function parseMetric(table, label) {
  const rows = table.match(/<tr\b[\s\S]*?<\/tr>/gi) ?? [];
  const row = rows.find((candidate) => new RegExp(`>${escapeRegExp(label)}<\\/a>`, 'i').test(candidate));
  if (!row) throw new Error(`Scholar metric is missing: ${label}.`);
  const values = [...row.matchAll(/<td\b[^>]*class="[^"]*\bgsc_rsb_std\b[^"]*"[^>]*>([\s\S]*?)<\/td>/gi)];
  if (values.length < 1) throw new Error(`Scholar metric has no value: ${label}.`);
  return parseNonNegativeInteger(values[0][1], label);
}

export function parseScholarProfile(html, { expectedName, userId }) {
  if (typeof html !== 'string' || html.length < 10_000 || html.length > 2_000_000) {
    throw new Error('Scholar returned an implausible response size.');
  }

  const lowered = html.toLowerCase();
  if (BOT_MARKERS.some((marker) => lowered.includes(marker))) {
    throw new Error('Scholar returned a traffic-check page instead of the public profile.');
  }
  if (!decodeHtml(html).includes(expectedName)) throw new Error('The expected Scholar profile name was not found.');

  const tableMatch = html.match(/<table\b[^>]*id="gsc_rsb_st"[^>]*>[\s\S]*?<\/table>/i);
  if (!tableMatch) throw new Error('The Scholar metrics table was not found.');

  const metrics = {
    citations: parseMetric(tableMatch[0], 'Citations'),
    hIndex: parseMetric(tableMatch[0], 'h-index'),
    i10Index: parseMetric(tableMatch[0], 'i10-index'),
  };

  const rowExpression = /<tr\b[^>]*class="[^"]*\bgsc_a_tr\b[^"]*"[^>]*>([\s\S]*?)<\/tr>/gi;
  const records = [];
  const seenScholarIds = new Set();

  for (const rowMatch of html.matchAll(rowExpression)) {
    const row = rowMatch[1];
    const titleTag = openingTagWithClass(row, 'a', 'gsc_a_at');
    const titleHref = titleTag ? getAttribute(titleTag, 'href') : null;
    if (!titleHref) throw new Error('A Scholar publication row is missing its record link.');

    const recordUrl = scholarUrl(titleHref);
    const recordId = new URL(recordUrl).searchParams.get('citation_for_view');
    const prefix = `${userId}:`;
    if (!recordId?.startsWith(prefix)) throw new Error('A Scholar publication row belongs to a different profile.');
    const scholarId = recordId.slice(prefix.length);
    if (!scholarId || seenScholarIds.has(scholarId)) throw new Error(`Duplicate or empty Scholar record id: ${scholarId || '(empty)'}.`);
    seenScholarIds.add(scholarId);

    const citationCell = elementContentWithClass(row, 'td', 'gsc_a_c');
    if (citationCell === null) throw new Error(`Scholar citation cell is missing for ${scholarId}.`);
    const citationTag = openingTagWithClass(citationCell, 'a', 'gsc_a_ac');
    const citationText = citationTag
      ? citationCell.slice(citationCell.indexOf(citationTag) + citationTag.length).split('</a>', 1)[0]
      : '';
    const citations = stripTags(citationText) ? parseNonNegativeInteger(citationText, `citations for ${scholarId}`) : 0;
    const citationHref = citationTag ? getAttribute(citationTag, 'href') : null;
    if (citations > 0 && !citationHref) throw new Error(`A cited Scholar record has no citation link: ${scholarId}.`);

    records.push({
      scholarId,
      citations,
      href: citations > 0 ? scholarUrl(citationHref) : recordUrl,
    });
  }

  if (records.length < 1 || records.length > MAX_PROFILE_ROWS) {
    throw new Error(`Scholar returned ${records.length} publication rows; expected between 1 and ${MAX_PROFILE_ROWS}.`);
  }
  if (metrics.citations < Math.max(...records.map((record) => record.citations))) {
    throw new Error('Scholar total citations are lower than an individual publication count.');
  }

  return { metrics, records };
}

function syncLabel(now) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Shanghai',
  }).formatToParts(now);
  const value = (type) => Number.parseInt(parts.find((part) => part.type === type)?.value ?? '', 10);
  const day = value('day');
  const month = value('month');
  const year = value('year');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (!day || !months[month - 1] || !year) throw new Error('Could not format the Scholar sync date.');
  return `${day} ${months[month - 1]} ${year}`;
}

export function buildSnapshot(current, parsed, now = new Date()) {
  const approvedEntries = Object.entries(current.works);
  const approvedIds = new Set(approvedEntries.map(([, work]) => work.scholarId));
  const ignoredIds = new Set(current.ignoredScholarIds ?? []);

  if (approvedIds.size !== approvedEntries.length) throw new Error('The approved Scholar allowlist contains duplicate ids.');
  for (const ignoredId of ignoredIds) {
    if (approvedIds.has(ignoredId)) throw new Error(`Scholar id is both approved and ignored: ${ignoredId}.`);
  }

  const parsedById = new Map(parsed.records.map((record) => [record.scholarId, record]));
  const unknownIds = parsed.records
    .map((record) => record.scholarId)
    .filter((scholarId) => !approvedIds.has(scholarId) && !ignoredIds.has(scholarId));
  if (unknownIds.length > 0) throw new Error(`Unreviewed Scholar records found: ${unknownIds.join(', ')}.`);

  const missingIds = [...approvedIds, ...ignoredIds].filter((scholarId) => !parsedById.has(scholarId));
  if (missingIds.length > 0) throw new Error(`Expected Scholar records are missing: ${missingIds.join(', ')}.`);

  const works = Object.fromEntries(approvedEntries.map(([publicationId, work]) => {
    const record = parsedById.get(work.scholarId);
    return [publicationId, { ...work, citations: record.citations, href: record.href }];
  }));
  const approvedCitationSum = Object.values(works).reduce((sum, work) => sum + work.citations, 0);
  if (approvedCitationSum > parsed.metrics.citations) {
    throw new Error('Approved publication citations exceed the Scholar profile total.');
  }

  return {
    ...current,
    profile: {
      ...current.profile,
      synced: syncLabel(now),
      citations: parsed.metrics.citations,
      hIndex: parsed.metrics.hIndex,
      i10Index: parsed.metrics.i10Index,
      distinctOutputs: approvedEntries.length,
    },
    works,
  };
}

async function fetchScholarProfile(profile) {
  const url = new URL('/citations', SCHOLAR_ORIGIN);
  url.searchParams.set('user', profile.userId);
  url.searchParams.set('hl', 'en');
  url.searchParams.set('pagesize', '100');
  url.searchParams.set('sortby', 'pubdate');

  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (compatible; pimlphm-scholar-sync/1.0; +https://github.com/pimlphm/pimlphm.github.io)',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) throw new Error(`Scholar request failed with HTTP ${response.status}.`);
  if (!response.headers.get('content-type')?.toLowerCase().includes('text/html')) {
    throw new Error('Scholar returned a non-HTML response.');
  }
  if (new URL(response.url).hostname !== 'scholar.google.com') {
    throw new Error('Scholar redirected the request away from the public profile.');
  }
  return response.text();
}

async function readStandardInput() {
  process.stdin.setEncoding('utf8');
  let html = '';
  for await (const chunk of process.stdin) html += chunk;
  return html;
}

async function main() {
  const checkOnly = process.argv.includes('--check');
  const current = JSON.parse(await readFile(DATA_PATH, 'utf8'));
  const html = process.argv.includes('--stdin')
    ? await readStandardInput()
    : await fetchScholarProfile(current.profile);
  const parsed = parseScholarProfile(html, current.profile);
  const next = buildSnapshot(current, parsed);

  if (!checkOnly) {
    const temporaryPath = `${DATA_PATH}.${process.pid}.tmp`;
    await writeFile(temporaryPath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
    await rename(temporaryPath, DATA_PATH);
  }

  process.stdout.write(
    `Scholar ${checkOnly ? 'check' : 'sync'} passed: ${next.profile.citations} citations, h-index ${next.profile.hIndex}, i10-index ${next.profile.i10Index}, ${next.profile.distinctOutputs} approved outputs.\n`,
  );
}

const entryPoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '';
if (import.meta.url === entryPoint) {
  main().catch((error) => {
    const cause = error.cause?.code ? ` (${error.cause.code})` : '';
    process.stderr.write(`Scholar sync failed: ${error.message}${cause}\n`);
    process.exitCode = 1;
  });
}
