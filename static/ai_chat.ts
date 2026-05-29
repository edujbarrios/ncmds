/**
 * AI Chat Widget JavaScript
 * Handles the "Explain with AI" functionality
 */

(function() {
    'use strict';
    
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
    const chatWindow = document.getElementById('ai-chat-window');
    const messagesContainer = document.getElementById('ai-chat-messages');
    const inputField = document.getElementById('ai-chat-input') as HTMLInputElement | HTMLTextAreaElement | null;
    const sendButton = document.getElementById('ai-chat-send') as HTMLButtonElement | null;
    const modelSelect = document.getElementById('ai-chat-model-select') as HTMLSelectElement | null;

    // Check if widget exists (AI chat is enabled)
    if (!widget || !toggleButton || !closeButton || !fullscreenButton || !chatWindow || !messagesContainer || !inputField || !sendButton || !modelSelect) {
        return;
    }

    // Non-null aliases used by closures (TypeScript doesn't narrow captured vars in nested functions)
    const _widget = widget;
    const _toggleButton = toggleButton;
    const _closeButton = closeButton;
    const _fullscreenButton = fullscreenButton;
    const _chatWindow = chatWindow;
    const _messagesContainer = messagesContainer;
    const _inputField = inputField;
    const _sendButton = sendButton;
    const _modelSelect = modelSelect;
    
    /**
     * Initialize the AI chat widget
     */
    function init() {
        // Check AI chat status
        checkStatus();
        
        // Event listeners
        _toggleButton.addEventListener('click', toggleChat);
        _closeButton.addEventListener('click', closeChat);
        _fullscreenButton.addEventListener('click', toggleFullscreen);
        _sendButton.addEventListener('click', sendMessage);
        _inputField.addEventListener('keypress', handleKeyPress);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Load position from config
        const position = _widget.getAttribute('data-position') || 'bottom-right';
        _widget.classList.add(`position-${position}`);
    }
    
    /**
     * Check if AI chat is properly configured
     */
    async function checkStatus() {
        try {
            const response = await fetch(config.statusEndpoint);
            const data = await response.json();
            
            if (!data.enabled || !data.configured) {
                // Disable the widget if not configured
                _toggleButton.disabled = true;
                _toggleButton.title = 'AI chat is not configured';
                console.warn('AI chat is not properly configured');
            }
        } catch (error) {
            console.error('Failed to check AI chat status:', error);
        }
    }
    
    /**
     * Toggle chat window open/closed
     */
    function toggleChat() {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
    }
    
    /**
     * Open chat window
     */
    function openChat() {
        _chatWindow.style.display = 'flex';
        _toggleButton.classList.add('hidden');
        isOpen = true;
        _inputField.focus();
        
        // Add welcome message if messages container is empty
        if (_messagesContainer.children.length === 0) {
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
            _messagesContainer.appendChild(welcomeMsg);
        }
        
        // Load models if not already loaded
        if (!modelsLoaded) {
            loadAvailableModels();
        }
    }
    
    /**
     * Load available models from API
     */
    async function loadAvailableModels() {
        try {
            const response = await fetch(config.modelsEndpoint);
            const data = await response.json();
            
            if (data.success && data.models && data.models.length > 0) {
                // Clear existing options
                _modelSelect.innerHTML = '';
                
                // Get default model from status
                const statusResponse = await fetch(config.statusEndpoint);
                const statusData = await statusResponse.json();
                const defaultModel = statusData.default_model || data.models[0].id;
                
                // Populate dropdown
                data.models.forEach((model: { id: string; name: string }) => {
                    const option = document.createElement('option');
                    option.value = model.id;
                    option.textContent = model.name;
                    
                    if (model.id === defaultModel) {
                        option.selected = true;
                    }
                    
                    _modelSelect.appendChild(option);
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
    function closeChat() {
        _chatWindow.style.display = 'none';
        _toggleButton.classList.remove('hidden');
        isOpen = false;
        
        // Exit fullscreen if active
        if (isFullscreen) {
            toggleFullscreen();
        }
    }
    
    /**
     * Toggle fullscreen mode
     */
    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        
        if (isFullscreen) {
            _chatWindow.classList.add('fullscreen');
            // Swap icons
            const fullscreenIcon = _fullscreenButton.querySelector<HTMLElement>('.fullscreen-icon');
            const minimizeIcon = _fullscreenButton.querySelector<HTMLElement>('.minimize-icon');
            if (fullscreenIcon) {
                fullscreenIcon.style.display = 'none';
            }
            if (minimizeIcon) {
                minimizeIcon.style.display = 'block';
            }
            _fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
        } else {
            _chatWindow.classList.remove('fullscreen');
            // Swap icons back
            const fullscreenIcon = _fullscreenButton.querySelector<HTMLElement>('.fullscreen-icon');
            const minimizeIcon = _fullscreenButton.querySelector<HTMLElement>('.minimize-icon');
            if (fullscreenIcon) {
                fullscreenIcon.style.display = 'block';
            }
            if (minimizeIcon) {
                minimizeIcon.style.display = 'none';
            }
            _fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen');
        }
        
        // Scroll to bottom after resize
        setTimeout(() => scrollToBottom(), 100);
    }
    
    /**
     * Handle Enter key press in input field
     */
    function handleKeyPress(event: Event) {
        const keyEvent = event as KeyboardEvent;
        if (keyEvent.key === 'Enter' && !keyEvent.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }
    
    /**
     * Handle keyboard shortcuts
     */
    function handleKeyboardShortcuts(event: KeyboardEvent) {
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
    async function sendMessage() {
        const question = _inputField.value.trim();
        
        if (!question || isProcessing) {
            return;
        }
        
        // Get page content
        const pageContent = getPageContent();
        
        // Add user message to chat
        addMessage(question, 'user');
        
        // Clear input
        _inputField.value = '';
        
        // Show loading state
        isProcessing = true;
        _sendButton.disabled = true;
        const loadingMessage = addLoadingMessage();
        
        try {
            // Get selected model
            const selectedModel = _modelSelect.value;
            
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
            
            // Check for HTTP errors first
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Remove loading message
            removeMessage(loadingMessage);
            
            if (data.success) {
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
            const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.';
            addErrorMessage(errorMessage);
            console.error('AI chat error:', error);
        } finally {
            isProcessing = false;
            _sendButton.disabled = false;
            _inputField.focus();
        }
    }
    
    /**
     * Get the current page content for context
     */
    function getPageContent() {
        // Get content from the main article
        const article = document.querySelector('.markdown-body');
        if (article) {
            return article.textContent.trim();
        }
        
        return '';
    }
    
    /**
     * Add a message to the chat
     */
    function addMessage(text: string, type: 'user' | 'ai') {
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
        _messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        scrollToBottom();
        
        return messageDiv;
    }
    
    /**
     * Add a loading message
     */
    function addLoadingMessage() {
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
        
        _messagesContainer.appendChild(messageDiv);
        scrollToBottom();
        
        return messageDiv;
    }
    
    /**
     * Add an error message
     */
    function addErrorMessage(text: string) {
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
        
        _messagesContainer.appendChild(messageDiv);
        scrollToBottom();
        
        return messageDiv;
    }
    
    /**
     * Remove a message from the chat
     */
    function removeMessage(messageElement: HTMLElement) {
        if (messageElement && messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }
    
    /**
     * Scroll chat to bottom
     */
    function scrollToBottom() {
        _messagesContainer.scrollTop = _messagesContainer.scrollHeight;
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
