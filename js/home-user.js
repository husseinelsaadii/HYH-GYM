// Check if user is logged in
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }

    // Make sure this is not an admin
    if (currentUser.isAdmin) {
        window.location.href = 'home-admin.html';
        return;
    }

    // Update username in nav
    document.getElementById('userName').textContent = `Welcome, ${currentUser.name}`;

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
});