"use strict";
/**
 * Document Navigation Component
 * Renders prev/next document navigation dynamically from server-injected configuration.
 */
(function () {
    'use strict';
    const cfg = window.ncmdsConfig;
    const container = document.getElementById('ncmds-doc-navigation');
    if (!container || (!cfg.prevDoc && !cfg.nextDoc))
        return;
    const prevHtml = cfg.prevDoc
        ? `<a href="/docs/${cfg.prevDoc.path}" class="nav-button nav-button-prev">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <div class="nav-button-content">
                <span class="nav-button-label">${cfg.uiText.navPrevious}</span>
                <span class="nav-button-title">${cfg.prevDoc.title}</span>
            </div>
        </a>`
        : `<div class="nav-button-spacer"></div>`;
    const nextHtml = cfg.nextDoc
        ? `<a href="/docs/${cfg.nextDoc.path}" class="nav-button nav-button-next">
            <div class="nav-button-content">
                <span class="nav-button-label">${cfg.uiText.navNext}</span>
                <span class="nav-button-title">${cfg.nextDoc.title}</span>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        </a>`
        : `<div class="nav-button-spacer"></div>`;
    container.innerHTML = `
        <nav class="doc-navigation">
            <div class="nav-buttons">
                ${prevHtml}
                ${nextHtml}
            </div>
        </nav>`;
})();
