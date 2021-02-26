function setup () {
    setInterval(changeBackground, 500);
}
function changeBackground () {
    console.log(document.body.style.backgroundColor);
    if (document.body.style.backgroundColor == "rgb(255, 0, 0)") {
        document.body.style.backgroundColor = "rgb(255, 165, 0)";
    } else {
        document.body.style.backgroundColor = "rgb(255, 0, 0)";
    }
}
window.onload = setup;