document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const scheduleContents = document.querySelectorAll('.schedule-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            scheduleContents.forEach(content => content.classList.remove('active'));

            // Add active class to current tab
            button.classList.add('active');
            const day = button.getAttribute('data-day');
            document.getElementById(day).classList.add('active');
        });
    });

    // Optional: Function to refresh schedule data dynamically (for real-time updates)
    function refreshScheduleData() {
        fetch('/api/schedule')
            .then(response => response.json())
            .then(data => {
                console.log('Schedule data updated:', data);
                // You could implement dynamic updates here if needed
            })
            .catch(error => {
                console.error('Error fetching schedule data:', error);
            });
    }

    // Optional: Refresh data every 5 minutes for real-time updates
    // setInterval(refreshScheduleData, 300000); // 5 minutes
});