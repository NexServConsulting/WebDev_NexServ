/**
 * WebDev NexServ - Main JavaScript
 * Core functionality and utilities
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('WebDev NexServ - Application initialized');

    // Initialize global utilities
    initializeUtils();

    // Initialize smooth scrolling
    initializeSmoothScrolling();

    // Initialize form validation
    initializeFormValidation();

    // Initialize loading states
    initializeLoadingStates();

    // Initialize accessibility features
    initializeAccessibility();

    // Initialize performance optimizations
    initializePerformanceOptimizations();
}

/**
 * Initialize utility functions
 */
function initializeUtils() {
    // Debounce function for performance
    window.debounce = function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Throttle function for scroll events
    window.throttle = function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // Get element with error handling
    window.getElement = function(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (error) {
            console.error(`Error getting element: ${selector}`, error);
            return null;
        }
    };

    // Get elements with error handling
    window.getElements = function(selector, context = document) {
        try {
            return Array.from(context.querySelectorAll(selector));
        } catch (error) {
            console.error(`Error getting elements: ${selector}`, error);
            return [];
        }
    };

    // Check if element is in viewport
    window.isInViewport = function(element) {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    // Check if element is partially in viewport
    window.isPartiallyInViewport = function(element) {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
        const windowWidth = (window.innerWidth || document.documentElement.clientWidth);

        const vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
        const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

        return (vertInView && horInView);
    };

    // Format currency
    window.formatCurrency = function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    // Format date
    window.formatDate = function(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
    };

    // Generate unique ID
    window.generateId = function(prefix = 'id') {
        return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
    };

    // Copy to clipboard
    window.copyToClipboard = async function(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const result = document.execCommand('copy');
                textArea.remove();
                return result;
            }
        } catch (error) {
            console.error('Failed to copy text:', error);
            return false;
        }
    };

    // Show notification
    window.showNotification = function(message, type = 'info', duration = 5000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');

        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;

        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 400px;
                    padding: 16px;
                    background: #fff;
                    border: 2px solid #000;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .notification.show {
                    transform: translateX(0);
                }

                .notification-success {
                    border-color: #22C55E;
                }

                .notification-error {
                    border-color: #EF4444;
                }

                .notification-warning {
                    border-color: #F59E0B;
                }

                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }

                .notification-message {
                    flex: 1;
                    font-weight: 600;
                }

                .notification-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                @media (max-width: 480px) {
                    .notification {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to DOM
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Setup close button
        const closeBtn = notification.querySelector('.notification-close');
        const hideNotification = () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };

        closeBtn.addEventListener('click', hideNotification);

        // Auto-hide after duration
        if (duration > 0) {
            setTimeout(hideNotification, duration);
        }

        return notification;
    };

    // Validate email
    window.isValidEmail = function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validate phone (basic validation)
    window.isValidPhone = function(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    // Get URL parameters
    window.getUrlParams = function() {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    };

    // Set URL parameter
    window.setUrlParam = function(key, value) {
        const url = new URL(window.location);
        url.searchParams.set(key, value);
        window.history.replaceState({}, '', url);
    };

    // Remove URL parameter
    window.removeUrlParam = function(key) {
        const url = new URL(window.location);
        url.searchParams.delete(key);
        window.history.replaceState({}, '', url);
    };
}

/**
 * Initialize smooth scrolling
 */
