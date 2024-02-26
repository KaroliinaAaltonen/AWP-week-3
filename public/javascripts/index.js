document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submit-data');
    const nameInput = document.getElementById('input-name');
    const taskInput = document.getElementById('input-task');
    const msgP = document.getElementById('message');
    const searchBtn = document.getElementById('search');
    const searchInput = document.getElementById('search-name');
    const userP = document.getElementById('userdata');
    const deleteBtn = document.getElementById('delete-user');
    const deleteP = document.getElementById('deleteresponse');
    const todoP = document.getElementById('tododata');
    // Initially hide the delete button
    deleteBtn.style.visibility = 'hidden';
    deleteBtn.style.opacity = '0';
    let searchedUser = '';

    function setStates(leaveVisible) {
        if(leaveVisible === "msgP"){
            userP.textContent  ='';
            deleteP.textContent = '';
            todoP.textContent = '';
        }if(leaveVisible === "todoP"){
            userP.textContent  ='';
            deleteP.textContent = '';
            msgP.textContent = '';
        }if(leaveVisible === "deleteP"){
            userP.textContent  ='';
            todoP.textContent = '';
            msgP.textContent = '';
        }if(leaveVisible === "userP"){
            deleteP.textContent = '';
            todoP.textContent = '';
            msgP.textContent = '';
        }
    }
    submitBtn.addEventListener('click', function() {
        msgP.textContent = '';
        setStates("msgP");
        const name = nameInput.value;
        const task = taskInput.value;
        fetch('/todo', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, task })
        })
        .then(response => response.text())
        .then(msg => {
            msgP.textContent = msg;
            nameInput.value = '';
            taskInput.value = '';
        })
        .catch(error => console.error('Error with submit in index.js triggered:', error));
    });

    searchBtn.addEventListener('click', function() {
        userP.textContent = '';
        setStates("userP");
        const name = searchInput.value;
        fetch(`/user/${name}`, {
            method: "GET",
        })
        .then(response => {
            if (response.status === 404) {
                throw new Error(`User ${name} does not exist.`);
            }
            return response.json();
        })
        .then(data => {
            // Set user ID to userP
            userP.textContent = `Name: ${data.id}`;
            // calling todo formatting function
            formatTodos(data.todos);
            searchInput.value = '';
            searchedUser = name;
            // reveal delete button
            deleteBtn.style.visibility = 'visible';
            deleteBtn.style.opacity = '1';
        })
        .catch(error => {
            console.error('Error with search in index.js triggered:', error);
            deleteP.textContent = error.message;
            searchInput.value = '';
        });
    });    

    function formatTodos(todos){
        todoP.innerHTML = '';
        setStates("todoP");
        // Display each todo with a clickable element
        todos.forEach((todo, index) => {
            const todoElement = document.createElement('p');
            todoElement.innerHTML = `Task ${index + 1}: ${todo}`;
            todoElement.classList.add('delete-task');
            todoElement.addEventListener('click', () => deleteTask(index));
            todoP.appendChild(todoElement);
        });
    }

    function deleteTask(index) {
        // Remove the clicked task from the UI
        const taskToDelete = todoP.querySelector(`.delete-task:nth-child(${index + 1})`);
        taskToDelete.remove();
    
        fetch(`/user?name=${searchedUser}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index })
        })
        .then(response => response.text())
        .then(data => {
            if (data === "Task deleted") {
                // Task deleted successfully
                // No need to refresh todos as the deleted task is already removed from the UI
            } else {
                deleteP.textContent = "User not found";
            }
        })
        .catch(error => console.error('Error with task deletion in index.js triggered:', error));
    }

    deleteBtn.addEventListener('click', function() {
        todoP.innerHTML = '';
        setStates("deleteP");
        const name = searchedUser;
        fetch(`/delete/${name}`, {
            method: "DELETE",
        })
        .then(response => response.text())
        .then(data => {
            deleteP.textContent = data;
            // hide delete button
            deleteBtn.style.visibility = 'hidden';
            deleteBtn.style.opacity = '0';
        })
        .catch(error => console.error('Error with delete in index.js triggered:', error));
    })
});