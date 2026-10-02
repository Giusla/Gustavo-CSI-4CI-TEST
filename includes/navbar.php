<?php
// includes/navbar.php — Header e navigazione centralizzata
if (!isset($active_page)) {
    $current_file = basename($_SERVER['PHP_SELF'] ?? 'index.php');
    $active_page = str_replace(['.php', '.html'], '', $current_file);
    if ($active_page === '' || $active_page === 'index') {
        $active_page = 'home';
    }
}
$link_ext = '.html';
?>
<!-- NAVBAR UFFICIALE GUSTAVO -->
<header>
    <nav class="navbar">
      <div class="nav-brand-group">
        <div class="nav-brand-logos" aria-label="Loghi IIS Avogadro e CSI Piemonte">
            <a href="https://www.itisavogadro.it/" target="_blank" rel="noopener noreferrer" class="nav-logo-link" title="Istituto Tecnico Amedeo Avogadro — Torino">
                <img src="assets/img/logo_avogadro.png" alt="Logo IIS Avogadro" class="nav-logo-avo">
            </a>
            <span class="nav-logo-divider" aria-hidden="true"></span>
            <a href="https://www.csipiemonte.it/it" target="_blank" rel="noopener noreferrer" class="nav-logo-link" title="CSI Piemonte">
                <img src="assets/img/logo_csi_piemonte.png" alt="Logo CSI Piemonte" class="nav-logo-csi">
            </a>
        </div>
        <span class="nav-brand-divider" aria-hidden="true"></span>
        <a href="index<?php echo $link_ext; ?>" class="logo-link" title="GustAvo — Home">
            <span class="logo-testo">
                <span class="logo-nome">GustAvo</span>
                <span class="logo-motto">Il chatbot che ti orienta a scuola</span>
            </span>
        </a>
      </div>
        <ul class="nav-links">
            <li><a href="index<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'home' ? 'active' : ''); ?>">Home</a></li>
            <li><a href="progetto<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'progetto' ? 'active' : ''); ?>">Progetto</a></li>
            <li><a href="team<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'team' ? 'active' : ''); ?>">Team</a></li>
            <li><a href="documentazione<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'documentazione' ? 'active' : ''); ?>">Documentazione</a></li>
            <li><a href="chatbot<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'chatbot' ? 'active' : ''); ?>">Chatbot</a></li>
            <li><a href="galleria<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'galleria' ? 'active' : ''); ?>">Galleria</a></li>
            <li><button class="nav-a11y-btn" type="button" data-a11y-trigger aria-label="Menu Accessibilità" title="Accessibilità (Alt+A)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg><span>Accessibilità</span></button></li>
        </ul>

        <button class="hamburger" id="hamburger" aria-label="Menu di navigazione" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
    </nav>

    <!-- MENU MOBILE TOUCH-FRIENDLY -->
    <nav class="nav-mobile" id="navMobile" aria-hidden="true">
        <a href="index<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'home' ? 'active' : ''); ?>">Home</a>
        <a href="progetto<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'progetto' ? 'active' : ''); ?>">Progetto</a>
        <a href="team<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'team' ? 'active' : ''); ?>">Team</a>
        <a href="documentazione<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'documentazione' ? 'active' : ''); ?>">Documentazione</a>
        <a href="chatbot<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'chatbot' ? 'active' : ''); ?>">Chatbot</a>
        <a href="galleria<?php echo $link_ext; ?>" class="<?php echo ($active_page === 'galleria' ? 'active' : ''); ?>">Galleria</a>
        <button class="nav-mobile-a11y-btn" type="button" data-a11y-trigger><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg> Accessibilità</button>
    </nav>
</header>