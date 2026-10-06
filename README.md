# Gustavo-CSI-4CI
Progetto della ex 4Ci in collaborazione con CSI Piemonte: GustAvo

Il dominio pubblico del sito è `https://gustavo.avoprogetti.it/`.

I metadati SEO sono presenti direttamente nelle sei pagine HTML. `robots.txt` permette la scansione e indica `sitemap.xml`, che elenca le pagine pubbliche. Per aggiornare titoli, descrizioni o dominio, modificare i metadati nelle pagine HTML e mantenere coerenti `robots.txt` e `sitemap.xml`.

Dopo la pubblicazione, verificare che il server restituisca le pagine, `robots.txt` e `sitemap.xml` con stato HTTP 200 e inviare la sitemap in Google Search Console.

## Struttura del sito

Le sei pagine HTML restano nella root per conservare gli indirizzi pubblici.

- assets/css: stile comune, pagina chatbot e tema del chatbot.
- assets/js: controlli del sito, dati della galleria e runtime del chatbot.
- assets/img/brand e assets/img/icons: loghi e icone.
- assets/img/home, team, progetto e galleria: immagini WebP organizzate per pagina o incontro; le varianti -small servono agli schermi piccoli.
- assets/img/video e assets/video: anteprima e filmato originale.
- intents.json: sorgente delle risposte; assets/js/intents-data.js ne contiene la copia caricata dal browser.

Le raccolte fotografiche sono definite in assets/js/gallery-data.js. Quando si aggiunge una foto, mostrare nel carosello in galleria.html solo le prime tre foto, seguite dalla scheda per aprire la raccolta completa, e aggiornare il conteggio della raccolta. Conservare il TXT dei percorsi fornito come riferimento dei contenuti.
