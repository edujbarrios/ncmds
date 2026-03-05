/**
 * AI Chat Widget
 * Creates the widget HTML structure and handles the "Explain with AI" functionality.
 */

(function (): void {
    'use strict';

    const aiCfg = window.ncmdsConfig?.aiChat;

    // Render the widget HTML into the placeholder container
    const aiContainer = document.getElementById('ncmds-ai-chat');
    if (aiContainer && aiCfg?.enabled) {
        aiContainer.innerHTML = `
        <div id="ai-chat-widget" class="ai-chat-widget">
            <button id="ai-chat-toggle" class="ai-chat-toggle" aria-label="${aiCfg.ui.buttonText}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <path d="M8 10h.01M12 10h.01M16 10h.01"></path>
                </svg>
                <span>${aiCfg.ui.buttonText}</span>
            </button>
            <div id="ai-chat-window" class="ai-chat-window" style="display: none;">
                <div class="ai-chat-header">
                    <div class="ai-chat-header-content">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <h3>${aiCfg.ui.windowTitle}</h3>
                    </div>
                    <div class="ai-chat-header-actions">
                        <button id="ai-chat-fullscreen" class="ai-chat-action-btn" aria-label="Toggle fullscreen">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="fullscreen-icon">
                                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
                            </svg>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="minimize-icon" style="display: none;">
                                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
                            </svg>
                        </button>
                        <button id="ai-chat-close" class="ai-chat-action-btn" aria-label="Close chat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="ai-chat-model-selector">
                    <label for="ai-chat-model-select">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                        </svg>
                        Model:
                    </label>
                    <select id="ai-chat-model-select" class="ai-chat-model-select">
                        <option value="${aiCfg.model}">${aiCfg.model}</option>
                    </select>
                </div>
                <div id="ai-chat-messages" class="ai-chat-messages">
                    <div class="ai-chat-message ai-message">
                        <div class="ai-chat-message-avatar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                            </svg>
                        </div>
                        <div class="ai-chat-message-content">
                            <p>${aiCfg.ui.welcomeMessage}</p>
                        </div>
                    </div>
                </div>
                <div class="ai-chat-input-container">
                    <div class="ai-chat-input-wrapper">
                        <input
                            type="text"
                            id="ai-chat-input"
                            class="ai-chat-input"
                            placeholder="${aiCfg.ui.placeholder}"
                            autocomplete="off"
                        >
                        <button id="ai-chat-send" class="ai-chat-send" aria-label="Send message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                    <div class="ai-chat-notice">
                        AI responses may contain errors. Verify important information.
                    </div>
                    <div class="ai-chat-provider-info">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="2" y1="12" x2="22" y2="12"></line>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                        <span>Powered by <strong>${aiCfg.provider}</strong></span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    // Configuration (will be loaded from backend)
    const config = {
        apiEndpoint: '/api/ai-chat',
        statusEndpoint: '/api/ai-chat/status',
        modelsEndpoint: '/api/ai-chat/models'
    };

    // State
    let isOpen = false;
    let isProcessing = false;
    let isFullscreen = false;
    let modelsLoaded = false;

    // DOM elements
    const widget = document.getElementById('ai-chat-widget');
    const toggleButton = document.getElementById('ai-chat-toggle') as HTMLButtonElement | null;
    const closeButton = document.getElementById('ai-chat-close') as HTMLButtonElement | null;
    const fullscreenButton = document.getElementById('ai-chat-fullscreen') as HTMLButtonElement | null;
    const chatWindow = document.getElementById('ai-chat-window') as HTMLDivElement | null;
    const messagesContainer = document.getElementById('ai-chat-messages') as HTMLDivElement | null;
    const inputField = document.getElementById('ai-chat-input') as HTMLInputElement | null;
    const sendButton = document.getElementById('ai-chat-send') as HTMLButtonElement | null;
    const modelSelect = document.getElementById('ai-chat-model-select') as HTMLSelectElement | null;

    // Check if widget exists (AI chat is enabled)
    if (!widget) {
        return;
    }

    /**
     * Initialize the AI chat widget
     */
    function init(): void {
        if (!widget) return;

        // Check AI chat status
        checkStatus();

        // Event listeners
        toggleButton?.addEventListener('click', toggleChat);
        closeButton?.addEventListener('click', closeChat);
        fullscreenButton?.addEventListener('click', toggleFullscreen);
        sendButton?.addEventListener('click', sendMessage);
        inputField?.addEventListener('keypress', handleKeyPress);

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);

        // Load position from config
        const position = widget.getAttribute('data-position') || 'bottom-right';
        widget.classList.add(`position-${position}`);
    }

    /**
     * Check if AI chat is properly configured
     */
    async function checkStatus(): Promise<void> {
        try {
            const response = await fetch(config.statusEndpoint);
            const data = await response.json() as { enabled: boolean; configured: boolean };

            if (!data.enabled || !data.configured) {
                // Disable the widget if not configured
                if (toggleButton) {
                    toggleButton.disabled = true;
                    toggleButton.title = 'AI chat is not configured';
                }
                console.warn('AI chat is not properly configured');
            }
        } catch (error) {
            console.error('Failed to check AI chat status:', error);
        }
    }

    /**
     * Toggle chat window open/closed
     */
    function toggleChat(): void {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    }

    /**
     * Open chat window
     */
    function openChat(): void {
        if (!chatWindow || !toggleButton || !inputField || !messagesContainer) return;

        chatWindow.style.display = 'flex';
        toggleButton.classList.add('hidden');
        isOpen = true;
        inputField.focus();

        // Add welcome message if messages container is empty
        if (messagesContainer.children.length === 0) {
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'ai-chat-message ai-message';
            welcomeMsg.innerHTML = `
                <div class="ai-chat-message-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <div class="ai-chat-message-content">
                    <p>Hi! I can help you understand this page. Ask me anything about the content.</p>
                </div>
            `;
            messagesContainer.appendChild(welcomeMsg);
        }

        // Load models if not already loaded
        if (!modelsLoaded) {
            loadAvailableModels();
        }
    }

    /**
     * Load available models from API
     */
    async function loadAvailableModels(): Promise<void> {
        if (!modelSelect) return;
        try {
            const response = await fetch(config.modelsEndpoint);
            const data = await response.json() as {
                success: boolean;
                models?: Array<{ id: string; name: string }>;
            };

            if (data.success && data.models && data.models.length > 0) {
                // Clear existing options
                modelSelect.innerHTML = '';

                // Get default model from status
                const statusResponse = await fetch(config.statusEndpoint);
                const statusData = await statusResponse.json() as { default_model?: string };
                const defaultModel = statusData.default_model || data.models[0].id;

                // Populate dropdown
                data.models.forEach((model) => {
                    const option = document.createElement('option');
                    option.value = model.id;
                    option.textContent = model.name;

                    if (model.id === defaultModel) {
                        option.selected = true;
                    }

                    modelSelect.appendChild(option);
                });

                modelsLoaded = true;
            }
        } catch (error) {
            console.error('Failed to load models:', error);
            // Keep the default model from config
        }
    }

    /**
     * Close chat window
     */
    function closeChat(): void {
        if (!chatWindow || !toggleButton) return;

        chatWindow.style.display = 'none';
        toggleButton.classList.remove('hidden');
        isOpen = false;

        // Exit fullscreen if active
        if (isFullscreen) {
            toggleFullscreen();
        }
    }

    /**
     * Toggle fullscreen mode
     */
    function toggleFullscreen(): void {
        if (!chatWindow || !fullscreenButton) return;

        isFullscreen = !isFullscreen;

        if (isFullscreen) {
            chatWindow.classList.add('fullscreen');
            // Swap icons
            const fullscreenIcon = fullscreenButton.querySelector('.fullscreen-icon') as HTMLElement | null;
            const minimizeIcon = fullscreenButton.querySelector('.minimize-icon') as HTMLElement | null;
            if (fullscreenIcon) fullscreenIcon.style.display = 'none';
            if (minimizeIcon) minimizeIcon.style.display = 'block';
            fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
        } else {
            chatWindow.classList.remove('fullscreen');
            // Swap icons back
            const fullscreenIcon = fullscreenButton.querySelector('.fullscreen-icon') as HTMLElement | null;
            const minimizeIcon = fullscreenButton.querySelector('.minimize-icon') as HTMLElement | null;
            if (fullscreenIcon) fullscreenIcon.style.display = 'block';
            if (minimizeIcon) minimizeIcon.style.display = 'none';
            fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen');
        }

        // Scroll to bottom after resize
        setTimeout(() => scrollToBottom(), 100);
    }

    /**
     * Handle Enter key press in input field
     */
    function handleKeyPress(event: Event): void {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === 'Enter' && !keyEvent.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    function handleKeyboardShortcuts(event: KeyboardEvent): void {
        // Only process if chat is open
        if (!isOpen) return;

        // Escape key: Exit fullscreen or close chat
        if (event.key === 'Escape') {
            if (isFullscreen) {
                event.preventDefault();
                toggleFullscreen();
            } else if (isOpen) {
                event.preventDefault();
                closeChat();
            }
        }

        // F11 or Ctrl/Cmd + Shift + F: Toggle fullscreen
        if (event.key === 'F11' ||
            ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'f')) {
            event.preventDefault();
            toggleFullscreen();
        }
    }

    /**
     * Send a message to the AI
     */
    async function sendMessage(): Promise<void> {
        if (!inputField || !sendButton || !modelSelect) return;

        const question = inputField.value.trim();

        if (!question || isProcessing) {
            return;
        }

        // Get page content
        const pageContent = getPageContent();

        // Add user message to chat
        addMessage(question, 'user');

        // Clear input
        inputField.value = '';

        // Show loading state
        isProcessing = true;
        sendButton.disabled = true;
        const loadingMessage = addLoadingMessage();

        try {
            // Get selected model
            const selectedModel = modelSelect.value;

            // Send request to backend
            const response = await fetch(config.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question: question,
                    page_content: pageContent,
                    model: selectedModel
                })
            });

            const data = await response.json() as { success: boolean; answer?: string; error?: string };

            // Remove loading message
            removeMessage(loadingMessage);

            if (data.success && data.answer) {
                // Add AI response
                addMessage(data.answer, 'ai');
            } else {
                // Show error
                addErrorMessage(data.error || 'Failed to get response from AI');
            }
        } catch (error) {
            // Remove loading message
            removeMessage(loadingMessage);

            // Show error
            addErrorMessage('Network error. Please try again.');
            console.error('AI chat error:', error);
        } finally {
            isProcessing = false;
            sendButton.disabled = false;
            inputField.focus();
        }
    }

    /**
     * Get the current page content for context
     */
    function getPageContent(): string {
        // Get content from the main article
        const article = document.querySelector('.markdown-body');
        if (article) {
            return article.textContent?.trim() ?? '';
        }

        return '';
    }

    /**
     * Add a message to the chat
     */
    function addMessage(text: string, type: 'user' | 'ai'): HTMLDivElement {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-chat-message ${type}-message`;

        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'ai-chat-message-avatar';

        if (type === 'ai') {
            avatarDiv.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            `;
        } else {
            avatarDiv.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            `;
        }

        const contentDiv = document.createElement('div');
        contentDiv.className = 'ai-chat-message-content';

        // Format the text (simple markdown-like formatting)
        const formattedText = formatText(text);
        contentDiv.innerHTML = `<p>${formattedText}</p>`;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        messagesContainer?.appendChild(messageDiv);

        // Scroll to bottom
        scrollToBottom();

        return messageDiv;
    }

    /**
     * Add a loading message
     */
    function addLoadingMessage(): HTMLDivElement {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-chat-message ai-message loading';

        messageDiv.innerHTML = `
            <div class="ai-chat-message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
            <div class="ai-chat-message-content">
                <div class="ai-chat-loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer?.appendChild(messageDiv);
        scrollToBottom();

        return messageDiv;
    }

    /**
     * Add an error message
     */
    function addErrorMessage(text: string): HTMLDivElement {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-chat-message error ai-message';

        messageDiv.innerHTML = `
            <div class="ai-chat-message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <div class="ai-chat-message-content">
                <p>${escapeHtml(text)}</p>
            </div>
        `;

        messagesContainer?.appendChild(messageDiv);
        scrollToBottom();

        return messageDiv;
    }

    /**
     * Remove a message from the chat
     */
    function removeMessage(messageElement: HTMLElement | null): void {
        if (messageElement && messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }

    /**
     * Scroll chat to bottom
     */
    function scrollToBottom(): void {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    /**
     * Format text with basic markdown-like syntax
     */
    function formatText(text: string): string {
        // Escape HTML first
        text = escapeHtml(text);

        // Bold: **text** or __text__
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // Italic: *text* or _text_
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.+?)_/g, '<em>$1</em>');

        // Inline code: `code`
        text = text.replace(/`(.+?)`/g, '<code>$1</code>');

        // Line breaks
        text = text.replace(/\n/g, '<br>');

        return text;
    }

    /**
     * Escape HTML special characters
     */
    function escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
