// Administración de productos y usuarios - Pastelería Mil Sabores
const CLAVE_PRODUCTOS_ADMIN="productosAdminMilSabores";
const CLAVE_USUARIOS="usuariosMilSabores";

const USUARIOS_PRUEBA_ADMIN=[
    {run:"111111111",nombre:"Administrador",apellidos:"Prueba",correo:"admin@duoc.cl",password:"Admin123",fechaNacimiento:"1990-01-01",codigoPromocional:"",region:"Metropolitana",comuna:"Santiago",direccion:"Dirección de prueba",rol:"Administrador"},
    {run:"222222222",nombre:"Cliente",apellidos:"Prueba",correo:"cliente@gmail.com",password:"Cliente12",fechaNacimiento:"2000-01-01",codigoPromocional:"",region:"Metropolitana",comuna:"Santiago",direccion:"Dirección de prueba",rol:"Cliente"}
];

function inicializarUsuariosPruebaAdmin(){
    const usuarios=leerJSON(CLAVE_USUARIOS,[]);
    let cambio=false;
    USUARIOS_PRUEBA_ADMIN.forEach(prueba=>{
        const existe=usuarios.some(u=>String(u.run||"").toUpperCase()===prueba.run || String(u.correo||"").toLowerCase()===prueba.correo);
        if(!existe){usuarios.push(prueba);cambio=true;}
    });
    if(cambio || !localStorage.getItem(CLAVE_USUARIOS)) guardarUsuarios(usuarios);
    return usuarios;
}

function leerJSON(clave, defecto=[]) { try { const v=JSON.parse(localStorage.getItem(clave)); return Array.isArray(v)?v:defecto; } catch(e){ return defecto; } }
function guardarJSON(clave, valor){ localStorage.setItem(clave,JSON.stringify(valor)); }
function precioCLP(v){ return new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(Number(v)||0); }
function escapeHTML(v){ return String(v??"").replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c])); }

function obtenerProductosAdmin(){
    let lista=leerJSON(CLAVE_PRODUCTOS_ADMIN,[]);
    if(!lista.length && typeof productos!=="undefined"){
        lista=productos.map((p,i)=>({...p,stock:10,stockCritico:3,imagen:p.imagen||"../assets/img/logo-pasteleria.png"})); guardarJSON(CLAVE_PRODUCTOS_ADMIN,lista);
    }
    return lista;
}
function guardarProductosAdmin(lista){ guardarJSON(CLAVE_PRODUCTOS_ADMIN,lista); }
function obtenerUsuarios(){ return leerJSON(CLAVE_USUARIOS,[]); }
function guardarUsuarios(lista){ guardarJSON(CLAVE_USUARIOS,lista); }

function errorCampo(id,mensaje){ const e=document.getElementById("error-"+id); const c=document.getElementById(id); if(e)e.textContent=mensaje; if(c)c.classList.toggle("campo-invalido",Boolean(mensaje)); }
function limpiarErrores(ids){ ids.forEach(id=>errorCampo(id,"")); }

