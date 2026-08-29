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

test('Chinese route keeps localized SEO and all publication records remain single-source', async () => {
  const [chinesePage, sharedHome] = await Promise.all([
    read('app/zh/page.tsx'),
    read('app/home.tsx'),
  ]);

  assert.match(chinesePage, /canonical: '\/zh\/'/);
  assert.match(chinesePage, /card: 'summary_large_image'/);
  assert.match(chinesePage, /images: \['\/og\.jpg'\]/);
  assert.equal((sharedHome.match(/const publications: Publication\[\]/g) ?? []).length, 1);
  assert.match(sharedHome, /aria-pressed=\{filter === option\}/);
  assert.match(sharedHome, /论文题名与期刊名称保留原始出版语言/);
});
