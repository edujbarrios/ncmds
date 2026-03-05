/**
 * Footer Component
 * Renders the site footer dynamically from server-injected configuration.
 */

(function (): void {
    'use strict';

    const cfg = window.ncmdsConfig;
    const container = document.getElementById('ncmds-footer');
    if (!container) return;

    container.innerHTML = `
        <footer class="site-footer">
            <div class="footer-content">
                <p>${cfg.uiText.footerText} <a href="https://github.com/${cfg.author}" target="_blank" rel="noopener noreferrer">${cfg.author}</a></p>
            </div>
        </footer>`;
})();
