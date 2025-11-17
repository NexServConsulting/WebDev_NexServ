/**
 * WebDev NexServ - FAQs JavaScript
 * FAQ accordion, search, and category filtering functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeFAQs();
});

/**
 * Initialize FAQs functionality
 */
function initializeFAQs() {
    console.log('FAQs initialized');

    // Initialize accordion functionality
    initializeAccordion();

    // Initialize FAQ search
    initializeFAQSearch();

    // Initialize category filtering
    initializeCategoryFiltering();

    // Initialize keyboard navigation
    initializeFAQKeyboardNav();

    // Initialize analytics tracking
    initializeFAQAnalytics();

    // Initialize print functionality
    initializePrintFAQ();
}

/**
 * Initialize FAQ accordion functionality
 */
function initializeAccordion() {
    const faqItems = getElements('.faq-item');

    faqItems.forEach(item => {
        const question = getElement('.faq-question', item);
        const answer = getElement('.faq-answer', item);
        const toggle = getElement('.faq-toggle', item);

        if (!question || !answer || !toggle) return;

        // Question click handler
        question.addEventListener('click', function() {
            toggleFAQ(item);
        });

        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(item);
            }
        });

        // Set initial ARIA attributes
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', answer.id || `faq-answer-${generateId()}`);
        answer.setAttribute('aria-hidden', 'true');
        answer.setAttribute('role', 'region');

        // Give answer an ID if it doesn't have one
        if (!answer.id) {
            answer.id = `faq-answer-${generateId()}`;
            question.setAttribute('aria-controls', answer.id);
        }
    });
}

/**
 * Toggle FAQ item
 */
function toggleFAQ(item) {
    const question = getElement('.faq-question', item);
    const answer = getElement('.faq-answer', item);
    const isCurrentlyActive = item.classList.contains('active');

    // Close all other FAQs in the same category (optional - remove for multiple open)
    const category = item.closest('.faq-category');
    if (category) {
        const otherItems = getElements('.faq-item.active', category);
        otherItems.forEach(otherItem => {
            if (otherItem !== item) {
                closeFAQ(otherItem);
            }
        });
    }

    // Toggle current FAQ
    if (isCurrentlyActive) {
        closeFAQ(item);
    } else {
        openFAQ(item);
    }

    // Track FAQ interaction
    if (typeof gtag !== 'undefined') {
        const questionText = question.textContent.trim().substring(0, 50);
        gtag('event', 'faq_toggle', {
            event_category: 'faq',
            event_label: questionText,
            custom_map: { action: isCurrentlyActive ? 'close' : 'open' }
        });
    }
}

/**
 * Open FAQ item
 */
function openFAQ(item) {
    const question = getElement('.faq-question', item);
    const answer = getElement('.faq-answer', item);
    const answerContent = answer.firstElementChild;

    item.classList.add('active');
    question.setAttribute('aria-expanded', 'true');
    answer.setAttribute('aria-hidden', 'false');

    // Get natural height
    answer.style.height = 'auto';
    const height = answer.scrollHeight;

    // Animate to natural height
    answer.style.height = '0';
    answer.style.overflow = 'hidden';
    answer.style.transition = 'height 0.3s ease';

    requestAnimationFrame(() => {
        answer.style.height = `${height}px`;
    });

    // Clean up after animation
    answer.addEventListener('transitionend', function() {
        answer.style.height = 'auto';
        answer.style.overflow = 'visible';
        answer.style.transition = '';
    }, { once: true });
}

/**
 * Close FAQ item
 */
function closeFAQ(item) {
    const question = getElement('.faq-question', item);
    const answer = getElement('.faq-answer', item);

    item.classList.remove('active');
    question.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');

    // Set height for animation
    answer.style.height = `${answer.scrollHeight}px`;
    answer.style.overflow = 'hidden';
    answer.style.transition = 'height 0.3s ease';

    requestAnimationFrame(() => {
        answer.style.height = '0';
    });

    // Clean up after animation
    answer.addEventListener('transitionend', function() {
        answer.style.height = '';
        answer.style.overflow = '';
        answer.style.transition = '';
    }, { once: true });
}

