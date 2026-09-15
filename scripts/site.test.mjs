import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('the English root renders the shared data-driven homepage', async () => {
  const [page, sharedHome, githubMain, scholarHook] = await Promise.all([
    read('app/page.tsx'),
    read('app/home.tsx'),
    read('github/main.tsx'),
    read('app/use-scholar.ts'),
  ]);

  assert.match(page, /<Home \/>/);
  assert.match(githubMain, /<Home \/>/);
  assert.match(scholarHook, /scholarData from '\.\.\/data\/scholar\.json'/);
  assert.match(sharedHome, /publicationData from '\.\.\/data\/publications\.generated\.json'/);
  assert.match(sharedHome, /projectData from '\.\.\/data\/projects\.generated\.json'/);
  assert.match(sharedHome, /aria-pressed=\{filter === option\}/);
});

test('the published site exposes only the English interface', async () => {
  const [html, viteConfig, layout, sharedHome] = await Promise.all([
    read('github/index.html'),
    read('vite.github.config.ts'),
    read('app/layout.tsx'),
    read('app/home.tsx'),
  ]);

  assert.match(html, /<html lang="en">/);
  assert.match(html, /property="og:locale" content="en_US"/);
  assert.doesNotMatch(html, /\/zh\//);
  assert.doesNotMatch(viteConfig, /github\/zh\/index\.html/);
  assert.doesNotMatch(layout, /'zh-CN'/);
  assert.doesNotMatch(sharedHome, /language-switch|hrefLang="zh-CN"|data-language=/);
});

test('GitHub owns the weekly data refresh and redeployment mechanism', async () => {
  const workflow = await read('.github/workflows/pages.yml');

  assert.match(workflow, /schedule:\s*\n\s*- cron: '17 2 \* \* 1'/);
  assert.match(workflow, /contents: write/);
  assert.match(workflow, /workflow_dispatch'[\s\S]*'windows-latest'[\s\S]*'ubuntu-latest'/);
  assert.match(workflow, /Refresh approved Google Scholar data[\s\S]*npm run refresh:scholar/);
  assert.match(workflow, /id: scholar-sync[\s\S]*continue-on-error: true/);
  assert.match(workflow, /Build static site[\s\S]*Deploy[\s\S]*Persist automatically refreshed data/);
  assert.match(workflow, /Persist automatically refreshed data[\s\S]*git push origin HEAD:main/);
  assert.match(workflow, /Report Scholar refresh status[\s\S]*refresh-scholar\.mjs --report/);
});

test('the removed motion showcase and its GIFs are absent from the interface', async () => {
  const [sharedHome, styles, projectsText] = await Promise.all([
    read('app/home.tsx'),
    read('app/globals.css'),
    read('data/projects.generated.json'),
  ]);

  assert.doesNotMatch(sharedHome, /motionOne|motionTwo|motion-grid|motion-card/);
  assert.doesNotMatch(styles, /\.motion-grid|\.motion-card|\.motion-visual|\.evidence-grid|\.evidence-card/);
  assert.doesNotMatch(projectsText, /twin-rotor\.gif|aero-engine-cutaway\.gif/);
  assert.match(projectsText, /rotor-rfemnn\.png/);
});

test('the source-code section keeps the repositories without the removed promotional copy', async () => {
  const [sharedHome, styles] = await Promise.all([
    read('app/home.tsx'),
    read('app/globals.css'),
  ]);

  assert.match(sharedHome, /Selected source code/);
  assert.match(sharedHome, /codeProjects\.map/);
  assert.doesNotMatch(sharedHome, /Implementations linked to the papers|Four public repositories|04 public repositories|Paper-level links|Documented scope/);
  assert.doesNotMatch(styles, /\.code-facts|\.code-heading h2|\.code-heading > p:not\(\.eyebrow\)/);
});

test('the homepage uses the supplied circular portrait and CityU-inspired warm palette', async () => {
  const [sharedHome, styles] = await Promise.all([
    read('app/home.tsx'),
    read('app/globals.css'),
  ]);

  assert.match(sharedHome, /\/images\/weikun-deng-lanterns\.jpg/);
  assert.doesNotMatch(sharedHome, /\/images\/weikun-deng\.jpg/);
  assert.match(styles, /--deep: #7a1238/);
  assert.match(styles, /--orange: #e83e5f/);
  assert.match(styles, /\.portrait-frame \{[^}]*border-radius: 50%/);
  assert.match(styles, /\.portrait-frame img \{[^}]*object-position: 50% 60%/);
});

test('the published identity is a direct academic homepage without product-style branding', async () => {
  const [layout, githubHtml, sharedHome] = await Promise.all([
    read('app/layout.tsx'),
    read('github/index.html'),
    read('app/home.tsx'),
  ]);
  const publishedIdentity = `${layout}\n${githubHtml}\n${sharedHome}`;

  assert.match(publishedIdentity, /Weikun Deng.*Academic Homepage/);
  assert.match(publishedIdentity, /og\.jpg/);
  assert.doesNotMatch(publishedIdentity, /Engineering Intelligence|Engineering intelligence|grounded in physics|Engineering AI|Built as a lightweight|chatgpt\.site/i);
});

test('year archive and publication catalogue remain complete and deduplicated', async () => {
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
  for (const publication of publications) assert.ok(publication.topic.en);

  assert.ok(projects.length >= 20);
  assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
  assert.deepEqual([...new Set(projects.map((project) => project.year))], [...new Set(projects.map((project) => project.year))].sort((a, b) => b - a));
  for (const project of projects) {
    assert.ok(project.kind.en);
    assert.ok(project.title.en);
    assert.ok(project.summary.en);
    assert.ok(project.tags.en);
  }
  for (const id of ['liquid-kao-maintenance', 'liquid-operator-general-phm', 'satellite-knowledge-distillation']) {
    assert.ok(projects.some((project) => project.id === id), `Missing named project: ${id}`);
  }
  assert.match(sharedHome, /mailto:wekun\.deng@cityu-dg\.edu\.cn/);
});
