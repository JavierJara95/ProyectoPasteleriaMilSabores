// Validaciones de formularios - Pastelería Mil Sabores

const DOMINIOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

const CLAVE_USUARIOS_PUBLICOS = "usuariosMilSabores";
const USUARIOS_PRUEBA = [
    {
        run: "111111111",
        nombre: "Administrador",
        apellidos: "Prueba",
        correo: "admin@duoc.cl",
        password: "Admin123",
        fechaNacimiento: "1990-01-01",
        codigoPromocional: "",
        region: "Metropolitana",
        comuna: "Santiago",
        direccion: "Dirección de prueba",
        rol: "Administrador"
    },
    {
        run: "222222222",
        nombre: "Cliente",
        apellidos: "Prueba",
        correo: "cliente@gmail.com",
        password: "Cliente12",
        fechaNacimiento: "2000-01-01",
        codigoPromocional: "",
        region: "Metropolitana",
        comuna: "Santiago",
        direccion: "Dirección de prueba",
        rol: "Cliente"
    }
];

function inicializarUsuariosPrueba() {
    let usuarios = [];
    try {
        const guardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS_PUBLICOS) || "[]");
        usuarios = Array.isArray(guardados) ? guardados : [];
    } catch (error) {
        usuarios = [];
    }

    let huboCambios = false;
    USUARIOS_PRUEBA.forEach((usuarioPrueba) => {
        const existe = usuarios.some((u) =>
            String(u.run || "").toUpperCase() === usuarioPrueba.run ||
            String(u.correo || "").toLowerCase() === usuarioPrueba.correo
        );
        if (!existe) {
            usuarios.push(usuarioPrueba);
            huboCambios = true;
        }
    });

    if (huboCambios || !localStorage.getItem(CLAVE_USUARIOS_PUBLICOS)) {
        localStorage.setItem(CLAVE_USUARIOS_PUBLICOS, JSON.stringify(usuarios));
    }
    return usuarios;
}

inicializarUsuariosPrueba();

function correoPermitido(valor) {
    const correo = valor.trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) &&
        DOMINIOS_PERMITIDOS.some((dominio) => correo.endsWith(dominio));
}

function validarRun(run) {
    const limpio = String(run).replace(/\./g, "").replace(/-/g, "").toUpperCase();
    if (!/^[0-9]{6,8}[0-9K]$/.test(limpio) || limpio.length < 7 || limpio.length > 9) return false;
    const cuerpo = limpio.slice(0, -1);
    const dv = limpio.slice(-1);
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const resto = 11 - (suma % 11);
    const esperado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
    return dv === esperado;
}

function cargarRegionesYComunas(region, comuna, regionSeleccionada = "", comunaSeleccionada = "") {
    if (!region || !comuna || typeof regionesComunas === "undefined") return;
    region.innerHTML = '<option value="">Selecciona una región</option>';
    Object.keys(regionesComunas).forEach((nombre) => {
        const op = document.createElement("option"); op.value = nombre; op.textContent = nombre; region.appendChild(op);
    });
    function cargarComunas() {
        comuna.innerHTML = '<option value="">Selecciona una comuna</option>';
        const lista = regionesComunas[region.value] || [];
        comuna.disabled = lista.length === 0;
        lista.forEach((nombre) => { const op = document.createElement("option"); op.value = nombre; op.textContent = nombre; comuna.appendChild(op); });
        if (comunaSeleccionada && lista.includes(comunaSeleccionada)) comuna.value = comunaSeleccionada;
    }
    region.value = regionSeleccionada;
    cargarComunas();
    region.addEventListener("change", () => { comunaSeleccionada = ""; cargarComunas(); });
}

function setError(input, errorEl, mensaje) {
    if (input) { input.classList.add("campo-invalido"); input.setAttribute("aria-invalid", "true"); }
    if (errorEl) errorEl.textContent = mensaje;
}
function clearError(input, errorEl) {
    if (input) { input.classList.remove("campo-invalido"); input.removeAttribute("aria-invalid"); }
    if (errorEl) errorEl.textContent = "";
}

