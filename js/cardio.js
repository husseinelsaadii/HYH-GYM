AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Scroll to top button
    let topButton = document.getElementById("topBtn");
    window.onscroll = function() {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            topButton.style.display = "block";
            topButton.classList.add('fade-in');
        } else {
            topButton.classList.remove('fade-in');
            topButton.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.scrollTop <= 300 && document.documentElement.scrollTop <= 300) {
                    topButton.style.display = "none";
                    topButton.classList.remove('fade-out');
                }
            }, 300);
        }
    };

    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    if (topButton) {
        topButton.addEventListener("click", topFunction);
    }
});
