
    window.GUSTAVO_INTENTS_DATA = window.parent.GUSTAVO_INTENTS_DATA || {intents: []};
    const SERVER_URL = "https://gustavo1.avoprogetti.it";
    const messages = document.getElementById("messages");
    const input = document.getElementById("input");
    const voiceToggle = document.getElementById("voiceToggle");
    const mouth = document.getElementById("mouth");
    const leftP = document.getElementById("left-pupil") || document.querySelector('.eye.left .pupil');
    const rightP = document.getElementById("right-pupil") || document.querySelector('.eye.right .pupil');
    let mouthInterval = null;
    let eyeInterval = null;

    
let _isSpeaking = false;
let _currentAudio = null;
let _speechTimeout = null;
let _ttsAbortController = null;

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
    if (_currentAudio.src.startsWith('blob:')) URL.revokeObjectURL(_currentAudio.src);
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

  // Richiedi sempre audio aggiornato, con timeout e voce alternativa.
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

  fetch(ttsUrl, { signal, cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error("TTS status " + res.status);
      return res.blob();
    })
    .then(blob => {
      if (hasResponded) return;
      hasResponded = true;
      clearTimeout(ttsTimeoutId);

      const blobUrl = URL.createObjectURL(blob);


      if (_isSpeaking) {
        playTtsAudioUrl(blobUrl, cleanForTts);
      } else {
        URL.revokeObjectURL(blobUrl);
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
    function requestMicrophone() {
      if (window.parent && typeof window.parent.GUSTAVO_REQUEST_MICROPHONE === 'function') {
        return window.parent.GUSTAVO_REQUEST_MICROPHONE();
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return Promise.reject(new Error('Il microfono richiede HTTPS e un browser compatibile.'));
      }
      return navigator.mediaDevices.getUserMedia({audio:true});
    }
    function microphoneError(error) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return 'Accesso al microfono bloccato. In Chrome: Impostazioni → Impostazioni sito → Microfono → consenti questo sito. Controlla anche Impostazioni Android → App → Chrome → Autorizzazioni → Microfono.';
      }
      if (error.name === 'NotFoundError') return 'Nessun microfono disponibile sul dispositivo.';
      if (error.name === 'NotReadableError') return 'Microfono occupato o bloccato dal telefono. Chiudi le altre app che lo utilizzano e riprova.';
      return error.message || 'Impossibile avviare il microfono.';
    }
    async function startRecording() {
      if (!window.MediaRecorder) {
        throw new Error('Questo browser non supporta la registrazione. Prova con Chrome o Edge.');
      }
      micStream = await requestMicrophone();
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
                  showMicStatus(microphoneError(error));
                }
                return;
              }
              if (heard) acceptTranscript(heard);
            };
            micStream = await requestMicrophone();
            micStream.getTracks().forEach(track => track.stop());
            micStream = null;
            recognition.start();
            micTimer = setTimeout(() => { if (recognition) { stopRequested = true; recognition.stop(); } }, 30000);
          } else await startRecording();
        } catch (error) {
          recognition = null;
          resetMic();
          showMicStatus(microphoneError(error));
        }
      });
      window.addEventListener('pagehide', () => {
        if (recognition) { stopRequested = true; recognition.onend = null; recognition.abort(); }
        if (recorder && recorder.state === 'recording') { recorder.onstop = null; recorder.stop(); }
        resetMic();
      });
    }



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

document.getElementById("btn-send").addEventListener("click", sendMessage);
