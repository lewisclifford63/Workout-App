// Get references to form elements
const workoutForm = document.getElementById('workoutForm');
const workoutLog = document.getElementById('workoutLog');
const filterDate = document.getElementById('filterDate');
const filterExercise = document.getElementById('filterExercise');

// Load workouts from localStorage when the app is opened
document.addEventListener('DOMContentLoaded', loadWorkouts);

// Handle form submission to log new workouts
workoutForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Get form values
  const date = document.getElementById('date').value;
  const exercise = document.getElementById('exercise').value;
  const weight = document.getElementById('weight').value;
  const sets = document.getElementById('sets').value;
  const reps = document.getElementById('reps').value;

  // Validation: Ensure all fields are filled
  if (!date || !exercise || !weight || !sets || !reps) {
    alert('Please fill in all fields before logging the workout.');
    return;
  }

  // Create workout object
  const workout = {
    date,
    exercise,
    weight, // Ensure weight is captured correctly
    sets,
    reps,
  };

  // Store the workout in localStorage
  storeWorkout(workout);

  // Update workout log display
  displayWorkout(workout);

  // Reset form (clear all fields except date)
  workoutForm.reset();
  document.getElementById('date').value = date; // Restore the date after reset
});

// Store the workout in localStorage
function storeWorkout(workout) {
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  workouts.push(workout);
  localStorage.setItem('workouts', JSON.stringify(workouts));

  // Update filter options
  updateFilterOptions();
}

// Load all workouts from localStorage when the app is opened
function loadWorkouts() {
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  workouts.forEach(displayWorkout);

  // Update filter options
  updateFilterOptions();
}

// Display a workout on the page with proper column alignment
function displayWorkout(workout) {
  const workoutItem = document.createElement('tr');
  workoutItem.innerHTML = `
    <td>${workout.date || ''}</td>
    <td>${workout.exercise || ''}</td>
    <td>${workout.weight || ''} kg</td> <!-- Weight is transferred here -->
    <td>${workout.sets || ''}</td>
    <td>${workout.reps || ''}</td>
    <td class="remove-col"><button class="remove-btn">-</button></td>
  `;
  workoutLog.appendChild(workoutItem);

  // Add remove functionality
  workoutItem.querySelector('.remove-btn').addEventListener('click', () => {
    removeWorkout(workout, workoutItem);
  });
}

// Remove workout from table and localStorage
function removeWorkout(workout, element) {
  const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  const updatedWorkouts = workouts.filter((w) => w !== workout);
  localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
  element.remove();
}

// Update filter options based on logged workouts
function updateFilterOptions() {
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  let dates = new Set();
  let exercises = new Set();

  workouts.forEach((workout) => {
    dates.add(workout.date);
    exercises.add(workout.exercise);
  });

  updateFilterDropdown(filterDate, dates);
  updateFilterDropdown(filterExercise, exercises);
}

// Update dropdown filter options
function updateFilterDropdown(dropdown, items) {
  dropdown.innerHTML = '<option value="all">All</option>';
  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item;
    option.textContent = item;
    dropdown.appendChild(option);
  });
}

// Apply filtering to the table based on selected filters
filterDate.addEventListener('change', filterWorkouts);
filterExercise.addEventListener('change', filterWorkouts);

function filterWorkouts() {
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  const selectedDate = filterDate.value;
  const selectedExercise = filterExercise.value;

  const filteredWorkouts = workouts.filter((workout) => {
    const matchDate = selectedDate === 'all' || workout.date === selectedDate;
    const matchExercise = selectedExercise === 'all' || workout.exercise === selectedExercise;
    return matchDate && matchExercise;
  });

  // Clear table
  workoutLog.innerHTML = '';

  // Display filtered workouts
  filteredWorkouts.forEach(displayWorkout);
}

// Reset filters
document.getElementById('resetFilters').addEventListener('click', () => {
  filterDate.value = 'all';
  filterExercise.value = 'all';
  filterWorkouts();
});



