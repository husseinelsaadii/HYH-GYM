// AOS initialization
AOS.init({duration: 1000, once: true, offset: 100});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const setupMobileMenu = () => {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (!hamburger) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    };

    // Counter Animation
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const increment = target / speed;

            const updateCount = () => {
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.min(Math.ceil(count), target);
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
        });
    };

    // Intersection Observer for counters
    const setupCounterObserver = () => {
        const statsSection = document.querySelector('.benefits-stats');
        if (!statsSection) return;

        const observer = new IntersectionObserver(
            entries => entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            }),
            {threshold: 0.5}
        );

        observer.observe(statsSection);
    };

    // Testimonial Slider
    const setupTestimonialSlider = () => {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        let currentSlide = 0;

        const showSlide = index => {
            slides.forEach(slide => slide.classList.remove('active-slide'));
            dots.forEach(dot => dot.classList.remove('active'));
            slides[index].classList.add('active-slide');
            dots[index].classList.add('active');
            currentSlide = index;
        };

        if (prevBtn && nextBtn) {
            nextBtn.addEventListener('click', () =>
                showSlide((currentSlide + 1) % slides.length));

            prevBtn.addEventListener('click', () =>
                showSlide((currentSlide - 1 + slides.length) % slides.length));

            dots.forEach((dot, index) =>
                dot.addEventListener('click', () => showSlide(index)));

            setInterval(() =>
                showSlide((currentSlide + 1) % slides.length), 5000);
        }
    };

    setupMobileMenu();
    setupCounterObserver();
    setupTestimonialSlider();
});

// Scroll controls
const topFunction = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};

const handleScrollButton = () => {
    const topButton = document.getElementById("topBtn");
    const scrolled = document.body.scrollTop > 300 || document.documentElement.scrollTop > 300;

    if (scrolled) {
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

window.onscroll = handleScrollButton;

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    const heroElements = [
        {selector: ".hero-title", y: 50, delay: 0.3},
        {selector: ".hero-subtitle", y: 30, delay: 0.6},
        {selector: ".hero-description", y: 30, delay: 0.9},
        {selector: ".hero-buttons", y: 30, delay: 1.2}
    ];

    heroElements.forEach(({selector, y, delay}) => {
        gsap.from(selector, {
            duration: 1.2,
            y,
            opacity: 0,
            ease: "power3.out",
            delay
        });
    });

    gsap.registerPlugin(ScrollTrigger);

    // Section animations
    const setupScrollAnimations = (elements, config) => {
        gsap.utils.toArray(elements).forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                ...config
            });
        });
    };

    setupScrollAnimations(".section-title", {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: "power3.out"
    });

    setupScrollAnimations(".title-bar", {
        duration: 1.2,
        width: 0,
        ease: "power3.inOut",
        delay: 0.3
    });

    // Parallax effect
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