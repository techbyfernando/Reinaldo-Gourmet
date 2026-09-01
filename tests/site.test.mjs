import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import vm from 'node:vm';

const script = readFileSync('script.js','utf8');
const html = readFileSync('index.html','utf8');
const styles = readFileSync('styles.css','utf8');

function element() {
  return {
    hidden:true, dataset:{}, attributes:{}, listeners:{}, children:{}, textContent:'', style:{}, appended:[], width:2280,
    classList:{add(){},toggle(){}},
    setAttribute(key,value){this.attributes[key]=value;},
    getAttribute(key){return key==='src' ? this.src : this.attributes[key];},
    removeAttribute(key){delete this.attributes[key];},
    cloneNode(){return {...element(),attributes:{...this.attributes},querySelectorAll:this.querySelectorAll};},
    append(child){this.appended.push(child);},
    getBoundingClientRect(){return {width:this.width};},
    setPointerCapture(id){this.pointerId=id;},
    addEventListener(name,handler){(this.listeners[name]??=[]).push(handler);},
    emit(name,event={}){for(const handler of this.listeners[name]??[]) handler(event);},
    querySelector(selector){return this.children[selector]??=element();},
    querySelectorAll(){return [];}, focus(){this.focused=true;}
  };
}
function setup({reduced=false,saveData=false,blockedStorage=false,withObserver=false,mobile=false}={}) {
  const selectors = Object.fromEntries(['[data-theme-toggle]','meta[name="theme-color"]','.menu-toggle','#mobile-menu','[data-hero-video]','[data-header]','[data-year]','input[name="data"]','#event-form','.hero'].map(key=>[key,element()]));
  const video = selectors['[data-hero-video]'];
  video.paused=true; video.loads=0;
  video.load=()=>video.loads++;
  video.play=()=>{video.paused=false;video.emit('play');video.emit('playing');return Promise.resolve();};
  video.pause=()=>{video.paused=true;video.emit('pause');};
  const form=selectors['#event-form'];
  form.elements={tipo:element(),menu:element(),nome:element()};
  form.valid=true;form.reportValidity=()=>form.valid;
  form.data={nome:'Maria Teste',tipo:'Eventos Corporativos',data:'',convidados:'50',cidade:'São Paulo',menu:'Churrasco',detalhes:'Sem amendoim'};
  const choice=element();choice.dataset={event:'Eventos Corporativos',menu:'Finger food'};
  const carousel=element();
  const slides=Array.from({length:6},(_,i)=>{const slide=element();slide.setAttribute('aria-label',`${i+1} de 6: Foto ${i+1}`);return slide;});
  const group=carousel.querySelector('[data-slides]');
  group.querySelectorAll=key=>key==='[data-slide]'?slides:[];
  const viewport=carousel.querySelector('[data-carousel-viewport]');
  const track=carousel.querySelector('[data-carousel-track]');
  selectors['[data-carousel]']=carousel;
  const mediaQueries=new Map();
  const document={...element(),documentElement:{dataset:{theme:'dark'},classList:{add(){}}},hidden:false,
    querySelector:key=>selectors[key],querySelectorAll:key=>key==='[data-event], [data-menu]'?[choice]:[]};
  const stored=new Map(); const frames=new Map();let frameId=0;let clock=0;
  const window={...element(),scrollY:0,location:{assign(url){this.url=url;}}};
  const context={document,window,navigator:{connection:{saveData}},Date,encodeURIComponent,
    localStorage:{getItem(key){if(blockedStorage)throw Error('denied');return stored.get(key);},setItem(key,value){if(blockedStorage)throw Error('denied');stored.set(key,value);}},
    matchMedia(query){if(!mediaQueries.has(query)){const media=element();media.matches=(query.includes('reduced-motion')&&reduced)||(query==='(max-width: 700px)'&&mobile);mediaQueries.set(query,media);}return mediaQueries.get(query);},
    requestAnimationFrame(fn){frames.set(++frameId,fn);return frameId;},cancelAnimationFrame(id){frames.delete(id);},
    FormData:class{constructor(form){this.form=form;}get(key){return this.form.data[key];}}
  };
  const observers=[];
  if(withObserver){
    context.IntersectionObserver=class{constructor(callback){this.callback=callback;observers.push(this);}observe(target){this.target=target;}unobserve(){}};
    window.IntersectionObserver=context.IntersectionObserver;
  }
  vm.runInNewContext(script,context);
  function advance(ms=16){clock+=ms;const pending=[...frames.values()];frames.clear();pending.forEach(fn=>fn(clock));}
  advance(0);advance(0);
  const position=()=>-Number(track.style.transform.match(/translate3d\(([^p]+)px/)[1]) || 0;
  return {selectors,document,window,stored,mediaQueries,video,form,choice,carousel,slides,group,viewport,track,frames,observers,advance,position};
}

test('headings are unaccented, IDs unique, local links and media resolve',()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size);
  for(const match of html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/g)) assert.doesNotMatch(match[1],/[À-ž]/);
  for(const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]),match[1]);
  for(const match of html.matchAll(/(?:src|href|poster)="(assets\/[^"?#]+|(?:styles|theme)\.css|script\.js)(?:\?v=\d+)?"/g)) assert.ok(existsSync(match[1]),match[1]);
  for(const match of html.matchAll(/srcset="([^"]+)"/g)) for(const candidate of match[1].split(',')) assert.ok(existsSync(candidate.trim().split(/\s/)[0]),candidate);
  for(const css of ['styles.css','theme.css']) for(const match of readFileSync(css,'utf8').matchAll(/url\("(assets\/[^"?#]+)"\)/g)) assert.ok(existsSync(match[1]),match[1]);
  assert.doesNotMatch(html,/\+150|18 anos|assets\/chef-reinaldo.jpg/);
  const visibleText=html.replace(/<script\b[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,'');
  assert.doesNotMatch(visibleText,/[-\u2010-\u2015]/);
});

test('the complete supplied chef story is preserved without rewriting',()=>{
  const normalize=value=>value.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const biography=html.match(/data-chef-biography>([\s\S]*?)<\/div>/)[1];
  assert.equal(normalize(biography),normalize(readFileSync('content/chef-story.txt','utf8')));
});

test('continuous strip keeps a constant leftward speed across the exact loop boundary',()=>{
  const {carousel,track,group,position,advance}=setup();
  assert.equal(carousel.querySelector('[data-carousel-controls]').hidden,false);
  assert.equal(track.appended.length,1);
  assert.equal(track.appended[0].getAttribute('aria-hidden'),'true');
  assert.equal(track.appended[0].inert,true);
  assert.equal(track.appended[0].querySelectorAll('[data-slide]').length,6);
  let last=position(),wraps=0;
  for(let frame=0;frame<9000;frame++){
    advance();const next=position();if(next<last)wraps++;
    assert.ok(Math.abs((next-last+group.width)%group.width - .544)<.000001);
    last=next;
  }
  assert.equal(wraps,2);
});

test('carousel cannot be paused by hover or focus and respects browser lifecycle',()=>{
  const {carousel,viewport,document,frames,mediaQueries,advance,position}=setup();
  viewport.emit('mouseenter');assert.equal(frames.size,1);
  carousel.emit('focusin');assert.equal(frames.size,1);
  advance();advance();const before=position();
  document.hidden=true;document.emit('visibilitychange');assert.equal(frames.size,0);
  advance(10000);
  document.hidden=false;document.emit('visibilitychange');advance();assert.equal(position(),before);
  assert.equal(frames.size,1);
  mediaQueries.get('(prefers-reduced-motion: reduce)').emit('change',{matches:true});assert.equal(frames.size,0);
  for(const options of [{reduced:true},{saveData:true}])assert.equal(setup(options).frames.size,0);
});

test('carousel only rotates while its section is visible',()=>{
  const {viewport,frames,observers}=setup({withObserver:true});
  const observer=observers.find(item=>item.target===viewport);
  assert.equal(frames.size,0);
  observer.callback([{isIntersecting:true}]);assert.equal(frames.size,1);
  observer.callback([{isIntersecting:false}]);assert.equal(frames.size,0);
});

test('manual navigation eases into place and automatically continues',()=>{
  const {carousel,viewport,frames,advance,position}=setup();
  carousel.querySelector('[data-carousel-next]').emit('click');advance();advance(48);
  assert.ok(position()>0 && position()<380);
  for(let i=0;i<31;i++)advance();
  assert.ok(position()>=380 && position()<385);assert.equal(frames.size,1);
  const resumed=position();advance();assert.ok(position()>resumed);
  viewport.emit('keydown',{key:'End',preventDefault(){}});
  for(let i=0;i<31;i++)advance();assert.ok(position()>=1900 && position()<1905);
  viewport.emit('keydown',{key:'ArrowRight',preventDefault(){}});
  for(let i=0;i<31;i++)advance();assert.ok(position()<5);
  assert.match(carousel.querySelector('[data-carousel-status]').textContent,/1 de 6/);
});

test('carousel has no drag gesture that can hold the motion',()=>{
  const {viewport,frames}=setup();
  assert.equal(viewport.listeners.pointerdown,undefined);
  assert.equal(viewport.listeners.pointermove,undefined);
  assert.equal(frames.size,1);
});

test('resizing preserves the same position in the sequence',()=>{
  const {viewport,window,group,position}=setup({reduced:true});
  viewport.emit('keydown',{key:'End',preventDefault(){}});assert.equal(position(),1900);
  group.width=1800;window.emit('resize');assert.equal(position(),1500);
});

test('event choices are limited to the two requested categories and all prefills remain valid',()=>{
  const field=html.match(/<select name="tipo"[^>]*>([\s\S]*?)<\/select>/)[1];
  const values=[...field.matchAll(/<option[^>]*>([^<]+)<\/option>/g)].map(m=>m[1]);
  assert.deepEqual(values,['Eventos Particulares','Eventos Corporativos']);
  for(const [,value] of html.matchAll(/data-event="([^"]+)"/g))assert.ok(values.includes(value));
  assert.doesNotMatch(html,/Role para descobrir|hero-scroll|partner-domain|Site informado indisponível|Site indisponível e endereço/);
});
test('video and carousel expose no pause controls and the removed hero text is absent',()=>{
  assert.doesNotMatch(html,/data-video-toggle|data-carousel-play|Cozinha movel personalizada|Pausar video|Pausar carrossel/);
  assert.doesNotMatch(script,/videoToggle|carousel-play|mouseenter|focusin|playIntent|userPaused/);
});
test('requested hero lines are removed and form selects use a consistent custom control',()=>{
  const signature=styles.match(/\.hero-signature \{([^}]+)\}/)[1];
  const heroLink=styles.match(/\.text-link \{([^}]+)\}/)[1];
  const formSelect=styles.match(/\.event-form select \{([^}]+)\}/)[1];
  assert.doesNotMatch(signature,/border-left|padding-left/);
  assert.doesNotMatch(heroLink,/border-bottom/);
  for(const rule of ['appearance: none','padding-right: 32px','background-image','cursor: pointer']) assert.match(formSelect,new RegExp(rule));
  assert.match(html,/<script src="script\.js\?v=8"><\/script>/);
});
test('decorative numbering is removed and the menu section has a specific label',()=>{
  assert.doesNotMatch(html,/<span>0[1-9]<\/span>|class="menu-index"|class="partner-number"/);
  assert.match(html,/<div class="section-kicker">Cardapios<\/div>/);
  assert.doesNotMatch(html,/<div class="section-kicker(?: reveal)?"><span>/);
  assert.match(html,/href="styles\.css\?v=9"/);
  assert.match(html,/href="theme\.css\?v=9"/);
});
test('the presentation build contains no advertising or analytics trackers',()=>{
  assert.doesNotMatch(`${html}\n${script}`,/googletagmanager|google-analytics|connect\.facebook\.net|gtag\s*\(|fbq\s*\(/i);
  assert.doesNotMatch(html,/\+150|150 empresas/i);
  assert.match(html,/Lancamento no dominio oficial: atualizar og:image e adicionar canonical \+ og:url somente depois da migracao/);
});
test('theme switch changes palette metadata and persists the user choice',()=>{
  const {selectors,document,stored}=setup();
  const button=selectors['[data-theme-toggle]'];
  assert.equal(button.hidden,false);
  button.emit('click');
  assert.equal(document.documentElement.dataset.theme,'light');
  assert.equal(stored.get('rq-theme'),'light');
  assert.equal(selectors['meta[name="theme-color"]'].content,'#faf8f3');
  button.emit('click'); assert.equal(document.documentElement.dataset.theme,'dark');
});
test('theme controls work when browser storage is unavailable',()=>{
  const {selectors,document}=setup({blockedStorage:true});
  selectors['[data-theme-toggle]'].emit('click');
  assert.equal(document.documentElement.dataset.theme,'light');
});
test('video loads muted once and automatically resumes after tab visibility changes',()=>{
  const {video,document}=setup();
  assert.equal(video.src,'assets/media/hero-desktop-v6.mp4');
  assert.equal(video.muted,true);assert.equal(video.paused,false);assert.equal(video.loads,1);
  document.hidden=true;document.emit('visibilitychange');assert.equal(video.paused,true);
  document.hidden=false;document.emit('visibilitychange');assert.equal(video.paused,false);assert.equal(video.loads,1);
  const mobileVideo=setup({mobile:true}).video;
  assert.equal(mobileVideo.src,'assets/media/hero-mobile-v6.mp4');
  assert.equal(mobileVideo.muted,true);assert.equal(mobileVideo.paused,false);
});
test('reduced motion and data saver do not automatically download video',()=>{
  for(const options of [{reduced:true},{saveData:true}]){
    const {video}=setup(options);
    assert.equal(video.loads,0);
    assert.equal(video.paused,true);
  }
});
test('mobile menu closes with Escape and restores focus',()=>{
  const {selectors,document}=setup();const button=selectors['.menu-toggle'];
  button.emit('click');assert.equal(selectors['#mobile-menu'].hidden,false);
  document.emit('keydown',{key:'Escape'});assert.equal(selectors['#mobile-menu'].hidden,true);assert.equal(button.focused,true);
});
test('menu selection pre-fills the form and WhatsApp message retains event details',()=>{
  const {choice,form,window}=setup();choice.emit('click');
  assert.equal(form.elements.tipo.value,'Eventos Corporativos');assert.equal(form.elements.menu.value,'Finger food');
  form.emit('submit',{preventDefault(){}});
  const target=new URL(window.location.url);assert.equal(target.hostname,'wa.me');assert.equal(target.pathname,'/5511940197460');
  const message=target.searchParams.get('text');
  for(const value of ['Maria Teste','a definir','50','São Paulo','Churrasco','Sem amendoim']) assert.ok(message.includes(value));
  window.location.url=null;form.valid=false;form.emit('submit',{preventDefault(){}});assert.equal(window.location.url,null);
});
test('build copies the exact tested front-end',()=>{
  for(const file of ['index.html','styles.css','theme.css','script.js']) assert.equal(readFileSync(`dist/client/${file}`,'utf8'),readFileSync(file,'utf8'));
  assert.ok(existsSync('dist/server/index.js'));
});
