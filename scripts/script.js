const table = document.querySelector(".table");
const tableBody = document.querySelector(".table__body");
const markEven = document.querySelector(".mark-even");
const markOdd = document.querySelector(".mark-odd");
const deleteFirst = document.querySelector(".delete-first");
const deleteLast = document.querySelector(".delete-last");
const deleteButton = document.querySelectorAll(".delete-button");
const addButton = document.querySelector(".add-button");
const form = document.querySelector(".form");
const formButton = document.querySelector(".form__button");
const background = document.querySelector(".background");

document.addEventListener("DOMContentLoaded", function () {
  localStorageWork();
});

function localStorageWork() {
  if (localStorage.getItem("tasks") == null) {
    localStorage.setItem("tasks", JSON.stringify([]));
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    for (let i = tasks.length - 1; i > -1; i--) {
      printTasks(tasks[i]);
    }
  }
}

function printTasks(task) {
  let parentElement = document.createElement("tr");

  let taskElem = document.createElement("td");
  taskElem.innerHTML = task[0];

  let descriptionElem = document.createElement("td");
  descriptionElem.innerHTML = task[1];

  let dateStartElem = document.createElement("td");
  dateStartElem.innerHTML = task[2];

  let dateFinishElem = document.createElement("td");
  dateFinishElem.innerHTML = task[3];

  let checkboxElem = document.createElement("td");
  let checkbox = document.createElement("input");
  checkbox.classList.add("checkbox");
  checkbox.type = "checkbox";
  checkbox.name = "myCheckbox";
  checkbox.value = "isChecked";
  checkboxElem.appendChild(checkbox);
  if (task[4] == true) {
    checkbox.checked = true;
    parentElement.classList.add("completed-task");
  }

  let buttonElem = document.createElement("td");
  let button = document.createElement("button");
  button.innerHTML = "&#10060";
  button.classList.add("delete-button");
  buttonElem.appendChild(button);

  parentElement.appendChild(taskElem);
  parentElement.appendChild(descriptionElem);
  parentElement.appendChild(dateStartElem);
  parentElement.appendChild(dateFinishElem);
  parentElement.appendChild(checkboxElem);
  parentElement.appendChild(buttonElem);

  tableBody.insertBefore(parentElement, tableBody.firstChild);
}

function markEvenRows() {
  for (let i = 0; i < tableBody.children.length; i++) {
    if (
      i % 2 === 0 ||
      tableBody.children[i].classList.contains("completed-task")
    ) {
      if (tableBody.children[i].classList.contains("grey-task")) {
        tableBody.children[i].classList.remove("grey-task");
      }
      continue;
    }
    tableBody.children[i].classList.add("grey-task");
  }
}

function markOddRows() {
  for (let i = 0; i < tableBody.children.length; i++) {
    if (
      i % 2 !== 0 ||
      tableBody.children[i].classList.contains("completed-task")
    ) {
      if (tableBody.children[i].classList.contains("grey-task")) {
        tableBody.children[i].classList.remove("grey-task");
      }
      continue;
    }
    tableBody.children[i].classList.add("grey-task");
  }
}

markEven.addEventListener("click", function () {
  markEvenRows();
});

markOdd.addEventListener("click", function () {
  markOddRows();
});

deleteFirst.addEventListener("click", function () {
  while (
    tableBody.firstChild &&
    tableBody.firstChild.nodeType !== Node.ELEMENT_NODE
  ) {
    tableBody.removeChild(tableBody.firstChild);
  }
  if (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(0, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

deleteLast.addEventListener("click", function () {
  while (
    tableBody.lastChild &&
    tableBody.lastChild.nodeType !== Node.ELEMENT_NODE
  ) {
    tableBody.removeChild(tableBody.lastChild);
  }
  if (tableBody.lastChild) {
    tableBody.removeChild(tableBody.lastChild);
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.splice(tasks.length - 1, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

tableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("delete-button")) {
    const clickedButton = event.target;
    const parentRow = clickedButton.closest("tr");
    let deletedElem = Array.from(tableBody.children).indexOf(parentRow);
    if (parentRow) {
      parentRow.remove();
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      tasks.splice(deletedElem, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }
});

tableBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("checkbox")) {
    const clickedCheckbox = event.target;
    const parentRow = clickedCheckbox.closest("tr");
    if (parentRow && clickedCheckbox.checked) {
      if (parentRow.classList.contains("grey-task")) {
        parentRow.classList.remove("grey-task");
      }
      parentRow.classList.add("completed-task");
      let completedElem = Array.from(tableBody.children).indexOf(parentRow);
      const parent = parentRow.parentNode;
      parent.removeChild(parentRow);
      parent.appendChild(parentRow);

      let tasks = JSON.parse(localStorage.getItem("tasks"));
      let tmp = tasks[completedElem];
      tmp[4] = true;
      tasks.splice(completedElem, 1);
      tasks[tasks.length] = tmp;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      let completedElem = Array.from(tableBody.children).indexOf(parentRow);
      let tasks = JSON.parse(localStorage.getItem("tasks"));
      let tmp = tasks[completedElem];
      tmp[4] = false;
      tasks.splice(completedElem, 1);
      tasks.unshift(tmp);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      parentRow.classList.remove("completed-task");
      const parent = parentRow.parentNode;
      parent.removeChild(parentRow);
      parent.insertBefore(parentRow, parent.firstChild);
    }
  }
});

addButton.addEventListener("click", function () {
  form.classList.add("form-visible");
  background.classList.add("background-dark");
});

background.addEventListener("click", function () {
  form.classList.remove("form-visible");
  background.classList.remove("background-dark");
});

const formTask = document.querySelector(".form__task");
const formDescription = document.querySelector(".form__description");
const formDateStart = document.querySelector(".form__date-start");
const formDateFinish = document.querySelector(".form__date-finish");

formButton.addEventListener("click", function () {
  form.classList.remove("form-visible");
  background.classList.remove("background-dark");
  let task = [
    formTask.value,
    formDescription.value,
    formDateStart.value,
    formDateFinish.value,
    false,
  ];
  createNewTask(task);
});

function createNewTask(task) {
  let parentElement = document.createElement("tr");

  let taskElem = document.createElement("td");
  taskElem.innerHTML = task[0];

  let descriptionElem = document.createElement("td");
  descriptionElem.innerHTML = task[1];

  let dateStartElem = document.createElement("td");
  dateStartElem.innerHTML = task[2];

  let dateFinishElem = document.createElement("td");
  dateFinishElem.innerHTML = task[3];

  let checkboxElem = document.createElement("td");
  let checkbox = document.createElement("input");
  checkbox.classList.add("checkbox");
  checkbox.type = "checkbox";
  checkbox.name = "myCheckbox";
  checkbox.value = "isChecked";
  checkboxElem.appendChild(checkbox);

  let buttonElem = document.createElement("td");
  let button = document.createElement("button");
  button.innerHTML = "&#10060";
  button.classList.add("delete-button");
  buttonElem.appendChild(button);

  parentElement.appendChild(taskElem);
  parentElement.appendChild(descriptionElem);
  parentElement.appendChild(dateStartElem);
  parentElement.appendChild(dateFinishElem);
  parentElement.appendChild(checkboxElem);
  parentElement.appendChild(buttonElem);

  tableBody.insertBefore(parentElement, tableBody.firstChild);
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.unshift(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
