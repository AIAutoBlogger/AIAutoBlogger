// Component loading functionality
async function loadComponent(componentPath, targetElementId) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            targetElement.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Load footer component when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load footer component
    loadComponent('components/footer.html', 'footer-container');
});
