// Component loading functionality
async function loadComponent(componentPath, targetElementId, onLoad) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.innerHTML = html;
            if (typeof onLoad === 'function') {
                try { onLoad(); } catch (e) { console.error('onLoad error', e); }
            }
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load footer component when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer components (root-relative paths)
    loadComponent('/components/header.html', 'header-container', function initHeader() {
        const navToggle = document.querySelector('.nav-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        if (navToggle && mobileMenu) {
            navToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                const isOpen = mobileMenu.style.display === 'block';
                mobileMenu.style.display = isOpen ? 'none' : 'block';
                navToggle.setAttribute('aria-expanded', String(!isOpen));
            });
            document.addEventListener('click', function(e) {
                if (!mobileMenu.contains(e.target) && !navToggle.contains(e.target)) {
                    mobileMenu.style.display = 'none';
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
            // Close on ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    mobileMenu.style.display = 'none';
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
    loadComponent('/components/footer.html', 'footer-container');
});
