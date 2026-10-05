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
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}

iframe {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  width: 0 !important;
  height: 0 !important;
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
  flex-direction: column !important;
  justify-content: center !important;
  align-items: center !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#chat-container {
  width: 100% !important;
  max-width: 500px !important;
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

.header,
.header *,
.logo,
img.logo,
.header-banner {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  max-height: 0 !important;
  width: 0 !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
  overflow: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Avatar Vecchietto Saggio SVG */
.avatar {
  width: 165px !important;
  height: 165px !important;
  margin: 10px auto 4px !important;
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.12)) !important;
  flex: 0 0 auto !important;
}

.avatar-svg {
  width: 165px !important;
  height: 165px !important;
  display: block !important;
}

#mouth {
  transform-box: fill-box !important;
  transform-origin: center !important;
  transition: height 0.08s ease, y 0.08s ease !important;
}

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
  margin: 4px auto 8px !important;
  padding: 5px 14px !important;
  background: #f1f5f9 !important;
  border: 1px solid var(--border-subtle) !important;
  border-radius: 30px !important;
  font-size: 0.8rem !important;
  font-weight: 600 !important;
  color: var(--text-body) !important;
  cursor: pointer !important;
  user-select: none !important;
  transition: all 0.2s ease !important;
  box-shadow: var(--shadow-sm) !important;
  flex: 0 0 auto !important;
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
  width: 16px !important;
  height: 16px !important;
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
  width: 100% !important;
  overflow-y: auto !important;
  padding: 14px 18px !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
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

/* Text Bubbles */
.msg {
  max-width: 82% !important;
  padding: 12px 16px !important;
  border-radius: 18px !important;
  line-height: 1.5 !important;
  font-size: 0.92rem !important;
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

.msg.bot a:not(.chat-map-btn) {
  color: var(--brand-green) !important;
  text-decoration: underline !important;
  font-weight: 600 !important;
  transition: color 0.15s ease !important;
}

.msg.bot a:not(.chat-map-btn):hover {
  color: var(--brand-green-hover) !important;
}

.msg.bot a.chat-map-btn,
a.chat-map-btn,
.chat-map-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  background: linear-gradient(135deg, #00a86b 0%, #008f5b 100%) !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  font-size: 0.88rem !important;
  font-weight: 700 !important;
  padding: 8px 18px !important;
  border-radius: 22px !important;
  text-decoration: none !important;
  margin: 8px 0 !important;
  box-shadow: 0 4px 14px rgba(0, 168, 107, 0.35) !important;
  transition: all 0.2s ease !important;
  letter-spacing: 0.01em !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
}

.msg.bot a.chat-map-btn:hover,
a.chat-map-btn:hover,
.chat-map-btn:hover {
  background: linear-gradient(135deg, #008f5b 0%, #007a4d 100%) !important;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  text-decoration: none !important;
  transform: translateY(-1.5px) !important;
  box-shadow: 0 6px 20px rgba(0, 168, 107, 0.5) !important;
}

/* Avviso di Sistema / Stato (Badge centrato univoco senza emoji) */
.msg.anti-spam-tip {
  align-self: center !important;
  font-size: 0.78rem !important;
  font-weight: 600 !important;
  color: #b91c1c !important;
  background: rgba(239, 68, 68, 0.09) !important;
  border: 1px solid rgba(239, 68, 68, 0.25) !important;
  border-radius: 20px !important;
  padding: 5px 14px !important;
  box-shadow: none !important;
  animation: gustavoFadeInMsg 0.2s ease !important;
}

/* Barra di Input Inferiore */
.input-container {
  padding: 12px 16px !important;
  background: #ffffff !important;
  border-top: 1px solid var(--border-subtle) !important;
  display: flex !important;
  gap: 10px !important;
  align-items: center !important;
  flex: 0 0 auto !important;
  width: 100% !important;
  box-shadow: 0 -2px 10px rgba(15, 23, 42, 0.02) !important;
}

#input {
  flex: 1 1 auto !important;
  padding: 10px 16px !important;
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

#input:disabled {
  background: #f1f5f9 !important;
  color: var(--text-muted) !important;
  cursor: not-allowed !important;
  border-color: var(--border-subtle) !important;
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
  padding: 10px 20px !important;
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
  min-width: 76px !important;
}

button:not(.mic-btn):hover:not(:disabled) {
  transform: translateY(-1.5px) !important;
  box-shadow: 0 6px 18px rgba(0, 168, 107, 0.38) !important;
  filter: brightness(1.05) !important;
}

button:not(.mic-btn):active:not(:disabled) {
  transform: translateY(0) !important;
}

button.btn-stop-speaking {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35) !important;
  color: #ffffff !important;
}

button.btn-stop-speaking:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.5) !important;
  transform: translateY(-1.5px) !important;
}

button:disabled {
  opacity: 0.65 !important;
  cursor: not-allowed !important;
  transform: none !important;
  filter: none !important;
}

/* Pulsante Microfono */
.mic-btn {
  width: 42px !important;
  height: 42px !important;
  min-width: 42px !important;
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
  width: 20px !important;
  height: 20px !important;
  display: block !important;
  pointer-events: none !important;
}

.mic-btn .mic-open {
  display: none !important;
}

.mic-btn .mic-closed {
  display: block !important;
}

.mic-btn:hover:not(:disabled) {
  transform: scale(1.06) !important;
  box-shadow: 0 5px 16px rgba(0, 102, 255, 0.38) !important;
}

