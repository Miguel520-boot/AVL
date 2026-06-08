class Nodo {

    constructor(valor) {

        this.valor = valor;

        this.Izquierdo = null;

        this.Derecho = null;

        this.Altura = 1;
    }

    getIzquierda() {
        return this.Izquierdo;
    }

    getDerecha() {
        return this.Derecho;
    }

    setIzquierda(nodo) {
        this.Izquierdo = nodo;
    }

    setDerecha(nodo) {
        this.Derecho = nodo;
    }
}


class AVL {

    constructor() {

        this.raiz = null;
    }

    async agregarNodo() {

    if (isAnimating) return;

    let dato = parseInt(
        document.getElementById("numero").value
    );

    if (isNaN(dato)) {
        alert("Por favor ingresa un número válido.");
        return;
    }

    disableControls();
    if (this.raiz && this.buscar(this.raiz, dato)) {
        await animarBusqueda(dato, 'Buscando');
        alert('El valor ya existe en el árbol.');
        enableControls();
        return;
    }

    if (this.raiz) {
        await animarBusqueda(dato, 'Insertando');
    }

    if (this.raiz == null)
        this.raiz = new Nodo(dato);
    else
        this.raiz = this.insertar(this.raiz, dato);

    document.getElementById("numero").value = "";
    renderTree();
    encolar('insertar', { valor: dato });
    await ejecutarCola();
}

buscar(nodo, valor) {
    if (!nodo) return false;
    if (valor === nodo.valor) return true;
    return valor < nodo.valor
        ? this.buscar(nodo.Izquierdo, valor)
        : this.buscar(nodo.Derecho, valor);
}

async eliminarNodo() {
    const dato = parseInt(
        document.getElementById('numero-eliminar').value
    );

    if (isNaN(dato)) {
        alert('Por favor ingresa un número válido para eliminar.');
        return;
    }

    if (!this.raiz) {
        alert('El árbol está vacío.');
        return;
    }

    if (!this.buscar(this.raiz, dato)) {
        alert('No existe ese nodo en el árbol.');
        return;
    }

    disableControls();
    await animarBusqueda(dato, 'Eliminando');

    this.raiz = this.eliminar(this.raiz, dato);
    document.getElementById('numero-eliminar').value = '';
    renderTree();
    encolar('eliminar', { valor: dato });
    await ejecutarCola();
}
}

const arbol = new AVL();