function cargarTablaProductosAdmin(){
    const tbody=document.getElementById("tabla-productos-body"); if(!tbody)return;
    const q=(document.getElementById("buscar-producto")?.value||"").trim().toLowerCase(); const cat=document.getElementById("filtrar-categoria")?.value||"";
    const lista=obtenerProductosAdmin().filter(p=>(!q||p.nombre.toLowerCase().includes(q)||p.codigo.toLowerCase().includes(q))&&(!cat||p.categoria===cat));
    tbody.innerHTML="";
    lista.forEach(p=>{ const tr=document.createElement("tr"); tr.style.borderBottom="1px solid var(--borde)";
        const img=p.imagen||"../assets/img/logo-pasteleria.png";
        tr.innerHTML=`<td style="padding:12px 8px;font-weight:700">${escapeHTML(p.codigo)}</td><td style="padding:12px 8px"><img src="${escapeHTML(img)}" alt="${escapeHTML(p.nombre)}" style="width:45px;height:45px;object-fit:cover;border-radius:8px" onerror="this.src='../assets/img/logo-pasteleria.png'"></td><td style="padding:12px 8px">${escapeHTML(p.nombre)}</td><td style="padding:12px 8px">${escapeHTML(p.categoria)}</td><td style="padding:12px 8px;font-weight:700">${precioCLP(p.precio)}</td><td style="padding:12px 8px">${Number(p.stock)||0}${p.stockCritico!==""&&Number(p.stock)<=Number(p.stockCritico)?' <strong title="Stock crítico">⚠</strong>':''}</td><td style="padding:12px 8px;text-align:center"><a href="editar-producto.html?codigo=${encodeURIComponent(p.codigo)}" class="btn btn-light" style="min-height:32px;padding:4px 10px;font-size:13px">Editar</a> <button type="button" class="btn btn-secondary eliminar-producto" data-codigo="${escapeHTML(p.codigo)}" style="min-height:32px;padding:4px 10px;font-size:13px">Eliminar</button></td>`; tbody.appendChild(tr); });
    const vacio=document.getElementById("mensaje-tabla-vacia"); if(vacio)vacio.textContent=lista.length?"":"No hay productos que coincidan con los filtros.";
    tbody.querySelectorAll(".eliminar-producto").forEach(b=>b.addEventListener("click",()=>{ if(!confirm("¿Eliminar este producto?"))return; guardarProductosAdmin(obtenerProductosAdmin().filter(p=>p.codigo!==b.dataset.codigo)); cargarTablaProductosAdmin(); }));
}

function validarProducto(form, codigoOriginal=""){
    const ids=["codigo","nombre","categoria","precio","stock","stockCritico","imagen","descripcion"]; limpiarErrores(ids); let ok=true;
    const codigo=form.codigo.value.trim(), nombre=form.nombre.value.trim(), cat=form.categoria.value, precio=Number(form.precio.value), stock=Number(form.stock.value), sc=form.stockCritico.value.trim(), desc=form.descripcion.value.trim();
    if(!codigo||codigo.length<3){errorCampo("codigo","El código es obligatorio y debe tener al menos 3 caracteres.");ok=false;}
    else if(obtenerProductosAdmin().some(p=>p.codigo.toUpperCase()===codigo.toUpperCase()&&p.codigo!==codigoOriginal)){errorCampo("codigo","El código ya existe.");ok=false;}
    if(!nombre){errorCampo("nombre","El nombre es obligatorio.");ok=false;} else if(nombre.length>100){errorCampo("nombre","Máximo 100 caracteres.");ok=false;}
    if(!cat){errorCampo("categoria","Selecciona una categoría.");ok=false;}
    if(form.precio.value===""||precio<0||Number.isNaN(precio)){errorCampo("precio","El precio es obligatorio y debe ser 0 o mayor.");ok=false;}
    if(form.stock.value===""||stock<0||!Number.isInteger(stock)){errorCampo("stock","El stock debe ser un entero igual o mayor que 0.");ok=false;}
    if(sc!==""&&(Number(sc)<0||!Number.isInteger(Number(sc)))){errorCampo("stockCritico","El stock crítico debe ser un entero igual o mayor que 0.");ok=false;}
    if(desc.length>500){errorCampo("descripcion","La descripción no puede superar 500 caracteres.");ok=false;}
    return ok;
}
function datosProducto(form){ return {codigo:form.codigo.value.trim().toUpperCase(),nombre:form.nombre.value.trim(),categoria:form.categoria.value,precio:Number(form.precio.value),stock:Number(form.stock.value),stockCritico:form.stockCritico.value.trim()===""?"":Number(form.stockCritico.value),imagen:form.imagen.value.trim()||"../assets/img/logo-pasteleria.png",descripcion:form.descripcion.value.trim()}; }
function inicializarFormularioNuevoProducto(){ const form=document.getElementById("form-nuevo-producto"); if(!form)return; form.addEventListener("submit",e=>{e.preventDefault(); if(!validarProducto(form))return; const lista=obtenerProductosAdmin(); const d=datosProducto(form); d.id=Math.max(0,...lista.map(p=>Number(p.id)||0))+1; lista.push(d); guardarProductosAdmin(lista); const m=document.getElementById("producto-mensaje"); if(m){m.textContent="Producto guardado correctamente.";m.className="form-message mensaje-exito";} form.reset(); }); }
function inicializarFormularioEditarProducto(){ const form=document.getElementById("form-editar-producto"); if(!form)return; const codigo=new URLSearchParams(location.search).get("codigo"); const lista=obtenerProductosAdmin(); const p=lista.find(x=>x.codigo===codigo); const m=document.getElementById("producto-mensaje"); if(!p){if(m)m.textContent="Producto no encontrado.";return;} ["codigo","nombre","categoria","precio","stock","stockCritico","imagen","descripcion"].forEach(id=>{if(form[id])form[id].value=p[id]??"";}); form.addEventListener("submit",e=>{e.preventDefault(); if(!validarProducto(form,p.codigo))return; const i=lista.findIndex(x=>x.codigo===p.codigo); lista[i]={...p,...datosProducto(form)}; guardarProductosAdmin(lista); if(m){m.textContent="Producto actualizado correctamente.";m.className="form-message mensaje-exito";} }); }

