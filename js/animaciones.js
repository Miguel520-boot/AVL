const ANIM_DURATION = 400;
let animQueue = [];
let isAnimating = false;

// ── Cola de animaciones ──────────────────────────────────

function encolar(tipo, datos) {
    animQueue.push({ tipo, datos });
}

async function ejecutarCola() {
    if (isAnimating) return;
    isAnimating = true;

    while (animQueue.length > 0) {
        const { tipo, datos } = animQueue.shift();
        await ejecutarAnimacion(tipo, datos);
    }

    isAnimating = false;
}

async function ejecutarAnimacion(tipo, datos) {
    return new Promise(resolve => {
        switch(tipo) {
            case 'insertar':   animInsertar(datos, resolve);   break;
            case 'rotacion':   animRotacion(datos, resolve);   break;
            case 'recorrido':  animRecorrido(datos, resolve);  break;
            default: resolve();
        }
    });
}

// ── Animación: nodo nuevo ────────────────────────────────

function animInsertar(datos, resolve) {
    const { valor } = datos;
    resaltarNodo(valor, 'nodo-nuevo');
    setTimeout(() => {
        quitarResaltado(valor, 'nodo-nuevo');
        resolve();
    }, ANIM_DURATION * 2);
}

// ── Animación: rotación ──────────────────────────────────

function animRotacion(datos, resolve) {
    const { nodos, tipo } = datos;

    mostrarLabel(`Rotación ${tipo}`);

    nodos.forEach(v => resaltarNodo(v, 'nodo-rotacion'));

    setTimeout(() => {
        nodos.forEach(v => quitarResaltado(v, 'nodo-rotacion'));
        ocultarLabel();
        resolve();
    }, ANIM_DURATION * 3);
}

// ── Animación: recorrido ─────────────────────────────────

async function animRecorrido(datos, resolve) {
    const { orden } = datos;

    for (let i = 0; i < orden.length; i++) {
        resaltarNodo(orden[i], 'nodo-recorrido');
        await esperar(ANIM_DURATION);
        quitarResaltado(orden[i], 'nodo-recorrido');
        await esperar(100);
    }

    resolve();
}

// ── Helpers ──────────────────────────────────────────────

function esperar(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function resaltarNodo(valor, clase) {
    const svgEl = document.getElementById('svg');
    const nodos = svgEl.querySelectorAll('.nodo');
    nodos.forEach(g => {
        const txt = g.querySelector('text');
        if (txt && parseInt(txt.textContent) === valor) {
            g.classList.add(clase);
        }
    });
}

function quitarResaltado(valor, clase) {
    const svgEl = document.getElementById('svg');
    const nodos = svgEl.querySelectorAll('.nodo');
    nodos.forEach(g => {
        const txt = g.querySelector('text');
        if (txt && parseInt(txt.textContent) === valor) {
            g.classList.remove(clase);
        }
    });
}

function mostrarLabel(texto) {
    let label = document.getElementById('anim-label');
    if (!label) {
        label = document.createElement('div');
        label.id = 'anim-label';
        document.getElementById('tree-canvas').appendChild(label);
    }
    label.textContent = texto;
    label.classList.add('visible');
}

function ocultarLabel() {
    const label = document.getElementById('anim-label');
    if (label) label.classList.remove('visible');
}

// ── Recorridos ───────────────────────────────────────────

function inorden(nodo, resultado = []) {
    if (!nodo) return resultado;
    inorden(nodo.Izquierdo, resultado);
    resultado.push(nodo.valor);
    inorden(nodo.Derecho, resultado);
    return resultado;
}

function preorden(nodo, resultado = []) {
    if (!nodo) return resultado;
    resultado.push(nodo.valor);
    preorden(nodo.Izquierdo, resultado);
    preorden(nodo.Derecho, resultado);
    return resultado;
}

function postorden(nodo, resultado = []) {
    if (!nodo) return resultado;
    postorden(nodo.Izquierdo, resultado);
    postorden(nodo.Derecho, resultado);
    resultado.push(nodo.valor);
    return resultado;
}

function ejecutarRecorrido(tipo) {
    if (!arbol.raiz) return;

    let orden = [];
    if (tipo === 'inorden')   orden = inorden(arbol.raiz);
    if (tipo === 'preorden')  orden = preorden(arbol.raiz);
    if (tipo === 'postorden') orden = postorden(arbol.raiz);

    encolar('recorrido', { orden });
    ejecutarCola();
}