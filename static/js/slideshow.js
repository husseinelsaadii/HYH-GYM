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
        // hide current slide when time limit end
        slides[currentSlide].classList.remove('active');

        // Make the current slide as the previous one
        slides[currentSlide].classList.add('prev');

        // Changing the current to the next one, using modulo to stay in the range
        currentSlide = (currentSlide + 1) % totalSlides;

        // if another slide is prev, we should remove it and keep only one previous slide
        slides.forEach((slide, index) => {
            if (index !== (currentSlide - 1 + totalSlides) % totalSlides) {
                slide.classList.remove('prev');
            }
        });

        // Activate the new current slide which make it appear in CSS
        slides[currentSlide].classList.add('active');

        // Update the indicator
        updateSlideIndicator();

        // Restart the timer animation
        startTimerAnimation();
    }

    // This function for changing the slide indicator when needed (1/3 -> 2/3 -> 3/3) and then repeat
    function updateSlideIndicator() {
        slideNumber.textContent = `${currentSlide + 1}/${totalSlides}`;
    }

    // Function to start/reset the timer animation
    function startTimerAnimation() {
        // Reset the animation
        let progress = 0;

        // Clear any existing interval, to not override them
        if (slideTimer) {
            clearInterval(slideTimer);
        }

        // Update timer every 100ms
        slideTimer = setInterval(() => {
            progress += (100 / (slideInterval / 100)); // gives the right percentage until reach the full time

            // when time limit end, it clear it and then restart a new one with new slide
            if (progress >= 100) {
                clearInterval(slideTimer);
                nextSlide();
            } else { // else continue and changing the background of the circle to make it well responsive
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