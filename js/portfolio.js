/**
 * WebDev NexServ - Portfolio JavaScript
 * Portfolio filtering, project details, and modal functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

/**
 * Initialize portfolio functionality
 */
function initializePortfolio() {
    console.log('Portfolio initialized');

    // Initialize filtering
    initializePortfolioFiltering();

    // Initialize modal functionality
    initializePortfolioModal();

    // Initialize search functionality
    initializePortfolioSearch();

    // Initialize load more functionality
    initializeLoadMore();

    // Initialize keyboard navigation
    initializePortfolioKeyboardNav();

    // Initialize analytics tracking
    initializePortfolioAnalytics();
}

/**
 * Initialize portfolio filtering
 */
function initializePortfolioFiltering() {
    const filterButtons = getElements('.filter-btn');
    const portfolioItems = getElements('.portfolio-item');
    const filterCount = getElement('#filter-count');
    const loadMoreButton = getElement('#load-more');

    if (filterButtons.length === 0 || portfolioItems.length === 0) return;

    let activeFilter = 'all';
    let visibleItems = [...portfolioItems];

    // Filter button click handlers
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;

            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Apply filter
            applyFilter(filter);

            // Track filter usage
            if (typeof gtag !== 'undefined') {
                gtag('event', 'portfolio_filter', {
                    event_category: 'portfolio',
                    event_label: filter
                });
            }
        });
    });

    /**
     * Apply filter to portfolio items
     */
    function applyFilter(filter) {
        activeFilter = filter;
        visibleItems = [];

        portfolioItems.forEach(item => {
            const categories = item.dataset.category;
            const categoryArray = categories ? categories.split(' ') : [];

            const shouldShow = filter === 'all' || categoryArray.includes(filter);

            if (shouldShow) {
                item.style.display = 'block';
                item.classList.remove('filtered-out');
                visibleItems.push(item);

                // Animate in with stagger
                setTimeout(() => {
                    item.classList.add('filter-revealed');
                }, visibleItems.length * 50);

            } else {
                item.classList.add('filtered-out');
                item.classList.remove('filter-revealed');

                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

        // Update count
        updateFilterCount();

        // Show/hide load more button
        updateLoadMoreButton();

        // Reset any expanded states
        resetExpandedItems();
    }

    /**
     * Update filter count display
     */
    function updateFilterCount() {
        if (filterCount) {
            filterCount.textContent = visibleItems.length;
        }
    }

    /**
     * Update load more button visibility
     */
    function updateLoadMoreButton() {
        if (loadMoreButton) {
            const hasHiddenItems = visibleItems.some(item => item.classList.contains('initially-hidden'));
            loadMoreButton.style.display = hasHiddenItems ? 'block' : 'none';
        }
    }

    /**
     * Reset expanded items
     */
    function resetExpandedItems() {
        const expandedItems = getElements('.portfolio-item.expanded');
        expandedItems.forEach(item => {
            item.classList.remove('expanded');
        });
    }

    // Initialize with "all" filter
    applyFilter('all');

    // Add filter reveal styles
    addFilterStyles();
}

/**
 * Add filter animation styles
 */
function addFilterStyles() {
    if (document.querySelector('#filter-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'filter-styles';
    styles.textContent = `
        .portfolio-item {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .portfolio-item.filtered-out {
            opacity: 0;
            transform: scale(0.8);
        }

        .portfolio-item.filter-revealed {
            opacity: 1;
            transform: scale(1);
        }

        .portfolio-item:not(.filter-revealed) {
            opacity: 0;
            transform: scale(0.8);
        }

        .filter-btn {
            transition: all 0.2s ease;
        }

        .filter-btn:hover {
            transform: translateY(-1px);
        }

        .filter-btn.active {
            transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
            .portfolio-item,
            .filter-btn {
                transition: none;
            }
        }
    `;
    document.head.appendChild(styles);
}

/**
 * Initialize portfolio modal functionality
 */
function initializePortfolioModal() {
    const modal = getElement('#project-modal');
    const modalOverlay = getElement('#modal-overlay');
    const modalClose = getElement('#modal-close');
    const viewButtons = getElements('.view-project');
    const modalBody = getElement('.modal-body', modal);

    if (!modal || !modalBody) return;

    let currentProject = null;

    // View project buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const projectId = this.dataset.project;
            openProjectModal(projectId);
        });
    });

    // Close modal handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    /**
     * Open project modal
     */
    function openProjectModal(projectId) {
        currentProject = projectId;

        // Load project content
        loadProjectContent(projectId);

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management
        setTimeout(() => {
            modalClose.focus();
        }, 100);

        // Track modal view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'portfolio_modal_view', {
                event_category: 'portfolio',
                event_label: projectId
            });
        }
    }

    /**
     * Close modal
     */
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Clear content
        modalBody.innerHTML = '';

        // Return focus to trigger button
        const triggerButton = getElement(`[data-project="${currentProject}"]`);
        if (triggerButton) {
            triggerButton.focus();
        }

        currentProject = null;
    }

    /**
     * Load project content
     */
    async function loadProjectContent(projectId) {
        // Show loading state
        modalBody.innerHTML = `
            <div class="modal-loading">
                <div class="loading-spinner"></div>
                <p>Loading project details...</p>
            </div>
        `;

        try {
            // Simulate API call to get project data
            const projectData = await getProjectData(projectId);

            // Render project content
            modalBody.innerHTML = renderProjectContent(projectData);

            // Initialize modal content interactions
            initializeModalContent();

        } catch (error) {
            console.error('Error loading project:', error);
            modalBody.innerHTML = `
                <div class="modal-error">
                    <h3>Error Loading Project</h3>
                    <p>Sorry, we couldn't load the project details. Please try again later.</p>
                    <button class="btn btn-primary" onclick="closeModal()">Close</button>
                </div>
            `;
        }
    }

    /**
     * Get project data (simulated)
     */
    async function getProjectData(projectId) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock project data
        const projects = {
            'techstart': {
                title: 'TechStart Platform',
                category: 'Web Design & Development',
                client: 'TechStart Inc.',
                date: 'March 2024',
                duration: '8 weeks',
                budget: '$25,000 - $35,000',
                technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
                description: 'Complete digital platform transformation for early-stage startup including website, dashboard, and mobile app.',
                challenge: 'TechStart needed a comprehensive digital presence to attract investors and early adopters. Their existing website was outdated and didn\'t reflect their innovative technology.',
                solution: 'We designed and developed a modern, responsive platform with a custom dashboard, investor relations section, and seamless user experience.',
                results: [
                    '300% increase in user engagement',
                    '200% increase in investor inquiries',
                    '50% reduction in bounce rate',
                    'Launched 2 weeks ahead of schedule'
                ],
                images: ['hero', 'dashboard', 'mobile'],
                testimonial: {
                    text: 'WebDev NexServ transformed our online presence completely. The new platform perfectly represents our innovative approach to technology.',
                    author: 'Sarah Johnson',
                    role: 'CEO, TechStart'
                }
            },
            'ecobeauty': {
                title: 'EcoBeauty E-commerce Platform',
                category: 'E-commerce Development',
                client: 'EcoBeauty Cosmetics',
                date: 'February 2024',
                duration: '10 weeks',
                budget: '$30,000 - $45,000',
                technologies: ['Shopify Plus', 'React', 'Node.js', 'Stripe'],
                description: 'Custom e-commerce platform for sustainable beauty brand with advanced product customization and subscription features.',
                challenge: 'EcoBeauty needed to migrate from a basic e-commerce solution to a platform that could handle complex product variations, subscriptions, and provide exceptional user experience.',
                solution: 'Built a custom Shopify Plus store with advanced product customization, subscription management, and seamless checkout experience.',
                results: [
                    '150% increase in online sales',
                    '40% improvement in conversion rate',
                    '25% increase in average order value',
                    'Integrated CRM and marketing automation'
                ],
                images: ['homepage', 'product-detail', 'checkout'],
                testimonial: {
                    text: 'The new platform has transformed our business. Sales are up, customers love the experience, and we have the tools to scale effectively.',
                    author: 'Michael Chen',
                    role: 'Founder, EcoBeauty'
                }
            },
            'financeflow': {
                title: 'FinanceFlow Rebrand',
                category: 'Brand Identity Design',
                client: 'FinanceFlow Inc.',
                date: 'January 2024',
                duration: '6 weeks',
                budget: '$12,000 - $18,000',
                technologies: ['Figma', 'Adobe Creative Suite', 'Brand Guidelines'],
                description: 'Complete brand identity redesign including logo, color palette, typography, and comprehensive brand guidelines.',
                challenge: 'FinanceFlow had an outdated brand identity that didn\'t reflect their modern approach to financial technology. They needed a brand that would appeal to younger, tech-savvy customers.',
                solution: 'Developed a comprehensive brand identity with modern logo design, vibrant color scheme, and detailed brand guidelines for consistent application.',
                results: [
                    '85% increase in brand recognition',
                    '40% increase in website engagement',
                    'Positive feedback from target audience',
                    'Consistent brand application across all touchpoints'
                ],
                images: ['logo-variations', 'color-palette', 'brand-applications'],
                testimonial: {
                    text: 'The new brand perfectly captures who we are. Our customers love it, and it has given us the confidence to expand into new markets.',
                    author: 'Amanda Rodriguez',
                    role: 'CMO, FinanceFlow'
                }
            }
        };

        return projects[projectId] || {
            title: 'Project Details',
            category: 'Web Design',
            client: 'Client Name',
            date: '2024',
            duration: '6 weeks',
            budget: 'Contact for pricing',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            description: 'Project details coming soon.',
            challenge: 'Challenge description coming soon.',
            solution: 'Solution details coming soon.',
            results: ['Results coming soon'],
            images: ['placeholder'],
            testimonial: null
        };
    }

    /**
     * Render project content
     */
    function renderProjectContent(project) {
        return `
            <div class="project-header">
                <h2>${project.title}</h2>
                <div class="project-meta">
                    <span class="project-category">${project.category}</span>
                    <span class="project-date">${project.date}</span>
                </div>
            </div>

            <div class="project-gallery">
                ${project.images.map((image, index) => `
                    <div class="project-image ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <div class="image-placeholder">${image}</div>
                    </div>
                `).join('')}

                ${project.images.length > 1 ? `
                    <div class="gallery-controls">
                        <button class="gallery-prev" onclick="changeGalleryImage(-1)">‹</button>
                        <button class="gallery-next" onclick="changeGalleryImage(1)">›</button>
                        <div class="gallery-dots">
                            ${project.images.map((_, index) => `
                                <button class="gallery-dot ${index === 0 ? 'active' : ''}" onclick="goToGalleryImage(${index})"></button>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="project-content">
                <div class="project-section">
                    <h3>Overview</h3>
                    <p>${project.description}</p>
                </div>

                <div class="project-grid">
                    <div class="project-section">
                        <h3>The Challenge</h3>
                        <p>${project.challenge}</p>
                    </div>

                    <div class="project-section">
                        <h3>Our Solution</h3>
                        <p>${project.solution}</p>
                    </div>
                </div>

                <div class="project-section">
                    <h3>Key Results</h3>
                    <ul class="results-list">
                        ${project.results.map(result => `<li>${result}</li>`).join('')}
                    </ul>
                </div>

                <div class="project-details">
                    <div class="detail-item">
                        <strong>Client:</strong> ${project.client}
                    </div>
                    <div class="detail-item">
                        <strong>Duration:</strong> ${project.duration}
                    </div>
                    <div class="detail-item">
                        <strong>Budget:</strong> ${project.budget}
                    </div>
                    <div class="detail-item">
                        <strong>Technologies:</strong>
                        <div class="tech-tags">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>

                ${project.testimonial ? `
                    <div class="project-testimonial">
                        <blockquote>"${project.testimonial.text}"</blockquote>
                        <cite>
                            <strong>${project.testimonial.author}</strong>
                            <span>${project.testimonial.role}</span>
                        </cite>
                    </div>
                ` : ''}

                <div class="project-actions">
                    <button class="btn btn-primary" onclick="openContactModal('project_${project.title.toLowerCase().replace(/\s+/g, '_')}')">
                        Start Similar Project
                    </button>
                    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
                </div>
            </div>
        `;
    }

    // Make gallery functions global
    window.changeGalleryImage = function(direction) {
        const images = getElements('.project-image', modalBody);
        const dots = getElements('.gallery-dot', modalBody);
        const activeImage = getElement('.project-image.active', modalBody);
        const currentIndex = parseInt(activeImage.dataset.index);
        const newIndex = (currentIndex + direction + images.length) % images.length;

        // Update images
        images.forEach(img => img.classList.remove('active'));
        images[newIndex].classList.add('active');

        // Update dots
        if (dots.length > 0) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[newIndex].classList.add('active');
        }
    };

    window.goToGalleryImage = function(index) {
        const images = getElements('.project-image', modalBody);
        const dots = getElements('.gallery-dot', modalBody);

        // Update images
        images.forEach(img => img.classList.remove('active'));
        images[index].classList.add('active');

        // Update dots
        if (dots.length > 0) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        }
    };
}

