modalWrap = null

//Display Tasks from the LocalStorage
const printTasks = () => {
    const taskslistContainer = document.querySelector(".tasks")
    let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))
    taskslistContainer.innerHTML = ""

    if (tasksList.length != 0) {
        document.getElementById("head").classList.remove("d-none")
        tasksList.forEach(task => {
            var taskDate = new Date(task.deadline)
            var taskDateString
            taskDateString = ('0' + taskDate.getDate()).slice(-2) + '.'
            + ('0' + (taskDate.getMonth()+1)).slice(-2) + '.'
            + taskDate.getFullYear()
            
            taskslistContainer.innerHTML += `
            <div class="col mb-4">
                <div id="task-${tasksList.indexOf(task)}" class="task card col mb-4 h-100 shadow ${task.done ? "done" : "" }
                ">
                    <div class="card-head p-3 d-flex justify-content-between">
                        <span class="bg-info text-white px-2 py-1 rounded">Task</span>
                        <div>
                            <button onclick="favTask(${tasksList.indexOf(task)})" class="border-0 bg-transparent p-0 favTaskBtn">
                                <i class="bi bi-bookmark pe-2 FavIcon"></i>
                            </button>
                            <button class="border-0 bg-transparent p-0 editTaskBtn" onclick="showEditModal(${tasksList.indexOf(task)})"><i class="bi bi-three-dots-vertical" ></i></button>
                        </div>
                    </div>
                    <div class="card-body p-4 d-flex flex-column justify-content-between">
                        <div>
                            <img src=${task.image} class="card-img-top border p-1" style="object-fit: cover" alt="${task.taskName}">
                            <h2 class="card-title text-center my-3">${task.taskName}</h2>
                            <p class="m-0">${task.description}</p>
                        </div>
                        <div>
                            <div class="float-left taskDeadline">
                                <i class="bi bi-calendar3"></i>
                                <span>Deadline: </span>
                                <span>${taskDateString}</span>
                            </div>
                            <div class="text-end">
                                <hr>
                                <button onclick="showDelModal(${tasksList.indexOf(task)})" class="btn btn-danger">
                                    <i class="bi bi-trash"></i>
                                    Delete
                                </button>
                                <button onclick="taskDone(${tasksList.indexOf(task)})" class="btn btn-success">
                                    <i class="bi bi-check-circle"></i>
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
            if (taskDate == "Invalid Date") {
                taskDeadline = document.querySelectorAll(".taskDeadline")
                taskDeadline[tasksList.indexOf(task)].classList.add("d-none")
            }
        })
    } else {
        taskslistContainer.innerHTML = `
            <h2 class="h2 w-100 mt-5 text-success text-center">Nothing to work on right now, you are good to go!</h2>
        `
        document.getElementById("head").classList.toggle("d-none")
    } 
}

// Add Task and save to LocalStorage
const showAddModal = () => {
    if (modalWrap !== null) {
        modalWrap.remove()
    }

    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
        <div class="modal fade" id="addModal" tabindex="-1" aria-labelledby="addTaskLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addTaskLabel">Add new Task</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="addTaskForm">
                            <input type="text" autofocus class="form-control w-100 mb-3" name="title" id="title"
                                placeholder="Title" required>
                            <input type="text" class="form-control w-100 mb-3" name="description" id="desc" required
                                placeholder="Description">
                            <input class="form-control w-100 mb-3" type="date" name="dl" id="dl"
                                placeholder="MM/DD/YYYY" onfocus="(this.type='date')"" required>
                            <input type="text" class="form-control w-100 mb-3" name="img" id="img"
                                placeholder="Link to an image" required>
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                <button class="btn btn-success" id="addTaskBtn" data-bs-dismiss="modal">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
    document.body.append(modalWrap)
    var modal = new bootstrap.Modal(document.getElementById('addModal'))
    modal.show()
    var addTaskModal = document.getElementById('addModal')
    var addTaskModalInput = document.getElementById('title')
    addTaskModal.addEventListener('shown.bs.modal', function () {
        addTaskModalInput.focus()
    })
    document.getElementById("addTaskBtn").addEventListener("click", e => {
        e.preventDefault()
        var imgurl
        if (document.getElementById("img").value == 0) {
            imgurl = "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=991&q=80"
        } else {
            imgurl = document.getElementById("img").value
        }
    
        localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), {
            taskName: document.getElementById("title").value,
            image: imgurl,
            description: document.getElementById("desc").value,
            deadline: document.getElementById("dl").value,
            done: false
        }]))
        
        document.getElementById("title").value = ""
        document.getElementById("desc").value = ""
        document.getElementById("dl").value = ""
        document.getElementById("img").value = ""
    
        printTasks()
        HideUnfinished()
        ShowFav()
    })
}

//Edit Task and save in LocalStorage
const showEditModal = (id) => {
    if (modalWrap !== null) {
        modalWrap.remove()
    }

    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editTaskLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editTaskLabel">Edit Task</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editTaskForm">
                            <input type="text" autofocus class="form-control w-100 mb-3" name="editTaskTitle"
                                id="editTaskTitle" placeholder="Title">
                            <input type="text" class="form-control w-100 mb-3" name="editTaskDescription"
                                id="editTaskDescription" placeholder="Description">
                            <input class="form-control w-100 mb-3" type="date" name="editTaskDl" id="editTaskDl"
                                placeholder="dd.mm.yyyy">
                            <input type="text" class="form-control w-100 mb-3" name="editTaskImg" id="editTaskImg"
                                placeholder="Link to an image">
                            <div class="d-flex justify-content-between">
                                <button class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                                <button class="btn btn-success" id="editTaskBtn" data-bs-dismiss="modal">Save
                                    changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
    document.body.append(modalWrap)

    var modal = new bootstrap.Modal(document.getElementById('editModal'))
    modal.show()
    var editTaskModal = document.getElementById('editModal')
    var editTaskModalInput = document.getElementById('editTaskTitle')
    editTaskModal.addEventListener('shown.bs.modal', function () {
        editTaskModalInput.focus()
    })  
    

    let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))
    task = tasksList[id]

    var editTaskTitle = document.getElementById("editTaskTitle")
    var editTaskDescription = document.getElementById("editTaskDescription")
    var editTaskDl = document.getElementById("editTaskDl")
    var editTaskImg = document.getElementById("editTaskImg")
        
    editTaskTitle.value = task.taskName
    editTaskDescription.value = task.description
    editTaskDl.value = task.deadline
    editTaskImg.value = task.image

    document.getElementById("editTaskBtn").addEventListener("click", function (e) {
        e.preventDefault()

        var imgurl
        if (editTaskImg.value == 0) {
            imgurl = "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=991&q=80"
        } else {
            imgurl = editTaskImg.value
        }
        
        task.taskName = editTaskTitle.value
        task.description = editTaskDescription.value
        task.deadline = editTaskDl.value
        task.image = imgurl
    
        localStorage.setItem("tasks", JSON.stringify(tasksList))
        printTasks()
        HideUnfinished()
        ShowFav()
    })
}

//Remove Task from the LocalStorage
const showDelModal = (id) => {
  if (modalWrap !== null) {
    modalWrap.remove()
  }

  modalWrap = document.createElement('div')
  modalWrap.innerHTML = `
        <div class="modal fade delModal" id="delModal" tabindex="-1" aria-labelledby="delTaskLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="delTaskLabel">Delete Task </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete this Task?</p>
                        <div class="d-flex justify-content-between">
                            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button class="btn btn-danger" id="delTaskBtn" data-bs-dismiss="modal">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    document.body.append(modalWrap)
    delTaskBtn = document.getElementById("delTaskBtn")
    delTaskBtn.addEventListener("click", function () {
        let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))
        tasksList.splice(id, 1)
        localStorage.setItem("tasks", JSON.stringify(tasksList))
        printTasks()
        HideUnfinished()
        ShowFav()
    })

    var modal = new bootstrap.Modal(document.getElementById('delModal'))
    modal.show()
}

