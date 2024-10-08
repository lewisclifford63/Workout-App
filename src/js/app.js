// Get references to form elements
const workoutTableBody = document.getElementById('workoutLog');
const filterDate = document.getElementById('filterDate');
const filterExercise = document.getElementById('filterExercise');
const resetFilters = document.getElementById('resetFilters');
const workoutForm = document.getElementById('workoutForm');

// Load workouts from localStorage when the app is opened
document.addEventListener('DOMContentLoaded', () => {
  loadWorkouts();
  populateFilterDropdowns(); // Populate date and exercise filter options
});

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
    weight,
    sets,
    reps,
  };

  // Store the workout in localStorage
  storeWorkout(workout);

  // Update workout log display
  displayWorkout(workout, JSON.parse(localStorage.getItem('workouts')).length - 1);

  // Reset form (clear all fields except date)
  workoutForm.reset();
  document.getElementById('date').value = date; // Restore the date after reset
  populateFilterDropdowns(); // Refresh filter dropdowns
});

// Store the workout in localStorage
function storeWorkout(workout) {
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  workouts.push(workout);
  localStorage.setItem('workouts', JSON.stringify(workouts));
}

// Load and display workouts in the table
function loadWorkouts() {
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  workoutTableBody.innerHTML = ''; // Clear the table

  // Sort workouts by date
  workouts.sort((a, b) => new Date(a.date) - new Date(b.date));

  workouts.forEach((workout, index) => {
    displayWorkout(workout, index);
  });
}

// Display a workout in the table, with an index to manage rows
function displayWorkout(workout, index) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${workout.date}</td>
    <td contenteditable="true" class="editable exercise">${workout.exercise}</td>
    <td contenteditable="true" class="editable weight">${workout.weight} kg</td> <!-- Weight added -->
    <td contenteditable="true" class="editable sets">${workout.sets}</td>
    <td contenteditable="true" class="editable reps">${workout.reps}</td>
    <td><button class="remove-btn" data-index="${index}">−</button></td>
  `;
  workoutTableBody.appendChild(row);

  // Add event listener for removing a row
  row.querySelector('.remove-btn').addEventListener('click', () => {
    confirmRemoveWorkout(index, workout.date, workout.exercise);
  });

  // Add event listeners for inline editing
  const editableCells = row.querySelectorAll('.editable');
  editableCells.forEach((cell) => {
    cell.addEventListener('blur', () => {
      validateAndUpdateWorkout(cell, index);
    });
  });
}

// Confirm before removing a workout
function confirmRemoveWorkout(index, date, exercise) {
  if (confirm(`Are you sure you want to delete the workout on ${date} for ${exercise}?`)) {
    removeWorkout(index);
  }
}

// Remove a workout by index
function removeWorkout(index) {
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  workouts.splice(index, 1); // Remove workout from the array
  localStorage.setItem('workouts', JSON.stringify(workouts)); // Update localStorage
  loadWorkouts(); // Reload table
  populateFilterDropdowns(); // Refresh filter dropdowns
}

// Validate and update workout data when a cell is edited
function validateAndUpdateWorkout(cell, index) {
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  const column = cell.classList.contains('exercise')
    ? 'exercise'
    : cell.classList.contains('weight')
    ? 'weight'
    : cell.classList.contains('sets')
    ? 'sets'
    : 'reps';

  let newValue = cell.textContent.trim();

  // Validate data: sets, reps, and weight must be numbers; exercise must be a string
  if (column === 'sets' || column === 'reps' || column === 'weight') {
    if (isNaN(newValue) || newValue === '') {
      alert(`${column.charAt(0).toUpperCase() + column.slice(1)} must be a valid number.`);
      cell.textContent = workouts[index][column]; // Reset to original value
      return;
    }
  } else if (column === 'exercise' && newValue === '') {
    alert('Exercise name cannot be empty.');
    cell.textContent = workouts[index].exercise; // Reset to original value
    return;
  }

  // Update the workout data with the new value
  workouts[index][column] = newValue;
  localStorage.setItem('workouts', JSON.stringify(workouts)); // Update localStorage
}

// Filter workouts by selected date or exercise from the table headers
function filterWorkouts() {
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  let filteredWorkouts = workouts;

  const selectedDate = filterDate.value;
  const selectedExercise = filterExercise.value;

  // Filter by date
  if (selectedDate) {
    filteredWorkouts = filteredWorkouts.filter((workout) => workout.date === selectedDate);
  }

  // Filter by exercise
  if (selectedExercise) {
    filteredWorkouts = filteredWorkouts.filter(
      (workout) => workout.exercise === selectedExercise
    );
  }

  // Update the displayed workouts
  workoutTableBody.innerHTML = ''; // Clear the table
  filteredWorkouts.forEach((workout, index) => displayWorkout(workout, index));
}

// Populate the date and exercise filter dropdowns with unique values
function populateFilterDropdowns() {
  let workouts = JSON.parse(localStorage.getItem('workouts')) || [];

  // Clear existing filter options
  filterDate.innerHTML = '<option value="">All</option>';
  filterExercise.innerHTML = '<option value="">All</option>';

  // Get unique dates and exercises
  let dates = [...new Set(workouts.map((workout) => workout.date))];
  let exercises = [...new Set(workouts.map((workout) => workout.exercise))];

  // Populate date filter
  dates.forEach((date) => {
    const option = document.createElement('option');
    option.value = date;
    option.textContent = date;
    filterDate.appendChild(option);
  });

  // Populate exercise filter
  exercises.forEach((exercise) => {
    const option = document.createElement('option');
    option.value = exercise;
    option.textContent = exercise;
    filterExercise.appendChild(option);
  });
}

// Event listeners for filtering
filterDate.addEventListener('change', filterWorkouts);
filterExercise.addEventListener('change', filterWorkouts);

// Reset filters
resetFilters.addEventListener('click', () => {
  filterDate.value = '';
  filterExercise.value = '';
  loadWorkouts(); // Reload all workouts
});
