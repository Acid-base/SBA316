
document.addEventListener("DOMContentLoaded", function() {
    const form = document .getElementById("form");
    const list = document.getElementById("list");

    form.addEventListener("submit", function(e) {
       e.preventDefault();

      const taskInput = document.getElementById("task");
      const task = taskInput.value.trim();

      const tasks = list.querySelectorAll("li");
      let taskExists = false;

    