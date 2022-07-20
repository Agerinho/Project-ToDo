const taskslistContainer = document.querySelector(".tasks")

const printTasks = () => {
    if (localStorage.getItem("tasks") == null) return
    let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))

    taskslistContainer.innerHTML = ""
    tasksList.reverse().forEach(task => {
        taskslistContainer.innerHTML += `
        <div class="col mb-4">
            <div class="card h-100 shadow animate__animated animate__fadeIn">
                <div class="card-head p-3 d-flex justify-content-between">
                    <span class="bg-info text-white px-2 py-1 rounded">Task</span>
                    <div class="">
                        <i class="bi bi-bookmark pe-2" role="button"></i>
                        <i class="bi bi-three-dots-vertical" role="button"></i>
                    </div>
                </div>
                <div class="card-body p-4 d-flex flex-column">
                    <img src=${task.image} class="card-img-top border p-1" style="object-fit: cover" alt="${task.taskName}">
                    <h2 class="card-title text-center my-3">${task.taskName}</h2>
                    <p class="m-0">${task.description}</p>
                
                    <hr>

                    <!-- <div class="float-left mb-3 mt-auto">
                        <hr>
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        <span>Priority level: </span>
                        <span class="btn text-white btn-success importance p-1 rounded priorityBtn" role="button">${task.importance}</span>
                    </div> -->

                    <div class="float-left">
                        <i class="bi bi-calendar3"></i>
                        <span>Deadline: </span>
                        <span>${task.deadline}</span>
                    </div>
                    <div class="text-end">
                        <hr>
                        <button onclick="removeTask(${tasksList.indexOf(task)})" class="btn btn-danger">
                            <i class="bi bi-trash"></i>
                            Delete
                        </button>
                        <button class="btn btn-success">
                            <i class="bi bi-check-circle"></i>
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `
    })
    // increasePriority()
    // priorityColor()
}

// const increasePriority = () => {
//     let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))

//     const priorityBtn = document.querySelectorAll(".priorityBtn")
//     priorityBtn.forEach((btn, i) => {
//         btn.addEventListener("click", () => {
//             tasksList[i].importance++
//             btn.innerHTML = tasksList[i].importance
//             priorityColor()
//         })
//     })
// }

// const priorityColor = () => {
//     let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))

//     const priorityBtn = document.querySelectorAll(".priorityBtn")
//     priorityBtn.forEach((btn, i) => {
//         if (tasksList[i].importance == 0) {
//             btn.classList.remove("btn-danger", "btn-warning")
//             btn.classList.add("btn-success")
//         }
//         else if (tasksList[i].importance <= 2) {
//             btn.classList.remove("btn-danger", "btn-success")
//             btn.classList.add("btn-warning")
//         } else if (tasksList[i].importance >= 3) {
//             btn.classList.remove("btn-warning", "btn-success")
//             btn.classList.add("btn-danger")
//         }
//         if (tasksList[i].importance == 6) {
//             tasksList[i].importance = 0
//             btn.classList.remove("btn-warning", "btn-danger")
//             btn.classList.add("btn-success")
//             btn.innerHTML = tasksList[i].importance
//         }
//     })
// }

// const sortTasks = () => {
//     let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))

//     var icon = document.getElementById("sortIcon")

//     if (icon.className === "bi bi-sort-up") {
//         icon.className = "bi bi-sort-down"
//         tasksList.sort(function (a, b) {
//             return b.importance - a.importance
//         })
//     } else {
//         icon.className = "bi bi-sort-up"
//         tasksList.sort(function (a, b) {
//             return a.importance - b.importance
//         })
//     }

//     printTasks()
//     increasePriority()
//     priorityColor()
// }

const removeTask = (id) => {
    let tasksList = Array.from(JSON.parse(localStorage.getItem("tasks")))

    console.log(tasksList)
    tasksList.splice(tasksList.indexOf(id), 1)
    localStorage.setItem("tasks", JSON.stringify(tasksList))
    printTasks()
    // increasePriority()
    // priorityColor()
}

const addTask = () => {

    localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), {
        taskName: document.getElementById("title").value,
        image: document.getElementById("img").value,
        description: document.getElementById("desc").value,
        // importance: document.getElementById("prio").value,
        deadline: document.getElementById("dl").value
    }]))

    console.log(localStorage)

    document.getElementById("title").value = ""
    document.getElementById("desc").value = ""
    // document.getElementById("prio").value = "0"
    document.getElementById("dl").value = ""
    document.getElementById("img").value = ""

    printTasks()
    // increasePriority()
    // priorityColor()
}

document.getElementById("addTaskBtn").addEventListener("click", e => {
    e.preventDefault()
    addTask()
})

printTasks()