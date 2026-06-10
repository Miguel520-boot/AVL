// ── Utilidades del árbol AVL ──────────────────────────────────────────

// Devuelve la altura de un nodo o 0 si es null.
AVL.prototype.altura = function(nodo) {
    return nodo ? nodo.Altura : 0;
}

// Actualiza la altura de un nodo a partir de la altura de sus hijos.
AVL.prototype.actualizarAltura = function(nodo) {
    nodo.Altura = 1 + Math.max(
        this.altura(nodo.Izquierdo),
        this.altura(nodo.Derecho)
    );
}

// Calcula el factor de balance de un nodo. Positivo si el subárbol izquierdo es más alto.
AVL.prototype.balance = function(nodo) {
    return nodo
        ? this.altura(nodo.Izquierdo) - this.altura(nodo.Derecho)
        : 0;
}

// ── Rotaciones ──────────────────────────────────────────

// Rotación derecha para corregir un caso de desequilibrio izquierdo.
AVL.prototype.rotarDerecha = function(y) {
    encolar('rotacion', { nodos: [y.valor, y.Izquierdo.valor], tipo: 'derecha' });
    const x  = y.Izquierdo;
    const T2 = x.Derecho;

    x.Derecho   = y;
    y.Izquierdo = T2;

    this.actualizarAltura(y);
    this.actualizarAltura(x);

    return x;
}

// Rotación izquierda para corregir un caso de desequilibrio derecho.
AVL.prototype.rotarIzquierda = function(x) {
    encolar('rotacion', { nodos: [x.valor, x.Derecho.valor], tipo: 'izquierda' });
    const y  = x.Derecho;
    const T2 = y.Izquierdo;

    y.Izquierdo = x;
    x.Derecho   = T2;

    this.actualizarAltura(x);
    this.actualizarAltura(y);

    return y;
}

// ── Inserción balanceada ─────────────────────────────────

// Inserta un valor en el árbol y aplica rotaciones si es necesario.
AVL.prototype.insertar = function(nodo, valor) {

    if (!nodo) return new Nodo(valor);

    if (valor < nodo.valor)
        nodo.Izquierdo = this.insertar(nodo.Izquierdo, valor);
    else if (valor > nodo.valor)
        nodo.Derecho = this.insertar(nodo.Derecho, valor);
    else
        return nodo; // Duplicado, no se inserta.

    this.actualizarAltura(nodo);

    const b = this.balance(nodo);

    // Caso Izquierda-Izquierda: rotar derecha.
    if (b > 1 && valor < nodo.Izquierdo.valor)
        return this.rotarDerecha(nodo);

    // Caso Derecha-Derecha: rotar izquierda.
    if (b < -1 && valor > nodo.Derecho.valor)
        return this.rotarIzquierda(nodo);

    // Caso Izquierda-Derecha: rotar izquierda en hijo izquierdo y luego derecha.
    if (b > 1 && valor > nodo.Izquierdo.valor) {
        nodo.Izquierdo = this.rotarIzquierda(nodo.Izquierdo);
        return this.rotarDerecha(nodo);
    }

    // Caso Derecha-Izquierda: rotar derecha en hijo derecho y luego izquierda.
    if (b < -1 && valor < nodo.Derecho.valor) {
        nodo.Derecho = this.rotarDerecha(nodo.Derecho);
        return this.rotarIzquierda(nodo);
    }

    return nodo;
}

// Devuelve el nodo con el valor mínimo dentro de un subárbol.
AVL.prototype.minValueNode = function(nodo) {
    let actual = nodo;
    while (actual.Izquierdo) actual = actual.Izquierdo;
    return actual;
}

// Elimina un valor del árbol y rebalancea si es necesario.
AVL.prototype.eliminar = function(nodo, valor) {
    if (!nodo) return nodo;

    if (valor < nodo.valor)
        nodo.Izquierdo = this.eliminar(nodo.Izquierdo, valor);
    else if (valor > nodo.valor)
        nodo.Derecho = this.eliminar(nodo.Derecho, valor);
    else {
        // Nodo encontrado. Caso de uno o cero hijos.
        if (!nodo.Izquierdo || !nodo.Derecho) {
            nodo = nodo.Izquierdo || nodo.Derecho;
        } else {
            // Dos hijos: sustituir por el sucesor en orden.
            const sucesor = this.minValueNode(nodo.Derecho);
            nodo.valor = sucesor.valor;
            nodo.Derecho = this.eliminar(nodo.Derecho, sucesor.valor);
        }
    }

    if (!nodo) return nodo;

    this.actualizarAltura(nodo);
    const b = this.balance(nodo);

    if (b > 1 && this.balance(nodo.Izquierdo) >= 0)
        return this.rotarDerecha(nodo);

    if (b > 1 && this.balance(nodo.Izquierdo) < 0) {
        nodo.Izquierdo = this.rotarIzquierda(nodo.Izquierdo);
        return this.rotarDerecha(nodo);
    }

    if (b < -1 && this.balance(nodo.Derecho) <= 0)
        return this.rotarIzquierda(nodo);

    if (b < -1 && this.balance(nodo.Derecho) > 0) {
        nodo.Derecho = this.rotarDerecha(nodo.Derecho);
        return this.rotarIzquierda(nodo);
    }

    return nodo;
}