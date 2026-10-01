/**
 * GustAvo — Script di navigazione, galleria e custom video player
 * Istituto Amedeo Avogadro, Torino · Classe 5CI
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Menu Mobile (Hamburger)
    // ----------------------------------------------------
    const hamburgerBtn = document.getElementById('hamburger');
    const navMobile = document.getElementById('navMobile');

    if (hamburgerBtn && navMobile) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navMobile.classList.toggle('visibile');
            hamburgerBtn.classList.toggle('aperto', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        });

        navMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMobile.classList.remove('visibile');
                hamburgerBtn.classList.remove('aperto');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
            });
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

        const otherGalleryItems = document.querySelectorAll('.team-photo-wrapper, .galleria-item, .hero-photo');
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
        const encounterModalBackdrop = document.getElementById('encounterModalBackdrop');
        const encounterModalClose = document.getElementById('encounterModalClose');
        const encounterModalBadge = document.getElementById('encounterModalBadge');
        const encounterModalTitle = document.getElementById('encounterModalTitle');
        const encounterModalDesc = document.getElementById('encounterModalDesc');
        const encounterModalGrid = document.getElementById('encounterModalGrid');

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
                    card.addEventListener('click', () => {
                        const idx = parseInt(card.dataset.index, 10);
                        openLightboxGallery(data.photos, idx);
                    });
                    card.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            const idx = parseInt(card.dataset.index, 10);
                            openLightboxGallery(data.photos, idx);
                        }
                    });
                });

                initPhotoSkeletons(encounterModalGrid);
            }

            encounterModal.classList.add('attivo');
            encounterModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        };

        const closeEncounterModal = () => {
            if (!encounterModal) return;
            encounterModal.classList.remove('attivo');
            encounterModal.setAttribute('aria-hidden', 'true');
            if (!lightbox || !lightbox.classList.contains('attivo')) {
                document.body.style.overflow = '';
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
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && encounterModal && encounterModal.classList.contains('attivo')) {
                if (!lightbox || !lightbox.classList.contains('attivo')) {
                    closeEncounterModal();
                }
            }
        });

        // ------------------------------------------------
        // Inizializzazione Tracce dei 3 Caroselli
        // ------------------------------------------------
        const tracks = document.querySelectorAll('.gallery-slider-track');
        tracks.forEach(track => {
            const wrapper = track.closest('.gallery-slider-wrapper');
            const prevBtn = wrapper ? wrapper.querySelector('.gallery-side-btn.prev') : null;
            const nextBtn = wrapper ? wrapper.querySelector('.gallery-side-btn.next') : null;

            const updateButtonStates = () => {
                const scrollLeft = track.scrollLeft;
                const maxScroll = track.scrollWidth - track.clientWidth;
                if (prevBtn) prevBtn.disabled = scrollLeft <= 10;
                if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 10;
            };

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

            track.addEventListener('scroll', updateButtonStates, { passive: true });
            window.addEventListener('resize', updateButtonStates, { passive: true });
            updateButtonStates();

            // ------------------------------------------------
            // Trascinamento Mouse per PC fluido al 100% (ZERO LAG, ZERO SCATTO)
            // ------------------------------------------------
            let isDown = false;
            let startX = 0;
            let scrollStart = 0;
            let dragDelta = 0;

            track.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                isDown = true;
                dragDelta = 0;
                startX = e.pageX - track.offsetLeft;
                scrollStart = track.scrollLeft;
                track.classList.add('is-dragging');
                track.style.scrollBehavior = 'auto';
                track.style.scrollSnapType = 'none';
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                const currentX = e.pageX - track.offsetLeft;
                const walk = currentX - startX;
                dragDelta = Math.abs(walk);
                track.scrollLeft = scrollStart - walk;
            });

            const endDrag = () => {
                if (!isDown) return;
                isDown = false;
                track.classList.remove('is-dragging');
                track.style.scrollBehavior = 'smooth';
                setTimeout(() => {
                    track.style.scrollSnapType = 'x mandatory';
                    dragDelta = 0;
                }, 60);
            };

            window.addEventListener('mouseup', endDrag);

            // Click sulle Card del carosello
            track.querySelectorAll('.gallery-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (dragDelta > 8) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }

                    const encIdx = parseInt(card.dataset.encounter, 10);
                    if (card.classList.contains('gallery-card-more')) {
                        openEncounterModal(encIdx);
                    } else {
                        const pIdx = parseInt(card.dataset.index, 10);
                        if (encountersData[encIdx]) {
                            openLightboxGallery(encountersData[encIdx].photos, pIdx);
                        }
                    }
                });

                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const encIdx = parseInt(card.dataset.encounter, 10);
                        if (card.classList.contains('gallery-card-more')) {
                            openEncounterModal(encIdx);
                        } else {
                            const pIdx = parseInt(card.dataset.index, 10);
                            if (encountersData[encIdx]) {
                                openLightboxGallery(encountersData[encIdx].photos, pIdx);
                            }
                        }
                    }
                });
            });
        });
    };

    initPhotoSkeletons();
    initEncountersGallery();
    disableBrowserLinkPreview();
});
