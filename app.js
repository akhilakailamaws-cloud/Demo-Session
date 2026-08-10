const taskInput = document.getElementById("taskInput");
const taskList  = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const totalCount = document.getElementById("totalCount");
const doneCount  = document.getElementById("doneCount");

let tasks = [];

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ id: Date.now(), text, done: false });
  taskInput.value = "";
  render();
}

function toggleTask(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  render();
}

function render() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.done ? "done" : ""}`;
    li.innerHTML = `
      <input class="task-check" type="checkbox" ${task.done ? "checked" : ""}
        onchange="toggleTask(${task.id})" />
      <span class="task-text">${task.text}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
    `;
    taskList.appendChild(li);
  });

  const done = tasks.filter(t => t.done).length;
  totalCount.textContent = `${tasks.length} task${tasks.length !== 1 ? "s" : ""}`;
  doneCount.textContent  = `${done} done`;
  emptyState.style.display = tasks.length === 0 ? "block" : "none";
}

taskInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

render();