.mic-btn:active:not(:disabled) {
  transform: scale(0.96) !important;
}

/* Microfono in registrazione (Listening) */
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

/* Ottimizzazione Responsive Mobile — Dimensioni fedeli e layout equilibrato */
@media (max-width: 600px) {
  .avatar {
    width: 130px !important;
    height: 130px !important;
    margin: 6px auto 3px !important;
  }
  .avatar-svg {
    width: 130px !important;
    height: 130px !important;
  }
  .voice-toggle {
    margin: 4px auto 6px !important;
    padding: 4px 12px !important;
    font-size: 0.78rem !important;
    gap: 6px !important;
  }
  .voice-toggle .amp-svg {
    width: 15px !important;
    height: 15px !important;
  }
  .voice-toggle input[type="checkbox"] {
    width: 15px !important;
    height: 15px !important;
  }
  #messages {
    padding: 10px 14px !important;
    gap: 10px !important;
  }
  .msg {
    padding: 9px 14px !important;
    font-size: 0.90rem !important;
    line-height: 1.45 !important;
    border-radius: 14px !important;
    max-width: 88% !important;
  }
  .input-container {
    padding: 8px 12px !important;
    gap: 8px !important;
    box-sizing: border-box !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  .input-container input {
    padding: 9px 12px !important;
    font-size: 0.90rem !important;
    height: 40px !important;
    min-width: 0 !important;
    flex: 1 1 0% !important;
    box-sizing: border-box !important;
  }
  .input-container button:not(.mic-btn) {
    padding: 9px 14px !important;
    font-size: 0.85rem !important;
    height: 40px !important;
    min-width: 68px !important;
    flex-shrink: 0 !important;
    box-sizing: border-box !important;
  }
  .mic-btn {
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    flex-shrink: 0 !important;
  }
}

/* Ottimizzazione specifica schermi compatti (< 390px): previene qualsiasi taglio del tasto Invio */
@media (max-width: 390px) {
  .avatar {
    width: 125px !important;
    height: 125px !important;
    margin: 4px auto 2px !important;
  }
  .avatar-svg {
    width: 125px !important;
    height: 125px !important;
  }
  .input-container {
    padding: 6px 8px !important;
    gap: 6px !important;
    box-sizing: border-box !important;
    width: 100% !important;
    max-width: 100% !important;
  }
  .input-container input {
    padding: 7px 10px !important;
    font-size: 0.84rem !important;
    height: 36px !important;
    min-width: 0 !important;
    flex: 1 1 0% !important;
  }
  .input-container button:not(.mic-btn) {
    padding: 7px 10px !important;
    font-size: 0.82rem !important;
    height: 36px !important;
    min-width: 58px !important;
    flex-shrink: 0 !important;
  }
  .mic-btn {
    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    flex-shrink: 0 !important;
  }
}

@media (max-height: 650px) {
  .avatar {
    width: 118px !important;
    height: 118px !important;
    margin: 2px auto 2px !important;
  }
  .avatar-svg {
    width: 118px !important;
    height: 118px !important;
  }
  .voice-toggle {
    margin: 2px auto 4px !important;
    padding: 3px 10px !important;
    font-size: 0.72rem !important;
  }
}

.chat-disclaimer-note {
  font-size: 0.68rem !important;
  color: var(--text-muted) !important;
  text-align: center !important;
  padding: 2px 10px 6px !important;
  line-height: 1.2 !important;
  opacity: 0.85 !important;
  user-select: none !important;
  flex: 0 0 auto !important;
  background: var(--bg-surface) !important;
}

.chat-disclaimer-note a {
  color: var(--brand-blue) !important;
  text-decoration: underline !important;
  text-decoration-color: var(--brand-blue) !important;
  text-underline-offset: 2px !important;
  font-weight: 600 !important;
}

.chat-disclaimer-note a:hover {
  color: var(--brand-blue-hover) !important;
}

.input-container button.btn-stop-speaking {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35) !important;
  cursor: pointer !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  font-weight: 700 !important;
  letter-spacing: 0.5px !important;
  animation: pulseStopBtn 1.2s infinite ease-in-out !important;
}

.input-container button.btn-stop-speaking:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%) !important;
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.45) !important;
  transform: translateY(-1px) !important;
}

@keyframes pulseStopBtn {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4), 0 4px 12px rgba(239, 68, 68, 0.35);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(239, 68, 68, 0), 0 4px 14px rgba(239, 68, 68, 0.5);
  }
}
`;

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
          <g class="pupil" id="left-pupil" style="transition: transform 0.1s ease;">
            <ellipse cx="47" cy="67" rx="7" ry="8.5" fill="#0f172a" />
            <circle cx="45" cy="64.5" r="2.6" fill="#ffffff" />
            <circle cx="49" cy="69" r="1.2" fill="#ffffff" opacity="0.7" />
          </g>
        </g>

        <!-- Occhio destro con pupilla mobile -->
        <g class="eye right">
          <g class="pupil" id="right-pupil" style="transition: transform 0.1s ease;">
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

  const mouthAndBotSpeakLogic = String.raw`
let _isSpeaking = false;
let _currentAudio = null;
let _speechTimeout = null;
let _ttsAbortController = null;
const _ttsAudioCache = new Map();
let _ttsNativeSpeaking = false;

