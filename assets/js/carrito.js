const CLAVE_CARRITO = "carritoMilSabores";

function obtenerCarrito() {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");

    if (!contador) {
        return;
    }

    const carrito = obtenerCarrito();
    const cantidadTotal = carrito.reduce(
        (suma, item) => suma + Number(item.cantidad || 0),
        0
    );

    contador.textContent = `(${cantidadTotal})`;
}

function agregarAlCarrito(codigoProducto, cantidad = 1, mensaje = "") {
    const producto = productos.find(
        item => item.codigo === codigoProducto
    );

    if (!producto) {
        return {
            correcto: false,
            mensaje: "No encontramos el producto seleccionado."
        };
    }

    cantidad = Number(cantidad);

    if (!Number.isInteger(cantidad) || cantidad < 1) {
        return {
            correcto: false,
            mensaje: "La cantidad debe ser un número válido mayor a cero."
        };
    }

    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(
        item => item.codigo === codigoProducto
    );

    if (itemExistente) {
        if (itemExistente.cantidad + cantidad > 5) {
            return {
                correcto: false,
                mensaje: "No puedes tener más de 5 unidades del mismo producto."
            };
        }

        itemExistente.cantidad += cantidad;

        if (mensaje.trim() !== "") {
            itemExistente.mensaje = mensaje.trim();
        }
    } else {
        carrito.push({
            codigo: producto.codigo,
            categoria: producto.categoria,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad,
            mensaje: mensaje.trim()
        });
    }

    guardarCarrito(carrito);

    return {
        correcto: true,
        mensaje: "Producto agregado correctamente al carrito."
    };
}

function eliminarDelCarrito(codigoProducto) {
    const carrito = obtenerCarrito().filter(
        item => item.codigo !== codigoProducto
    );

    guardarCarrito(carrito);
    cargarCarrito();
}

function cambiarCantidadCarrito(codigoProducto, nuevaCantidad) {
    nuevaCantidad = Number(nuevaCantidad);

    if (!Number.isInteger(nuevaCantidad) || nuevaCantidad < 1) {
        cargarCarrito();
        return;
    }

    if (nuevaCantidad > 5) {
        cargarCarrito();
        mostrarMensajeCarrito(
            "La cantidad máxima por producto es de 5 unidades."
        );
        return;
    }

    const carrito = obtenerCarrito();
    const item = carrito.find(
        producto => producto.codigo === codigoProducto
    );

    if (!item) {
        return;
    }

    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    cargarCarrito();
}

function obtenerDatosProducto(codigoProducto) {
    return productos.find(
        producto => producto.codigo === codigoProducto
    );
}

function cargarCarrito() {
    const contenedor = document.getElementById("contenedorCarrito");

    if (!contenedor) {
        actualizarContadorCarrito();
        return;
    }

    let carrito = obtenerCarrito();

    carrito = carrito.map(item => {
        const producto = obtenerDatosProducto(item.codigo);

        if (!producto) {
            return item;
        }

        return {
            ...item,
            categoria: producto.categoria,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen
        };
    });

    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));

    contenedor.innerHTML = "";

    const mensajeVacio = document.getElementById("mensajeCarrito");
    const cantidadTotal = document.getElementById("cantidadTotalCarrito");

    if (carrito.length === 0) {
        if (mensajeVacio) {
            mensajeVacio.hidden = false;
        }

        if (cantidadTotal) {
            cantidadTotal.textContent = "0 productos";
        }

        actualizarResumenCarrito(carrito);
        actualizarContadorCarrito();
        return;
    }

    if (mensajeVacio) {
        mensajeVacio.hidden = true;
    }

    let totalProductos = 0;

    carrito.forEach(item => {
        const producto = obtenerDatosProducto(item.codigo);
        const categoria = producto
            ? producto.categoria
            : item.categoria || "Producto";
        const nombre = producto
            ? producto.nombre
            : item.nombre || "Producto";
        const precio = producto
            ? producto.precio
            : Number(item.precio || 0);
        const imagen = producto
            ? producto.imagen
            : item.imagen || "../assets/img/logo-pasteleria.png";

        totalProductos += Number(item.cantidad || 0);

        const elemento = document.createElement("article");
        elemento.className = "carrito-item";

        elemento.innerHTML = `
            <img src="${imagen}" alt="${nombre}">
            <div>
                <p class="producto-categoria">${categoria}</p>
                <h3>${nombre}</h3>
                <p>Código: ${item.codigo}</p>
                <p>$${precio.toLocaleString("es-CL")} CLP</p>
                ${item.mensaje ? `<p>Mensaje: ${item.mensaje}</p>` : ""}
            </div>
            <div class="carrito-controles">
                <button type="button" data-accion="disminuir" data-codigo="${item.codigo}">−</button>
                <input type="number" min="1" max="5" value="${item.cantidad}" data-accion="cantidad" data-codigo="${item.codigo}" aria-label="Cantidad de ${nombre}">
                <button type="button" data-accion="aumentar" data-codigo="${item.codigo}">+</button>
                <button type="button" class="carrito-eliminar" data-accion="eliminar" data-codigo="${item.codigo}">Eliminar</button>
            </div>
        `;

        contenedor.appendChild(elemento);
    });

    if (cantidadTotal) {
        cantidadTotal.textContent =
            `${totalProductos} ${totalProductos === 1 ? "producto" : "productos"}`;
    }

    contenedor.querySelectorAll("[data-accion]").forEach(control => {
        control.addEventListener("click", function () {
            const codigo = this.dataset.codigo;
            const accion = this.dataset.accion;
            const carritoActual = obtenerCarrito();
            const item = carritoActual.find(
                producto => producto.codigo === codigo
            );

            if (!item) {
                return;
            }

            if (accion === "aumentar") {
                cambiarCantidadCarrito(codigo, item.cantidad + 1);
            }

            if (accion === "disminuir") {
                if (item.cantidad === 1) {
                    eliminarDelCarrito(codigo);
                } else {
                    cambiarCantidadCarrito(codigo, item.cantidad - 1);
                }
            }

            if (accion === "eliminar") {
                eliminarDelCarrito(codigo);
            }
        });

        control.addEventListener("change", function () {
            if (this.dataset.accion !== "cantidad") {
                return;
            }

            cambiarCantidadCarrito(
                this.dataset.codigo,
                this.value
            );
        });
    });

    actualizarResumenCarrito(carrito);
    actualizarContadorCarrito();
}

