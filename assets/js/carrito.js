/* productos y carrito */

const claveCarrito = "carritoMilSabores";


/* obtener carrito desde localStorage */

function obtenerCarrito() {
    const carritoGuardado = localStorage.getItem(claveCarrito);

    if (!carritoGuardado) {
        return [];
    }

    try {
        return JSON.parse(carritoGuardado);
    } catch (error) {
        return [];
    }
}


/* guardar carrito en localStorage */

function guardarCarrito(carrito) {
    localStorage.setItem(claveCarrito, JSON.stringify(carrito));
}


/* formatear precios en pesos chilenos */

function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
    }).format(precio);
}


/* actualizar contador del carrito */

function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");

    if (!contador) {
        return;
    }

    const carrito = obtenerCarrito();

    const cantidadTotal = carrito.reduce(function (total, producto) {
        return total + producto.cantidad;
    }, 0);

    contador.textContent = "(" + cantidadTotal + ")";
}


/* agregar producto al carrito */

function agregarAlCarrito(producto, cantidad, tamano, mensaje) {
    const carrito = obtenerCarrito();

    const cantidadSolicitada = Number(cantidad);

    if (cantidadSolicitada < 1 || cantidadSolicitada > 5) {
        return {
            correcto: false,
            mensaje: "La cantidad debe estar entre 1 y 5 unidades."
        };
    }

    const productoExistente = carrito.find(function (item) {
        return item.id === producto.id &&
               item.tamano === tamano &&
               item.mensaje === mensaje;
    });

    if (productoExistente) {
        const nuevaCantidad =
            productoExistente.cantidad + cantidadSolicitada;

        if (nuevaCantidad > 5) {
            return {
                correcto: false,
                mensaje: "No puedes agregar más de 5 unidades del mismo producto."
            };
        }

        productoExistente.cantidad = nuevaCantidad;
    } else {
        carrito.push({
            id: producto.id,
            codigo: producto.codigo,
            nombre: producto.nombre,
            categoria: producto.categoria,
            precio: producto.precio,
            cantidad: cantidadSolicitada,
            tamano: tamano,
            mensaje: mensaje
        });
    }

    guardarCarrito(carrito);
    actualizarContadorCarrito();

    return {
        correcto: true,
        mensaje: "Producto agregado correctamente al carrito."
    };
}


/* cargar productos en la página de productos */

function cargarProductos() {
    const contenedor = document.getElementById("contenedorProductos");

    if (!contenedor) {
        return;
    }

    const buscador = document.getElementById("buscadorProducto");
    const filtroCategoria = document.getElementById("filtroCategoria");
    const filtroTipo = document.getElementById("filtroTipo");
    const filtroTamano = document.getElementById("filtroTamano");
    const contadorProductos = document.getElementById("contadorProductos");
    const mensajeProductos = document.getElementById("mensajeProductos");

    cargarFiltros();

    function mostrarProductos() {
        const textoBusqueda = buscador.value.trim().toLowerCase();
        const categoriaSeleccionada = filtroCategoria.value;
        const tipoSeleccionado = filtroTipo.value;
        const tamanoSeleccionado = filtroTamano.value;

        const productosFiltrados = productos.filter(function (producto) {
            const coincideBusqueda =
                producto.nombre.toLowerCase().includes(textoBusqueda) ||
                producto.codigo.toLowerCase().includes(textoBusqueda);

            const coincideCategoria =
                categoriaSeleccionada === "" ||
                producto.categoria === categoriaSeleccionada;

            const coincideTipo =
                tipoSeleccionado === "" ||
                obtenerTipoProducto(producto) === tipoSeleccionado;

            const coincideTamano =
                tamanoSeleccionado === "" ||
                obtenerTamanoProducto(producto) === tamanoSeleccionado;

            return coincideBusqueda &&
                   coincideCategoria &&
                   coincideTipo &&
                   coincideTamano;
        });

        contenedor.innerHTML = "";

        contadorProductos.textContent =
            productosFiltrados.length + " producto(s) disponible(s)";

        if (productosFiltrados.length === 0) {
            mensajeProductos.textContent =
                "No encontramos productos que coincidan con tu búsqueda.";

            return;
        }

        mensajeProductos.textContent = "";

        productosFiltrados.forEach(function (producto) {
            const tarjeta = document.createElement("article");

            tarjeta.className = "producto-card";

            tarjeta.innerHTML = `
                <div class="producto-imagen">
                    <img src="../assets/img/logo-pasteleria.png"
                         alt="${producto.nombre}">
                </div>

                <div class="producto-info">
                    <p class="producto-categoria">${producto.categoria}</p>

                    <h2>${producto.nombre}</h2>

                    <p class="producto-descripcion">
                        ${producto.descripcion}
                    </p>

                    <p class="producto-precio">
                        ${formatearPrecio(producto.precio)}
                    </p>

                    <div class="producto-acciones">
                        <a href="DetalleProductos.html?id=${producto.id}"
                           class="btn btn-light">
                            Ver detalle
                        </a>

                        <button type="button"
                                class="btn btn-primary btn-agregar-producto"
                                data-id="${producto.id}">
                            Añadir al carrito
                        </button>
                    </div>

                    <p class="producto-mensaje"
                       id="mensaje-producto-${producto.id}"
                       aria-live="polite">
                    </p>
                </div>
            `;

            contenedor.appendChild(tarjeta);
        });

        agregarEventosBotones();
    }


    function cargarFiltros() {
        if (filtroCategoria.options.length === 1) {
            categoriasDisponibles.forEach(function (categoria) {
                const opcion = document.createElement("option");

                opcion.value = categoria;
                opcion.textContent = categoria;

                filtroCategoria.appendChild(opcion);
            });
        }

        if (filtroTipo.options.length === 1) {
            tiposTorta.forEach(function (tipo) {
                const opcion = document.createElement("option");

                opcion.value = tipo;
                opcion.textContent = tipo;

                filtroTipo.appendChild(opcion);
            });
        }

        if (filtroTamano.options.length === 1) {
            tamanosDisponibles.forEach(function (tamano) {
                const opcion = document.createElement("option");

                opcion.value = tamano;
                opcion.textContent = tamano;

                filtroTamano.appendChild(opcion);
            });
        }
    }


    function agregarEventosBotones() {
        const botones =
            document.querySelectorAll(".btn-agregar-producto");

        botones.forEach(function (boton) {
            boton.addEventListener("click", function () {
                const idProducto = Number(boton.dataset.id);

                const producto = productos.find(function (item) {
                    return item.id === idProducto;
                });

                if (!producto) {
                    return;
                }

                const resultado = agregarAlCarrito(
                    producto,
                    1,
                    obtenerTamanoProducto(producto),
                    ""
                );

                const mensaje =
                    document.getElementById(
                        "mensaje-producto-" + producto.id
                    );

                if (mensaje) {
                    mensaje.textContent = resultado.mensaje;
                }
            });
        });
    }


    buscador.addEventListener("input", mostrarProductos);
    filtroCategoria.addEventListener("change", mostrarProductos);
    filtroTipo.addEventListener("change", mostrarProductos);
    filtroTamano.addEventListener("change", mostrarProductos);

    mostrarProductos();
}


