// Validaciones de formularios - Pastelería Mil Sabores

const formContacto = document.getElementById("form-contacto");

if (formContacto) {
    const nombre = document.getElementById("contacto-nombre");
    const correo = document.getElementById("contacto-correo");
    const comentario = document.getElementById("contacto-comentario");
    const contadorComentario = document.getElementById("contador-comentario");
    const mensajeContacto = document.getElementById("mensaje-contacto");

    const dominiosPermitidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

    function mostrarError(campo, mensaje) {
        const error = document.getElementById(`error-${campo.id.replace("contacto-", "")}`);
        campo.classList.add("campo-invalido");
        campo.setAttribute("aria-invalid", "true");
        error.textContent = mensaje;
    }

    function limpiarError(campo) {
        const error = document.getElementById(`error-${campo.id.replace("contacto-", "")}`);
        campo.classList.remove("campo-invalido");
        campo.removeAttribute("aria-invalid");
        error.textContent = "";
    }

    function validarNombre() {
        const valor = nombre.value.trim();
        limpiarError(nombre);

        if (valor === "") {
            mostrarError(nombre, "Ingresa tu nombre para continuar.");
            return false;
        }

        if (valor.length > 100) {
            mostrarError(nombre, "El nombre no puede superar los 100 caracteres.");
            return false;
        }

        return true;
    }

    function validarCorreo() {
        const valor = correo.value.trim().toLowerCase();
        limpiarError(correo);

        if (valor === "") {
            return true;
        }

        if (valor.length > 100) {
            mostrarError(correo, "El correo no puede superar los 100 caracteres.");
            return false;
        }

        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatoCorreo.test(valor)) {
            mostrarError(correo, "Ingresa un correo con un formato válido.");
            return false;
        }

        const dominioValido = dominiosPermitidos.some((dominio) => valor.endsWith(dominio));
        if (!dominioValido) {
            mostrarError(correo, "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
            return false;
        }

        return true;
    }

    function validarComentario() {
        const valor = comentario.value.trim();
        limpiarError(comentario);

        if (valor === "") {
            mostrarError(comentario, "Escribe un comentario antes de enviar el formulario.");
            return false;
        }

        if (valor.length > 500) {
            mostrarError(comentario, "El comentario no puede superar los 500 caracteres.");
            return false;
        }

        return true;
    }

    function actualizarContador() {
        contadorComentario.textContent = `${comentario.value.length} / 500`;
    }

    nombre.addEventListener("blur", validarNombre);
    nombre.addEventListener("input", () => {
        if (nombre.classList.contains("campo-invalido")) validarNombre();
    });

    correo.addEventListener("blur", validarCorreo);
    correo.addEventListener("input", () => {
        if (correo.classList.contains("campo-invalido")) validarCorreo();
    });

    comentario.addEventListener("blur", validarComentario);
    comentario.addEventListener("input", () => {
        actualizarContador();
        if (comentario.classList.contains("campo-invalido")) validarComentario();
    });

    formContacto.addEventListener("submit", (event) => {
        event.preventDefault();
        mensajeContacto.textContent = "";
        mensajeContacto.className = "contacto-mensaje";

        const nombreValido = validarNombre();
        const correoValido = validarCorreo();
        const comentarioValido = validarComentario();

        if (!nombreValido || !correoValido || !comentarioValido) {
            mensajeContacto.textContent = "Revisa los campos marcados antes de enviar el mensaje.";
            mensajeContacto.classList.add("contacto-mensaje-error");

            const primerCampoInvalido = formContacto.querySelector(".campo-invalido");
            if (primerCampoInvalido) primerCampoInvalido.focus();
            return;
        }

        mensajeContacto.textContent = "Mensaje validado correctamente. En esta etapa Front-End el envío se simula sin servidor.";
        mensajeContacto.classList.add("contacto-mensaje-exito");

        formContacto.reset();
        actualizarContador();
        [nombre, correo, comentario].forEach(limpiarError);
    });

    actualizarContador();
}
