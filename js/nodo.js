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

    agregarNodo() {

        let dato = parseInt(
            document.getElementById("numero").value
        );

        let nuevoNodo = new Nodo(dato);

     
        if(this.raiz == null) {

            this.raiz = nuevoNodo;
        }
        else {

            if(dato > this.raiz.valor) {

                this.raiz.setDerecha(nuevoNodo);
            }
            else {

                this.raiz.setIzquierda(nuevoNodo);
            }
        }

        console.log(this.raiz);
    }
}

const arbol = new AVL();

