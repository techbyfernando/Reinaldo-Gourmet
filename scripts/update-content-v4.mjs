import {readFileSync, writeFileSync} from 'node:fs';

let html = readFileSync('index.html', 'utf8');
const photos = [
  ['feijoada',1386,1135,'Feijoada servida com cuidado','O clássico brasileiro em panela de barro, com acompanhamentos que completam a mesa.','Feijoada sendo servida em uma panela de barro'],
  ['churrasco',1086,1448,'Churrasco para reunir','Carnes, linguiças e acompanhamentos organizados para receber seus convidados.','Carnes, linguiças e acompanhamentos na mesa de churrasco'],
  ['buffet',1086,1448,'Uma mesa para todos','Uma seleção de carnes, saladas e entradas, apresentada com atenção ao serviço.','Buffet completo com carnes, batatas, saladas e entradas'],
  ['encontro',1086,1448,'Receber bem, em cada detalhe','A mesa pronta para o encontro, em um ambiente acolhedor e cercado de verde.','Mesa de buffet em um espaço com jardim e mesas para convidados'],
  ['frescor',1448,1086,'Frescor que abre o apetite','Folhas, tomates e pequenos sabores que trazem cor e variedade para o evento.','Saladas frescas, tomates e canapés organizados para servir'],
  ['entradas',1086,1448,'Sabores para compartilhar','Pães e pastas à mesa para começar a conversa e abrir o apetite.','Cestas de pães fatiados e pastas variadas em pequenas tigelas']
];
const slides = photos.map(([name,width,height,title,description,alt],i)=>`          <figure class="experience-slide" data-slide role="group" aria-roledescription="slide" aria-label="${i+1} de 6: ${title}">
            <div class="experience-photo"><img src="assets/media/experiencia-${name}-960.webp" srcset="assets/media/experiencia-${name}-640.webp 640w, assets/media/experiencia-${name}-960.webp 960w, assets/media/experiencia-${name}-original.webp ${width}w" sizes="(max-width: 700px) 92vw, (max-width: 1200px) 85vw, 1120px" width="${width}" height="${height}" alt="${alt}" loading="lazy" decoding="async"></div>
            <figcaption><h3>${title}</h3><p>${description}</p></figcaption>
          </figure>`).join('\n');
const carousel = `      <div class="experience-carousel" data-carousel role="region" aria-roledescription="carrossel" aria-label="A experiencia em imagens">
        <div class="carousel-toolbar" data-carousel-controls hidden>
          <p class="carousel-counter" data-carousel-counter>01 / 06</p>
          <div class="carousel-actions">
            <button type="button" class="carousel-play" data-carousel-play aria-label="Pausar carrossel"><span data-carousel-play-label>Pausar</span><span aria-hidden="true" data-carousel-play-icon>Ⅱ</span></button>
            <button type="button" data-carousel-prev aria-label="Foto anterior" aria-controls="experience-slides"><span aria-hidden="true">←</span></button>
            <button type="button" data-carousel-next aria-label="Proxima foto" aria-controls="experience-slides"><span aria-hidden="true">→</span></button>
          </div>
        </div>
        <div class="experience-slides" id="experience-slides" data-slides>
${slides}
        </div>
        <div class="carousel-dots" data-carousel-controls hidden aria-label="Escolher foto">
${photos.map(([, , ,title],i)=>`          <button type="button" data-slide-to="${i}" aria-label="Ver foto ${i+1}: ${title}" aria-controls="experience-slides"><span aria-hidden="true"></span></button>`).join('\n')}
        </div>
        <p class="sr-only" data-carousel-status aria-live="polite" aria-atomic="true"></p>
        <div class="experience-note"><span>Ingredientes selecionados</span><span>Finalização no local</span><span>Serviço personalizado</span></div>
      </div>`;
const start = html.indexOf('      <div class="experience-visual');
if (start < 0) throw new Error('Experience block not found');
html = html.slice(0,start) + carousel + '\n' + html.slice(html.indexOf('    </section>', start));

const biography = readFileSync('content/chef-story.txt','utf8').trim().split(/\r?\n/).map(p=>`          <p>${p}</p>`).join('\n');
html = html.replace('class="chef-story reveal"','class="chef-story"');
html = html.replace(/        <blockquote>[\s\S]*?<\/blockquote>\s*<p>O gosto por cozinhar[\s\S]*?<\/p>/,`        <div class="chef-biography" data-chef-biography>\n${biography}\n        </div>`);

html = html.replace(/      <div class="partner-list reveal">[\s\S]*?      <\/div>\s*      <p class="partners-note">[\s\S]*?<\/p>/, `      <div class="partner-list">
        <article class="partner-entry"><span class="partner-number">01</span><h3>Casa da Nina</h3><p>Um espaço parceiro para encontros e celebrações.</p><div class="partner-contact"><a href="https://www.facebook.com/casadanina123/" target="_blank" rel="noopener">Facebook: Casa da Nina 123 <span aria-hidden="true">↗</span></a><span class="partner-domain">www.casadanina.com.br</span><small>Site informado indisponível na última verificação. Consulte o canal social.</small></div></article>
        <article class="partner-entry"><span class="partner-number">02</span><h3>Chacara do Jua Eventos</h3><p>Espaço parceiro para festas e eventos.</p><div class="partner-contact"><span class="partner-domain">www.chacaradojua.com.br</span><span>Facebook: Chácara do Juá</span><small>Site indisponível e endereço do perfil social em confirmação.</small><a href="#contato">Consultar contato com Reinaldo <span aria-hidden="true">↗</span></a></div></article>
        <article class="partner-entry"><span class="partner-number">03</span><h3>Museu da Imaginacao</h3><p>Arte, ciência e experiências interativas para toda a família.</p><div class="partner-contact"><a href="https://museudaimaginacao.org.br/" target="_blank" rel="noopener">museudaimaginacao.org.br <span aria-hidden="true">↗</span></a><a href="https://www.facebook.com/museudaimaginacao/" target="_blank" rel="noopener">Facebook: Museu da Imaginação <span aria-hidden="true">↗</span></a></div></article>
      </div>
      <p class="partners-note">Consulte condições, contatos atualizados e disponibilidade diretamente com cada espaço.</p>`);
html = html.replace(/<div class="footer-logo-frame">[\s\S]*?<\/div>/,`<div class="footer-logo-frame"><img src="assets/media/logo-footer-v4-384.png" srcset="assets/media/logo-footer-v4-384.png 384w, assets/media/logo-footer-v4-768.png 768w, assets/media/logo-footer-v4.png 1536w" sizes="(max-width: 400px) 85vw, 340px" alt="Logo completa Reinaldo Quoos Gourmet at Home" width="1536" height="1024" loading="lazy"></div>`);

// Remove dash characters only from displayed text, never URLs, selectors or code.
html = html.split(/(<!--[\s\S]*?-->|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>)/gi)
  .map(part=>part.startsWith('<')?part:part.replace(/[-\u2010-\u2015]/g,' ')).join('');
html = html.replace(/(alt|aria-label)="([^"]+)"/g,(_,attribute,value)=>`${attribute}="${value.replace(/[-\u2010-\u2015]/g,' ')}"`);
writeFileSync('index.html',html);
