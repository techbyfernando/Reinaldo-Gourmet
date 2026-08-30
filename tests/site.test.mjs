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
function setup({reduced=false,saveData=false,blockedStorage=false}={}) {
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
  const mediaQueries=new Map();
  const document={...element(),documentElement:{dataset:{theme:'dark'},classList:{add(){}}},hidden:false,
    querySelector:key=>selectors[key],querySelectorAll:key=>key==='[data-event], [data-menu]'?[choice]:[]};
  const stored=new Map(); const window={...element(),scrollY:0,location:{assign(url){this.url=url;}}};
  const context={document,window,navigator:{connection:{saveData}},Date,encodeURIComponent,
    localStorage:{getItem(key){if(blockedStorage)throw Error('denied');return stored.get(key);},setItem(key,value){if(blockedStorage)throw Error('denied');stored.set(key,value);}},
    matchMedia(query){if(!mediaQueries.has(query)){const media=element();media.matches=query.includes('reduced-motion')&&reduced;mediaQueries.set(query,media);}return mediaQueries.get(query);},
    requestAnimationFrame:fn=>fn(), FormData:class{constructor(form){this.form=form;}get(key){return this.form.data[key];}}
  };
  vm.runInNewContext(script,context);
  return {selectors,document,window,stored,mediaQueries,video,form,choice};
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
