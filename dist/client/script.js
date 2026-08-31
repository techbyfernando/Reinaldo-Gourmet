document.documentElement.classList.add('js');

const themeToggle = document.querySelector('[data-theme-toggle]');
const themePreference = matchMedia('(prefers-color-scheme: light)');
let hasSavedTheme = false;
try { hasSavedTheme = ['dark', 'light'].includes(localStorage.getItem('rq-theme')); } catch (_) {}
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const next = theme === 'dark' ? 'claro' : 'escuro';
  themeToggle.setAttribute('aria-label', `Ativar tema ${next}`);
  themeToggle.title = `Ativar tema ${next}`;
  themeToggle.querySelector('[data-theme-label]').textContent = next === 'claro' ? 'Claro' : 'Escuro';
  themeToggle.querySelector('[data-theme-icon]').textContent = theme === 'dark' ? '☀' : '☾';
  document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0b0b09' : '#faf8f3';
}
applyTheme(document.documentElement.dataset.theme);
themeToggle.hidden = false;
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  hasSavedTheme = true;
  try { localStorage.setItem('rq-theme', next); } catch (_) {}
});
themePreference.addEventListener('change', ({matches}) => {
  if (!hasSavedTheme) applyTheme(matches ? 'light' : 'dark');
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
menuToggle.hidden = false;
function closeMenu() {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Abrir menu');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.hidden = !open;
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuToggle.focus(); }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
matchMedia('(min-width: 1101px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const heroVideo = document.querySelector('[data-hero-video]');
const videoToggle = document.querySelector('[data-video-toggle]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = reducedMotion.matches || Boolean(navigator.connection?.saveData);
let heroVisible = true;
function syncVideoButton() {
  const paused = heroVideo.paused;
  videoToggle.setAttribute('aria-label', paused ? 'Reproduzir video de fundo' : 'Pausar video de fundo');
  videoToggle.querySelector('[data-video-icon]').textContent = paused ? '▷' : 'Ⅱ';
  videoToggle.querySelector('[data-video-label]').textContent = paused ? 'Reproduzir video' : 'Pausar video';
}
function loadVideo() {
  if (heroVideo.getAttribute('src')) return;
  heroVideo.src = matchMedia('(max-width: 700px)').matches ? 'assets/media/hero-mobile-v5.mp4' : 'assets/media/hero-desktop-v5.mp4';
  heroVideo.muted = true;
  heroVideo.load();
}
function syncVideoPlayback() {
  if (userPaused || !heroVisible || document.hidden) { heroVideo.pause(); return; }
  loadVideo();
  heroVideo.play().catch(() => { syncVideoButton(); });
}
videoToggle.hidden = false;
heroVideo.addEventListener('play', syncVideoButton);
heroVideo.addEventListener('pause', syncVideoButton);
heroVideo.addEventListener('playing', () => heroVideo.classList.add('is-playing'));
heroVideo.addEventListener('error', () => {
  heroVideo.classList.remove('is-playing');
  videoToggle.hidden = true;
});
videoToggle.addEventListener('click', () => { userPaused = !heroVideo.paused; syncVideoPlayback(); });
document.addEventListener('visibilitychange', syncVideoPlayback);
reducedMotion.addEventListener('change', event => { userPaused = event.matches; syncVideoPlayback(); });
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    syncVideoPlayback();
  }, {threshold: 0.05}).observe(document.querySelector('.hero'));
}
// Let the poster and text paint before requesting the background video.
requestAnimationFrame(() => requestAnimationFrame(syncVideoPlayback));

const header = document.querySelector('[data-header]');

const syncHeader = () => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
};

syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const dateInput = document.querySelector('input[name="data"]');
if (dateInput) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  dateInput.min = localToday;
}

