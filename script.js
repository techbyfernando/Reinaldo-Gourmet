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
  heroVideo.src = matchMedia('(max-width: 700px)').matches ? 'assets/media/hero-mobile.mp4' : 'assets/media/hero-desktop.mp4';
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

// Local carousel: no external library, no changes to supplied photographs.
const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const slides = [...carousel.querySelectorAll('[data-slide]')];
  const dots = [...carousel.querySelectorAll('[data-slide-to]')];
  const play = carousel.querySelector('[data-carousel-play]');
  const stage = carousel.querySelector('[data-slides]');
  const status = carousel.querySelector('[data-carousel-status]');
  let current = 0;
  let paused = reducedMotion.matches || Boolean(navigator.connection?.saveData);
  let hovered = false;
  let visible = !('IntersectionObserver' in window);
  let timer;
  let touchStart;
  let playIntent;

  function syncRotation() {
    window.clearTimeout(timer);
    play.setAttribute('aria-label', paused ? 'Reproduzir carrossel' : 'Pausar carrossel');
    play.querySelector('[data-carousel-play-label]').textContent = paused ? 'Reproduzir' : 'Pausar';
    play.querySelector('[data-carousel-play-icon]').textContent = paused ? '▷' : 'Ⅱ';
    if (!paused && !hovered && visible && !document.hidden) timer = window.setTimeout(() => showSlide(current + 1), 7000);
  }
  function showSlide(index, manual = false) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    carousel.querySelector('[data-carousel-counter]').textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    if (manual) {
      paused = true;
      status.textContent = `Foto ${slides[current].getAttribute('aria-label')}`;
    }
    syncRotation();
  }
  carousel.classList.add('carousel-ready');
  carousel.querySelectorAll('[data-carousel-controls]').forEach(control => { control.hidden = false; });
  carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => showSlide(current - 1, true));
  carousel.querySelector('[data-carousel-next]').addEventListener('click', () => showSlide(current + 1, true));
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slideTo), true)));
  play.addEventListener('pointerdown', () => { playIntent = !paused; });
  play.addEventListener('pointercancel', () => { playIntent = undefined; });
  play.addEventListener('click', () => {
    paused = typeof playIntent === 'boolean' ? playIntent : !paused;
    playIntent = undefined;
    syncRotation();
  });
  carousel.addEventListener('mouseenter', () => { hovered = true; syncRotation(); });
  carousel.addEventListener('mouseleave', () => { hovered = false; syncRotation(); });
  // Keyboard focus stops rotation until the visitor explicitly restarts it.
  carousel.addEventListener('focusin', () => { paused = true; syncRotation(); });
  carousel.addEventListener('keydown', event => {
    const destination = {ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: slides.length - 1}[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    showSlide(destination, true);
  });
  stage.addEventListener('touchstart', event => {
    touchStart = event.touches.length === 1 ? {x: event.touches[0].clientX, y: event.touches[0].clientY} : null;
  }, {passive: true});
  stage.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) showSlide(current + (dx < 0 ? 1 : -1), true);
    touchStart = null;
  }, {passive: true});
  stage.addEventListener('touchcancel', () => { touchStart = null; });
  document.addEventListener('visibilitychange', syncRotation);
  reducedMotion.addEventListener('change', event => { if (event.matches) paused = true; syncRotation(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncRotation(); }, {threshold: .15}).observe(carousel);
  }
  showSlide(0);
}
