from flask import Flask, render_template, redirect, url_for, request, jsonify
from flask_login import LoginManager, current_user, login_required, login_user, logout_user, UserMixin
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'HYH-GYM-SECRET-KEY'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    role_id = db.Column(db.String(5), default="user", nullable=False)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    class_name = db.Column(db.String(100), nullable=False)
    coach = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'day': self.day,
            'time': self.time,
            'formatted_time': self.format_time(),
            'class_name': self.class_name,
            'coach': self.coach
        }

    def format_time(self):
        """Convert 24h format to 12h format"""
        try:
            time_obj = datetime.strptime(self.time, '%H:%M')
            return time_obj.strftime('%I:%M %p')
        except:
            return self.time

login_manager = LoginManager(app)
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def create_admin_users():
    """Create the 3 admin users if they don't exist"""
    admin_users = [
        {'email': 'h.saadi@hyh.com', 'password': 'admin123'},
        {'email': 'y.hamdan@hyh.com', 'password': 'admin123'},
        {'email': 'h.harakeh@hyh.com', 'password': 'admin123'}
    ]
    
    for admin_data in admin_users:
        existing_admin = User.query.filter_by(email=admin_data['email']).first()
        if not existing_admin:
            admin_user = User(
                email=admin_data['email'],
                role_id='admin'
            )
            admin_user.set_password(admin_data['password'])
            db.session.add(admin_user)
    
    db.session.commit()
    print("Admin users created/verified successfully!")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about-us.html')

@app.route('/contact')
def contact():
    return render_template('contact-us.html')

@app.route('/join')
def join():
    return render_template('join.html')

@app.route('/location')
def location():
    return render_template('location.html')

@app.route('/membership')
def membership():
    return render_template('membership.html')

@app.route('/nutrition')
def nutrition():
    return render_template('nutrition.html')

@app.route('/resistance')
def resistance():
    return render_template('resistance.html')

@app.route('/cardio')
def cardio():
    return render_template('cardio.html')