//Mark Task as done
const taskDone = (id) => {
    document.getElementById("task-" + id).classList.toggle("done")
    let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))
    task = tasksList[id]
    task.done = !task.done
    localStorage.setItem("tasks", JSON.stringify(tasksList))
}

//Hide finished Tasks via Button
isTaskDone = false
hideFinishedTasks = () => {
    hideFinishedTasksBtn = document.getElementById("hideFinishedTasksBtn")
    isTaskDone = !isTaskDone
    
    if (isTaskDone) {
        HideUnfinished()
        ShowFav()
    } else if (!isTaskDone) {
        hideFinishedTasksBtn.innerHTML = "Hide finished tasks"
        printTasks()
        ShowFav()
    } else {
        null
    }
}

// when hide done tasks is set then show only unfinished tasks
HideUnfinished = () => {
    if (isTaskDone) {
        hideFinishedTasksBtn.innerHTML = "Show all tasks"
        finishedTasks = document.querySelectorAll(".done")
        finishedTasks.forEach(task => {
            task.parentNode.classList.toggle("finishedTaskParent")
        })
    }
}

// Hide favorite Tasks via Button
isTaskHidden = false
hideFavTasks = () => {
    hideFavTasksBtn = document.getElementById("hideFavTasksBtn")
    isTaskHidden = !isTaskHidden
    
    if (isTaskHidden) {
        hideFavTasksBtn.innerHTML = "Show all tasks"
        ShowFav()
    } else if (!isTaskHidden) {
        hideFavTasksBtn.innerHTML = "Only show favorite tasks"
        printTasks()
        ShowFav()
    } else {
        null
    }
}