function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = getElements('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const target = getElement(href);

            if (target) {
                e.preventDefault();

                // Calculate offset (account for fixed header)
                const header = getElement('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const offset = 20; // Extra padding

                const targetPosition = target.offsetTop - headerHeight - offset;

                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update focus for accessibility
                setTimeout(() => {
                    target.focus({
                        preventScroll: true
                    });
                }, 500);

                // Update URL without hash jump
                const url = new URL(window.location);
                url.hash = href;
                window.history.replaceState({}, '', url);
            }
        });
    });

    // Handle hash changes
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash;
        if (hash) {
            const target = getElement(hash);
            if (target) {
                const header = getElement('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const offset = 20;

                const targetPosition = target.offsetTop - headerHeight - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });

    // Handle initial hash on page load
    if (window.location.hash) {
        setTimeout(() => {
            const hash = window.location.hash;
            const target = getElement(hash);
            if (target) {
                const header = getElement('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const offset = 20;

                const targetPosition = target.offsetTop - headerHeight - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const forms = getElements('form[data-validate]');

    forms.forEach(form => {
        let isSubmitting = false;

        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (isSubmitting) return;

            // Reset previous errors
            clearFormErrors(form);

            // Validate form
            const isValid = validateForm(form);

            if (!isValid) {
                // Focus first error field
                const firstError = getElement('.form-error', form);
                if (firstError) {
                    firstError.focus();
                }
                return;
            }

            // Show loading state
            isSubmitting = true;
            showFormLoading(form);

            try {
                // Get form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Get submit action
                const action = form.getAttribute('action') || '#';
                const method = form.getAttribute('method') || 'POST';

                // Handle different form types
                if (form.id === 'consultation-form') {
                    await handleConsultationForm(data, form);
                } else if (form.id === 'quick-contact-form') {
                    await handleQuickContactForm(data, form);
                } else if (form.id === 'newsletter-form') {
                    await handleNewsletterForm(data, form);
                } else {
                    // Default form handling
                    await handleGenericForm(data, form, action, method);
                }

            } catch (error) {
                console.error('Form submission error:', error);
                showFormError(form, 'An error occurred. Please try again.');
            } finally {
                isSubmitting = false;
                hideFormLoading(form);
            }
        });

        // Real-time validation
        const requiredFields = getElements('[required]', form);
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(field);
            });

            field.addEventListener('input', function() {
                clearFieldError(field);
            });
        });
    });
}

/**
 * Validate a form
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = getElements('[required]', form);

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Custom validations
    const emailFields = getElements('input[type="email"]', form);
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });

    const phoneFields = getElements('input[type="tel"]', form);
    phoneFields.forEach(field => {
        if (field.value && !isValidPhone(field.value)) {
            showFieldError(field, 'Please enter a valid phone number');
            isValid = false;
        }
    });

    // Checkbox validations
    const requiredCheckboxes = getElements('input[type="checkbox"][required]', form);
    requiredCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            showFieldError(checkbox, 'This field is required');
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Validate a single field
 */
function validateField(field) {
    const value = field.value.trim();

    // Required validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }

    // Min length validation
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < parseInt(minLength)) {
        showFieldError(field, `Minimum ${minLength} characters required`);
        return false;
    }

    // Max length validation
    const maxLength = field.getAttribute('maxlength');
    if (maxLength && value.length > parseInt(maxLength)) {
        showFieldError(field, `Maximum ${maxLength} characters allowed`);
        return false;
    }

    // Pattern validation
    const pattern = field.getAttribute('pattern');
    if (pattern && value && !new RegExp(pattern).test(value)) {
        showFieldError(field, 'Please enter a valid format');
        return false;
    }

    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }

    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }

    return true;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    clearFieldError(field);

    field.classList.add('error');

    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.setAttribute('role', 'alert');
    errorElement.textContent = message;

    field.parentNode.appendChild(errorElement);
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    field.classList.remove('error');

    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Show form error
 */
function showFormError(form, message) {
    let errorContainer = form.querySelector('.form-error-container');

    if (!errorContainer) {
        errorContainer = document.createElement('div');
        errorContainer.className = 'form-error-container';
        form.insertBefore(errorContainer, form.firstChild);
    }

    errorContainer.innerHTML = `
        <div class="form-error" role="alert">
            ${message}
        </div>
    `;
}

/**
 * Clear form errors
 */
function clearFormErrors(form) {
    // Clear field errors
    const fieldErrors = getElements('.field-error', form);
    fieldErrors.forEach(error => error.remove());

    const errorFields = getElements('.error', form);
    errorFields.forEach(field => field.classList.remove('error'));

    // Clear form error
    const formErrorContainer = form.querySelector('.form-error-container');
    if (formErrorContainer) {
        formErrorContainer.remove();
    }
}

/**
 * Show form loading state
 */
function showFormLoading(form) {
    const submitButtons = getElements('button[type="submit"], input[type="submit"]', form);

    submitButtons.forEach(button => {
        button.disabled = true;
        button.classList.add('loading');

        const originalText = button.textContent;
        button.setAttribute('data-original-text', originalText);
        button.textContent = 'Sending...';

        // Add loading spinner if not present
        if (!button.querySelector('.loading-spinner')) {
            const spinner = document.createElement('span');
            spinner.className = 'loading-spinner';
            spinner.innerHTML = '⏳';
            button.insertBefore(spinner, button.firstChild);
        }
    });
}

/**
 * Hide form loading state
 */
function hideFormLoading(form) {
    const submitButtons = getElements('button[type="submit"], input[type="submit"]', form);

    submitButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove('loading');

        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
        }

        // Remove loading spinner
        const spinner = button.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    });
}

/**
 * Handle consultation form
 */