// Pre-riscaldamento e sblocco contesto audio su browser mobile
function _unlockAudioContext() {
  try {
    const silent = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
    silent.play().catch(() => {});
  } catch (e) {}
}
window.addEventListener("click", _unlockAudioContext, { once: true, passive: true });
window.addEventListener("touchstart", _unlockAudioContext, { once: true, passive: true });

function setSpeakingState(speaking) {
  _isSpeaking = !!speaking;
  const _inp = document.getElementById("input");
  const _btn = document.getElementById("btn-send") || document.querySelector('.input-container button:not(.mic-btn)');
  const _mic = document.getElementById("mic-btn");

  if (_isSpeaking) {
    if (_inp) {
      _inp.value = "";
      _inp.disabled = true;
      _inp.placeholder = "Gustavo sta parlando...";
    }
    if (_btn) {
      _btn.disabled = false;
      _btn.innerText = "Stop";
      _btn.classList.add('btn-stop-speaking');
      _btn.title = "Ferma la voce di GustAvo";
    }
    if (_mic) {
      _mic.disabled = true;
    }
  } else {
    if (_inp) {
      _inp.disabled = false;
      _inp.placeholder = "Scrivi un messaggio...";
    }
    if (_btn) {
      _btn.disabled = false;
      _btn.innerText = "Invia";
      _btn.classList.remove('btn-stop-speaking');
      _btn.title = "Invia";
    }
    if (_mic) {
      _mic.disabled = false;
    }
    setMicLedState(false);
  }
}

function stopSpeaking() {
  if (_ttsAbortController) {
    try { _ttsAbortController.abort(); } catch (e) {}
    _ttsAbortController = null;
  }
  if (_speechTimeout) {
    clearTimeout(_speechTimeout);
    _speechTimeout = null;
  }
  if (_currentAudio) {
    try {
      _currentAudio.pause();
      _currentAudio.currentTime = 0;
    } catch (e) {}
    _currentAudio = null;
  }
  if (window.speechSynthesis && window.speechSynthesis.speaking) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  _ttsNativeSpeaking = false;
  animateMouthStop();
  setSpeakingState(false);
}

function setMicLedState(speaking) {
  const _led = document.getElementById("mic-led");
  if (_led) {
    _led.setAttribute("fill", speaking ? "#00a86b" : "#ef4444");
  }
}

function animateMouthStart() {
  setMicLedState(true);
  if (mouthInterval) clearInterval(mouthInterval);
  if (eyeInterval) clearInterval(eyeInterval);

  mouthInterval = setInterval(() => {
    const h = Math.random() * 14 + 5;
    if (mouth && mouth.setAttribute) {
      mouth.setAttribute("height", h);
      mouth.setAttribute("y", 96 - h/2);
      mouth.setAttribute("rx", Math.min(h/2, 4));
    } else if (mouth) {
      mouth.style.height = h + "px";
    }
  }, 75);

  eyeInterval = setInterval(() => {
    const x = Math.random() * 6 - 3;
    const y = Math.random() * 6 - 3;
    if (leftP) leftP.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    if (rightP) rightP.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }, 85);
}

function animateMouthStop() {
  setMicLedState(false);
  if (mouthInterval) clearInterval(mouthInterval);
  if (eyeInterval) clearInterval(eyeInterval);
  mouthInterval = null;
  eyeInterval = null;

  if (mouth && mouth.setAttribute) {
    mouth.setAttribute("height", "6");
    mouth.setAttribute("y", "93");
    mouth.setAttribute("rx", "3");
  } else if (mouth) {
    mouth.style.height = "6px";
  }
  if (leftP) leftP.style.transform = "translate(0,0)";
  if (rightP) rightP.style.transform = "translate(0,0)";
}

