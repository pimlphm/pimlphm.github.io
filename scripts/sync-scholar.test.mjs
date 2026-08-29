import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSnapshot, parseScholarProfile } from './sync-scholar.mjs';

function publicationRow(id, citations = 0) {
  const citeLink = citations > 0
    ? `<a href="https://scholar.google.com/scholar?oi=bibs&amp;hl=en&amp;cites=${id}" class="gsc_a_ac gs_ibl">${citations}</a>`
    : '<a href="" class="gsc_a_ac gs_ibl"></a>';
  return `<tr class="gsc_a_tr"><td class="gsc_a_t"><a href="/citations?view_op=view_citation&amp;hl=en&amp;user=test-user&amp;citation_for_view=test-user:${id}" class="gsc_a_at">Approved output</a></td><td class="gsc_a_c">${citeLink}</td><td class="gsc_a_y">2026</td></tr>`;
}

function profileHtml(rows, citations = 9) {
  return `<!doctype html><html><body><h1>Weikun DENG</h1>
    <table id="gsc_rsb_st"><tbody>
      <tr><td><a>Citations</a></td><td class="gsc_rsb_std">${citations}</td><td class="gsc_rsb_std">${citations}</td></tr>
      <tr><td><a>h-index</a></td><td class="gsc_rsb_std">3</td><td class="gsc_rsb_std">3</td></tr>
      <tr><td><a>i10-index</a></td><td class="gsc_rsb_std">1</td><td class="gsc_rsb_std">1</td></tr>
    </tbody></table>
    <table><tbody>${rows}</tbody></table>${' '.repeat(10_000)}</body></html>`;
}

test('parses profile metrics, zero citations and cited-by links', () => {
  const parsed = parseScholarProfile(
    profileHtml(`${publicationRow('alpha', 9)}${publicationRow('ignored')}`),
    { expectedName: 'Weikun DENG', userId: 'test-user' },
  );

  assert.deepEqual(parsed.metrics, { citations: 9, hIndex: 3, i10Index: 1 });
  assert.equal(parsed.records.length, 2);
  assert.equal(parsed.records[0].scholarId, 'alpha');
  assert.equal(parsed.records[0].citations, 9);
  assert.equal(parsed.records[0].href, 'https://scholar.google.com/scholar?oi=bibs&hl=en&cites=alpha');
  assert.equal(parsed.records[1].citations, 0);
  assert.match(parsed.records[1].href, /citation_for_view=test-user:ignored/);
});

test('updates only approved records and keeps ignored records unpublished', () => {
  const current = {
    profile: {
      userId: 'test-user', expectedName: 'Weikun DENG', href: 'https://scholar.google.com/',
      synced: '1 Jan 2026', citations: 1, hIndex: 1, i10Index: 0, distinctOutputs: 1,
    },
    ignoredScholarIds: ['ignored'],
    works: {
      paper: { scholarId: 'alpha', citations: 1, href: 'https://scholar.google.com/' },
    },
  };
  const parsed = parseScholarProfile(
    profileHtml(`${publicationRow('alpha', 9)}${publicationRow('ignored')}`),
    { expectedName: 'Weikun DENG', userId: 'test-user' },
  );

  const next = buildSnapshot(current, parsed, new Date('2026-09-07T02:17:00Z'));
  assert.equal(next.profile.synced, '7 Sep 2026');
  assert.equal(next.profile.citations, 9);
  assert.equal(next.profile.distinctOutputs, 1);
  assert.equal(next.works.paper.citations, 9);
  assert.deepEqual(next.ignoredScholarIds, ['ignored']);
});

test('fails closed when an unreviewed Scholar record appears', () => {
  const current = {
    profile: { userId: 'test-user', expectedName: 'Weikun DENG' },
    ignoredScholarIds: [],
    works: { paper: { scholarId: 'alpha', citations: 0, href: '' } },
  };
  const parsed = parseScholarProfile(
    profileHtml(`${publicationRow('alpha', 9)}${publicationRow('new-record')}`, 9),
    { expectedName: 'Weikun DENG', userId: 'test-user' },
  );

  assert.throws(() => buildSnapshot(current, parsed), /Unreviewed Scholar records found/);
});

test('a publication upload can explicitly approve its Scholar record', () => {
  const current = {
    profile: { userId: 'test-user', expectedName: 'Weikun DENG', distinctOutputs: 1 },
    ignoredScholarIds: [],
    works: { paper: { scholarId: 'alpha', citations: 0, href: '' } },
  };
  const parsed = parseScholarProfile(
    profileHtml(`${publicationRow('alpha', 9)}${publicationRow('new-record')}`, 9),
    { expectedName: 'Weikun DENG', userId: 'test-user' },
  );

  const next = buildSnapshot(current, parsed, new Date('2026-09-07T02:17:00Z'), [
    { id: 'new-paper', scholarId: 'new-record' },
  ]);
  assert.equal(next.profile.distinctOutputs, 2);
  assert.equal(next.works['new-paper'].scholarId, 'new-record');
  assert.equal(next.works['new-paper'].citations, 0);
});

test('rejects traffic-check pages before parsing', () => {
  const blocked = `<html><body>Weikun DENG unusual traffic${' '.repeat(10_000)}</body></html>`;
  assert.throws(
    () => parseScholarProfile(blocked, { expectedName: 'Weikun DENG', userId: 'test-user' }),
    /traffic-check page/,
  );
});
