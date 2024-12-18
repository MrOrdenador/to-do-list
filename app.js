let tasks = [];
let savedTasks = [];
let completedTasks = [];

function loadTasksFromLocalStorage() {
  const savedTasksData = localStorage.getItem('tasks');
  const savedSavedTasksData = localStorage.getItem('savedTasks');
  const savedCompletedTasksData = localStorage.getItem('completedTasks');

  if (savedTasksData) {
    tasks = JSON.parse(savedTasksData);
  }
  if (savedSavedTasksData) {
    savedTasks = JSON.parse(savedSavedTasksData);
  }
  if (savedCompletedTasksData) {
    completedTasks = JSON.parse(savedCompletedTasksData);
  }
}

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('savedTasks', JSON.stringify(savedTasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

document.addEventListener('DOMContentLoaded', () => {
  const newTaskInput = document.getElementById('new-task');
  const addTaskBtn = document.getElementById('add-task-btn');
  const tasksContainer = document.getElementById('tasks-container');
  const savedTasksContainer = document.getElementById('saved-tasks-container');
  const completedTasksLog = document.getElementById('completed-tasks-log');
  const savedPopup = document.getElementById('saved-popup');
  const closeSavedPopup = document.getElementById('close-saved-popup');
  const logPopup = document.getElementById('log-popup');
  const closeLogPopup = document.getElementById('close-log-popup');
  const resetBtn = document.getElementById('reset-btn');
  const pendingTasksCount = document.getElementById('pending-tasks-count');
  const noTasksMsg = document.getElementById('no-tasks-msg');

  loadTasksFromLocalStorage();

  function updateTaskCount() {
    pendingTasksCount.textContent = tasks.length;
    noTasksMsg.classList.toggle('hidden', tasks.length > 0);
  }

  function renderTasks() {
    tasksContainer.innerHTML = '';
    tasks.forEach((task, index) => {
      const taskDiv = document.createElement('div');
      taskDiv.className = 'flex justify-between items-center p-3 bg-gray-700 rounded hover:bg-gray-600 transition';

      taskDiv.innerHTML = `
        <span>${task}</span>
        <div class="flex space-x-2">
          <button class="bg-teal-500 hover:bg-teal-600 text-white px-2 py-1 rounded" onclick="completeTask(${index})">Complete</button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded" onclick="deleteTask(${index})">Delete</button>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded" onclick="saveForLater(${index})">Save</button>
        </div>
      `;
      tasksContainer.appendChild(taskDiv);
    });
    updateTaskCount();
  }

  function renderSavedTasks() {
    savedTasksContainer.innerHTML = '';
    savedTasks.forEach((task, index) => {
      const savedTaskDiv = document.createElement('div');
      savedTaskDiv.className = 'flex justify-between items-center p-3 bg-gray-700 rounded hover:bg-gray-600 transition';
      savedTaskDiv.innerHTML = `
        <span>${task}</span>
        <button class="bg-teal-500 hover:bg-teal-600 text-white px-2 py-1 rounded" onclick="restoreTask(${index})">Restore</button>
      `;
      savedTasksContainer.appendChild(savedTaskDiv);
    });
  }

  function renderCompletedTasks() {
    completedTasksLog.innerHTML = '';
    completedTasks.forEach(task => {
      const logDiv = document.createElement('div');
      logDiv.textContent = `${task.text} - ${task.date}`;
      logDiv.className = 'p-2 bg-gray-700 rounded';
      completedTasksLog.appendChild(logDiv);
    });
  }

  function addTask() {
    const task = newTaskInput.value.trim();
    if (!task) {
      alert('You need to add some text!');
      return;
    }
    tasks.push(task);
    newTaskInput.value = '';
    renderTasks();
    saveTasksToLocalStorage();
  }

  function resetTasks() {
    if (tasks.length === 0 && savedTasks.length === 0 && completedTasks.length === 0) {
      alert("There are no tasks to reset.");
      return;
    }
    if (confirm("This action is not reversible. Are you sure you want to delete all tasks?")) {
      tasks = [];
      savedTasks = [];
      completedTasks = [];
      renderTasks();
      renderSavedTasks();
      renderCompletedTasks();
      saveTasksToLocalStorage();
    }
  }

  window.completeTask = function(index) {
    completedTasks.push({ text: tasks.splice(index, 1)[0], date: new Date().toLocaleString() });
    renderTasks();
    renderCompletedTasks();
    saveTasksToLocalStorage();
  };

  window.deleteTask = function(index) {
    tasks.splice(index, 1);
    renderTasks();
    saveTasksToLocalStorage();
  };

  window.saveForLater = function(index) {
    savedTasks.push(tasks.splice(index, 1)[0]);
    renderTasks();
    renderSavedTasks();
    saveTasksToLocalStorage();
  };

  window.restoreTask = function(index) {
    tasks.push(savedTasks.splice(index, 1)[0]);
    renderTasks();
    renderSavedTasks();
    saveTasksToLocalStorage();
  };

  addTaskBtn.addEventListener('click', addTask);
  resetBtn.addEventListener('click', resetTasks);
  closeSavedPopup.addEventListener('click', () => savedPopup.classList.add('hidden'));
  closeLogPopup.addEventListener('click', () => logPopup.classList.add('hidden'));

  document.getElementById('saved-folder-icon').addEventListener('click', () => savedPopup.classList.remove('hidden'));
  document.getElementById('log-icon').addEventListener('click', () => logPopup.classList.remove('hidden'));

  renderTasks();
  renderSavedTasks();
  renderCompletedTasks();
});
