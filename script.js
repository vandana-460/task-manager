// Store Tasks
let taskBucket =
JSON.parse(localStorage.getItem('daily_tasks')) || [];

// Current Filter
let currentView = 'all';

// Elements
const taskForm =
document.getElementById('task-form');

const taskInput =
document.getElementById('new-item-input');

const taskList =
document.getElementById('master-task-list');

const filterBox =
document.getElementById('status-filter');

// Save Tasks
function saveTasks(){

    localStorage.setItem(
        'daily_tasks',
        JSON.stringify(taskBucket)
    );
}

// Show Tasks
function renderTasks(){

    taskList.innerHTML = '';

    const filteredTasks =
    taskBucket.filter(task => {

        if(currentView === 'active'){
            return !task.completed;
        }

        if(currentView === 'completed'){
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p>No tasks available</p>';
    return;
}

    filteredTasks.forEach(task => {

        const taskRow =
        document.createElement('li');

        taskRow.className =
      `row-item ${task.completed ? 'done' : ''}`

        taskRow.setAttribute(
            'data-id',
            task.id
        );

        taskRow.innerHTML = `

            <input
                type="checkbox"
                class="check-task"
                ${task.completed ? 'checked' : ''}
            >

            <span class="task-text">
                ${task.name}
            </span>

            <div class="btn-group">

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(taskRow);
    });
}

// Add Task
taskForm.addEventListener('submit', function(event){

    event.preventDefault();

    const cleanValue =
    taskInput.value.trim();

    if(cleanValue === ''){
        alert('Enter a task');
        return;
    }

    const newTask = {

        id:
        'task_' +
        Math.random().toString(36).substring(2,9),

        name: cleanValue,

        completed:false
    };

    taskBucket.push(newTask);

    saveTasks();

    renderTasks();

    taskInput.value = '';
});

// Task Actions
taskList.addEventListener('click', function(event){

    const clickedItem = event.target;

    const parentTask =
    clickedItem.closest('.row-item');

    if(!parentTask) return;

    const selectedId =
    parentTask.getAttribute('data-id');

    // Complete Task
    if(clickedItem.classList.contains('check-task')){

        taskBucket = taskBucket.map(task => {

            if(task.id === selectedId){

                return {
                    ...task,
                    completed: clickedItem.checked
                };
            }

            return task;
        });

        saveTasks();

        renderTasks();
    }

    // Delete Task
    if(clickedItem.classList.contains('delete-btn')){

        taskBucket =
        taskBucket.filter(task =>
            task.id !== selectedId
        );

        saveTasks();

        renderTasks();
    }

    // Edit Task
    if(clickedItem.classList.contains('edit-btn')){

        const currentTask =
        taskBucket.find(task =>
            task.id === selectedId
        );

        if(!currentTask) return;

        const updatedText = prompt(
            'Edit task',
            currentTask.name
        );

        if(
            updatedText !== null &&
            updatedText.trim() !== ''
        ){

            taskBucket = taskBucket.map(task => {

                if(task.id === selectedId){

                    return {
                        ...task,
                        name: updatedText.trim()
                    };
                }

                return task;
            });

            saveTasks();

            renderTasks();
        }
    }
});

// Filter
filterBox.addEventListener('change', function(event){

    currentView = event.target.value;

    renderTasks();
});

// Initial Load
renderTasks();
