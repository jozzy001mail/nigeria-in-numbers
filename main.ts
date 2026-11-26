// Nigeria in Numbers — hand-in program (main.ts).
// Copies app/ and screenshots/ from this repository into the output
// directory (MAKEFUN_OUTPUT_DIR, or /output) and writes dossier.json
// there via buildDossier from vendor/makefun-frontend.ts.
// Run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Node 22+ erasable TypeScript: no build step, no dependencies.
// The dossier must be byte-for-byte what buildDossier writes from the
// copied app/ and screenshots/ — so this program copies first, then
// builds the dossier from the output directory itself, never from the repo.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

for (const dir of ['app', 'screenshots']) {
  if (!existsSync(join(repoRoot, dir))) throw new Error(`main.ts: missing ${dir}/ in ${repoRoot}`);
}

mkdirSync(outDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

function countEntries(dir) {
  let n = 0;
  for (const name of readdirSync(dir)) {
    n += 1;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) n += countEntries(p);
  }
  return n;
}
const appEntries = countEntries(join(outDir, 'app'));
const shotEntries = countEntries(join(outDir, 'screenshots'));

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);

console.log(`Copied ${appEntries} app entries and ${shotEntries} screenshots to ${outDir}.`);
console.log(`Wrote ${join(outDir, 'dossier.json')} (${dossier.length} bytes).`);
