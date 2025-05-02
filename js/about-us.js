document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for arrow indicator
    document.querySelector('.scroll-indicator').addEventListener('click', function() {
        window.scrollTo({
            top: document.querySelector('.content').offsetTop - 50,
            behavior: 'smooth'
        });
    });

    // Intersection Observer for sections
    const sections = document.querySelectorAll('.section');
    const statsSection = document.querySelector('.stats-section');
    const statItems = document.querySelectorAll('.stat-item');
    const teamSection = document.querySelector('.team-section');
    const ctaSection = document.querySelector('.cta-section');

    // Observer for content sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Observer for stats section
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            // Animate stat items with delay
            statItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 200);
            });

            // Add number counter animation
            statItems.forEach(item => {
                const statValue = item.querySelector('.stat-value');
                const finalValue = parseInt(statValue.textContent);
                const duration = 2000;
                const startTime = Date.now();

                function updateCounter() {
                    const currentTime = Date.now();
                    const progress = Math.min((currentTime - startTime) / duration, 1);

                    let currentValue = Math.floor(progress * finalValue);
                    statValue.textContent = currentValue + (statValue.querySelector('.stat-symbol') ? statValue.querySelector('.stat-symbol').outerHTML : '');

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        statValue.innerHTML = finalValue + (statValue.querySelector('.stat-symbol') ? statValue.querySelector('.stat-symbol').outerHTML : '');
                    }
                }

                updateCounter();
            });

            statsObserver.unobserve(entries[0].target);
        }
    }, {
        threshold: 0.2
    });

    statsObserver.observe(statsSection);

    // Observer for team section
    const teamObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            teamSection.classList.add('visible');

            // Add sequential animation to team members
            const teamMembers = document.querySelectorAll('.team-member');
            teamMembers.forEach((member, index) => {
                member.style.opacity = '0';
                member.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    member.style.transition = 'all 0.8s ease';
                    member.style.opacity = '1';
                    member.style.transform = 'translateY(0)';
                }, index * 300);
            });

            teamObserver.unobserve(entries[0].target);
        }
    }, {
        threshold: 0.2
    });

    teamObserver.observe(teamSection);

    // Observer for CTA section
    const ctaObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            ctaSection.classList.add('visible');
            ctaObserver.unobserve(entries[0].target);
        }
    }, {
        threshold: 0.2
    });

    ctaObserver.observe(ctaSection);

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const heroImage = document.querySelector('.hero-image');
        heroImage.style.transform = `scale(1) translateY(${scrollPosition * 0.2}px)`;
    });

    // GSAP animations for more complex effects
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Parallax for section images
        document.querySelectorAll('.section-image-container').forEach(container => {
            gsap.to(container.querySelector('.section-image'), {
                y: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Text reveal animations
        gsap.utils.toArray('.section-text').forEach(text => {
            gsap.from(text.querySelector('h2'), {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: text,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });

            gsap.from(text.querySelectorAll('p'), {
                opacity: 0,
                y: 30,
                stagger: 0.2,
                duration: 0.8,
                scrollTrigger: {
                    trigger: text,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        });

        // Floating badges animation
        gsap.to('.footer-badge', {
            y: -10,
            duration: 2,
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            stagger: 0.5
        });
    }
});