document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const classForm = document.getElementById('classForm');
    const daySelect = document.getElementById('day');
    const timeInput = document.getElementById('time');
    const classNameInput = document.getElementById('className');
    const coachInput = document.getElementById('coach');
    const submitBtn = document.getElementById('submitBtn');
    const clearBtn = document.getElementById('clearBtn');
    const editIndex = document.getElementById('editIndex');
    const editDay = document.getElementById('editDay');
    const scheduleDisplay = document.getElementById('scheduleDisplay');
    const notification = document.getElementById('notification');

    let currentEditId = null;

    // Display notification
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Format time from 24h to 12h format
    function formatTime(time) {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
    }

    // Load and display schedule
    async function loadSchedule() {
        try {
            const response = await fetch('/api/schedule');
            const scheduleData = await response.json();
            displaySchedule(scheduleData);
        } catch (error) {
            console.error('Error loading schedule:', error);
            showNotification('Error loading schedule', 'error');
        }
    }

    // Add or update a class
    async function handleFormSubmit(e) {
        e.preventDefault();

        const day = daySelect.value;
        const time = timeInput.value;
        const className = classNameInput.value;
        const coach = coachInput.value;

        if (!day || !time || !className || !coach) {
            showNotification('Please fill all fields', 'error');
            return;
        }

        const classData = {
            day: day,
            time: time,
            class_name: className,
            coach: coach
        };

        try {
            let response;
            if (currentEditId) {
                // Update existing class
                response = await fetch(`/api/schedule/${currentEditId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(classData)
                });
            } else {
                // Add new class
                response = await fetch('/api/schedule', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(classData)
                });
            }

            const result = await response.json();

            if (result.success) {
                showNotification(result.message, 'success');
                clearEditMode();
                classForm.reset();
                loadSchedule(); // Reload the schedule
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error saving class:', error);
            showNotification('Error saving class', 'error');
        }
    }

    // Clear edit mode
    function clearEditMode() {
        currentEditId = null;
        editIndex.value = '';
        editDay.value = '';
        submitBtn.textContent = 'Add Class';
        clearBtn.style.display = 'none';
        classForm.reset();
    }

    // Set form to edit mode
    function editClass(classData) {
        daySelect.value = classData.day;
        timeInput.value = classData.time;
        classNameInput.value = classData.class_name;
        coachInput.value = classData.coach;
        
        currentEditId = classData.id;
        submitBtn.textContent = 'Update Class';
        clearBtn.style.display = 'inline-block';

        // Scroll to form
        document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
    }

    // Delete a class
    async function deleteClass(classId, className) {
        if (confirm(`Are you sure you want to delete the class "${className}"?`)) {
            try {
                const response = await fetch(`/api/schedule/${classId}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    showNotification(result.message, 'success');
                    loadSchedule(); // Reload the schedule
                } else {
                    showNotification(result.message, 'error');
                }
            } catch (error) {
                console.error('Error deleting class:', error);
                showNotification('Error deleting class', 'error');
            }
        }
    }

    // Display schedule in admin view
    function displaySchedule(scheduleData) {
        scheduleDisplay.innerHTML = '';

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        days.forEach(day => {
            const daySection = document.createElement('div');
            daySection.className = 'day-section';

            const dayTitle = document.createElement('h3');
            dayTitle.textContent = day.charAt(0).toUpperCase() + day.slice(1);
            dayTitle.className = 'upper';
            daySection.appendChild(dayTitle);

            if (!scheduleData[day] || scheduleData[day].length === 0) {
                const noClasses = document.createElement('p');
                noClasses.textContent = 'No classes scheduled';
                noClasses.className = 'lower';
                daySection.appendChild(noClasses);
            } else {
                const table = document.createElement('table');
                table.className = 'schedule-table';

                // Table header
                const thead = document.createElement('thead');
                thead.innerHTML = `
                  <tr>
                    <th>Time</th>
                    <th>Class</th>
                    <th>Coach</th>
                    <th>Actions</th>
                  </tr>
                `;
                table.appendChild(thead);

                // Table body
                const tbody = document.createElement('tbody');

                scheduleData[day].forEach((classItem) => {
                    const row = document.createElement('tr');

                    const timeCell = document.createElement('td');
                    timeCell.textContent = classItem.formatted_time;
                    row.appendChild(timeCell);

                    const classNameCell = document.createElement('td');
                    classNameCell.textContent = classItem.class_name;
                    row.appendChild(classNameCell);

                    const coachCell = document.createElement('td');
                    coachCell.textContent = classItem.coach;
                    row.appendChild(coachCell);

                    const actionsCell = document.createElement('td');
                    actionsCell.className = 'action-btns';

                    const editBtn = document.createElement('button');
                    editBtn.className = 'action-btn edit-btn';
                    editBtn.innerHTML = 'Edit';
                    editBtn.onclick = () => editClass(classItem);
                    actionsCell.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'action-btn delete-btn';
                    deleteBtn.innerHTML = 'Delete';
                    deleteBtn.onclick = () => deleteClass(classItem.id, classItem.class_name);
                    actionsCell.appendChild(deleteBtn);

                    row.appendChild(actionsCell);
                    tbody.appendChild(row);
                });

                table.appendChild(tbody);
                daySection.appendChild(table);
            }

            scheduleDisplay.appendChild(daySection);
        });
    }

    // Event listeners
    classForm.addEventListener('submit', handleFormSubmit);
    clearBtn.addEventListener('click', clearEditMode);

    // Initial load
    loadSchedule();
});