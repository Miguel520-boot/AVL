function ajustarCanvas() {
    const canvas = document.getElementById("tree-canvas");
    const section = canvas.parentElement;

    const alturaDisponible = section.clientHeight - 32;
    const anchoDisponible  = section.clientWidth  - 32;

    canvas.style.width  = anchoDisponible  + "px";
    canvas.style.height = alturaDisponible + "px";
}

window.addEventListener("resize", ajustarCanvas);
ajustarCanvas();