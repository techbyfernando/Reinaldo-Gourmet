import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import {resolve, sep} from 'node:path';

const workspace = resolve('.');
const output = resolve('dist');
if (!output.startsWith(workspace + sep) || output === workspace) throw new Error('Invalid build directory');
rmSync(output, { recursive: true, force: true });
mkdirSync('dist/client', { recursive: true });
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/client/assets', { recursive: true });

const sources = ['index.html', 'styles.css', 'theme.css', 'script.js', 'smooth-scroll.js'];
for (const source of sources) {
  cpSync(source, `dist/client/${source}`);
}

// Keep original media in the project, but publish only referenced variants.
// This includes srcset candidates, video sources, favicon and the social preview.
mkdirSync('dist/client/assets/media', {recursive: true});
const media = new Set(sources.flatMap(source =>
  [...readFileSync(source, 'utf8').matchAll(/assets\/media\/[\w.-]+/g)].map(match => match[0])
));
for (const file of media) cpSync(file, `dist/client/${file}`);
cpSync('assets/fonts', 'dist/client/assets/fonts', {recursive: true});
mkdirSync('dist/client/assets/vendor', {recursive: true});
for (const file of ['lenis.min.js', 'lenis.css']) {
  cpSync(`node_modules/lenis/dist/${file}`, `dist/client/assets/vendor/${file}`);
}
cpSync('node_modules/lenis/LICENSE', 'dist/client/assets/vendor/lenis.LICENSE.txt');

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
