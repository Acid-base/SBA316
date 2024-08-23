const form = document.getElementById("form");
const list = document.getElementById("list");
const taskInput = document.getElementById("task");
const categoryInput = document.getElementById("category");
const taskError = document.getElementById("taskError");

let draggedTask = null; // For drag and drop

const createTaskElement = (task, category, completed = false, rank = 0) => {
  const li = document.createElement("li");
  li.textContent = `${task} (${category})`;
  li.dataset.rank = rank;
  li.draggable = true; // Enable drag and drop

  if (completed) {
    li.classList.add("completed");
  }

  // Add rank visual feedback (e.g., using a span)
  const rankSpan = document.createElement("span");
  rankSpan.classList.add("rank-indicator");
  rankSpan.textContent = rank + 1; // Display rank starting from 1
  li.appendChild(rankSpan);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-button");
  li.appendChild(deleteBtn);

  const completeBtn = document.createElement("button");
  completeBtn.textContent = completed ? "Undo" : "Complete";
  completeBtn.classList.add("complete-button");
  li.appendChild(completeBtn);

  // Event listeners for drag and drop
  li.addEventListener("dragstart", (event) => {
    draggedTask = event.target;
  });

  li.addEventListener("dragover", (event) => {
    event.preventDefault(); // Necessary to allow drop
  });

  li.addEventListener("drop", (event) => {
    event.preventDefault();
    const targetTask = event.target.closest("li");
    if (targetTask && draggedTask) {
      handleMoveTask(draggedTask, targetTask);
    }
    draggedTask = null;
  });

  return li;
};

const getTasksFromLocalStorage = () =>
  JSON.parse(localStorage.getItem("tasks") || "[]");

const setTasksToLocalStorage = (tasks) =>
  localStorage.setItem("tasks", JSON.stringify(tasks));

const addTask = (task, category) => {
  const tasks = getTasksFromLocalStorage();
  const duplicatedTask = tasks.find(
    (t) => t.task === task && t.category === category
  );

  if (duplicatedTask) {
    alert("Task already exists!");
    return;
  }

  const newTask = { task, category, completed: false, rank: tasks.length };
  const updatedTasks = [...tasks, newTask];

  setTasksToLocalStorage(updatedTasks);
  renderTasks();
};

const handleDeleteTask = (taskElement) => {
  const tasks = getTasksFromLocalStorage();
  const taskIndex = Array.from(list.children).indexOf(taskElement);
  const updatedTasks = tasks.filter((_, i) => i !== taskIndex);
  setTasksToLocalStorage(updatedTasks);
  renderTasks();
};

const handleCompleteTask = (taskElement) => {
  const tasks = getTasksFromLocalStorage();
  const taskIndex = Array.from(list.children).indexOf(taskElement);
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  setTasksToLocalStorage(tasks);
  renderTasks();
};

const handleMoveTask = (draggedTask, targetTask) => {
  const tasks = getTasksFromLocalStorage();
  const draggedIndex = Array.from(list.children).indexOf(draggedTask);
  const targetIndex = Array.from(list.children).indexOf(targetTask);

  // Swap tasks in the array
  const temp = tasks[draggedIndex];
  tasks[draggedIndex] = tasks[targetIndex];
  tasks[targetIndex] = temp;

  // Update ranks
  tasks.forEach((task, index) => {
    task.rank = index;
  });

  setTasksToLocalStorage(tasks);
  renderTasks();
};

const handleClearAllClick = () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    localStorage.removeItem("tasks");
    renderTasks();
  }
};

const renderTasks = () => {
  const tasks = getTasksFromLocalStorage();
  tasks.sort((a, b) => a.rank - b.rank);

  list.innerHTML = "";
  tasks.forEach((task) => {
    const li = createTaskElement(
      task.task,
      task.category,
      task.completed,
      task.rank
    );

    const deleteBtn = li.querySelector(".delete-button");
    deleteBtn.addEventListener("click", () => handleDeleteTask(li));

    const completeBtn = li.querySelector(".complete-button");
    completeBtn.addEventListener("click", () => handleCompleteTask(li));

    list.appendChild(li);
  });
};

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

document.addEventListener("DOMContentLoaded", () => {
  const clearAllButton = document.getElementById("clearAll");
  clearAllButton.addEventListener("click", handleClearAllClick);
  form.addEventListener("submit", handleFormSubmit);
  renderTasks();
});
