import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import vm from 'node:vm';

const script = readFileSync('script.js','utf8');
const html = readFileSync('index.html','utf8');

function element() {
  return {
    hidden:true, dataset:{}, attributes:{}, listeners:{}, children:{}, textContent:'',
    classList:{add(){},toggle(){}},
    setAttribute(key,value){this.attributes[key]=value;},
    getAttribute(key){return key==='src' ? this.src : this.attributes[key];},
    addEventListener(name,handler){(this.listeners[name]??=[]).push(handler);},
    emit(name,event={}){for(const handler of this.listeners[name]??[]) handler(event);},
    querySelector(selector){return this.children[selector]??=element();},
    querySelectorAll(){return [];}, focus(){this.focused=true;}
  };
}
function setup({reduced=false,saveData=false,blockedStorage=false,withObserver=false}={}) {
  const selectors = Object.fromEntries(['[data-theme-toggle]','meta[name="theme-color"]','.menu-toggle','#mobile-menu','[data-hero-video]','[data-video-toggle]','[data-header]','[data-year]','input[name="data"]','#event-form','.hero'].map(key=>[key,element()]));
  const video = selectors['[data-hero-video]'];
  video.paused=true; video.loads=0;
  video.load=()=>video.loads++;
  video.play=()=>{video.paused=false;video.emit('play');video.emit('playing');return Promise.resolve();};
  video.pause=()=>{video.paused=true;video.emit('pause');};
  const form=selectors['#event-form'];
  form.elements={tipo:element(),menu:element(),nome:element()};
  form.valid=true;form.reportValidity=()=>form.valid;
  form.data={nome:'Maria Teste',tipo:'Evento corporativo',data:'',convidados:'50',cidade:'São Paulo',menu:'Churrasco',detalhes:'Sem amendoim'};
  const choice=element();choice.dataset={event:'Evento corporativo',menu:'Finger food'};
  const carousel=element();
  const slides=Array.from({length:6},(_,i)=>{const slide=element();slide.setAttribute('aria-label',`${i+1} de 6: Foto ${i+1}`);return slide;});
  const dots=Array.from({length:6},(_,i)=>{const dot=element();dot.dataset.slideTo=String(i);return dot;});
  const controls=[element(),element()];
  carousel.querySelectorAll=key=>key==='[data-slide]'?slides:key==='[data-slide-to]'?dots:key==='[data-carousel-controls]'?controls:[];
  selectors['[data-carousel]']=carousel;
  const mediaQueries=new Map();
  const document={...element(),documentElement:{dataset:{theme:'dark'},classList:{add(){}}},hidden:false,
    querySelector:key=>selectors[key],querySelectorAll:key=>key==='[data-event], [data-menu]'?[choice]:[]};
  const stored=new Map(); const timers=new Map();let timerId=0;
  const window={...element(),scrollY:0,location:{assign(url){this.url=url;}},setTimeout(fn,delay){timers.set(++timerId,{fn,delay});return timerId;},clearTimeout(id){timers.delete(id);}};
  const context={document,window,navigator:{connection:{saveData}},Date,encodeURIComponent,
    localStorage:{getItem(key){if(blockedStorage)throw Error('denied');return stored.get(key);},setItem(key,value){if(blockedStorage)throw Error('denied');stored.set(key,value);}},
    matchMedia(query){if(!mediaQueries.has(query)){const media=element();media.matches=query.includes('reduced-motion')&&reduced;mediaQueries.set(query,media);}return mediaQueries.get(query);},
    requestAnimationFrame:fn=>fn(), FormData:class{constructor(form){this.form=form;}get(key){return this.form.data[key];}}
  };
  const observers=[];
  if(withObserver){
    context.IntersectionObserver=class{constructor(callback){this.callback=callback;observers.push(this);}observe(target){this.target=target;}unobserve(){}};
    window.IntersectionObserver=context.IntersectionObserver;
  }
  vm.runInNewContext(script,context);
  return {selectors,document,window,stored,mediaQueries,video,form,choice,carousel,slides,dots,controls,timers,observers,advance(){const pending=[...timers.values()];timers.clear();pending.forEach(({fn})=>fn());}};
}

