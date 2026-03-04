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
    const toggleButton = document.getElementById('ai-chat-toggle');
    const closeButton = document.getElementById('ai-chat-close');
    const fullscreenButton = document.getElementById('ai-chat-fullscreen');
    const chatWindow = document.getElementById('ai-chat-window');
    const messagesContainer = document.getElementById('ai-chat-messages');
    const inputField = document.getElementById('ai-chat-input');
    const sendButton = document.getElementById('ai-chat-send');
    const modelSelect = document.getElementById('ai-chat-model-select');
    const pageContentContainer = document.getElementById('page-content-for-ai');
    
    // Check if widget exists (AI chat is enabled)
    if (!widget) {
        return;
    }
    
    /**
     * Initialize the AI chat widget
     */
    function init() {
        // Check AI chat status
        checkStatus();
        
        // Event listeners
        toggleButton.addEventListener('click', toggleChat);
        closeButton.addEventListener('click', closeChat);
        fullscreenButton.addEventListener('click', toggleFullscreen);
        sendButton.addEventListener('click', sendMessage);
        inputField.addEventListener('keypress', handleKeyPress);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts);
        
        // Load position from config
        const position = widget.getAttribute('data-position') || 'bottom-right';
        widget.classList.add(`position-${position}`);
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
                toggleButton.disabled = true;
                toggleButton.title = 'AI chat is not configured';
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
    async function loadAvailableModels() {
        try {
            const response = await fetch(config.modelsEndpoint);
            const data = await response.json();
            
            if (data.success && data.models && data.models.length > 0) {
                // Clear existing options
                modelSelect.innerHTML = '';
                
                // Get default model from status
                const statusResponse = await fetch(config.statusEndpoint);
                const statusData = await statusResponse.json();
                const defaultModel = statusData.default_model || data.models[0].id;
                
                // Populate dropdown
                data.models.forEach(model => {
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
    function closeChat() {
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
    function toggleFullscreen() {
        isFullscreen = !isFullscreen;
        
        if (isFullscreen) {
            chatWindow.classList.add('fullscreen');
            // Swap icons
            fullscreenButton.querySelector('.fullscreen-icon').style.display = 'none';
            fullscreenButton.querySelector('.minimize-icon').style.display = 'block';
            fullscreenButton.setAttribute('aria-label', 'Exit fullscreen');
        } else {
            chatWindow.classList.remove('fullscreen');
            // Swap icons back
            fullscreenButton.querySelector('.fullscreen-icon').style.display = 'block';
            fullscreenButton.querySelector('.minimize-icon').style.display = 'none';
            fullscreenButton.setAttribute('aria-label', 'Toggle fullscreen');
        }
        
        // Scroll to bottom after resize
        setTimeout(() => scrollToBottom(), 100);
    }
    
    /**
     * Handle Enter key press in input field
     */
    function handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }
    
    /**
     * Handle keyboard shortcuts
     */
    function handleKeyboardShortcuts(event) {
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
    function getPageContent() {
        if (pageContentContainer) {
            return pageContentContainer.textContent.trim();
        }
        
        // Fallback: get content from the main article
        const article = document.querySelector('.markdown-body');
        if (article) {
            return article.textContent.trim();
        }
        
        return '';
    }
    
    /**
     * Add a message to the chat
     */
    function addMessage(text, type) {
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
        messagesContainer.appendChild(messageDiv);
        
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
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
        
        return messageDiv;
    }
    
    /**
     * Add an error message
     */
    function addErrorMessage(text) {
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
        
        messagesContainer.appendChild(messageDiv);
        scrollToBottom();
        
        return messageDiv;
    }
    
    /**
     * Remove a message from the chat
     */
    function removeMessage(messageElement) {
        if (messageElement && messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }
    
    /**
     * Scroll chat to bottom
     */
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    /**
     * Format text with basic markdown-like syntax
     */
    function formatText(text) {
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
    function escapeHtml(text) {
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
