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

    // BMI Calculator
    document.getElementById('calculate-bmi').addEventListener('click', function() {
        const weight = parseFloat(document.getElementById('bmi-weight').value);
        const height = parseFloat(document.getElementById('bmi-height').value) / 100; // convert cm to m

        if (!weight || !height) {
            alert('Please enter both weight and height');
            return;
        }

        // Show loading spinner
        document.getElementById('bmi-loading').style.display = 'block';
        document.getElementById('bmi-result').style.display = 'none';

        // Simulate calculation time
        setTimeout(function() {
            const bmi = weight / (height * height);

            document.getElementById('bmi-value').textContent = bmi.toFixed(1);

            let category = '';
            let explanation = '';

            if (bmi < 18.5) {
                category = 'Underweight';
                explanation = 'You may need to gain some weight. Focus on nutrient-dense foods and strength training.';
            } else if (bmi >= 18.5 && bmi < 25) {
                category = 'Normal weight';
                explanation = 'You\'re in a healthy weight range. Maintain your current habits while focusing on nutrition quality.';
            } else if (bmi >= 25 && bmi < 30) {
                category = 'Overweight';
                explanation = 'Consider gradually reducing calorie intake and increasing physical activity.';
            } else {
                category = 'Obesity';
                explanation = 'Focus on creating sustainable lifestyle changes with both diet and exercise.';
            }

            document.getElementById('bmi-category').textContent = category;
            document.getElementById('bmi-explanation').textContent = explanation;

            // Hide spinner and show results
            document.getElementById('bmi-loading').style.display = 'none';
            document.getElementById('bmi-result').style.display = 'block';
        }, 800);
    });

    // Macro Calculator
    document.getElementById('calculate-macros').addEventListener('click', function() {
        const weight = parseFloat(document.getElementById('macro-weight').value);
        const height = parseFloat(document.getElementById('macro-height').value);
        const age = parseInt(document.getElementById('macro-age').value);
        const gender = document.getElementById('macro-gender').value;
        const activityLevel = parseFloat(document.getElementById('macro-activity').value);
        const goal = document.getElementById('macro-goal').value;

        if (!weight || !height || !age) {
            alert('Please fill in all fields');
            return;
        }

        // Show loading spinner
        document.getElementById('macro-loading').style.display = 'block';
        document.getElementById('macro-result').style.display = 'none';

        // Simulate calculation time
        setTimeout(function() {
            // Calculate BMR using Mifflin-St Jeor Equation
            let bmr;
            if (gender === 'male') {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }

            // Calculate TDEE (Total Daily Energy Expenditure)
            let tdee = bmr * activityLevel;

            // Adjust based on goal
            let calories;
            if (goal === 'lose') {
                calories = tdee - 500; // 500 calorie deficit
            } else if (goal === 'gain') {
                calories = tdee + 300; // 300 calorie surplus
            } else {
                calories = tdee; // maintenance
            }

            // Calculate macros (general guidelines)
            // Protein: 2g per kg for building muscle, 1.6g for maintenance, 2.2g for cutting
            let proteinMultiplier;
            if (goal === 'lose') {
                proteinMultiplier = 2.2;
            } else if (goal === 'gain') {
                proteinMultiplier = 2.0;
            } else {
                proteinMultiplier = 1.6;
            }

            const protein = weight * proteinMultiplier;
            const proteinCalories = protein * 4;

            // Fat: minimum 20% of calories
            const fatCalories = calories * 0.25; // 25% of calories from fat
            const fat = fatCalories / 9;

            // Remaining calories from carbs
            const carbCalories = calories - proteinCalories - fatCalories;
            const carbs = carbCalories / 4;

            // Calculate percentages
            const proteinPct = Math.round((proteinCalories / calories) * 100);
            const fatPct = Math.round((fatCalories / calories) * 100);
            const carbsPct = Math.round((carbCalories / calories) * 100);

            // Update UI
            document.getElementById('macro-calories').textContent = Math.round(calories);
            document.getElementById('macro-protein').textContent = Math.round(protein) + "g";
            document.getElementById('macro-carbs').textContent = Math.round(carbs) + "g";
            document.getElementById('macro-fat').textContent = Math.round(fat) + "g";
            document.getElementById('macro-protein-pct').textContent = proteinPct;
            document.getElementById('macro-carbs-pct').textContent = carbsPct;
            document.getElementById('macro-fat-pct').textContent = fatPct;

            // Hide spinner and show results
            document.getElementById('macro-loading').style.display = 'none';
            document.getElementById('macro-result').style.display = 'block';
        }, 800);
    });

    // Water Intake Calculator
    document.getElementById('calculate-water').addEventListener('click', function() {
        const weight = parseFloat(document.getElementById('water-weight').value);
        const activityMultiplier = parseInt(document.getElementById('water-activity').value);

        if (!weight) {
            alert('Please enter your weight');
            return;
        }

        // Show loading spinner
        document.getElementById('water-loading').style.display = 'block';
        document.getElementById('water-result').style.display = 'none';

        // Simulate calculation time
        setTimeout(function() {
            // Calculate water needs (ml per kg of body weight)
            const waterInMl = weight * activityMultiplier;
            const waterInLiters = waterInMl / 1000;
            const glassesOfWater = Math.round(waterInMl / 250); // 250ml glass

            // Update UI
            document.getElementById('water-intake').textContent = waterInLiters.toFixed(1);
            document.getElementById('water-glasses').textContent = glassesOfWater;

            // Hide spinner and show results
            document.getElementById('water-loading').style.display = 'none';
            document.getElementById('water-result').style.display = 'block';
        }, 800);
    });

    // Calorie Tracker
    document.getElementById('calculate-calories').addEventListener('click', function() {
        const goalCalories = parseInt(document.getElementById('calorie-goal').value);
        const consumedCalories = parseInt(document.getElementById('calorie-consumed').value);
        const burnedCalories = parseInt(document.getElementById('calorie-burned').value) || 0;

        if (!goalCalories || !consumedCalories) {
            alert('Please enter your calorie goal and calories consumed');
            return;
        }

        // Show loading spinner
        document.getElementById('calorie-loading').style.display = 'block';
        document.getElementById('calorie-result').style.display = 'none';

        // Simulate calculation time
        setTimeout(function() {
            const remainingCalories = goalCalories - consumedCalories + burnedCalories;

            // Update UI
            document.getElementById('summary-goal').textContent = goalCalories;
            document.getElementById('summary-consumed').textContent = consumedCalories;
            document.getElementById('summary-burned').textContent = burnedCalories;
            document.getElementById('summary-remaining').textContent = remainingCalories;

            // Add advice based on remaining calories
            let advice = '';
            if (remainingCalories > 500) {
                advice = 'You have plenty of calories left for the day. Make sure you\'re eating enough to fuel your workouts!';
            } else if (remainingCalories > 0) {
                advice = 'You\'re on track! Consider a protein-rich snack to finish your day strong.';
            } else if (remainingCalories > -300) {
                advice = 'You\'re slightly over your goal, but that\'s okay. Focus on protein and veggies for your next meal.';
            } else {
                advice = 'You\'ve exceeded your goal by a significant amount. Tomorrow, try planning your meals in advance.';
            }

            document.getElementById('calorie-advice').textContent = advice;

            // Save to local storage for tracking over time (simplified)
            const today = new Date().toISOString().split('T')[0];
            let calorieHistory = JSON.parse(localStorage.getItem('calorieHistory')) || {};

            calorieHistory[today] = {
                goal: goalCalories,
                consumed: consumedCalories,
                burned: burnedCalories,
                remaining: remainingCalories
            };

            localStorage.setItem('calorieHistory', JSON.stringify(calorieHistory));

            // Hide spinner and show results
            document.getElementById('calorie-loading').style.display = 'none';
            document.getElementById('calorie-result').style.display = 'block';
        }, 800);
    });

    // Load any saved data
    const loadSavedData = function() {
        // Load calorie data if available
        const today = new Date().toISOString().split('T')[0];
        const calorieHistory = JSON.parse(localStorage.getItem('calorieHistory')) || {};

        if (calorieHistory[today]) {
            document.getElementById('calorie-goal').value = calorieHistory[today].goal;
            document.getElementById('calorie-consumed').value = calorieHistory[today].consumed;
            document.getElementById('calorie-burned').value = calorieHistory[today].burned;

            // Trigger calculation to show results
            document.getElementById('calculate-calories').click();
        }
    };

    // Call load function after small delay to ensure DOM is ready
    setTimeout(loadSavedData, 500);
});