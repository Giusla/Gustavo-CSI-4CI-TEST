/**
 * GustAvo — Chatbot CSS Theme Injection Script
 * File: assets/js/chatbot-theme-inject.js
 * Scopo: Inietta il tema grafico ufficiale dell'IIS Avogadro / CSI Piemonte
 *        all'interno del chatbot ospitato su gustavo1.avoprogetti.it.
 * 
 * Aggiornamenti:
 * - Prevenzione Anti-Spam a prova di bomba: mutex di invio per impedire risposte multiple concorrenti.
 * - Sblocco / Blocco coordinato dell'input e del pulsante durante la trasmissione e mentre GustAvo parla.
 * - Rimozione totale di qualsiasi emoji da tutti i testi, messaggi di stato, placeholder e bot responses.
 * - Logo GustAvo ingrandito, trasparente e con angoli NON arrotondati (border-radius: 0).
 * - Robottino SVG ufficiale con occhi e bocca animate.
 */

(function () {
  'use strict';

  // Request capture from the main document so mobile permission prompts belong to the site.
  window.GUSTAVO_REQUEST_MICROPHONE = function () {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return Promise.reject(new Error('Il microfono richiede HTTPS e un browser compatibile.'));
    }
    return navigator.mediaDevices.getUserMedia({audio:true});
  };

  // Create and start recognition in the top-level page rather than the srcdoc frame.
  window.GUSTAVO_CREATE_RECOGNITION = function () {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return null;
    const engine = new Recognition();
    const bridge = {
      start() { engine.start(); },
      stop() { engine.stop(); },
      abort() { engine.abort(); }
    };
    for (const property of ['lang', 'continuous', 'interimResults']) {
      Object.defineProperty(bridge, property, {
        get() { return engine[property]; },
        set(value) { engine[property] = value; }
      });
    }
    for (const event of ['start', 'audiostart', 'speechstart', 'result', 'error', 'end']) {
      engine['on' + event] = function (detail) {
        const callback = bridge['on' + event];
        if (callback) callback(detail);
      };
    }
    return bridge;
  };

  // Tema CSS completo e ottimizzato per l'iniezione


  // Markup SVG per l'avatar umano (vecchietto saggio / professore con capelli, occhiali azzurrini e microfono interattivo)
  const AVATAR_SVG_HTML = `
    <div class="avatar">
      <svg class="avatar-svg" viewBox="0 0 130 130" width="160" height="160" xmlns="http://www.w3.org/2000/svg" aria-label="Avatar GustAvo">
        <defs>
          <filter id="elderGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#0f172a" flood-opacity="0.12" />
          </filter>
          <filter id="mustacheDrop" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#0f172a" flood-opacity="0.15" />
          </filter>
        </defs>

        <!-- Orecchie pulite (senza forme dietro l'orecchio) -->
        <circle cx="24" cy="74" r="8.5" fill="#fcd8ba" />
        <circle cx="106" cy="74" r="8.5" fill="#fcd8ba" />
        <circle cx="24" cy="74" r="4.5" fill="#f5be98" opacity="0.45" />
        <circle cx="106" cy="74" r="4.5" fill="#f5be98" opacity="0.45" />

        <!-- Maglia / Abbigliamento migliore: Cardigan brand blue, camicia bianca e cravatta verde -->
        <path d="M 26 130 L 38 114 Q 65 125 92 114 L 104 130 Z" fill="#0066ff" />
        <path d="M 38 114 L 48 114 L 43 130 L 26 130 Z" fill="#0052cc" />
        <path d="M 92 114 L 82 114 L 87 130 L 104 130 Z" fill="#0052cc" />
        <polygon points="48,114 65,124 59,130 45,117" fill="#ffffff" />
        <polygon points="82,114 65,124 71,130 85,117" fill="#ffffff" />
        <!-- Cravatta gialla ufficiale Avogadro -->
        <polygon points="62,121 68,121 66,124 64,124" fill="#ca8a04" />
        <polygon points="63,124 67,124 69,130 61,130" fill="#facc15" />

        <!-- Forma del Viso pulita (senza dettagli o rughe sulla fronte) -->
        <circle cx="65" cy="75" r="41" fill="#fde2cb" filter="url(#elderGlow)" />

        <!-- Guance rosee stilizzate -->
        <ellipse cx="36" cy="81" rx="8" ry="5.5" fill="#f87171" opacity="0.32" />
        <ellipse cx="94" cy="81" rx="8" ry="5.5" fill="#f87171" opacity="0.32" />

        <!-- Capelli eleganti da professore anziano (senza basco) -->
        <path d="M 24 67 C 20 40, 31 18, 65 18 C 99 18, 110 40, 106 67 C 101 44, 88 28, 65 28 C 42 28, 29 44, 24 67 Z" fill="#cbd5e1" />
        <path d="M 25 63 C 22 38, 34 19, 65 19 C 96 19, 108 38, 105 63 C 100 47, 88 32, 65 32 C 42 32, 30 47, 25 63 Z" fill="#f1f5f9" />
        <path d="M 44 26.5 Q 65 22.5 86 26.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7" />
        <path d="M 36 34 Q 65 27 94 34" stroke="#e2e8f0" stroke-width="2.2" stroke-linecap="round" fill="none" />

        <!-- Sopracciglia folte e bianche -->
        <path d="M 37 51 C 44 44, 55 45, 61 51" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round" fill="none" filter="url(#mustacheDrop)" />
        <path d="M 69 51 C 75 45, 86 44, 93 51" stroke="#ffffff" stroke-width="6.5" stroke-linecap="round" fill="none" filter="url(#mustacheDrop)" />

        <!-- Bocca animata interattiva parlante -->
        <rect id="mouth" x="55" y="93" width="20" height="6" rx="3" fill="#be123c" />

        <!-- Baffoni bianchi da saggio -->
        <path d="M 65 78 C 52 78, 30 86, 23 97 C 38 100, 54 94, 65 89 C 76 94, 92 100, 107 97 C 100 86, 78 78, 65 78 Z" fill="#ffffff" filter="url(#mustacheDrop)" />

        <!-- Grandi occhiali tondi azzurrini come il tema del sito -->
        <!-- Lente sinistra -->
        <circle cx="47" cy="67" r="16.5" fill="#ffffff" stroke="#0066ff" stroke-width="4.5" />
        <!-- Lente destra -->
        <circle cx="83" cy="67" r="16.5" fill="#ffffff" stroke="#0066ff" stroke-width="4.5" />
        <!-- Ponte occhiali -->
        <path d="M 63 65 Q 65 60 67 65" stroke="#0066ff" stroke-width="4.5" stroke-linecap="round" fill="none" />
        <!-- Stanghette occhiali verso le orecchie -->
        <path d="M 31 66 L 24 70" stroke="#0066ff" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <path d="M 99 66 L 106 70" stroke="#0066ff" stroke-width="3.5" stroke-linecap="round" fill="none" />

        <!-- Occhio sinistro con pupilla mobile -->
        <g class="eye left">
          <g class="pupil" id="left-pupil">
            <ellipse cx="47" cy="67" rx="7" ry="8.5" fill="#0f172a" />
            <circle cx="45" cy="64.5" r="2.6" fill="#ffffff" />
            <circle cx="49" cy="69" r="1.2" fill="#ffffff" opacity="0.7" />
          </g>
        </g>

        <!-- Occhio destro con pupilla mobile -->
        <g class="eye right">
          <g class="pupil" id="right-pupil">
            <ellipse cx="83" cy="67" rx="7" ry="8.5" fill="#0f172a" />
            <circle cx="81" cy="64.5" r="2.6" fill="#ffffff" />
            <circle cx="85" cy="69" r="1.2" fill="#ffffff" opacity="0.7" />
          </g>
        </g>

        <!-- Nasone rotondo da nonnino -->
        <ellipse cx="65" cy="74" rx="8" ry="6.5" fill="#f4a27e" />

        <!-- Archetto microfono (cuffie operatore da guida) -->
        <ellipse cx="19" cy="73" rx="3.5" ry="6" fill="#1e293b" />
        <path d="M 19 78 C 16 97, 26 112, 53 111" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round" fill="none" />
        <rect x="51" y="107" width="10" height="7" rx="3.5" fill="#1e293b" />
        <!-- Luce LED dinamica: rossa a riposo, verde quando parla -->
        <circle id="mic-led" cx="57" cy="110.5" r="2.2" fill="#ef4444" />
      </svg>
    </div>
  `;

  // Markup SVG per il pulsante del microfono (Closed & Open Mic)
  const MIC_BUTTON_HTML = `
    <button id="mic-btn" class="mic-btn" type="button" aria-label="Microfono vocale" title="Attiva o disattiva dettatura vocale">
      <svg class="mic-svg mic-closed" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
      </svg>
      <svg class="mic-svg mic-open" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <rect x="6" y="6" width="12" height="12" rx="2"/>
      </svg>
    </button>
  `;

  // Markup SVG per lo switch della voce (Amplificatore / Altoparlante)
  const VOICE_LABEL_HTML = `
    <label for="voiceToggle">
      <svg class="amp-svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
      <span>Attiva voce</span>
    </label>
  `;







  function buildModernHtml() {
    const themeUrl = new URL('assets/css/chatbot-theme.css?v=8.18', document.baseURI).href;
    const runtimeUrl = new URL('assets/js/chatbot-runtime.js?v=8.22', document.baseURI).href;

    return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <base href="https://gustavo1.avoprogetti.it/">
  <link rel="preconnect" href="https://gustavo1.avoprogetti.it" crossorigin>
  <link rel="dns-prefetch" href="https://gustavo1.avoprogetti.it">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${themeUrl}">
</head>
<body>
  <div id="chat-container">
    <div class="header"></div>
    <div class="avatar-stage">
    ${AVATAR_SVG_HTML.trim()}
    <div class="voice-toggle">
      <input type="checkbox" id="voiceToggle" checked>
      ${VOICE_LABEL_HTML.trim()}
    </div>
    </div>
    <div id="messages">
      <div class="msg bot">
        <span class="strong">GustAvo:</span> Ciao! Sono GustAvo, l'assistente virtuale dell'IIS Avogadro. Chiedimi pure informazioni su corsi, aule, laboratori, orari o segreteria!
      </div>
    </div>
    <div class="input-container">
      <input type="text" id="input" placeholder="Scrivi un messaggio..." autocomplete="off">
      <button id="btn-send">Invia</button>
      ${MIC_BUTTON_HTML.trim()}
    </div>
    <div class="chat-disclaimer-note">GustAvo è un assistente virtuale e può commettere errori. Verifica le informazioni in segreteria o su <a href="https://www.itisavogadro.it" target="_blank" rel="noopener">itisavogadro.it</a></div>
  </div>
  <script src="${runtimeUrl}"><\/script>
</body>
</html>`;
  }

  let viewportFrame = 0;
  let viewportBaseline = window.innerHeight;
  function updateChatViewport() {
    cancelAnimationFrame(viewportFrame);
    viewportFrame = requestAnimationFrame(function () {
      const viewport = window.visualViewport;
      if (viewport && Math.abs(viewport.scale - 1) > 0.05) return;
      const height = viewport ? viewport.height : window.innerHeight;
      viewportBaseline = Math.max(viewportBaseline, window.innerHeight);
      document.documentElement.style.setProperty('--chatbot-viewport-height', height + 'px');
      let keyboardOpen = false;
      const iframe = document.querySelector('.chatbot-iframe[data-theme-injected="true"]');
      try {
        const child = iframe && iframe.contentDocument;
        const focused = child && child.activeElement && child.activeElement.id === 'input';
        keyboardOpen = !!focused && viewportBaseline - height > 140;
        if (child) child.documentElement.classList.toggle('keyboard-open', keyboardOpen);
      } catch (error) {}
      document.documentElement.classList.toggle('keyboard-open', keyboardOpen);
    });
  }
  window.addEventListener('resize', updateChatViewport, {passive:true});
  window.addEventListener('orientationchange', function () { viewportBaseline = 0; updateChatViewport(); });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateChatViewport, {passive:true});
    window.visualViewport.addEventListener('scroll', updateChatViewport, {passive:true});
  }

  function injectChatbotTheme() {
    const container = document.querySelector('.chatbot-iframe-box');
    if (!container) return;

    try {
      const modernHtml = buildModernHtml();
      const freshIframe = document.createElement('iframe');
      freshIframe.className = 'chatbot-iframe';
      freshIframe.title = 'GustAvo Evoluto — Chatbot';
      freshIframe.allow = "microphone 'self'; autoplay 'self' https://gustavo1.avoprogetti.it";
      freshIframe.setAttribute('scrolling', 'no');
      freshIframe.setAttribute('data-theme-injected', 'true');
      freshIframe.addEventListener('load', updateChatViewport);
      freshIframe.srcdoc = modernHtml;
      
      container.replaceChildren(freshIframe);
      console.info('GustAvo: Modern UI caricata istantaneamente con successo!');
    } catch (err) {
      console.error('GustAvo: Errore rendering Modern UI:', err);
    }
  }

  const UI_STORAGE_KEY = 'gustavo_chat_ui_mode';

  function getUiMode() {
    try {
      return sessionStorage.getItem(UI_STORAGE_KEY) || 'modern';
    } catch (e) {
      return 'modern';
    }
  }

  function setUiMode(mode) {
    try {
      sessionStorage.setItem(UI_STORAGE_KEY, mode);
      localStorage.removeItem(UI_STORAGE_KEY);
    } catch (e) {}

    updateUiSwitcherButtons(mode);

    const container = document.querySelector('.chatbot-iframe-box');
    if (!container) return;

    if (mode === 'legacy') {
      const legacyIframe = document.createElement('iframe');
      legacyIframe.className = 'chatbot-iframe';
      legacyIframe.title = 'GustAvo Classico — Chatbot originale';
      legacyIframe.allow = 'microphone; autoplay';
      legacyIframe.setAttribute('scrolling', 'no');
      legacyIframe.src = 'https://gustavo1.avoprogetti.it?' + Date.now();
      container.replaceChildren(legacyIframe);
      console.info('GustAvo: Modalità Legacy pura attivata (gustavo1.avoprogetti.it).');
    } else {
      injectChatbotTheme();
    }
  }

  function updateUiSwitcherButtons(activeMode) {
    const btnModern = document.getElementById('btnUiModern');
    const btnLegacy = document.getElementById('btnUiLegacy');
    if (btnModern) {
      btnModern.classList.toggle('active', activeMode === 'modern');
      btnModern.setAttribute('aria-checked', activeMode === 'modern' ? 'true' : 'false');
    }
    if (btnLegacy) {
      btnLegacy.classList.toggle('active', activeMode === 'legacy');
      btnLegacy.setAttribute('aria-checked', activeMode === 'legacy' ? 'true' : 'false');
    }
  }

  function setupUiSwitcher() {
    try {
      localStorage.removeItem(UI_STORAGE_KEY);
    } catch (e) {}

    const btnModern = document.getElementById('btnUiModern');
    const btnLegacy = document.getElementById('btnUiLegacy');

    if (btnModern) {
      btnModern.onclick = function (e) {
        e.preventDefault();
        setUiMode('modern');
      };
    }

    if (btnLegacy) {
      btnLegacy.onclick = function (e) {
        e.preventDefault();
        setUiMode('legacy');
      };
    }

    updateChatViewport();
    const currentMode = getUiMode();
    setUiMode(currentMode);
  }

  // Esecuzione al caricamento del DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupUiSwitcher);
  } else {
    setupUiSwitcher();
  }
})();
