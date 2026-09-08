/* ==========================================================================
   ADMIN.JS - GESTIÓN DE PRODUCTOS Y DASHBOARD DE ADMINISTRACIÓN
   ========================================================================== */

const CLAVE_PRODUCTOS = "productosMilSabores";

// --- FUNCIONES DE ALMACENAMIENTO ---

function obtenerProductosAdmin() {
    try {
        const guardados = localStorage.getItem(CLAVE_PRODUCTOS);
        if (!guardados) {
            // Si no existen productos en localStorage, se inicializa con los de data.js
            if (typeof productos !== "undefined") {
                localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
                return productos;
            }
            return [];
        }
        return JSON.parse(guardados);
    } catch (e) {
        return typeof productos !== "undefined" ? productos : [];
    }
}

function guardarProductosAdmin(lista) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(lista));
}

// --- RENDERIZADO DE TABLA DE PRODUCTOS ---

function cargarTablaProductosAdmin() {
    const tablaBody = document.getElementById("tablaProductosBody");
    if (!tablaBody) return;

    const buscador = document.getElementById("buscarProductoAdmin");
    const filtroCat = document.getElementById("filtroCategoriaAdmin");

    const texto = buscador ? buscador.value.trim().toLowerCase() : "";
    const categoria = filtroCat ? filtroCat.value : "";

    const listaProductos = obtenerProductosAdmin();

    const filtrados = listaProductos.filter(p => {
        const coincideTexto = p.nombre.toLowerCase().includes(texto) || p.codigo.toLowerCase().includes(texto);
        const coincideCat = categoria === "" || p.categoria === categoria;
        return coincideTexto && coincideCat;
    });

    tablaBody.innerHTML = "";

    if (filtrados.length === 0) {
        tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">No se encontraron productos registrados.</td></tr>`;
        return;
    }

    filtrados.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${p.codigo}</strong></td>
            <td>
                <img src="${p.imagen}" alt="${p.nombre}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;" onerror="this.src='../assets/img/logo-pasteleria.png'">
            </td>
            <td>${p.nombre}</td>
            <td>${p.categoria}</td>
            <td>$${Number(p.precio).toLocaleString("es-CL")} CLP</td>
            <td style="text-align: center;">
                <a href="EditarProducto.html?codigo=${encodeURIComponent(p.codigo)}" class="btn btn-light" style="padding: 4px 8px; font-size: 12px;">Editar</a>
                <button type="button" class="btn btn-eliminar-producto" data-codigo="${p.codigo}" style="padding: 4px 8px; font-size: 12px; background-color: #d9534f; color: white; border: none; border-radius: 4px; cursor: pointer;">Eliminar</button>
            </td>
        `;
        tablaBody.appendChild(tr);
    });

    // Asignación de eventos de eliminación
    tablaBody.querySelectorAll(".btn-eliminar-producto").forEach(boton => {
        boton.addEventListener("click", function() {
            eliminarProductoAdmin(this.dataset.codigo);
        });
    });
}

function eliminarProductoAdmin(codigo) {
    if (confirm(`¿Está seguro de que desea eliminar el producto con código: ${codigo}?`)) {
        let lista = obtenerProductosAdmin();
        lista = lista.filter(p => p.codigo !== codigo);
        guardarProductosAdmin(lista);
        cargarTablaProductosAdmin();
    }
}

// --- FORMULARIO CREAR PRODUCTO ---

function inicializarFormularioNuevoProducto() {
    const form = document.getElementById("formNuevoProducto");
    if (!form) return;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const codigo = document.getElementById("codigo").value.trim().toUpperCase();
        const nombre = document.getElementById("nombre").value.trim();
        const categoria = document.getElementById("categoria").value;
        const precio = Number(document.getElementById("precio").value);
        const tipo = document.getElementById("tipo") ? document.getElementById("tipo").value : "Torta";
        const tamano = document.getElementById("tamano") ? document.getElementById("tamano").value : "Mediana";
        const imagen = document.getElementById("imagen").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();
        const mensajeEl = document.getElementById("mensajeAdmin");

        if (!codigo || !nombre || !categoria || isNaN(precio) || precio <= 0 || !imagen || !descripcion) {
            if (mensajeEl) {
                mensajeEl.textContent = "Por favor, completa todos los campos requeridos con datos válidos.";
                mensajeEl.className = "form-message mensaje-error";
            }
            return;
        }

        const lista = obtenerProductosAdmin();
        if (lista.some(p => p.codigo === codigo)) {
            if (mensajeEl) {
                mensajeEl.textContent = "Ya existe un producto con el mismo código.";
                mensajeEl.className = "form-message mensaje-error";
            }
            return;
        }

        const nuevoProducto = { codigo, categoria, nombre, precio, tipo, tamano, descripcion, imagen };
        lista.push(nuevoProducto);
        guardarProductosAdmin(lista);

        if (mensajeEl) {
            mensajeEl.textContent = "Producto guardado con éxito.";
            mensajeEl.className = "form-message mensaje-exito";
        }

        setTimeout(() => {
            window.location.href = "ProductosAdmin.html";
        }, 1200);
    });
}

// --- FORMULARIO EDITAR PRODUCTO ---

function inicializarFormularioEditarProducto() {
    const form = document.getElementById("formEditarProducto");
    if (!form) return;

    const parametros = new URLSearchParams(window.location.search);
    const codigoParam = (parametros.get("codigo") || "").trim().toUpperCase();

    const lista = obtenerProductosAdmin();
    const producto = lista.find(p => p.codigo === codigoParam);

    const mensajeEl = document.getElementById("mensajeAdmin");

    if (!producto) {
        if (mensajeEl) {
            mensajeEl.textContent = "El producto solicitado no existe.";
            mensajeEl.className = "form-message mensaje-error";
        }
        return;
    }

    // Poblar campos del formulario
    document.getElementById("codigo").value = producto.codigo;
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("categoria").value = producto.categoria;
    document.getElementById("precio").value = producto.precio;
    if (document.getElementById("tipo")) document.getElementById("tipo").value = producto.tipo || "Torta";
    if (document.getElementById("tamano")) document.getElementById("tamano").value = producto.tamano || "Mediana";
    document.getElementById("imagen").value = producto.imagen;
    document.getElementById("descripcion").value = producto.descripcion;

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const categoria = document.getElementById("categoria").value;
        const precio = Number(document.getElementById("precio").value);
        const tipo = document.getElementById("tipo") ? document.getElementById("tipo").value : "Torta";
        const tamano = document.getElementById("tamano") ? document.getElementById("tamano").value : "Mediana";
        const imagen = document.getElementById("imagen").value.trim();
        const descripcion = document.getElementById("descripcion").value.trim();

        if (!nombre || !categoria || isNaN(precio) || precio <= 0 || !imagen || !descripcion) {
            if (mensajeEl) {
                mensajeEl.textContent = "Por favor, completa todos los campos requeridos válidamente.";
                mensajeEl.className = "form-message mensaje-error";
            }
            return;
        }

        producto.nombre = nombre;
        producto.categoria = categoria;
        producto.precio = precio;
        producto.tipo = tipo;
        producto.tamano = tamano;
        producto.imagen = imagen;
        producto.descripcion = descripcion;

        guardarProductosAdmin(lista);

        if (mensajeEl) {
            mensajeEl.textContent = "Producto actualizado correctamente.";
            mensajeEl.className = "form-message mensaje-exito";
        }

        setTimeout(() => {
            window.location.href = "ProductosAdmin.html";
        }, 1200);
    });
}

// --- INICIALIZACIÓN GENERAL EN CARGA DE DOM ---

document.addEventListener("DOMContentLoaded", function() {
    // Asegurar inicialización de productos en localStorage si está vacío
    obtenerProductosAdmin();

    // Vistas
    cargarTablaProductosAdmin();
    inicializarFormularioNuevoProducto();
    inicializarFormularioEditarProducto();

    // Eventos de filtro para la tabla de administración
    const buscador = document.getElementById("buscarProductoAdmin");
    const filtroCat = document.getElementById("filtroCategoriaAdmin");

    if (buscador) buscador.addEventListener("input", cargarTablaProductosAdmin);
    if (filtroCat) filtroCat.addEventListener("change", cargarTablaProductosAdmin);
});