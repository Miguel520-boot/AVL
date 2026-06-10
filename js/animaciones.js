// ── Configuración de animación ──────────────────────────────────────────
const BASE_ANIM_DURATION = 400;
let ANIM_DURATION = BASE_ANIM_DURATION;
let animQueue = [];
let isAnimating = false;
let currentSpeed = 1;

// Ajusta el tiempo de animación según la velocidad seleccionada.
function setSpeed(value) {
    currentSpeed = value;
    ANIM_DURATION = BASE_ANIM_DURATION / Math.max(value, 0.25);
    const speedValue = document.getElementById('speed-value');
    if (speedValue) speedValue.textContent = `${value.toFixed(2)}x`;
}

// Configura el control deslizante de velocidad.
const speedSlider = document.getElementById('speed-slider');
if (speedSlider) {
    speedSlider.addEventListener('input', e => {
        setSpeed(parseFloat(e.target.value));
    });
}

setSpeed(1);

// ── Control de botones y campos mientras se ejecutan animaciones ──
function disableControls() {
    document.querySelectorAll('.control-group button, #numero, #numero-eliminar').forEach(el => {
        if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
            el.disabled = true;
        }
    });
}

function enableControls() {
    document.querySelectorAll('.control-group button, #numero, #numero-eliminar').forEach(el => {
        if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
            el.disabled = false;
        }
    });
}

// ── Cola de animaciones ──────────────────────────────────────────
function encolar(tipo, datos) {
    animQueue.push({ tipo, datos });
}

async function ejecutarCola() {
    if (isAnimating) return;
    isAnimating = true;
    disableControls();

    while (animQueue.length > 0) {
        const { tipo, datos } = animQueue.shift();
        await ejecutarAnimacion(tipo, datos);
    }

    isAnimating = false;
    enableControls();
}

async function ejecutarAnimacion(tipo, datos) {
    switch(tipo) {
        case 'insertar':   await animInsertar(datos);   break;
        case 'rotacion':   await animRotacion(datos);   break;
        case 'recorrido':  await animRecorrido(datos);  break;
        case 'eliminar':   await animEliminar(datos);   break;
        default: break;
    }
}

// Resalta una secuencia de nodos uno por uno y muestra un label opcional.
async function highlightSequence(valores, clase, label) {
    if (label) mostrarLabel(label);
    for (const valor of valores) {
        resaltarNodo(valor, clase);
        await esperar(ANIM_DURATION);
        quitarResaltado(valor, clase);
        await esperar(Math.max(ANIM_DURATION / 4, 75));
    }
    if (label) ocultarLabel();
}

// ── Animaciones específicas ────────────────────────────────────────
async function animInsertar(datos) {
    const { valor } = datos;
    resaltarNodo(valor, 'nodo-nuevo');
    await esperar(ANIM_DURATION * 2);
    quitarResaltado(valor, 'nodo-nuevo');
}

async function animEliminar(datos) {
    const { valor } = datos;
    resaltarNodo(valor, 'nodo-eliminar');
    await esperar(ANIM_DURATION * 2);
    quitarResaltado(valor, 'nodo-eliminar');
}

async function animRotacion(datos) {
    const { nodos, tipo } = datos;

    mostrarLabel(`Rotación ${tipo}`);
    nodos.forEach(v => resaltarNodo(v, 'nodo-rotacion'));
    await esperar(ANIM_DURATION * 3);
    nodos.forEach(v => quitarResaltado(v, 'nodo-rotacion'));
    ocultarLabel();
}

async function animRecorrido(datos) {
    const { orden } = datos;
    await highlightSequence(orden, 'nodo-recorrido', 'Recorrido');
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

// Realiza una animación de búsqueda en el árbol mostrando cada nodo del camino.
async function animarBusqueda(valor, texto) {
    const camino = [];
    let nodo = arbol.raiz;

    while (nodo) {
        camino.push(nodo.valor);
        if (valor === nodo.valor) break;
        nodo = valor < nodo.valor ? nodo.Izquierdo : nodo.Derecho;
    }

    if (camino.length > 0) {
        await highlightSequence(camino, 'nodo-search', texto);
    }
}

// Actualiza el texto del resultado del recorrido en pantalla.
function mostrarResultadoRecorrido(tipo, orden) {
    const resultadoEl = document.getElementById('recorrido-result');
    if (!resultadoEl) return;
    const nombre = tipo === 'inorden'
        ? 'Inorden'
        : tipo === 'preorden'
            ? 'Preorden'
            : 'Postorden';
    resultadoEl.textContent = `${nombre} → ${orden.join(', ')}`;
}

// Ejecuta un recorrido del árbol y encola la animación asociada.
function ejecutarRecorrido(tipo) {
    if (isAnimating) return;
    if (!arbol.raiz) {
        mostrarResultadoRecorrido(tipo, []);
        return;
    }

    let orden = [];
    if (tipo === 'inorden')   orden = inorden(arbol.raiz);
    if (tipo === 'preorden')  orden = preorden(arbol.raiz);
    if (tipo === 'postorden') orden = postorden(arbol.raiz);

    mostrarResultadoRecorrido(tipo, orden);
    encolar('recorrido', { orden });
    ejecutarCola();
}

function ocultarLabel() {
    const label = document.getElementById('anim-label');
    if (label) label.classList.remove('visible');
}

// ── Recorridos de árbol ───────────────────────────────────────────
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