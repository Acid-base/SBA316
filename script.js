  const form = document.getElementById("form");
  const list = document.getElementById("list");
  const taskInput = document.getElementById("task");
  const taskError = document.getElementById("taskError");

  // Load tasks from localStorage on page load
  loadTasks();

  // Event listener for form submission
form.addEventListener("submit", function (e) {
  // Prevent default form submission (page reload)
  e.preventDefault();

    const task = taskInput.value.trim();

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
  }

  addTask(task);
});

// Function to add a new task
function addTask(task) {
  const tasks = list.querySelectorAll("li");
  let taskExists = false;

  tasks.forEach(function(existingTask) {
    if (existingTask.firstChild.textContent.trim() === task) {
      taskExists = true;
    }
  });

  if (!taskExists) {
  const li = document.createElement("li");
    
    // Correctly append the text node to the li element:
    li.appendChild(document.createTextNode(task)); 
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-button");
  li.appendChild(deleteBtn);

    list.appendChild(li);
    taskInput.value = "";
    taskInput.focus();

    saveTasks();
  } else {
    alert("Task already exists!");
  }
}

// Event delegation for delete buttons
list.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-button")) {
    const listItem = e.target.parentElement;
    listItem.remove();
checkScreenSize();

    // Save tasks to localStorage after deletion
    saveTasks();
  }
});

// Function to save tasks to localStorage
function saveTasks() {
  const tasks = [];
  const listItems = list.querySelectorAll("li");

  listItems.forEach(function (item) {
    // Access the text node directly, skipping the button
    tasks.push(item.childNodes[0].textContent.trim()); 
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
// Function to load tasks from localStorage
function loadTasks() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    JSON.parse(storedTasks).forEach((task) => {
      addTask(task); // Use addTask to add the loaded tasks
    });
  }
};

// Function to create a new task element
const createTaskElement = (task) => {
  const li = document.createElement("li");

  // Create a text node for the task text
  const taskTextNode = document.createTextNode(task);
  li.appendChild(taskTextNode);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-button");
  li.appendChild(deleteBtn);

  return li;
};

// Responsive design function
function checkScreenSize() {
  const windowWidth = window.innerWidth;
  const listContainer = document.querySelector(".container");

  listContainer.classList.toggle("tablet-layout", windowWidth <= 768);
};

// Initial call on page load
checkScreenSize();
