// Clase que representa un nodo en el árbol AVL.
// Cada nodo guarda un valor, referencias a sus hijos y su altura.
class Nodo {

    constructor(valor) {
        this.valor = valor;
        this.Izquierdo = null;
        this.Derecho = null;
        this.Altura = 1; // Altura para el cálculo de balance.
    }

    // Métodos de acceso para simplificar lectura de ramas.
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

// Clase que maneja el árbol AVL y sus operaciones.
class AVL {

    constructor() {
        this.raiz = null;
    }

    // Inserta un nodo nuevo a partir del valor ingresado en el formulario.
    // Incluye validación, animación de búsqueda y actualización de la vista.
    async agregarNodo() {
        if (isAnimating) return; // No insertar si ya hay animación en curso.

        let dato = parseInt(
            document.getElementById("numero").value
        );

        if (isNaN(dato) || dato === 0) {
            alert("Por favor ingresa un número válido.");
            return;
        }

        disableControls();

        // Si ya existe el valor, solo mostramos la animación de búsqueda.
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

    // Busca de manera recursiva un valor dentro del árbol.
    buscar(nodo, valor) {
        if (!nodo) return false;
        if (valor === nodo.valor) return true;
        return valor < nodo.valor
            ? this.buscar(nodo.Izquierdo, valor)
            : this.buscar(nodo.Derecho, valor);
    }

    // Elimina un valor del árbol si existe, incluyendo validación y animación.
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

// Instancia global del árbol AVL.
const arbol = new AVL();

