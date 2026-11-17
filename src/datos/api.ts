// RESUMEN: todo lo que necesitamos para hablar con la API del backend (la que se ve en Swagger):
// las direcciones (URL), la forma de los datos (tipos) y la función iniciarSesion.
// Vive en un solo archivo para no copiar lo mismo en cada página.

import type { Usuario } from "./usuario"

// Dirección base de la API. Las fotos vienen con ruta relativa ("/uploads/...")
// y hay que pegarle esto adelante para que el navegador las encuentre.
const URL_BASE = "http://13.184.190.150:3000"

// Direcciones de la API. Sin filtros = traen TODOS.
const URL_PRODUCTOS = "http://13.184.190.150:3000/productos"
const URL_PROVEEDORES = "http://13.184.190.150:3000/proveedores"

// Forma de cada imagen de un producto (copiada de Swagger).
type ImagenApi = {
    id: number
    ruta: string           // ej: "/uploads/productos/imagen1.webp"
    esPrincipal: boolean   // true = la foto que se muestra en el catálogo
}

// Forma de cada producto que devuelve la API (copiada del "Response body" de Swagger).
type ProductoApi = {
    id: number
    nombre: string
    descripcion: string
    ingredientes: string
    valorNutricional: string
    categoriaId: number
    proveedorId: number
    precio: number
    fechaVencimiento: string      // viene como texto, ej: "2027-12-31T00:00:00.000Z"
    descuento: number             // porcentaje, ej: 10 = 10%
    precioDescuento: number       // precio ya con el descuento aplicado
    imagenes: ImagenApi[]         // las fotos se suben aparte, con POST /productos/{id}/imagenes
    tipoConservacion: string      // "Ambiente", "Refrigerado" o "Congelado"
    valoracion: number
    favorito: boolean
}

// Forma de cada proveedor (productor) que devuelve la API (copiada de Swagger).
type ProveedorApi = {
    id: number
    nombre: string
    descripcion: string
    email: string
    telefono: string
    imagenes: ImagenApi[]         // fotos del productor (se suben con POST /proveedores/{id}/imagenes)
}

// Dirección de la API de categorías (sirve para pedir la lista y para crear una nueva).
const URL_CATEGORIAS = "http://13.184.190.150:3000/categorias"

// Forma de cada categoría que devuelve la API (copiada de Swagger).
type CategoriaApi = {
    id: number
    nombre: string
}

// Direcciones para el login y para los usuarios (esta última solo la puede usar un ADMIN).
const URL_LOGIN = "http://13.184.190.150:3000/autenticacion/login"
const URL_USUARIOS = "http://13.184.190.150:3000/usuarios"

// Forma de cada usuario que devuelve la API (copiada de Swagger).
type UsuarioApi = {
    id: number
    nombre: string
    apellido: string
    email: string
    telefono: string | null
    rol: string            // "CLIENTE", "ADMIN" o "PROVEEDOR"
}

// Devuelve la dirección completa de la foto principal ("" si no tiene fotos).
// Sirve para productos Y productores: los dos traen una lista "imagenes".
// "ProductoApi | ProveedorApi" = recibe uno u otro (igual que "Usuario | null").
function fotoPrincipal(item: ProductoApi | ProveedorApi) {
    // "find" busca la primera imagen marcada como principal.
    const principal = item.imagenes.find((imagen) => imagen.esPrincipal)
    if (principal) {
        return URL_BASE + principal.ruta
    }
    // Si ninguna es principal, usamos la primera que haya.
    if (item.imagenes.length > 0) {
        return URL_BASE + item.imagenes[0].ruta
    }
    return ""
}

// ===== FOTOS DE PRODUCTOS Y PRODUCTORES =====
// Las usan los formularios del panel (productos y productores).
// Usan FormData, la forma del navegador de enviar archivos (no está en los PDFs del curso).
// "url" dice a quién va la foto: URL_PRODUCTOS o URL_PROVEEDORES (las dos APIs funcionan igual).

