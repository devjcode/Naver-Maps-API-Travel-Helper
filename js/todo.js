const todoFrom = document.querySelector('#todo-form');
const todoInput = todoFrom.querySelector('input');
const todolistUL = document.querySelector('#todo-list');
let toDos = [];
const TODO_ARRAY_KEY = "todos";

function saveTodo() {
    localStorage.setItem(TODO_ARRAY_KEY,JSON.stringify(toDos));
}


function handleToDoSubmit(event) {
    event.preventDefault();
    const newToDo = todoInput.value;
    todoInput.value = '';
    const todoObj = {
        id:Date.now(),
        text:newToDo,
    };
    toDos.push(todoObj);
    paintToDo(todoObj);
    saveTodo();
}
function deleteTodo(event) {
    const deleteLi = event.target.parentElement;
    toDos = toDos.filter((toDo) => toDo.id !== parseInt(deleteLi.id));
    deleteLi.remove();
    saveTodo();
}
function paintToDo(newToDo) {
    const li = document.createElement('li');
    li.id = newToDo.id;
    const span = document.createElement('span');
    const button = document.createElement('button');
    span.innerText = newToDo.text;
    button.innerText = '❌';
    button.addEventListener('click', deleteTodo)
    li.appendChild(span);
    li.appendChild(button);
    
    todolistUL.appendChild(li);
}

todoFrom.addEventListener('submit',handleToDoSubmit);

const savedToDos = localStorage.getItem(TODO_ARRAY_KEY);

if(savedToDos != null) {
    const parsedToDos = JSON.parse(savedToDos);
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo);
}
