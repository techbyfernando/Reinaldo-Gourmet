document.documentElement.classList.add('js');

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

eventForm?.addEventListener('submit', (event) => {
  event.preventDefault();

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
    data.get('detalhes') ? `• Detalhes: ${data.get('detalhes')}` : '',
    '',
    'Podemos conversar sobre uma proposta personalizada?'
  ].filter(Boolean).join('\n');

  const whatsappUrl = `https://wa.me/5511940197460?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
});
