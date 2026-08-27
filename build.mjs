import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/client', { recursive: true });
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/client/assets', { recursive: true });

for (const source of ['index.html', 'styles.css', 'script.js']) {
  cpSync(source, `dist/client/${source}`);
}

const publicAssets = [
  'favicon.png',
  'hero-gourmet.webp',
  'b4b2f3ca2a6bce1a.webp',
  'logo-reinaldo-quoos.webp',
  'tempero-amor.jpg',
  'mesa-gourmet.jpg',
  'coffee-break.jpg',
  'feijoada.jpg',
  'picnic-gourmet.jpg',
  'chef-reinaldo.jpg',
  'buffet-fresco.jpg',
  'canapes.jpg',
  'a8028d5be1222ab3.webp',
  'e2a36f3a587bb5bf.webp'
];

for (const asset of publicAssets) {
  cpSync(`assets/${asset}`, `dist/client/assets/${asset}`);
}

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
