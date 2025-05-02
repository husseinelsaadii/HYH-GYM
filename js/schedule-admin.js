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

    // Initialize schedule data from localStorage or create new
    let scheduleData = JSON.parse(localStorage.getItem('gymSchedule')) || {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: []
    };

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

    // Save schedule data to localStorage
    function saveScheduleData() {
        localStorage.setItem('gymSchedule', JSON.stringify(scheduleData));
        displaySchedule();
    }

    // Add or update a class
    function handleFormSubmit(e) {
        e.preventDefault();

        const day = daySelect.value;
        const time = timeInput.value;
        const className = classNameInput.value;
        const coach = coachInput.value;

        if (!day || !time || !className || !coach) {
            showNotification('Please fill all fields', 'error');
            return;
        }

        const classObj = {
            time: time,
            formattedTime: formatTime(time),
            name: className,
            coach: coach
        };

        // If editing existing class
        if (editIndex.value !== '') {
            const oldDay = editDay.value;
            const index = parseInt(editIndex.value);

            // If day changed, remove from old day and add to new day
            if (oldDay !== day) {
                scheduleData[oldDay].splice(index, 1);
                scheduleData[day].push(classObj);
            } else {
                scheduleData[day][index] = classObj;
            }

            showNotification('Class updated successfully', 'success');
            clearEditMode();
        } else {
            // Adding new class
            scheduleData[day].push(classObj);
            showNotification('Class added successfully', 'success');
        }

        // Sort classes by time
        for (const day in scheduleData) {
            scheduleData[day].sort((a, b) => a.time.localeCompare(b.time));
        }

        saveScheduleData();
        classForm.reset();
    }

    // Clear edit mode
    function clearEditMode() {
        editIndex.value = '';
        editDay.value = '';
        submitBtn.textContent = 'Add Class';
        clearBtn.style.display = 'none';
        classForm.reset();
    }

    // Set form to edit mode
    function editClass(day, index) {
        const classObj = scheduleData[day][index];

        daySelect.value = day;
        timeInput.value = classObj.time;
        classNameInput.value = classObj.name;
        coachInput.value = classObj.coach;
        editIndex.value = index;
        editDay.value = day;

        submitBtn.textContent = 'Update Class';
        clearBtn.style.display = 'inline-block';

        // Scroll to form
        document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
    }

    // Delete a class
    function deleteClass(day, index) {
        if (confirm('Are you sure you want to delete this class?')) {
            scheduleData[day].splice(index, 1);
            saveScheduleData();
            showNotification('Class deleted successfully', 'success');
        }
    }

    // Display schedule in admin view
    function displaySchedule() {
        scheduleDisplay.innerHTML = '';

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        days.forEach(day => {
            const daySection = document.createElement('div');
            daySection.className = 'day-section';

            const dayTitle = document.createElement('h3');
            dayTitle.textContent = day.charAt(0).toUpperCase() + day.slice(1);
            daySection.appendChild(dayTitle);

            if (scheduleData[day].length === 0) {
                const noClasses = document.createElement('p');
                noClasses.textContent = 'No classes scheduled';
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

                scheduleData[day].forEach((classItem, index) => {
                    const row = document.createElement('tr');

                    const timeCell = document.createElement('td');
                    timeCell.textContent = classItem.formattedTime;
                    row.appendChild(timeCell);

                    const classNameCell = document.createElement('td');
                    classNameCell.textContent = classItem.name;
                    row.appendChild(classNameCell);

                    const coachCell = document.createElement('td');
                    coachCell.textContent = classItem.coach;
                    row.appendChild(coachCell);

                    const actionsCell = document.createElement('td');
                    actionsCell.className = 'action-btns';

                    const editBtn = document.createElement('button');
                    editBtn.className = 'action-btn edit-btn';
                    editBtn.innerHTML = 'Edit';
                    editBtn.onclick = () => editClass(day, index);
                    actionsCell.appendChild(editBtn);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'action-btn delete-btn';
                    deleteBtn.innerHTML = 'Delete';
                    deleteBtn.onclick = () => deleteClass(day, index);
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

    // Initial display
    displaySchedule();
});