test('headings are unaccented, IDs unique, local links and media resolve',()=>{
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size);
  for(const match of html.matchAll(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/g)) assert.doesNotMatch(match[1],/[À-ž]/);
  for(const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]),match[1]);
  for(const match of html.matchAll(/(?:src|href|poster)="(assets\/[^"?#]+|(?:styles|theme)\.css|script\.js)"/g)) assert.ok(existsSync(match[1]),match[1]);
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

test('carousel rotates, wraps and stops after manual selection',()=>{
  const {carousel,slides,dots,controls,timers,advance}=setup();
  assert.ok(controls.every(control=>!control.hidden));
  assert.equal(slides.filter(slide=>!slide.hidden).length,1);
  assert.equal(slides[0].hidden,false);
  assert.equal([...timers.values()][0].delay,7000);
  advance();assert.equal(slides[1].hidden,false);
  dots[5].emit('click');assert.equal(slides[5].hidden,false);assert.equal(timers.size,0);
  carousel.querySelector('[data-carousel-next]').emit('click');assert.equal(slides[0].hidden,false);
  carousel.querySelector('[data-carousel-prev]').emit('click');assert.equal(slides[5].hidden,false);
  assert.equal(dots[5].getAttribute('aria-current'),'true');
  assert.match(carousel.querySelector('[data-carousel-status]').textContent,/6 de 6/);
});

test('carousel pauses on hover, focus, hidden tab and motion preference',()=>{
  const {carousel,document,timers,mediaQueries}=setup();
  carousel.emit('mouseenter');assert.equal(timers.size,0);
  carousel.emit('mouseleave');assert.equal(timers.size,1);
  document.hidden=true;document.emit('visibilitychange');assert.equal(timers.size,0);
  document.hidden=false;document.emit('visibilitychange');assert.equal(timers.size,1);
  carousel.emit('focusin');assert.equal(timers.size,0);
  carousel.emit('mouseleave');assert.equal(timers.size,0);
  carousel.querySelector('[data-carousel-play]').emit('click');assert.equal(timers.size,1);
  mediaQueries.get('(prefers-reduced-motion: reduce)').emit('change',{matches:true});assert.equal(timers.size,0);
  for(const options of [{reduced:true},{saveData:true}])assert.equal(setup(options).timers.size,0);
});

test('pointer focus does not reverse the intended pause action',()=>{
  const {carousel,timers}=setup();const play=carousel.querySelector('[data-carousel-play]');
  play.emit('pointerdown');carousel.emit('focusin');play.emit('click');
  assert.equal(timers.size,0);assert.equal(play.getAttribute('aria-label'),'Reproduzir carrossel');
  play.emit('pointerdown');play.emit('click');assert.equal(timers.size,1);
});

test('carousel only rotates while its section is visible',()=>{
  const {carousel,timers,observers}=setup({withObserver:true});
  const observer=observers.find(item=>item.target===carousel);
  assert.equal(timers.size,0);
  observer.callback([{isIntersecting:true}]);assert.equal(timers.size,1);
  observer.callback([{isIntersecting:false}]);assert.equal(timers.size,0);
});

test('carousel supports keyboard and horizontal swipe without hijacking vertical scroll',()=>{
  const {carousel,slides,timers}=setup();let prevented=false;
  carousel.emit('keydown',{key:'End',preventDefault(){prevented=true;}});assert.equal(prevented,true);assert.equal(slides[5].hidden,false);
  carousel.emit('keydown',{key:'ArrowRight',preventDefault(){}});assert.equal(slides[0].hidden,false);
  const stage=carousel.querySelector('[data-slides]');
  stage.emit('touchstart',{touches:[{clientX:200,clientY:200}]});
  stage.emit('touchend',{changedTouches:[{clientX:80,clientY:210}]});assert.equal(slides[1].hidden,false);
  stage.emit('touchstart',{touches:[{clientX:200,clientY:200}]});
  stage.emit('touchend',{changedTouches:[{clientX:190,clientY:30}]});assert.equal(slides[1].hidden,false);
  assert.equal(timers.size,0);
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
test('video loads muted once and supports pause, resume and tab visibility',()=>{
  const {video,selectors,document}=setup();
  assert.equal(video.src,'assets/media/hero-desktop.mp4');
  assert.equal(video.muted,true);assert.equal(video.paused,false);assert.equal(video.loads,1);
  selectors['[data-video-toggle]'].emit('click');assert.equal(video.paused,true);
  document.hidden=true;document.emit('visibilitychange');
  document.hidden=false;document.emit('visibilitychange');assert.equal(video.paused,true);
  selectors['[data-video-toggle]'].emit('click');assert.equal(video.paused,false);
  document.hidden=true;document.emit('visibilitychange');assert.equal(video.paused,true);
  document.hidden=false;document.emit('visibilitychange');assert.equal(video.paused,false);assert.equal(video.loads,1);
});
test('reduced motion and data saver do not automatically download video',()=>{
  for(const options of [{reduced:true},{saveData:true}]){
    const {video,selectors}=setup(options);
    assert.equal(video.loads,0);
    selectors['[data-video-toggle]'].emit('click');assert.equal(video.loads,1);assert.equal(video.paused,false);
  }
});
test('mobile menu closes with Escape and restores focus',()=>{
  const {selectors,document}=setup();const button=selectors['.menu-toggle'];
  button.emit('click');assert.equal(selectors['#mobile-menu'].hidden,false);
  document.emit('keydown',{key:'Escape'});assert.equal(selectors['#mobile-menu'].hidden,true);assert.equal(button.focused,true);
});
test('menu selection pre-fills the form and WhatsApp message retains event details',()=>{
  const {choice,form,window}=setup();choice.emit('click');
  assert.equal(form.elements.tipo.value,'Evento corporativo');assert.equal(form.elements.menu.value,'Finger food');
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
