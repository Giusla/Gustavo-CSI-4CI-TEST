/**
 * GustAvo — Knowledge Base Dataset (IIS Amedeo Avogadro)
 * File: assets/js/intents-data.js
 * Descrizione: Knowledge Base completa unificata derivata dallo scraping di itisavogadro.it
 *              e dal dataset legacy di vita scolastica e orientamento.
 */

window.GUSTAVO_INTENTS_DATA = {
  "intents": [
    {
      "tag": "saluti",
      "patterns": [
        "Ciao",
        "Buongiorno",
        "Buonasera",
        "Salve",
        "Hey",
        "Ciao Gustavo",
        "Come va?",
        "C'è qualcuno?",
        "Ehi ciao",
        "Ciao bot",
        "Buondì",
        "Ciao a tutti",
        "Bella Gustavo",
        "We ciao"
      ],
      "responses": [
        "Ciao! Sono GustAvo, l'assistente virtuale dell'IIS Amedeo Avogadro di Torino. Come posso esserti utile oggi?",
        "Buongiorno! Sono GustAvo, il chatbot dell'Avogadro. Dimmi pure cosa vorresti sapere su indirizzi di studio, segreteria, orari, vita scolastica o servizi della scuola!"
      ]
    },
    {
      "tag": "arrivederci",
      "patterns": [
        "Arrivederci",
        "A presto",
        "Ci vediamo",
        "Buona giornata",
        "Buona serata",
        "Ciao grazie di tutto",
        "Alla prossima",
        "Devo andare",
        "Chiudi chat",
        "Buona notte",
        "Ci sentiamo"
      ],
      "responses": [
        "Arrivederci! Per qualsiasi altra informazione sull'IIS Avogadro sono sempre qui pronto ad aiutarti.",
        "A presto! Ti auguro una buona giornata e un ottimo percorso di studio all'Avogadro!"
      ]
    },
    {
      "tag": "identita_bot",
      "patterns": [
        "Chi sei?",
        "Cosa fai?",
        "Come ti chiami?",
        "Presentati",
        "Chi ti ha creato?",
        "Cosa sai fare?",
        "Che cos'è Gustavo?",
        "Parlami di questo progetto",
        "Chi sono i tuoi sviluppatori?",
        "Da chi sei stato programmato?",
        "A cosa servi?"
      ],
      "responses": [
        "Sono GustAvo, il chatbot ufficiale per l'orientamento dell'IIS Amedeo Avogadro di Torino! Sono nato dalla collaborazione tra gli studenti della classe 4CI / 5CI Informatica e CSI Piemonte nell'ambito dei percorsi PCTO (Storie di alternanza). Posso fornirti informazioni dettagliate su tutti i corsi di studio, orari, segreteria, laboratori, vita scolastica, progetti, docenti e servizi dell'istituto."
      ]
    },
    {
      "tag": "ringraziamenti",
      "patterns": [
        "Grazie",
        "Grazie mille",
        "Sei stato utilissimo",
        "Gentilissimo",
        "Perfetto grazie",
        "Ottimo, grazie",
        "Grazie dell'aiuto",
        "Molto chiaro",
        "Grazie Gustavo"
      ],
      "responses": [
        "Di nulla! È un piacere esserti utile. Se hai altre domande, chiedi pure!",
        "Figurati! Per qualsiasi altra curiosità sulla nostra scuola sono a tua completa disposizione."
      ]
    },
    {
      "tag": "contatti_scuola",
      "patterns": [
        "Quali sono i contatti della scuola?",
        "Come posso contattare l'Avogadro?",
        "Numero di telefono dell'Avogadro",
        "Qual è l'email della scuola?",
        "Qual è la PEC dell'Avogadro?",
        "Codice fiscale della scuola",
        "Codice univoco ufficio",
        "Contatti telefonici segreteria",
        "IBAN della scuola",
        "Come inviare una mail all'istituto?",
        "Telefono presidenza"
      ],
      "responses": [
        "I recapiti ufficiali dell'IIS Amedeo Avogadro sono:\n• Sede: Corso San Maurizio 8/A, 10124 Torino (TO)\n• Telefono Centralino: +39 011 8153611\n• Email PEO: tois05100c@istruzione.it\n• Email PEC: tois05100c@pec.istruzione.it\n• Codice Fiscale: 97550230011\n• Codice Univoco Ufficio (Fatturazione Elettronica): UFEEBL\n• IBAN Banca Intesa: IT05K0306909208100000046188\n• IBAN Banca d'Italia: IT51C0100003245114300317144"
      ]
    },
    {
      "tag": "indirizzo_sede",
      "patterns": [
        "Dove si trova la scuola?",
        "Qual è l'indirizzo dell'Avogadro?",
        "Dov'è situato l'istituto?",
        "In che via si trova l'Avogadro?",
        "Posizione della scuola",
        "CAP e indirizzo dell'Avogadro",
        "In quale zona di Torino si trova?",
        "Dov'è l'entrata principale?"
      ],
      "responses": [
        "L'IIS Amedeo Avogadro si trova nel centro storico di Torino, all'indirizzo Corso San Maurizio 8/A (CAP 10124), all'angolo con via Rossini. L'edificio Liberty affaccia su un punto strategico con vista suggestiva sulla Mole Antonelliana ed è a due passi da Palazzo Nuovo, dai Giardini Reali e dall'Auditorium Rai."
      ]
    },
    {
      "tag": "come_raggiungere",
      "patterns": [
        "Come arrivo all'Avogadro?",
        "Quali mezzi pubblici portano all'Avogadro?",
        "Che tram o bus passano vicino alla scuola?",
        "Come raggiungere la scuola dalla stazione?",
        "Autobus per l'Avogadro",
        "Linee GTT per Corso San Maurizio",
        "Come arrivare con i trasporti pubblici?",
        "Mezzi per andare all'Avogadro"
      ],
      "responses": [
        "L'istituto è ottimamente collegato con la rete di trasporti pubblici GTT di Torino:\n• Linee Tram e Bus: 3, 13, 15, 16, 18, 30, 55, 57, 57/, 61, 68\n• Autolinee Extraurbane SATTI (capolinea / fermata di via Fiocchetto)\n• Dalle stazioni ferroviarie Porta Nuova e Porta Susa la scuola è comodamente raggiungibile in pochi minuti di tram o autobus (linee 15, 61, 68)."
      ]
    },
    {
      "tag": "codici_meccanografici",
      "patterns": [
        "Qual è il codice meccanografico?",
        "Codici meccanografici dell'Avogadro",
        "Codice meccanografico per l'iscrizione",
        "Codice scuola per iscriversi",
        "Codice del liceo e del tecnico",
        "Codice meccanografico serale",
        "Quale codice inserire per l'iscrizione?"
      ],
      "responses": [
        "I codici meccanografici dell'Istituto sono indispensabili per le iscrizioni ministeriali:\n• Istituto Principale: TOIS05100C\n• Istituto Tecnico Diurno (Informatica, Elettronica, Meccanica): TOTF051011\n• Sezione Serale (Corsi per studenti lavoratori e adulti): TOTF05151A\n• Liceo Scientifico - Opzione Scienze Applicate: TOPS05101V"
      ]
    },
    {
      "tag": "orari_segreteria",
      "patterns": [
        "Quali sono gli orari della segreteria?",
        "Quando è aperta la segreteria didattica?",
        "A che ora posso andare in segreteria?",
        "Orari di ricevimento al pubblico segreteria",
        "Giorni di apertura sportello segreteria",
        "Apertura al pubblico segreteria studenti",
        "Quando riceve la segreteria?"
      ],
      "responses": [
        "La Segreteria Didattica dell'IIS Avogadro riceve il pubblico nei seguenti giorni e fasce orarie:\n• Martedì: dalle 11:30 alle 13:30\n• Giovedì: dalle 11:30 alle 13:30\n• Sabato: dalle 10:00 alle 12:00\nPer richieste formali o invio documentazione digitale è sempre attiva la casella tois05100c@istruzione.it."
      ]
    },
    {
      "tag": "dirigenza_personale",
      "patterns": [
        "Chi è la preside?",
        "Chi è il dirigente scolastico?",
        "Chi è la vicepreside?",
        "Chi gestisce il serale?",
        "Chi è il DSGA?",
        "Dirigente scolastico Avogadro",
        "Responsabili della scuola",
        "Staff di dirigenza",
        "Nome della preside"
      ],
      "responses": [
        "La dirigenza e i referenti principali dell'istituto sono:\n• Dirigente Scolastico: Dott.ssa Anna Luisa Chiappetta\n• Collaboratrice Vicaria (Vicepresidenza): Prof.ssa Laura Panaro\n• Responsabile Sezione Serale: Prof.ssa Serena Galati\n• Direttore dei Servizi Generali e Amministrativi (DSGA): Dott. Paolo Astuti"
      ]
    },
    {
      "tag": "numeri_della_scuola",
      "patterns": [
        "Quanti studenti ci sono all'Avogadro?",
        "Quante classi ci sono?",
        "I numeri della scuola",
        "Statistiche studenti Avogadro",
        "Quanti alunni ci sono per classe?",
        "Popolazione scolastica"
      ],
      "responses": [
        "I dati dimensionali ufficiali dell'IIS Avogadro (da Scuola in Chiaro):\n• Istituto Tecnico: 1.017 alunni distribuiti su 44 classi (media di 23.11 alunni per classe)\n• Liceo Scientifico Scienze Applicate: 308 alunni distribuiti su 13 classi (media di 23.69 alunni per classe)\n• Complessivamente l'istituto accoglie oltre 1.300 studenti con circa 60 classi attive tra corsi diurni e serali."
      ]
    },
    {
      "tag": "indirizzi_studio_panoramica",
      "patterns": [
        "Quali indirizzi di studio ci sono all'Avogadro?",
        "Cosa si studia all'Avogadro?",
        "Quali corsi offre la scuola?",
        "Offerta formativa indirizzi",
        "Che percorsi di studio ci sono?",
        "Quali specializzazioni ci sono al tecnico?",
        "Quali sono gli indirizzi delle superiori all'Avogadro?",
        "Che scuole ci sono all'Avogadro?"
      ],
      "responses": [
        "L'offerta formativa dell'IIS Amedeo Avogadro comprende:\n1. Istituto Tecnico Tecnologico (Biennio Comune + Trienni):\n   • Informatica e Telecomunicazioni (articolazioni Informatica / Telecomunicazioni)\n   • Elettronica ed Elettrotecnica (articolazioni Elettronica / Elettrotecnica / Automazione)\n   • Meccanica, Meccatronica ed Energia (articolazione Meccanica e Meccatronica / Energia)\n2. Liceo Scientifico - Opzione Scienze Applicate\n3. Sezioni Internazionali Cambridge (Liceo e Tecnico con certificazioni IGCSE)\n4. Sezione Serale (percorso per adulti e studenti lavoratori nel settore industriale)"
      ]
    },
    {
      "tag": "indirizzo_informatica",
      "patterns": [
        "Cosa si studia a Informatica?",
        "Parlami dell'indirizzo Informatica e Telecomunicazioni",
        "Che materie si fanno a informatica?",
        "Sbocchi perito informatico",
        "Corso di informatica Avogadro",
        "Cosa si fa nell'articolazione telecomunicazioni?",
        "Programmazione informatica all'Avogadro",
        "Linguaggi di programmazione studiati"
      ],
      "responses": [
        "L'indirizzo 'Informatica e Telecomunicazioni' prepara periti altamente qualificati nello sviluppo software (Python, C/C++, Java, JavaScript, web & app), gestione database SQL/NoSQL, sicurezza informatica, intelligenza artificiale, architetture cloud, reti locali/geografiche e apparati di trasmissione. Le materie del triennio includono: Informatica, Sistemi e Reti, Tecnologie e Progettazione di Sistemi Informatici e di Telecomunicazioni (TPSIT), Telecomunicazioni e Gestione Progetto."
      ]
    },
    {
      "tag": "indirizzo_elettronica",
      "patterns": [
        "Cosa si studia a Elettronica ed Elettrotecnica?",
        "Parlami dell'indirizzo Elettronica",
        "Indirizzo automazione e robotica",
        "Materie perito elettronico",
        "Cosa si fa a Elettrotecnica?",
        "Programmazione PLC e circuiti",
        "Robotica all'Avogadro"
      ],
      "responses": [
        "L'indirizzo 'Elettronica ed Elettrotecnica' forma figure specializzate nella progettazione di circuiti elettronici analogici e digitali, programmazione di microcontrollori e PLC industriali, robotica, sistemi di controllo automatico e impianti di generazione/distribuzione elettrica. Le materie caratterizzanti sono: Elettronica ed Elettrotecnica, Sistemi Automatici, Tecnologie e Progettazione di Sistemi Elettrici ed Elettronici (TPSEE)."
      ]
    },
    {
      "tag": "indirizzo_meccanica",
      "patterns": [
        "Cosa si studia a Meccanica, Meccatronica ed Energia?",
        "Parlami dell'indirizzo Meccanica",
        "Indirizzo meccatronica Avogadro",
        "Disegno CAD e macchine CNC a scuola",
        "Sbocchi perito meccanico",
        "Termotecnica e fonti rinnovabili",
        "Officina meccanica della scuola"
      ],
      "responses": [
        "L'indirizzo 'Meccanica, Meccatronica ed Energia' è incentrato sulla progettazione tridimensionale computerizzata (CAD 3D, SolidWorks, CATIA), lavorazioni avanzate su macchine utensili a controllo numerico (CNC), robotica industriale, termodinamica, impiantistica energetica e sostenibilità ambientale. Materie chiave: Meccanica Macchine ed Energia, Sistemi e Automazione, Disegno Progettazione e Organizzazione Industriale (DPOI), Tecnologie Meccaniche di Processo e Prodotto."
      ]
    },
    {
      "tag": "indirizzo_liceo_scienze_applicate",
      "patterns": [
        "Come funziona il Liceo Scienze Applicate?",
        "Cosa si studia al Liceo delle Scienze Applicate?",
        "Differenza tra liceo scientifico tradizionale e scienze applicate",
        "C'è il latino al liceo scienze applicate?",
        "Materie del liceo scientifico scienze applicate",
        "Laboratori del liceo scientifico",
        "Sbocchi liceo scienze applicate"
      ],
      "responses": [
        "Il Liceo Scientifico - Opzione Scienze Applicate dell'Avogadro unisce la solida formazione culturale dei licei con un forte orientamento scientifico e tecnologico. Invece del latino, il piano di studi prevede l'Informatica per tutti i 5 anni, un robusto monte ore di Scienze Naturali (Chimica, Biologia, Scienze della Terra), Matematica e Fisica (affidate a docenti distinti per garantire il massimo approfondimento teorico e di laboratorio)."
      ]
    },
    {
      "tag": "indirizzo_cambridge",
      "patterns": [
        "Cos'è la Cambridge International School all'Avogadro?",
        "Indirizzo Cambridge Avogadro",
        "Come funziona la sezione Cambridge?",
        "Certificazioni IGCSE Cambridge all'Avogadro",
        "Inglese potenziato Cambridge",
        "Materie in inglese CLIL",
        "Corsi IGCSE"
      ],
      "responses": [
        "L'Avogadro è centro accreditato 'Cambridge International School'. Nelle sezioni Cambridge (disponibili sia per il Liceo Scienze Applicate che per l'Istituto Tecnico Informatica), alcune discipline curricolari vengono impartite in lingua inglese con la presenza di docenti madrelingua (metodologia CLIL). Gli studenti preparano e sostengono gli esami IGCSE (International General Certificate of Secondary Education), aprendo le porte alle università internazionali."
      ]
    },
    {
      "tag": "sezione_serale",
      "patterns": [
        "Come funziona il corso serale?",
        "Informazioni sulla sezione serale",
        "Corsi serali per studenti lavoratori e adulti",
        "Orari del serale Avogadro",
        "Progetto Sirio serale",
        "Iscrizione al corso serale",
        "Come recuperare gli anni di scuola la sera?",
        "Diploma serale Avogadro"
      ],
      "responses": [
        "L'IIS Avogadro ospita il corso serale nel settore industriale più grande d'Italia (percorsi di istruzione di secondo livello per adulti e studenti lavoratori). Caratteristiche:\n• Orari serali compatti (dal tardo pomeriggio)\n• Flessibilità didattica e riconoscimento dei crediti formativi (lavorativi o scolastici pregressi)\n• Servizio di supporto e consulenza psicologica dedicato\n• Specializzazioni tecniche per il conseguimento del Diploma di Stato di Perito Industriale."
      ]
    },
    {
      "tag": "biennio_comune",
      "patterns": [
        "Come funziona il biennio dell'istituto tecnico?",
        "Che materie ci sono al biennio comune?",
        "Quando si sceglie l'indirizzo di specializzazione?",
        "Materie prima e seconda superiore tecnico",
        "Scelta del triennio tecnico"
      ],
      "responses": [
        "Il primo biennio del settore tecnologico è comune a tutti gli indirizzi tecnici: getta le basi culturali in Italiano, Storia, Inglese, Matematica, Diritto ed Economia, Scienze Integrate (Fisica, Chimica, Scienze della Terra) e include discipline propedeutiche come Tecnologie Informatiche (TIC) e Scienze e Tecnologie Applicate (STA). Al termine del 2° anno lo studente sceglie l'indirizzo definitivo per il triennio."
      ]
    },
    {
      "tag": "iscrizioni_prime",
      "patterns": [
        "Come ci si iscrive alla prima superiore all'Avogadro?",
        "Iscrizioni per l'anno scolastico prossimo",
        "Procedura di iscrizione classi prime",
        "Quando aprono le iscrizioni online?",
        "Iscrizioni MIUR Avogadro",
        "Come iscriversi tramite la piattaforma UNICA?",
        "Iscrizioni online prima superiore"
      ],
      "responses": [
        "Le iscrizioni alle classi prime si effettuano esclusivamente online a gennaio di ogni anno tramite la piattaforma ministeriale UNICA (www.istruzione.it/iscrizionionline/). Nella domanda occorre indicare il codice meccanografico corrispondente:\n• Tecnico Diurno: TOTF051011\n• Liceo Scienze Applicate: TOPS05101V"
      ]
    },
    {
      "tag": "cambio_indirizzo_esami_integrativi",
      "patterns": [
        "Posso cambiare indirizzo di studio?",
        "Come funzionano gli esami integrativi?",
        "Cambio scuola o cambio corso Avogadro",
        "Entro quando fare domanda per l'esame integrativo?",
        "Passaggio da un altro istituto all'Avogadro",
        "Cambiare da liceo a tecnico o viceversa"
      ],
      "responses": [
        "Gli studenti che intendono cambiare indirizzo di studi nel corso del triennio o trasferirsi da un'altra scuola devono sostenere esami integrativi sulle materie non presenti nel piano di studi di provenienza. La richiesta va inoltrata alla Segreteria Didattica entro il mese di Giugno durante gli orari di apertura dello sportello."
      ]
    },
    {
      "tag": "ritiro_diplomi_certificati",
      "patterns": [
        "Come posso ritirare il diploma di maturità?",
        "Tassa di diploma F24",
        "Richiesta certificato di diploma",
        "Codice tributo tassa diploma",
        "Quanto costa il ritiro del diploma?",
        "Come avere il certificato sostitutivo del diploma",
        "Documenti per ritirare la pergamena di diploma",
        "Ritiro pergamena maturità"
      ],
      "responses": [
        "Procedura per certificati e pergamena di diploma:\n1. Effettua il versamento della tassa erariale di 15,13 € tramite modello F24 (sezione Erario, codice tributo TSC4, a nome dello studente diplomato).\n2. Invia la scansione della quietanza di pagamento e di un documento di identità valido a tois05100c@istruzione.it per richiedere il certificato digitale.\n3. Per il ritiro della pergamena originale (quando disponibile), presentati di persona allo sportello della segreteria con la quietanza F24 e un documento di riconoscimento in corso di validità."
      ]
    },
    {
      "tag": "curriculum_studente_europass",
      "patterns": [
        "Cos'è il Curriculum dello studente?",
        "Dove trovo il supplemento Europass?",
        "E-Portfolio piattaforma UNICA",
        "Come scaricare il diploma e il curriculum maturità?",
        "Documenti dopo la maturità"
      ],
      "responses": [
        "Ogni studente diplomato può scaricare in autonomia il proprio Curriculum dello Studente definitivo e il Supplemento Europass al Certificato accedendo all'E-Portfolio sulla piattaforma ministeriale UNICA (unica.istruzione.gov.it), all'interno della sezione 'Documenti'."
      ]
    },
    {
      "tag": "registro_elettronico",
      "patterns": [
        "Quale registro elettronico usa l'Avogadro?",
        "Come accedo a ClasseViva?",
        "Ho perso la password del registro elettronico",
        "Recupero credenziali registro Spaggiari",
        "Come entrare su ClasseViva Spaggiari",
        "Password smarrita ClasseViva",
        "App registro elettronico"
      ],
      "responses": [
        "L'istituto si affida al Registro Elettronico ClasseViva di Spaggiari (web.spaggiari.eu). Per il recupero delle credenziali smarrite puoi cliccare su 'Password dimenticata?' nella pagina di login inserendo la tua email registrata. In caso di mancata ricezione dell'email o problemi con l'account, contatta la segreteria didattica."
      ]
    },
    {
      "tag": "pagamenti_pagoinrete",
      "patterns": [
        "Come pago le tasse scolastiche e le gite?",
        "Pago in Rete Avogadro",
        "Come si effettuano i pagamenti alla scuola?",
        "PagoPA scuola Avogadro",
        "Pagamento assicurazione e contributo scolastico",
        "Bollettini scolastici telematici"
      ],
      "responses": [
        "Tutti i versamenti a favore della scuola (contributo volontario, assicurazione, viaggi di istruzione, esami linguistici/informatici) avvengono tramite il portale ministeriale Pago in Rete (PagoPA), accessibile con SPID o CIE, garantendo ricevute telematiche immediate e detraibilità fiscale."
      ]
    },
    {
      "tag": "strutture_laboratori",
      "patterns": [
        "Quali strutture e laboratori ci sono all'Avogadro?",
        "Com'è attrezzata la scuola?",
        "C'è la palestra all'Avogadro?",
        "C'è la biblioteca?",
        "Aula Magna Rattazzi",
        "La scuola ha la mensa?",
        "Dotazione tecnologica della scuola",
        "Quanti laboratori ci sono?"
      ],
      "responses": [
        "L'Avogadro dispone di un complesso strutturale e laboratoriale d'eccellenza:\n• Decine di laboratori specialistici (Informatica, Reti Cisco, Elettronica, Automazione industriale con PLC, Meccanica con macchine CNC e postazioni CAD 3D)\n• Aula Magna 'Giulio Cesare Rattazzi' multimediale da centinaia di posti (con accesso autonomo da via Rossini)\n• Storica Biblioteca con un patrimonio di oltre 20.000 volumi\n• Nuova grande palestra polifunzionale e campi sportivi\n• Mensa interna per studenti e personale"
      ]
    },
    {
      "tag": "avofinder",
      "patterns": [
        "Cos'è AvoFinder?",
        "Come trovo un'aula all'Avogadro?",
        "Mappa delle aule della scuola",
        "Dov'è il laboratorio o l'aula?",
        "Come orientarsi all'interno della scuola",
        "Piantina dell'edificio scolastico",
        "Mappa interna scuola"
      ],
      "responses": [
        "AvoFinder è l'applicazione di navigazione interna e mappa interattiva dell'Avogadro, sviluppata per orientarsi tra i piani, corridoi e padiglioni dell'istituto storico e trovare immediatamente aule, laboratori, uffici e palestre."
      ]
    },
    {
      "tag": "certificazioni_ecdl_icdl",
      "patterns": [
        "Si può fare la patente europea del computer all'Avogadro?",
        "Patente europea del computer ECDL ICDL Avogadro",
        "Esami ICDL a scuola",
        "Corsi ECDL Avogadro",
        "Test Center ECDL Torino",
        "Certificazione informatica ECDL"
      ],
      "responses": [
        "Sì, l'IIS Avogadro è Test Center accreditato AICA per il conseguimento della Patente Europea del Computer (ICDL / ECDL). La scuola organizza corsi di preparazione (Full Standard e moduli specialistici) e regolari sessioni d'esame per studenti e personale."
      ]
    },
    {
      "tag": "certificazioni_cambridge_english",
      "patterns": [
        "Quali certificazioni di lingua inglese si possono fare?",
        "Esami Cambridge B2 C1 Avogadro",
        "Corsi di inglese First e PET",
        "Certificazioni linguistiche per studenti",
        "Certificato B2 inglese a scuola"
      ],
      "responses": [
        "L'IIS Avogadro promuove corsi extracurricolari di lingua inglese per il conseguimento delle certificazioni internazionali Cambridge English: B1 Preliminary (PET), B2 First (FCE) e C1 Advanced (CAE), con docenti madrelingua e sessioni d'esame in sede."
      ]
    },
    {
      "tag": "pcto_stage",
      "patterns": [
        "Come funziona il PCTO all'Avogadro?",
        "Alternanza scuola lavoro",
        "Si fanno stage nelle aziende?",
        "Progetti con aziende ed enti esterni",
        "Convenzioni PCTO Avogadro",
        "Quante ore di PCTO bisogna fare?"
      ],
      "responses": [
        "Il PCTO (Percorsi per le Competenze Trasversali e l'Orientamento) all'Avogadro comprende:\n• 150 ore obbligatorie per gli istituti tecnici e 90 ore per i licei nell'arco del triennio.\n• Tirocini estivi e curricolari in grandi aziende e partner storici (CSI Piemonte, realtà IT, automotive, ingegneria, enti di ricerca).\n• Progetti applicativi reali come il chatbot GustAvo e laboratori di sicurezza sul lavoro."
      ]
    },
    {
      "tag": "storia_avogadro",
      "patterns": [
        "Qual è la storia dell'Avogadro?",
        "Quando è stata fondata la scuola?",
        "Storia dell'istituto Amedeo Avogadro",
        "Perché l'Avogadro è famoso a Torino?",
        "Da dove nasce l'Istituto Avogadro?",
        "Chi era il fondatore dell'Avogadro?",
        "Origini dell'Avogadro"
      ],
      "responses": [
        "L'IIS Avogadro è tra le più antiche e prestigiose istituzioni tecniche d'Italia:\n• Origini: 11 gennaio 1805 come scuola serale municipale di disegno.\n• 1878: Apertura della scuola di chimica grazie a un lascito del marchese Ainardo Benso di Cavour.\n• 1900: Creazione dell'Istituto Professionale Operaio nella sede di Corso San Maurizio, diretto dall'Ing. Ignazio Verrotti.\n• 1923: Regio Istituto Industriale di Torino con la Riforma Gentile.\n• 1946: Intitolazione ufficiale al fisico e chimico Amedeo Avogadro.\n• Dal suo tronco storico sono nati i principali istituti tecnici torinesi: Peano, Pininfarina, Grassi, Casale, Guarrella, Levi e Fermi."
      ]
    },
    {
      "tag": "supporto_psicologico",
      "patterns": [
        "C'è lo psicologo a scuola?",
        "Sportello di ascolto e consulenza psicologica",
        "Come parlare con lo psicologo dell'Avogadro?",
        "Supporto psicologico per studenti",
        "Sportello CIC ascolto",
        "Consulenza psicologica gratuita"
      ],
      "responses": [
        "L'istituto mette a disposizione di tutti gli studenti (corsi diurni e serale) uno Sportello di Ascolto Psicologico gratuito e confidenziale, tenuto da specialisti per supportare i ragazzi nel benessere emotivo, relazionale e nel superamento delle difficoltà di studio."
      ]
    },
    {
      "tag": "orientamento_universitario",
      "patterns": [
        "C'è l'orientamento per l'università e il Politecnico?",
        "Test di ammissione Politecnico di Torino Avogadro",
        "Come prepararsi al Politecnico con l'Avogadro?",
        "Stage estivi all'università UniTO PoliTO",
        "Sessione riservata TIL Politecnico",
        "Preparazione università scientifiche"
      ],
      "responses": [
        "L'Avogadro offre un percorso d'eccellenza per la prosecuzione universitaria: per gli studenti dell'ultimo anno è attivo il Progetto Orientamento al Politecnico di Torino, che permette di prepararsi con docenti universitari e accedere a una sessione riservata del test di ammissione (TIL). Inoltre vengono organizzati stage estivi di fisica e matematica presso l'Università degli Studi di Torino e il PoliTO."
      ]
    },
    {
      "tag": "olimpiadi_e_gare",
      "patterns": [
        "Si partecipa a gare o olimpiadi all'Avogadro?",
        "Gara Nazionale di Informatica",
        "Olimpiadi della matematica e fisica",
        "OliCyber sicurezza informatica",
        "Competizioni per studenti Avogadro",
        "Gare di robotica"
      ],
      "responses": [
        "L'istituto partecipa regolarmente a gare scientifiche di rilievo nazionale: Olimpiadi di Matematica, Fisica, Chimica, Astronomia, Neuroscienze, OliCyber (campionato di sicurezza informatica, con medaglie nazionali conquistate dai nostri allievi) e la Gara Nazionale di Informatica promossa dal Ministero."
      ]
    },
    {
      "tag": "progetti_internazionali_erasmus",
      "patterns": [
        "Quali sono i progetti internazionali della scuola?",
        "Avo International",
        "Erasmus Avogadro",
        "Scambi culturali con l'estero",
        "Viaggi e mobilità internazionale studenti",
        "Progetti AIESEC all'Avogadro",
        "Scambi linguistici all'estero"
      ],
      "responses": [
        "Con il programma 'Avo International' (Erasmus+ e scambi internazionali), gli studenti partecipano a progetti di mobilità e scambi con partner europei a Pontevedra (Spagna), Nyborg (Danimarca), Madrid, Dublino (Irlanda), oltre a ospitare studenti stranieri in mobilità in ingresso e accogliere volontari del progetto AIESEC."
      ]
    },
    {
      "tag": "progetti_studenti_classe",
      "patterns": [
        "Quali progetti speciali fanno le classi?",
        "Progetto CanSat AvoVoyagers",
        "Avo Mappers",
        "A scuola di OpenCoesione",
        "Progetto Telmotor",
        "Progetto cortometraggi e filmmaking",
        "Attività innovative delle classi"
      ],
      "responses": [
        "Tra i progetti interdisciplinari realizzati dalle classi spiccano:\n• CanSat (team 'AvoVoyagers'): progettazione e lancio di minisatelliti in lattina con l'ESA\n• Avo Mappers & Avo Finder: mappatura digitale degli spazi scolastici\n• A scuola di OpenCoesione (ASOC): monitoraggio civico dei finanziamenti pubblici\n• Progetto Telmotor: automazione e sensoristica avanzata\n• Laboratorio di Filmmaking: cortometraggi di sensibilizzazione sulla sicurezza sul lavoro (es. 'La Lista')."
      ]
    },
    {
      "tag": "carta_dello_studente",
      "patterns": [
        "Cos'è la Carta dello Studente?",
        "IoStudio carta dello studente",
        "Come richiedere la tessera studente?",
        "Sconti e convenzioni per studenti",
        "Tessera sconti cinema studenti"
      ],
      "responses": [
        "La Carta dello Studente 'IoStudio' è il badge ufficiale del Ministero dell'Istruzione che attesta lo status di studente e consente di accedere a convenzioni e agevolazioni per musei, cinema, teatri, viaggi e acquisti tecnologici. Viene distribuita gratuitamente alle classi prime o richiesta tramite la segreteria."
      ]
    },
    {
      "tag": "regolamenti_scolastici",
      "patterns": [
        "Dove trovo i regolamenti della scuola?",
        "Regolamento d'Istituto Avogadro",
        "Patto educativo di corresponsabilità",
        "Statuto delle studentesse e degli studenti",
        "Regole di condotta a scuola",
        "Regolamento di disciplina"
      ],
      "responses": [
        "I documenti normativi e i regolamenti (Regolamento d'Istituto, Statuto degli Studenti, Patto Educativo di Corresponsabilità, Regolamento Laboratori e Disciplina) sono liberamente consultabili sul sito istituzionale www.itisavogadro.it nella sezione 'Scuola' > 'Le carte della scuola'."
      ]
    },
    {
      "tag": "libri_di_testo",
      "patterns": [
        "Dove trovo la lista dei libri di testo?",
        "Elenco libri scolastici adottati",
        "Libri di testo per il prossimo anno",
        "Adozioni libri di testo Avogadro",
        "Quali libri comprare?"
      ],
      "responses": [
        "L'elenco ufficiale dei libri di testo adottati per tutte le classi e indirizzi (tecnico, liceo e serale) è pubblicato sul sito web www.itisavogadro.it nella sezione Didattica > Libri di testo."
      ]
    },
    {
      "tag": "esami_recupero_debiti",
      "patterns": [
        "Quando ci sono gli esami di riparazione?",
        "Esami giudizio sospeso Avogadro",
        "Corsi di recupero estivi per i debiti",
        "Calendario esami di recupero",
        "Quando si fanno i debiti a settembre?",
        "Esami di debito fine estate"
      ],
      "responses": [
        "Le verifiche per il saldo del giudizio sospeso (debiti formativi) e i corsi di recupero estivi si tengono solitamente tra la fine di agosto e i primi giorni di settembre. I calendari dettagliati con aule e commissioni vengono pubblicati nelle circolari e nelle news del sito www.itisavogadro.it."
      ]
    },
    {
      "tag": "orario_e_calendario_scolastico",
      "patterns": [
        "A che ora iniziano e finiscono le lezioni?",
        "Qual è l'orario scolastico?",
        "Calendario scolastico Avogadro",
        "Quando iniziano le vacanze scolastiche?",
        "Scansione oraria lezioni",
        "A che ora suona la campanella?"
      ],
      "responses": [
        "L'orario delle lezioni del diurno ha inizio alle 8:00 e si articola su moduli orari da 60 minuti in base all'indirizzo e all'orario settimanale. Il calendario delle festività e delle sospensioni didattiche segue le delibere regionali del Piemonte ed è consultabile nell'area 'Servizi' del sito www.itisavogadro.it."
      ]
    },
    {
      "tag": "intervallo_ricreazione",
      "patterns": [
        "A che ora è l'intervallo?",
        "Quando c'è la ricreazione?",
        "Quanti intervalli ci sono?",
        "Durata della ricreazione",
        "A che ora è la pausa?",
        "Orari intervallo scuola"
      ],
      "responses": [
        "Durante la mattinata è prevista la consueta pausa di ricreazione (intervallo) tra la terza e la quarta ora (indicativamente dalle 10:55 alle 11:10), durante la quale gli studenti possono consumare la merenda e usufruire dei distributori automatici nei corridoi."
      ]
    },
    {
      "tag": "bar_macchinette",
      "patterns": [
        "C'è il bar a scuola?",
        "Dove sono le macchinette?",
        "Distributori automatici snack e caffè",
        "C'è un punto ristoro?",
        "Dove comprare cibo o bevande all'Avogadro?"
      ],
      "responses": [
        "All'interno dell'edificio sono dislocati diversi distributori automatici (macchinette) di bevande calde, acqua, bibite e snack nei punti di passaggio e vicino ai corridoi principali. La scuola dispone inoltre di una mensa interna per gli studenti con orario pomeridiano o attività prolungate."
      ]
    },
    {
      "tag": "wifi_scuola",
      "patterns": [
        "C'è il Wi-Fi a scuola?",
        "Come connettersi al WiFi dell'Avogadro?",
        "Password del Wi-Fi scolastico",
        "Rete wireless studenti",
        "Accesso internet per studenti e docenti"
      ],
      "responses": [
        "L'istituto è interamente coperto da rete Wi-Fi didattica protetta. Gli studenti e i docenti possono accedere alla rete wireless utilizzando le proprie credenziali istituzionali Google Workspace (@itisavogadro.it) fornite all'inizio dell'anno scolastico."
      ]
    },
    {
      "tag": "assemblea_istituto_classe",
      "patterns": [
        "Come funzionano le assemblee di istituto?",
        "Assemblea di classe come richiederla",
        "Quante ore di assemblea al mese si possono fare?",
        "Regolamento assemblee studentesche"
      ],
      "responses": [
        "Gli studenti hanno diritto a un'assemblea di istituto al mese (fino a un giorno di durata) e a due ore mensili di assemblea di classe, previa richiesta formale firmata dai rappresentanti di classe/istituto e autorizzata dalla Dirigenza Scolastica nei termini previsti dal Regolamento."
      ]
    },
    {
      "tag": "rappresentanti_studenti",
      "patterns": [
        "Chi sono i rappresentanti degli studenti?",
        "Rappresentanti di classe",
        "Rappresentanti di istituto",
        "Consulta provinciale degli studenti",
        "Come candidarsi a rappresentante?"
      ],
      "responses": [
        "Ogni anno a inizio autunno si tengono le elezioni per eleggere:\n• 2 rappresentanti per ogni classe\n• 4 rappresentanti degli studenti nel Consiglio d'Istituto\n• I delegati alla Consulta Provinciale degli Studenti (CPS).\nI rappresentanti portano le proposte e le istanze degli studenti agli organi direttivi della scuola."
      ]
    },
    {
      "tag": "fumo_e_divieti",
      "patterns": [
        "Si può fumare a scuola?",
        "Divieto di fumo Avogadro",
        "Si possono usare le sigarette elettroniche?",
        "Multa per chi fuma a scuola",
        "Regolamento fumo"
      ],
      "responses": [
        "In conformità alla legge italiana e al Regolamento d'Istituto, è severamente vietato fumare (inclusi i dispositivi elettronici / svapo) in tutti i locali interni, cortili, ingressi e pertinenze dell'Istituto. La violazione comporta sanzioni amministrative pecuniarie e provvedimenti disciplinari."
      ]
    },
    {
      "tag": "parcheggio_bici_motorini",
      "patterns": [
        "Dove posso parcheggiare il motorino?",
        "C'è il parcheggio per le bici?",
        "Parcheggio scooter e monopattini all'Avogadro",
        "Rastrelliere per biciclette scuola"
      ],
      "responses": [
        "All'interno dei cortili dell'istituto sono presenti apposite rastrelliere e spazi delimitati per il parcheggio sicuro di biciclette, monopattini e scooter durante l'orario delle lezioni, a cui si accede dai cancelli dedicati."
      ]
    },
    {
      "tag": "regolamento_palestra",
      "patterns": [
        "Cosa serve per educazione fisica?",
        "Regolamento palestra Avogadro",
        "Scarpe di ricambio palestra",
        "Abbigliamento per scienze motorie"
      ],
      "responses": [
        "Per accedere alla palestra è obbligatorio indossare una tuta/abbigliamento sportivo adeguato e scarpe da ginnastica pulite con suola in gomma utilizzate esclusivamente per la palestra (da cambiare nello spogliatoio per preservare il parquet)."
      ]
    },
    {
      "tag": "regolamento_laboratori",
      "patterns": [
        "Qual è il regolamento dei laboratori?",
        "Si può mangiare nei laboratori?",
        "Norme di sicurezza nei laboratori di informatica e meccanica",
        "Camice per il laboratorio"
      ],
      "responses": [
        "Nei laboratori didattici è vietato introdurre cibi o bevande e modificare le configurazioni hardware/software. Nei laboratori di chimica, meccanica ed elettrotecnica è obbligatorio indossare i DPI previsti (camice protettivo, scarpe antinfortunistiche o occhiali di protezione dove richiesto dai docenti)."
      ]
    },
    {
      "tag": "valutazione_voti_crediti",
      "patterns": [
        "Come funzionano i voti e i crediti scolastici?",
        "Scala dei voti scolastici",
        "Come si calcolano i crediti per la maturità?",
        "Quanti punti di credito si possono avere?"
      ],
      "responses": [
        "I voti sono espressi in decimi (da 1 a 10, con la sufficienza fissata al 6). Nel corso del triennio (classi 3ª, 4ª e 5ª) ogni studente accumula il 'credito scolastico' in base alla media dei voti finali, fino a un massimo di 40 punti complessivi che concorrono al voto finale dell'Esame di Stato (su 100)."
      ]
    },
    {
      "tag": "limite_assenze_validita_anno",
      "patterns": [
        "Quante assenze posso fare al massimo?",
        "Limite massimo di ore di assenza",
        "Validità dell'anno scolastico assenze",
        "Quante ore posso perdere senza rischiare la bocciatura?",
        "Deroghe al limite delle assenze"
      ],
      "responses": [
        "Per la validità dell'anno scolastico è richiesta la frequenza di almeno tre quarti (75%) del monte ore annuale personalizzato. Il Collegio dei Docenti stabilisce motivate deroghe per gravi motivi di salute documentati da certificato medico, terapie continuative o partecipazione ad attività sportive agonistiche certificate."
      ]
    },
    {
      "tag": "abbonamento_trasporti_gtt",
      "patterns": [
        "Come fare l'abbonamento GTT per studenti?",
        "Agevolazioni trasporti per studenti Avogadro",
        "Certificato per abbonamento bus e tram",
        "Sconti GTT Under 26"
      ],
      "responses": [
        "Gli studenti residenti a Torino o nella Città Metropolitana possono richiedere l'abbonamento GTT Under 26 / studenti a tariffa agevolata ISEE direttamente sul portale GTT o tramite e-commerce. Se necessario, il certificato di frequenza scolastica può essere richiesto in segreteria o scaricato online."
      ]
    },
    {
      "tag": "giustificazioni_assenze_ritardi",
      "patterns": [
        "Come si giustificano le assenze?",
        "Permessi di entrata in ritardo e uscita anticipata",
        "Giustificazione assenza su ClasseViva",
        "Come entrare alla seconda ora?",
        "Giustificare assenza genitore"
      ],
      "responses": [
        "Le assenze, le entrate in ritardo e le uscite anticipate si giustificano online tramite le credenziali genitore sul Registro Elettronico ClasseViva Spaggiari. Per ingressi dopo la prima ora o uscite anticipate prima del termine dell'orario, gli studenti minorenni devono essere ritirati da un genitore o presentare autorizzazione telematica registrata sul portale."
      ]
    },
    {
      "tag": "consiglio_istituto_organi",
      "patterns": [
        "Chi fa parte del Consiglio di Istituto?",
        "Organi collegiali Avogadro",
        "Rappresentanti di classe e di istituto",
        "Collegio docenti",
        "Comitato studentesco"
      ],
      "responses": [
        "L'Istituto è governato dagli Organi Collegiali: il Consiglio d'Istituto (composto dal Dirigente Scolastico e da rappresentanti eletti di docenti, personale ATA, genitori e studenti), il Collegio dei Docenti, i Consigli di Classe e il Comitato di Valutazione."
      ]
    },
    {
      "tag": "albo_online_e_circolari",
      "patterns": [
        "Dove trovo le circolari della scuola?",
        "Albo online Avogadro",
        "Bandi e avvisi di selezione",
        "Comunicati per studenti e famiglie",
        "Ultime circolari della preside"
      ],
      "responses": [
        "Tutte le circolari ufficiali, i comunicati del Dirigente e gli avvisi di selezione pubblica sono consultabili in tempo reale sul sito www.itisavogadro.it nelle sezioni 'Le circolari' e 'Albo Online'."
      ]
    },
    {
      "tag": "polo_formativo_avonlife",
      "patterns": [
        "Cos'è il Polo Formativo Avonlife?",
        "Formazione docenti Avogadro",
        "Corsi di formazione digitale per insegnanti",
        "Futura Avogadro",
        "Piattaforma Avonlife"
      ],
      "responses": [
        "AvOnLife (avoonlife.itisavogadro.org) è il polo formativo dell'IIS Avogadro per la transizione digitale e l'innovazione didattica (Piano Scuola 4.0 / PNRR Futura), dedicato alla formazione continua del personale docente e scolastico."
      ]
    },
    {
      "tag": "linguaggio_inappropriato",
      "patterns": [
        "Cazzo",
        "Merda",
        "Vaffanculo",
        "Stronzo",
        "Coglione",
        "Puttana",
        "Troia",
        "Bastardo",
        "Fanculo",
        "Sei un coglione",
        "Sei un cretino",
        "Sei stupido",
        "Fai schifo",
        "Bot di merda",
        "Testa di cazzo",
        "Vaffanbagno",
        "Porca miseria",
        "Porco",
        "Idiota",
        "Deficiente",
        "Sei inutile"
      ],
      "responses": [
        "Ti invito a mantenere un linguaggio consono, educato e rispettoso dell'ambiente scolastico. Come posso esserti utile per informazioni sull'IIS Avogadro?",
        "Per favore, utilizza un tono rispettoso. Sono a tua disposizione per aiutarti con i corsi, la segreteria e i servizi dell'Avogadro."
      ]
    },
    {
      "tag": "fallback",
      "patterns": [],
      "responses": [
        "Mi dispiace, non ho compreso appieno la tua domanda. Puoi provare a chiedermi informazioni su indirizzi di studio (Informatica, Elettronica, Meccanica, Liceo Scienze Applicate, Cambridge, Serale), orari della segreteria, contatti, sede, iscrizioni, vita scolastica o registro elettronico?",
        "Non ho trovato una risposta specifica per questo quesito. Prova a riformulare la richiesta indicando un argomento della scuola (ad es. corsi, diploma, esami integrativi, orari, ricreazione, PCTO o progetti)!"
      ]
    }
  ]
};