function obtenerUsuarioActual() {
    const correoActual = localStorage.getItem("usuario");

    if (!correoActual) {
        return null;
    }

    const usuarios = JSON.parse(
        localStorage.getItem("usuariosMilSabores")
    ) || [];

    return usuarios.find(
        usuario => usuario.correo === correoActual
    ) || null;
}

function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) {
        return null;
    }

    const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
    const hoy = new Date();

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();

    if (
        diferenciaMes < 0 ||
        (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())
    ) {
        edad--;
    }

    return edad;
}

function esCumpleanos(fechaNacimiento) {
    if (!fechaNacimiento) {
        return false;
    }

    const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
    const hoy = new Date();

    return (
        nacimiento.getMonth() === hoy.getMonth() &&
        nacimiento.getDate() === hoy.getDate()
    );
}

function esCorreoDuoc(correo) {
    if (!correo) {
        return false;
    }

    const correoNormalizado = correo.toLowerCase().trim();

    return (
        correoNormalizado.endsWith("@duoc.cl") ||
        correoNormalizado.endsWith("@profesor.duoc.cl")
    );
}

function calcularDescuentoCarrito(carrito) {
    const usuario = obtenerUsuarioActual();

    if (!usuario || carrito.length === 0) {
        return {
            descuento: 0,
            beneficios: []
        };
    }

    const subtotal = carrito.reduce((suma, item) => {
        const producto = obtenerDatosProducto(item.codigo);
        const precio = producto
            ? producto.precio
            : Number(item.precio || 0);

        return suma + precio * Number(item.cantidad || 0);
    }, 0);

    let descuento = 0;
    const beneficios = [];

    const edad = calcularEdad(usuario.fechaNacimiento);

    if (edad !== null && edad > 50) {
        descuento += subtotal * 0.50;
        beneficios.push("50% por ser mayor de 50 años");
    }

    if (usuario.codigoPromocional === "FELICES50") {
        descuento += subtotal * 0.10;
        beneficios.push("10% por código FELICES50");
    }

    if (
        esCorreoDuoc(usuario.correo) &&
        esCumpleanos(usuario.fechaNacimiento)
    ) {
        const tortas = carrito.filter(item => {
            const producto = obtenerDatosProducto(item.codigo);
            return producto && producto.tipo === "Torta";
        });

        if (tortas.length > 0) {
            const tortaGratis = tortas.reduce((menor, item) => {
                const producto = obtenerDatosProducto(item.codigo);
                const precioActual = producto
                    ? producto.precio
                    : Number(item.precio || 0);

                const precioMenor = menor
                    ? Number(menor.precio || 0)
                    : Infinity;

                return precioActual < precioMenor
                    ? { ...item, precio: precioActual }
                    : menor;
            }, null);

            if (tortaGratis) {
                descuento += Number(tortaGratis.precio || 0);
                beneficios.push("torta gratis por cumpleaños Duoc");
            }
        }
    }

    descuento = Math.min(descuento, subtotal);

    return {
        descuento,
        beneficios
    };
}

function actualizarResumenCarrito(carrito) {
    const subtotalElemento = document.getElementById("subtotalCarrito");
    const descuentoElemento = document.getElementById("descuentoCarrito");
    const totalElemento = document.getElementById("totalCarrito");

    let subtotal = 0;

    carrito.forEach(item => {
        const producto = obtenerDatosProducto(item.codigo);
        const precio = producto
            ? producto.precio
            : Number(item.precio || 0);

        subtotal += precio * Number(item.cantidad || 0);
    });

    const resultadoDescuento = calcularDescuentoCarrito(carrito);
    const descuento = resultadoDescuento.descuento;
    const total = Math.max(0, subtotal - descuento);

    if (subtotalElemento) {
        subtotalElemento.textContent =
            `$${subtotal.toLocaleString("es-CL")} CLP`;
    }

    if (descuentoElemento) {
        descuentoElemento.textContent =
            `$${descuento.toLocaleString("es-CL")} CLP`;
    }

    if (totalElemento) {
        totalElemento.textContent =
            `$${total.toLocaleString("es-CL")} CLP`;
    }
}

function mostrarMensajeCarrito(mensaje) {
    const elemento = document.getElementById("mensajeCarrito");

    if (!elemento) {
        return;
    }

    elemento.hidden = false;
    elemento.textContent = mensaje;
}

document.addEventListener("DOMContentLoaded", function () {
    actualizarContadorCarrito();
    cargarCarrito();
});
