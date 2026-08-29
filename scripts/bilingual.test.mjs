import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('English and Chinese routes render the same shared homepage component', async () => {
  const [englishPage, chinesePage, sharedHome, githubMain] = await Promise.all([
    read('app/page.tsx'),
    read('app/zh/page.tsx'),
    read('app/home.tsx'),
    read('github/main.tsx'),
  ]);

  assert.match(englishPage, /<Home language="en" \/>/);
  assert.match(chinesePage, /<Home language="zh" \/>/);
  assert.match(sharedHome, /scholarData from '\.\.\/data\/scholar\.json'/);
  assert.match(sharedHome, /publicationData from '\.\.\/data\/publications\.generated\.json'/);
  assert.match(sharedHome, /projectData from '\.\.\/data\/projects\.generated\.json'/);
  assert.match(sharedHome, /href=\{`\/zh\/\$\{sectionHash\}`\}/);
  assert.match(githubMain, /document\.documentElement\.lang/);
});

test('static entries publish localized metadata and reciprocal language links', async () => {
  const [englishHtml, chineseHtml, viteConfig] = await Promise.all([
    read('github/index.html'),
    read('github/zh/index.html'),
    read('vite.github.config.ts'),
  ]);

  assert.match(englishHtml, /<html lang="en">/);
  assert.match(chineseHtml, /<html lang="zh-CN">/);
  assert.match(englishHtml, /hreflang="zh-CN" href="https:\/\/pimlphm\.github\.io\/zh\/"/);
  assert.match(chineseHtml, /hreflang="en" href="https:\/\/pimlphm\.github\.io\/"/);
  assert.match(englishHtml, /property="og:locale" content="en_US"/);
  assert.match(chineseHtml, /property="og:locale" content="zh_CN"/);
  assert.match(viteConfig, /github\/zh\/index\.html/);
});

test('Chinese route keeps localized SEO and both catalogues remain single-source', async () => {
  const [chinesePage, sharedHome] = await Promise.all([
    read('app/zh/page.tsx'),
    read('app/home.tsx'),
  ]);

  assert.match(chinesePage, /canonical: '\/zh\/'/);
  assert.match(chinesePage, /card: 'summary_large_image'/);
  assert.match(chinesePage, /images: \['\/og\.jpg'\]/);
  assert.doesNotMatch(sharedHome, /const publications: Publication\[\]/);
  assert.match(sharedHome, /const publications = publicationData as Publication\[\]/);
  assert.match(sharedHome, /const researchProjects = projectData as ResearchProject\[\]/);
  assert.match(sharedHome, /aria-pressed=\{filter === option\}/);
  assert.match(sharedHome, /论文题名与期刊名称保留原始出版语言/);
});

test('year archive and publication catalogue contain complete bilingual records', async () => {
  const [publicationsText, projectsText, sharedHome] = await Promise.all([
    read('data/publications.generated.json'),
    read('data/projects.generated.json'),
    read('app/home.tsx'),
  ]);
  const publications = JSON.parse(publicationsText);
  const projects = JSON.parse(projectsText);

  assert.ok(publications.length >= 19);
  for (const id of ['j11', 'j8', 'j7', 'j9', 'j6', 'j4', 'j5', 'j3', 'j2', 'j1', 'j10', 'c7', 'c6', 'c5', 'c4', 'c3', 'c2', 'c1', 'thesis']) {
    assert.ok(publications.some((publication) => publication.id === id), `Missing established publication: ${id}`);
  }
  assert.equal(new Set(publications.map((publication) => publication.id)).size, publications.length);
  for (const publication of publications) {
    assert.ok(publication.topic.en);
    assert.ok(publication.topic.zh);
  }

  assert.ok(projects.length >= 20);
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
  assert.deepEqual([...new Set(projects.map((project) => project.year))], [...new Set(projects.map((project) => project.year))].sort((a, b) => b - a));
  for (const project of projects) {
    assert.ok(project.kind.en && project.kind.zh);
    assert.ok(project.title.en && project.title.zh);
    assert.ok(project.summary.en && project.summary.zh);
    assert.ok(project.tags.en && project.tags.zh);
  }
  for (const id of ['liquid-kao-maintenance', 'liquid-operator-general-phm', 'satellite-knowledge-distillation']) {
    assert.ok(projects.some((project) => project.id === id), `Missing named project: ${id}`);
  }
  assert.match(sharedHome, /mailto:wekun\.deng@cityu-dg\.edu\.cn/);
});
