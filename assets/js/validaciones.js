function mostrarError(id, mensaje) {
    const elemento = document.getElementById(id);

    if (elemento) {
        elemento.textContent = mensaje;
    }
}

function limpiarErroresFormulario(ids) {
    ids.forEach(id => mostrarError(id, ""));
}

function correoPermitido(correo) {
    const correoNormalizado = correo.toLowerCase().trim();

    return (
        correoNormalizado.endsWith("@duoc.cl") ||
        correoNormalizado.endsWith("@profesor.duoc.cl") ||
        correoNormalizado.endsWith("@gmail.com")
    );
}


function runValido(run) {
    const valor = run.trim().toUpperCase();

    if (!/^\d{7,8}[0-9K]$/.test(valor)) {
        return false;
    }

    const cuerpo = valor.slice(0, -1);
    const digitoIngresado = valor.slice(-1);
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    let digitoEsperado;

    if (resto === 11) {
        digitoEsperado = "0";
    } else if (resto === 10) {
        digitoEsperado = "K";
    } else {
        digitoEsperado = String(resto);
    }

    return digitoIngresado === digitoEsperado;
}

function validarLogin() {
    const correo = document.getElementById("correo");
    const contrasena = document.getElementById("contrasena");
    const mensaje = document.getElementById("mensajeLogin");

    if (!correo || !contrasena) {
        return false;
    }

    limpiarErroresFormulario([
        "errorCorreo",
        "errorContrasena"
    ]);

    if (mensaje) {
        mensaje.textContent = "";
        mensaje.className = "form-message";
    }

    let correcto = true;
    const valorCorreo = correo.value.trim().toLowerCase();
    const valorContrasena = contrasena.value;

    if (valorCorreo === "") {
        mostrarError("errorCorreo", "Ingresa tu correo electrónico.");
        correcto = false;
    } else if (valorCorreo.length > 100) {
        mostrarError("errorCorreo", "El correo no puede superar los 100 caracteres.");
        correcto = false;
    } else if (!correoPermitido(valorCorreo)) {
        mostrarError(
            "errorCorreo",
            "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com."
        );
        correcto = false;
    }

    if (valorContrasena === "") {
        mostrarError("errorContrasena", "Ingresa tu contraseña.");
        correcto = false;
    } else if (valorContrasena.length < 4) {
        mostrarError("errorContrasena", "La contraseña debe tener al menos 4 caracteres.");
        correcto = false;
    } else if (valorContrasena.length > 10) {
        mostrarError("errorContrasena", "La contraseña no puede superar los 10 caracteres.");
        correcto = false;
    }

    if (!correcto) {
        if (mensaje) {
            mensaje.textContent = "Revisa los datos marcados antes de continuar.";
            mensaje.className = "form-message mensaje-error";
        }

        return false;
    }

    const usuarios = JSON.parse(
        localStorage.getItem("usuariosMilSabores")
    ) || [];

    const usuarioRegistrado = usuarios.find(
        usuario => usuario.correo === valorCorreo
    );

    if (usuarios.length > 0 && !usuarioRegistrado) {
        if (mensaje) {
            mensaje.textContent = "No encontramos una cuenta registrada con ese correo.";
            mensaje.className = "form-message mensaje-error";
        }

        return false;
    }

    localStorage.setItem("usuario", valorCorreo);

    if (mensaje) {
        mensaje.textContent = "Inicio de sesión correcto. Ya puedes continuar con tu compra.";
        mensaje.className = "form-message mensaje-exito";
    }

    actualizarUsuarioNavegacion();
    actualizarContadorCarrito();

    return true;
}

