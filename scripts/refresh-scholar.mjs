import { appendFile, readFile, rename, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { weeklyRefreshDue } from '../lib/scholar-snapshot.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const dataPath = resolve(root, 'data/scholar.json');

export async function refreshScholar({ current, scheduled, run, now = new Date() }) {
  if (scheduled && !weeklyRefreshDue(current, now)) return { snapshot: current, skipped: true, success: true };
  let snapshot = current;
  let success = false;
  try { snapshot = await run(); success = true; }
  catch (error) { console.error(`Scholar verification unavailable: ${error.message}`); }
  return {
    snapshot: { ...snapshot, refresh: { attemptedAt: now.toISOString(), outcome: success ? 'success' : 'unavailable' } },
    skipped: false,
    success,
  };
}

async function report(snapshot) {
  const lines = [
    '### Google Scholar data',
    `Last verified: **${snapshot.profile.synced}** · **${snapshot.profile.citations} citations** · h-index ${snapshot.profile.hIndex} · i10-index ${snapshot.profile.i10Index}.`,
    snapshot.refresh?.outcome === 'unavailable'
      ? 'The latest verification attempt failed. The last verified snapshot is retained. A successful Pages deployment does not mean Scholar data was refreshed.'
      : 'The snapshot has been verified against the public Scholar profile.',
  ];
  console.log(lines.join('\n'));
  if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n\n')}\n`);
}

async function main() {
  const current = JSON.parse(await readFile(dataPath, 'utf8'));
  if (process.argv.includes('--report')) return report(current);
  const result = await refreshScholar({
    current,
    scheduled: process.env.GITHUB_EVENT_NAME === 'schedule',
    run: async () => {
      const child = spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', 'scripts/sync-scholar-local.ps1'], {
        cwd: root, stdio: 'inherit', timeout: 60000, windowsHide: true,
      });
      if (child.error || child.status !== 0) throw new Error('The public Scholar response could not be fetched or validated.');
      return JSON.parse(await readFile(dataPath, 'utf8'));
    },
  });
  if (result.skipped) {
    console.log('This week already has a verified snapshot; no recovery request is needed.');
    return;
  }
  const temporaryPath = `${dataPath}.refresh.tmp`;
  await writeFile(temporaryPath, `${JSON.stringify(result.snapshot, null, 2)}\n`);
  await rename(temporaryPath, dataPath);
  if (!result.success) {
    console.log('::warning::Scholar verification failed; the verification date and metrics are unchanged.');
    process.exitCode = 1;
  }
}

if (import.meta.url === (process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : '')) {
  main().catch((error) => { console.error(error); process.exitCode = 1; });
}
