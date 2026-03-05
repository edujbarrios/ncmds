/**
 * Export Buttons Component
 * Renders the export buttons dynamically from server-injected configuration.
 */

(function (): void {
    'use strict';

    const cfg = window.ncmdsConfig;
    const container = document.getElementById('ncmds-export-buttons');
    if (!container || !cfg.export.showOnAllPages) return;

    const qmdBtnHtml = cfg.export.qmd.enabled ? `
        <button class="export-btn export-btn-qmd" id="export-btn-qmd" title="Export all documentation to QMD (Quarto Markdown)">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
                <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
            </svg>
            <span>${cfg.export.qmd.buttonText}</span>
        </button>` : '';

    container.innerHTML = `<div class="export-buttons">${qmdBtnHtml}</div>`;

    const exportBtns = container.querySelectorAll<HTMLButtonElement>('.export-btn');
    exportBtns.forEach((button) => {
        button.addEventListener('click', function () {
            const originalHTML = this.innerHTML;
            this.innerHTML = '<svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" class="spin"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.4 31.4" stroke-dashoffset="0"></circle></svg><span>Exporting...</span>';
            this.disabled = true;

            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.disabled = false;
            }, 3000);
        });
    });

    const qmdBtn = container.querySelector<HTMLButtonElement>('#export-btn-qmd');
    if (qmdBtn) {
        qmdBtn.addEventListener('click', () => {
            window.location.href = '/export/qmd/all';
        });
    }
})();
