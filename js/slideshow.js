document.addEventListener('DOMContentLoaded', function() {
    // Get all slides
    const slides = document.querySelectorAll('.slide');
    const slideNumber = document.querySelector('.slide-number');
    const timerProgress = document.querySelector('.timer-progress');

    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideInterval = 12000; // 12 seconds
    let slideTimer;

    // Initialize the first slide
    updateSlideIndicator();

    // Function to move to the next slide
    function nextSlide() {
        // Remove active class from current slide
        slides[currentSlide].classList.remove('active');

        // Add prev class to make it move left
        slides[currentSlide].classList.add('prev');

        // Calculate the index of the next slide
        currentSlide = (currentSlide + 1) % totalSlides;

        // Remove prev class from all other slides
        slides.forEach((slide, index) => {
            if (index !== (currentSlide - 1 + totalSlides) % totalSlides) {
                slide.classList.remove('prev');
            }
        });

        // Add active class to new current slide
        slides[currentSlide].classList.add('active');

        // Update the indicator
        updateSlideIndicator();

        // Restart the timer animation
        startTimerAnimation();
    }

    // Function to update the slide indicator text
    function updateSlideIndicator() {
        slideNumber.textContent = `${currentSlide + 1}/${totalSlides}`;
    }

    // Function to start/reset the timer animation
    function startTimerAnimation() {
        // Reset the animation
        let progress = 0;

        // Clear any existing interval
        if (slideTimer) {
            clearInterval(slideTimer);
        }

        // Update timer every 100ms
        slideTimer = setInterval(() => {
            progress += (100 / (slideInterval / 100));

            if (progress >= 100) {
                clearInterval(slideTimer);
                nextSlide();
            } else {
                timerProgress.style.background = `conic-gradient(#f44336 ${progress}%, transparent ${progress}%)`;
            }
        }, 100);
    }

    // Start the first timer
    startTimerAnimation();

    // Pause videos when they're not in the active slide
    function handleVideoPlayback() {
        slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (index === currentSlide) {
                video.play();
            } else {
                video.pause();
            }
        });
    }

    // Add event listener for when the slide changes
    slides.forEach(slide => {
        slide.addEventListener('transitionend', handleVideoPlayback);
    });

    // Initial video playback
    handleVideoPlayback();
});