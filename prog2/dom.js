let clickCount = 0;
function clickHandler(evt) {
    clickCount++;
    console.log(evt);
    const str = "Thanks for clicking " + clickCount;
    this.innerText = str;
}

function bodyClick(evt) {

    console.log("Clicked at X: " + evt.pageX + ", Y: " + evt.pageY);

}

window.onclick = bodyClick;


let p = document.getElementById("knopfi");
p.addEventListener("click", clickHandler);