function validarRegistro() {
    const run = document.getElementById("run");
    const nombre = document.getElementById("nombre");
    const apellidos = document.getElementById("apellidos");
    const correo = document.getElementById("correoRegistro");
    const fechaNacimiento = document.getElementById("fechaNacimiento");
    const codigoPromocional = document.getElementById("codigoPromocional");
    const region = document.getElementById("region");
    const comuna = document.getElementById("comuna");
    const direccion = document.getElementById("direccion");
    const mensaje = document.getElementById("mensajeRegistro");

    if (!run || !nombre || !apellidos || !correo || !region || !comuna || !direccion) {
        return false;
    }

    limpiarErroresFormulario([
        "errorRun",
        "errorNombre",
        "errorApellidos",
        "errorCorreoRegistro",
        "errorFechaNacimiento",
        "errorCodigoPromocional",
        "errorRegion",
        "errorComuna",
        "errorDireccion"
    ]);

    if (mensaje) {
        mensaje.textContent = "";
        mensaje.className = "form-message";
    }

    let correcto = true;

    const valorRun = run.value.trim().toUpperCase();
    const valorNombre = nombre.value.trim();
    const valorApellidos = apellidos.value.trim();
    const valorCorreo = correo.value.trim().toLowerCase();
    const valorFecha = fechaNacimiento ? fechaNacimiento.value : "";
    const valorCodigo = codigoPromocional
        ? codigoPromocional.value.trim().toUpperCase()
        : "";
    const valorRegion = region.value;
    const valorComuna = comuna.value;
    const valorDireccion = direccion.value.trim();

    if (!runValido(valorRun)) {
        mostrarError(
            "errorRun",
            "Ingresa un RUN válido de 7 a 9 caracteres, sin puntos ni guion."
        );
        correcto = false;
    }

    if (valorNombre === "") {
        mostrarError("errorNombre", "Ingresa tu nombre.");
        correcto = false;
    } else if (valorNombre.length > 50) {
        mostrarError("errorNombre", "El nombre no puede superar los 50 caracteres.");
        correcto = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(valorNombre)) {
        mostrarError("errorNombre", "El nombre solo puede contener letras y espacios.");
        correcto = false;
    }

    if (valorApellidos === "") {
        mostrarError("errorApellidos", "Ingresa tus apellidos.");
        correcto = false;
    } else if (valorApellidos.length > 100) {
        mostrarError("errorApellidos", "Los apellidos no pueden superar los 100 caracteres.");
        correcto = false;
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(valorApellidos)) {
        mostrarError("errorApellidos", "Los apellidos solo pueden contener letras y espacios.");
        correcto = false;
    }

    if (valorCorreo === "") {
        mostrarError("errorCorreoRegistro", "Ingresa tu correo electrónico.");
        correcto = false;
    } else if (valorCorreo.length > 100) {
        mostrarError("errorCorreoRegistro", "El correo no puede superar los 100 caracteres.");
        correcto = false;
    } else if (!correoPermitido(valorCorreo)) {
        mostrarError(
            "errorCorreoRegistro",
            "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com."
        );
        correcto = false;
    }

    if (valorCodigo && valorCodigo !== "FELICES50") {
        mostrarError(
            "errorCodigoPromocional",
            "El código promocional ingresado no es válido. Usa FELICES50."
        );
        correcto = false;
    }

    if (valorFecha) {
        const fechaIngresada = new Date(`${valorFecha}T00:00:00`);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaIngresada > hoy) {
            mostrarError(
                "errorFechaNacimiento",
                "La fecha de nacimiento no puede ser futura."
            );
            correcto = false;
        }
    }

    if (valorRegion === "") {
        mostrarError("errorRegion", "Selecciona una región.");
        correcto = false;
    }

    if (valorComuna === "") {
        mostrarError("errorComuna", "Selecciona una comuna.");
        correcto = false;
    }

    if (valorDireccion === "") {
        mostrarError("errorDireccion", "Ingresa tu dirección.");
        correcto = false;
    } else if (valorDireccion.length > 300) {
        mostrarError("errorDireccion", "La dirección no puede superar los 300 caracteres.");
        correcto = false;
    }

    if (!correcto) {
        if (mensaje) {
            mensaje.textContent = "Revisa los datos marcados antes de crear tu cuenta.";
            mensaje.className = "form-message mensaje-error";
        }

        return false;
    }

    let usuarios = JSON.parse(
        localStorage.getItem("usuariosMilSabores")
    ) || [];

    const usuarioExistente = usuarios.some(
        usuario =>
            usuario.run === valorRun ||
            usuario.correo === valorCorreo
    );

    if (usuarioExistente) {
        if (mensaje) {
            mensaje.textContent = "Ya existe una cuenta registrada con ese RUN o correo.";
            mensaje.className = "form-message mensaje-error";
        }

        return false;
    }

    const usuario = {
        run: valorRun,
        nombre: valorNombre,
        apellidos: valorApellidos,
        correo: valorCorreo,
        fechaNacimiento: valorFecha,
        codigoPromocional: valorCodigo,
        region: valorRegion,
        comuna: valorComuna,
        direccion: valorDireccion
    };

    usuarios.push(usuario);

    localStorage.setItem(
        "usuariosMilSabores",
        JSON.stringify(usuarios)
    );

    if (valorCodigo === "FELICES50") {
        if (mensaje) {
            mensaje.textContent = "Cuenta creada correctamente. Código FELICES50 registrado con 10% de descuento de por vida.";
        }
    } else {
        if (mensaje) {
            mensaje.textContent = "Cuenta creada correctamente. Ya puedes iniciar sesión.";
        }
    }

    if (mensaje) {
        mensaje.className = "form-message mensaje-exito";
    }

    return true;
}

