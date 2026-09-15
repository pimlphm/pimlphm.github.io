/** @param {string} label */
export function snapshotTime(label) {
  const match = /^(\d{1,2}) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})$/.exec(label ?? '');
  if (!match) return NaN;
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(match[2]);
  const date = new Date(Date.UTC(Number(match[3]), month, Number(match[1])));
  return date.getUTCDate() === Number(match[1]) && date.getUTCMonth() === month ? date.getTime() : NaN;
}

function scholarLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'scholar.google.com';
  } catch { return false; }
}

const count = (value) => Number.isSafeInteger(value) && value >= 0;

// A cached page may receive a newer data file. Validate that file before using it.
export function canUseScholarSnapshot(candidate, current) {
  const profile = candidate?.profile;
  if (!profile || profile.userId !== current.profile.userId || !scholarLink(profile.href)) return false;
  if (!['citations', 'hIndex', 'i10Index', 'distinctOutputs'].every((key) => count(profile[key]))) return false;
  const nextTime = snapshotTime(profile.synced);
  if (!Number.isFinite(nextTime) || nextTime < snapshotTime(current.profile.synced)) return false;
  if (!candidate.works || Array.isArray(candidate.works) || typeof candidate.works !== 'object') return false;
  const works = Object.values(candidate.works);
  if (!works.length || works.length !== profile.distinctOutputs) return false;
  if (!works.every((work) => work && count(work.citations) && scholarLink(work.href))) return false;
  if (works.reduce((sum, work) => sum + work.citations, 0) > profile.citations) return false;
  if (candidate.refresh && (!['success', 'unavailable'].includes(candidate.refresh.outcome) || !Number.isFinite(Date.parse(candidate.refresh.attemptedAt)))) return false;
  if (nextTime === snapshotTime(current.profile.synced) && current.refresh &&
      (Date.parse(candidate.refresh?.attemptedAt ?? '') || 0) < Date.parse(current.refresh.attemptedAt)) return false;
  return true;
}

// Recovery runs on Tuesday/Wednesday should stop once this week's data is verified.
export function weeklyRefreshDue(snapshot, now = new Date()) {
  const china = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const today = Date.UTC(china.getUTCFullYear(), china.getUTCMonth(), china.getUTCDate());
  const monday = today - ((china.getUTCDay() + 6) % 7) * 24 * 60 * 60 * 1000;
  return !Number.isFinite(snapshotTime(snapshot.profile.synced)) || snapshotTime(snapshot.profile.synced) < monday;
}