// Sube una foto a un producto o productor y la deja como principal. Devuelve la imagen nueva.
async function subirImagen(url: string, id: number, foto: File, token: string) {
    // FormData es como una "caja" para enviar archivos (JSON no puede llevar fotos).
    // "archivo" es el nombre que pide la API (ver Swagger).
    const datos = new FormData()
    datos.append("archivo", foto)

    // 1) Subimos la foto.
    // OJO: aquí NO ponemos "Content-Type": el navegador lo pone solo al ver un FormData.
    const respuesta = await fetch(url + "/" + id + "/imagenes", {
        method: "POST",
        headers: { "Authorization": "Bearer " + token },
        body: datos,
    })
    if (respuesta.status === 401) {
        throw new Error("Tu sesión expiró (dura 15 minutos). Cierra sesión y vuelve a ingresar.")
    }
    if (respuesta.status === 400) {
        throw new Error("La foto no es válida o es demasiado grande")
    }
    if (!respuesta.ok) {
        throw new Error("Error " + respuesta.status + " al subir la foto")
    }
    const imagen: ImagenApi = await respuesta.json()   // { id, ruta, esPrincipal }

    // 2) Si la API no la dejó como principal, se lo pedimos.
    if (!imagen.esPrincipal) {
        const respuestaPrincipal = await fetch(
            url + "/" + id + "/imagenes/" + imagen.id + "/principal",
            { method: "PATCH", headers: { "Authorization": "Bearer " + token } }
        )
        if (!respuestaPrincipal.ok) {
            throw new Error("Error " + respuestaPrincipal.status + " al marcar la foto principal")
        }
    }
    // Copiamos la imagen marcándola como principal (así queda igual que en la API).
    const nueva: ImagenApi = { ...imagen, esPrincipal: true }
    return nueva
}

// Cambia la foto de un producto o productor: sube la nueva y DESPUÉS borra las anteriores.
// En ese orden: si la subida falla, se queda con su foto de antes (no queda sin foto).
// Devuelve la imagen nueva y un texto de aviso ("" si todo salió bien).
async function reemplazarImagen(url: string, item: ProductoApi | ProveedorApi, foto: File, token: string) {
    const nueva = await subirImagen(url, item.id, foto, token)

    // Borramos una por una las fotos que tenía antes.
    let aviso = ""
    for (const anterior of item.imagenes) {
        const respuesta = await fetch(url + "/" + item.id + "/imagenes/" + anterior.id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token },
        })
        // Si no se pudo borrar una antigua, no es grave: la nueva ya es la principal. Solo avisamos.
        if (!respuesta.ok) {
            aviso = " (no se pudo borrar una foto anterior, error " + respuesta.status + ")"
        }
    }
    return { nueva: nueva, aviso: aviso }
}

// Direcciones para crear una cuenta y para pedir "mis datos" (de quien inició sesión).
const URL_REGISTRO = "http://13.184.190.150:3000/registro"
const URL_MI_PERFIL = "http://13.184.190.150:3000/usuarios/me"

// Inicia sesión y trae los datos de quien ingresó.
// La usan "Iniciar sesión" y "Crear cuenta" (después de registrarse, entra solo).
// Si algo falla, lanza un error (throw) que el formulario muestra en pantalla.
async function iniciarSesion(email: string, password: string) {
    // 1) Pedimos el token con email y contraseña.
    const respuestaLogin = await fetch(URL_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
    })
    if (respuestaLogin.status === 401) {
        throw new Error("Email o contraseña incorrectos")
    }
    if (!respuestaLogin.ok) {
        throw new Error("La solicitud no fue exitosa")
    }
    const datosLogin = await respuestaLogin.json()
    const token = datosLogin.access_token      // así lo entrega la API

    // 2) Con el token pedimos "mis datos": nombre, apellido, email y rol.
    const respuestaPerfil = await fetch(URL_MI_PERFIL, {
        headers: { "Authorization": "Bearer " + token },   // mostramos la "pulsera"
    })
    if (!respuestaPerfil.ok) {
        throw new Error("No pudimos obtener tus datos")
    }
    const perfil = await respuestaPerfil.json()

    // 3) Armamos el usuario con los datos de la API y el token.
    const usuario: Usuario = {
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        email: perfil.email,
        rol: perfil.rol,
        token: token,
    }
    return usuario
}

export type {ProductoApi, ImagenApi, ProveedorApi, CategoriaApi, UsuarioApi}
export {URL_PRODUCTOS, URL_PROVEEDORES, URL_CATEGORIAS, URL_LOGIN, URL_USUARIOS, URL_REGISTRO, iniciarSesion, fotoPrincipal, subirImagen, reemplazarImagen}
