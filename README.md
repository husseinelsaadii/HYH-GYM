# HYH-GYM Flask Website
## 🏋️ About the Project  
**HYH-GYM** is a full-featured, responsive web application built with **Flask (Python), HTML, CSS, and JavaScript**, designed for gym users and administrators. It offers workout information, membership details, user interaction features, and admin functionality with secure authentication using Flask-Login. The application combines usability and design with practical tools like nutrition calculators and a workout info hub.

---

## 🌟 Key Features
- 🔐 **Flask-Login Authentication System**  
  - Secure user sessions and password hashing
  - Session management and user authentication
- 👥 **Admin and User Roles**  
  - Admins can:  
    - Add and manage classes  
    - View registered users  
  - Users can:  
    - Browse and register for available classes  
    - Use health tools like BMI and water intake calculators  
- 🏃 **Cardio & Resistance Info Pages**  
  - Learn about different workout types  
- 💳 **Membership Page**  
  - View payment methods and plans  
- 📍 **Locations & Contact Us**  
- 🧾 **About Us Page**  
- 🛒 **Shop (Coming Soon)**  
- ⭐ **Feedback Form**  
  - Link in the footer to rate the website: [Rate Our Project](https://docs.google.com/forms/d/e/1FAIpQLSdwDiBgdGIWtEXVy0-GAehkD_U_CkeFiDbQrSO7ByL12VXpPg/viewform?usp=sharing)

---

## 🧱 Project Structure
```
HYH-GYM/
│── run.py                   # Flask application
│
├── templates/              # Jinja2 templates
│   │── index.html          # Main homepage
│   │── membership.html     # Membership plans and payments
│   │── cardio.html         # Cardio workouts info
│   │── resistance.html     # Resistance training info
│   │── admin.html          # Admin dashboard (for adding classes, viewing users)
│   │── nutrition.html      # BMI & water intake calculator
│   │── about.html          # About us page
│   │── contact.html        # Contact and locations
│   │── shop.html           # Shop page (coming soon)
│   │── base.html           # Base template with navigation
│   │
│   └── security/           # Authentication templates
│       │── login.html      # Login page
│       └── register.html   # Registration page
│
├── static/                 # Static files
    │── css/
    │   └── style.css       # All site styling
    │── js/
    │   └── script.js       # All site interactivity
    │── images/             # All images used in the website
    └── videos/             # Video files used on pages
```

---

## 🛠️ Tech Stack
- **Flask** – Python web framework for backend logic
- **Flask-Login** – User session management and authentication
- **SQLite** – Lightweight database for user data and gym classes
- **Jinja2** – Template engine for dynamic HTML rendering
- **HTML5** – Semantic structure for all pages  
- **CSS3** – Flexbox, Grid, and media queries for layout and responsiveness  
- **JavaScript (ES6)** – Client-side interactivity, DOM manipulation, form logic  
- **Werkzeug** – Password hashing and security utilities

---

## 🚀 How to Run Locally
1. Clone the repo:
   ```bash
   git clone https://github.com/husseinelsaadii/HYH-GYM.git
   cd HYH-GYM
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Initialize the database:
   ```bash
   python app.py
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

---

## 📦 Dependencies
```
Flask==2.3.3
Flask-Login==0.6.3
Flask-SQLAlchemy==3.0.5
Werkzeug==2.3.7
```

---

## 🔒 Security Features
- **Password Hashing** – User passwords are securely hashed using Werkzeug
- **Session Management** – Flask-Login handles user sessions securely
- **CSRF Protection** – Forms are protected against cross-site request forgery
- **User Authentication** – Secure login/logout functionality
- **Role-based Access** – Admin and user role separation

---

## 🗄️ Database Schema
**Users Table:**
- ID (Primary Key)
- Username
- Email
- Password Hash
- Role (Admin/User)
- Registration Date

**Classes Table:**
- ID (Primary Key)
- Class Name
- Description
- Schedule
- Instructor
- Capacity

---

## 🔮 Future Enhancements
- 🛒 Finish implementing the **shop** section with payment integration
- 🌙 Add a **dark mode** toggle  
- 📈 Add **progress tracking** for workouts with database storage
- 📅 Enable **calendar scheduling** for classes with booking system
- 🔔 **Email notifications** for class registrations
- 📊 **Admin analytics dashboard** for user engagement metrics

---

## 👨‍💻 Developed By
- Hussein El Saadi  
- Yasser Hamdan  
- Haidar El Harakeh  

---

## 📩 Feedback  
We'd love to hear your thoughts!  
👉 [Click here to rate our website](https://docs.google.com/forms/d/e/1FAIpQLSdwDiBgdGIWtEXVy0-GAehkD_U_CkeFiDbQrSO7ByL12VXpPg/viewform?usp=sharing)

---

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