/* cargar detalle del producto */

function cargarDetalleProducto() {
    const contenedor = document.getElementById("detalleProducto");

    if (!contenedor) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const idProducto = Number(parametros.get("id"));

    const producto = productos.find(function (item) {
        return item.id === idProducto;
    });

    if (!producto) {
        contenedor.innerHTML = `
            <div class="mensaje-error">
                No encontramos el producto solicitado.
            </div>
        `;

        return;
    }

    const imagen = document.getElementById("imagenProducto");
    const categoria = document.getElementById("categoriaProducto");
    const codigo = document.getElementById("codigoProducto");
    const nombre = document.getElementById("nombreProducto");
    const descripcion = document.getElementById("descripcionProducto");
    const precio = document.getElementById("precioProducto");
    const tamano = document.getElementById("tamanoProducto");
    const cantidad = document.getElementById("cantidadProducto");
    const mensajePersonalizado =
        document.getElementById("mensajePersonalizado");
    const botonAgregar =
        document.getElementById("btnAgregarCarrito");
    const mensajeDetalle =
        document.getElementById("mensajeDetalle");

    imagen.src = "../assets/img/logo-pasteleria.png";
    imagen.alt = producto.nombre;

    categoria.textContent = producto.categoria;
    codigo.textContent = "Código: " + producto.codigo;
    nombre.textContent = producto.nombre;
    descripcion.textContent = producto.descripcion;
    precio.textContent = formatearPrecio(producto.precio);

    cargarTamanos(tamano);

    botonAgregar.addEventListener("click", function () {
        const cantidadSeleccionada = Number(cantidad.value);
        const tamanoSeleccionado = tamano.value;
        const mensaje = mensajePersonalizado.value.trim();

        const resultado = agregarAlCarrito(
            producto,
            cantidadSeleccionada,
            tamanoSeleccionado,
            mensaje
        );

        mensajeDetalle.textContent = resultado.mensaje;

        if (resultado.correcto) {
            mensajeDetalle.className = "mensaje-exito";
        } else {
            mensajeDetalle.className = "mensaje-error";
        }
    });
}


/* cargar tamaños disponibles */

function cargarTamanos(select) {
    if (!select) {
        return;
    }

    select.innerHTML = "";

    tamanosDisponibles.forEach(function (tamano) {
        const opcion = document.createElement("option");

        opcion.value = tamano;
        opcion.textContent = tamano;

        select.appendChild(opcion);
    });
}


/* cargar carrito */