// CONTACTO
const formContacto = document.getElementById("form-contacto");
if (formContacto) {
    const nombre = document.getElementById("contacto-nombre");
    const correo = document.getElementById("contacto-correo");
    const comentario = document.getElementById("contacto-comentario");
    const contador = document.getElementById("contador-comentario");
    const mensaje = document.getElementById("mensaje-contacto");
    const eNombre = document.getElementById("error-nombre"), eCorreo = document.getElementById("error-correo"), eComentario = document.getElementById("error-comentario");
    const validar = () => {
        let ok = true;
        clearError(nombre,eNombre); clearError(correo,eCorreo); clearError(comentario,eComentario);
        if (!nombre.value.trim()) { setError(nombre,eNombre,"Ingresa tu nombre para continuar."); ok=false; }
        else if (nombre.value.trim().length>100) { setError(nombre,eNombre,"El nombre no puede superar los 100 caracteres."); ok=false; }
        if (correo.value.trim() && !correoPermitido(correo.value)) { setError(correo,eCorreo,"Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com."); ok=false; }
        if (!comentario.value.trim()) { setError(comentario,eComentario,"Escribe un comentario antes de enviar."); ok=false; }
        else if (comentario.value.trim().length>500) { setError(comentario,eComentario,"El comentario no puede superar los 500 caracteres."); ok=false; }
        return ok;
    };
    if (contador) { const upd=()=>contador.textContent=`${comentario.value.length} / 500`; comentario.addEventListener("input",upd); upd(); }
    formContacto.addEventListener("submit", e => { e.preventDefault(); mensaje.textContent=""; if(!validar()) return; mensaje.textContent="Mensaje enviado correctamente."; mensaje.className="contacto-mensaje mensaje-exito"; formContacto.reset(); if(contador) contador.textContent="0 / 500"; });
}

// LOGIN (simulación front-end; EV1 no requiere autenticación real)
const formLogin = document.getElementById("formLogin");
if (formLogin) {
    const correo=document.getElementById("correo"), pass=document.getElementById("contrasena");
    const eCorreo=document.getElementById("errorCorreo"), ePass=document.getElementById("errorContrasena"), msg=document.getElementById("mensajeLogin");
    function validarLogin(){
        let ok=true; clearError(correo,eCorreo); clearError(pass,ePass); msg.textContent="";
        if(!correo.value.trim()){setError(correo,eCorreo,"El correo es obligatorio.");ok=false;}
        else if(correo.value.trim().length>100){setError(correo,eCorreo,"El correo no puede superar los 100 caracteres.");ok=false;}
        else if(!correoPermitido(correo.value)){setError(correo,eCorreo,"Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");ok=false;}
        if(!pass.value){setError(pass,ePass,"La contraseña es obligatoria.");ok=false;}
        else if(pass.value.length<4 || pass.value.length>10){setError(pass,ePass,"La contraseña debe tener entre 4 y 10 caracteres.");ok=false;}
        return ok;
    }
    formLogin.addEventListener("submit",e=>{
        e.preventDefault();
        if(!validarLogin())return;

        const usuarios=inicializarUsuariosPrueba();
        const correoIngresado=correo.value.trim().toLowerCase();
        const usuario=usuarios.find(u=>String(u.correo||"").toLowerCase()===correoIngresado && u.password===pass.value);

        if(!usuario){
            msg.textContent="Correo o contraseña incorrectos.";
            msg.className="form-message mensaje-error";
            return;
        }

        localStorage.setItem("sesionMilSabores",JSON.stringify({run:usuario.run,nombre:usuario.nombre,correo:usuario.correo,rol:usuario.rol}));
        msg.textContent=`Bienvenido/a, ${usuario.nombre}.`;
        msg.className="form-message mensaje-exito";

        setTimeout(()=>{
            window.location.href=usuario.rol==="Administrador" ? "../admin/home.html" : "../index.html";
        },350);
    });
}

