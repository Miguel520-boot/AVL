// ── Utilidades ──────────────────────────────────────────

AVL.prototype.altura = function(nodo) {
    return nodo ? nodo.Altura : 0;
}

AVL.prototype.actualizarAltura = function(nodo) {
    nodo.Altura = 1 + Math.max(
        this.altura(nodo.Izquierdo),
        this.altura(nodo.Derecho)
    );
}

AVL.prototype.balance = function(nodo) {
    return nodo
        ? this.altura(nodo.Izquierdo) - this.altura(nodo.Derecho)
        : 0;
}

// ── Rotaciones ──────────────────────────────────────────

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

AVL.prototype.insertar = function(nodo, valor) {

    if (!nodo) return new Nodo(valor);

    if (valor < nodo.valor)
        nodo.Izquierdo = this.insertar(nodo.Izquierdo, valor);
    else if (valor > nodo.valor)
        nodo.Derecho = this.insertar(nodo.Derecho, valor);
    else
        return nodo; // duplicado, ignorar

    this.actualizarAltura(nodo);

    const b = this.balance(nodo);

    // Izquierda - Izquierda
    if (b > 1 && valor < nodo.Izquierdo.valor)
        return this.rotarDerecha(nodo);

    // Derecha - Derecha
    if (b < -1 && valor > nodo.Derecho.valor)
        return this.rotarIzquierda(nodo);

    // Izquierda - Derecha
    if (b > 1 && valor > nodo.Izquierdo.valor) {
        nodo.Izquierdo = this.rotarIzquierda(nodo.Izquierdo);
        return this.rotarDerecha(nodo);
    }

    // Derecha - Izquierda
    if (b < -1 && valor < nodo.Derecho.valor) {
        nodo.Derecho = this.rotarDerecha(nodo.Derecho);
        return this.rotarIzquierda(nodo);
    }

    return nodo;
}