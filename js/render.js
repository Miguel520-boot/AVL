const NODE_R  = 16;
const LEVEL_H = 52;

function calcPos(nodo, minX, maxX, y, map) {
    if (!nodo) return;
    const cx = (minX + maxX) / 2;
    map.set(nodo, { x: cx, y });
    calcPos(nodo.Izquierdo, minX, cx, y + LEVEL_H, map);
    calcPos(nodo.Derecho,   cx, maxX, y + LEVEL_H, map);
}

function contarNodos(n) {
    return n ? 1 + contarNodos(n.Izquierdo) + contarNodos(n.Derecho) : 0;
}

function alturaArbol(n) {
    return n ? 1 + Math.max(alturaArbol(n.Izquierdo), alturaArbol(n.Derecho)) : 0;
}

function renderTree() {
    const svgEl   = document.getElementById("svg");
    const emptyEl = document.getElementById("empty-msg");
    const canvas  = document.getElementById("tree-canvas");

    if (!arbol.raiz) {
        svgEl.innerHTML = "";
        svgEl.removeAttribute("viewBox");
        svgEl.style.width  = "0";
        svgEl.style.height = "0";
        emptyEl.style.display = "flex";
        document.getElementById("count").textContent       = "0";
        document.getElementById("tree-height").textContent = "—";
        return;
    }

    emptyEl.style.display = "none";

    const h      = alturaArbol(arbol.raiz);
    const W      = Math.max(160, Math.pow(2, h) * (NODE_R * 2 + 6));
    const H      = h * LEVEL_H + NODE_R * 2 + 20;

    const pos = new Map();
    calcPos(arbol.raiz, 0, W, NODE_R + 16, pos);

    let html = "";

    // Aristas
    pos.forEach((p, nodo) => {
        [nodo.Izquierdo, nodo.Derecho].forEach(hijo => {
            if (!hijo) return;
            const c = pos.get(hijo);
            html += `<line class="arista"
                x1="${p.x}" y1="${p.y}"
                x2="${c.x}" y2="${c.y}"/>`;
        });
    });

    // Nodos
    pos.forEach((p, nodo) => {
        html += `
            <g class="nodo">
                <circle cx="${p.x}" cy="${p.y}" r="${NODE_R}"/>
                <text x="${p.x}" y="${p.y}"
                    text-anchor="middle"
                    dominant-baseline="central">${nodo.valor}</text>
            </g>`;
    });

    // Ajusta el SVG al contenido exacto, sin espacio extra
    svgEl.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svgEl.style.width    = Math.min(W, canvas.clientWidth - 32) + "px";
    svgEl.style.height   = Math.min(H, canvas.clientHeight - 32) + "px";
    svgEl.innerHTML      = html;

    document.getElementById("count").textContent       = contarNodos(arbol.raiz);
    document.getElementById("tree-height").textContent = h;
}

document.getElementById("numero").addEventListener("keydown", e => {
    if (e.key === "Enter") arbol.agregarNodo();
});