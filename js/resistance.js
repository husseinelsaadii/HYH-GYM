// AOS initialization
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

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const increment = target / speed;

            function updateCount() {
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.min(Math.ceil(count), target);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            }

            updateCount();
        });
    }

    // Intersection Observer for counters
    const statsSection = document.querySelector('.benefits-stats');

    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // Testimonial Slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active-slide'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active-slide');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    if (prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        });

        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });

        // Auto-rotate slides
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000);
    }
});

// Scroll to top function
function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Show/hide scroll to top button
window.onscroll = function() {
    let topButton = document.getElementById("topBtn");
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

// GSAP Animations
document.addEventListener('DOMContentLoaded', function() {
    // Hero animations
    gsap.from(".hero-title", {
        duration: 1.2,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.3
    });

    gsap.from(".hero-subtitle", {
        duration: 1.2,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 0.6
    });

    gsap.from(".hero-description", {
        duration: 1.2,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 0.9
    });

    gsap.from(".hero-buttons", {
        duration: 1.2,
        y: 30,
        opacity: 0,
        ease: "power3.out",
        delay: 1.2
    });

    // Scroll animations
    gsap.registerPlugin(ScrollTrigger);

    // Section title animations
    gsap.utils.toArray(".section-title").forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            duration: 1,
            y: 30,
            opacity: 0,
            ease: "power3.out"
        });
    });

    // Title bar animations
    gsap.utils.toArray(".title-bar").forEach(bar => {
        gsap.from(bar, {
            scrollTrigger: {
                trigger: bar,
                start: "top 80%",
                toggleActions: "play none none none"
            },
            duration: 1.2,
            width: 0,
            ease: "power3.inOut",
            delay: 0.3
        });
    });

    // Parallax effect for CTA section
    gsap.to(".cta-background", {
        scrollTrigger: {
            trigger: ".cta-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        },
        y: -100,
        ease: "none"
    });
});