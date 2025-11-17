/**
 * WebDev NexServ - Navigation JavaScript
 * Header navigation, mobile menu, and scroll effects
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    console.log('Navigation initialized');

    // Initialize sticky header
    initializeStickyHeader();

    // Initialize mobile navigation
    initializeMobileNavigation();

    // Initialize active navigation highlighting
    initializeActiveNavigation();

    // Initialize scroll effects
    initializeScrollEffects();

    // Initialize navigation accessibility
    initializeNavigationAccessibility();
}

/**
 * Initialize sticky header behavior
 */
function initializeStickyHeader() {
    const header = getElement('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    let headerHeight = header.offsetHeight;

    // Update header height on resize
    const updateHeaderHeight = throttle(() => {
        headerHeight = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }, 250);

    window.addEventListener('resize', updateHeaderHeight);
    updateHeaderHeight();

    // Handle scroll behavior
    const handleScroll = throttle(() => {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll (mobile only)
        if (window.innerWidth <= 768) {
            if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
                // Scrolling down
                header.style.transform = `translateY(-100%)`;
            } else {
                // Scrolling up or at top
                header.style.transform = `translateY(0)`;
            }
        } else {
            header.style.transform = `translateY(0)`;
        }

        lastScrollY = currentScrollY;
    }, 16); // ~60fps

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize scroll position
    handleScroll();
}

/**
 * Initialize mobile navigation toggle
 */
function initializeMobileNavigation() {
    const navToggle = getElement('.nav-toggle');
    const navMenu = getElement('.nav-menu');
    const navLinks = getElements('.nav-link');

    if (!navToggle || !navMenu) return;

    let isMenuOpen = false;

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        isMenuOpen = !isMenuOpen;

        // Update menu state
        navMenu.classList.toggle('active', isMenuOpen);
        navToggle.classList.toggle('active', isMenuOpen);

        // Update body scroll
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';

        // Update ARIA attributes
        navToggle.setAttribute('aria-expanded', isMenuOpen);
        navMenu.setAttribute('aria-hidden', !isMenuOpen);

        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        if (isMenuOpen) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }

        // Focus management
        if (isMenuOpen) {
            // Focus first menu item
            const firstLink = navMenu.querySelector('.nav-link');
            if (firstLink) {
                setTimeout(() => firstLink.focus(), 100);
            }
        }
    };

    navToggle.addEventListener('click', toggleMobileMenu);

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu();
            navToggle.focus();
        }
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !header.contains(e.target)) {
            toggleMobileMenu();
        }
    });

    // Handle window resize
    const handleResize = debounce(() => {
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMobileMenu();
        }
    }, 250);

    window.addEventListener('resize', handleResize);
}

/**
 * Initialize active navigation highlighting
 */
function initializeActiveNavigation() {
    const navLinks = getElements('.nav-link');
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Check exact match
        if (href === currentPath || href === currentPath + currentHash) {
            link.classList.add('active');
            return;
        }

        // Check for home page
        if ((href === '/' || href === './index.html' || href === 'index.html') &&
            (currentPath === '/' || currentPath.endsWith('/index.html'))) {
            link.classList.add('active');
            return;
        }

        // Check for partial matches (for deeper pages)
        if (href !== '/' && href !== './index.html' && href !== 'index.html' &&
            currentPath.includes(href.replace(/^\.\//, ''))) {
            link.classList.add('active');
        }
    });

    // Handle scroll spy for sections
    initializeScrollSpy();
}

/**
 * Initialize scroll spy for navigation
 */
function initializeScrollSpy() {
    const sections = getElements('section[id]');
    const navLinks = getElements('.nav-link[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                // Update navigation
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });

                // Update URL hash
                if (history.replaceState) {
                    history.replaceState(null, null, `#${sectionId}`);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/**
 * Initialize scroll effects for navigation
 */
function initializeScrollEffects() {
    const header = getElement('.header');
    if (!header) return;

    // Parallax effect for hero elements
    initializeHeroParallax();

    // Progress bar indication
    initializeProgressBar();

    // Smooth reveal animations
    initializeScrollReveal();
}

/**
 * Initialize hero parallax effects
 */
function initializeHeroParallax() {
    const hero = getElement('.hero');
    const heroElements = getElements('.hero-element');

    if (!hero || heroElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        heroElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        ticking = false;
    };

    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };

    window.addEventListener('scroll', requestTick, { passive: true });
}

/**
 * Initialize scroll progress bar
 */
function initializeProgressBar() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: #000;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    // Update progress bar on scroll
    const updateProgress = throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;

        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, 16);

    window.addEventListener('scroll', updateProgress, { passive: true });

    // Hide progress bar at top
    const toggleProgressBar = throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        progressBar.style.opacity = scrollTop > 100 ? '1' : '0';
    }, 100);

    window.addEventListener('scroll', toggleProgressBar, { passive: true });
}

/**
 * Initialize scroll reveal animations
 */
