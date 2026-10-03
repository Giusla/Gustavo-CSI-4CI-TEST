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
    let navMobileClosedTimestamp = 0;

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
            navMobile.setAttribute('aria-hidden', 'true');
            hamburgerBtn.classList.remove('aperto');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            if (navBackdrop) navBackdrop.classList.remove('visibile');
            document.documentElement.classList.remove('nav-mobile-open');
            navMobileClosedTimestamp = Date.now();
        };

        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMobile.classList.toggle('visibile');
            navMobile.setAttribute('aria-hidden', String(!isOpen));
            hamburgerBtn.classList.toggle('aperto', isOpen);
            hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
            if (navBackdrop) navBackdrop.classList.toggle('visibile', isOpen);
            document.documentElement.classList.toggle('nav-mobile-open', isOpen);
            if (isOpen) {
                // Chiudi il pannello accessibilità se aperto quando si apre il menu hamburger
                const a11yPanelEl = document.getElementById('gustavoA11yPanel');
                const a11yBtnEl = document.getElementById('gustavoA11yBtn');
                if (a11yPanelEl && a11yPanelEl.classList.contains('is-open')) {
                    if (a11yBtnEl) a11yBtnEl.click();
                }
            } else {
                navMobileClosedTimestamp = Date.now();
            }
        });

        if (navBackdrop) {
            const handleBackdropClose = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                closeNavMobile();
            };
            navBackdrop.addEventListener('click', handleBackdropClose, true);
            navBackdrop.addEventListener('touchstart', handleBackdropClose, { passive: false, capture: true });
            navBackdrop.addEventListener('pointerdown', handleBackdropClose, true);
        }

        navMobile.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Chiudi il menu mobile permettendo la normale navigazione del link
                navMobile.classList.remove('visibile');
                navMobile.setAttribute('aria-hidden', 'true');
                hamburgerBtn.classList.remove('aperto');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                if (navBackdrop) navBackdrop.classList.remove('visibile');
            });
        });

        // Intercettazione in fase di cattura (capture) per chiudere il menu ed evitare
        // che il click o il tocco tocchi e apra immagini, card o modali sottostanti
        const handleOutsideNavMobile = (e) => {
            // Se il click o tocco è DENTRO al menu o al pulsante hamburger, NON interferire
            if (navMobile.contains(e.target) || hamburgerBtn.contains(e.target)) {
                return;
            }

            if (navMobile.classList.contains('visibile')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                closeNavMobile();
            } else if (Date.now() - navMobileClosedTimestamp < 450) {
                // Blocca solo i click fantasma che colpiscono elementi esterni (es. immagini della pagina)
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        };

        document.addEventListener('click', handleOutsideNavMobile, true);
        document.addEventListener('touchstart', handleOutsideNavMobile, { passive: false, capture: true });
        document.addEventListener('pointerdown', handleOutsideNavMobile, true);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMobile.classList.contains('visibile')) {
                closeNavMobile();
            }
        });
    }

    // ----------------------------------------------------
    // Gestione Sicura Blocco Scroll per Modali e Lightbox
    // Evita il salto a inizio pagina e impedisce lo scorrimento di sfondo
    // ----------------------------------------------------
    let savedScrollY = 0;
    let isScrollLocked = false;

    const lockPageScroll = () => {
        if (!isScrollLocked) {
            savedScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            document.documentElement.classList.add('modal-is-open');
            document.body.classList.add('modal-is-open');
            isScrollLocked = true;
        }
    };

    const unlockPageScroll = () => {
        const encounterModalEl = document.getElementById('encounterModal');
        const modalOpen = encounterModalEl && encounterModalEl.classList.contains('attivo');
        const lightboxOpen = lightbox && lightbox.classList.contains('attivo');

        if (!modalOpen && !lightboxOpen && isScrollLocked) {
            document.documentElement.classList.remove('modal-is-open');
            document.body.classList.remove('modal-is-open');
            isScrollLocked = false;
            // Ripristina l'esatta posizione di scorrimento senza scatti in cima
            window.scrollTo({
                top: savedScrollY,
                left: 0,
                behavior: 'instant'
            });
        }
    };

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
        if (Date.now() - navMobileClosedTimestamp < 450 || (navMobile && navMobile.classList.contains('visibile'))) {
            return;
        }
        currentLightboxList = list;
        lightbox.classList.add('attivo');
        lightbox.setAttribute('aria-hidden', 'false');
        lockPageScroll();
        showLightboxIndex(startIndex);
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('attivo');
        lightbox.setAttribute('aria-hidden', 'true');
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

        unlockPageScroll();
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
            } else if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) {
                e.preventDefault();
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

        lightbox.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });

        let wheelDebounce = false;
        lightbox.addEventListener('wheel', (e) => {
            e.preventDefault();
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
        }, { passive: false });

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

    // (funzione disableBrowserLinkPreview rimossa — causava long tasks al DOMContentLoaded
    //  aggiungendo 3 listener per ogni link e impedendo il prefetch nativo del browser)

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

    // Listener resize condiviso (un solo addEventListener su window per tutti i caroselli)
    const _resizeCallbacks = [];
    let _resizeRaf = null;
    window.addEventListener('resize', () => {
        if (_resizeRaf) return;
        _resizeRaf = requestAnimationFrame(() => {
            _resizeCallbacks.forEach(fn => fn());
            _resizeRaf = null;
        });
    }, { passive: true });

    const initEncountersGallery = () => {
        const encountersData = [
            {
                id: "incontro-1",
                badge: "1° Incontro · Sede CSI",
                title: "1° Incontro: Formazione e Laboratori al CSI Piemonte",
                desc: "Kickoff del percorso formativo presso la sede di CSI Piemonte: analisi dei bisogni di orientamento, requisiti architetturali e studio del chatbot GustAvo con i tutor aziendali.",
                photos: [
                    { src: "assets/img/galleria/incontro_csi/foto_galleria_1.png", alt: "Sessione di lavoro del team GustAvo presso la sede di CSI Piemonte", caption: "Presentazione e avvio delle attività presso la sede di CSI Piemonte" },
                    { src: "assets/img/galleria/incontro_csi/foto_galleria_2.jpg", alt: "Brainstorming e definizione dei requisiti essenziali del chatbot", caption: "Brainstorming e definizione dei requisiti essenziali del chatbot" },
                    { src: "assets/img/galleria/incontro_csi/foto_galleria_3.jpg", alt: "Confronto con i tutor aziendali sulla struttura del servizio", caption: "Confronto con i tutor aziendali sulla struttura del servizio" },
                    { src: "assets/img/galleria/incontro_csi/foto_galleria_4.jpg", alt: "La classe 5CI con i tutor aziendali di CSI Piemonte", caption: "La classe 5CI insieme ai tutor aziendali di CSI Piemonte" },
                    { src: "assets/img/galleria/incontro_csi/foto_galleria_5.jpg", alt: "Studio dell'architettura privacy-first senza profilazione", caption: "Studio dell'architettura software e politiche privacy-first" },
                    { src: "assets/img/galleria/incontro_csi/foto_galleria_6.jpg", alt: "Studio dei meccanismi di risposta e gestione fallback", caption: "Studio dei meccanismi di classificazione e gestione fallback" },
                    { src: "assets/img/galleria/incontro_csi/foto_galleria_7.jpg", alt: "Approfondimento tecnico sulle API e integrazione con il modello", caption: "Approfondimento tecnico sull'integrazione del modello NLP" },
                    { src: "assets/img/galleria/incontro_csi/foto_galleria_8.png", alt: "Momento di confronto e sintesi della sessione al CSI", caption: "Sintesi della sessione di lavoro e pianificazione sprint" }
                ]
            },
            {
                id: "incontro-2",
                badge: "2° Incontro · Lavoro in Classe",
                title: "2° Incontro: Sviluppo, Addestramento e Test in Classe",
                desc: "Attività di programmazione e collaudo nei laboratori dell'IIS Amedeo Avogadro: strutturazione del dataset intents.json, addestramento del modello Scikit-learn e test del frontend.",
                photos: [
                    { src: "assets/img/galleria/in_classe/foto_classe_1.jpg", alt: "Sessione di programmazione e sviluppo in laboratorio all'IIS Avogadro", caption: "Sessione di sviluppo del codice e analisi dei requisiti in classe" },
                    { src: "assets/img/galleria/in_classe/foto_classe_2.png", alt: "Lavoro di gruppo sulla strutturazione dei dati delle intenzioni", caption: "Lavoro di gruppo sulla categorizzazione e raffinamento del dataset" },
                    { src: "assets/img/galleria/in_classe/foto_classe_3.png", alt: "Test interattivo delle risposte del chatbot GustAvo tra studenti", caption: "Collaudo interattivo delle risposte conversazionali" },
                    { src: "assets/img/galleria/in_classe/foto_classe_4.png", alt: "Ottimizzazione del backend Flask e configurazione delle rotte", caption: "Ottimizzazione del backend e calibrazione della confidenza semantica" },
                    { src: "assets/img/galleria/in_classe/foto_classe_5.png", alt: "Revisione del design dell'interfaccia utente", caption: "Revisione dell'interfaccia utente e accessibilità visiva" },
                    { src: "assets/img/galleria/in_classe/foto_classe_6.png", alt: "Conclusione dei test in classe e validazione della versione finale", caption: "Validazione dei flussi e collaudo finale con i docenti" }
                ]
            },
            {
                id: "incontro-3",
                badge: "3° Incontro · Polizia di Stato",
                title: "3° Incontro: Incontro sull'AI con la Polizia di Stato",
                desc: "Incontro formativo sui temi dell'Intelligenza Artificiale con la Polizia di Stato, con dibattito e sessione di interviste condotte dagli studenti.",
                photos: [
                    { src: "assets/img/galleria/incontro_cesedi/foto_cesedi_1.png", alt: "Incontro sull'Intelligenza Artificiale con la Polizia di Stato", caption: "Incontro formativo sull'AI con la Polizia di Stato" },
                    { src: "assets/img/galleria/incontro_cesedi/foto_cesedi_2.png", alt: "Sessione di interviste condotte dagli studenti durante l'incontro sull'AI", caption: "Interviste e approfondimento condotti dagli studenti" },
                    { src: "assets/img/galleria/incontro_cesedi/foto_cesedi_3.png", alt: "Confronto e conclusioni dell'incontro sull'Intelligenza Artificiale", caption: "Confronto, interviste e conclusioni della giornata sull'AI" }
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
            if (Date.now() - navMobileClosedTimestamp < 450 || (navMobile && navMobile.classList.contains('visibile'))) {
                return;
            }

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

            // Blocco rigoroso dello scroll della pagina sottostante senza perdere la posizione
            lockPageScroll();

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

            unlockPageScroll();
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

            // Registra callback per il resize condiviso (vedi sotto)
            _resizeCallbacks.push(() => {
                updateButtonStates();
                updateCustomScrollbar();
            });

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
    // 7. Sistema di Accessibilità GustAvo (Conforme Standard WCAG 2.1)
    // ----------------------------------------------------
    const initGustavoAccessibility = () => {
        // Disattiva il widget di accessibilità esclusivamente nella scheda del chatbot
        if (document.body.classList.contains('chatbot-page') ||
            document.documentElement.classList.contains('chatbot-page-html') ||
            window.location.pathname.endsWith('chatbot.html') ||
            window.location.href.includes('chatbot.html')) {
            return;
        }

        // Evita duplicazioni nel DOM
        if (document.getElementById('gustavoA11yBtn')) return;

        // Rimozione preventiva di classi di accessibilità obsolete o non conformi
        const OBSOLETE_CLASSES = [
            'g-invert', 'g-vivid', 'g-highlight-headings',
            'g-highlight-active', 'g-highlight-links', 'g-reduce-motion', 'g-stop-motion',
            'g-reduce-effects', 'g-reading-mode', 'g-reduce-distractions',
            'g-reading-focus', 'g-hide-decorative', 'g-big-cursor',
            'g-spacing', 'g-line-height'
        ];
        OBSOLETE_CLASSES.forEach(cls => document.documentElement.classList.remove(cls));

        // ── Helper: crea un toggle item conforme WCAG ──
        const makeItem = (id, label, desc) => `
            <div class="g-a11y-item">
                <div class="g-a11y-item-info">
                    <label for="${id}" class="g-a11y-item-label">${label}</label>
                    <span class="g-a11y-item-desc">${desc}</span>
                </div>
                <label class="g-a11y-toggle" aria-label="${label}">
                    <input type="checkbox" id="${id}" class="g-a11y-checkbox" role="switch" aria-checked="false">
                    <span class="g-a11y-toggle-track" aria-hidden="true">
                        <span class="g-a11y-toggle-thumb"></span>
                    </span>
                </label>
            </div>`;

        // ── Helper: SVG icone sezione ──
        const textIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h14"/></svg>`;
        const eyeIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
        const navIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`;

        // ── Costruzione pulsante ──
        const btn = document.createElement('button');
        btn.id = 'gustavoA11yBtn';
        btn.className = 'g-a11y-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Apri impostazioni di accessibilità');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'gustavoA11yPanel');
        btn.innerHTML = `
            <span class="g-a11y-tooltip" aria-hidden="true">Accessibilità</span>
            <span class="g-a11y-icon-wrap" aria-hidden="true">
                <img src="assets/img/accessibility-icon.png?v=4.6" alt="" class="g-a11y-icon" draggable="false" />
                <svg class="g-a11y-close-icon" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </span>
        `;

        // ── Linea guida lettura per ausilio cognitivo / dislessia ──
        const guideLine = document.createElement('div');
        guideLine.className = 'g-guide-line';
        guideLine.setAttribute('aria-hidden', 'true');

        // ── Costruzione pannello ──
        const panel = document.createElement('div');
        panel.id = 'gustavoA11yPanel';
        panel.className = 'g-a11y-panel';
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-label', 'Pannello accessibilità conforme WCAG 2.1');
        panel.setAttribute('aria-hidden', 'true');

        panel.innerHTML = `
            <div class="g-a11y-header">
                <div class="g-a11y-header-content">
                    <h2 class="g-a11y-title">Accessibilità</h2>
                    <p class="g-a11y-subtitle">Personalizza navigazione e visualizzazione</p>
                </div>
            </div>

            <div class="g-a11y-body">

                <!-- SEZIONE 1: Testo e Tipografia (WCAG 1.4.4 & 1.4.12) -->
                <div class="g-a11y-section">
                    <h3 class="g-a11y-section-title">${textIcon} Testo e Tipografia</h3>
                    <div class="g-a11y-font-row">
                        <div class="g-a11y-item-info">
                            <span class="g-a11y-item-label">Dimensione testo</span>
                            <span class="g-a11y-item-desc">Ingrandimento scalabile fino al 200%</span>
                        </div>
                        <div class="g-a11y-font-controls" role="group" aria-label="Regolazione dimensione testo conforme WCAG">
                            <button type="button" class="g-a11y-font-btn" id="gDecFont" aria-label="Riduci testo">A−</button>
                            <span class="g-a11y-font-val" id="gFontVal" aria-live="polite">100%</span>
                            <button type="button" class="g-a11y-font-btn" id="gIncFont" aria-label="Aumenta testo">A+</button>
                        </div>
                    </div>
                    ${makeItem('gReadableFont', 'Carattere ad alta leggibilità', 'Font lineare (Arial) ottimizzato per dislessia')}
                    ${makeItem('gTextSpacing', 'Spaziatura testo conforme', 'Interlinea (1.8), spaziatura caratteri e parole')}
                    <div class="g-a11y-item g-a11y-tts-item">
                        <div class="g-a11y-item-info">
                            <span class="g-a11y-item-label">Sintesi Vocale (Lettore Schermo)</span>
                            <span class="g-a11y-item-desc">Ascolta la lettura vocale della pagina ad alta voce</span>
                        </div>
                        <div class="a11y-tts-controls">
                            <button type="button" class="a11y-tts-btn" id="a11yTtsPage" title="Ascolta l'intera pagina">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                                <span>Leggi Pagina</span>
                            </button>
                            <button type="button" class="a11y-tts-btn a11y-tts-stop-btn" id="a11yTtsStop" style="display:none;" title="Interrompi lettura">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M6 6h12v12H6z"/></svg>
                                <span>Interrompi</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- SEZIONE 2: Contrasto e Colori (WCAG 1.4.1 & 1.4.6) -->
                <div class="g-a11y-section">
                    <h3 class="g-a11y-section-title">${eyeIcon} Contrasto e Colori</h3>
                    ${makeItem('gHighContrast', 'Contrasto elevato (AAA)', 'Rapporto di contrasto elevato testo/sfondo')}
                    ${makeItem('gGrayscale', 'Scala di grigi (Monocromatico)', 'Accesso senza dipendenza dalla percezione colori')}
                </div>

                <!-- SEZIONE 3: Navigazione e Ausili (WCAG 2.4.7) -->
                <div class="g-a11y-section">
                    <h3 class="g-a11y-section-title">${navIcon} Navigazione e Ausili</h3>
                    ${makeItem('gBigCursor', 'Cursore ingrandito', 'Migliora la visibilità del puntatore mouse')}
                    ${makeItem('gHighlightLinks', 'Evidenzia collegamenti', 'Contorno evidente su tutti i link e pulsanti')}
                    ${makeItem('gReadingGuide', 'Guida alla lettura', 'Barra orizzontale di supporto visivo')}
                    ${makeItem('gFocusVisible', 'Focus tastiera evidente', 'Contorno ad alto contrasto per navigazione')}
                </div>

            </div>

            <div class="g-a11y-footer">
                <button type="button" class="g-a11y-reset-btn" id="gustavoA11yReset">
                    Ripristina impostazioni
                </button>
            </div>
        `;

        // ── Floating Reading Status Box (barra essenziale con indicazione tasto ESC) ──
        const readingBox = document.createElement('div');
        readingBox.id = 'a11yTtsReadingBox';
        readingBox.className = 'a11y-tts-reading-box';
        readingBox.setAttribute('aria-live', 'polite');
        readingBox.setAttribute('aria-atomic', 'true');
        readingBox.innerHTML = `
            <div class="tts-reading-header">
                <div class="tts-reading-status">
                    <span class="tts-pulse-dot" aria-hidden="true"></span>
                    <span class="tts-reading-badge">LETTURA VOCALE ATTIVA</span>
                </div>
                <button type="button" class="tts-reading-stop-btn" id="ttsBoxStopBtn" aria-label="Interrompi lettura vocale (oppure premi ESC)">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M6 6h12v12H6z"/></svg>
                    <span>Interrompi</span>
                </button>
            </div>
            <div class="tts-reading-body">
                <p class="tts-reading-esc-hint">Premi <kbd class="tts-esc-kbd">ESC</kbd> per uscire dal TTS</p>
            </div>
        `;
        const ttsBoxStopBtn = readingBox.querySelector('#ttsBoxStopBtn');

        // ── Pulsante circolare "Torna in cima" (gemello di stile del pulsante accessibilità) ──
        const backToTopBtn = document.createElement('button');
        backToTopBtn.type = 'button';
        backToTopBtn.id = 'backToTopBtn';
        backToTopBtn.className = 'back-to-top-btn';
        backToTopBtn.setAttribute('aria-label', 'Torna in cima alla pagina');
        backToTopBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
            </svg>
            <span class="back-to-top-tooltip" role="tooltip">Torna in cima</span>
        `;
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ── Funzione di posizionamento sopra il footer (mai sovrapposto ai contenuti, zero salti) ──
        const adjustPositionForFooter = () => {
            const footer = document.querySelector('footer, .footer, .chatbot-direct-bar');
            if (!footer) return;
            const footerRect = footer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const isMobile = window.innerWidth <= 580;
            const baseBottom = isMobile ? 16 : 24;

            if (footerRect.top < windowHeight) {
                const overlap = windowHeight - footerRect.top;
                const newBottom = overlap + baseBottom;
                const btnHeight = btn.offsetHeight || (isMobile ? 52 : 56);
                const buttonClearance = 12; // distanza di sicurezza sopra al bottone sull'asse Y
                btn.style.bottom = `${newBottom}px`;
                panel.style.bottom = `${newBottom + btnHeight + buttonClearance}px`;
                if (readingBox) readingBox.style.bottom = `${newBottom}px`;
                if (backToTopBtn) backToTopBtn.style.bottom = `${newBottom}px`;
            } else {
                const btnHeight = btn.offsetHeight || (isMobile ? 52 : 56);
                const buttonClearance = 12;
                btn.style.bottom = '';
                panel.style.bottom = `${baseBottom + btnHeight + buttonClearance}px`;
                if (readingBox) readingBox.style.bottom = '';
                if (backToTopBtn) backToTopBtn.style.bottom = '';
            }
        };

        // Calcolo immediato prima di aggiungere gli elementi al DOM:
        // garantisce che il bottone nasca già alla giusta coordinata dal primissimo frame
        adjustPositionForFooter();

        // ── Append al DOM ──
        const a11yBackdrop = document.createElement('div');
        a11yBackdrop.className = 'g-a11y-backdrop';
        a11yBackdrop.setAttribute('aria-hidden', 'true');

        document.body.appendChild(guideLine);
        document.body.appendChild(a11yBackdrop);
        document.body.appendChild(btn);
        document.body.appendChild(panel);
        document.body.appendChild(readingBox);
        document.body.appendChild(backToTopBtn);

        // ── Aggiornamento fluido allo scroll e ridimensionamento (senza transizioni lente sul bottom) ──
        let footerRaf = null;
        const onScrollOrResize = () => {
            if (backToTopBtn) {
                backToTopBtn.classList.toggle('is-visible', window.scrollY > 300);
            }
            if (footerRaf) return;
            footerRaf = requestAnimationFrame(() => {
                adjustPositionForFooter();
                footerRaf = null;
            });
        };

        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize, { passive: true });
        window.addEventListener('load', () => {
            adjustPositionForFooter();
            if (backToTopBtn) backToTopBtn.classList.toggle('is-visible', window.scrollY > 300);
        }, { passive: true });

        // ── Steps testo conformi WCAG 1.4.4 (fino a 200%) ──
        const fontSteps = [100, 125, 150, 175, 200];
        let fontIndex = 0;

        // ── Mappa: id-checkbox → { htmlClass } ──
        const TOGGLES = {
            gReadableFont:   { cls: 'g-readable-font' },
            gTextSpacing:    { cls: 'g-text-spacing' },
            gHighContrast:   { cls: 'g-high-contrast' },
            gGrayscale:      { cls: 'g-grayscale' },
            gBigCursor:      { cls: 'g-big-cursor' },
            gHighlightLinks: { cls: 'g-highlight-links' },
            gFocusVisible:   { cls: 'g-focus-visible' },
            gReadingGuide:   { cls: 'g-reading-guide' }
        };

        // ── Guida lettura: segue il mouse con GPU transform accelerata a 60/144fps ──
        let guideRaf = null;
        document.addEventListener('mousemove', (e) => {
            if (!document.documentElement.classList.contains('g-reading-guide')) return;
            if (guideRaf) return;
            const y = e.clientY;
            guideRaf = requestAnimationFrame(() => {
                guideLine.style.transform = `translateY(${y}px)`;
                guideRaf = null;
            });
        }, { passive: true });

        // ── Aggiornamento UI font conforme WCAG 1.4.4 ──
        const updateFontUI = () => {
            const pct = fontSteps[fontIndex];
            document.documentElement.style.fontSize = pct === 100 ? '' : `${(16 * pct) / 100}px`;
            const valEl = document.getElementById('gFontVal');
            const decBtn = document.getElementById('gDecFont');
            const incBtn = document.getElementById('gIncFont');
            if (valEl) valEl.textContent = `${pct}%`;
            if (decBtn) decBtn.disabled = fontIndex === 0;
            if (incBtn) incBtn.disabled = fontIndex === fontSteps.length - 1;
            adjustPositionForFooter();
        };

        // ── Apertura / chiusura pannello ──
        const setPanelOpen = (open) => {
            const isOpen = typeof open === 'boolean' ? open : !panel.classList.contains('is-open');
            panel.classList.toggle('is-open', isOpen);
            panel.setAttribute('aria-hidden', String(!isOpen));
            btn.setAttribute('aria-expanded', String(isOpen));
            btn.classList.toggle('is-active', isOpen);
            document.documentElement.classList.toggle('g-a11y-open', isOpen);
            if (a11yBackdrop) {
                a11yBackdrop.classList.toggle('is-visible', isOpen);
            }
            if (backToTopBtn) {
                if (isOpen) {
                    backToTopBtn.style.opacity = '0';
                    backToTopBtn.style.pointerEvents = 'none';
                } else {
                    backToTopBtn.style.opacity = '';
                    backToTopBtn.style.pointerEvents = '';
                }
            }
            const tooltip = btn.querySelector('.g-a11y-tooltip');
            if (tooltip) {
                tooltip.textContent = isOpen ? 'Chiudi' : 'Accessibilità';
            }
            btn.setAttribute('aria-label',
                isOpen ? 'Chiudi impostazioni di accessibilità' : 'Apri impostazioni di accessibilità'
            );
            if (isOpen) {
                adjustPositionForFooter();
                const firstFocusable = panel.querySelector('button:not(:disabled), input:not(:disabled)');
                if (firstFocusable) setTimeout(() => firstFocusable.focus(), 50);
            }
        };

        // ── Event listeners: pulsante principale ──
        btn.addEventListener('mousedown', (e) => {
            // Evita che il doppio o triplo click rapido selezioni il testo della pagina
            e.preventDefault();
        });

        btn.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            setPanelOpen();
        });

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && panel.classList.contains('is-open')) {
                e.preventDefault();
                setPanelOpen(false);
            }
        });

        // ── Chiusura click / tocco esterno conforme mobile & desktop ──
        const closeA11yOutside = (e) => {
            if (!panel.classList.contains('is-open')) return;
            if (!panel.contains(e.target) && !btn.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
                setPanelOpen(false);
            }
        };

        if (a11yBackdrop) {
            a11yBackdrop.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setPanelOpen(false);
            });
            a11yBackdrop.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setPanelOpen(false);
            }, { passive: false });
            a11yBackdrop.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                setPanelOpen(false);
            });
        }

        document.addEventListener('click', closeA11yOutside, true);
        document.addEventListener('touchstart', closeA11yOutside, { passive: false, capture: true });
        document.addEventListener('pointerdown', closeA11yOutside, true);

        // Chiude automaticamente se la finestra perde il focus (es. tocco su iframe)
        window.addEventListener('blur', () => {
            if (panel.classList.contains('is-open')) {
                setPanelOpen(false);
            }
        });

        // ── Gestione tastiera (Escape + Tab trap conforme WCAG) ──
        panel.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                setPanelOpen(false);
                btn.focus();
                return;
            }
            if (e.key === 'Tab') {
                const focusables = Array.from(
                    panel.querySelectorAll('button:not(:disabled), input:not(:disabled)')
                );
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });

        // ── Controlli font ──
        const decBtn = document.getElementById('gDecFont');
        const incBtn = document.getElementById('gIncFont');
        if (decBtn) {
            decBtn.addEventListener('click', () => {
                if (fontIndex > 0) { fontIndex--; updateFontUI(); }
            });
        }
        if (incBtn) {
            incBtn.addEventListener('click', () => {
                if (fontIndex < fontSteps.length - 1) { fontIndex++; updateFontUI(); }
            });
        }

        // ── Toggle listeners conforme WCAG (nessun cookie / memorizzazione permanente) ──
        Object.keys(TOGGLES).forEach(id => {
            const cb = document.getElementById(id);
            if (!cb) return;
            cb.addEventListener('change', () => {
                document.documentElement.classList.toggle(TOGGLES[id].cls, cb.checked);
                cb.setAttribute('aria-checked', String(cb.checked));
            });
        });

        // ── Sintesi Vocale TTS (Text-To-Speech) con Voce Naturale Italiana e Box Dinamico ──
        let utteranceId = 0;
        let isSpeechReading = false;
        let pageReading = false;
        let currentSpeakingElement = null;

        const showReadingBox = () => {
            if (!readingBox) return;
            readingBox.classList.add('is-visible');
        };

        const hideReadingBox = () => {
            if (!readingBox) return;
            readingBox.classList.remove('is-visible');
        };

        const updateSpeechButtons = () => {
            const stopBtn = document.getElementById('a11yTtsStop');
            const pageBtn = document.getElementById('a11yTtsPage');

            if (stopBtn) stopBtn.style.display = isSpeechReading ? 'inline-flex' : 'none';
            if (pageBtn) pageBtn.classList.toggle('is-playing', isSpeechReading);
        };

        // ── Selezione della migliore voce italiana naturale disponibile ──
        let cachedItalianVoice = null;

        const getBestItalianVoice = () => {
            if (!('speechSynthesis' in window)) return null;
            const voices = window.speechSynthesis.getVoices() || [];
            if (!voices || voices.length === 0) return null;

            // Filtra solo le voci autenticamente italiane (lingua it-IT, it, it_IT, it-CH)
            // oppure con 'italian' / 'italiano' nel nome
            const itVoices = voices.filter(v => {
                const lang = (v.lang || '').replace('_', '-').toLowerCase();
                const name = (v.name || '').toLowerCase();
                return lang === 'it-it' ||
                       lang === 'it' ||
                       lang.startsWith('it-') ||
                       name.includes('italian') ||
                       name.includes('italiano');
            });

            if (itVoices.length === 0) {
                // Fallback estremo per nomi tipici di voci italiane di sistema
                const fallbackNames = ['elsa', 'isabella', 'cosimo', 'alice', 'federica', 'luca', 'paola', 'chiara'];
                const fallback = voices.find(v => fallbackNames.some(fn => (v.name || '').toLowerCase().includes(fn)));
                return fallback || null;
            }

            // Gerarchia di preferenza per voce umana naturale senza accento straniero:
            // 1. Voci Microsoft Natural/Online italiane (Edge/Windows: Elsa, Isabella, Cosimo - qualità neurale eccellente)
            const naturalVoice = itVoices.find(v => /natural|online/i.test(v.name));
            if (naturalVoice) return naturalVoice;

            // 2. Voce Google Italiano (Chrome)
            const googleVoice = itVoices.find(v => /google/i.test(v.name));
            if (googleVoice) return googleVoice;

            // 3. Voci italiane native di sistema ad alta qualità
            const knownHighQuality = ['elsa', 'isabella', 'cosimo', 'alice', 'federica', 'luca', 'paola'];
            const topVoice = itVoices.find(v => knownHighQuality.some(k => (v.name || '').toLowerCase().includes(k)));
            if (topVoice) return topVoice;

            // 4. Prima voce con tag 'it-IT'
            const exactIt = itVoices.find(v => (v.lang || '').replace('_', '-').toLowerCase() === 'it-it');
            if (exactIt) return exactIt;

            return itVoices[0];
        };

        const updateItalianVoice = () => {
            const found = getBestItalianVoice();
            if (found) cachedItalianVoice = found;
        };

        if ('speechSynthesis' in window) {
            updateItalianVoice();
            window.speechSynthesis.onvoiceschanged = () => {
                updateItalianVoice();
            };
        }

        // Assicura che le voci del browser siano caricate (Chromium carica getVoices() asincronamente)
        const ensureVoicesReady = (callback) => {
            if (!('speechSynthesis' in window)) {
                if (callback) callback();
                return;
            }
            updateItalianVoice();
            if (cachedItalianVoice) {
                if (callback) callback();
                return;
            }
            const current = window.speechSynthesis.getVoices();
            if (current && current.length > 0) {
                updateItalianVoice();
                if (callback) callback();
                return;
            }
            let executed = false;
            const onVoices = () => {
                if (executed) return;
                executed = true;
                updateItalianVoice();
                if (callback) callback();
            };
            window.speechSynthesis.onvoiceschanged = onVoices;
            setTimeout(() => {
                if (!executed) {
                    executed = true;
                    updateItalianVoice();
                    if (callback) callback();
                }
            }, 250);
        };

        const splitText = (text, max = 180) => {
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
        };

        let currentAudio = null;

        const stopSpeech = () => {
            utteranceId++;
            pageReading = false;
            if (currentAudio) {
                try {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                } catch (e) {}
                currentAudio = null;
            }
            if ('speechSynthesis' in window) {
                try { window.speechSynthesis.cancel(); } catch (e) {}
            }
            isSpeechReading = false;
            if (currentSpeakingElement) {
                currentSpeakingElement.classList.remove('a11y-speaking-element');
                currentSpeakingElement = null;
            }
            hideReadingBox();
            updateSpeechButtons();
        };

        const playWebSpeechFallback = (chunkText, onNext) => {
            if (!('speechSynthesis' in window)) {
                if (onNext) onNext();
                return;
            }
            const u = new SpeechSynthesisUtterance(chunkText);
            u.lang = 'it-IT';
            u.rate = 1.0;
            u.pitch = 1.0;

            const voice = cachedItalianVoice || getBestItalianVoice();
            if (voice) {
                u.voice = voice;
                u.lang = voice.lang || 'it-IT';
            }

            u.onend = onNext;
            u.onerror = (e) => {
                if (e.error === 'interrupted' || e.error === 'canceled') return;
                console.warn('GustAvo fallback TTS errore:', e.error);
                if (onNext) onNext();
            };

            window.speechSynthesis.speak(u);
        };

        const speakText = (text, onComplete) => {
            text = (text || '').trim();
            if (!text) return;

            const myId = ++utteranceId;
            const chunks = splitText(text, 140);
            let i = 0;

            if (currentAudio) {
                try { currentAudio.pause(); } catch (e) {}
                currentAudio = null;
            }
            if ('speechSynthesis' in window) {
                try { window.speechSynthesis.cancel(); } catch (e) {}
            }

            isSpeechReading = true;
            updateSpeechButtons();
            showReadingBox();

            const finish = () => {
                if (myId !== utteranceId) return;
                isSpeechReading = false;
                updateSpeechButtons();
                hideReadingBox();
                if (onComplete) onComplete();
            };

            const speakNext = () => {
                if (myId !== utteranceId) return;
                if (i >= chunks.length) { finish(); return; }

                const chunkText = chunks[i++];
                showReadingBox();

                // Riproduzione con l'endpoint TTS ufficiale del chatbot (la stessa identica voce di gustavo1.avoprogetti.it)
                const ttsUrl = `https://gustavo1.avoprogetti.it/api/tts?text=${encodeURIComponent(chunkText)}`;
                const audio = new Audio(ttsUrl);
                currentAudio = audio;

                audio.onended = () => {
                    if (myId !== utteranceId) return;
                    currentAudio = null;
                    speakNext();
                };

                audio.onerror = (e) => {
                    if (myId !== utteranceId) return;
                    console.warn('GustAvo Server TTS offline o errore, fallback su Web Speech locale:', e);
                    currentAudio = null;
                    playWebSpeechFallback(chunkText, speakNext);
                };

                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        if (myId !== utteranceId) return;
                        console.warn('Riproduzione audio server non avviata, fallback:', err);
                        currentAudio = null;
                        playWebSpeechFallback(chunkText, speakNext);
                    });
                }
            };

            speakNext();
        };

        const readFullPage = () => {
            if (isSpeechReading || pageReading) {
                stopSpeech();
                return;
            }

            setPanelOpen(false); // Chiude il pannello così l'utente vede l'evidenziazione e il box sulla pagina

            ensureVoicesReady(() => {
                const root = document.querySelector('main') || document.getElementById('main') || document.body;
                let elements = Array.from(root.querySelectorAll('h1, h2, h3, h4, p, li'))
                    .filter(el => !el.closest('.g-a11y-panel, .g-a11y-btn, #a11yTtsReadingBox, nav, footer, script, noscript, .modal, .encounter-modal, .lightbox-modal'));
                elements = elements.filter(el => !elements.some(o => o !== el && el.contains(o)));

                if (elements.length === 0) {
                    speakText((root.innerText || '').substring(0, 1500));
                    return;
                }

                pageReading = true;
                let index = 0;

                const readNext = () => {
                    if (currentSpeakingElement) {
                        currentSpeakingElement.classList.remove('a11y-speaking-element');
                        currentSpeakingElement = null;
                    }
                    if (!pageReading || index >= elements.length) {
                        stopSpeech();
                        return;
                    }
                    const el = elements[index++];
                    const text = (el.innerText || el.textContent || '').trim();
                    if (text.length <= 2) { readNext(); return; }

                    currentSpeakingElement = el;
                    el.classList.add('a11y-speaking-element');
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    speakText(text, readNext);
                };

                readNext();
            });
        };

        // Event listeners per controlli TTS
        const ttsPageBtn = document.getElementById('a11yTtsPage');
        const ttsStopBtn = document.getElementById('a11yTtsStop');

        if (ttsPageBtn) {
            ttsPageBtn.addEventListener('click', () => {
                readFullPage();
            });
        }

        if (ttsStopBtn) {
            ttsStopBtn.addEventListener('click', () => {
                stopSpeech();
            });
        }

        if (ttsBoxStopBtn) {
            ttsBoxStopBtn.addEventListener('click', () => {
                stopSpeech();
            });
        }

        // ── Gestione tasto ESC: interrompe immediatamente la lettura vocale TTS ovunque nella pagina ──
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                if (isSpeechReading || pageReading || currentAudio) {
                    e.preventDefault();
                    stopSpeech();
                }
            }
        });

        window.addEventListener('beforeunload', stopSpeech);

        // ── Reset ──
        const resetBtn = document.getElementById('gustavoA11yReset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                stopSpeech();

                // Reset font
                fontIndex = 0;
                updateFontUI();

                // Reset classi html
                Object.values(TOGGLES).forEach(({ cls }) => {
                    document.documentElement.classList.remove(cls);
                });
                OBSOLETE_CLASSES.forEach(cls => {
                    document.documentElement.classList.remove(cls);
                });

                // Reset checkbox
                Object.keys(TOGGLES).forEach(id => {
                    const cb = document.getElementById(id);
                    if (cb) {
                        cb.checked = false;
                        cb.setAttribute('aria-checked', 'false');
                    }
                });

                // Rimozione di eventuali chiavi residue di storage / cookie
                try { localStorage.removeItem('gustavo_a11y_v2'); } catch (e) {}
                adjustPositionForFooter();
            });
        }

        // ── Pulizia iniziale di eventuali vecchi dati in localStorage per garantire zero tracciamento ──
        try { localStorage.removeItem('gustavo_a11y_v2'); } catch (e) {}

        // ── Init ──
        updateFontUI();
        adjustPositionForFooter();
    };

    initPhotoSkeletons();
    initEncountersGallery();
    initGustavoAccessibility();
});

