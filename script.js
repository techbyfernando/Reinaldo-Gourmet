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