async function handleConsultationForm(data, form) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show success message
    showNotification('Consultation request submitted successfully! We\'ll contact you within 24 hours.', 'success');

    // Reset form
    form.reset();

    // Reset to first step
    const steps = getElements('.form-step', form);
    steps.forEach((step, index) => {
        step.classList.toggle('active', index === 0);
    });

    updateProgressBar(0);

    // Track conversion (would integrate with analytics)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', {
            event_category: 'consultation',
            event_label: 'form_submission'
        });
    }
}

/**
 * Handle quick contact form
 */
async function handleQuickContactForm(data, form) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
    form.reset();
}

/**
 * Handle newsletter form
 */
async function handleNewsletterForm(data, form) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    showNotification('Successfully subscribed to our newsletter!', 'success');
    form.reset();
}

/**
 * Handle generic form
 */
async function handleGenericForm(data, form, action, method) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    showNotification('Form submitted successfully!', 'success');
}

/**
 * Initialize loading states
 */
function initializeLoadingStates() {
    // Add loading styles if not present
    if (!document.querySelector('#loading-styles')) {
        const styles = document.createElement('style');
        styles.id = 'loading-styles';
        styles.textContent = `
            .form-error {
                background: #FEE2E2;
                color: #DC2626;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 16px;
                border: 1px solid #FCA5A5;
            }

            .field-error {
                color: #DC2626;
                font-size: 14px;
                margin-top: 4px;
                display: block;
            }

            .error {
                border-color: #DC2626 !important;
            }

            .loading {
                opacity: 0.7;
                cursor: not-allowed;
            }

            .loading-spinner {
                display: inline-block;
                margin-right: 8px;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styles);
    }
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add skip link styles
    if (!document.querySelector('#skip-link-styles')) {
        const styles = document.createElement('style');
        styles.id = 'skip-link-styles';
        styles.textContent = `
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: #000;
                color: #fff;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
            }

            .skip-link:focus {
                top: 6px;
            }
        `;
        document.head.appendChild(styles);
    }

    // Add ARIA labels for dynamic content
    initializeAriaLabels();

    // Keyboard navigation improvements
    initializeKeyboardNavigation();
}

/**
 * Initialize ARIA labels
 */
function initializeAriaLabels() {
    // Add aria-label to external links
    const externalLinks = getElements('a[href^="http"]');
    externalLinks.forEach(link => {
        if (!link.getAttribute('aria-label')) {
            link.setAttribute('aria-label', `${link.textContent} (opens in new tab)`);
        }
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
    // Handle tab trapping in modals
    const modals = getElements('.modal');

    modals.forEach(modal => {
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal(modal);
            }

            if (e.key === 'Tab') {
                const focusableElements = getElements(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                    modal
                );

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    });
}

/**
 * Initialize performance optimizations
 */
function initializePerformanceOptimizations() {
    // Lazy load images
    initializeLazyLoading();

    // Optimize scroll performance
    initializeScrollOptimization();

    // Preload critical resources
    initializeResourcePreloading();
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
    const images = getElements('img[data-src]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

/**
 * Initialize scroll optimization
 */
function initializeScrollOptimization() {
    let ticking = false;

    function updateScrollPosition() {
        // Update scroll-based animations
        requestScrollUpdates();
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Request scroll updates
 */
function requestScrollUpdates() {
    // This function will be called by individual modules
    // that need to respond to scroll events
    document.dispatchEvent(new CustomEvent('scrollUpdate'));
}

/**
 * Initialize resource preloading
 */
function initializeResourcePreloading() {
    // Preload critical fonts
    const fontLinks = getElements('link[rel="preconnect"]');

    // Preload above-the-fold images
    const heroImages = getElements('.hero-image img');
    heroImages.forEach(img => {
        if (img.dataset.src) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = img.dataset.src;
            document.head.appendChild(preloadLink);
        }
    });
}

/**
 * Close modal
 */
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Focus back to trigger element
    const triggerElement = document.querySelector('[data-modal-target]');
    if (triggerElement) {
        triggerElement.focus();
    }
}

// Export functions for other modules
window.WebDevNexServ = {
    debounce,
    throttle,
    getElement,
    getElements,
    isInViewport,
    isPartiallyInViewport,
    formatCurrency,
    formatDate,
    generateId,
    copyToClipboard,
    showNotification,
    isValidEmail,
    isValidPhone,
    getUrlParams,
    setUrlParam,
    removeUrlParam,
    validateField,
    showFieldError,
    clearFieldError,
    showFormError,
    clearFormErrors,
    closeModal
};