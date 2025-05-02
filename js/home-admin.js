// Check if admin is logged in
document.addEventListener('DOMContentLoaded', function() {
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
});