// Ajusta el tamaño del contenedor del árbol cuando cambia el tamaño de la ventana.
function ajustarCanvas() {
    const canvas = document.getElementById("tree-canvas");
    const section = canvas.parentElement;

    const alturaDisponible = section.clientHeight - 32;
    const anchoDisponible  = section.clientWidth  - 32;

    canvas.style.width  = anchoDisponible  + "px";
    canvas.style.height = alturaDisponible + "px";
}

// Reajusta el canvas al redimensionar la ventana.
window.addEventListener("resize", ajustarCanvas);
ajustarCanvas();