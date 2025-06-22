AOS.init({
    duration: 1200,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            navMenu.style.transition = 'transform 0.3s ease-in-out';
        });
    }

    // Scroll to top button
    let topButton = document.getElementById("topBtn");
    let scrollThrottleTimer;

    window.onscroll = function () {
        if (scrollThrottleTimer) return;

        scrollThrottleTimer = setTimeout(() => {
            if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
                requestAnimationFrame(() => {
                    topButton.style.display = "block";
                    topButton.classList.add('fade-in');
                    topButton.classList.remove('fade-out');
                });
            } else {
                requestAnimationFrame(() => {
                    topButton.classList.remove('fade-in');
                    topButton.classList.add('fade-out');
                    setTimeout(() => {
                        if (document.body.scrollTop <= 300 && document.documentElement.scrollTop <= 300) {
                            topButton.style.display = "none";
                            topButton.classList.remove('fade-out');
                        }
                    }, 300);
                });
            }
            scrollThrottleTimer = null;
        }, 100);
    };

    if (topButton) {
        topButton.addEventListener("click", topFunction);
    }

    function topFunction() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    if (topButton) {
        topButton.addEventListener("click", topFunction);
    }
});
