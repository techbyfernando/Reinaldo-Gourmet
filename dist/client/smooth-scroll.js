// Progressive enhancement: native anchors and scrolling work without this file or Lenis.
(() => {
  if (typeof window.Lenis !== 'function') return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const editable = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';
  let lenis = null;
  let navigation = 0;
  let focusingTarget = false;

  function cancelTravel() {
    navigation++;
    // scrollTo(current) can return early in Lenis without cancelling its animation.
    if (lenis && !lenis.isStopped) { lenis.stop(); lenis.start(); }
  }

  function configure() {
    cancelTravel();
    lenis?.destroy();
    lenis = null;
    root.dataset.scrollMode = 'native';
    if (preference.matches) return;
    try {
      lenis = new window.Lenis({
        autoRaf: true, smoothWheel: true, lerp: 0.1,
        syncTouch: false, anchors: false, autoToggle: false, respectReducedMotion: true,
        prevent: node => Boolean(node.closest?.(editable))
      });
      root.dataset.scrollMode = 'smooth';
    } catch (_) {
      // A failed enhancement must not stop the site from working.
    }
  }

  function focusTarget(target) {
    const temporary = !target.hasAttribute('tabindex') && !target.matches('a[href], button, input, select, textarea');
    if (temporary) {
      target.setAttribute('tabindex', '-1');
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), {once: true});
    }
    focusingTarget = true;
    target.focus({preventScroll: true});
    focusingTarget = false;
  }

  document.addEventListener('click', event => {
    if (!lenis || event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, window.location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch (_) { return; }
    if (!target) return;
    const form = link.matches('[data-event], [data-menu]') ? document.getElementById('event-form') : null;
    const destination = form || target;
    const focus = form?.elements.nome || target.querySelector('h1, h2') || target;
    // Let the browser handle the link if history is unavailable.
    try { if (location.hash !== url.hash) history.pushState(null, '', url.hash); } catch (_) { return; }
    event.preventDefault();
    cancelTravel();
    const token = navigation;
    lenis.resize();
    // Lenis reads the existing CSS scroll-padding/scroll-margin; no duplicate header offset.
    lenis.scrollTo(destination, {
      immediate: link.classList.contains('skip-link'),
      onComplete: () => { if (token === navigation) focusTarget(focus); }
    });
  });

  // Do not restore focus to an old destination after the visitor changes direction.
  document.addEventListener('wheel', () => { navigation++; }, {passive: true});
  document.addEventListener('touchstart', cancelTravel, {passive: true});
  document.addEventListener('keydown', event => {
    if (!event.defaultPrevented && !event.target.closest?.(editable) &&
        ['Tab', 'PageDown', 'PageUp', 'Home', 'End', 'ArrowUp', 'ArrowDown', ' '].includes(event.key)) cancelTravel();
  });
  document.addEventListener('focusin', () => { if (!focusingTarget) cancelTravel(); });
  // Keep native history/BFCache restoration instead of forcing a second anchor jump.
  for (const event of ['popstate', 'hashchange', 'pageshow']) {
    window.addEventListener(event, () => {
      cancelTravel();
      requestAnimationFrame(() => { lenis?.resize(); cancelTravel(); });
    });
  }
  preference.addEventListener('change', configure);
  configure();
})();
