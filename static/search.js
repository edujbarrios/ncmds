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
    let searchContainer = null;
    let mobileSearchTrigger = null;
    let mobileSearchClose = null;
    let searchBackdrop = null;
    
    /**
     * Initialize search functionality
     */
    function initSearch() {
        searchInput = document.getElementById('searchInput');
        searchResults = document.getElementById('searchResults');
        searchResultsContent = searchResults?.querySelector('.search-results-content');
        searchContainer = document.querySelector('.search-container');
        mobileSearchTrigger = document.getElementById('searchMobileTrigger');
        mobileSearchClose = document.getElementById('searchMobileClose');
        searchBackdrop = document.getElementById('searchBackdrop');
        
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

        // Mobile search controls
        mobileSearchTrigger?.addEventListener('click', openMobileSearch);
        mobileSearchClose?.addEventListener('click', closeMobileSearch);
        searchBackdrop?.addEventListener('click', closeMobileSearch);

        // Keep mobile overlay state in sync when resizing
        window.addEventListener('resize', syncMobileSearchState);
    }

    /**
     * Parse search text and extract inline filters like:
     * tag:api difficulty:beginner owner:docs-team
     */
    function parseSearchInput(rawInput) {
        const filters = {
            tag: '',
            difficulty: '',
            owner: '',
            writer: ''
        };
        const terms = [];

        rawInput.split(/\s+/).filter(Boolean).forEach((token) => {
            const separatorIndex = token.indexOf(':');

            if (separatorIndex > 0) {
                const key = token.slice(0, separatorIndex).toLowerCase();
                const value = token.slice(separatorIndex + 1).trim();

                if (Object.prototype.hasOwnProperty.call(filters, key) && value) {
                    filters[key] = value;
                    return;
                }
            }

            terms.push(token);
        });

        return {
            query: terms.join(' ').trim(),
            filters
        };
    }

    /**
     * Check if at least one filter is active.
     */
    function hasActiveFilters(filters) {
        return Boolean(filters.tag || filters.difficulty || filters.owner || filters.writer);
    }

    /**
     * Format active filters for the result footer.
     */
    function formatActiveFilters(filters) {
        const chips = [];

        if (filters.tag) {
            chips.push(`<span class="search-filter-chip">tag:${escapeHtml(filters.tag)}</span>`);
        }
        if (filters.difficulty) {
            chips.push(`<span class="search-filter-chip">difficulty:${escapeHtml(filters.difficulty)}</span>`);
        }
        if (filters.owner) {
            chips.push(`<span class="search-filter-chip">owner:${escapeHtml(filters.owner)}</span>`);
        }
        if (filters.writer) {
            chips.push(`<span class="search-filter-chip">writer:${escapeHtml(filters.writer)}</span>`);
        }

        return chips.join('');
    }
    
    /**
     * Handle search input with debouncing
     */
    function handleSearchInput(e) {
        const rawInput = e.target.value.trim();
        const parsed = parseSearchInput(rawInput);
        
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        
        // If query is too short and no filters are active, hide results
        if (parsed.query.length < MIN_QUERY_LENGTH && !hasActiveFilters(parsed.filters)) {
            hideResults();
            return;
        }
        
        // Show loading state
        showLoading();
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            performSearch(rawInput);
        }, SEARCH_DELAY);
    }
    
    /**
     * Handle search input focus
     */
    function handleSearchFocus() {
        const parsed = parseSearchInput(searchInput.value.trim());
        if ((parsed.query.length >= MIN_QUERY_LENGTH || hasActiveFilters(parsed.filters)) && currentResults.length > 0) {
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
            if (isMobileView()) {
                openMobileSearch();
            }
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
        if (mobileSearchTrigger && mobileSearchTrigger.contains(e.target)) {
            return;
        }

        if (searchContainer && !searchContainer.contains(e.target)) {
            hideResults();

            if (isMobileView()) {
                closeMobileSearch();
            }
        }
    }
    
    /**
     * Perform search API call
     */
    async function performSearch(rawInput) {
        const parsed = parseSearchInput(rawInput);
        const params = new URLSearchParams({
            q: parsed.query,
            limit: '10'
        });

        if (parsed.filters.tag) {
            params.set('tag', parsed.filters.tag);
        }
        if (parsed.filters.difficulty) {
            params.set('difficulty', parsed.filters.difficulty);
        }
        if (parsed.filters.owner) {
            params.set('owner', parsed.filters.owner);
        }
        if (parsed.filters.writer) {
            params.set('writer', parsed.filters.writer);
        }

        try {
            const response = await fetch(`/api/search?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error('Search request failed');
            }
            
            const data = await response.json();
            currentResults = data.results || [];
            currentResultIndex = -1;
            
            displayResults(data.results, parsed.query, data.filters || parsed.filters);
        } catch (error) {
            console.error('Search error:', error);
            showError('Search failed. Please try again.');
        }
    }
    
    /**
     * Display search results
     */
    function displayResults(results, query, filters) {
        if (!searchResultsContent) return;
        
        searchResultsContent.innerHTML = '';
        
        if (results.length === 0) {
            const filtersApplied = filters && hasActiveFilters(filters);
            const emptyMessage = query
                ? `No results found for "<strong>${escapeHtml(query)}</strong>"`
                : filtersApplied
                    ? 'No results found for the applied filters.'
                    : 'No results found.';

            searchResultsContent.innerHTML = `
                <div class="search-no-results">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="m21 21-4.35-4.35"/>
                    </svg>
                    <p>${emptyMessage}</p>
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
        const hasFilters = filters && hasActiveFilters(filters);
        const filterInfo = hasFilters
            ? `<div class="search-filters-active">${formatActiveFilters(filters)}</div>`
            : '';

        searchInfo.innerHTML = `
            <span>${results.length} result${results.length !== 1 ? 's' : ''}</span>
            ${filterInfo}
            <div class="search-info-shortcuts">
                <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                <span><kbd>Enter</kbd> open</span>
                <span><kbd>Esc</kbd> close</span>
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
        item.dataset.titleMatch = result.title_match ? 'true' : 'false';
        
        // Highlight query in title
        const highlightedTitle = highlightText(result.title, query);
        
        // Highlight query in context
        const highlightedContext = result.context 
            ? highlightText(result.context, query)
            : '';

        const tags = Array.isArray(result.tags) ? result.tags : [];
        const metadataChips = [];

        if (result.title_match) {
            metadataChips.push('<span class="search-result-chip search-result-chip-match">Title</span>');
        }
        if (result.difficulty) {
            metadataChips.push(`<span class="search-result-chip search-result-chip-difficulty">${escapeHtml(result.difficulty)}</span>`);
        }
        if (result.owner) {
            metadataChips.push(`<span class="search-result-chip search-result-chip-owner">${escapeHtml(result.owner)}</span>`);
        }
        if (result.writer) {
            metadataChips.push(`<span class="search-result-chip search-result-chip-writer">${escapeHtml(result.writer)}</span>`);
        }
        tags.slice(0, 2).forEach((tag) => {
            metadataChips.push(`<span class="search-result-chip search-result-chip-tag">#${escapeHtml(tag)}</span>`);
        });
        
        item.innerHTML = `
            <div class="search-result-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span>${highlightedTitle}</span>
            </div>
            ${highlightedContext ? `<div class="search-result-context">${highlightedContext}</div>` : ''}
            <div class="search-result-meta">
                <span class="search-result-path">${escapeHtml(result.path || '')}</span>
                <div class="search-result-chips">${metadataChips.join('')}</div>
            </div>
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
        closeMobileSearch();
        searchInput.blur();
        window.location.href = url;
    }

    /**
     * Returns true when viewport is mobile size
     */
    function isMobileView() {
        return window.innerWidth <= 768;
    }

    /**
     * Open search panel in mobile viewport
     */
    function openMobileSearch() {
        if (!isMobileView()) {
            return;
        }

        searchContainer?.classList.add('mobile-open');

        if (searchBackdrop) {
            searchBackdrop.hidden = false;
            searchBackdrop.classList.add('active');
        }

        searchInput?.focus();
    }

    /**
     * Close search panel in mobile viewport
     */
    function closeMobileSearch() {
        if (!isMobileView()) {
            return;
        }

        searchContainer?.classList.remove('mobile-open');

        if (searchBackdrop) {
            searchBackdrop.classList.remove('active');
            searchBackdrop.hidden = true;
        }

        hideResults();
        searchInput?.blur();
    }

    /**
     * Cleanup overlay state after viewport changes
     */
    function syncMobileSearchState() {
        if (!isMobileView()) {
            searchContainer?.classList.remove('mobile-open');
            if (searchBackdrop) {
                searchBackdrop.classList.remove('active');
                searchBackdrop.hidden = true;
            }
        }
    }
    
    /**
     * Show loading state
     */
    function showLoading() {
        if (!searchResultsContent) return;
        
        searchResultsContent.innerHTML = `
            <div class="search-loading">
                <div class="search-loading-spinner"></div>
                <p>Searching...</p>
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
