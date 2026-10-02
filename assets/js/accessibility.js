/**
 * GustAvo — Modulo di Accessibilità Ufficiale (WCAG 2.1 AA/AAA)
 * Istituto Tecnico Amedeo Avogadro, Torino · Classe 5CI
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'gustavo_a11y_prefs';

    const defaultPrefs = {
        textSize: 'normal', // 'normal', 'md', 'lg', 'xl'
        highContrast: false,
        invert: false,
        grayscale: false,
        dyslexicFont: false,
        textSpacing: false,
        alignLeft: false,
        highlightLinks: false,
        bigCursor: false,
        reducedMotion: false,
        readingGuide: false,
        focusVisible: false,
        selectableText: true
    };

    let prefs = Object.assign({}, defaultPrefs);
    let isSpeechReading = false;
    let currentSpeakingElement = null;
    let utteranceId = 0;
    let currentUtterance = null;
    let pageReading = false;
    let lastSelection = '';

    // Carica preferenze dal LocalStorage prima di renderizzare
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            prefs = Object.assign({}, defaultPrefs, JSON.parse(saved));
        }
    } catch (e) {
        console.warn('GustAvo A11y: Errore lettura localStorage', e);
    }

    /**
     * Applica le classi CSS correnti all'elemento <html>
     */
    function applyClasses() {
        const root = document.documentElement;

        // Dimensione testo
        root.classList.remove('a11y-size-md', 'a11y-size-lg', 'a11y-size-xl');
        if (prefs.textSize === 'md') root.classList.add('a11y-size-md');
        if (prefs.textSize === 'lg') root.classList.add('a11y-size-lg');
        if (prefs.textSize === 'xl') root.classList.add('a11y-size-xl');

        // Toggles
        root.classList.toggle('a11y-high-contrast', !!prefs.highContrast);
        root.classList.toggle('a11y-invert', !!prefs.invert);
        root.classList.toggle('a11y-grayscale', !!prefs.grayscale);
        root.classList.toggle('a11y-dyslexic-font', !!prefs.dyslexicFont);
        root.classList.toggle('a11y-text-spacing', !!prefs.textSpacing);
        root.classList.toggle('a11y-align-left', !!prefs.alignLeft);
        root.classList.toggle('a11y-highlight-links', !!prefs.highlightLinks);
        root.classList.toggle('a11y-big-cursor', !!prefs.bigCursor);
        root.classList.toggle('a11y-reduced-motion', !!prefs.reducedMotion);
        root.classList.toggle('a11y-reading-guide-on', !!prefs.readingGuide);
        root.classList.toggle('a11y-focus-visible', !!prefs.focusVisible);
        root.classList.toggle('a11y-text-selectable', !!prefs.selectableText);

        updateTriggerBadge();
    }

    /**
     * Salva le preferenze nel LocalStorage
     */
    function savePrefs() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
        } catch (e) {
            console.warn('GustAvo A11y: Errore salvataggio localStorage', e);
        }
        applyClasses();
        syncUI();
    }

    /**
     * Calcola quante funzioni attive ci sono e aggiorna il badge del trigger
     */
    function countActiveFeatures() {
        let count = 0;
        if (prefs.textSize !== 'normal') count++;
        if (prefs.highContrast) count++;
        if (prefs.invert) count++;
        if (prefs.grayscale) count++;
        if (prefs.dyslexicFont) count++;
        if (prefs.textSpacing) count++;
        if (prefs.alignLeft) count++;
        if (prefs.highlightLinks) count++;
        if (prefs.bigCursor) count++;
        if (prefs.reducedMotion) count++;
        if (prefs.readingGuide) count++;
        if (prefs.focusVisible) count++;
        return count;
    }

    function updateTriggerBadge() {
        const trigger = document.getElementById('a11yTrigger');
        const badge = document.getElementById('a11yBadge');
        if (!trigger || !badge) return;

        const count = countActiveFeatures();
        if (count > 0) {
            trigger.classList.add('has-active');
            badge.textContent = String(count);
        } else {
            trigger.classList.remove('has-active');
            badge.textContent = '';
        }
    }

    /**
     * Inietta il markup del menu e del righello nel body
     */
    function injectMarkup() {
        if (document.getElementById('a11yModal')) return;

        // 1. Righello di lettura
        const ruler = document.createElement('div');
        ruler.id = 'a11yRuler';
        ruler.className = 'a11y-reading-ruler';
        ruler.setAttribute('aria-hidden', 'true');
        document.body.appendChild(ruler);

        // 2. Pulsante flottante trigger
        const trigger = document.createElement('button');
        trigger.id = 'a11yTrigger';
        trigger.className = 'a11y-floating-trigger';
        trigger.type = 'button';
        trigger.setAttribute('aria-label', 'Apri impostazioni di accessibilità (Scorciatoia Alt + A)');
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.innerHTML = `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
            </svg>
            <span class="a11y-trigger-text">Accessibilità</span>
            <span class="a11y-trigger-badge" id="a11yBadge" aria-label="Funzioni attive"></span>
        `;
        document.body.appendChild(trigger);

        // 3. Modale / Pannello di Accessibilità
        const modalBackdrop = document.createElement('div');
        modalBackdrop.id = 'a11yModal';
        modalBackdrop.className = 'a11y-backdrop';
        modalBackdrop.setAttribute('role', 'dialog');
        modalBackdrop.setAttribute('aria-modal', 'true');
        modalBackdrop.setAttribute('aria-label', 'Strumenti di Accessibilità del Portale GustAvo');

        modalBackdrop.innerHTML = `
            <div class="a11y-panel">
                <!-- Header -->
                <header class="a11y-header">
                    <div class="a11y-title-group">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/>
                        </svg>
                        <div class="a11y-title-text">
                            <h2>Accessibilità</h2>
                            <p>IIS Avogadro · Personalizza la lettura</p>
                        </div>
                    </div>
                    <div class="a11y-header-actions">
                        <button type="button" class="a11y-btn-reset-top" id="a11yResetBtn" title="Ripristina valori predefiniti">
                            Reimposta
                        </button>
                        <button type="button" class="a11y-btn-close" id="a11yCloseBtn" aria-label="Chiudi menu accessibilità">
                            &times;
                        </button>
                    </div>
                </header>

                <!-- Corpo Controlli -->
                <div class="a11y-body">
                    
                    <!-- Dimensione Caratteri -->
                    <div class="a11y-text-size-box">
                        <div class="a11y-text-size-header">
                            <span>Dimensione del Testo</span>
                            <span class="a11y-text-size-val" id="a11yTextSizeLabel">100%</span>
                        </div>
                        <div class="a11y-text-buttons" role="group" aria-label="Dimensione caratteri">
                            <button type="button" class="a11y-text-btn" data-size="normal" aria-pressed="false">100%</button>
                            <button type="button" class="a11y-text-btn" data-size="md" aria-pressed="false">+15%</button>
                            <button type="button" class="a11y-text-btn" data-size="lg" aria-pressed="false">+30%</button>
                            <button type="button" class="a11y-text-btn" data-size="xl" aria-pressed="false">+45%</button>
                        </div>
                    </div>

                    <!-- Schede Interattive Toggle -->
                    <div class="a11y-section-title">Contrasto e Colori</div>
                    <div class="a11y-cards-grid">
                        <button type="button" class="a11y-card-btn" data-feature="highContrast" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14v12a6 6 0 0 0 0-12z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Alto Contrasto</span>
                                <span class="a11y-card-desc">Fondo scuro e caratteri WCAG AAA</span>
                            </div>
                        </button>

                        <button type="button" class="a11y-card-btn" data-feature="grayscale" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 16a7 7 0 1 1 7-7 7 7 0 0 1-7 7z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Monocromatico</span>
                                <span class="a11y-card-desc">Scala di grigi per fotofobia</span>
                            </div>
                        </button>

                        <button type="button" class="a11y-card-btn" data-feature="invert" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M6.34 7.76C4.89 9.21 4 11.19 4 13.36 4 17.58 7.42 21 11.64 21c2.17 0 4.15-.89 5.6-2.34l-10.9-10.9zm13.32.9A9.97 9.97 0 0 0 12 4.36V19.64c2.17 0 4.15-.89 5.6-2.34 1.45-1.45 2.34-3.43 2.34-5.6 0-1.12-.24-2.19-.68-3.04z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Inverti Colori</span>
                                <span class="a11y-card-desc">Inverte tinte salvando foto</span>
                            </div>
                        </button>

                        <button type="button" class="a11y-card-btn" data-feature="highlightLinks" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Evidenzia Link</span>
                                <span class="a11y-card-desc">Sfondo giallo e sottolineatura</span>
                            </div>
                        </button>
                    </div>

                    <div class="a11y-section-title">Leggibilità e Testo</div>
                    <div class="a11y-cards-grid">
                        <button type="button" class="a11y-card-btn" data-feature="dyslexicFont" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M9.93 13.5h4.14L12 7.98zM20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4.05 16.5l-1.14-3H9.17l-1.12 3H5.96l5.11-13h1.86l5.11 13h-2.09z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Font Dislessia</span>
                                <span class="a11y-card-desc">Caratteri ad alta leggibilità</span>
                            </div>
                        </button>

                        <button type="button" class="a11y-card-btn" data-feature="textSpacing" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M2 4h20v2H2zm0 7h20v2H2zm0 7h20v2H2z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Spaziatura Testo</span>
                                <span class="a11y-card-desc">Aumenta righe e parole</span>
                            </div>
                        </button>

                        <button type="button" class="a11y-card-btn" data-feature="alignLeft" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Allinea a Sinistra</span>
                                <span class="a11y-card-desc">Evita testi non allineati</span>
                            </div>
                        </button>

                        <button type="button" class="a11y-card-btn" data-feature="readingGuide" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h10v4H7z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Guida di Lettura</span>
                                <span class="a11y-card-desc">Righello che segue il mouse</span>
                            </div>
                        </button>
                    </div>

                    <div class="a11y-section-title">Navigazione e Ausili</div>
                    <div class="a11y-cards-grid">
                        <button type="button" class="a11y-card-btn" data-feature="bigCursor" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M13.64 21.97l-3.22-7.04-4.42 4.42V2l13 13h-6.22l3.22 7.04-2.36.93z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Cursore Grande</span>
                                <span class="a11y-card-desc">Puntatore ad alta visibilità</span>
                            </div>
                        </button>

                        <button type="button" class="a11y-card-btn" data-feature="reducedMotion" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Ferma Animazioni</span>
                                <span class="a11y-card-desc">Disattiva transizioni e scatti</span>
                            </div>
                        </button>

                        <button type="button" class="a11y-card-btn" data-feature="focusVisible" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M2 9V4c0-.55.45-1 1-1h5v2H4v4H2zm0 6h2v4h4v2H3c-.55 0-1-.45-1-1v-5zm18 4h-4v2h5c.55 0 1-.45 1-1v-5h-2v4zm0-14h-5v-2h5c.55 0 1 .45 1 1v5h-2V5z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Bordo Navigazione</span>
                                <span class="a11y-card-desc">Evidenziazione tasto Tab</span>
                            </div>
                        </button>

                        <button type="button" class="a11y-card-btn" data-feature="selectableText" aria-pressed="false">
                            <span class="a11y-card-status" aria-hidden="true"></span>
                            <div class="a11y-card-icon">
                                <svg viewBox="0 0 24 24"><path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/></svg>
                            </div>
                            <div class="a11y-card-info">
                                <span class="a11y-card-label">Seleziona Testo</span>
                                <span class="a11y-card-desc">Copia testo e lettura facilitata</span>
                            </div>
                        </button>
                    </div>

                    <!-- Sintesi Vocale (Text-to-Speech) -->
                    <div class="a11y-tts-box">
                        <div class="a11y-tts-header">
                            <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                            <span>Sintesi Vocale (Lettore Schermo)</span>
                        </div>
                        <p class="a11y-tts-desc">Ascolta il testo selezionato con il mouse o fai leggere la pagina ad alta voce.</p>
                        <div class="a11y-tts-controls">
                            <button type="button" class="a11y-tts-btn" id="a11yTtsSelected">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                                <span>Leggi Selezione</span>
                            </button>
                            <button type="button" class="a11y-tts-btn" id="a11yTtsPage">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                                <span>Leggi Pagina</span>
                            </button>
                            <button type="button" class="a11y-tts-btn" id="a11yTtsStop" style="display:none;">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
                                <span>Interrompi</span>
                            </button>
                        </div>
                    </div>

                </div>

                <!-- Footer del Pannello -->
                <footer class="a11y-footer">
                    <span>GustAvo · Conforme WCAG 2.1</span>
                    <span class="a11y-shortcut-hint">Scorciatoia: <kbd>Alt</kbd> + <kbd>A</kbd></span>
                </footer>
            </div>
        `;

        document.body.appendChild(modalBackdrop);
    }

    /**
     * Sincronizza lo stato visivo dei pulsanti nel pannello
     */
    function syncUI() {
        const modal = document.getElementById('a11yModal');
        if (!modal) return;

        // Dimensione testo
        const sizeBtns = modal.querySelectorAll('.a11y-text-btn');
        const sizeLabel = document.getElementById('a11yTextSizeLabel');
        const labelsMap = { normal: '100%', md: '+15%', lg: '+30%', xl: '+45%' };
        if (sizeLabel) sizeLabel.textContent = labelsMap[prefs.textSize] || '100%';

        sizeBtns.forEach(btn => {
            const size = btn.dataset.size;
            const isActive = prefs.textSize === size;
            btn.classList.toggle('is-active', isActive);
            btn.setAttribute('aria-pressed', String(isActive));
        });

        // Toggle cards
        const cardBtns = modal.querySelectorAll('.a11y-card-btn');
        cardBtns.forEach(btn => {
            const feat = btn.dataset.feature;
            if (feat && prefs[feat] !== undefined) {
                const isActive = !!prefs[feat];
                btn.classList.toggle('is-active', isActive);
                btn.setAttribute('aria-pressed', String(isActive));
            }
        });

        updateTriggerBadge();
    }

    /**
     * Apertura / Chiusura del Pannello
     */
    function openPanel() {
        const modal = document.getElementById('a11yModal');
        const trigger = document.getElementById('a11yTrigger');
        if (!modal) return;
        lastSelection = window.getSelection().toString();

        modal.classList.add('is-open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');

        // Focus sul primo pulsante interattivo o sul tasto chiudi
        const closeBtn = document.getElementById('a11yCloseBtn');
        if (closeBtn) closeBtn.focus();
    }

    function closePanel() {
        const modal = document.getElementById('a11yModal');
        const trigger = document.getElementById('a11yTrigger');
        if (!modal) return;

        modal.classList.remove('is-open');
        if (trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.focus();
        }
    }

    function togglePanel() {
        const modal = document.getElementById('a11yModal');
        if (modal && modal.classList.contains('is-open')) {
            closePanel();
        } else {
            openPanel();
        }
    }

    /**
     * Ripristina tutti i valori di default
     */
    function resetAll() {
        stopSpeech();
        prefs = Object.assign({}, defaultPrefs);
        savePrefs();
    }

    /**
     * Gestione Guida di Lettura (Reading Ruler) che segue il cursore
     */
    function initReadingGuide() {
        const ruler = document.getElementById('a11yRuler');
        if (!ruler) return;

        window.addEventListener('mousemove', (e) => {
            if (!prefs.readingGuide) return;
            ruler.style.top = `${e.clientY - 24}px`;
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!prefs.readingGuide || !e.touches[0]) return;
            ruler.style.top = `${e.touches[0].clientY - 24}px`;
        }, { passive: true });
    }


    function getItalianVoice() {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(v => v.lang === 'it-IT') ||
            voices.find(v => v.lang.toLowerCase().startsWith('it'));
    }

    function splitText(text, max = 180) {
        const sentences = text.replace(/\s+/g, ' ').match(/[^.!?;:]+[.!?;:]?/g) || [text];
        const chunks = [];
        let buf = '';
        sentences.forEach(s => {
            if ((buf + s).length > max && buf) { chunks.push(buf.trim()); buf = ''; }
            buf += s + ' ';
            while (buf.length > max * 1.5) {
                const cut = buf.lastIndexOf(' ', max) > 0 ? buf.lastIndexOf(' ', max) : max;
                chunks.push(buf.slice(0, cut).trim());
                buf = buf.slice(cut);
            }
        });
        if (buf.trim()) chunks.push(buf.trim());
        return chunks;
    }
    /**
     * Sintesi Vocale (Web Speech API)
     */
    function speakText(text, onComplete) {
        if (!('speechSynthesis' in window)) {
            alert('Il tuo browser non supporta la sintesi vocale.');
            return;
        }
        text = (text || '').trim();
        if (!text) return;

        const synth = window.speechSynthesis;
        const myId = ++utteranceId;
        const chunks = splitText(text);
        let i = 0;

        synth.cancel();
        if (synth.paused) synth.resume();

        isSpeechReading = true;
        updateSpeechButtons();

        function finish() {
            if (myId !== utteranceId) return;
            isSpeechReading = false;
            updateSpeechButtons();
            if (onComplete) onComplete();
        }

        function speakNext() {
            if (myId !== utteranceId) return;
            if (i >= chunks.length) { finish(); return; }

            const u = new SpeechSynthesisUtterance(chunks[i++]);
            u.lang = 'it-IT';
            u.rate = 1.0;
            u.pitch = 1.0;
            const v = getItalianVoice();
            if (v) u.voice = v;

            u.onend = speakNext;
            u.onerror = (e) => {
                if (myId !== utteranceId) return;
                if (e.error === 'interrupted' || e.error === 'canceled') return;
                console.warn('GustAvo A11y: errore TTS', e.error);
                finish();
            };

            currentUtterance = u;
            synth.speak(u);
        }

        setTimeout(speakNext, 80);
    }

    function stopSpeech() {
        utteranceId++;
        pageReading = false;
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        isSpeechReading = false;
        if (currentSpeakingElement) {
            currentSpeakingElement.classList.remove('a11y-speaking-element');
            currentSpeakingElement = null;
        }
        updateSpeechButtons();
    }

    function updateSpeechButtons() {
        const stopBtn = document.getElementById('a11yTtsStop');
        const selBtn = document.getElementById('a11yTtsSelected');
        const pageBtn = document.getElementById('a11yTtsPage');

        if (stopBtn) stopBtn.style.display = isSpeechReading ? 'inline-flex' : 'none';
        if (selBtn) selBtn.classList.toggle('is-playing', isSpeechReading);
        if (pageBtn) pageBtn.classList.toggle('is-playing', isSpeechReading);
    }

    function readSelectedText() {
        const selected = (window.getSelection().toString() || lastSelection).trim();
        if (selected) {
            speakText(selected);
        } else {
            speakText('Nessun testo selezionato. Pagina: ' + (document.title || ''));
        }
    }

    function readFullPage() {
        if (isSpeechReading || pageReading) {
            stopSpeech();
            return;
        }

        closePanel(); // così vedi l'evidenziazione sulla pagina

        const root = document.querySelector('main') || document.body;
        let elements = Array.from(root.querySelectorAll('h1, h2, h3, h4, p, li'))
            .filter(el => !el.closest('#a11yModal') && !el.closest('#a11yTrigger'));
        elements = elements.filter(el => !elements.some(o => o !== el && el.contains(o)));

        if (elements.length === 0) {
            speakText(root.innerText.substring(0, 1500));
            return;
        }

        pageReading = true;
        let index = 0;

        function readNext() {
            if (currentSpeakingElement) {
                currentSpeakingElement.classList.remove('a11y-speaking-element');
                currentSpeakingElement = null;
            }
            if (!pageReading || index >= elements.length) {
                stopSpeech();
                return;
            }
            const el = elements[index++];
            const text = (el.innerText || '').trim();
            if (text.length <= 2) { readNext(); return; }

            currentSpeakingElement = el;
            el.classList.add('a11y-speaking-element');
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            speakText(text, readNext);
        }

        readNext();
    }

    /**
     * Inizializza gli Event Listeners
     */
    function setupEvents() {
        const trigger = document.getElementById('a11yTrigger');
        const modal = document.getElementById('a11yModal');
        const closeBtn = document.getElementById('a11yCloseBtn');
        const resetBtn = document.getElementById('a11yResetBtn');

        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                togglePanel();
            });
        }

        // Supporto per eventuali altri pulsanti nel sito con data-a11y-trigger
        document.querySelectorAll('[data-a11y-trigger], .nav-a11y-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openPanel();
            });
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                closePanel();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                resetAll();
            });
        }

        // Chiusura al click fuori dal pannello (backdrop)
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closePanel();
                }
            });
        }

        // Tasti di scelta rapida globali (Alt + A per aprire/chiudere, Esc per chiudere)
        window.addEventListener('keydown', (e) => {
            // Alt + A (sia maiuscolo che minuscolo)
            if (e.altKey && (e.key === 'a' || e.key === 'A' || e.code === 'KeyA')) {
                e.preventDefault();
                togglePanel();
            }

            // Esc per chiudere la modale
            if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
                e.preventDefault();
                closePanel();
            }
        });

        // Click su bottoni dimensione testo
        if (modal) {
            modal.querySelectorAll('.a11y-text-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    prefs.textSize = btn.dataset.size || 'normal';
                    savePrefs();
                });
            });

            // Click su bottoni toggle funzioni
            modal.querySelectorAll('.a11y-card-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const feat = btn.dataset.feature;
                    if (feat && prefs[feat] !== undefined) {
                        prefs[feat] = !prefs[feat];
                        savePrefs();
                    }
                });
            });

            // Sintesi vocale
            const ttsSelBtn = document.getElementById('a11yTtsSelected');
            const ttsPageBtn = document.getElementById('a11yTtsPage');
            const ttsStopBtn = document.getElementById('a11yTtsStop');

            if (ttsSelBtn) ttsSelBtn.addEventListener('click', readSelectedText);
            if (ttsPageBtn) ttsPageBtn.addEventListener('click', readFullPage);
            if (ttsStopBtn) ttsStopBtn.addEventListener('click', stopSpeech);
        }

        // Caricamento voci speech
        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = () => {
                // Pre-popola le voci
            };
        }
    }

    /**
     * Inizializzazione principale
     */
    function init() {
        applyClasses();
        injectMarkup();
        syncUI();
        initReadingGuide();
        setupEvents();
    }

    // Applica subito le classi non appena lo script viene eseguito per prevenire FOUC
    applyClasses();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Esponi API globale per scripting opzionale
    window.GustAvoA11y = {
        open: openPanel,
        close: closePanel,
        toggle: togglePanel,
        reset: resetAll,
        getPrefs: () => Object.assign({}, prefs)
    };
})();
