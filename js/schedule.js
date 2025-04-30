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

    // Load schedule data from localStorage
    function loadScheduleData() {
        const scheduleData = JSON.parse(localStorage.getItem('gymSchedule')) || {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: []
        };

        displaySchedule(scheduleData);
    }

    // Display schedule in user-facing view
    function displaySchedule(scheduleData) {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        days.forEach(day => {
            const dayGrid = document.getElementById(`${day}-grid`);
            dayGrid.innerHTML = '';

            if (scheduleData[day].length === 0) {
                const noClasses = document.createElement('div');
                noClasses.className = 'no-classes';
                noClasses.textContent = 'No classes scheduled for this day';
                dayGrid.appendChild(noClasses);
                return;
            }

            scheduleData[day].forEach(classItem => {
                const classCard = document.createElement('div');
                classCard.className = 'class-card';

                classCard.innerHTML = `
            <h3 class="class-time">${classItem.formattedTime}</h3>
            <p class="class-name">${classItem.name}</p>
            <div class="class-coach">
              <svg class="coach-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>${classItem.coach}</span>
            </div>
          `;

                dayGrid.appendChild(classCard);
            });
        });
    }

    // Initial load
    loadScheduleData();
});