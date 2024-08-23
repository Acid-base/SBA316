const form = document.getElementById("form");
const list = document.getElementById("list");
const taskInput = document.getElementById("task");
const categoryInput = document.getElementById("category");
const taskError = document.getElementById("taskError");

let draggedTask = null; // For drag and drop

// Function to create a task list item element
const createTaskElement = (task, category, completed = false, rank = 0) => {
  const li = document.createElement("li");
  li.textContent = `${task} (${category})`;
  li.dataset.rank = rank; // Store the rank in the data attribute
  li.draggable = true; // Enable drag and drop functionality

  // Add the "completed" class if the task is marked as completed
  if (completed) {
    li.classList.add("completed");
  }

  // Add a visual indicator for the task's rank
  const rankSpan = document.createElement("span");
  rankSpan.classList.add("rank-indicator");
  rankSpan.textContent = rank + 1; // Display rank starting from 1
  li.appendChild(rankSpan);

  // Create the delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-button");
  li.appendChild(deleteBtn);

  // Create the complete/undo button
  const completeBtn = document.createElement("button");
  completeBtn.textContent = completed ? "Undo" : "Complete";
  completeBtn.classList.add("complete-button");
  li.appendChild(completeBtn);

  // Event listeners for drag and drop
  li.addEventListener("dragstart", (event) => {
    draggedTask = event.target; // Store the dragged task element
  });

  li.addEventListener("dragover", (event) => {
    event.preventDefault(); // Necessary to allow dropping on the element
  });

  li.addEventListener("drop", (event) => {
    event.preventDefault();
    const targetTask = event.target.closest("li"); // Find the closest list item to the drop location
    if (targetTask && draggedTask) {
      handleMoveTask(draggedTask, targetTask); // Handle the task move
    }
    draggedTask = null; // Reset the dragged task
  });

  return li;
};

// Get tasks from local storage
const getTasksFromLocalStorage = () =>
  JSON.parse(localStorage.getItem("tasks") || "[]");

// Save tasks to local storage
const setTasksToLocalStorage = (tasks) =>
  localStorage.setItem("tasks", JSON.stringify(tasks));

// Function to add a new task
const addTask = (task, category) => {
  const tasks = getTasksFromLocalStorage(); // Get tasks from local storage
  const duplicatedTask = tasks.find(
    (t) => t.task === task && t.category === category // Check for duplicates
  );

  if (duplicatedTask) {
    alert("Task already exists!");
    return;
  }

  // Create a new task object with a unique rank
  const newTask = { task, category, completed: false, rank: tasks.length };
  const updatedTasks = [...tasks, newTask]; // Add the new task to the array

  setTasksToLocalStorage(updatedTasks); // Save the updated tasks to local storage
  renderTasks(); // Re-render the task list
};

// Function to handle deleting a task
const handleDeleteTask = (taskElement) => {
  const tasks = getTasksFromLocalStorage();
  const taskIndex = Array.from(list.children).indexOf(taskElement); // Get the index of the task to delete
  const updatedTasks = tasks.filter((_, i) => i !== taskIndex); // Remove the task from the array

  setTasksToLocalStorage(updatedTasks); // Save the updated tasks to local storage
  renderTasks(); // Re-render the task list
};

// Function to handle marking a task as complete/incomplete
const handleCompleteTask = (taskElement) => {
  const tasks = getTasksFromLocalStorage();
  const taskIndex = Array.from(list.children).indexOf(taskElement); // Get the index of the task

  // Toggle the completed status of the task
  tasks[taskIndex].completed = !tasks[taskIndex].completed;

  setTasksToLocalStorage(tasks); // Save the updated tasks to local storage
  renderTasks(); // Re-render the task list
};

// Function to handle moving a task
const handleMoveTask = (draggedTask, targetTask) => {
  const tasks = getTasksFromLocalStorage();
  const draggedIndex = Array.from(list.children).indexOf(draggedTask); // Get the index of the dragged task
  const targetIndex = Array.from(list.children).indexOf(targetTask); // Get the index of the target task

  // Swap the tasks in the array
  const temp = tasks[draggedIndex];
  tasks[draggedIndex] = tasks[targetIndex];
  tasks[targetIndex] = temp;

  // Update the ranks of all tasks after the move
  tasks.forEach((task, index) => {
    task.rank = index;
  });

  setTasksToLocalStorage(tasks); // Save the updated tasks to local storage
  renderTasks(); // Re-render the task list
};

// Function to handle clearing all tasks
const handleClearAllClick = () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    localStorage.removeItem("tasks"); // Remove tasks from local storage
    renderTasks(); // Re-render the task list
  }
};

// Function to render the task list
const renderTasks = () => {
  const tasks = getTasksFromLocalStorage();
  tasks.sort((a, b) => a.rank - b.rank); // Sort tasks by rank

  list.innerHTML = ""; // Clear the existing task list
  tasks.forEach((task) => {
    const li = createTaskElement(
      task.task,
      task.category,
      task.completed,
      task.rank
    );

    // Add event listeners for delete and complete buttons
    const deleteBtn = li.querySelector(".delete-button");
    deleteBtn.addEventListener("click", () => handleDeleteTask(li));

    const completeBtn = li.querySelector(".complete-button");
    completeBtn.addEventListener("click", () => handleCompleteTask(li));

    list.appendChild(li); // Add the task item to the list
  });
};

// Function to handle form submission
const handleFormSubmit = (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  const category = categoryInput.value.trim() || "General";

  if (task === "") {
    taskError.textContent = "Task cannot be empty";
    return;
  } else if (task.length < 3) {
    taskError.textContent = "Task should be at least 3 characters long";
    return;
  } else if (task.length > 50) {
    taskError.textContent = "Task should not exceed 50 characters";
    return;
  } else {
    taskError.textContent = "";
    addTask(task, category);
    taskInput.value = "";
    categoryInput.value = "";
    taskInput.focus();
  }
};

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const clearAllButton = document.getElementById("clearAll");
  clearAllButton.addEventListener("click", handleClearAllClick);
  form.addEventListener("submit", handleFormSubmit);
  renderTasks();
});

