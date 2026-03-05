/**
 * Global type declarations for NCMDS
 * Extends the Window interface with server-injected configuration.
 */

interface Window {
    ncmdsConfig: {
        uiText: {
            copyButton: string;
            copyButtonCopied: string;
        };
    };
    hljs?: {
        highlightAll: () => void;
    };
}
