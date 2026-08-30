import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import {resolve, sep} from 'node:path';

const workspace = resolve('.');
const output = resolve('dist');
if (!output.startsWith(workspace + sep) || output === workspace) throw new Error('Invalid build directory');
rmSync(output, { recursive: true, force: true });
mkdirSync('dist/client', { recursive: true });
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/client/assets', { recursive: true });

for (const source of ['index.html', 'styles.css', 'theme.css', 'script.js']) {
  cpSync(source, `dist/client/${source}`);
}

cpSync('assets/media', 'dist/client/assets/media', {recursive: true});

writeFileSync('dist/server/index.js', `export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
`);

writeFileSync('dist/server/wrangler.json', JSON.stringify({
  name: 'reinaldo-quoos-gourmet-at-home',
  main: 'index.js',
  compatibility_date: '2026-08-27',
  assets: {
    directory: '../client',
    binding: 'ASSETS',
    not_found_handling: 'single-page-application'
  }
}, null, 2));

console.log('Static site built in dist/');
