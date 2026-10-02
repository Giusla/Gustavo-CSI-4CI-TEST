/**
 * GustAvo — Script di navigazione, galleria e custom video player
 * Istituto Amedeo Avogadro, Torino · Classe 5CI
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Menu Mobile (Hamburger) con chiusura al tocco esterno
    // ----------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');

    if (hamburgerBtn && navMobile) {
        let navBackdrop = document.querySelector('.nav-mobile-backdrop');
        if (!navBackdrop) {
            navBackdrop = document.createElement('div');
            navBackdrop.className = 'nav-mobile-backdrop';
            navBackdrop.setAttribute('aria-hidden', 'true');
            document.body.appendChild(navBackdrop);
        }

        const closeNavMobile = () => {
            navMobile.classList.remove('visibile');
            hamburgerBtn.classList.remove('aperto');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            if (navBackdrop) navBackdrop.classList.remove('visibile');
        };

        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMobile.classList.toggle('visibile');
            hamburgerBtn.classList.toggle('aperto', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
            if (navBackdrop) navBackdrop.classList.toggle('visibile', isOpen);
        });

        if (navBackdrop) {
            navBackdrop.addEventListener('click', closeNavMobile);
            navBackdrop.addEventListener('touchstart', closeNavMobile, { passive: true });
        }

        navMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeNavMobile);
        });

        // Chiusura immediata al tocco o click all'esterno del menù da mobile
        document.addEventListener('click', (e) => {
            if (!navMobile.classList.contains('visibile')) return;
            if (!navMobile.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                closeNavMobile();
            }
        });

        document.addEventListener('touchstart', (e) => {
            if (!navMobile.classList.contains('visibile')) return;
            if (!navMobile.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                closeNavMobile();
            }
        }, { passive: true });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMobile.classList.contains('visibile')) {
                closeNavMobile();
            }
        });
    }

    // ----------------------------------------------------
    // ----------------------------------------------------
    // 2. Lightbox Schermo Intero con Scorrimento Foto & Skeleton UI
    // ----------------------------------------------------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxBox = document.getElementById('lightboxBox');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxCaption = document.getElementById('lightboxCaption');

    let currentLightboxList = [];
    let currentLightboxIndex = 0;
    let currentLoadHandler = null;

    const showLightboxIndex = (index) => {
        if (!lightbox || !lightboxImg || currentLightboxList.length === 0) return;

        if (index < 0) {
            currentLightboxIndex = currentLightboxList.length - 1;
        } else if (index >= currentLightboxList.length) {
            currentLightboxIndex = 0;
        } else {
            currentLightboxIndex = index;
        }

        const item = currentLightboxList[currentLightboxIndex];
        if (!item) return;

        if (currentLoadHandler) {
            lightboxImg.removeEventListener('load', currentLoadHandler);
            lightboxImg.removeEventListener('error', currentLoadHandler);
            currentLoadHandler = null;
        }

        if (lightboxBox) {
            lightboxBox.classList.remove('is-loaded');
        }

        const onLoaded = () => {
            if (lightboxBox) {
                lightboxBox.classList.add('is-loaded');
            }
        };

        currentLoadHandler = onLoaded;

        lightboxImg.alt = item.alt || 'Foto ingrandita';
        lightboxImg.src = item.src;

        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxList.length}`;
        }
        if (lightboxCaption) {
            lightboxCaption.textContent = item.caption || item.alt || '';
        }

        if (lightboxPrev && lightboxNext) {
            const hasMultiple = currentLightboxList.length > 1;
            lightboxPrev.style.display = hasMultiple ? 'inline-flex' : 'none';
            lightboxNext.style.display = hasMultiple ? 'inline-flex' : 'none';
        }

        if (lightboxImg.complete && lightboxImg.naturalWidth > 0) {
            onLoaded();
        } else {
            lightboxImg.addEventListener('load', onLoaded, { once: true });
            lightboxImg.addEventListener('error', onLoaded, { once: true });
        }
    };

    const openLightboxGallery = (list, startIndex = 0) => {
        if (!lightbox || !list || list.length === 0) return;
        currentLightboxList = list;
        lightbox.classList.add('attivo');
        document.body.style.overflow = 'hidden';
        showLightboxIndex(startIndex);
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('attivo');
        if (lightboxBox) {
            lightboxBox.classList.remove('is-loaded');
        }
        if (currentLoadHandler) {
            lightboxImg.removeEventListener('load', currentLoadHandler);
            lightboxImg.removeEventListener('error', currentLoadHandler);
            currentLoadHandler = null;
        }
        if (lightboxImg) {
            lightboxImg.src = '';
        }

        const encounterModal = document.getElementById('encounterModal');
        if (!encounterModal || !encounterModal.classList.contains('attivo')) {
            document.body.style.overflow = '';
        }
    };

    if (lightbox) {
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                showLightboxIndex(currentLightboxIndex - 1);
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                showLightboxIndex(currentLightboxIndex + 1);
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-stage')) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('attivo')) return;
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showLightboxIndex(currentLightboxIndex - 1);
            } else if (e.key === 'ArrowRight') {
                showLightboxIndex(currentLightboxIndex + 1);
            }
        });

        let touchStartX = 0;
        lightbox.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) touchStartX = e.touches[0].clientX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 0) return;
            const diffX = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    showLightboxIndex(currentLightboxIndex - 1);
                } else {
                    showLightboxIndex(currentLightboxIndex + 1);
                }
            }
        }, { passive: true });

        let wheelDebounce = false;
        lightbox.addEventListener('wheel', (e) => {
            if (wheelDebounce) return;
            if (Math.abs(e.deltaX) > 30) {
                wheelDebounce = true;
                if (e.deltaX > 0) {
                    showLightboxIndex(currentLightboxIndex + 1);
                } else {
                    showLightboxIndex(currentLightboxIndex - 1);
                }
                setTimeout(() => { wheelDebounce = false; }, 320);
            }
        }, { passive: true });

        const otherGalleryItems = document.querySelectorAll('.team-photo-wrapper, .galleria-item');
        otherGalleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.tagName === 'IMG' ? item : item.querySelector('img');
                if (img) {
                    openLightboxGallery([{
                        src: img.src,
                        alt: img.alt,
                        caption: img.alt || ''
                    }], 0);
                }
            });
        });
    }

    // ----------------------------------------------------
    // 3. Custom Sleek Video Player
    // ----------------------------------------------------
    const playerWrapper = document.getElementById('videoPlayer');
    const video = document.getElementById('projectVideo');
    const bigPlayBtn = document.getElementById('bigPlayBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const videoTimeline = document.getElementById('videoTimeline');
    const videoProgress = document.getElementById('videoProgress');
    const currentTimeEl = document.getElementById('currentTime');
    const durationTimeEl = document.getElementById('durationTime');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeIcon = document.getElementById('volumeIcon');
    const muteIcon = document.getElementById('muteIcon');
    const volumeSlider = document.getElementById('volumeSlider');
    const fullscreenBtn = document.getElementById('fullscreenBtn');

    if (playerWrapper && video) {
        const formatTime = (seconds) => {
            if (isNaN(seconds) || seconds < 0) return '0:00';
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        };

        const togglePlay = () => {
            if (video.paused || video.ended) {
                video.play();
            } else {
                video.pause();
            }
        };

        video.addEventListener('play', () => {
            playerWrapper.classList.add('playing');
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
        });

        video.addEventListener('pause', () => {
            playerWrapper.classList.remove('playing');
            playerWrapper.classList.remove('hide-controls');
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        });

        video.addEventListener('ended', () => {
            playerWrapper.classList.remove('playing');
            playerWrapper.classList.remove('hide-controls');
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        });

        if (bigPlayBtn) bigPlayBtn.addEventListener('click', togglePlay);
        if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
        video.addEventListener('click', togglePlay);

        // Avanzamento e tempi
        video.addEventListener('timeupdate', () => {
            if (!isNaN(video.duration) && video.duration > 0) {
                const percent = (video.currentTime / video.duration) * 100;
                if (videoProgress) videoProgress.style.width = `${percent}%`;
            }
            if (currentTimeEl) currentTimeEl.textContent = formatTime(video.currentTime);
        });

        video.addEventListener('loadedmetadata', () => {
            if (durationTimeEl && !isNaN(video.duration)) {
                durationTimeEl.textContent = formatTime(video.duration);
            }
        });

        // ----------------------------------------------------
        // Buffer Blob in memoria: risolve definitivamente il problema
        // dei server/CDN (es. Cloudflare Workers / static hosting) che non
        // supportano HTTP Byte-Ranges (206 Partial Content), permettendo
        // il seeking istantaneo e fluido a qualsiasi minuto senza tornare a 00:00.
        // ----------------------------------------------------
        let blobLoaded = false;
        let pendingSeek = null;

        const videoSrc = video.querySelector('source') ? video.querySelector('source').src : video.src;
        if (videoSrc && !videoSrc.startsWith('blob:')) {
            fetch(videoSrc)
                .then(res => {
                    if (!res.ok) throw new Error('Caricamento video non riuscito');
                    return res.blob();
                })
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    const curTime = pendingSeek !== null ? pendingSeek : video.currentTime;
                    const wasPlaying = !video.paused;
                    video.src = blobUrl;
                    video.currentTime = curTime;
                    if (wasPlaying) video.play();
                    blobLoaded = true;
                    pendingSeek = null;
                })
                .catch(err => {
                    console.warn('Fallback seek standard attivo:', err);
                });
        }

        // Timeline interattiva e trascinamento fluido del cursore
        if (videoTimeline) {
            let isScrubbing = false;
            let justScrubbed = false;
            let scrubPos = 0;
            let wasPlayingBeforeScrub = false;

            const updateScrubVisual = (clientX) => {
                const rect = videoTimeline.getBoundingClientRect();
                scrubPos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
                if (videoProgress) {
                    videoProgress.style.width = `${scrubPos * 100}%`;
                }
                if (!isNaN(video.duration) && video.duration > 0 && currentTimeEl) {
                    currentTimeEl.textContent = formatTime(scrubPos * video.duration);
                }
            };

            const seekToPosition = (targetTime) => {
                if (isNaN(video.duration) || video.duration <= 0) return;
                targetTime = Math.max(0, Math.min(video.duration, targetTime));
                if (currentTimeEl) currentTimeEl.textContent = formatTime(targetTime);
                if (videoProgress) videoProgress.style.width = `${(targetTime / video.duration) * 100}%`;

                if (blobLoaded) {
                    video.currentTime = targetTime;
                } else {
                    pendingSeek = targetTime;
                    try {
                        video.currentTime = targetTime;
                    } catch (e) {
                        // ignore se non ancora pronto
                    }
                }
            };

            const startScrub = (e) => {
                isScrubbing = true;
                wasPlayingBeforeScrub = !video.paused;
                if (wasPlayingBeforeScrub) video.pause();
                videoTimeline.classList.add('scrubbing');
                const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
                if (clientX !== null) updateScrubVisual(clientX);
            };

            const moveScrub = (e) => {
                if (!isScrubbing) return;
                e.preventDefault();
                const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
                if (clientX !== null) updateScrubVisual(clientX);
            };

            const endScrub = () => {
                if (isScrubbing) {
                    isScrubbing = false;
                    justScrubbed = true;
                    setTimeout(() => { justScrubbed = false; }, 150);
                    videoTimeline.classList.remove('scrubbing');
                    if (!isNaN(video.duration) && video.duration > 0) {
                        const targetTime = scrubPos * video.duration;
                        seekToPosition(targetTime);
                    }
                    if (wasPlayingBeforeScrub) {
                        video.play();
                    }
                }
            };

            videoTimeline.addEventListener('mousedown', startScrub);
            videoTimeline.addEventListener('touchstart', startScrub, { passive: false });

            window.addEventListener('mousemove', moveScrub);
            window.addEventListener('touchmove', moveScrub, { passive: false });

            window.addEventListener('mouseup', endScrub);
            window.addEventListener('touchend', endScrub);

            // Click diretto sulla timeline (senza trascinamento)
            videoTimeline.addEventListener('click', (e) => {
                if (isScrubbing || justScrubbed) return;
                const rect = videoTimeline.getBoundingClientRect();
                const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                if (!isNaN(video.duration) && video.duration > 0) {
                    seekToPosition(pos * video.duration);
                }
            });
        }

        // Controllo volume
        let lastVolume = 1;
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                video.volume = val;
                video.muted = val === 0;
                updateVolumeUI();
            });
        }

        const updateVolumeUI = () => {
            const vol = (video.muted || video.volume === 0) ? 0 : video.volume;
            const pct = Math.round(vol * 100);
            if (volumeSlider) {
                volumeSlider.value = vol;
                volumeSlider.style.setProperty('--vol-fill', `${pct}%`);
            }
            if (vol === 0) {
                if (volumeIcon) volumeIcon.style.display = 'none';
                if (muteIcon) muteIcon.style.display = 'block';
            } else {
                if (volumeIcon) volumeIcon.style.display = 'block';
                if (muteIcon) muteIcon.style.display = 'none';
            }
        };

        // Inizializza gradiente volume iniziale
        updateVolumeUI();

        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => {
                if (video.muted || video.volume === 0) {
                    video.muted = false;
                    video.volume = lastVolume > 0 ? lastVolume : 1;
                } else {
                    lastVolume = video.volume;
                    video.muted = true;
                }
                updateVolumeUI();
            });
        }

        // Fullscreen
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    if (playerWrapper.requestFullscreen) {
                        playerWrapper.requestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            });
        }

        // Dissolvenza automatica dei controlli durante la riproduzione
        let hideTimeout;
        const resetHideTimer = () => {
            playerWrapper.classList.remove('hide-controls');
            clearTimeout(hideTimeout);
            if (!video.paused) {
                hideTimeout = setTimeout(() => {
                    playerWrapper.classList.add('hide-controls');
                }, 2400);
            }
        };

        playerWrapper.addEventListener('mousemove', resetHideTimer);
        playerWrapper.addEventListener('mouseleave', () => {
            if (!video.paused) {
                playerWrapper.classList.add('hide-controls');
            }
        });
    }

    // ----------------------------------------------------
    // 4. Rimozione banner/tooltip nativo del browser in basso a sinistra sui link
    // ----------------------------------------------------
    const disableBrowserLinkPreview = () => {
        document.querySelectorAll('a[href]').forEach(a => {
            const url = a.getAttribute('href');
            if (!url || url.startsWith('#')) return;

            a.dataset.href = url;
            a.removeAttribute('href');
            a.setAttribute('role', 'link');
            a.setAttribute('tabindex', '0');

            const navigate = (openInNewTab = false) => {
                if (openInNewTab || a.target === '_blank') {
                    window.open(url, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = url;
                }
            };

            a.addEventListener('click', (e) => {
                e.preventDefault();
                navigate(e.ctrlKey || e.metaKey || e.button === 1);
            });

            a.addEventListener('auxclick', (e) => {
                if (e.button === 1) { // Click rotellina mouse
                    e.preventDefault();
                    navigate(true);
                }
            });

            a.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    navigate(e.ctrlKey || e.metaKey);
                }
            });
        });
    };

    // ----------------------------------------------------
    // 5. Skeleton UI per le foto (gestione Wi-Fi lento)
    // ----------------------------------------------------
    const initPhotoSkeletons = (root = document) => {
        const photoBoxes = root.querySelectorAll('.photo-skeleton-box');
        photoBoxes.forEach(box => {
            if (box.id === 'lightboxBox') return;
            const img = box.querySelector('img');
            if (!img) return;

            const markAsLoaded = () => {
                box.classList.add('is-loaded');
            };

            if (img.complete && img.naturalWidth > 0) {
                markAsLoaded();
            } else {
                img.addEventListener('load', markAsLoaded, { once: true });
                img.addEventListener('error', markAsLoaded, { once: true });
            }
        });
    };

    // ----------------------------------------------------
    // 6. Gestione 3 Caroselli Incontri, Card +X, Modale Semi-Fullscreen e Drag Fluido
    // ----------------------------------------------------
    const initEncountersGallery = () => {
        const encountersData = [
            {
                id: "incontro-1",
                badge: "1° Incontro · Sede CSI",
                title: "1° Incontro: Presentazione e Introduzione al CSI Piemonte",
                desc: "Kickoff del percorso formativo con i mentor aziendali, analisi dei bisogni di orientamento degli studenti dell'IIS Avogadro e mappatura dei requisiti chiave per il chatbot GustAvo.",
                photos: [
                    { src: "assets/img/galleria/foto_galleria_1.jpg", alt: "Presentazione introduttiva del percorso formativo presso CSI Piemonte", caption: "Presentazione introduttiva del percorso formativo presso CSI Piemonte" },
                    { src: "assets/img/galleria/foto_galleria_2.jpg", alt: "Sessione di brainstorming sui casi d'uso", caption: "Brainstorming e definizione dei requisiti essenziali del chatbot" },
                    { src: "assets/img/galleria/foto_galleria_3.jpg", alt: "Confronto con i tutor aziendali", caption: "Confronto con i tutor aziendali sulla struttura del servizio" },
                    { src: "assets/img/galleria/inc1_extra_1.svg", alt: "Mappatura Aree Tematiche", caption: "Mappatura delle aree informative dell'IIS Avogadro" },
                    { src: "assets/img/galleria/inc1_extra_2.svg", alt: "Analisi FAQ Studenti", caption: "Raccolta e prioritizzazione dei quesiti più frequenti" },
                    { src: "assets/img/galleria/inc1_extra_3.svg", alt: "Categorie di Risposta", caption: "Strutturazione tassonomia: Orari, Didattica, Laboratori" },
                    { src: "assets/img/galleria/foto_galleria_4.jpg", alt: "La classe 5CI con i tutor di CSI Piemonte", caption: "La classe 5CI con i tutor aziendali di CSI Piemonte" },
                    { src: "assets/img/galleria/inc1_extra_4.svg", alt: "Focus Group & Feedback", caption: "Interviste e confronto di classe per convalidare i flussi" },
                    { src: "assets/img/galleria/inc1_extra_5.svg", alt: "Linee Guida di Stile", caption: "Definizione del tono di voce amichevole ed empatico" },
                    { src: "assets/img/galleria/inc1_extra_6.svg", alt: "Flussi Conversazionali", caption: "Schematizzazione su whiteboard dell'albero di dialogo" },
                    { src: "assets/img/galleria/foto_galleria_5.jpg", alt: "Sintesi della prima giornata di lavoro", caption: "Sintesi della prima giornata di lavoro e pianificazione sprint" }
                ]
            },
            {
                id: "incontro-2",
                badge: "2° Incontro · Modulo Formativo",
                title: "2° Incontro: AI, Sicurezza Digitale e Seminario Polizia Postale",
                desc: "Modulo specialistico incentrato su etica dell'intelligenza artificiale, riservatezza e conformità GDPR, arricchito dal seminario della Polizia Postale sulla prevenzione delle minacce web.",
                photos: [
                    { src: "assets/img/galleria/foto_galleria_3.jpg", alt: "Incontro Polizia Postale: sicurezza e privacy", caption: "Incontro Polizia Postale: sicurezza informatica e tutela privacy" },
                    { src: "assets/img/galleria/foto_galleria_4.jpg", alt: "Approfondimento con i tutor CSI", caption: "La classe 5CI con i tutor aziendali di CSI Piemonte" },
                    { src: "assets/img/galleria/foto_galleria_5.jpg", alt: "Esposizione architettura privacy-first", caption: "Studio dell'architettura privacy-first senza tracciamento" },
                    { src: "assets/img/galleria/inc2_extra_1.svg", alt: "Seminario Rischi Digitali", caption: "Sicurezza sul web, prevenzione del phishing e identità digitale" },
                    { src: "assets/img/galleria/inc2_extra_2.svg", alt: "Valutazione Modelli AI", caption: "Confronto e selezione tra LLM e modelli leggeri" },
                    { src: "assets/img/galleria/inc2_extra_3.svg", alt: "Politiche Privacy-First", caption: "Garanzia di anonimato: zero raccolta di dati identificativi" },
                    { src: "assets/img/galleria/foto_galleria_6.jpg", alt: "Studio dei meccanismi di fallback", caption: "Studio dei meccanismi di fallback per domande impreviste" },
                    { src: "assets/img/galleria/inc2_extra_4.svg", alt: "Mitigazione Prompt Injection", caption: "Difesa attiva e sanificazione dei messaggi in input" },
                    { src: "assets/img/galleria/inc2_extra_5.svg", alt: "Trasparenza Algoritmica", caption: "Principi di spiegabilità e affidabilità delle informazioni" },
                    { src: "assets/img/galleria/inc2_extra_6.svg", alt: "Filtri di Contenuto", caption: "Guardrails di moderazione e accuratezza scolastica" },
                    { src: "assets/img/galleria/inc2_extra_7.svg", alt: "Controlli API & Endpoint", caption: "Architettura dei microservizi nel cloud di CSI Piemonte" },
                    { src: "assets/img/galleria/foto_galleria_2.jpg", alt: "Discussione aperta con i relatori", caption: "Sessione Q&A e confronto diretto con gli ispettori" },
                    { src: "assets/img/galleria/foto_galleria_1.jpg", alt: "Chiusura della sessione sicurezza", caption: "Chiusura del modulo formativo sull'uso etico dell'AI" }
                ]
            },
            {
                id: "incontro-3",
                badge: "3° Incontro · Modulo Conclusivo",
                title: "3° Incontro: Prototipazione, Testing e Presentazione Finale",
                desc: "Sessione di verifica funzionale e collaudo: stress test delle risposte del chatbot, validazione dell'esperienza utente su dispositivi mobili e consegna dei risultati.",
                photos: [
                    { src: "assets/img/galleria/foto_galleria_5.jpg", alt: "Testing interattivo dei prototipi del chatbot", caption: "Testing interattivo dei prototipi del chatbot GustAvo" },
                    { src: "assets/img/galleria/foto_galleria_6.jpg", alt: "Conclusione del modulo e avvio dello sviluppo", caption: "Conclusione del modulo e avvio della fase di sviluppo" },
                    { src: "assets/img/galleria/foto_galleria_2.jpg", alt: "Verifica finale delle risposte", caption: "Verifica finale e validazione del concept con i mentor" },
                    { src: "assets/img/galleria/inc3_extra_1.svg", alt: "Test di Carico & Latenza", caption: "Benchmark delle risposte in tempo reale su varie connessioni" },
                    { src: "assets/img/galleria/inc3_extra_2.svg", alt: "Sessione di Collaudo Utente", caption: "Test di usabilità con studenti e docenti dell'istituto" },
                    { src: "assets/img/galleria/foto_galleria_4.jpg", alt: "Presentazione demo ai tutor", caption: "Presentazione della demo live ai referenti del CSI Piemonte" },
                    { src: "assets/img/galleria/inc3_extra_3.svg", alt: "Verifica Responsive Mobile", caption: "Ottimizzazione della resa grafica su smartphone e tablet" },
                    { src: "assets/img/galleria/inc3_extra_4.svg", alt: "Consegna Documentazione", caption: "Consegna delle specifiche tecniche e manuale d'uso" },
                    { src: "assets/img/galleria/foto_galleria_1.jpg", alt: "Foto conclusiva del percorso", caption: "Foto di rito conclusiva con il team di sviluppo 5CI" }
                ]
            }
        ];

        // ------------------------------------------------
        // Gestione Modale Semi-Fullscreen Incontro
        // ------------------------------------------------
        const encounterModal = document.getElementById('encounterModal');
        const encounterModalBody = document.getElementById('encounterModalBody');
        const encounterModalBackdrop = document.getElementById('encounterModalBackdrop');
        const encounterModalClose = document.getElementById('encounterModalClose');
        const encounterModalBadge = document.getElementById('encounterModalBadge');
        const encounterModalTitle = document.getElementById('encounterModalTitle');
        const encounterModalDesc = document.getElementById('encounterModalDesc');
        const encounterModalGrid = document.getElementById('encounterModalGrid');
        const modalScrollTrack = document.getElementById('modalScrollTrack');
        const modalScrollThumb = document.getElementById('modalScrollThumb');

        const updateModalScrollbar = () => {
            if (!encounterModalBody || !modalScrollThumb || !modalScrollTrack) return;
            const scrollHeight = encounterModalBody.scrollHeight;
            const clientHeight = encounterModalBody.clientHeight;
            const maxScroll = scrollHeight - clientHeight;
            if (maxScroll <= 0) {
                modalScrollTrack.style.display = 'none';
                return;
            }
            modalScrollTrack.style.display = 'block';
            const trackHeight = modalScrollTrack.clientHeight;
            const thumbHeight = Math.max(44, (clientHeight / scrollHeight) * trackHeight);
            modalScrollThumb.style.height = `${thumbHeight}px`;
            const maxTravel = trackHeight - thumbHeight;
            const ratio = encounterModalBody.scrollTop / maxScroll;
            modalScrollThumb.style.transform = `translateY(${ratio * maxTravel}px)`;
        };

        if (encounterModalBody) {
            encounterModalBody.addEventListener('scroll', updateModalScrollbar, { passive: true });
        }

        const openEncounterModal = (encIndex) => {
            const data = encountersData[encIndex];
            if (!encounterModal || !data) return;

            if (encounterModalBadge) encounterModalBadge.textContent = data.badge;
            if (encounterModalTitle) encounterModalTitle.textContent = data.title;
            if (encounterModalDesc) encounterModalDesc.textContent = data.desc;

            if (encounterModalGrid) {
                encounterModalGrid.innerHTML = data.photos.map((photo, pIdx) => `
                    <article class="modal-photo-card" data-encounter="${encIndex}" data-index="${pIdx}" tabindex="0" role="button" aria-label="${photo.caption}">
                        <div class="photo-skeleton-box">
                            <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
                        </div>
                        <div class="modal-photo-caption">${photo.caption}</div>
                    </article>
                `).join('');

                encounterModalGrid.querySelectorAll('.modal-photo-card').forEach(card => {
                    card.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        const idx = parseInt(card.dataset.index, 10);
                        openLightboxGallery(data.photos, idx);
                    });
                    card.addEventListener('keydown', (ev) => {
                        if (ev.key === 'Enter' || ev.key === ' ') {
                            ev.preventDefault();
                            const idx = parseInt(card.dataset.index, 10);
                            openLightboxGallery(data.photos, idx);
                        }
                    });
                });

                initPhotoSkeletons(encounterModalGrid);
            }

            // Blocco rigoroso dello scroll della pagina sottostante
            document.documentElement.classList.add('modal-is-open');
            document.body.classList.add('modal-is-open');

            encounterModal.classList.add('attivo');
            encounterModal.setAttribute('aria-hidden', 'false');

            if (encounterModalBody) {
                encounterModalBody.scrollTop = 0;
                setTimeout(updateModalScrollbar, 50);
            }
        };

        const closeEncounterModal = () => {
            if (!encounterModal) return;
            encounterModal.classList.remove('attivo');
            encounterModal.setAttribute('aria-hidden', 'true');

            // Ripristina lo scroll solo se il lightbox non è aperto
            if (!lightbox || !lightbox.classList.contains('attivo')) {
                document.documentElement.classList.remove('modal-is-open');
                document.body.classList.remove('modal-is-open');
            }
        };

        if (encounterModalClose) {
            encounterModalClose.addEventListener('click', closeEncounterModal);
        }

        if (encounterModalBackdrop) {
            encounterModalBackdrop.addEventListener('click', closeEncounterModal);
        }

        if (encounterModal) {
            encounterModal.addEventListener('click', (e) => {
                if (e.target === encounterModal) closeEncounterModal();
            });

            // Evita che la rotellina del mouse o il touch scrollino la pagina di sfondo
            encounterModal.addEventListener('wheel', (e) => {
                if (!encounterModalBody || !encounterModalBody.contains(e.target)) {
                    e.preventDefault();
                }
            }, { passive: false });

            encounterModal.addEventListener('touchmove', (e) => {
                if (!encounterModalBody || !encounterModalBody.contains(e.target)) {
                    e.preventDefault();
                }
            }, { passive: false });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && encounterModal && encounterModal.classList.contains('attivo')) {
                if (!lightbox || !lightbox.classList.contains('attivo')) {
                    closeEncounterModal();
                }
            }
        });

        // ------------------------------------------------
        // Inizializzazione Tracce dei 3 Caroselli con Scrollbar Sfumata
        // ------------------------------------------------
        const tracks = document.querySelectorAll('.gallery-slider-track');
        tracks.forEach(track => {
            const section = track.closest('.encounter-section');
            const wrapper = track.closest('.gallery-slider-wrapper');
            const prevBtn = wrapper ? wrapper.querySelector('.gallery-side-btn.prev') : null;
            const nextBtn = wrapper ? wrapper.querySelector('.gallery-side-btn.next') : null;

            const customScrollbar = section ? section.querySelector('.gallery-custom-scrollbar') : null;
            const customTrack = customScrollbar ? customScrollbar.querySelector('.gallery-custom-scrollbar-track') : null;
            const customThumb = customScrollbar ? customScrollbar.querySelector('.gallery-custom-scrollbar-thumb') : null;

            const updateButtonStates = () => {
                const scrollLeft = track.scrollLeft;
                const maxScroll = track.scrollWidth - track.clientWidth;
                if (prevBtn) prevBtn.disabled = scrollLeft <= 10;
                if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 10;
            };

            const updateCustomScrollbar = () => {
                if (!customScrollbar || !customTrack || !customThumb) return;
                const scrollLeft = track.scrollLeft;
                const maxScroll = track.scrollWidth - track.clientWidth;
                if (maxScroll <= 0) {
                    customScrollbar.style.display = 'none';
                    return;
                }
                customScrollbar.style.display = 'flex';
                const trackWidth = customTrack.clientWidth;
                const thumbWidth = customThumb.clientWidth;
                const maxTravel = trackWidth - thumbWidth;
                const ratio = Math.max(0, Math.min(1, scrollLeft / maxScroll));
                customThumb.style.transform = `translateX(${ratio * maxTravel}px)`;
            };

            if (customTrack) {
                customTrack.addEventListener('click', (e) => {
                    const rect = customTrack.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                    const maxScroll = track.scrollWidth - track.clientWidth;
                    track.scrollTo({ left: ratio * maxScroll, behavior: 'smooth' });
                });
            }

            if (customThumb && customTrack) {
                let thumbDragging = false;
                let thumbStartX = 0;
                let thumbStartScroll = 0;

                customThumb.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    thumbDragging = true;
                    thumbStartX = e.clientX;
                    thumbStartScroll = track.scrollLeft;
                    document.body.style.userSelect = 'none';
                });

                window.addEventListener('mousemove', (e) => {
                    if (!thumbDragging) return;
                    const deltaX = e.clientX - thumbStartX;
                    const trackWidth = customTrack.clientWidth;
                    const thumbWidth = customThumb.clientWidth;
                    const maxTravel = trackWidth - thumbWidth;
                    const maxScroll = track.scrollWidth - track.clientWidth;
                    if (maxTravel > 0) {
                        track.scrollLeft = thumbStartScroll + (deltaX / maxTravel) * maxScroll;
                    }
                });

                window.addEventListener('mouseup', () => {
                    if (thumbDragging) {
                        thumbDragging = false;
                        document.body.style.userSelect = '';
                    }
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    track.scrollBy({ left: -390, behavior: 'smooth' });
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    track.scrollBy({ left: 390, behavior: 'smooth' });
                });
            }

            track.addEventListener('scroll', () => {
                updateButtonStates();
                updateCustomScrollbar();
            }, { passive: true });

            window.addEventListener('resize', () => {
                updateButtonStates();
                updateCustomScrollbar();
            }, { passive: true });

            updateButtonStates();
            updateCustomScrollbar();

            // Disabilitazione scorrimento con frecce tastiera sul carosello
            track.addEventListener('keydown', (e) => {
                if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                    e.preventDefault();
                }
            });

            // Click delegato sulle Card del carosello (Apre modale o fullscreen lightbox)
            track.addEventListener('click', (e) => {

                const card = e.target.closest('.gallery-card');
                if (!card) return;

                const encIdx = parseInt(card.dataset.encounter, 10);
                if (card.classList.contains('gallery-card-more')) {
                    openEncounterModal(encIdx);
                } else {
                    const pIdx = parseInt(card.dataset.index, 10);
                    if (encountersData[encIdx] && encountersData[encIdx].photos[pIdx]) {
                        openLightboxGallery(encountersData[encIdx].photos, pIdx);
                    }
                }
            });

            // Accessibilità tastiera per ogni card
            track.querySelectorAll('.gallery-card').forEach(card => {
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const encIdx = parseInt(card.dataset.encounter, 10);
                        if (card.classList.contains('gallery-card-more')) {
                            openEncounterModal(encIdx);
                        } else {
                            const pIdx = parseInt(card.dataset.index, 10);
                            if (encountersData[encIdx] && encountersData[encIdx].photos[pIdx]) {
                                openLightboxGallery(encountersData[encIdx].photos, pIdx);
                            }
                        }
                    }
                });
            });
        });
    };

    // ----------------------------------------------------
    // 7. Widget di Accessibilità Universale (a11y)
    // ----------------------------------------------------
    const initAccessibilityWidget = () => {
        // Inietta il trigger button, il pannello e la reading guide
        const triggerBtn = document.createElement('button');
        triggerBtn.className = 'a11y-trigger-btn';
        triggerBtn.id = 'a11yTriggerBtn';
        triggerBtn.setAttribute('aria-label', 'Menu opzioni di accessibilità');
        triggerBtn.setAttribute('aria-expanded', 'false');
        triggerBtn.setAttribute('title', 'Accessibilità del sito');
        // Icona ufficiale accessibilità universale (sagoma a braccia e gambe aperte all'interno di un cerchio armonico)
        triggerBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="4" r="2"></circle>
                <path d="M19 8.5c-.5-.3-1.1-.1-1.4.4l-2.4 3.6-1.7-1.3c-.3-.2-.7-.3-1-.2-.4.1-.7.4-.8.7l-1.5 4.5-2.2-2.9c-.3-.4-.9-.5-1.4-.2s-.5.9-.2 1.4l3.1 4c.3.4.8.6 1.3.5.5-.1.9-.5 1.1-1l1.3-3.9 1.4 1.1c.3.2.7.3 1.1.2.4-.1.7-.4.9-.7l2.8-4.2c.3-.5.1-1.1-.4-1.4zM5 8c-.6 0-1 .4-1 1s.4 1 1 1h5.8l-1.3-2H5z"></path>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18.2c-4.52 0-8.2-3.68-8.2-8.2s3.68-8.2 8.2-8.2 8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2z"></path>
            </svg>
        `;

        const panel = document.createElement('div');
        panel.className = 'a11y-panel';
        panel.id = 'a11yPanel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Strumenti di accessibilità');
        panel.innerHTML = `
            <div class="a11y-panel-header">
                <div class="a11y-panel-title">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="7.5" r="1.5" fill="currentColor"></circle>
                        <path d="M7 11h10"></path>
                        <path d="M12 11v7"></path>
                        <path d="M9 18l3-3 3 3"></path>
                    </svg>
                    <span>Accessibilità</span>
                    <span class="a11y-panel-badge">GustAvo</span>
                </div>
                <button class="a11y-panel-close" id="a11yCloseBtn" aria-label="Chiudi pannello accessibilità">&times;</button>
            </div>
            <div class="a11y-panel-body">
                <!-- 1. Dimensione Testo -->
                <div class="a11y-item">
                    <div class="a11y-item-label">
                        <span class="a11y-item-name">Dimensione Testo</span>
                        <span class="a11y-item-desc">Ingrandisce o riduce i caratteri</span>
                    </div>
                    <div class="a11y-btn-group">
                        <button class="a11y-btn-control" id="a11yDecFont" aria-label="Riduci testo">A-</button>
                        <span class="a11y-size-indicator" id="a11yFontIndicator">100%</span>
                        <button class="a11y-btn-control" id="a11yIncFont" aria-label="Ingrandisci testo">A+</button>
                    </div>
                </div>

                <!-- 2. Alto Contrasto -->
                <div class="a11y-item">
                    <div class="a11y-item-label">
                        <span class="a11y-item-name">Alto Contrasto</span>
                        <span class="a11y-item-desc">Migliora contrasto per ipovedenti</span>
                    </div>
                    <label class="a11y-toggle">
                        <input type="checkbox" id="a11yHighContrast">
                        <span class="a11y-toggle-slider" aria-hidden="true"></span>
                    </label>
                </div>

                <!-- 3. Font ad Alta Leggibilità -->
                <div class="a11y-item">
                    <div class="a11y-item-label">
                        <span class="a11y-item-name">Font Alta Leggibilità</span>
                        <span class="a11y-item-desc">Caratteri ideati per dislessia (DSA)</span>
                    </div>
                    <label class="a11y-toggle">
                        <input type="checkbox" id="a11yDyslexic">
                        <span class="a11y-toggle-slider" aria-hidden="true"></span>
                    </label>
                </div>

                <!-- 4. Evidenzia Link -->
                <div class="a11y-item">
                    <div class="a11y-item-label">
                        <span class="a11y-item-name">Evidenzia Tutti i Link</span>
                        <span class="a11y-item-desc">Rende visibili tutti i collegamenti e bottoni</span>
                    </div>
                    <label class="a11y-toggle">
                        <input type="checkbox" id="a11yHighlightLinks">
                        <span class="a11y-toggle-slider" aria-hidden="true"></span>
                    </label>
                </div>

                <!-- 5. Cursore Ingrandito -->
                <div class="a11y-item">
                    <div class="a11y-item-label">
                        <span class="a11y-item-name">Cursore Grande & Colorato</span>
                        <span class="a11y-item-desc">Puntatore mouse ingrandito e ad alta visibilità</span>
                    </div>
                    <label class="a11y-toggle">
                        <input type="checkbox" id="a11yBigCursor">
                        <span class="a11y-toggle-slider" aria-hidden="true"></span>
                    </label>
                </div>

                <!-- 6. Spaziatura del Testo -->
                <div class="a11y-item">
                    <div class="a11y-item-label">
                        <span class="a11y-item-name">Spaziatura Testo</span>
                        <span class="a11y-item-desc">Aumenta interlinea e distanza tra lettere</span>
                    </div>
                    <label class="a11y-toggle">
                        <input type="checkbox" id="a11yTextSpacing">
                        <span class="a11y-toggle-slider" aria-hidden="true"></span>
                    </label>
                </div>

                <!-- 7. Riduci Animazioni -->
                <div class="a11y-item">
                    <div class="a11y-item-label">
                        <span class="a11y-item-name">Ferma Animazioni</span>
                        <span class="a11y-item-desc">Disattiva movimenti e transizioni rapide</span>
                    </div>
                    <label class="a11y-toggle">
                        <input type="checkbox" id="a11yReducedMotion">
                        <span class="a11y-toggle-slider" aria-hidden="true"></span>
                    </label>
                </div>

                <!-- 8. Guida di Lettura -->
                <div class="a11y-item">
                    <div class="a11y-item-label">
                        <span class="a11y-item-name">Guida di Lettura</span>
                        <span class="a11y-item-desc">Barra azzurra che segue il cursore</span>
                    </div>
                    <label class="a11y-toggle">
                        <input type="checkbox" id="a11yReadingGuide">
                        <span class="a11y-toggle-slider" aria-hidden="true"></span>
                    </label>
                </div>
            </div>
            <div class="a11y-panel-footer">
                <span class="a11y-status-note">Preferenze salvate</span>
                <button class="a11y-reset-btn" id="a11yResetBtn">Ripristina</button>
            </div>
        `;

        const guideLine = document.createElement('div');
        guideLine.className = 'a11y-reading-guide';
        guideLine.id = 'a11yGuideLine';

        document.body.appendChild(triggerBtn);
        document.body.appendChild(panel);
        document.body.appendChild(guideLine);

        // Stato impostazioni
        const fontSteps = [100, 110, 120, 130];
        let currentFontIndex = 0;

        const loadPrefs = () => {
            try {
                const prefs = JSON.parse(localStorage.getItem('gustavo_a11y_prefs') || '{}');
                if (typeof prefs.fontStep === 'number' && prefs.fontStep >= 0 && prefs.fontStep < fontSteps.length) {
                    currentFontIndex = prefs.fontStep;
                }
                applyFontSize(fontSteps[currentFontIndex]);

                if (prefs.highContrast) {
                    document.documentElement.classList.add('a11y-high-contrast');
                    const cb = document.getElementById('a11yHighContrast');
                    if (cb) cb.checked = true;
                }
                if (prefs.dyslexic) {
                    document.documentElement.classList.add('a11y-dyslexic-font');
                    const cb = document.getElementById('a11yDyslexic');
                    if (cb) cb.checked = true;
                }
                if (prefs.highlightLinks) {
                    document.documentElement.classList.add('a11y-highlight-links');
                    const cb = document.getElementById('a11yHighlightLinks');
                    if (cb) cb.checked = true;
                }
                if (prefs.bigCursor) {
                    document.documentElement.classList.add('a11y-big-cursor');
                    const cb = document.getElementById('a11yBigCursor');
                    if (cb) cb.checked = true;
                }
                if (prefs.textSpacing) {
                    document.documentElement.classList.add('a11y-text-spacing');
                    const cb = document.getElementById('a11yTextSpacing');
                    if (cb) cb.checked = true;
                }
                if (prefs.reducedMotion) {
                    document.documentElement.classList.add('a11y-reduced-motion');
                    const cb = document.getElementById('a11yReducedMotion');
                    if (cb) cb.checked = true;
                }
                if (prefs.readingGuide) {
                    document.documentElement.classList.add('a11y-guide-active');
                    const cb = document.getElementById('a11yReadingGuide');
                    if (cb) cb.checked = true;
                }
            } catch (e) {
                console.warn('Errore lettura a11y prefs:', e);
            }
        };

        const savePrefs = () => {
            try {
                const prefs = {
                    fontStep: currentFontIndex,
                    highContrast: document.documentElement.classList.contains('a11y-high-contrast'),
                    dyslexic: document.documentElement.classList.contains('a11y-dyslexic-font'),
                    highlightLinks: document.documentElement.classList.contains('a11y-highlight-links'),
                    bigCursor: document.documentElement.classList.contains('a11y-big-cursor'),
                    textSpacing: document.documentElement.classList.contains('a11y-text-spacing'),
                    reducedMotion: document.documentElement.classList.contains('a11y-reduced-motion'),
                    readingGuide: document.documentElement.classList.contains('a11y-guide-active')
                };
                localStorage.setItem('gustavo_a11y_prefs', JSON.stringify(prefs));
            } catch (e) {
                // Ignore localStorage errors
            }
        };

        const applyFontSize = (percent) => {
            document.documentElement.style.fontSize = percent === 100 ? '' : `${(16 * percent) / 100}px`;
            const indicator = document.getElementById('a11yFontIndicator');
            const decBtn = document.getElementById('a11yDecFont');
            const incBtn = document.getElementById('a11yIncFont');
            if (indicator) indicator.textContent = `${percent}%`;
            if (decBtn) decBtn.disabled = currentFontIndex === 0;
            if (incBtn) incBtn.disabled = currentFontIndex === fontSteps.length - 1;
        };

        // Gestione pannello (apertura/chiusura)
        const togglePanel = (open) => {
            const isCurrentlyOpen = panel.classList.contains('attivo');
            const targetState = typeof open === 'boolean' ? open : !isCurrentlyOpen;
            panel.classList.toggle('attivo', targetState);
            triggerBtn.classList.toggle('attivo', targetState);
            triggerBtn.setAttribute('aria-expanded', String(targetState));
        };

        triggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePanel();
        });

        const closeBtn = document.getElementById('a11yCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => togglePanel(false));
        }

        // Chiusura al click esterno
        document.addEventListener('click', (e) => {
            if (!panel.classList.contains('attivo')) return;
            if (!panel.contains(e.target) && !triggerBtn.contains(e.target)) {
                togglePanel(false);
            }
        });

        // Chiusura con tasto Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('attivo')) {
                togglePanel(false);
                triggerBtn.focus();
            }
        });

        // Controlli dimensione testo
        const decBtn = document.getElementById('a11yDecFont');
        const incBtn = document.getElementById('a11yIncFont');

        if (decBtn) {
            decBtn.addEventListener('click', () => {
                if (currentFontIndex > 0) {
                    currentFontIndex--;
                    applyFontSize(fontSteps[currentFontIndex]);
                    savePrefs();
                }
            });
        }

        if (incBtn) {
            incBtn.addEventListener('click', () => {
                if (currentFontIndex < fontSteps.length - 1) {
                    currentFontIndex++;
                    applyFontSize(fontSteps[currentFontIndex]);
                    savePrefs();
                }
            });
        }

        // Checkbox switches
        const highContrastCb = document.getElementById('a11yHighContrast');
        if (highContrastCb) {
            highContrastCb.addEventListener('change', () => {
                document.documentElement.classList.toggle('a11y-high-contrast', highContrastCb.checked);
                savePrefs();
            });
        }

        const dyslexicCb = document.getElementById('a11yDyslexic');
        if (dyslexicCb) {
            dyslexicCb.addEventListener('change', () => {
                document.documentElement.classList.toggle('a11y-dyslexic-font', dyslexicCb.checked);
                savePrefs();
            });
        }

        const highlightLinksCb = document.getElementById('a11yHighlightLinks');
        if (highlightLinksCb) {
            highlightLinksCb.addEventListener('change', () => {
                document.documentElement.classList.toggle('a11y-highlight-links', highlightLinksCb.checked);
                savePrefs();
            });
        }

        const bigCursorCb = document.getElementById('a11yBigCursor');
        if (bigCursorCb) {
            bigCursorCb.addEventListener('change', () => {
                document.documentElement.classList.toggle('a11y-big-cursor', bigCursorCb.checked);
                savePrefs();
            });
        }

        const textSpacingCb = document.getElementById('a11yTextSpacing');
        if (textSpacingCb) {
            textSpacingCb.addEventListener('change', () => {
                document.documentElement.classList.toggle('a11y-text-spacing', textSpacingCb.checked);
                savePrefs();
            });
        }

        const reducedMotionCb = document.getElementById('a11yReducedMotion');
        if (reducedMotionCb) {
            reducedMotionCb.addEventListener('change', () => {
                document.documentElement.classList.toggle('a11y-reduced-motion', reducedMotionCb.checked);
                savePrefs();
            });
        }

        const readingGuideCb = document.getElementById('a11yReadingGuide');
        if (readingGuideCb) {
            readingGuideCb.addEventListener('change', () => {
                document.documentElement.classList.toggle('a11y-guide-active', readingGuideCb.checked);
                savePrefs();
            });
        }

        // Guida di lettura che segue il puntatore
        window.addEventListener('mousemove', (e) => {
            if (!document.documentElement.classList.contains('a11y-guide-active')) return;
            guideLine.style.top = `${e.clientY}px`;
        }, { passive: true });

        // Reset
        const resetBtn = document.getElementById('a11yResetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                currentFontIndex = 0;
                applyFontSize(fontSteps[0]);
                document.documentElement.classList.remove(
                    'a11y-high-contrast',
                    'a11y-dyslexic-font',
                    'a11y-highlight-links',
                    'a11y-big-cursor',
                    'a11y-text-spacing',
                    'a11y-reduced-motion',
                    'a11y-guide-active'
                );
                if (highContrastCb) highContrastCb.checked = false;
                if (dyslexicCb) dyslexicCb.checked = false;
                if (highlightLinksCb) highlightLinksCb.checked = false;
                if (bigCursorCb) bigCursorCb.checked = false;
                if (textSpacingCb) textSpacingCb.checked = false;
                if (reducedMotionCb) reducedMotionCb.checked = false;
                if (readingGuideCb) readingGuideCb.checked = false;
                savePrefs();
            });
        }

        loadPrefs();
    };

    initPhotoSkeletons();
    initEncountersGallery();
    initAccessibilityWidget();
    disableBrowserLinkPreview();
});

