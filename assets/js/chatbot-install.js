/* Install only the chatbot app; the public site is not cached. */
(() => {
  if ('serviceWorker' in navigator) {
    let hadController = !!navigator.serviceWorker.controller;
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !reloading) {
        reloading = true;
        window.location.reload();
      }
      hadController = true;
    });
    navigator.serviceWorker.register(new URL('../../sw.js', document.currentScript.src), {updateViaCache: 'none'})
      .then(registration => {
        const check = () => {
          if (navigator.onLine && document.visibilityState === 'visible') {
            registration.update().catch(error => console.warn('GustAvo: verifica aggiornamento', error));
          }
        };
        check();
        window.addEventListener('online', check);
        document.addEventListener('visibilitychange', check);
        window.setInterval(check, 5 * 60 * 1000);
      })
      .catch(error => console.warn('GustAvo: installazione non disponibile', error));
  }
  const button = document.getElementById('installChatbot');
  if (!button) return;
  let installPrompt;
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    button.textContent = 'Installa il chatbot';
  });
  button.addEventListener('click', async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      await installPrompt.userChoice;
      installPrompt = null;
    } else {
      alert('Installa solo GustAvo dalla schermata che si apre. Su iPhone: aprila in Safari, tocca Condividi e poi Aggiungi alla schermata Home. Su Android: apri il menu del browser e scegli Installa app o Aggiungi alla schermata Home.');
      window.location.href = 'app.html';
    }
  });
})();