function cargarTablaUsuarios(){ const tbody=document.getElementById("tabla-usuarios-body"); if(!tbody)return; const q=(document.getElementById("buscar-usuario")?.value||"").trim().toLowerCase(), rol=document.getElementById("filtrar-rol")?.value||""; const lista=obtenerUsuarios().filter(u=>(!q||u.run.toLowerCase().includes(q)||u.nombre.toLowerCase().includes(q)||(u.apellidos||"").toLowerCase().includes(q)||u.correo.toLowerCase().includes(q))&&(!rol||u.rol===rol)); tbody.innerHTML="";
    lista.forEach(u=>{const tr=document.createElement("tr");tr.style.borderBottom="1px solid var(--borde)";tr.innerHTML=`<td style="padding:12px 8px;font-weight:700">${escapeHTML(u.run)}</td><td style="padding:12px 8px">${escapeHTML(u.nombre)} ${escapeHTML(u.apellidos||"")}</td><td style="padding:12px 8px">${escapeHTML(u.correo)}</td><td style="padding:12px 8px">${escapeHTML(u.comuna||"")}</td><td style="padding:12px 8px">${escapeHTML(u.rol||"Cliente")}</td><td style="padding:12px 8px;text-align:center"><a href="editar-usuario.html?run=${encodeURIComponent(u.run)}" class="btn btn-light" style="min-height:32px;padding:4px 10px;font-size:13px">Editar</a> <button type="button" class="btn btn-secondary eliminar-usuario" data-run="${escapeHTML(u.run)}" style="min-height:32px;padding:4px 10px;font-size:13px">Eliminar</button></td>`;tbody.appendChild(tr);});
    const vacio=document.getElementById("mensaje-tabla-usuarios-vacia");if(vacio)vacio.textContent=lista.length?"":"No hay usuarios que coincidan con los filtros."; tbody.querySelectorAll(".eliminar-usuario").forEach(b=>b.addEventListener("click",()=>{if(!confirm("¿Eliminar este usuario?"))return;guardarUsuarios(obtenerUsuarios().filter(u=>u.run!==b.dataset.run));cargarTablaUsuarios();})); }

