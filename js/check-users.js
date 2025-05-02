document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }

    // Make sure this is an admin
    if (!currentUser.isAdmin) {
        window.location.href = 'home-user.html';
        return;
    }

    // Update admin name in nav
    document.getElementById('adminName').textContent = `Admin: ${currentUser.name}`;

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });

    // Get users data (in a real app, this would come from a server)
    const users = [
        { email: 'h.saadi@hyh.com', password: 'admin123', name: 'Hussein El Saadi', isAdmin: true,
            status: 'active', lastLogin: '2025-05-01 08:45 AM' },
        { email: 'y.hamdan@hyh.com', password: 'admin123', name: 'Yasser Hamdan', isAdmin: true,
            status: 'active', lastLogin: '2025-04-30 02:15 PM' },
        { email: 'h.harakeh@hyh.com', password: 'admin123', name: 'Haidar El Harakeh', isAdmin: true,
            status: 'active', lastLogin: '2025-04-29 11:30 AM' },
        { email: 'user@example.com', password: 'user123', name: 'Test User', isAdmin: false,
            status: 'active', lastLogin: '2025-04-28 04:20 PM' },
        { email: 'jane.doe@example.com', password: 'password123', name: 'Jane Doe', isAdmin: false,
            status: 'active', lastLogin: '2025-04-27 09:15 AM' },
        { email: 'john.smith@example.com', password: 'password123', name: 'John Smith', isAdmin: false,
            status: 'inactive', lastLogin: '2025-04-15 11:45 AM' },
        { email: 'sarah.jones@example.com', password: 'password123', name: 'Sarah Jones', isAdmin: false,
            status: 'active', lastLogin: '2025-04-29 10:30 AM' },
        { email: 'mike.wilson@example.com', password: 'password123', name: 'Mike Wilson', isAdmin: false,
            status: 'inactive', lastLogin: '2025-03-18 03:45 PM' }
    ];

    // Add more realistic sample users
    for (let i = 1; i <= 10; i++) {
        users.push({
            email: `member${i}@example.com`,
            password: 'password123',
            name: `Member ${i}`,
            isAdmin: false,
            status: i % 5 === 0 ? 'inactive' : 'active',
            lastLogin: `2025-${String(04 - (i % 2)).padStart(2, '0')}-${String(20 - (i % 15)).padStart(2, '0')} ${i % 12 + 1}:${String((i * 5) % 60).padStart(2, '0')} ${i % 2 === 0 ? 'AM' : 'PM'}`
        });
    }

    // Function to display users
    function displayUsers(usersToDisplay) {
        const usersTable = document.getElementById('users-list');
        const noUsersMessage = document.getElementById('no-users-message');

        // Clear existing rows
        usersTable.innerHTML = '';

        if (usersToDisplay.length === 0) {
            document.getElementById('users-table-container').classList.add('hidden');
            noUsersMessage.classList.remove('hidden');
            return;
        }

        document.getElementById('users-table-container').classList.remove('hidden');
        noUsersMessage.classList.add('hidden');

        // Add user rows
        usersToDisplay.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.isAdmin ? '<span class="admin-badge">Admin</span>' : '<span class="user-badge">Member</span>'}</td>
            <td><span class="status-indicator status-${user.status}"></span>${user.status.charAt(0).toUpperCase() + user.status.slice(1)}</td>
            <td class="last-login">${user.lastLogin}</td>
          `;
            usersTable.appendChild(row);
        });
    }

    // Initial display
    displayUsers(users);

    // Search functionality
    const searchInput = document.getElementById('user-search');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        displayUsers(filteredUsers);
    });

    // Create notification function for consistency with schedule-admin page
    function showNotification(message, type) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification ${type}`;
        notification.style.display = 'block';

        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Refresh button functionality
    document.getElementById('refresh-users').addEventListener('click', function() {
        searchInput.value = '';
        displayUsers(users);
        showNotification('User list refreshed', 'success');
    });

    // Filter button functionality (placeholder for future enhancement)
    document.getElementById('filter-toggle').addEventListener('click', function() {
        showNotification('Filter functionality would be implemented in a real application', 'info');
    });
});