function cargarRegiones() {
    const region = document.getElementById("region");

    if (!region || typeof regionesComunas === "undefined") {
        return;
    }

    const regionActual = region.value;

    region.innerHTML = '<option value="">Selecciona una región</option>';

    Object.keys(regionesComunas).forEach(nombreRegion => {
        const opcion = document.createElement("option");
        opcion.value = nombreRegion;
        opcion.textContent = nombreRegion;
        region.appendChild(opcion);
    });

    if (regionActual && regionesComunas[regionActual]) {
        region.value = regionActual;
    }
}

function cargarComunas() {
    const region = document.getElementById("region");
    const comuna = document.getElementById("comuna");

    if (!region || !comuna || typeof regionesComunas === "undefined") {
        return;
    }

    comuna.innerHTML = '<option value="">Selecciona una comuna</option>';

    const comunas = regionesComunas[region.value] || [];

    comunas.forEach(nombreComuna => {
        const opcion = document.createElement("option");
        opcion.value = nombreComuna;
        opcion.textContent = nombreComuna;
        comuna.appendChild(opcion);
    });

    comuna.disabled = comunas.length === 0;
}

function actualizarUsuarioNavegacion() {
    const elemento = document.getElementById("usuario-nav");

    if (!elemento) {
        return;
    }

    const usuario = localStorage.getItem("usuario");

    elemento.textContent = usuario ? usuario : "";
}

