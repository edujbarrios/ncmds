/**
 * NCMDS Documentation Search
 * Handles search functionality with keyboard shortcuts
 */

(function() {
    'use strict';
    
    // Configuration
    const SEARCH_DELAY = 300; // Debounce delay in ms
    const MIN_QUERY_LENGTH = 2;
    
    // DOM Elements
    let searchInput = null;
    let searchResults = null;
    let searchResultsContent = null;
    let searchTimeout = null;
    let currentResultIndex = -1;
    let currentResults = [];
    
    /**
     * Initialize search functionality
     */
    function initSearch() {
        searchInput = document.getElementById('searchInput');
        searchResults = document.getElementById('searchResults');
        searchResultsContent = searchResults?.querySelector('.search-results-content');
        
        if (!searchInput || !searchResults) {
            console.warn('Search elements not found');
            return;
        }
        
        // Event listeners
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('focus', handleSearchFocus);
        searchInput.addEventListener('keydown', handleSearchKeydown);
        
        // Click outside to close
        document.addEventListener('click', handleClickOutside);
        
        // Keyboard shortcuts
        document.addEventListener('keydown', handleGlobalKeydown);
    }
    
    /**
     * Handle search input with debouncing
     */
    function handleSearchInput(e) {
        const query = e.target.value.trim();
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // If query is too short, hide results
        if (query.length < MIN_QUERY_LENGTH) {
            hideResults();
            return;
        }
        
        // Show loading state
        showLoading();
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, SEARCH_DELAY);
    }
    
    /**
     * Handle search input focus
     */
    function handleSearchFocus() {
        const query = searchInput.value.trim();
        if (query.length >= MIN_QUERY_LENGTH && currentResults.length > 0) {
            showResults();
        }
    }
    
    /**
     * Handle keyboard navigation in search
     */
    function handleSearchKeydown(e) {
        if (!searchResults.style.display || searchResults.style.display === 'none') {
            return;
        }
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                navigateResults('down');
                break;
            case 'ArrowUp':
                e.preventDefault();
                navigateResults('up');
                break;
            case 'Enter':
                e.preventDefault();
                selectCurrentResult();
                break;
            case 'Escape':
                e.preventDefault();
                hideResults();
                searchInput.blur();
                break;
        }
    }
    
    /**
     * Handle global keyboard shortcuts
     */
    function handleGlobalKeydown(e) {
        // Ctrl+K or Cmd+K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput?.focus();
            searchInput?.select();
        }
        
        // Escape to blur search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.blur();
            hideResults();
        }
    }
    
    /**
     * Handle clicks outside search
     */
    function handleClickOutside(e) {
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer && !searchContainer.contains(e.target)) {
            hideResults();
        }
    }
    
    /**
     * Perform search API call
     */
    async function performSearch(query) {
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=10`);
            
            if (!response.ok) {
                throw new Error('Search request failed');
            }
            
            const data = await response.json();
            currentResults = data.results || [];
            currentResultIndex = -1;
            
            displayResults(data.results, query);
        } catch (error) {
            console.error('Search error:', error);
            showError('Error al buscar. Por favor, intenta de nuevo.');
        }
    }
    
    /**
     * Display search results
     */
    function displayResults(results, query) {
        if (!searchResultsContent) return;
        
        searchResultsContent.innerHTML = '';
        
        if (results.length === 0) {
            searchResultsContent.innerHTML = `
                <div class="search-no-results">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <p>No se encontraron resultados para "<strong>${escapeHtml(query)}</strong>"</p>
                </div>
            `;
            showResults();
            return;
        }
        
        // Create result items
        results.forEach((result, index) => {
            const resultItem = createResultItem(result, query, index);
            searchResultsContent.appendChild(resultItem);
        });
        
        // Add search info footer
        const searchInfo = document.createElement('div');
        searchInfo.className = 'search-info';
        searchInfo.innerHTML = `
            <span>${results.length} resultado${results.length !== 1 ? 's' : ''}</span>
            <div class="search-info-shortcuts">
                <span><kbd>↑</kbd><kbd>↓</kbd> navegar</span>
                <span><kbd>Enter</kbd> abrir</span>
                <span><kbd>Esc</kbd> cerrar</span>
            </div>
        `;
        searchResultsContent.appendChild(searchInfo);
        
        showResults();
    }
    
    /**
     * Create a single result item element
     */
    function createResultItem(result, query, index) {
        const item = document.createElement('a');
        item.className = 'search-result-item';
        item.href = result.url;
        item.dataset.index = index;
        
        // Highlight query in title
        const highlightedTitle = highlightText(result.title, query);
        
        // Highlight query in context
        const highlightedContext = result.context 
            ? highlightText(result.context, query)
            : '';
        
        item.innerHTML = `
            <div class="search-result-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span>${highlightedTitle}</span>
            </div>
            ${highlightedContext ? `<div class="search-result-context">${highlightedContext}</div>` : ''}
        `;
        
        // Click handler
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navigateToResult(result.url);
        });
        
        // Hover handler
        item.addEventListener('mouseenter', () => {
            setActiveResult(index);
        });
        
        return item;
    }
    
    /**
     * Highlight query text in content
     */
    function highlightText(text, query) {
        if (!text || !query) return escapeHtml(text);
        
        const escapedText = escapeHtml(text);
        const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
        
        return escapedText.replace(regex, '<span class="search-highlight">$1</span>');
    }
    
    /**
     * Navigate through results with arrow keys
     */
    function navigateResults(direction) {
        const resultItems = searchResultsContent.querySelectorAll('.search-result-item');
        
        if (resultItems.length === 0) return;
        
        // Remove active class from current item
        if (currentResultIndex >= 0 && currentResultIndex < resultItems.length) {
            resultItems[currentResultIndex].classList.remove('active');
        }
        
        // Calculate new index
        if (direction === 'down') {
            currentResultIndex = Math.min(currentResultIndex + 1, resultItems.length - 1);
        } else {
            currentResultIndex = Math.max(currentResultIndex - 1, 0);
        }
        
        // Add active class to new item
        setActiveResult(currentResultIndex);
    }
    
    /**
     * Set active result by index
     */
    function setActiveResult(index) {
        const resultItems = searchResultsContent.querySelectorAll('.search-result-item');
        
        // Remove all active classes
        resultItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to specific item
        if (index >= 0 && index < resultItems.length) {
            currentResultIndex = index;
            resultItems[index].classList.add('active');
            
            // Scroll into view if needed
            resultItems[index].scrollIntoView({
                block: 'nearest',
                behavior: 'smooth'
            });
        }
    }
    
    /**
     * Select and navigate to current result
     */
    function selectCurrentResult() {
        if (currentResultIndex >= 0 && currentResultIndex < currentResults.length) {
            const result = currentResults[currentResultIndex];
            navigateToResult(result.url);
        }
    }
    
    /**
     * Navigate to result URL
     */
    function navigateToResult(url) {
        hideResults();
        searchInput.blur();
        window.location.href = url;
    }
    
    /**
     * Show loading state
     */
    function showLoading() {
        if (!searchResultsContent) return;
        
        searchResultsContent.innerHTML = `
            <div class="search-loading">
                <div class="search-loading-spinner"></div>
                <p>Buscando...</p>
            </div>
        `;
        showResults();
    }
    
    /**
     * Show error message
     */
    function showError(message) {
        if (!searchResultsContent) return;
        
        searchResultsContent.innerHTML = `
            <div class="search-no-results">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
        showResults();
    }
    
    /**
     * Show results dropdown
     */
    function showResults() {
        if (searchResults) {
            searchResults.style.display = 'block';
        }
    }
    
    /**
     * Hide results dropdown
     */
    function hideResults() {
        if (searchResults) {
            searchResults.style.display = 'none';
        }
        currentResultIndex = -1;
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Escape regex special characters
     */
    function escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();
