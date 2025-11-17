/**
 * WebDev NexServ - Animations JavaScript
 * Scroll animations, intersections, and visual effects
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
});

/**
 * Initialize all animation systems
 */
function initializeAnimations() {
    console.log('Animations initialized');

    // Initialize intersection observers
    initializeIntersectionObservers();

    // Initialize scroll animations
    initializeScrollAnimations();

    // Initialize hover effects
    initializeHoverEffects();

    // Initialize loading animations
    initializeLoadingAnimations();

    // Initialize counter animations
    initializeCounterAnimations();

    // Initialize typing effects
    initializeTypingEffects();

    // Initialize background animations
    initializeBackgroundAnimations();
}

/**
 * Initialize intersection observers for scroll-triggered animations
 */
function initializeIntersectionObservers() {
    // Observer for fade-in animations
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.fadeDelay || 0;

                setTimeout(() => {
                    element.classList.add('fade-in');
                    fadeObserver.unobserve(element);
                }, delay);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    // Observer for slide-in animations
    const slideObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.slideDelay || 0;
                const direction = element.dataset.slideDirection || 'up';

                setTimeout(() => {
                    element.classList.add(`slide-in-${direction}`);
                    slideObserver.unobserve(element);
                }, delay);
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    });

    // Observer for scale animations
    const scaleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.scaleDelay || 0;

                setTimeout(() => {
                    element.classList.add('scale-in');
                    scaleObserver.unobserve(element);
                }, delay);
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    // Apply observers to elements
    const fadeElements = getElements('[data-fade]');
    fadeElements.forEach(element => fadeObserver.observe(element));

    const slideElements = getElements('[data-slide]');
    slideElements.forEach(element => slideObserver.observe(element));

    const scaleElements = getElements('[data-scale]');
    scaleElements.forEach(element => scaleObserver.observe(element));

    // Add animation styles
    addAnimationStyles();
}

/**
 * Add CSS animation styles
 */
