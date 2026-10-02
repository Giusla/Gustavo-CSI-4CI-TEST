<!DOCTYPE html>
<html lang="it" class="chatbot-page-html">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Chatbot GustAvo — IIS Avogadro</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="assets/img/favicon.png?v=2">
    <link rel="apple-touch-icon" href="assets/img/favicon.png?v=2">

    <!-- Meta Tag Condivisione Social (WhatsApp, Telegram, Social Preview) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Chatbot GustAvo — IIS Avogadro">
    <meta property="og:description" content="Interagisci online con GustAvo, il chatbot di orientamento scolastico dell'IIS Avogadro di Torino.">
    <meta property="og:image" content="assets/img/gustavo_icon.png">
    <meta property="og:image:type" content="image/png">
    <meta property="og:image:alt" content="Logo Ufficiale GustAvo">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Chatbot GustAvo — IIS Avogadro">
    <meta name="twitter:description" content="Interagisci online con GustAvo, il chatbot di orientamento scolastico dell'IIS Avogadro di Torino.">
    <meta name="twitter:image" content="assets/img/gustavo_icon.png">

    <link rel="stylesheet" href="assets/css/style.css?v=4.6">
    <script src="assets/js/main.js?v=4.6" defer></script>
    <style>
        /* Regole di sicurezza viewport mobile e overlay menu hamburger */
        html.chatbot-page-html,
        body.chatbot-page {
            height: 100%;
            height: -webkit-fill-available;
            height: 100dvh;
            min-height: 0 !important;
            max-height: 100dvh;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        .nav-mobile {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            width: 100% !important;
            z-index: 1001 !important;
            box-shadow: 0 14px 28px rgba(0, 30, 80, 0.25) !important;
        }
        .chatbot-direct-bar {
            display: flex !important;
            visibility: visible !important;
            opacity: 1 !important;
            flex-shrink: 0 !important;
        }
        .chatbot-direct-bar .chatbot-bar-note {
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    </style>
</head>
<body class="chatbot-page">

    <a href="#main" class="skip-link">Salta al contenuto principale</a>

    <!-- NAVBAR UFFICIALE GUSTAVO -->
    <?php
    $active_page = 'chatbot';
    include 'includes/navbar.php';
    ?>

    <!-- MAIN CHATBOT WORKSPACE -->
    <main class="chatbot-main" id="main">
        <h1 class="sr-only">Chatbot GustAvo — Assistente virtuale scolastico</h1>
        <div class="chatbot-iframe-box">
            <iframe
                src="https://gustavo1.avoprogetti.it"
                class="chatbot-iframe"
                title="Chatbot GustAvo — Server Ufficiale gustavo1.avoprogetti.it"
                allow="microphone"
                loading="lazy">
            </iframe>
        </div>

        <!-- BARRA INFORMATIVA SERVER (ANCORATA ALLA BASE DELLA SEZIONE CHATBOT) -->
        <div class="chatbot-direct-bar">
            <span class="chatbot-bar-note">Chatbot ospitato sul server della scuola</span>
            <a href="https://gustavo1.avoprogetti.it" target="_blank" rel="noopener">Apri direttamente gustavo1.avoprogetti.it ↗</a>
        </div>
    </main>

</body>
</html>
