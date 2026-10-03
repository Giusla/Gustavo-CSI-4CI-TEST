/**
 * GustAvo — Chatbot CSS Theme Injection Script
 * File: assets/js/chatbot-theme-inject.js
 * Scopo: Inietta il tema grafico ufficiale dell'IIS Avogadro / CSI Piemonte
 *        all'interno del chatbot ospitato su gustavo1.avoprogetti.it.
 * 
 * Aggiornamenti:
 * - Avatar interattivo con faccina SVG (pupille e bocca parlante animate).
 * - Logo ufficiale GustAvo nel header (dal footer del sito web).
 * - Rimozione stelline (🌟) dal titolo GustAvo.
 * - Icone SVG Closed/Open Mic sul pulsante microfono.
 * - Icona SVG Amplificatore/Altoparlante sullo switch vocale (TTS).
 * - Text bubbles allineate al design system del sito web.
 */

(function () {
  'use strict';

  // Tema CSS completo e ottimizzato per l'iniezione
  const THEME_CSS = `
:root {
  --brand-green: #00a86b;
  --brand-green-hover: #008f5b;
  --brand-blue: #0066ff;
  --brand-blue-hover: #0052cc;
  --brand-dark: #0f172a;
  --brand-gradient: linear-gradient(135deg, #00a86b 0%, #0066ff 100%);
  --brand-gradient-h: linear-gradient(90deg, #00a86b 0%, #0066ff 100%);
  --bg-page: #f8fafc;
  --bg-surface: #ffffff;
  --border-subtle: #e2e8f0;
  --border-card: #cbd5e1;
  --text-heading: #0f172a;
  --text-body: #334155;
  --text-muted: #64748b;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --shadow-sm: 0 2px 6px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 8px 24px rgba(15, 23, 42, 0.07);
  --shadow-card: 0 16px 40px rgba(15, 23, 42, 0.08), 0 2px 10px rgba(0, 102, 255, 0.04);
  --shadow-glow-blue: 0 0 0 3.5px rgba(0, 102, 255, 0.16);
  --shadow-glow-green: 0 4px 14px rgba(0, 168, 107, 0.28);
}

*, *::before, *::after {
  box-sizing: border-box !important;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
}

html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-height: 100% !important;
  max-height: 100% !important;
  overflow: hidden !important;
  background-color: var(--bg-page) !important;
  background: radial-gradient(circle at 10% 10%, rgba(0, 168, 107, 0.05) 0%, transparent 45%),
              radial-gradient(circle at 90% 90%, rgba(0, 102, 255, 0.05) 0%, transparent 45%),
              var(--bg-page) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#chat-container {
  width: 100% !important;
  max-width: 520px !important;
  height: 100% !important;
  max-height: 100% !important;
  background: var(--bg-surface) !important;
  border-radius: 0 !important;
  border: none !important;
  box-shadow: none !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
}

@media (min-width: 600px) {
  body {
    padding: 12px 16px !important;
  }
  #chat-container {
    height: calc(100% - 24px) !important;
    max-height: calc(100vh - 24px) !important;
    border-radius: var(--radius-lg) !important;
    border: 1px solid var(--border-subtle) !important;
    box-shadow: var(--shadow-card) !important;
  }
}

/* Header Ufficiale Brand GustAvo */
.header {
  background: var(--brand-gradient) !important;
  color: #ffffff !important;
  padding: 16px 20px 14px !important;
  text-align: center !important;
  position: relative !important;
  box-shadow: 0 4px 16px rgba(0, 102, 255, 0.15) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.18) !important;
  flex-shrink: 0 !important;
}

.header::before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  background: radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.16), transparent 70%) !important;
  pointer-events: none !important;
}

/* Logo GustAvo (Icona Mole con robot dal footer) */
.header .logo {
  width: 74px !important;
  height: 74px !important;
  border-radius: var(--radius-md) !important;
  object-fit: contain !important;
  border: 2px solid rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16) !important;
  transition: transform 0.25s ease !important;
  background: #ffffff !important;
  padding: 4px !important;
}

.header .logo:hover {
  transform: scale(1.05) !important;
}

/* Titolo GustAvo senza stelline */
.header h2 {
  margin: 10px 0 0 !important;
  font-size: 1.34rem !important;
  font-weight: 800 !important;
  letter-spacing: -0.025em !important;
  color: #ffffff !important;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) !important;
}

/* Sezione Avatar Robotico SVG GustAvo */
.avatar {
  width: 120px !important;
  height: 120px !important;
  margin: 8px auto 4px !important;
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  filter: drop-shadow(0 6px 16px rgba(0, 102, 255, 0.15)) !important;
  flex-shrink: 0 !important;
}

.avatar-svg {
  width: 120px !important;
  height: 120px !important;
  display: block !important;
}

/* Bocca animata interattiva (TTS) */
#mouth {
  transform-box: fill-box !important;
  transform-origin: center !important;
  transition: height 0.08s ease, y 0.08s ease !important;
}

/* Pupille animate interattive */
.eye.left .pupil, 
.eye.right .pupil {
  transform-box: fill-box !important;
  transform-origin: center !important;
  transition: transform 0.1s ease !important;
}

/* Switch Voce con Icona Amplificatore SVG */
.voice-toggle {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  margin: 6px auto 10px !important;
  padding: 6px 15px !important;
  background: #f1f5f9 !important;
  border: 1px solid var(--border-subtle) !important;
  border-radius: 30px !important;
  font-size: 0.82rem !important;
  font-weight: 600 !important;
  color: var(--text-body) !important;
  cursor: pointer !important;
  user-select: none !important;
  transition: all 0.2s ease !important;
  box-shadow: var(--shadow-sm) !important;
}

.voice-toggle:hover {
  background: #e2e8f0 !important;
  border-color: #cbd5e1 !important;
  color: var(--text-heading) !important;
}

.voice-toggle input[type="checkbox"] {
  accent-color: var(--brand-green) !important;
  cursor: pointer !important;
  width: 15px !important;
  height: 15px !important;
  margin: 0 !important;
}

.voice-toggle label {
  cursor: pointer !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
}

.voice-toggle .amp-svg {
  width: 17px !important;
  height: 17px !important;
  display: block !important;
  color: var(--brand-green) !important;
  transition: transform 0.2s ease, opacity 0.2s ease !important;
}

.voice-toggle input[type="checkbox"]:not(:checked) + label .amp-svg {
  opacity: 0.45 !important;
  color: var(--text-muted) !important;
}

/* Area Conversazione & Messaggi */
#messages {
  flex: 1 1 0% !important;
  overflow-y: auto !important;
  padding: 16px 18px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
  background: #f8fafc !important;
  scroll-behavior: smooth !important;
}

#messages::-webkit-scrollbar {
  width: 6px !important;
}
#messages::-webkit-scrollbar-thumb {
  background: #cbd5e1 !important;
  border-radius: 4px !important;
}
#messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8 !important;
}

/* Text Bubbles (Grafica a tema moderno) */
.msg {
  max-width: 82% !important;
  padding: 13px 18px !important;
  border-radius: 18px !important;
  line-height: 1.55 !important;
  font-size: 0.93rem !important;
  position: relative !important;
  word-break: break-word !important;
  animation: gustavoFadeInMsg 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

@keyframes gustavoFadeInMsg {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Messaggio Utente (Brand Blue) */
.msg.user {
  align-self: flex-end !important;
  background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%) !important;
  color: #ffffff !important;
  border-bottom-right-radius: 4px !important;
  box-shadow: 0 4px 14px rgba(0, 102, 255, 0.22) !important;
}

.msg.user strong,
.msg.user .strong {
  color: rgba(255, 255, 255, 0.95) !important;
  font-weight: 700 !important;
  margin-right: 4px !important;
}

/* Messaggio GustAvo (Card bianca con bordo accent verde brand) */
.msg.bot {
  align-self: flex-start !important;
  background: #ffffff !important;
  color: var(--text-heading) !important;
  border: 1px solid var(--border-subtle) !important;
  border-left: 4px solid var(--brand-green) !important;
  border-bottom-left-radius: 4px !important;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05), 0 1px 3px rgba(0, 168, 107, 0.06) !important;
}

.msg.bot strong,
.msg.bot .strong {
  color: var(--brand-green) !important;
  font-weight: 700 !important;
  margin-right: 4px !important;
}

/* Barra di Input Inferiore */
.input-container {
  padding: 12px 16px !important;
  background: #ffffff !important;
  border-top: 1px solid var(--border-subtle) !important;
  display: flex !important;
  gap: 10px !important;
  align-items: center !important;
  flex-shrink: 0 !important;
  box-shadow: 0 -2px 10px rgba(15, 23, 42, 0.02) !important;
}

#input {
  flex: 1 1 auto !important;
  padding: 11px 18px !important;
  border: 1.5px solid var(--border-card) !important;
  border-radius: 25px !important;
  font-size: 0.92rem !important;
  color: var(--text-heading) !important;
  background: #f8fafc !important;
  transition: all 0.2s ease !important;
}

#input:focus {
  background: #ffffff !important;
  border-color: var(--brand-blue) !important;
  box-shadow: var(--shadow-glow-blue) !important;
  outline: none !important;
}

#input::placeholder {
  color: var(--text-muted) !important;
}

button {
  font-family: inherit !important;
  border: none !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}

/* Pulsante Invia */
button:not(.mic-btn) {
  padding: 11px 22px !important;
  background: linear-gradient(135deg, #00a86b 0%, #008f5b 100%) !important;
  color: #ffffff !important;
  border-radius: 25px !important;
  font-size: 0.9rem !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em !important;
  box-shadow: var(--shadow-glow-green) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

button:not(.mic-btn):hover {
  transform: translateY(-1.5px) !important;
  box-shadow: 0 6px 18px rgba(0, 168, 107, 0.38) !important;
  filter: brightness(1.05) !important;
}

button:not(.mic-btn):active {
  transform: translateY(0) !important;
}

/* Pulsante Microfono (Open / Closed Mic SVG) */
.mic-btn {
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  padding: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  background: linear-gradient(135deg, #0066ff 0%, #0052cc 100%) !important;
  color: #ffffff !important;
  border-radius: 50% !important;
  box-shadow: 0 3px 10px rgba(0, 102, 255, 0.28) !important;
  position: relative !important;
}

.mic-btn .mic-svg {
  width: 22px !important;
  height: 22px !important;
  display: block !important;
  pointer-events: none !important;
}

.mic-btn .mic-open {
  display: none !important;
}

.mic-btn .mic-closed {
  display: block !important;
}

.mic-btn:hover {
  transform: scale(1.06) !important;
  box-shadow: 0 5px 16px rgba(0, 102, 255, 0.38) !important;
}

.mic-btn:active {
  transform: scale(0.96) !important;
}

.mic-btn.listening {
  background: #ef4444 !important;
  box-shadow: 0 0 0 5px rgba(239, 68, 68, 0.28), 0 4px 14px rgba(239, 68, 68, 0.45) !important;
  animation: gustavoPulseMic 1.2s infinite ease-in-out !important;
}

.mic-btn.listening .mic-closed {
  display: none !important;
}

.mic-btn.listening .mic-open {
  display: block !important;
}

@keyframes gustavoPulseMic {
  0% { transform: scale(1.05); }
  50% { transform: scale(1.15); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.2), 0 4px 16px rgba(239, 68, 68, 0.5); }
  100% { transform: scale(1.05); }
}
`;

  // Markup SVG per la faccina del robot GustAvo
  const AVATAR_SVG_HTML = `
    <div class="avatar">
      <svg class="avatar-svg" viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg" aria-label="Avatar GustAvo">
        <defs>
          <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00a86b" />
            <stop offset="100%" stop-color="#0066ff" />
          </linearGradient>
          <filter id="avatarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#0066ff" flood-opacity="0.18" />
          </filter>
        </defs>

        <!-- Antenna -->
        <rect x="58" y="4" width="4" height="15" rx="2" fill="#00a86b" />
        <circle cx="60" cy="5" r="5" fill="#facc15" stroke="#008f5b" stroke-width="1.5" />

        <!-- Cuffie laterali -->
        <rect x="8" y="44" width="11" height="30" rx="5.5" fill="#00a86b" />
        <rect x="101" y="44" width="11" height="30" rx="5.5" fill="#0066ff" />

        <!-- Testa Robot -->
        <rect x="16" y="16" width="88" height="86" rx="28" fill="url(#headGrad)" filter="url(#avatarGlow)" />

        <!-- Visore scuro -->
        <rect x="23" y="24" width="74" height="70" rx="20" fill="#0f172a" />
        <rect x="25" y="26" width="70" height="66" rx="18" fill="#1e293b" />

        <!-- Guance accento -->
        <ellipse cx="34" cy="67" rx="5" ry="3" fill="#00a86b" opacity="0.4" />
        <ellipse cx="86" cy="67" rx="5" ry="3" fill="#0066ff" opacity="0.4" />

        <!-- Occhio sinistro -->
        <g class="eye left">
          <ellipse cx="43" cy="50" rx="9" ry="12" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
          <g class="pupil" style="transition: transform 0.1s ease;">
            <ellipse cx="43" cy="50" rx="6.5" ry="9" fill="#38bdf8" />
            <circle cx="41" cy="47" r="2.2" fill="#ffffff" />
          </g>
        </g>

        <!-- Occhio destro -->
        <g class="eye right">
          <ellipse cx="77" cy="50" rx="9" ry="12" fill="#0f172a" stroke="#334155" stroke-width="1.5" />
          <g class="pupil" style="transition: transform 0.1s ease;">
            <ellipse cx="77" cy="50" rx="6.5" ry="9" fill="#38bdf8" />
            <circle cx="75" cy="47" r="2.2" fill="#ffffff" />
          </g>
        </g>

        <!-- Bocca animata interattiva -->
        <rect id="mouth" x="44" y="74" width="32" height="6" rx="3" fill="#38bdf8" />
      </svg>
    </div>
  `;

  // Markup SVG per il pulsante del microfono (Closed & Open Mic)
  const MIC_BUTTON_HTML = `
    <button id="mic-btn" class="mic-btn" type="button" aria-label="Microfono vocale" title="Attiva/Disattiva dettatura vocale">
      <svg class="mic-svg mic-closed" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
      </svg>
      <svg class="mic-svg mic-open" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
        <path d="M19.5 8.5a6.5 6.5 0 0 1 0 7M21.5 6.5a9.5 9.5 0 0 1 0 11M4.5 8.5a6.5 6.5 0 0 0 0 7M2.5 6.5a9.5 9.5 0 0 0 0 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
    </button>
  `;

  // Markup SVG per lo switch della voce (Amplificatore / Altoparlante)
  const VOICE_LABEL_HTML = `
    <label for="voiceToggle">
      <svg class="amp-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
      </svg>
      <span>Attiva voce</span>
    </label>
  `;

  async function injectChatbotTheme() {
    const iframe = document.querySelector('.chatbot-iframe');
    if (!iframe) return;

    const SERVER_URL = 'https://gustavo1.avoprogetti.it';

    // Risoluzione assoluta del logo GustAvo dal footer
    const gustavoLogoUrl = new URL('assets/img/gustavo_icon.png', window.location.href).href;

    try {
      // 1. Recupero dell'HTML del chatbot dal server ufficiale (CORS: *)
      const response = await fetch(SERVER_URL, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }

      let html = await response.text();

      // Inserisci <base> se mancante per risolvere eventuali risorse relative del server
      if (!html.includes('<base')) {
        html = html.replace('<head>', `<head>\n  <base href="${SERVER_URL}/">`);
      }

      // Link al font Google Inter
      const fontTags = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
`;

      // Iniezione del CSS a tema
      const styleTag = `\n  <style id="gustavo-injected-theme">\n${THEME_CSS}\n  </style>\n`;

      if (html.includes('</head>')) {
        html = html.replace('</head>', fontTags + styleTag + '</head>');
      } else {
        html = fontTags + styleTag + html;
      }

      // 2. Sostituzione Foto con Logo GustAvo (quello del footer)
      html = html.replace(
        /<img[^>]*src=["'][^"']*LogoAvogadro\.png["'][^>]*>/gi,
        `<img src="${gustavoLogoUrl}" class="logo" alt="Logo GustAvo">`
      );

      // 3. Rimozione stelline dal nome GustAvo nel titolo h2
      html = html.replace(/<h2>[\s\S]*?GustAvo[\s\S]*?<\/h2>/gi, '<h2>GustAvo</h2>');
      html = html.replace(/🌟/g, '');

      // 4. Sostituzione faccina HTML con faccina SVG
      html = html.replace(
        /<div class="avatar">[\s\S]*?<\/div>\s*<\/div>/i,
        AVATAR_SVG_HTML.trim()
      );

      // 5. Sostituzione emoji amplificatore / altoparlante
      html = html.replace(
        /<label for=["']voiceToggle["']>[\s\S]*?<\/label>/gi,
        VOICE_LABEL_HTML.trim()
      );

      // 6. Sostituzione emoji microfono con Open & Closed Mic SVG
      html = html.replace(
        /<button id=["']mic-btn["'][^>]*>[\s\S]*?<\/button>/gi,
        MIC_BUTTON_HTML.trim()
      );

      // 7. Miglioramento animazione della bocca SVG nello script
      html = html.replace(
        /function animateMouthStart\(\)\s*\{[\s\S]*?mouthInterval\s*=\s*setInterval\(\(\)\s*=>\s*\{[\s\S]*?\}\s*,\s*80\);/i,
        `function animateMouthStart() {
  mouthInterval = setInterval(() => {
    const h = Math.random() * 16 + 6;
    if (mouth.setAttribute) {
      mouth.setAttribute("height", h);
      mouth.setAttribute("y", 77 - h/2);
      mouth.setAttribute("rx", Math.min(h/2, 4));
    } else {
      mouth.style.height = h + "px";
    }
  }, 80);`
      );

      html = html.replace(
        /function animateMouthStop\(\)\s*\{[\s\S]*?mouth\.style\.height\s*=\s*"10px";/i,
        `function animateMouthStop() {
  clearInterval(mouthInterval);
  clearInterval(eyeInterval);
  if (mouth.setAttribute) {
    mouth.setAttribute("height", "6");
    mouth.setAttribute("y", "74");
    mouth.setAttribute("rx", "3");
  }
  mouth.style.height = "6px";`
      );

      // Normalizzazione script Cloudflare Rocket Loader
      html = html.replace(/type="[a-zA-Z0-9]+-text\/javascript"/g, 'type="text/javascript"');
      html = html.replace(/data-cf-modified-[a-zA-Z0-9]+-=""/g, '');
      html = html.replace(/if\s*\(!window\.__cfRLUnblockHandlers\)\s*return\s*false;\s*/g, '');
      html = html.replace(/<script[^>]*rocket-loader\.min\.js[^>]*><\/script>/gi, '');

      // Rende assoluti gli endpoint API affinché puntino correttamente a gustavo1.avoprogetti.it
      html = html.replace(/fetch\((["'])\/chat\1/g, `fetch($1${SERVER_URL}/chat$1`);
      html = html.replace(/window\.location\.origin\s*\+\s*(["'])\/api\/transcribe\1/g, `"${SERVER_URL}/api/transcribe"`);
      html = html.replace(/([`"'])\/api\/tts\?text=/g, `$1${SERVER_URL}/api/tts?text=`);

      // Carica l'HTML con il tema iniettato nell'iframe
      iframe.srcdoc = html;
      iframe.setAttribute('data-theme-injected', 'true');
      console.info('GustAvo: Tema, logo footer, icone SVG e avatar iniettati con successo!');

    } catch (err) {
      console.warn('GustAvo: Impossibile effettuare fetch per srcdoc (fallback ad iframe diretto):', err);

      // Fallback: Tentativo di iniezione diretta tramite DOM se same-origin
      const tryDirectInjection = () => {
        try {
          const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
          if (doc && !doc.getElementById('gustavo-injected-theme')) {
            const fontLink = doc.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
            doc.head.appendChild(fontLink);

            const style = doc.createElement('style');
            style.id = 'gustavo-injected-theme';
            style.textContent = THEME_CSS;
            doc.head.appendChild(style);

            // Sostituzione logo se presente
            const logo = doc.querySelector('.header .logo');
            if (logo) logo.src = gustavoLogoUrl;

            // Rimozione stelline
            const title = doc.querySelector('.header h2');
            if (title) title.textContent = 'GustAvo';

            iframe.setAttribute('data-theme-injected', 'true');
            console.info('GustAvo: Stile iniettato via contentDocument!');
          }
        } catch (e) {
          // Cross-origin restriction standard
        }
      };

      iframe.addEventListener('load', tryDirectInjection);
      tryDirectInjection();
    }
  }

  // Esecuzione al caricamento del DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectChatbotTheme);
  } else {
    injectChatbotTheme();
  }
})();