function formatBotMessage(text) {
  if (!text) return "";
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="chat-map-btn">$1</a>')
    .replace(/(^|[^"'])(https:\/\/openlevelup\.net[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener" class="chat-map-btn">Mappa OpenLevelUp ↗</a>')
    .replace(/\n/g, '<br>');
}

function speakWithWebSpeechFallback(text) {
  if (!window.speechSynthesis) {
    stopSpeaking();
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'it-IT';
    utt.rate = 1.05;
    utt.pitch = 0.98;
    utt.onstart = () => {
      animateMouthStart();
      setSpeakingState(true);
    };
    utt.onend = () => {
      stopSpeaking();
    };
    utt.onerror = () => {
      stopSpeaking();
    };
    _ttsNativeSpeaking = true;
    window.speechSynthesis.speak(utt);
  } catch (e) {
    stopSpeaking();
  }
}

function playTtsAudioUrl(audioUrl, textForFallback) {
  const audio = new Audio(audioUrl);
  audio.preload = "auto";
  _currentAudio = audio;

  audio.onplay = () => {
    animateMouthStart();
    setSpeakingState(true);
  };

  audio.onended = () => {
    stopSpeaking();
  };

  audio.onerror = (e) => {
    console.error("Errore playback audio:", e);
    if (textForFallback) {
      speakWithWebSpeechFallback(textForFallback);
    } else {
      stopSpeaking();
    }
  };

  audio.play().catch(err => {
    console.warn("Audio play bloccato o ritardato, fallback a Web Speech:", err);
    if (textForFallback) {
      speakWithWebSpeechFallback(textForFallback);
    } else {
      stopSpeaking();
    }
  });
}

function botSpeak(rawText) {
  stopSpeaking();

  const cleanText = (rawText || "")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, '')
    .trim();

  const cleanForTts = cleanText
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*_~\x60#]/g, ' ')
    .replace(/↗/g, '')
    .replace(/[➔→↓]/g, ' poi ')
    .replace(/\s+/g, ' ')
    .trim();

  const p = document.createElement("div");
  p.className = 'msg bot';
  p.innerHTML = '<span class="strong">GustAvo:</span> ' + formatBotMessage(cleanText);
  messages.appendChild(p);
  requestAnimationFrame(() => {
    messages.scrollTop = messages.scrollHeight;
  });

  const voiceEnabled = voiceToggle && voiceToggle.checked;
  if (!voiceEnabled || !cleanForTts) {
    setSpeakingState(false);
    return;
  }

  setSpeakingState(true);
  animateMouthStart();

  // 1. Verifica immediata nella Cache Audio Client (0ms latency per risposte già generate)
  if (_ttsAudioCache.has(cleanForTts)) {
    const cachedUrl = _ttsAudioCache.get(cleanForTts);
    playTtsAudioUrl(cachedUrl, cleanForTts);
    return;
  }

  // 2. Fetch asincrono ultra-ottimizzato con timeout rapido e fallback
  _ttsAbortController = new AbortController();
  const signal = _ttsAbortController.signal;
  const ttsUrl = "https://gustavo1.avoprogetti.it/api/tts?text=" + encodeURIComponent(cleanForTts);

  let hasResponded = false;
  const ttsTimeoutId = setTimeout(() => {
    if (!hasResponded && _isSpeaking) {
      hasResponded = true;
      console.warn("TTS API lenta o non responsiva, passaggio immediato a Web Speech");
      if (_ttsAbortController) {
        try { _ttsAbortController.abort(); } catch (e) {}
      }
      speakWithWebSpeechFallback(cleanForTts);
    }
  }, 3000);

  fetch(ttsUrl, { signal, cache: "force-cache" })
    .then(res => {
      if (!res.ok) throw new Error("TTS status " + res.status);
      return res.blob();
    })
    .then(blob => {
      if (hasResponded) return;
      hasResponded = true;
      clearTimeout(ttsTimeoutId);

      const blobUrl = URL.createObjectURL(blob);
      if (_ttsAudioCache.size > 80) {
        const oldestKey = _ttsAudioCache.keys().next().value;
        try { URL.revokeObjectURL(_ttsAudioCache.get(oldestKey)); } catch (e) {}
        _ttsAudioCache.delete(oldestKey);
      }
      _ttsAudioCache.set(cleanForTts, blobUrl);

      if (_isSpeaking) {
        playTtsAudioUrl(blobUrl, cleanForTts);
      }
    })
    .catch(err => {
      if (err.name === 'AbortError') return;
      if (!hasResponded && _isSpeaking) {
        hasResponded = true;
        clearTimeout(ttsTimeoutId);
        speakWithWebSpeechFallback(cleanForTts);
      }
    });
}
`;

  const robustSendLogic = String.raw`
function getLocalIntents() {
  if (typeof window !== "undefined" && window.GUSTAVO_INTENTS_DATA && Array.isArray(window.GUSTAVO_INTENTS_DATA.intents)) {
    return window.GUSTAVO_INTENTS_DATA.intents;
  }
  if (typeof window !== "undefined" && window.parent && window.parent.GUSTAVO_INTENTS_DATA && Array.isArray(window.parent.GUSTAVO_INTENTS_DATA.intents)) {
    return window.parent.GUSTAVO_INTENTS_DATA.intents;
  }
  return [];
}

const BAD_WORDS_REGEX = /\b(cazzo|cazzi|cazzata|cazzate|merda|merde|merdaccia|vaffanculo|fanculo|vaffanbagno|stronzo|stronzi|stronza|stronze|coglione|coglioni|coglioneria|puttana|puttane|troia|troie|bastardo|bastardi|bastarda|bastarde|porco\s+dio|dio\s+cane|madonna\s+puttana|porca\s+madonna|vaffan|idiota|deficiente|scemo|cretino|fancazzista)\b/gi;

function filterProfanity(text) {
  if (!text) return "";
  return text.replace(BAD_WORDS_REGEX, (match) => {
    if (match.length <= 2) return "**";
    return match[0] + "*".repeat(match.length - 2) + match[match.length - 1];
  });
}

function isExclusivelyProfane(text) {
  const stripped = text.replace(BAD_WORDS_REGEX, "").replace(/[^a-zA-Z0-9]/g, "").trim();
  return stripped.length === 0;
}

function normalizeNlpText(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP_WORDS_SET = new Set([
  "il", "lo", "la", "i", "gli", "le", "un", "uno", "una",
  "di", "a", "da", "in", "con", "su", "per", "tra", "fra",
  "e", "ed", "o", "od", "che", "chi", "cui", "quale", "quali", "quanto", "quanti",
  "mi", "ti", "si", "ci", "vi", "ne", "me", "te", "noi", "voi",
  "lui", "lei", "loro", "mio", "tuo", "suo", "nostro", "vostro",
  "del", "dello", "della", "dei", "degli", "delle",
  "al", "allo", "alla", "ai", "agli", "alle",
  "nel", "nello", "nella", "nei", "negli", "nelle",
  "sul", "sullo", "sulla", "sui", "sugli", "sulle",
  "dal", "dallo", "dalla", "dai", "dagli", "dalle",
  "sono", "sei", "e'", "ce", "c'e", "ce'", "ci", "sta", "stanno",
  "trova", "trovano", "trovo", "trovare", "trovarsi", "situato", "situata", "situati", "situate",
  "posizionato", "posizionata", "posizionati", "posizione", "ubicato", "ubicata",
  "andare", "arrivare", "raggiungere", "vedere", "sapere", "dimmi", "puoi", "dirmi",
  "spiegarmi", "mostrami", "cosa", "come", "dove", "dov", "quando", "perche"
]);

function tokenizeQuery(text) {
  const words = normalizeNlpText(text).split(" ").filter(w => w.length > 0);
  return words.filter(w => !STOP_WORDS_SET.has(w) && (w.length > 1 || /^\d+$/.test(w)));
}


function normalizeSpokenRoomQuery(query, intents) {
  const units = ['zero','uno','due','tre','quattro','cinque','sei','sette','otto','nove'];
  const teens = ['dieci','undici','dodici','tredici','quattordici','quindici','sedici','diciassette','diciotto','diciannove'];
  function numberWord(n) {
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      const tens = ['','','venti','trenta','quaranta','cinquanta','sessanta','settanta','ottanta','novanta'];
      const unit = n % 10;
      let prefix = tens[Math.floor(n / 10)];
      if (unit === 1 || unit === 8) prefix = prefix.slice(0, -1);
      return prefix + (unit ? units[unit] : '');
    }
    return (n < 200 ? '' : units[Math.floor(n / 100)]) + 'cento' + (n % 100 ? numberWord(n % 100) : '');
  }
  const normalized = normalizeNlpText(query);
  const matches = [];
  for (const intent of intents) {
    if (!intent.room) continue;
    const code = intent.room.name.match(/\b(\d+)\s*\(o\s*(\d+)\/(\d+)\)/);
    if (!code) continue;
    const floor = numberWord(Number(code[2]));
    const room = numberWord(Number(code[3]));
    const variants = [...(intent.room.spokenAliases || []), floor + ' ' + room, floor + ' barra ' + room, floor + ' slash ' + room, numberWord(Number(code[1]))];
    for (const variant of variants) {
      const alias = normalizeNlpText(variant);
      if ((' ' + normalized + ' ').includes(' ' + alias + ' ')) matches.push({alias, code:code[1]});
    }
  }
  matches.sort((a,b) => b.alias.length - a.alias.length);
  if (!matches.length) return query;
  const best = matches[0];
  return (' ' + normalized + ' ').replace(' ' + best.alias + ' ', ' ' + best.code + ' ').trim();
}

function matchLocalIntent(query) {
  if (!query) return null;
  const intents = getLocalIntents();
  query = normalizeSpokenRoomQuery(query, intents);
  const norm = normalizeNlpText(query.replace(/(\d)\s*\/\s*(\d)/g, '$1/$2'));
  const tokens = tokenizeQuery(query);
  const rooms = intents.filter(i => i.room);
  const reply = text => ({intent:{responses:[text]},score:1});
  const numbers = norm.match(/\b\d+\b/g) || [];
  if (/^(fisica|misure|laboratorio linguistico|linguistico|disegno|matematica|informatica)$/.test(norm)) return reply('Specifica il laboratorio: per esempio fisica 1 o 2, misure 1 o 2, linguistico 1 o 2, matematica biennio o triennio.');
  const candidates = rooms.map(intent => {
    let score = 0;
    for (const pattern of intent.patterns) {
      const p = normalizeNlpText(pattern);
      if (norm === p) { score = 10000; break; }
      const pn = p.match(/\b\d+\b/g) || [];
      if (numbers.join(',') !== pn.join(',')) continue;
      if ((' ' + norm + ' ').includes(' ' + p + ' ')) score = Math.max(score, 100 + p.length);
      const pt = tokenizeQuery(pattern);
      if (pt.length && pt.every(t => tokens.includes(t)) && tokens.every(t => pt.includes(t) || ['arrivo','raggiungo','vorrei','cerco','indicazioni','percorso','portami','andare','avogadro'].includes(t))) {
        score = Math.max(score, 50 + pt.length);
      }
    }
    return {intent,score};
  }).filter(i => i.score > 0).sort((a,b) => b.score-a.score);
  if (candidates.length && (!candidates[1] || candidates[0].score > candidates[1].score)) return candidates[0];
  if (candidates.length) return reply('Quale aula intendi? Specifica il nome completo o il numero: ' + candidates.filter(i=>i.score===candidates[0].score).map(i=>i.intent.room.name).join(', ') + '.');
  if (numbers.length && (/\b(aula|laboratorio|lab|stanza)\b/.test(norm) || /^\d+( \d+)?$/.test(norm))) return reply('Non ho un percorso verificato per questa aula. Controlla il numero completo (per esempio 224 oppure 2/24) o chiedi conferma in portineria.');
  // Ask for a distinguishing name instead of guessing among related laboratories.
  if (/\b(aula|laboratorio|lab|fisica|misure|linguistico|disegno|matematica|informatica|automazione)\b/.test(norm)) {
    const key = tokens.filter(t=>!['aula','laboratorio','lab','arrivo','cerco','indicazioni','percorso'].includes(t));
    const options = rooms.filter(i=>i.room.aliases.some(a=>key.length && key.every(t=>tokenizeQuery(a).includes(t))));
    if (options.length) return reply('Puoi specificare quale aula cerchi? ' + options.map(i=>i.room.name).join(', ') + '.');
    return reply('Quale aula cerchi? Scrivi il nome completo del laboratorio oppure il numero dell’aula.');
  }
  let best = null;
  let bestScore = 0;
  let secondScore = 0;
  for (const intent of intents.filter(i=>!i.room && i.tag!=='fallback')) {
    let score = 0;
    for (const pattern of intent.patterns || []) {
      const p = normalizeNlpText(pattern);
      if (norm === p) return {intent,score:1};
      const pt = tokenizeQuery(pattern);
      const overlap = tokens.filter(t=>pt.includes(t)).length;
      score = Math.max(score, overlap / (new Set([...tokens,...pt]).size || 1));
    }
    if (score > bestScore) {secondScore=bestScore;bestScore=score;best=intent;} else secondScore=Math.max(secondScore,score);
  }
  return best && bestScore >= 0.65 && bestScore-secondScore >= 0.1 ? {intent:best,score:bestScore} : null;
}

let _lastUserMessageAt = -Infinity;
let _sendInFlight = false;

async function sendMessage() {
  const inp = document.getElementById("input");
  const rawMsg = inp ? inp.value.trim() : "";

  if (_isSpeaking) {
    if (rawMsg) {
      setSpeakingState(true);
    } else {
      stopSpeaking();
    }
    return;
  }
  if (!rawMsg || _sendInFlight || Date.now() - _lastUserMessageAt < 1000) return;
  _lastUserMessageAt = Date.now();
  _sendInFlight = true;
  try {
  const censoredMsg = filterProfanity(rawMsg);
  const containsBadWord = BAD_WORDS_REGEX.test(rawMsg);
  BAD_WORDS_REGEX.lastIndex = 0;

  if (inp) {
    inp.value = "";
    inp.focus();
  }

  const bubble = document.createElement("div");
  bubble.className = "msg user";
  bubble.innerHTML = '<span class="strong">Tu:</span> ' + censoredMsg;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;

  // 1. Controllo linguaggio inappropriato / insulti
  if (containsBadWord && isExclusivelyProfane(rawMsg)) {
    await new Promise(resolve => setTimeout(resolve, 250));
    botSpeak("Ti invito a mantenere un linguaggio consono ed educato nel rispetto dell'ambiente scolastico. Come posso aiutarti con le informazioni sull'IIS Avogadro?");
    return;
  }

  // 2. Classificazione locale con intents.json
  const localMatch = matchLocalIntent(rawMsg);
  if (localMatch && localMatch.intent && localMatch.intent.responses && localMatch.intent.responses.length > 0) {
    const responses = localMatch.intent.responses;
    const pickedResponse = responses[Math.floor(Math.random() * responses.length)];
    botSpeak(pickedResponse);
    return;
  }

  // 3. Fallback con il server remoto o fallback locale
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const res = await fetch("https://gustavo1.avoprogetti.it/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: rawMsg }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    let reply = data.answer;
    if (!reply || reply === "Non ho capito bene." || reply.trim().length === 0) {
      const intentsList = getLocalIntents();
      const fallbackItem = intentsList.find(i => i.tag === "fallback");
      reply = (fallbackItem && fallbackItem.responses && fallbackItem.responses[0]) || "Non ho compreso la domanda. Prova a chiedermi informazioni su corsi, segreteria, orari o servizi dell'Avogadro!";
    }
    botSpeak(reply);
  } catch (err) {
    const intentsList = getLocalIntents();
    const fallbackItem = intentsList.find(i => i.tag === "fallback");
    const reply = (fallbackItem && fallbackItem.responses && fallbackItem.responses[0]) || "Non ho compreso la domanda. Prova a chiedermi informazioni su corsi, segreteria, orari o servizi dell'Avogadro!";
    botSpeak(reply);
  }
  } finally {
    _sendInFlight = false;
  }
}
`;

  const microphoneLogic = String.raw`
    const micBtn = document.getElementById('mic-btn');
    const preferRecording = /(?:OPR|Opera)\/|Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(navigator.userAgent || ''));
    const Recognition = preferRecording ? null : window.SpeechRecognition || window.webkitSpeechRecognition;
    const createRecognition = window.parent && window.parent.GUSTAVO_CREATE_RECOGNITION;
    let recognition = null;
    let stopRequested = false;
    let recorder = null;
    let micStream = null;
    let micBusy = false;
    let micTimer = null;
    let micStatus = null;

    function showMicStatus(text) {
      if (!micStatus) {
        micStatus = document.createElement('div');
        micStatus.className = 'msg anti-spam-tip';
        micStatus.setAttribute('role', 'status');
        messages.appendChild(micStatus);
      }
      micStatus.textContent = text;
      messages.scrollTop = messages.scrollHeight;
    }
    function resetMic() {
      clearTimeout(micTimer);
      micTimer = null;
      if (micStream) micStream.getTracks().forEach(track => track.stop());
      micStream = null;
      micBusy = false;
      micBtn.classList.remove('listening');
      micBtn.setAttribute('aria-pressed', 'false');
      micBtn.title = 'Parla con Gustavo';
      micBtn.setAttribute('aria-label', 'Parla con Gustavo');
      micBtn.disabled = _isSpeaking;
    }
    function acceptTranscript(text) {
      const transcript = String(text || '').trim();
      if (!transcript) { showMicStatus('Non ho sentito parole. Premi il microfono e riprova.'); return; }
      if (_isSpeaking || _sendInFlight) { showMicStatus('Gustavo sta rispondendo. Riprova quando ha finito.'); return; }
      input.value = transcript;
      showMicStatus('Trascrizione completata.');
      // During the one-second cooldown keep the transcript available for manual sending.
      if (Date.now() - _lastUserMessageAt >= 1000) sendMessage();
    }
    async function startRecording() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
        throw new Error('Questo browser non supporta la registrazione. Prova con Chrome o Edge.');
      }
      micStream = await navigator.mediaDevices.getUserMedia({audio:true});
      const mime = ['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(type => MediaRecorder.isTypeSupported(type));
      recorder = new MediaRecorder(micStream, mime ? {mimeType:mime} : {});
      const chunks = [];
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      recorder.onerror = () => { resetMic(); showMicStatus('Registrazione non riuscita. Riprova.'); };
      recorder.onstop = async () => {
        if (micStream) micStream.getTracks().forEach(track => track.stop());
        micStream = null;
        clearTimeout(micTimer);
        micBtn.classList.remove('listening');
        micBtn.disabled = true;
        showMicStatus('Trascrizione in corso...');
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        try {
          const type = recorder.mimeType || mime || 'audio/webm';
          const blob = new Blob(chunks, {type});
          if (!blob.size) throw new Error('Registrazione vuota. Premi il microfono e riprova.');
          const form = new FormData();
          const extension = type.includes('mp4') ? 'mp4' : type.includes('ogg') ? 'ogg' : 'webm';
          form.append('audio', blob, 'voice.' + extension);
          const response = await fetch(SERVER_URL + '/api/transcribe', {method:'POST',body:form,signal:controller.signal});
          if (!response.ok) throw new Error('Il servizio di trascrizione non è disponibile. Prova con Chrome o Edge.');
          const data = await response.json();
          acceptTranscript(data.text || data.transcript || data.transcription);
        } catch (error) {
          showMicStatus(error.name === 'AbortError' ? 'La trascrizione ha impiegato troppo tempo. Riprova.' : error.message || 'Trascrizione non riuscita. Riprova.');
        } finally { clearTimeout(timeout); resetMic(); }
      };
      recorder.start();
      micBtn.classList.add('listening');
      micBtn.setAttribute('aria-pressed','true');
      micBtn.title = 'Termina registrazione';
      showMicStatus('Sto ascoltando. Premi di nuovo il microfono quando hai finito.');
      micTimer = setTimeout(() => { if (recorder.state === 'recording') recorder.stop(); }, 30000);
    }
    if (micBtn) {
      micBtn.setAttribute('aria-pressed', 'false');
      micBtn.addEventListener('click', async () => {
        if (_isSpeaking || _sendInFlight) return;
        if (recognition) { stopRequested = true; recognition.stop(); return; }
        if (recorder && recorder.state === 'recording') { recorder.stop(); return; }
        if (micBusy) return;
        micBusy = true;
        stopRequested = false;
        micBtn.classList.add('listening');
        micBtn.setAttribute('aria-pressed', 'true');
        micBtn.setAttribute('aria-label', 'Termina ascolto');
        micBtn.title = 'Termina ascolto';
        showMicStatus('Attivazione microfono...');
        try {
          recognition = preferRecording ? null : createRecognition ? createRecognition() : Recognition ? new Recognition() : null;
          if (recognition) {
            recognition.lang = 'it-IT';
            recognition.continuous = true;
            recognition.interimResults = true;
            let transcript = '';
            let interimTranscript = '';
            let emptyRestarts = 0;
            let failed = false;
            let useRecording = false;
            recognition.onstart = () => {
              micBtn.classList.add('listening');
              micBtn.setAttribute('aria-pressed','true');
              micBtn.title = 'Termina ascolto';
              showMicStatus('Sto ascoltando. Parla ora.');
            };
            recognition.onaudiostart = () => showMicStatus('Microfono attivo. Parla ora, poi premi Stop.');
            recognition.onspeechstart = () => showMicStatus('Voce rilevata. Sto trascrivendo...');
            recognition.onresult = event => {
              transcript = '';
              interimTranscript = '';
              for (let i = 0; i < event.results.length; i++) {
                const text = event.results[i][0].transcript;
                if (event.results[i].isFinal) transcript += text + ' ';
                else interimTranscript += text + ' ';
              }
              const heard = (transcript + interimTranscript).trim();
              if (heard) showMicStatus('Ho sentito: ' + heard + '. Premi il pulsante rosso per inviare.');
            };
            recognition.onerror = event => {
              failed = true;
              useRecording = ['network', 'no-speech', 'service-not-allowed'].includes(event.error);
              const errors = {'not-allowed':'Consenti l’accesso al microfono nelle impostazioni del browser.', 'service-not-allowed':'Il browser non consente il riconoscimento vocale.', 'audio-capture':'Microfono non disponibile. Controlla che sia collegato.', 'no-speech':'Non ho sentito parole. Premi il microfono e riprova.', 'network':'Il riconoscimento vocale non riesce a connettersi. Controlla la connessione.'};
              showMicStatus(errors[event.error] || 'Riconoscimento vocale non riuscito. Riprova.');
            };
            recognition.onend = async () => {
              const heard = (transcript + interimTranscript).trim();
              // Some browsers end their first session before audio arrives.
              if (!failed && !stopRequested && !heard && emptyRestarts < 2) {
                emptyRestarts++;
                try { recognition.start(); return; } catch (error) {
                  failed = true;
                  showMicStatus('Il browser non riesce ad avviare l’ascolto. Controlla il permesso microfono e riprova.');
                }
              }
              recognition = null;
              resetMic();
              if (!heard && (useRecording || !failed)) {
                micBusy = true;
                showMicStatus('Passo alla registrazione audio. Parla di nuovo e premi Stop quando hai finito.');
                try { await startRecording(); } catch (error) {
                  resetMic();
                  showMicStatus(error.name === 'NotAllowedError' ? 'Consenti l’accesso al microfono nelle impostazioni del browser.' : error.message || 'Impossibile avviare la registrazione audio.');
                }
                return;
              }
              if (heard) acceptTranscript(heard);
            };
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
              throw new Error('Il microfono richiede una pagina HTTPS e un browser compatibile.');
            }
            // Request permission from the click, including browsers with native recognition.
            micStream = await navigator.mediaDevices.getUserMedia({audio:true});
            micStream.getTracks().forEach(track => track.stop());
            micStream = null;
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
              throw new Error('Il microfono richiede una pagina HTTPS e un browser compatibile.');
            }
            // Request permission from the click, including browsers with native recognition.
            micStream = await navigator.mediaDevices.getUserMedia({audio:true});
            micStream.getTracks().forEach(track => track.stop());
            micStream = null;
            recognition.start();
            micTimer = setTimeout(() => { if (recognition) { stopRequested = true; recognition.stop(); } }, 30000);
          } else await startRecording();
        } catch (error) {
          recognition = null;
          resetMic();
          showMicStatus(error.name === 'NotAllowedError' ? 'Consenti l’accesso al microfono nelle impostazioni del browser.' : error.message || 'Impossibile avviare il microfono.');
        }
      });
      window.addEventListener('pagehide', () => {
        if (recognition) { stopRequested = true; recognition.onend = null; recognition.abort(); }
        if (recorder && recorder.state === 'recording') { recorder.onstop = null; recorder.stop(); }
        resetMic();
      });
    }