// Add Task to favourites functionality
const favTask = (id) => {
    taskNode = document.getElementById("task-" + id)
    let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))
    task = tasksList[id]
    FavIcon = taskNode.querySelectorAll(".FavIcon")
    task.fav = !task.fav

    if (task.fav) {
        FavIcon[0].classList.remove("bi-bookmark")
        FavIcon[0].classList.add("bi-bookmark-fill")
    } else {
        FavIcon[0].classList.remove("bi-bookmark-fill")
        FavIcon[0].classList.add("bi-bookmark")
    }

    localStorage.setItem("tasks", JSON.stringify(tasksList))
}

ShowFav = () => {
    let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))
    tasksList.forEach(task => {
        taskNode = document.getElementById("task-" + tasksList.indexOf(task))
        FavIcon = taskNode.querySelectorAll(".FavIcon")
        if (task.fav) {
            FavIcon[0].classList.remove("bi-bookmark")
            FavIcon[0].classList.add("bi-bookmark-fill")
        } else {
            FavIcon[0].classList.remove("bi-bookmark-fill")
            FavIcon[0].classList.add("bi-bookmark")
        }
    });
}

//Open Introduction Modal when page is loaded for the first time
if (sessionStorage.getItem("PageVisitedBefore") === null) {
    document.addEventListener('DOMContentLoaded', function () {
        startModal()
    }, false)

    const startModal = () => {
    if (modalWrap !== null) {
        modalWrap.remove()
    }

    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
            <div class="modal fade" id="startModal" tabindex="-1" aria-labelledby="startModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editTaskLabel">Tasks App</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>This Tasks App is created with vanilla JS and has following functionalities:</p>
                            <ul class="">
                                <li class="">Creating a task and save it in the Local Storage</li>
                                <li class="">Edit existing Tasks and save it</li>
                                <li class="">Mark Tasks as done and filter</li>
                                <li class="">Save Tasks to favourites and filter</li>
                                <li class="">Delete Tasks</li>
                            </ul>
                            <div class="d-flex justify-content-end">
                                <button class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        document.body.append(modalWrap)
        var modal = new bootstrap.Modal(document.getElementById('startModal'))
        modal.show()
    }
    sessionStorage.setItem("PageVisitedBefore", true)
}

printTasks()
ShowFav()