function validarUsuario(form,runOriginal=""){
    const ids=["run","nombre","apellidos","correo","password","fechaNacimiento","rol","region","comuna","direccion"]; limpiarErrores(ids); let ok=true; const run=form.run.value.trim().toUpperCase(), nom=form.nombre.value.trim(), ape=form.apellidos.value.trim(), cor=form.correo.value.trim(), dir=form.direccion.value.trim();
    if(!run){errorCampo("run","El RUN es obligatorio.");ok=false;}else if(typeof validarRun==="function"&&!validarRun(run)){errorCampo("run","RUN inválido. Usa formato sin puntos ni guion.");ok=false;}else if(obtenerUsuarios().some(u=>u.run===run&&u.run!==runOriginal)){errorCampo("run","El RUN ya existe.");ok=false;}
    if(!nom){errorCampo("nombre","El nombre es obligatorio.");ok=false;}else if(nom.length>50){errorCampo("nombre","Máximo 50 caracteres.");ok=false;}
    if(!ape){errorCampo("apellidos","Los apellidos son obligatorios.");ok=false;}else if(ape.length>100){errorCampo("apellidos","Máximo 100 caracteres.");ok=false;}
    if(!cor){errorCampo("correo","El correo es obligatorio.");ok=false;}else if(typeof correoPermitido==="function"&&!correoPermitido(cor)){errorCampo("correo","Usa @duoc.cl, @profesor.duoc.cl o @gmail.com.");ok=false;}
    if(!form.password.value||form.password.value.length<4||form.password.value.length>10){errorCampo("password","La contraseña debe tener entre 4 y 10 caracteres.");ok=false;}
    if(!form.rol.value){errorCampo("rol","Selecciona un rol.");ok=false;} if(!form.region.value){errorCampo("region","Selecciona una región.");ok=false;} if(!form.comuna.value){errorCampo("comuna","Selecciona una comuna.");ok=false;}
    if(!dir){errorCampo("direccion","La dirección es obligatoria.");ok=false;}else if(dir.length>300){errorCampo("direccion","Máximo 300 caracteres.");ok=false;} return ok;
}
function datosUsuario(form){return {run:form.run.value.trim().toUpperCase(),nombre:form.nombre.value.trim(),apellidos:form.apellidos.value.trim(),correo:form.correo.value.trim().toLowerCase(),password:form.password.value,fechaNacimiento:form.fechaNacimiento.value,rol:form.rol.value,region:form.region.value,comuna:form.comuna.value,direccion:form.direccion.value.trim()};}
function prepararRegionComuna(form,reg="",com=""){ if(typeof cargarRegionesYComunas==="function") cargarRegionesYComunas(form.region,form.comuna,reg,com); }
function inicializarNuevoUsuario(){const form=document.getElementById("form-nuevo-usuario");if(!form)return;prepararRegionComuna(form);form.addEventListener("submit",e=>{e.preventDefault();if(!validarUsuario(form))return;const l=obtenerUsuarios();l.push(datosUsuario(form));guardarUsuarios(l);const m=document.getElementById("usuario-mensaje");if(m){m.textContent="Usuario guardado correctamente.";m.className="form-message mensaje-exito";}form.reset();prepararRegionComuna(form);});}
function inicializarEditarUsuario(){const form=document.getElementById("form-editar-usuario");if(!form)return;const run=new URLSearchParams(location.search).get("run"),l=obtenerUsuarios(),u=l.find(x=>x.run===run),m=document.getElementById("usuario-mensaje");if(!u){if(m)m.textContent="Usuario no encontrado.";return;}["run","nombre","apellidos","correo","password","fechaNacimiento","rol","direccion"].forEach(id=>{if(form[id])form[id].value=u[id]??"";});prepararRegionComuna(form,u.region,u.comuna);form.addEventListener("submit",e=>{e.preventDefault();if(!validarUsuario(form,u.run))return;const i=l.findIndex(x=>x.run===u.run);l[i]=datosUsuario(form);guardarUsuarios(l);if(m){m.textContent="Usuario actualizado correctamente.";m.className="form-message mensaje-exito";}});}

document.addEventListener("DOMContentLoaded",()=>{
    inicializarUsuariosPruebaAdmin();
    obtenerProductosAdmin(); cargarTablaProductosAdmin(); inicializarFormularioNuevoProducto(); inicializarFormularioEditarProducto(); cargarTablaUsuarios(); inicializarNuevoUsuario(); inicializarEditarUsuario();
    document.getElementById("buscar-producto")?.addEventListener("input",cargarTablaProductosAdmin); document.getElementById("filtrar-categoria")?.addEventListener("change",cargarTablaProductosAdmin); document.getElementById("buscar-usuario")?.addEventListener("input",cargarTablaUsuarios); document.getElementById("filtrar-rol")?.addEventListener("change",cargarTablaUsuarios);
});
