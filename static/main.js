"use strict";
/**
 * NCMDS Main UI Script
 * Handles sidebar, TOC, smooth scrolling, code copy buttons, and active link highlighting.
 * Server-side config values are injected via window.ncmdsConfig by the Jinja2 template.
 */
(function () {
    'use strict';
    var _a, _b, _c;
    // Syntax highlighting
    (_a = window.hljs) === null || _a === void 0 ? void 0 : _a.highlightAll();
    // UI Text from server-injected config
    const uiText = (_c = (_b = window.ncmdsConfig) === null || _b === void 0 ? void 0 : _b.uiText) !== null && _c !== void 0 ? _c : { copyButton: 'Copy', copyButtonCopied: 'Copied!' };
    // Get DOM elements
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const tocToggle = document.getElementById('tocToggle');
    const tocSidebar = document.querySelector('.toc-sidebar');
    // Mobile menu toggle
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                const target = e.target;
                if (!sidebar.contains(target) && !menuToggle.contains(target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
    // Sidebar toggle functionality (desktop)
    if (sidebarToggle && sidebar && mainContent) {
        // Check for saved sidebar state or default to 'visible'
        const sidebarVisible = localStorage.getItem('sidebarVisible') !== 'false';
        if (!sidebarVisible) {
            sidebar.classList.add('hidden');
            mainContent.classList.add('sidebar-hidden');
            sidebarToggle.classList.add('active');
        }
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
            mainContent.classList.toggle('sidebar-hidden');
            sidebarToggle.classList.toggle('active');
            const isHidden = sidebar.classList.contains('hidden');
            localStorage.setItem('sidebarVisible', String(!isHidden));
        });
    }
    // TOC toggle functionality
    if (tocToggle && tocSidebar && mainContent) {
        // Check for saved TOC state or default to 'visible'
        const tocVisible = localStorage.getItem('tocVisible') !== 'false';
        if (!tocVisible) {
            tocSidebar.classList.add('hidden');
            mainContent.classList.add('toc-hidden');
            tocToggle.classList.add('active');
        }
        tocToggle.addEventListener('click', () => {
            tocSidebar.classList.toggle('hidden');
            mainContent.classList.toggle('toc-hidden');
            tocToggle.classList.toggle('active');
            const isHidden = tocSidebar.classList.contains('hidden');
            localStorage.setItem('tocVisible', String(!isHidden));
        });
    }
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href) {
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    // Active link highlighting
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach((link) => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    // Add copy buttons to code blocks
    document.querySelectorAll('pre > code').forEach((codeBlock) => {
        var _a;
        const pre = codeBlock.parentElement;
        if (!pre)
            return;
        // Create wrapper if not already wrapped
        if (!pre.classList.contains('code-block-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            (_a = pre.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-code-button';
            copyButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>${uiText.copyButton}</span>
            `;
            // Add click handler
            copyButton.addEventListener('click', async () => {
                var _a;
                const code = (_a = codeBlock.textContent) !== null && _a !== void 0 ? _a : '';
                try {
                    await navigator.clipboard.writeText(code);
                    // Show success feedback
                    copyButton.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>${uiText.copyButtonCopied}</span>
                    `;
                    copyButton.classList.add('copied');
                    // Reset after 2 seconds
                    setTimeout(() => {
                        copyButton.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span>${uiText.copyButton}</span>
                        `;
                        copyButton.classList.remove('copied');
                    }, 2000);
                }
                catch (err) {
                    console.error('Failed to copy:', err);
                }
            });
            wrapper.appendChild(copyButton);
        }
    });
    // Set dark theme permanently
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('data-theme', 'dark');
})();
