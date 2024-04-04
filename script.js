document.addEventListener("DOMContentLoaded", function() {
    // DOMContentLoaded event ensures that the DOM is fully loaded before executing JavaScript
  
    const form = document.getElementById("form"); // Cache the form element
    const list = document.getElementById("list"); // Cache the list element
  
    // Event listener for form submission
    form.addEventListener("submit", function(e) {
      e.preventDefault(); // Prevent default form submission
  
      const taskInput = document.getElementById("task"); // Get task input element
      const task = taskInput.value.trim(); // Get trimmed task value
  
      const tasks = list.querySelectorAll("li"); // Get all existing tasks
      let taskExists = false;
      tasks.forEach(function(existingTask) { // Check if the task already exists
        if (existingTask.textContent.trim() === task) {
          taskExists = true;
        }
      });
  
      if (!taskExists && task !== "") { // If task doesn't exist and input is not empty
        const li = document.createElement("li"); // Create a new list item
        li.textContent = task; // Set text content of the list item
        list.appendChild(li); // Append the new list item to the list
        taskInput.value = ""; // Clear the input field
      } else {
        alert("Task already exists or input is empty!"); // Alert user if task already exists or input is empty
      }
    });
  
    // Event listener for list item removal
    list.addEventListener("click", function(e) {
      if (e.target.tagName === "LI") { // Check if clicked element is a list item
        e.target.remove(); // Remove the clicked list item
                }
            }
        );
    }
);
  