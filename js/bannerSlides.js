// This script ensures that text is always visible in the banner
document.addEventListener('DOMContentLoaded', function() {
    const bannerContent = document.querySelector('.banner-content');
    const bannerContainer = document.querySelector('.banner-container');

    // Calculate the width needed to fill the screen
    function adjustContent() {
        const containerWidth = bannerContainer.offsetWidth;
        const contentWidth = bannerContent.offsetWidth / 2; // Half because we duplicated the content

        // Ensure we always have enough content to fill the screen
        if (contentWidth < containerWidth * 3) {
            // Clone more content if needed
            const clone = bannerContent.cloneNode(true);
            bannerContainer.appendChild(clone);
        }
    }

    // Run once on load and whenever window resizes
    adjustContent();
    window.addEventListener('resize', adjustContent);
});