function cargarCarrito() {
    const contenedor = document.getElementById("contenedorCarrito");

    if (!contenedor) {
        return;
    }

    const mensajeCarrito = document.getElementById("mensajeCarrito");
    const cantidadTotalCarrito =
        document.getElementById("cantidadTotalCarrito");
    const subtotalCarrito =
        document.getElementById("subtotalCarrito");
    const descuentoCarrito =
        document.getElementById("descuentoCarrito");
    const totalCarrito =
        document.getElementById("totalCarrito");
    const botonContinuar =
        document.getElementById("btnContinuarCompra");

    let carrito = obtenerCarrito();

    function mostrarCarrito() {
        carrito = obtenerCarrito();

        contenedor.innerHTML = "";

        const cantidadTotal = carrito.reduce(function (total, producto) {
            return total + producto.cantidad;
        }, 0);

        const subtotal = carrito.reduce(function (total, producto) {
            return total + producto.precio * producto.cantidad;
        }, 0);

        const descuento = 0;
        const total = subtotal - descuento;

        cantidadTotalCarrito.textContent =
            cantidadTotal + (cantidadTotal === 1 ? " producto" : " productos");

        subtotalCarrito.textContent = formatearPrecio(subtotal);
        descuentoCarrito.textContent = formatearPrecio(descuento);
        totalCarrito.textContent = formatearPrecio(total);

        if (carrito.length === 0) {
            mensajeCarrito.textContent = "Tu carrito está vacío.";
            return;
        }

        mensajeCarrito.textContent = "";

        carrito.forEach(function (producto) {
            const item = document.createElement("article");

            item.className = "carrito-item";

            item.innerHTML = `
                <div class="carrito-producto">
                    <img src="../assets/img/logo-pasteleria.png"
                         alt="${producto.nombre}">

                    <div>
                        <p class="producto-categoria">
                            ${producto.categoria}
                        </p>

                        <h3>${producto.nombre}</h3>

                        <p>Código: ${producto.codigo}</p>

                        <p>
                            Tamaño: ${producto.tamano}
                        </p>

                        ${
                            producto.mensaje
                                ? `<p>Mensaje: ${producto.mensaje}</p>`
                                : ""
                        }

                        <p>
                            Precio unitario:
                            ${formatearPrecio(producto.precio)}
                        </p>
                    </div>
                </div>

                <div class="carrito-controles">
                    <label for="cantidad-${producto.id}">
                        Cantidad
                    </label>

                    <input
                        type="number"
                        id="cantidad-${producto.id}"
                        class="cantidad-carrito"
                        data-id="${producto.id}"
                        min="1"
                        max="5"
                        value="${producto.cantidad}"
                    >

                    <strong>
                        ${formatearPrecio(
                            producto.precio * producto.cantidad
                        )}
                    </strong>

                    <button
                        type="button"
                        class="carrito-eliminar"
                        data-id="${producto.id}">
                        Eliminar
                    </button>
                </div>
            `;

            contenedor.appendChild(item);
        });

        agregarEventosCarrito();
    }


    function agregarEventosCarrito() {
        const controlesCantidad =
            document.querySelectorAll(".cantidad-carrito");

        controlesCantidad.forEach(function (control) {
            control.addEventListener("change", function () {
                const idProducto = Number(control.dataset.id);
                let nuevaCantidad = Number(control.value);

                if (nuevaCantidad < 1) {
                    nuevaCantidad = 1;
                }

                if (nuevaCantidad > 5) {
                    nuevaCantidad = 5;
                }

                control.value = nuevaCantidad;

                const producto = carrito.find(function (item) {
                    return item.id === idProducto;
                });

                if (!producto) {
                    return;
                }

                producto.cantidad = nuevaCantidad;

                guardarCarrito(carrito);
                actualizarContadorCarrito();
                mostrarCarrito();
            });
        });


        const botonesEliminar =
            document.querySelectorAll(".carrito-eliminar");

        botonesEliminar.forEach(function (boton) {
            boton.addEventListener("click", function () {
                const idProducto = Number(boton.dataset.id);

                carrito = carrito.filter(function (producto) {
                    return producto.id !== idProducto;
                });

                guardarCarrito(carrito);
                actualizarContadorCarrito();
                mostrarCarrito();
            });
        });
    }


    botonContinuar.addEventListener("click", function () {
        if (carrito.length === 0) {
            mensajeCarrito.textContent =
                "Debes agregar al menos un producto antes de continuar.";
            return;
        }

        mensajeCarrito.textContent =
            "Tu carrito está listo para continuar con la compra.";
    });


    mostrarCarrito();
}


/* obtener tipo de producto */

function obtenerTipoProducto(producto) {
    if (producto.categoria === "Tortas Cuadradas") {
        return "Cuadrada";
    }

    if (producto.categoria === "Tortas Circulares") {
        return "Circular";
    }

    return "";
}


/* obtener tamaño inicial del producto */

function obtenerTamanoProducto(producto) {
    if (
        producto.categoria === "Tortas Cuadradas" ||
        producto.categoria === "Tortas Circulares" ||
        producto.categoria === "Tortas Especiales"
    ) {
        return "Grande";
    }

    return "Pequeño";
}


/* iniciar funciones cuando carga la página */

document.addEventListener("DOMContentLoaded", function () {
    actualizarContadorCarrito();
    cargarProductos();
    cargarDetalleProducto();
    cargarCarrito();
});
