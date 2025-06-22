document.addEventListener('DOMContentLoaded', function() {
    // Toggle between monthly and annual plans
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            toggleBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Hide all plan containers
            document.querySelectorAll('.plan-container').forEach(container => {
                container.classList.remove('active');
            });

            // Show the target container
            const targetContainer = document.getElementById(this.dataset.target + '-plans');
            if (targetContainer) {
                targetContainer.classList.add('active');
            }
        });
    });

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            // Toggle active class on the clicked item
            item.classList.toggle('active');

            // Update the toggle icon
            const toggleIcon = this.querySelector('.toggle-icon');
            if (item.classList.contains('active')) {
                toggleIcon.textContent = '−';
            } else {
                toggleIcon.textContent = '+';
            }
        });
    });
});