/**
 * Initialize FAQ search functionality
 */
function initializeFAQSearch() {
    const searchInput = getElement('#faq-search-input');
    const resultCount = getElement('#result-count');
    const faqItems = getElements('.faq-item');

    if (!searchInput || faqItems.length === 0) return;

    let searchTimeout;

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.toLowerCase().trim();

        searchTimeout = setTimeout(() => {
            performFAQSearch(query);
        }, 300);
    });

    // Clear search on escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            performFAQSearch('');
        }
    });

    /**
     * Perform FAQ search
     */
    function performFAQSearch(query) {
        let visibleCount = 0;
        const searchTerms = query.split(' ').filter(term => term.length > 0);

        faqItems.forEach(item => {
            const question = getElement('.faq-question', item);
            const answer = getElement('.faq-answer', item);
            const answerContent = answer?.textContent || '';

            const questionText = question.textContent.toLowerCase();
            const isMatch = searchTerms.length === 0 ||
                searchTerms.every(term =>
                    questionText.includes(term) || answerContent.includes(term)
                );

            if (isMatch) {
                item.style.display = '';
                item.classList.remove('search-hidden');
                visibleCount++;

                // Highlight search terms
                if (query.length > 2) {
                    highlightSearchTerms(question, query);
                    highlightSearchTerms(answer, query);
                } else {
                    removeHighlights(question);
                    removeHighlights(answer);
                }
            } else {
                item.classList.add('search-hidden');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

        // Update search results
        updateSearchResults(visibleCount, query);

        // Close all expanded FAQs when searching
        if (query.length > 0) {
            faqItems.forEach(item => {
                if (item.classList.contains('active')) {
                    closeFAQ(item);
                }
            });
        }
    }

    /**
     * Highlight search terms
     */
    function highlightSearchTerms(element, query) {
        const text = element.textContent;
        const regex = new RegExp(`(${query})`, 'gi');

        if (regex.test(text)) {
            element.innerHTML = text.replace(regex, '<mark>$1</mark>');
        }
    }

    /**
     * Remove highlights
     */
    function removeHighlights(element) {
        const marks = element.querySelectorAll('mark');
        marks.forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }

    /**
     * Update search results count
     */
    function updateSearchResults(count, query) {
        if (resultCount) {
            if (query === '') {
                resultCount.textContent = faqItems.length;
                resultCount.parentNode.textContent = `${resultCount.textContent} questions found`;
            } else {
                resultCount.textContent = count;
                resultCount.parentNode.textContent = `${count} questions found for "${query}"`;
            }
        }
    }

    // Add search highlighting styles
    if (!document.querySelector('#search-highlight-styles')) {
        const styles = document.createElement('style');
        styles.id = 'search-highlight-styles';
        styles.textContent = `
            mark {
                background: #FFEB3B;
                color: #000;
                padding: 0 2px;
                border-radius: 2px;
            }

            .faq-item.search-hidden {
                opacity: 0;
                transform: translateY(-10px);
            }

            .faq-item:not(.search-hidden) {
                opacity: 1;
                transform: translateY(0);
            }

            @media (prefers-reduced-motion: reduce) {
                .faq-item {
                    transition: none !important;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

/**
 * Initialize category filtering
 */
function initializeCategoryFiltering() {
    const categoryTabs = getElements('.category-tab');
    const faqCategories = getElements('.faq-category');
    const faqItems = getElements('.faq-item');

    if (categoryTabs.length === 0 || faqCategories.length === 0) return;

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;

            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Filter categories
            filterCategories(category);

            // Track category selection
            if (typeof gtag !== 'undefined') {
                gtag('event', 'faq_category_filter', {
                    event_category: 'faq',
                    event_label: category
                });
            }
        });
    });

    /**
     * Filter categories
     */
    function filterCategories(category) {
        faqCategories.forEach(faqCategory => {
            if (category === 'all') {
                faqCategory.style.display = '';
                faqCategory.classList.remove('category-hidden');
            } else {
                const categoryId = faqCategory.id;
                const shouldShow = categoryId === category;

                if (shouldShow) {
                    faqCategory.style.display = '';
                    faqCategory.classList.remove('category-hidden');
                } else {
                    faqCategory.classList.add('category-hidden');
                    setTimeout(() => {
                        faqCategory.style.display = 'none';
                    }, 300);
                }
            }
        });

        // Update visible count
        updateVisibleCount();
    }

    /**
     * Update visible FAQ count
     */
    function updateVisibleCount() {
        const visibleItems = Array.from(faqItems).filter(item =>
            item.offsetParent !== null && !item.classList.contains('search-hidden')
        );

        const resultCount = getElement('#result-count');
        if (resultCount) {
            resultCount.textContent = visibleItems.length;
            resultCount.parentNode.textContent = `${resultCount.textContent} questions found`;
        }
    }
}

/**
 * Initialize FAQ keyboard navigation
 */
function initializeFAQKeyboardNav() {
    const faqQuestions = getElements('.faq-question');
    const categoryTabs = getElements('.category-tab');

    document.addEventListener('keydown', (e) => {
        // Tab navigation through FAQs
        if (e.key === 'Tab') {
            // Let browser handle tab navigation, just track focus
            setTimeout(() => {
                const focusedElement = document.activeElement;
                if (focusedElement.classList.contains('faq-question')) {
                    // Scroll to view if needed
                    focusedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 0);
        }

        // Arrow key navigation through category tabs
        if (['ArrowLeft', 'ArrowRight'].includes(e.key) && categoryTabs.length > 0) {
            const focusedTab = document.activeElement.classList.contains('category-tab') ?
                document.activeElement : null;

            if (focusedTab) {
                const currentIndex = Array.from(categoryTabs).indexOf(focusedTab);
                let nextIndex;

                if (e.key === 'ArrowLeft') {
                    nextIndex = (currentIndex - 1 + categoryTabs.length) % categoryTabs.length;
                } else {
                    nextIndex = (currentIndex + 1) % categoryTabs.length;
                }

                categoryTabs[nextIndex].focus();
                e.preventDefault();
            }
        }

        // Home/End navigation in search
        if (e.key === 'Home' || e.key === 'End') {
            const searchInput = getElement('#faq-search-input');
            if (searchInput && document.activeElement === searchInput) {
                return; // Let browser handle home/end in input
            }

            if (e.key === 'Home' && faqQuestions.length > 0) {
                faqQuestions[0].focus();
                e.preventDefault();
            } else if (e.key === 'End' && faqQuestions.length > 0) {
                faqQuestions[faqQuestions.length - 1].focus();
                e.preventDefault();
            }
        }

        // Ctrl+F to focus search
        if (e.ctrlKey && e.key === 'f') {
            const searchInput = getElement('#faq-search-input');
            if (searchInput && document.activeElement !== searchInput) {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        }
    });
}

/**
 * Initialize FAQ analytics tracking
 */
function initializeFAQAnalytics() {
    // Track FAQ page views
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'FAQs',
            page_location: window.location.href
        });
    }

    // Track popular FAQs
    const faqClicks = new Map();

    // Track FAQ clicks
    const faqQuestions = getElements('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const questionText = this.textContent.trim().substring(0, 50);
            const currentCount = faqClicks.get(questionText) || 0;
            faqClicks.set(questionText, currentCount + 1);

            // Track click analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'faq_click', {
                    event_category: 'faq',
                    event_label: questionText,
                    custom_map: { click_count: currentCount + 1 }
                });
            }
        });
    });

    // Track search analytics
    const searchInput = getElement('#faq-search-input');
    let searchQueries = [];

    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            const query = this.value.trim();
            if (query.length > 2) {
                searchQueries.push(query);

                // Track search query
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'faq_search', {
                        event_category: 'faq',
                        event_label: query,
                        custom_map: { search_term: query }
                    });
                }
            }
        }, 1000));
    }

    // Track time spent on FAQ page
    const startTime = Date.now();

    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        if (typeof gtag !== 'undefined' && timeSpent > 10) {
            gtag('event', 'faq_engagement_time', {
                event_category: 'faq',
                event_label: 'time_spent',
                value: timeSpent
            });

            // Track most clicked FAQ
            if (faqClicks.size > 0) {
                const mostClicked = [...faqClicks.entries()].sort((a, b) => b[1] - a[1])[0];
                gtag('event', 'faq_most_clicked', {
                    event_category: 'faq',
                    event_label: mostClicked[0],
                    custom_map: { click_count: mostClicked[1] }
                });
            }

            // Track search activity
            if (searchQueries.length > 0) {
                gtag('event', 'faq_search_activity', {
                    event_category: 'faq',
                    event_label: 'total_searches',
                    custom_map: { search_count: searchQueries.length }
                });
            }
        }
    });
}

/**
 * Initialize print functionality
 */
function initializePrintFAQ() {
    // Add print button if not present
    const searchContainer = getElement('.search-container');
    if (searchContainer && !getElement('.print-faqs', searchContainer)) {
        const printButton = document.createElement('button');
        printButton.className = 'print-faqs btn btn-outline';
        printButton.textContent = 'Print FAQs';
        printButton.addEventListener('click', printFAQs);
        searchContainer.appendChild(printButton);
    }

    // Add print styles
    if (!document.querySelector('#print-styles')) {
        const styles = document.createElement('style');
        styles.id = 'print-styles';
        styles.textContent = `
            .print-faqs {
                margin-left: var(--space-4);
                font-size: var(--font-size-sm);
            }

            @media print {
                .header,
                .footer,
                .nav,
                .filter-controls,
                .category-tabs,
                .search-container,
                .still-have-questions,
                .print-faqs {
                    display: none !important;
                }

                .faq-section {
                    padding: 0;
                }

                .faq-item {
                    page-break-inside: avoid;
                    margin-bottom: 1rem;
                    border: 1px solid #ccc;
                    padding: 0.5rem;
                }

                .faq-question {
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }

                .faq-answer {
                    margin-bottom: 0;
                }

                .faq-answer > div > * {
                    margin-bottom: 0.5rem;
                }

                mark {
                    background: #FFEB3B !important;
                    color: #000 !important;
                }

                body {
                    font-size: 12pt;
                    line-height: 1.4;
                }

                h2 {
                    font-size: 16pt;
                    margin-bottom: 1rem;
                }

                .category-title {
                    page-break-after: avoid;
                    margin-top: 2rem;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

/**
 * Print FAQs
 */
function printFAQs() {
    // Open all FAQs for printing
    const faqItems = getElements('.faq-item');
    faqItems.forEach(item => {
        if (!item.classList.contains('active')) {
            openFAQ(item);
        }
    });

    // Trigger print dialog
    setTimeout(() => {
        window.print();
    }, 500);

    // Track print action
    if (typeof gtag !== 'undefined') {
        gtag('event', 'faq_print', {
            event_category: 'faq',
            event_label: 'print_faqs'
        });
    }
}

/**
 * Expand all FAQs
 */
function expandAllFAQs() {
    const faqItems = getElements('.faq-item');
    faqItems.forEach(item => {
        if (!item.classList.contains('active')) {
            openFAQ(item);
        }
    });
}

/**
 * Collapse all FAQs
 */
function collapseAllFAQs() {
    const faqItems = getElements('.faq-item');
    faqItems.forEach(item => {
        if (item.classList.contains('active')) {
            closeFAQ(item);
        }
    });
}

// Make FAQ functions global for access from HTML
window.expandAllFAQs = expandAllFAQs;
window.collapseAllFAQs = collapseAllFAQs;
window.printFAQs = printFAQs;

// Export FAQ functions for other modules
window.WebDevNexServFAQs = {
    toggleFAQ,
    openFAQ,
    closeFAQ,
    expandAllFAQs,
    collapseAllFAQs,
    performFAQSearch
};