`;

  function buildModernHtml() {
    const intentsJson = JSON.stringify(
      (typeof window !== 'undefined' && window.GUSTAVO_INTENTS_DATA) || 
      (typeof window !== 'undefined' && window.parent && window.parent.GUSTAVO_INTENTS_DATA) || 
      { intents: [] }
    );

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
  <style id="gustavo-injected-theme">
${THEME_CSS}
  </style>
</head>
<body>
  <div id="chat-container">
    <div class="header"></div>
    ${AVATAR_SVG_HTML.trim()}
    <div class="voice-toggle">
      <input type="checkbox" id="voiceToggle" checked>
      ${VOICE_LABEL_HTML.trim()}
    </div>
    <div id="messages">
      <div class="msg bot">
        <span class="strong">GustAvo:</span> Ciao! Sono GustAvo, l'assistente virtuale dell'IIS Avogadro. Chiedimi pure informazioni su corsi, aule, laboratori, orari o segreteria!
      </div>
    </div>
    <div class="input-container">
      <input type="text" id="input" placeholder="Scrivi un messaggio..." autocomplete="off">
      <button id="btn-send" onclick="sendMessage()">Invia</button>
      ${MIC_BUTTON_HTML.trim()}
    </div>
    <div class="chat-disclaimer-note">GustAvo è un assistente virtuale e può commettere errori. Verifica le informazioni in segreteria o su <a href="https://www.itisavogadro.it" target="_blank" rel="noopener">itisavogadro.it</a></div>
  </div>
  <script>
    window.GUSTAVO_INTENTS_DATA = ${intentsJson};
    const SERVER_URL = "https://gustavo1.avoprogetti.it";
    const messages = document.getElementById("messages");
    const input = document.getElementById("input");
    const voiceToggle = document.getElementById("voiceToggle");
    const mouth = document.getElementById("mouth");
    const leftP = document.getElementById("left-pupil") || document.querySelector('.eye.left .pupil');
    const rightP = document.getElementById("right-pupil") || document.querySelector('.eye.right .pupil');
    let mouthInterval = null;
    let eyeInterval = null;

    ${mouthAndBotSpeakLogic}

    ${robustSendLogic}

    ${microphoneLogic}

    if (input) {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (_isSpeaking) {
            setSpeakingState(true);
            return;
          }
          sendMessage();
        }
      });
    }
  <\/script>
</body>
</html>`;
  }

  function injectChatbotTheme() {
    const container = document.querySelector('.chatbot-iframe-box');
    if (!container) return;

    try {
      const modernHtml = buildModernHtml();
      const freshIframe = document.createElement('iframe');
      freshIframe.className = 'chatbot-iframe';
      freshIframe.title = 'Chatbot GustAvo — Interfaccia Moderna';
      freshIframe.allow = 'microphone; autoplay';
      freshIframe.setAttribute('scrolling', 'no');
      freshIframe.setAttribute('data-theme-injected', 'true');
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
      legacyIframe.title = 'Chatbot GustAvo — Server Ufficiale gustavo1.avoprogetti.it';
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
