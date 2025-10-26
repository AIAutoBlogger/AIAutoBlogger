// Smooth scrolling and interactive features
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.step, .benefit-card, .app-screenshot');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Play button functionality with single video instance management
    const playButtons = document.querySelectorAll('.play-btn');
    const appScreenshot = document.querySelector('.app-screenshot');
    const YT_EMBED = 'https://www.youtube.com/embed/CBnukjX1skI?rel=0&autoplay=1&enablejsapi=1';
    let activeModal = null;
    let playButtonDisabled = false;

    function disablePlayButton() {
        const playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.style.opacity = '0.5';
            playBtn.style.pointerEvents = 'none';
            playButtonDisabled = true;
        }
    }

    function enablePlayButton() {
        const playBtn = document.querySelector('.play-btn');
        if (playBtn) {
            playBtn.style.opacity = '1';
            playBtn.style.pointerEvents = 'auto';
            playButtonDisabled = false;
        }
    }

    function openVideoModal(embedUrl) {
        if (activeModal || playButtonDisabled) return;
        
        // Build overlay
        const overlay = document.createElement('div');
        overlay.className = 'video-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(0,0,0,0.8)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '10000';

        const wrapper = document.createElement('div');
        wrapper.className = 'video-wrapper';
        wrapper.setAttribute('role', 'dialog');
        wrapper.setAttribute('aria-modal', 'true');
        wrapper.style.width = '90%';
        wrapper.style.maxWidth = '1100px';
        wrapper.style.height = '60vh';
        wrapper.style.position = 'relative';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'video-close';
        closeBtn.setAttribute('aria-label', 'Close video');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.position = 'absolute';
        closeBtn.style.right = '-12px';
        closeBtn.style.top = '-12px';
        closeBtn.style.background = '#fff';
        closeBtn.style.borderRadius = '50%';
        closeBtn.style.width = '36px';
        closeBtn.style.height = '36px';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.zIndex = '10001';

        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.borderRadius = '8px';

        wrapper.appendChild(closeBtn);
        wrapper.appendChild(iframe);
        overlay.appendChild(wrapper);
        document.body.appendChild(overlay);

        function close() {
            window.removeEventListener('keydown', onKey);
            overlay.remove();
            activeModal = null;
            // Re-enable play button after a short delay
            setTimeout(enablePlayButton, 300);
        }

        function onKey(e) {
            if (e.key === 'Escape') close();
        }

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) close();
        });
        closeBtn.addEventListener('click', close);
        window.addEventListener('keydown', onKey);
        
        // Disable play button while video is active
        disablePlayButton();
        
        // focus management
        closeBtn.focus();
        // Store reference to active modal
        activeModal = overlay;
    }

    // Single function to handle video opening
    function handleVideoClick(e) {
        if (playButtonDisabled || activeModal) return;
        
        e.preventDefault();
        e.stopPropagation();
        try {
            openVideoModal(YT_EMBED);
        } catch (err) {
            console.error('Error opening video modal:', err);
            enablePlayButton(); // Re-enable on error
        }
        if (typeof trackEvent === 'function') trackEvent('play_video', { source: 'how_to_use' });
    }

    // Attach handler to play button only
    const playButton = document.querySelector('.play-btn');
    if (playButton) {
        playButton.addEventListener('click', handleVideoClick);
    }

    // Subscribe button functionality
    const subscribeBtn = document.querySelector('.subscribe-btn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // TODO: Implement subscription modal; for now open a lightweight contact form or mailto as fallback
            window.location.href = 'mailto:hello@aiautoblogger.app?subject=Subscribe%20to%20AI%20Auto%20Blogger';
        });
    }

    // Shopify button functionality
    const shopifyBtn = document.querySelector('.shopify-btn');
    if (shopifyBtn) {
        shopifyBtn.addEventListener('click', function() {
            // Redirect to Shopify App Store
            window.open('https://apps.shopify.com/', '_blank');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Chart animation on scroll
    const chartContainer = document.querySelector('.chart-container');
    if (chartContainer) {
        const chartObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const chartLines = entry.target.querySelectorAll('.chart-line');
                    chartLines.forEach((line, index) => {
                        setTimeout(() => {
                            line.style.animation = 'chartGrow 2s ease-out';
                        }, index * 200);
                    });
                }
            });
        }, { threshold: 0.5 });
        
        chartObserver.observe(chartContainer);
    }

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Counter animation for metrics
    const metricNumber = document.querySelector('.metric-number');
    if (metricNumber) {
        const finalNumber = 67686;
        const duration = 2000;
        const increment = finalNumber / (duration / 16);
        let currentNumber = 0;
        
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        currentNumber += increment;
                        if (currentNumber >= finalNumber) {
                            currentNumber = finalNumber;
                            clearInterval(timer);
                        }
                        metricNumber.textContent = Math.floor(currentNumber).toLocaleString();
                    }, 16);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterObserver.observe(metricNumber);
    }

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.step, .benefit-card, .app-screenshot');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        el.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(function() {
        // Scroll-based animations and effects
    }, 16);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modals or menus
        }
    });

    // Add focus management for accessibility
    const focusableElements = document.querySelectorAll('button, a, input, textarea, select');
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-yellow)';
            this.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Add touch support for mobile devices
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            // Handle swipe gestures if needed
        }
    }

    // Add preload for critical images
    const criticalImages = [
        'images/Logo 1200px (1).svg',
        'images/phone-mockup.png',
        'images/shopify-badge.svg',
        'images/loop-2.png'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

    // Add service worker registration (for PWA features)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Add analytics tracking (placeholder)
    function trackEvent(eventName, eventData) {
        // Implement analytics tracking here
        console.log('Event tracked:', eventName, eventData);
    }

    // Track important user interactions
    document.querySelectorAll('.subscribe-btn, .shopify-btn, .play-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            trackEvent('button_click', {
                button: this.textContent || this.alt || 'unknown',
                section: this.closest('section')?.className || 'unknown'
            });
        });
    });

    // Add error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // Send error to analytics or error tracking service
    });

    // Add performance monitoring
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
        }
    });

});

// Add CSS for loading state
const style = document.createElement('style');
style.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--primary-blue);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body.loaded::before {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s ease-out;
    }

    .video-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }

    .video-wrapper {
        width: 90%;
        max-width: 1100px;
        height: 60vh;
        position: relative;
    }

    .video-close {
        position: absolute;
        right: -12px;
        top: -12px;
        background: #fff;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        border: none;
        cursor: pointer;
        z-index: 10001;
    }

    iframe {
        width: 100%;
        height: 100%;
        border-radius: 8px;
    }
`;
document.head.appendChild(style);
