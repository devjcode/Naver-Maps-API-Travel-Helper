const clock = document.querySelector('#clock');

function currentTimeListener() {
    const date = new Date();
    const h = String(date.getHours()).padStart(2,"0");
    const m = String(date.getMinutes()).padStart(2,"0");
    const s = String(date.getSeconds()).padStart(2,"0"); 
    
    clock.innerText = `${h}:${m}:${s}`;
}
currentTimeListener();
setInterval(currentTimeListener,1000);