@app.route('/schedule')
def schedule():
    # Get all schedule data for public view
    schedule_data = get_schedule_data()
    return render_template('schedule.html', schedule_data=schedule_data)

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        remember = request.form.get('remember')
        
        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            login_user(user, remember=bool(remember))
            
            # Redirect based on user role
            if user.role_id == 'admin':
                return redirect(url_for('home_admin'))
            else:
                return redirect(url_for('home_user'))
        else:
            return render_template('security/login_user.html', error='Invalid email or password')
    
    return render_template('security/login_user.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        # Check if passwords match
        if password != confirm_password:
            return render_template('security/register_user.html', error='Passwords do not match')
        
        # Check if email already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return render_template('security/register_user.html', error='Email already registered')
        
        # Create new user (always as regular user, not admin)
        new_user = User(email=email, role_id='user')
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        
        return redirect(url_for('login'))
    
    return render_template('security/register_user.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

# ----ROLE ADMIN---
@app.route('/home-admin')
@login_required
def home_admin():
    if current_user.role_id == 'admin':
        # Get user statistics
        total_users = User.query.count()
        regular_users = User.query.filter_by(role_id='user').count()
        admin_users = User.query.filter_by(role_id='admin').count()
        
        # Get schedule statistics
        total_classes = Schedule.query.count()
        unique_coaches = db.session.query(Schedule.coach).distinct().count()
        
        # Get classes today (based on current day of week)
        from datetime import datetime
        today = datetime.now().strftime('%A').lower()
        classes_today = Schedule.query.filter_by(day=today).count()
        
        # Get days with classes
        days_with_classes = db.session.query(Schedule.day).distinct().count()
        
        # Calculate average classes per day
        if days_with_classes > 0:
            avg_classes_per_day = total_classes / days_with_classes
        else:
            avg_classes_per_day = 0
        
        # For recent registrations, we'll use a placeholder since we don't have registration dates
        # You might want to add a created_at field to User model in the future
        recent_registrations = max(0, total_users - 10)  # Placeholder logic
        
        return render_template('home-admin.html',
                             total_users=total_users,
                             regular_users=regular_users,
                             admin_users=admin_users,
                             total_classes=total_classes,
                             classes_today=classes_today,
                             unique_coaches=unique_coaches,
                             days_with_classes=days_with_classes,
                             avg_classes_per_day=avg_classes_per_day,
                             recent_registrations=recent_registrations)
    else:
        return 'Access denied: Admins only.', 403

@app.route('/schedule-admin')
@login_required
def schedule_admin():
    if current_user.role_id == 'admin':
        schedule_data = get_schedule_data()
        return render_template('schedule-admin.html', schedule_data=schedule_data)
    else:
        return 'Access denied: Admins only.', 403

@app.route('/check-users')
@login_required
def check_users():
    if current_user.role_id == 'admin':
        # Fetch all users from the database
        users = User.query.all()
        return render_template('check-users.html', users=users)
    else:
        return 'Access denied: Admins only.', 403

@app.route('/admin-users')
@login_required
def admin_users():
    if current_user.role_id == 'admin':
        users = User.query.all()
        return render_template('admin-users.html', users=users)
    else:
        return 'Access denied: Admins only.', 403

# New route for deleting users
@app.route('/delete-user/<int:user_id>', methods=['POST'])
@login_required
def delete_user(user_id):
    if current_user.role_id != 'admin':
        return jsonify({'success': False, 'message': 'Access denied: Admins only.'}), 403
    
    # Find the user to delete
    user_to_delete = User.query.get(user_id)
    
    if not user_to_delete:
        return jsonify({'success': False, 'message': 'User not found.'}), 404
    
    # Prevent deletion of admin users
    if user_to_delete.role_id == 'admin':
        return jsonify({'success': False, 'message': 'Cannot delete admin users.'}), 400
    
    # Prevent users from deleting themselves
    if user_to_delete.id == current_user.id:
        return jsonify({'success': False, 'message': 'Cannot delete your own account.'}), 400
    
    try:
        db.session.delete(user_to_delete)
        db.session.commit()
        return jsonify({
            'success': True, 
            'message': f'User {user_to_delete.email} has been successfully deleted.'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False, 
            'message': 'An error occurred while deleting the user.'
        }), 500

# ----SCHEDULE MANAGEMENT ROUTES----
@app.route('/api/schedule', methods=['POST'])
@login_required
def add_schedule():
    if current_user.role_id != 'admin':
        return jsonify({'success': False, 'message': 'Access denied: Admins only.'}), 403

    data = request.get_json()
    
    # Validate required fields
    required_fields = ['day', 'time', 'class_name', 'coach']
    if not all(field in data for field in required_fields):
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    try:
        new_class = Schedule(
            day=data['day'].lower(),
            time=data['time'],
            class_name=data['class_name'],
            coach=data['coach']
        )
        
        db.session.add(new_class)
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Class added successfully',
            'class': new_class.to_dict()
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error adding class'}), 500

@app.route('/api/schedule/<int:class_id>', methods=['PUT'])
@login_required
def update_schedule(class_id):
    if current_user.role_id != 'admin':
        return jsonify({'success': False, 'message': 'Access denied: Admins only.'}), 403

    data = request.get_json()
    
    try:
        class_to_update = Schedule.query.get(class_id)
        if not class_to_update:
            return jsonify({'success': False, 'message': 'Class not found'}), 404
        
        # Update fields
        class_to_update.day = data.get('day', class_to_update.day).lower()
        class_to_update.time = data.get('time', class_to_update.time)
        class_to_update.class_name = data.get('class_name', class_to_update.class_name)
        class_to_update.coach = data.get('coach', class_to_update.coach)
        
        db.session.commit()
        
        return jsonify({
            'success': True, 
            'message': 'Class updated successfully',
            'class': class_to_update.to_dict()
        })
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error updating class'}), 500

@app.route('/api/schedule/<int:class_id>', methods=['DELETE'])
@login_required
def delete_schedule(class_id):
    if current_user.role_id != 'admin':
        return jsonify({'success': False, 'message': 'Access denied: Admins only.'}), 403
    
    try:
        class_to_delete = Schedule.query.get(class_id)
        if not class_to_delete:
            return jsonify({'success': False, 'message': 'Class not found'}), 404
        
        db.session.delete(class_to_delete)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Class deleted successfully'})
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Error deleting class'}), 500

@app.route('/api/schedule', methods=['GET'])
def get_schedule_api():
    """API endpoint to get all schedule data"""
    schedule_data = get_schedule_data()
    return jsonify(schedule_data)

def get_schedule_data():
    """Helper function to get organized schedule data"""
    days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    schedule_data = {}
    
    for day in days:
        classes = Schedule.query.filter_by(day=day).order_by(Schedule.time).all()
        schedule_data[day] = [cls.to_dict() for cls in classes]
    
    return schedule_data

# ----USER ROLE---
@app.route('/home-user')
@login_required
def home_user():
    return render_template('home-user.html')

@app.route('/user-schedule')
@login_required
def user_schedule():
    schedule_data = get_schedule_data()
    return render_template('schedule.html', schedule_data=schedule_data)

@app.route('/user-nutrition')
@login_required
def user_nutrition():
    return render_template('nutrition.html')


# Helper route to check current user info (for debugging)
@app.route('/debug-user')
@login_required
def debug_user():
    return f"User: {current_user.email}, Role: {current_user.role_id}"

# Replace the complex workout models with this simple one
# Add this after your existing models (User, Schedule, etc.)

class WorkoutLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('workout_logs', lazy=True))
    
    # Ensure one workout per day per user
    __table_args__ = (db.UniqueConstraint('user_id', 'date', name='unique_user_date'),)

# Replace all the complex workout routes with these simple ones

@app.route('/workout')
@login_required
def workout():
    from datetime import date, timedelta
    import calendar
    
    today = date.today()
    
    # Get user's workout logs
    workout_logs = WorkoutLog.query.filter_by(user_id=current_user.id).all()
    workout_dates = [log.date.strftime('%Y-%m-%d') for log in workout_logs]
    
    # Check if today is completed
    is_today_completed = any(log.date == today for log in workout_logs)
    
    # Calculate current streak
    current_streak = calculate_streak(current_user.id)
    
    # Calculate best streak
    best_streak = calculate_best_streak(current_user.id)
    
    # Calculate stats
    total_workouts = len(workout_logs)
    workouts_this_month = len([log for log in workout_logs if log.date.month == today.month and log.date.year == today.year])
    
    # Current month and year for display
    current_month_year = today.strftime('%B %Y')
    
    return render_template('workout.html',
                         current_streak=current_streak,
                         best_streak=best_streak,
                         is_today_completed=is_today_completed,
                         today_date=today.strftime('%Y-%m-%d'),
                         total_workouts=total_workouts,
                         workouts_this_month=workouts_this_month,
                         current_month_year=current_month_year,
                         workout_data=workout_dates)

@app.route('/mark-workout', methods=['POST'])
@login_required
def mark_workout():
    from datetime import datetime
    
    date_str = request.form.get('date')
    workout_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    
    # Check if already logged
    existing_log = WorkoutLog.query.filter_by(
        user_id=current_user.id,
        date=workout_date
    ).first()
    
    if not existing_log:
        # Create new workout log
        new_log = WorkoutLog(
            user_id=current_user.id,
            date=workout_date
        )
        db.session.add(new_log)
        db.session.commit()
    
    return redirect(url_for('workout'))

# Helper functions for streak calculations
def calculate_streak(user_id):
    """Calculate current workout streak for a user"""
    from datetime import date, timedelta
    
    today = date.today()
    current_date = today
    streak = 0
    
    while True:
        workout_log = WorkoutLog.query.filter_by(
            user_id=user_id,
            date=current_date
        ).first()
        
        if workout_log:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            # If today is not completed, don't break the streak yet
            if current_date == today:
                current_date -= timedelta(days=1)
                continue
            else:
                break
    
    return streak

def calculate_best_streak(user_id):
    """Calculate the best (longest) workout streak for a user"""
    from datetime import timedelta
    
    workout_logs = WorkoutLog.query.filter_by(user_id=user_id).order_by(WorkoutLog.date).all()
    
    if not workout_logs:
        return 0
    
    best_streak = 1
    current_streak = 1
    
    for i in range(1, len(workout_logs)):
        prev_date = workout_logs[i-1].date
        curr_date = workout_logs[i].date
        
        # Check if dates are consecutive
        if curr_date - prev_date == timedelta(days=1):
            current_streak += 1
            best_streak = max(best_streak, current_streak)
        else:
            current_streak = 1
    
    return best_streak

# Update your main section to include workout initialization
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        create_admin_users()  # Create admin users on startup
    app.run(debug=True)