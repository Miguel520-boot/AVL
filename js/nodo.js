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


     insertar(nodoActual, nuevoNodo) {

    // IZQUIERDA
    if(nuevoNodo.valor < nodoActual.valor) {

        if(nodoActual.Izquierdo == null) {

            nodoActual.Izquierdo = nuevoNodo;
        }
        else {

            this.insertar(
                nodoActual.Izquierdo,
                nuevoNodo
            );
        }
    }

    // DERECHA
    else {

        if(nodoActual.Derecho == null) {

            nodoActual.Derecho = nuevoNodo;
        }
        else {

            this.insertar(
                nodoActual.Derecho,
                nuevoNodo
            );
        }
    }
}

agregarNodo() {

    let dato = parseInt(
        document.getElementById("numero").value
    );

    if (isNaN(dato)) {
        alert("Por favor ingresa un número válido.");
        return;
    }

    if (this.raiz == null)
        this.raiz = new Nodo(dato);
    else
        this.raiz = this.insertar(this.raiz, dato);

    document.getElementById("numero").value = "";
    renderTree();
    encolar('insertar', { valor: dato }); 
    ejecutarCola(); 
}
}

const arbol = new AVL();

