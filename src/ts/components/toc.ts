/**
 * Table of Contents Component
 * Renders the TOC sidebar dynamically from server-injected configuration.
 */

(function (): void {
    'use strict';

    const cfg = window.ncmdsConfig;
    const container = document.getElementById('ncmds-toc');
    if (!container || !cfg.toc) return;

    container.innerHTML = `
        <aside class="toc-sidebar">
            <div class="toc-container">
                <h3 class="toc-title">${cfg.uiText.tocTitle}</h3>
                <div class="toc-content">
                    ${cfg.toc}
                </div>
            </div>
        </aside>`;
})();