function mostrarProductos(listaProductos) {
    const contenedor = document.getElementById("contenedorProductos");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    const contador = document.getElementById("contadorProductos");
    const mensaje = document.getElementById("mensajeProductos");

    if (listaProductos.length === 0) {
        if (contador) {
            contador.textContent = "0 productos disponibles";
        }

        if (mensaje) {
            mensaje.textContent = "No encontramos productos con esos filtros.";
            mensaje.className = "form-message mensaje-error";
        }

        return;
    }

    if (contador) {
        contador.textContent =
            `${listaProductos.length} ${listaProductos.length === 1 ? "producto disponible" : "productos disponibles"}`;
    }

    if (mensaje) {
        mensaje.textContent = "";
        mensaje.className = "form-message";
    }

    listaProductos.forEach(producto => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto-card";

        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
            <div class="producto-info">
                <p class="producto-categoria">${producto.categoria}</p>
                <h2>${producto.nombre}</h2>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <p class="producto-precio">$${producto.precio.toLocaleString("es-CL")} CLP</p>
                <div class="producto-acciones">
                    <a href="DetalleProductos.html?id=${encodeURIComponent(producto.codigo)}" class="btn btn-light">
                        Ver detalle
                    </a>
                    <button type="button" class="btn btn-primary btn-agregar-producto" data-codigo="${producto.codigo}">
                        Añadir al carrito
                    </button>
                </div>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });

    contenedor.querySelectorAll(".btn-agregar-producto").forEach(boton => {
        boton.addEventListener("click", function () {
            const resultado = agregarAlCarrito(this.dataset.codigo, 1);
            const mensajeProductos = document.getElementById("mensajeProductos");

            if (mensajeProductos) {
                mensajeProductos.textContent = resultado.mensaje;
                mensajeProductos.className = resultado.correcto
                    ? "form-message mensaje-exito"
                    : "form-message mensaje-error";
            }
        });
    });
}

function obtenerParametrosProductos() {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get("categoria") || "";
}

function cargarFiltrosProductos() {
    const filtroCategoria = document.getElementById("filtroCategoria");
    const filtroTipo = document.getElementById("filtroTipo");
    const filtroTamano = document.getElementById("filtroTamano");

    if (!filtroCategoria || !filtroTipo || !filtroTamano) {
        return;
    }

    const categorias = [...new Set(productos.map(producto => producto.categoria))];
    const tipos = [...new Set(productos.map(producto => producto.tipo))];
    const tamanos = [...new Set(productos.map(producto => producto.tamano))];

    categorias.forEach(categoria => {
        const opcion = document.createElement("option");
        opcion.value = categoria;
        opcion.textContent = categoria;
        filtroCategoria.appendChild(opcion);
    });

    tipos.forEach(tipo => {
        const opcion = document.createElement("option");
        opcion.value = tipo;
        opcion.textContent = tipo;
        filtroTipo.appendChild(opcion);
    });

    tamanos.forEach(tamano => {
        const opcion = document.createElement("option");
        opcion.value = tamano;
        opcion.textContent = tamano;
        filtroTamano.appendChild(opcion);
    });

    const categoriaURL = obtenerParametrosProductos();

    if (categoriaURL && categorias.includes(categoriaURL)) {
        filtroCategoria.value = categoriaURL;
    }
}

function filtrarProductos() {
    const buscador = document.getElementById("buscadorProducto");
    const filtroCategoria = document.getElementById("filtroCategoria");
    const filtroTipo = document.getElementById("filtroTipo");
    const filtroTamano = document.getElementById("filtroTamano");

    if (!buscador || !filtroCategoria || !filtroTipo || !filtroTamano) {
        return;
    }

    const texto = buscador.value.trim().toLowerCase();
    const categoria = filtroCategoria.value;
    const tipo = filtroTipo.value;
    const tamano = filtroTamano.value;

    const resultados = productos.filter(producto => {
        const coincideTexto =
            producto.nombre.toLowerCase().includes(texto) ||
            producto.codigo.toLowerCase().includes(texto);

        const coincideCategoria =
            categoria === "" || producto.categoria === categoria;

        const coincideTipo =
            tipo === "" || producto.tipo === tipo;

        const coincideTamano =
            tamano === "" || producto.tamano === tamano;

        return (
            coincideTexto &&
            coincideCategoria &&
            coincideTipo &&
            coincideTamano
        );
    });

    mostrarProductos(resultados);
}

