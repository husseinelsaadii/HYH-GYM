// User and admin data (in a real application, this would be stored in a database)
const users = [
    // Default admin accounts
    { email: 'h.saadi@hyh.com', password: 'admin123', name: 'Hussein El Saadi', isAdmin: true },
    { email: 'y.hamdan@hyh.com', password: 'admin123', name: 'Yasser Hamdan', isAdmin: true },
    { email: 'h.harakeh@hyh.com', password: 'admin123', name: 'Haidar El Harakeh', isAdmin: true },

    // Sample user accounts
    { email: 'user@example.com', password: 'user123', name: 'Test User', isAdmin: false }
];

// Toggle between login and register forms
document.getElementById('login-toggle').addEventListener('click', function() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
    this.classList.add('active');
    document.getElementById('register-toggle').classList.remove('active');
});

document.getElementById('register-toggle').addEventListener('click', function() {
    document.getElementById('register-form').classList.remove('hidden');
    document.getElementById('login-form').classList.add('hidden');
    this.classList.add('active');
    document.getElementById('login-toggle').classList.remove('active');
});

// Handle login form submission
document.getElementById('login-btn').addEventListener('click', function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Find user with matching credentials
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store user info in localStorage for session management
        localStorage.setItem('currentUser', JSON.stringify({
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        }));

        // Redirect based on user type
        if (user.isAdmin) {
            window.location.href = 'home-admin.html';
        } else {
            window.location.href = 'home-user.html';
        }
    } else {
        alert('Invalid email or password. Please try again.');
    }
});

// Handle register form submission
document.getElementById('register-btn').addEventListener('click', function() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    // Basic validation
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        alert('An account with this email already exists');
        return;
    }

    // Add new user (only as regular user, not admin)
    users.push({
        name: name,
        email: email,
        password: password,
        isAdmin: false
    });

    alert('Account created successfully! You can now log in.');

    // Switch to login form
    document.getElementById('login-toggle').click();

    // Pre-fill login form with registration email
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = '';
});