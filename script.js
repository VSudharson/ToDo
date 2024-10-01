//Get Data From Local Storage
function getTasks() {
    let tasks = [];
    if(localStorage.getItem("tasks")){
        tasks=JSON.parse(localStorage.getItem("tasks"));
    }
    return tasks;
}

//Variable Declaration
const myModalElement = document.getElementById("MyModal");
const myModal = new bootstrap.Modal(myModalElement);
const btnAdd = document.getElementById("btnAdd");
const txtTask = document.getElementById("task");
const selectStatus = document.getElementById("status");
const taskForm = document.getElementById("taskForm");
const btnSave = document.getElementById("btnSave");
const modalTitle = document.querySelector(".modal-title");
const searchInput = document.querySelector("#searchInput");

btnAdd.addEventListener("click", function () {
    document.querySelector(".modal-title").innerHTML = "Add New Task";
    txtTask.value = "";
    selectStatus.value = "";
    myModal.show();
});

//Render Task Details in Table Format
function renderTasks(isForSearch = 0, filteredTask = []) {
    let tasks = [];
    if(isForSearch == 0){
        tasks = getTasks();
    }
    else{
        tasks = filteredTask;
    }

    const taskList=document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const row = `
            <tr>
                <td>${index+1}</td>
                <td>${task.taskName}</td>
                <td>${task.status}</td>
                <td>
                    <button class="btn btn-sm btn-success" onclick="editTask(${task.id})">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        taskList.innerHTML+=row;
    });    
}

//Save Task Details in Local Storage
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Delete Task
function deleteTask(taskId){
    if (confirm("Are you sure want to delete.")){
        const tasks = getTasks();
        const updatedTasks=tasks.filter((task) => task.id != taskId);
        saveTasks(updatedTasks);
        renderTasks();
    }
}

//Form Data Submission
taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const taskname = txtTask.value;
    const selectedStatus = selectStatus.value;
    const taskId = Number(btnSave.getAttribute("data-taskid"));
    
    if(taskname && selectedStatus) {
        if(taskId) {
            //Task Need to Update
            updateTask(taskId, taskname, selectedStatus);
        }
        else {
            //Task Need to Add
            addTask(taskname, selectedStatus);
        }
        myModal.hide();
    }
    else{
        alert("Please enter task name and select status.")
    }
});

//Add New Task
function addTask(taskName, status) {
    const tasks = getTasks();
    const newTask = {
        id:Date.now(),
        taskName,
        status,
    };
    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
}

//Update Existing Task
function updateTask(id, taskName, status) {
    const tasks = getTasks();
    const updatedTasks = tasks.map((task) => {
        if(task.id == id){
            task.taskName = taskName;
            task.status = status;
        }
        return task;
    });
    saveTasks(updatedTasks);
    renderTasks();
}

//Edit Task
function editTask(id) {
    const tasks = getTasks();
    const task=tasks.find((task) => task.id === id);
    if(task) {
        txtTask.value = task.taskName;
        selectStatus.value = task.status;
        btnSave.setAttribute("data-taskid",task.id);
        modalTitle.innerHTML = "Update Task";
        myModal.show();
    }
}

//Search Function
searchInput.addEventListener("input", function () {
    const searchQuery = this.value.toLowerCase();
    const tasks = getTasks();
    const filteredTasks = tasks.filter((tasks) => tasks.taskName.toLowerCase().includes(searchQuery));
    renderTasks(1, filteredTasks);
    
});

//Initial Call
renderTasks();