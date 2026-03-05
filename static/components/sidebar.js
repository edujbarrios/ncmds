"use strict";
/**
 * Sidebar Component
 * Renders the sidebar navigation dynamically from server-injected configuration.
 */
(function () {
    'use strict';
    const cfg = window.ncmdsConfig;
    const container = document.getElementById('ncmds-sidebar');
    if (!container)
        return;
    const navItems = cfg.navigation.map((item) => `<li class="nav-item">
            <a href="/docs/${item.path}" class="nav-link">${item.title}</a>
        </li>`).join('');
    const navHtml = cfg.navigation.length > 0
        ? `<ul class="nav-list">${navItems}</ul>`
        : `<p class="nav-empty">${cfg.uiText.noDocumentsMessage}</p>`;
    const exportBtnHtml = (cfg.export.showOnAllPages && cfg.export.qmd.enabled) ? `
        <div class="sidebar-export">
            <button class="sidebar-export-btn" id="sidebar-export-btn" title="Export all documentation to QMD (Quarto Markdown)">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                    <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                </svg>
                <span>${cfg.export.qmd.buttonText}</span>
            </button>
        </div>` : '';
    container.innerHTML = `
        <aside class="sidebar" id="sidebar">
            <nav class="sidebar-nav">
                <h3 class="sidebar-title">${cfg.uiText.sidebarTitle}</h3>
                ${navHtml}
                ${exportBtnHtml}
            </nav>
        </aside>`;
    const sidebarExportBtn = container.querySelector('#sidebar-export-btn');
    if (sidebarExportBtn) {
        sidebarExportBtn.addEventListener('click', () => {
            window.location.href = '/export/qmd/all';
        });
    }
})();
