// Fixed Workout Calendar JavaScript

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Month names
const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Initialize calendar on page load
document.addEventListener('DOMContentLoaded', function() {
    generateCalendar(currentMonth, currentYear);
});

// Generate calendar for given month and year - FIXED
function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
    
    const calendarDays = document.getElementById('calendar-days');
    calendarDays.innerHTML = '';

    const totalCells = 42;
    let cells = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        cells.push(createDayElement(daysInPrevMonth - i, true, month - 1, year));
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push(createDayElement(day, false, month, year));
    }

    // Fill next month days
    let remaining = totalCells - cells.length;
    for (let day = 1; day <= remaining; day++) {
        cells.push(createDayElement(day, true, month + 1, year));
    }

    // Group into weeks
    for (let i = 0; i < cells.length; i += 7) {
        const weekRow = document.createElement('div');
        weekRow.classList.add('calendar-week');
        for (let j = 0; j < 7; j++) {
            weekRow.appendChild(cells[i + j]);
        }
        calendarDays.appendChild(weekRow);
    }
}

// Create individual day element - FIXED
function createDayElement(day, isOtherMonth, month, year) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;
    
    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }
    
    // Create date string for comparison (format: YYYY-MM-DD)
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Get today's date string
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Check if this is today (only for current month days)
    if (dateString === todayString && !isOtherMonth) {
        dayElement.classList.add('today');
    }
    
    // Check if workout completed on this day
    if (window.workoutData && window.workoutData.includes(dateString)) {
        dayElement.classList.add('completed');
    }
    
    return dayElement;
}

// Change month function
function changeMonth(direction) {
    currentMonth += direction;
    
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    } else if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    
    generateCalendar(currentMonth, currentYear);
}

// Add some motivational messages
const motivationalMessages = [
    "Every workout counts! 💪",
    "You're building a stronger you! 🔥",
    "Consistency is key! 🚀",
    "Your future self will thank you! ⭐",
    "One day at a time! 🌟",
    "Progress, not perfection! 🎯",
    "You've got this! 💯",
    "Building healthy habits! 🌱"
];

// Display random motivational message
function showMotivation() {
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #50C878, #228B22);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        font-weight: bold;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.textContent = randomMessage;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Show motivation when workout is completed
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form[action*="mark_workout"]');
    if (form) {
        form.addEventListener('submit', function() {
            setTimeout(showMotivation, 500);
        });
    }
});