/* Pull to refresh on every page, including the modern chat iframe. */
(() => {
  const indicator = document.createElement('div');
  indicator.setAttribute('role', 'status');
  indicator.style.cssText = 'position:fixed;top:max(12px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:2000;padding:10px 16px;border-radius:24px;background:white;color:#334155;box-shadow:0 4px 18px #0002;font:600 13px system-ui;pointer-events:none;display:none';
  document.body.append(indicator);
  let refreshing = false;
  function attach(child) {
    if (!child || child.__gustavoRefresh) return;
    child.__gustavoRefresh = true;
    let start = null;
    let distance = 0;
    const reset = () => {
      start = null;
      distance = 0;
      if (!refreshing) indicator.style.display = 'none';
    };
    child.addEventListener('touchstart', event => {
      reset();
      if (refreshing || event.touches.length !== 1 ||
          event.target.closest('input, textarea, select, button, a, label, video, [contenteditable], .input-container')) return;
      if ((child.scrollingElement && child.scrollingElement.scrollTop > 0) ||
          (child === document && window.scrollY > 0)) return;
      // Respect independently scrolling menus, dialogs and message lists.
      for (let element = event.target; element && element !== child.documentElement; element = element.parentElement) {
        if (element.scrollTop > 0) return;
      }
      const messages = child.getElementById('messages');
      // A pull within messages refreshes only when their scroll is already at the top.
      if (messages && messages.contains(event.target) && messages.scrollTop > 0) return;
      start = {x: event.touches[0].clientX, y: event.touches[0].clientY};
    }, {passive: true});
    child.addEventListener('touchmove', event => {
      if (!start) return;
      if (event.touches.length !== 1) return reset();
      const dx = Math.abs(event.touches[0].clientX - start.x);
      distance = event.touches[0].clientY - start.y;
      if (distance < 0 || dx > Math.max(20, distance)) return reset();
      if (distance < 12) return;
      event.preventDefault();
      indicator.style.display = 'block';
      indicator.textContent = distance >= 85 ? 'Rilascia per aggiornare' : 'Trascina per aggiornare';
    }, {passive: false});
    child.addEventListener('touchend', () => {
      if (start && distance >= 85) {
        refreshing = true;
        indicator.textContent = 'Aggiornamento…';
        window.location.reload();
      } else reset();
    }, {passive: true});
    child.addEventListener('touchcancel', reset, {passive: true});
  }
  function observeFrames() {
    document.querySelectorAll('.chatbot-iframe').forEach(frame => {
      if (frame.__gustavoRefreshObserved) return;
      frame.__gustavoRefreshObserved = true;
      frame.addEventListener('load', () => {
        try { attach(frame.contentDocument); } catch (_) { /* The classic external chatbot is cross-origin. */ }
      });
      try { attach(frame.contentDocument); } catch (_) {}
    });
  }
  attach(document);
  document.documentElement.style.overscrollBehaviorY = 'none';
  const container = document.querySelector('.chatbot-iframe-box');
  if (container) new MutationObserver(observeFrames).observe(container, {childList: true});
  observeFrames();
})();