function addAnimationStyles() {
    if (document.querySelector('#animation-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'animation-styles';
    styles.textContent = `
        /* Fade animations */
        [data-fade] {
            opacity: 0;
            transition: opacity 0.6s ease;
        }

        [data-fade].fade-in {
            opacity: 1;
        }

        /* Slide animations */
        [data-slide] {
            opacity: 0;
            transition: all 0.6s ease;
        }

        [data-slide].slide-in-up {
            opacity: 1;
            transform: translateY(0);
        }

        [data-slide].slide-in-down {
            opacity: 1;
            transform: translateY(0);
        }

        [data-slide].slide-in-left {
            opacity: 1;
            transform: translateX(0);
        }

        [data-slide].slide-in-right {
            opacity: 1;
            transform: translateX(0);
        }

        /* Initial positions for slide animations */
        [data-slide][data-slide-direction="up"]:not(.slide-in-up) {
            transform: translateY(30px);
        }

        [data-slide][data-slide-direction="down"]:not(.slide-in-down) {
            transform: translateY(-30px);
        }

        [data-slide][data-slide-direction="left"]:not(.slide-in-left) {
            transform: translateX(-30px);
        }

        [data-slide][data-slide-direction="right"]:not(.slide-in-right) {
            transform: translateX(30px);
        }

        /* Scale animations */
        [data-scale] {
            opacity: 0;
            transform: scale(0.9);
            transition: all 0.6s ease;
        }

        [data-scale].scale-in {
            opacity: 1;
            transform: scale(1);
        }

        /* Stagger animations */
        .stagger-item {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s ease;
        }

        .stagger-item.animate {
            opacity: 1;
            transform: translateY(0);
        }

        .stagger-item:nth-child(1) { transition-delay: 0ms; }
        .stagger-item:nth-child(2) { transition-delay: 100ms; }
        .stagger-item:nth-child(3) { transition-delay: 200ms; }
        .stagger-item:nth-child(4) { transition-delay: 300ms; }
        .stagger-item:nth-child(5) { transition-delay: 400ms; }
        .stagger-item:nth-child(6) { transition-delay: 500ms; }
        .stagger-item:nth-child(7) { transition-delay: 600ms; }
        .stagger-item:nth-child(8) { transition-delay: 700ms; }

        /* Loading skeleton */
        @keyframes skeleton-loading {
            0% {
                background-position: -200px 0;
            }
            100% {
                background-position: calc(200px + 100%) 0;
            }
        }

        .skeleton {
            background: linear-gradient(
                90deg,
                #f0f0f0 0px,
                #f8f8f8 40px,
                #f0f0f0 80px
            );
            background-size: 200px 100%;
            animation: skeleton-loading 1.5s ease-in-out infinite;
        }

        /* Counter animation */
        .counter {
            display: inline-block;
        }

        /* Pulse animation */
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.7;
            }
        }

        .pulse {
            animation: pulse 2s infinite;
        }

        /* Bounce animation */
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }

        .bounce {
            animation: bounce 1s infinite;
        }

        /* Shake animation */
        @keyframes shake {
            0%, 100% {
                transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
                transform: translateX(-2px);
            }
            20%, 40%, 60%, 80% {
                transform: translateX(2px);
            }
        }

        .shake {
            animation: shake 0.5s;
        }

        /* Rotate animation */
        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .rotate {
            animation: rotate 2s linear infinite;
        }

        /* Floating animation */
        @keyframes float {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }

        .float {
            animation: float 3s ease-in-out infinite;
        }

        /* Gradient animation */
        @keyframes gradient-shift {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }

        .gradient-animation {
            background: linear-gradient(270deg, #000, #333, #666);
            background-size: 600% 600%;
            animation: gradient-shift 10s ease infinite;
        }

        /* Typing animation */
        .typing-cursor {
            display: inline-block;
            width: 2px;
            height: 1.2em;
            background: currentColor;
            animation: blink 1s infinite;
        }

        @keyframes blink {
            0%, 50% {
                opacity: 1;
            }
            51%, 100% {
                opacity: 0;
            }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }

            .skeleton {
                animation: none;
                background: #f0f0f0;
            }
        }
    `;
    document.head.appendChild(styles);
}

/**
 * Initialize scroll-based animations
 */
function initializeScrollAnimations() {
    // Parallax effects
    initializeParallaxEffects();

    // Progress indicators
    initializeProgressIndicators();

    // Scroll-triggered counters
    initializeScrollCounters();
}

/**
 * Initialize parallax effects
 */
function initializeParallaxEffects() {
    const parallaxElements = getElements('[data-parallax]');

    if (parallaxElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const speed = element.dataset.parallaxSpeed || 0.5;
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
 * Initialize progress indicators
 */
function initializeProgressIndicators() {
    const progressBars = getElements('[data-progress]');

    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = element.dataset.progress;
                const duration = element.dataset.progressDuration || 2000;

                animateProgress(element, target, duration);
                progressObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });

    progressBars.forEach(element => progressObserver.observe(element));
}

/**
 * Animate progress bar
 */
function animateProgress(element, target, duration) {
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = easeOutQuad(progress * start, 0, target - start, 1);
        element.style.width = `${current}%`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

/**
 * Initialize scroll-triggered counters
 */
function initializeScrollCounters() {
    const counters = getElements('[data-counter]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const target = parseInt(element.dataset.counter);
                const duration = element.dataset.counterDuration || 2000;
                const prefix = element.dataset.counterPrefix || '';
                const suffix = element.dataset.counterSuffix || '';

                animateCounter(element, target, duration, prefix, suffix);
                counterObserver.unobserve(element);
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(element => counterObserver.observe(element));
}

/**
 * Animate counter
 */
function animateCounter(element, target, duration, prefix, suffix) {
    const start = 0;
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const current = Math.floor(easeOutQuad(progress * start, 0, target - start, 1));
        element.textContent = `${prefix}${current}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

/**
 * Initialize hover effects
 */
function initializeHoverEffects() {
    // Card hover effects
    initializeCardHoverEffects();

    // Button hover effects
    initializeButtonHoverEffects();

    // Image hover effects
    initializeImageHoverEffects();
}

/**
 * Initialize card hover effects
 */
function initializeCardHoverEffects() {
    const cards = getElements('.service-card, .portfolio-item, .testimonial-card, .value-card, .package, .team-member');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
    });
}

/**
 * Initialize button hover effects
 */
function initializeButtonHoverEffects() {
    const buttons = getElements('.btn');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Initialize image hover effects
 */
function initializeImageHoverEffects() {
    const images = getElements('.portfolio-image, .member-photo, .case-study-image');

    images.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });

        container.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

/**
 * Initialize loading animations
 */
function initializeLoadingAnimations() {
    // Page load animation
    animatePageLoad();

    // Image loading animations
    animateImageLoading();
}

/**
 * Animate page load
 */
function animatePageLoad() {
    const body = document.body;
    body.style.opacity = '0';
    body.style.transform = 'translateY(20px)';

    setTimeout(() => {
        body.style.transition = 'all 0.6s ease';
        body.style.opacity = '1';
        body.style.transform = 'translateY(0)';
    }, 100);
}

/**
 * Animate image loading
 */
function animateImageLoading() {
    const images = getElements('img[data-src]');

    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transform = 'scale(1.1)';

            setTimeout(() => {
                this.style.transition = 'all 0.4s ease';
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

/**
 * Initialize counter animations
 */
function initializeCounterAnimations() {
    // This is handled by scroll counters above
    // Keeping this for future expansion
}

/**
 * Initialize typing effects
 */
function initializeTypingEffects() {
    const typingElements = getElements('[data-typing]');

    typingElements.forEach(element => {
        const text = element.dataset.typing;
        const speed = element.dataset.typingSpeed || 100;
        const delay = element.dataset.typingDelay || 0;

        setTimeout(() => {
            typeText(element, text, speed);
        }, delay);
    });
}

/**
 * Type text animation
 */
function typeText(element, text, speed) {
    let index = 0;
    const originalText = element.textContent;

    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        } else {
            // Add cursor
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            element.appendChild(cursor);

            // Remove cursor after a delay
            setTimeout(() => {
                if (cursor.parentNode) {
                    cursor.parentNode.removeChild(cursor);
                }
            }, 2000);
        }
    }

    type();
}

/**
 * Initialize background animations
 */
function initializeBackgroundAnimations() {
    // Floating elements
    initializeFloatingElements();

    // Gradient backgrounds
    initializeGradientBackgrounds();

    // Particle effects (if needed)
    initializeParticleEffects();
}

/**
 * Initialize floating elements
 */
function initializeFloatingElements() {
    const floatingElements = getElements('[data-float]');

    floatingElements.forEach(element => {
        element.classList.add('float');

        // Randomize animation delay
        const delay = Math.random() * 3;
        element.style.animationDelay = `${delay}s`;
    });
}

/**
 * Initialize gradient backgrounds
 */
function initializeGradientBackgrounds() {
    const gradientElements = getElements('[data-gradient]');

    gradientElements.forEach(element => {
        element.classList.add('gradient-animation');
    });
}

/**
 * Initialize particle effects
 */
function initializeParticleEffects() {
    // Simple particle system for hero sections
    const hero = getElement('.hero');
    if (!hero) return;

    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
    `;

    // Create particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${10 + Math.random() * 20}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
        `;

        particleContainer.appendChild(particle);
    }

    hero.appendChild(particleContainer);
}

/**
 * Initialize stagger animations for grids
 */
function initializeStaggerAnimations() {
    const grids = getElements('[data-stagger]');

    grids.forEach(grid => {
        const items = grid.children;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        observer.observe(grid);
    });
}

/**
 * Ease out quad easing function
 */
function easeOutQuad(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
}

/**
 * Add stagger animation to elements
 */
function addStaggerAnimation(elements, delay = 100) {
    Array.from(elements).forEach((element, index) => {
        element.classList.add('stagger-item');
        element.style.animationDelay = `${index * delay}ms`;
    });
}

/**
 * Trigger animation manually
 */
function triggerAnimation(element, animation, delay = 0) {
    setTimeout(() => {
        element.classList.add(animation);

        // Remove animation class after completion
        const animationDuration = getAnimationDuration(element);
        setTimeout(() => {
            element.classList.remove(animation);
        }, animationDuration);
    }, delay);
}

/**
 * Get animation duration from computed styles
 */
function getAnimationDuration(element) {
    const styles = window.getComputedStyle(element);
    const duration = styles.animationDuration;
    return parseFloat(duration) * 1000; // Convert to milliseconds
}

// Export animation functions for other modules
window.WebDevNexServAnimations = {
    addStaggerAnimation,
    triggerAnimation,
    animateProgress,
    animateCounter,
    typeText,
    easeOutQuad
};