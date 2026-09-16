(() => {
  const sent = new Set();

  const post = (url, body) => {
    try {
      const payload = JSON.stringify(body);
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true }).catch(() => {});
      }
    } catch (_) {}
  };

  post('/api/visit', { path: location.pathname.slice(0, 500) });

  const clean = value => String(value || '').replace(/\s+/g, ' ').trim().slice(0, 160);

  const trackTool = name => {
    const tool = clean(name) || 'unknown';
    const key = `${tool}:${location.pathname}`;
    if (sent.has(key)) return;
    sent.add(key);
    post('/api/tool-usage', {
      tool,
      path: location.pathname.slice(0, 500)
    });
  };

  document.addEventListener('click', event => {
    const target = event.target.closest('#toolsGrid > *, [data-tool]');
    if (!target) return;
    const explicit = target.getAttribute('data-tool');
    const name = explicit || target.querySelector('h3, h4, [data-i18n]')?.textContent || target.textContent;
    trackTool(name);
  }, { passive: true });

  window.WPDFAnalytics = { trackTool };

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }
})();