function cargarDetalleProducto() {
    const contenedorDetalle = document.getElementById("detalleProducto");

    if (!contenedorDetalle) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const codigoProducto = (
        parametros.get("id") ||
        parametros.get("codigo") ||
        parametros.get("producto") ||
        ""
    ).trim().toUpperCase();

    if (!codigoProducto) {
        mostrarErrorDetalle("No se especificó ningún producto.");
        return;
    }

    const producto = productos.find(
        item => item.codigo.toUpperCase() === codigoProducto
    );

    if (!producto) {
        mostrarErrorDetalle("No encontramos el producto solicitado.");
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
    const mensajePersonalizado = document.getElementById("mensajePersonalizado");
    const botonAgregar = document.getElementById("btnAgregarCarrito");
    const mensajeDetalle = document.getElementById("mensajeDetalle");

    if (imagen) {
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;
    }

    if (categoria) {
        categoria.textContent = producto.categoria;
    }

    if (codigo) {
        codigo.textContent = `Código: ${producto.codigo}`;
    }

    if (nombre) {
        nombre.textContent = producto.nombre;
    }

    if (descripcion) {
        descripcion.textContent = producto.descripcion;
    }

    if (precio) {
        precio.textContent = `$${producto.precio.toLocaleString("es-CL")} CLP`;
    }

    if (tamano) {
        tamano.innerHTML = "";

        const opcion = document.createElement("option");
        opcion.value = producto.tamano;
        opcion.textContent = producto.tamano;
        opcion.selected = true;

        tamano.appendChild(opcion);
    }

    if (cantidad) {
        cantidad.value = 1;
        cantidad.min = 1;
        cantidad.max = 5;
    }

    if (botonAgregar) {
        botonAgregar.onclick = function () {
            const cantidadSeleccionada = Number(cantidad.value);
            const mensaje = mensajePersonalizado
                ? mensajePersonalizado.value.trim()
                : "";

            if (
                !Number.isInteger(cantidadSeleccionada) ||
                cantidadSeleccionada < 1 ||
                cantidadSeleccionada > 5
            ) {
                if (mensajeDetalle) {
                    mensajeDetalle.textContent =
                        "La cantidad debe estar entre 1 y 5 unidades.";
                    mensajeDetalle.className =
                        "form-message mensaje-error";
                }

                return;
            }

            const resultado = agregarAlCarrito(
                producto.codigo,
                cantidadSeleccionada,
                mensaje
            );

            if (mensajeDetalle) {
                mensajeDetalle.textContent = resultado.mensaje;
                mensajeDetalle.className = resultado.correcto
                    ? "form-message mensaje-exito"
                    : "form-message mensaje-error";
            }
        };
    }
}

function mostrarErrorDetalle(mensaje) {
    const contenedorDetalle = document.getElementById("detalleProducto");

    if (!contenedorDetalle) {
        return;
    }

    contenedorDetalle.innerHTML = `
        <p class="mensaje-error">
            ${mensaje}
        </p>
    `;
}

document.addEventListener("DOMContentLoaded", function () {
    actualizarUsuarioNavegacion();
    actualizarContadorCarrito();

    const formularioLogin = document.getElementById("formLogin");
    if (formularioLogin) {
        formularioLogin.addEventListener("submit", function (evento) {
            evento.preventDefault();
            validarLogin();
        });
    }

    const formularioRegistro = document.getElementById("formRegistro");
    if (formularioRegistro) {
        cargarRegiones();
        cargarComunas();

        const region = document.getElementById("region");
        if (region) {
            region.addEventListener("change", cargarComunas);
        }

        formularioRegistro.addEventListener("submit", function (evento) {
            evento.preventDefault();
            validarRegistro();
        });
    }

    const contenedorProductos = document.getElementById("contenedorProductos");
    if (contenedorProductos) {
        cargarFiltrosProductos();
        filtrarProductos();

        [
            "buscadorProducto",
            "filtroCategoria",
            "filtroTipo",
            "filtroTamano"
        ].forEach(id => {
            const elemento = document.getElementById(id);

            if (elemento) {
                elemento.addEventListener("input", filtrarProductos);
                elemento.addEventListener("change", filtrarProductos);
            }
        });
    }

    cargarDetalleProducto();
});