/**
 * Initialize modal content interactions
 */
function initializeModalContent() {
    // Add any additional interactions for modal content
    // This can be expanded as needed
}

/**
 * Initialize portfolio search functionality
 */
function initializePortfolioSearch() {
    const searchInput = getElement('#faq-search-input'); // Reuse search input
    const portfolioItems = getElements('.portfolio-item');

    if (!searchInput || portfolioItems.length === 0) return;

    let searchTimeout;

    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.toLowerCase().trim();

        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });

    /**
     * Perform search
     */
    function performSearch(query) {
        let visibleCount = 0;

        portfolioItems.forEach(item => {
            const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';
            const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');

            const isMatch = query === '' || title.includes(query) || description.includes(query) || tags.includes(query);

            if (isMatch) {
                item.style.display = 'block';
                item.classList.remove('search-filtered');
                visibleCount++;
            } else {
                item.classList.add('search-filtered');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });

        // Update search results count
        updateSearchResults(visibleCount, query);
    }

    /**
     * Update search results count
     */
    function updateSearchResults(count, query) {
        const resultCount = getElement('#result-count');
        if (resultCount) {
            if (query === '') {
                resultCount.textContent = portfolioItems.length;
            } else {
                resultCount.textContent = count;
            }
        }
    }
}

/**
 * Initialize load more functionality
 */
