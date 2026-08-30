import {readFileSync, writeFileSync} from 'node:fs';
let html = readFileSync('index.html','utf8');
const media = JSON.parse(readFileSync('media-manifest.json','utf8'));
const replacements = {
  'tempero-amor.jpg':'tempero', 'mesa-gourmet.jpg':'mesa', 'coffee-break.jpg':'coffee',
  'feijoada.jpg':'feijoada', 'picnic-gourmet.jpg':'picnic', 'buffet-fresco.jpg':'buffet',
  'canapes.jpg':'canapes', 'a8028d5be1222ab3.webp':'picnic', 'e2a36f3a587bb5bf.webp':'burgers'
};
for (const [old,name] of Object.entries(replacements)) {
  const [width,height] = media[name].export_size;
  const variants = [640,1280,1920].filter(w=>w<width).map(w=>`assets/media/${name}-${w}.webp ${w}w`);
  variants.push(`assets/media/${name}-4k.webp ${width}w`);
  html = html.replace(`src="assets/${old}"`,`src="assets/media/${name}-1280.webp" srcset="${variants.join(', ')}" sizes="(max-width: 560px) 100vw, (max-width: 900px) 90vw, 50vw" width="${width}" height="${height}" decoding="async"`);
}
html = html.replace('src="assets/chef-reinaldo.jpg"','src="assets/media/chef-1254.webp" srcset="assets/media/chef-640.webp 640w, assets/media/chef-1254.webp 1254w, assets/media/chef-4k.webp 3840w" sizes="(max-width: 900px) 100vw, 45vw" width="1254" height="1254" decoding="async"');
html = html.replace('alt="Petiscos gourmet com tomate e manjericão"','alt="Detalhes de uma mesa de piquenique com frutas e quitutes"');
// Only display headings/navigation are unaccented; preserve normal Portuguese in body copy.
const unaccent = value=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
html = html.replace(/<(h[1-6]|summary)\b[^>]*>[\s\S]*?<\/\1>/g,unaccent);
html = html.replace(/<(p|div) class="(?:eyebrow|pretitle|section-kicker)[^"]*"[^>]*>[\s\S]*?<\/\1>/g,unaccent);
html = html.replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/g,unaccent);
writeFileSync('index.html', html);
