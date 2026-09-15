import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { canUseScholarSnapshot } from '../lib/scholar-snapshot.mjs';

const data = JSON.parse(await readFile(new URL('../data/scholar.json', import.meta.url), 'utf8'));
if (!canUseScholarSnapshot(data, data)) throw new Error('Cannot export an invalid Scholar snapshot.');
const { profile, works, refresh } = data;
const directory = new URL('../public/data/', import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(new URL('scholar.json', directory), `${JSON.stringify({ profile, works, ...(refresh ? { refresh } : {}) }, null, 2)}\n`);
console.log(`Public Scholar data: ${profile.synced}, ${profile.citations} citations.`);