function initializeScrollReveal() {
    const revealElements = getElements('[data-reveal]');

    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.revealDelay || 0;
                const direction = element.dataset.revealDirection || 'up';

                setTimeout(() => {
                    element.classList.add('revealed');
                    element.style.animation = `reveal-${direction} 0.6s ease forwards`;
                }, delay);

                revealObserver.unobserve(element);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = getRevealTransform(element.dataset.revealDirection);
        element.style.transition = 'all 0.6s ease';

        revealObserver.observe(element);
    });

    // Add reveal animations styles
    if (!document.querySelector('#reveal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'reveal-styles';
        styles.textContent = `
            @keyframes reveal-up {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes reveal-down {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes reveal-left {
                from {
                    opacity: 0;
                    transform: translateX(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes reveal-right {
                from {
                    opacity: 0;
                    transform: translateX(30px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes reveal-fade {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .revealed {
                opacity: 1 !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(styles);
    }
}

/**
 * Get reveal transform based on direction
 */
function getRevealTransform(direction) {
    const transforms = {
        up: 'translateY(30px)',
        down: 'translateY(-30px)',
        left: 'translateX(-30px)',
        right: 'translateX(30px)',
        fade: 'scale(0.95)'
    };

    return transforms[direction] || transforms.up;
}

/**
 * Initialize navigation accessibility
 */
function initializeNavigationAccessibility() {
    const header = getElement('.header');
    const navToggle = getElement('.nav-toggle');
    const navMenu = getElement('.nav-menu');
    const navLinks = getElements('.nav-link');

    if (!header) return;

    // Set initial ARIA attributes
    if (navToggle && navMenu) {
        navToggle.setAttribute('aria-controls', 'nav-menu');
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.setAttribute('id', 'nav-menu');
        navMenu.setAttribute('aria-hidden', 'true');
    }

    // Add keyboard navigation for dropdowns (if any exist)
    const dropdownToggles = getElements('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        const dropdown = toggle.nextElementSibling;
        if (!dropdown || !dropdown.classList.contains('dropdown-menu')) return;

        toggle.setAttribute('aria-haspopup', 'true');
        toggle.setAttribute('aria-expanded', 'false');

        // Toggle dropdown on click
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = toggle.getAttribute('aria-expanded') === 'true';

            // Close other dropdowns
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    otherToggle.setAttribute('aria-expanded', 'false');
                    const otherDropdown = otherToggle.nextElementSibling;
                    if (otherDropdown) {
                        otherDropdown.classList.remove('show');
                    }
                }
            });

            // Toggle current dropdown
            toggle.setAttribute('aria-expanded', !isOpen);
            dropdown.classList.toggle('show', !isOpen);
        });

        // Keyboard navigation
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle.click();
            } else if (e.key === 'Escape') {
                toggle.setAttribute('aria-expanded', 'false');
                dropdown.classList.remove('show');
                toggle.focus();
            }
        });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            dropdownToggles.forEach(toggle => {
                toggle.setAttribute('aria-expanded', 'false');
                const dropdown = toggle.nextElementSibling;
                if (dropdown) {
                    dropdown.classList.remove('show');
                }
            });
        }
    });

    // Focus management for mobile menu
    if (navToggle && navMenu) {
        navMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = getElements(
                    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
                    navMenu
                );

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    // Enhanced focus styles
    addFocusStyles();
}

/**
 * Add enhanced focus styles
 */
function addFocusStyles() {
    if (document.querySelector('#focus-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'focus-styles';
    styles.textContent = `
        .nav-link:focus-visible {
            outline: 2px solid #000;
            outline-offset: 2px;
            background: rgba(0, 0, 0, 0.1);
        }

        .nav-toggle:focus-visible {
            outline: 2px solid #000;
            outline-offset: 2px;
        }

        .dropdown-toggle:focus-visible {
            outline: 2px solid #000;
            outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
            .nav-link,
            .nav-toggle,
            .hero-element,
            [data-reveal] {
                transition: none !important;
                animation: none !important;
            }
        }
    `;
    document.head.appendChild(styles);
}

/**
 * Smooth scroll to element with offset
 */
function smoothScrollTo(element, offset = 0) {
    if (!element) return;

    const header = getElement('.header');
    const headerHeight = header ? header.offsetHeight : 0;
    const totalOffset = offset + headerHeight;

    const elementPosition = element.offsetTop - totalOffset;

    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

/**
 * Set active navigation item
 */
function setActiveNavItem(href) {
    const navLinks = getElements('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        }
    });
}

/**
 * Get current navigation state
 */
function getNavigationState() {
    const navMenu = getElement('.nav-menu');
    const isMobileMenuOpen = navMenu ? navMenu.classList.contains('active') : false;
    const scrollTop = window.pageYOffset;
    const isScrolled = scrollTop > 50;

    return {
        isMobileMenuOpen,
        scrollTop,
        isScrolled
    };
}

// Export navigation functions for other modules
window.WebDevNexServNavigation = {
    smoothScrollTo,
    setActiveNavItem,
    getNavigationState
};