document.querySelectorAll('.faq-list details').forEach((detail) => {
  detail.addEventListener('toggle', () => {
    if (!detail.open) return;
    document.querySelectorAll('.faq-list details[open]').forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

const eventForm = document.querySelector('#event-form');

document.querySelectorAll('[data-event], [data-menu]').forEach(link => {
  link.addEventListener('click', () => {
    if (link.dataset.event) eventForm.elements.tipo.value = link.dataset.event;
    if (link.dataset.menu) eventForm.elements.menu.value = link.dataset.menu;
    const nameInput = eventForm.elements.nome;
    nameInput.focus({preventScroll: true});
  });
});

eventForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!eventForm.reportValidity()) return;

  const data = new FormData(eventForm);
  const rawDate = data.get('data');
  const eventDate = rawDate
    ? new Date(`${rawDate}T12:00:00`).toLocaleDateString('pt-BR')
    : 'a definir';

  const message = [
    `Olá, Reinaldo! Meu nome é ${data.get('nome')}.`,
    '',
    'Gostaria de conversar sobre um evento:',
    `• Tipo: ${data.get('tipo')}`,
    `• Data: ${eventDate}`,
    `• Convidados: ${data.get('convidados')}`,
    `• Cidade: ${data.get('cidade')}`,
    data.get('menu') ? `• Menu de interesse: ${data.get('menu')}` : '',
    data.get('detalhes') ? `• Detalhes: ${data.get('detalhes')}` : '',
    '',
    'Podemos conversar sobre uma proposta personalizada?'
  ].filter(Boolean).join('\n');

  const whatsappUrl = `https://wa.me/5511940197460?text=${encodeURIComponent(message)}`;
  window.location.assign(whatsappUrl);
});

// Two identical groups form one continuous strip. Only the first is exposed
// to assistive technology; wrapping by its measured width is visually seamless.
const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const viewport = carousel.querySelector('[data-carousel-viewport]');
  const track = carousel.querySelector('[data-carousel-track]');
  const group = carousel.querySelector('[data-slides]');
  const slides = [...group.querySelectorAll('[data-slide]')];
  const play = carousel.querySelector('[data-carousel-play]');
  const status = carousel.querySelector('[data-carousel-status]');
  const duplicate = group.cloneNode(true);
  duplicate.removeAttribute('data-slides');
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.inert = true;
  track.append(duplicate);

  let distance = 0;
  let position = 0;
  let frame = 0;
  let previousTime;
  let transition;
  let pointer;
  let playIntent;
  let paused = reducedMotion.matches || Boolean(navigator.connection?.saveData);
  let hovered = false;
  let visible = !('IntersectionObserver' in window);
  const speed = 34; // Pixels per second, independent of screen refresh rate.
  const wrap = value => distance ? ((value % distance) + distance) % distance : 0;
  const canMove = () => !paused && !hovered && visible && !document.hidden;

  function paint() {
    track.style.transform = `translate3d(${-wrap(position)}px,0,0)`;
  }
  function tick(time) {
    frame = 0;
    const elapsed = previousTime === undefined ? 0 : Math.min(time - previousTime, 64);
    previousTime = time;
    if (transition) {
      transition.start ??= time;
      const progress = Math.min((time - transition.start) / 480, 1);
      const easing = .5 - Math.cos(Math.PI * progress) / 2;
      position = transition.from + transition.delta * easing;
      if (progress === 1) { transition = undefined; position = wrap(position); }
    } else if (canMove()) {
      position = wrap(position + elapsed * speed / 1000);
    }
    paint();
    if (transition || canMove()) frame = requestAnimationFrame(tick);
  }
  function syncMotion() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = undefined;
    carousel.dataset.moving = String(canMove());
    play.setAttribute('aria-label', paused ? 'Reproduzir carrossel' : 'Pausar carrossel');
    play.querySelector('[data-carousel-play-label]').textContent = paused ? 'Reproduzir' : 'Pausar';
    play.querySelector('[data-carousel-play-icon]').textContent = paused ? '▷' : 'Ⅱ';
    if (!document.hidden && (transition || canMove())) frame = requestAnimationFrame(tick);
  }
  function measure() {
    const width = group.getBoundingClientRect().width;
    if (!width || width === distance) return;
    position = distance ? wrap(position) / distance * width : 0;
    distance = width;
    transition = undefined;
    paint();
    syncMotion();
  }
  function navigate(direction) {
    const step = distance / slides.length;
    if (!step) return;
    const current = wrap(position) / step;
    const index = direction === 'first' ? 0 : direction === 'last' ? slides.length - 1
      : direction > 0 ? Math.floor(current + .02) + 1 : Math.ceil(current - .02) - 1;
    paused = true;
    position = wrap(position);
    const target = index * step;
    transition = reducedMotion.matches ? undefined : {from: position, delta: target - position};
    if (!transition) { position = target; paint(); }
    status.textContent = `Foto ${slides[(index + slides.length) % slides.length].getAttribute('aria-label')}`;
    syncMotion();
  }

  carousel.classList.add('carousel-ready');
  carousel.querySelector('[data-carousel-controls]').hidden = false;
  carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => navigate(-1));
  carousel.querySelector('[data-carousel-next]').addEventListener('click', () => navigate(1));
  play.addEventListener('pointerdown', () => { playIntent = !paused; });
  play.addEventListener('pointercancel', () => { playIntent = undefined; });
  play.addEventListener('click', () => {
    paused = typeof playIntent === 'boolean' ? playIntent : !paused;
    playIntent = undefined;
    transition = undefined;
    syncMotion();
  });
  viewport.addEventListener('mouseenter', () => { hovered = true; syncMotion(); });
  viewport.addEventListener('mouseleave', () => { hovered = false; syncMotion(); });
  carousel.addEventListener('focusin', () => { paused = true; syncMotion(); });
  viewport.addEventListener('keydown', event => {
    const direction = {ArrowRight: 1, ArrowLeft: -1, Home: 'first', End: 'last'}[event.key];
    if (direction === undefined) return;
    event.preventDefault();
    navigate(direction);
  });
  viewport.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, position: wrap(position), dragging: false};
  });
  viewport.addEventListener('pointermove', event => {
    if (!pointer || event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    if (!pointer.dragging) {
      if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) { pointer = undefined; return; }
      if (Math.abs(dx) < 8) return;
      pointer.dragging = true;
      viewport.setPointerCapture(event.pointerId);
      paused = true;
      transition = undefined;
      syncMotion();
    }
    position = pointer.position - dx;
    paint();
  });
  const endPointer = () => { pointer = undefined; };
  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);
  viewport.addEventListener('lostpointercapture', endPointer);
  document.addEventListener('visibilitychange', syncMotion);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) { paused = true; transition = undefined; }
    syncMotion();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) transition = undefined;
      syncMotion();
    }, {threshold: .05}).observe(viewport);
  }
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(group);
  else window.addEventListener('resize', measure, {passive: true});
  measure();
}