function initializeLoadMore() {
    const loadMoreButton = getElement('#load-more');
    const portfolioItems = getElements('.portfolio-item');

    if (!loadMoreButton || portfolioItems.length === 0) return;

    // Initially hide items beyond first 8
    let itemsToShow = 8;
    portfolioItems.forEach((item, index) => {
        if (index >= itemsToShow) {
            item.style.display = 'none';
            item.classList.add('initially-hidden');
        }
    });

    loadMoreButton.addEventListener('click', function() {
        loadMoreItems();
    });

    /**
     * Load more items
     */
    function loadMoreItems() {
        const hiddenItems = Array.from(portfolioItems).filter(item => item.classList.contains('initially-hidden'));
        const itemsToLoad = hiddenItems.slice(0, 4);

        itemsToLoad.forEach((item, index) => {
            setTimeout(() => {
                item.style.display = 'block';
                item.classList.remove('initially-hidden');
                item.classList.add('load-revealed');

                // Add stagger effect
                setTimeout(() => {
                    item.classList.add('filter-revealed');
                }, 50);
            }, index * 100);
        });

        // Hide button if no more items
        if (hiddenItems.length <= 4) {
            loadMoreButton.style.display = 'none';
        }

        // Track load more usage
        if (typeof gtag !== 'undefined') {
            gtag('event', 'portfolio_load_more', {
                event_category: 'portfolio',
                event_label: `${itemsToLoad.length} items loaded`
            });
        }
    }

    // Add load more styles
    if (!document.querySelector('#load-more-styles')) {
        const styles = document.createElement('style');
        styles.id = 'load-more-styles';
        styles.textContent = `
            .portfolio-item.initially-hidden {
                display: none;
            }

            .portfolio-item.load-revealed {
                opacity: 0;
                transform: translateY(20px);
            }

            .portfolio-item.load-revealed.filter-revealed {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(styles);
    }
}

/**
 * Initialize portfolio keyboard navigation
 */
function initializePortfolioKeyboardNav() {
    const portfolioItems = getElements('.portfolio-item');
    const viewButtons = getElements('.view-project');

    document.addEventListener('keydown', (e) => {
        // Arrow key navigation through portfolio items
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            const focusedItem = document.activeElement.closest('.portfolio-item');
            if (focusedItem) {
                navigatePortfolioItems(e.key, focusedItem, portfolioItems);
                e.preventDefault();
            }
        }

        // Enter to open focused project
        if (e.key === 'Enter') {
            const focusedViewButton = document.activeElement.classList.contains('view-project');
            if (focusedViewButton) {
                focusedViewButton.click();
                e.preventDefault();
            }
        }
    });
}

/**
 * Navigate portfolio items with keyboard
 */
function navigatePortfolioItems(key, currentItem, allItems) {
    const currentIndex = Array.from(allItems).indexOf(currentItem);
    let nextIndex;

    switch (key) {
        case 'ArrowRight':
        case 'ArrowDown':
            nextIndex = (currentIndex + 1) % allItems.length;
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            nextIndex = (currentIndex - 1 + allItems.length) % allItems.length;
            break;
    }

    if (nextIndex !== undefined) {
        const nextItem = allItems[nextIndex];
        const viewButton = nextItem.querySelector('.view-project');
        if (viewButton) {
            viewButton.focus();
        }
    }
}

/**
 * Initialize portfolio analytics tracking
 */
function initializePortfolioAnalytics() {
    // Track portfolio page views
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'Portfolio',
            page_location: window.location.href
        });
    }

    // Track time spent on portfolio
    const startTime = Date.now();

    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);

        if (typeof gtag !== 'undefined' && timeSpent > 5) {
            gtag('event', 'portfolio_engagement_time', {
                event_category: 'portfolio',
                event_label: 'time_spent',
                value: timeSpent
            });
        }
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScrollDepth = throttle(() => {
        const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
        }
    }, 1000);

    window.addEventListener('scroll', trackScrollDepth);

    window.addEventListener('beforeunload', () => {
        if (typeof gtag !== 'undefined' && maxScrollDepth > 25) {
            gtag('event', 'portfolio_scroll_depth', {
                event_category: 'portfolio',
                event_label: 'max_depth',
                value: maxScrollDepth
            });
        }
    });
}

/**
 * Open contact modal from project
 */
function openContactModal(projectContext) {
    // Close current modal
    const projectModal = getElement('#project-modal');
    if (projectModal) {
        projectModal.classList.remove('active');
    }

    // Open contact modal with project context
    const contactModal = getElement('#contact-modal');
    if (contactModal) {
        contactModal.classList.add('active');

        // Pre-fill project information
        const projectField = getElement('#project-interest', contactModal);
        if (projectField) {
            projectField.value = projectContext;
        }
    }
}

// Make contact modal function global
window.openContactModal = openContactModal;

// Export portfolio functions for other modules
window.WebDevNexServPortfolio = {
    applyFilter,
    openProjectModal,
    loadMoreItems,
    performSearch
};