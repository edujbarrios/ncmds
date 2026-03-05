/**
 * Global type declarations for NCMDS
 * Extends the Window interface with server-injected configuration.
 */

interface NcmdsNavItem {
    title: string;
    path: string;
}

interface NcmdsDocInfo {
    title: string;
    path: string;
}

interface Window {
    ncmdsConfig: {
        uiText: {
            copyButton: string;
            copyButtonCopied: string;
            sidebarTitle: string;
            tocTitle: string;
            footerText: string;
            navPrevious: string;
            navNext: string;
            themeToggleDark: string;
            themeToggleLight: string;
            toggleSidebar: string;
            toggleToc: string;
            noDocumentsMessage: string;
            toggleMenuAria: string;
        };
        siteName: string;
        author: string;
        logo: {
            type: string;
            imagePath: string;
            imageAlt: string;
            width: number;
            height: number;
            text: string;
        };
        theme: {
            toggleEnabled: boolean;
        };
        uiControls: {
            sidebarToggle: boolean;
            tocToggle: boolean;
        };
        navigation: NcmdsNavItem[];
        toc: string;
        prevDoc: NcmdsDocInfo | null;
        nextDoc: NcmdsDocInfo | null;
        aiChat: {
            enabled: boolean;
            model: string;
            provider: string;
            ui: {
                buttonText: string;
                windowTitle: string;
                welcomeMessage: string;
                placeholder: string;
            };
        };
        export: {
            showOnAllPages: boolean;
            qmd: {
                enabled: boolean;
                buttonText: string;
            };
        };
    };
    hljs?: {
        highlightAll: () => void;
    };
}
