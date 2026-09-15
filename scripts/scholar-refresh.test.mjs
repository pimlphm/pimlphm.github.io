import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { canUseScholarSnapshot, weeklyRefreshDue, snapshotTime } from '../lib/scholar-snapshot.mjs';
import { refreshScholar } from './refresh-scholar.mjs';

const fixture = JSON.parse(await readFile(new URL('../data/scholar.json', import.meta.url), 'utf8'));
function snapshot(synced = '7 Sep 2026') {
  const result = structuredClone(fixture);
  result.profile.synced = synced;
  delete result.refresh;
  return result;
}

test('a cached page accepts newer verified data and rejects older, invalid or unrelated data', () => {
  const current = snapshot();
  const latest = snapshot('14 Sep 2026');
  assert.equal(canUseScholarSnapshot(latest, current), true);
  assert.equal(canUseScholarSnapshot(current, latest), false);
  for (const edit of [
    (value) => { value.profile.citations = -1; },
    (value) => { value.profile.userId = 'another-profile'; },
    (value) => { value.profile.synced = '31 Sep 2026'; },
    (value) => { value.profile.distinctOutputs += 1; },
    (value) => { value.works.j1.href = 'javascript:alert(1)'; },
  ]) {
    const invalid = snapshot('14 Sep 2026');
    edit(invalid);
    assert.equal(canUseScholarSnapshot(invalid, current), false);
  }
  assert.equal(canUseScholarSnapshot(null, current), false);
});

test('failed verification preserves metrics and the verification date while recording the attempt', async () => {
  const current = snapshot();
  const original = structuredClone(current);
  const result = await refreshScholar({ current, scheduled: false, now: new Date('2026-09-15T06:47:00Z'), run: async () => { throw new Error('HTTP 429'); } });
  assert.equal(result.success, false);
  assert.deepEqual(result.snapshot.profile, original.profile);
  assert.deepEqual(result.snapshot.works, original.works);
  assert.deepEqual(current, original);
  assert.deepEqual(result.snapshot.refresh, { attemptedAt: '2026-09-15T06:47:00.000Z', outcome: 'unavailable' });
  assert.equal(canUseScholarSnapshot(result.snapshot, current), true);
  assert.equal(canUseScholarSnapshot(current, result.snapshot), false);
});

test('a failed Monday sync is retried, then later recovery runs skip an already verified week', async () => {
  const current = snapshot();
  const monday = new Date('2026-09-14T02:17:00Z');
  const tuesday = new Date('2026-09-15T06:47:00Z');
  assert.equal(weeklyRefreshDue(current, monday), true);
  const mondayResult = await refreshScholar({ current, scheduled: true, now: monday, run: async () => { throw new Error('HTTP 429'); } });
  let requests = 0;
  const tuesdayResult = await refreshScholar({ current: mondayResult.snapshot, scheduled: true, now: tuesday, run: async () => { requests++; return snapshot('15 Sep 2026'); } });
  assert.equal(tuesdayResult.success, true);
  assert.equal(tuesdayResult.snapshot.refresh.outcome, 'success');
  assert.equal(tuesdayResult.snapshot.profile.synced, '15 Sep 2026');
  const wednesdayResult = await refreshScholar({ current: tuesdayResult.snapshot, scheduled: true, now: new Date('2026-09-16T06:47:00Z'), run: async () => { requests++; return snapshot('16 Sep 2026'); } });
  assert.equal(wednesdayResult.skipped, true);
  assert.equal(requests, 1);
  assert.equal(weeklyRefreshDue(tuesdayResult.snapshot, new Date('2026-09-21T02:17:00Z')), true);
});

test('weekly eligibility uses the Monday boundary in China, including year changes', () => {
  const current = snapshot('28 Dec 2026');
  assert.equal(weeklyRefreshDue(current, new Date('2027-01-03T15:59:59Z')), false);
  assert.equal(weeklyRefreshDue(current, new Date('2027-01-03T16:00:00Z')), true);
  assert.ok(Number.isNaN(snapshotTime('29 Feb 2027')));
});