// REGISTRO PÚBLICO
const formRegistro=document.getElementById("formRegistro");
if(formRegistro){
    const run=document.getElementById("run"), nombre=document.getElementById("nombre"), apellidos=document.getElementById("apellidos"), correo=document.getElementById("correoRegistro"), password=document.getElementById("passwordRegistro"), fecha=document.getElementById("fechaNacimiento"), codigo=document.getElementById("codigoPromocional"), region=document.getElementById("region"), comuna=document.getElementById("comuna"), direccion=document.getElementById("direccion"), msg=document.getElementById("mensajeRegistro");
    cargarRegionesYComunas(region,comuna);
    const errores={run:document.getElementById("errorRun"),nombre:document.getElementById("errorNombre"),apellidos:document.getElementById("errorApellidos"),correo:document.getElementById("errorCorreoRegistro"),password:document.getElementById("errorPasswordRegistro"),fecha:document.getElementById("errorFechaNacimiento"),codigo:document.getElementById("errorCodigoPromocional"),region:document.getElementById("errorRegion"),comuna:document.getElementById("errorComuna"),direccion:document.getElementById("errorDireccion")};
    function valida(){
        let ok=true; [[run,errores.run],[nombre,errores.nombre],[apellidos,errores.apellidos],[correo,errores.correo],[password,errores.password],[fecha,errores.fecha],[codigo,errores.codigo],[region,errores.region],[comuna,errores.comuna],[direccion,errores.direccion]].forEach(x=>clearError(x[0],x[1]));
        const r=run.value.trim().toUpperCase(); if(!r){setError(run,errores.run,"El RUN es obligatorio.");ok=false;} else if(!validarRun(r)){setError(run,errores.run,"Ingresa un RUN válido, sin puntos ni guion.");ok=false;}
        if(!nombre.value.trim()){setError(nombre,errores.nombre,"El nombre es obligatorio.");ok=false;} else if(nombre.value.trim().length>50){setError(nombre,errores.nombre,"Máximo 50 caracteres.");ok=false;}
        if(!apellidos.value.trim()){setError(apellidos,errores.apellidos,"Los apellidos son obligatorios.");ok=false;} else if(apellidos.value.trim().length>100){setError(apellidos,errores.apellidos,"Máximo 100 caracteres.");ok=false;}
        if(!correo.value.trim()){setError(correo,errores.correo,"El correo es obligatorio.");ok=false;} else if(correo.value.trim().length>100){setError(correo,errores.correo,"Máximo 100 caracteres.");ok=false;} else if(!correoPermitido(correo.value)){setError(correo,errores.correo,"Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.");ok=false;}
        if(!password.value){setError(password,errores.password,"La contraseña es obligatoria.");ok=false;} else if(password.value.length<4 || password.value.length>10){setError(password,errores.password,"La contraseña debe tener entre 4 y 10 caracteres.");ok=false;}
        if(fecha.value && new Date(fecha.value+"T00:00:00")>new Date()){setError(fecha,errores.fecha,"La fecha de nacimiento no puede ser futura.");ok=false;}
        if(codigo.value.trim() && codigo.value.trim().toUpperCase()!=="FELICES50"){setError(codigo,errores.codigo,"Código no reconocido. Puedes dejarlo vacío o usar FELICES50.");ok=false;}
        if(!region.value){setError(region,errores.region,"Selecciona una región.");ok=false;}
        if(!comuna.value){setError(comuna,errores.comuna,"Selecciona una comuna.");ok=false;}
        if(!direccion.value.trim()){setError(direccion,errores.direccion,"La dirección es obligatoria.");ok=false;} else if(direccion.value.trim().length>300){setError(direccion,errores.direccion,"Máximo 300 caracteres.");ok=false;}
        return ok;
    }
    formRegistro.addEventListener("submit",e=>{e.preventDefault(); msg.textContent=""; if(!valida())return;
        const usuarios=inicializarUsuariosPrueba(); const r=run.value.trim().toUpperCase(); const correoNormalizado=correo.value.trim().toLowerCase();
        if(usuarios.some(u=>u.run===r)){setError(run,errores.run,"Este RUN ya está registrado.");return;}
        if(usuarios.some(u=>String(u.correo||"").toLowerCase()===correoNormalizado)){setError(correo,errores.correo,"Este correo ya está registrado.");return;}
        const usuario={run:r,nombre:nombre.value.trim(),apellidos:apellidos.value.trim(),correo:correoNormalizado,password:password.value,fechaNacimiento:fecha.value,codigoPromocional:codigo.value.trim().toUpperCase(),region:region.value,comuna:comuna.value,direccion:direccion.value.trim(),rol:"Cliente"};
        usuarios.push(usuario); localStorage.setItem("usuariosMilSabores",JSON.stringify(usuarios));
        msg.textContent="Cuenta registrada correctamente."; msg.className="form-message mensaje-exito"; formRegistro.reset(); cargarRegionesYComunas(region,comuna);
    });
}
