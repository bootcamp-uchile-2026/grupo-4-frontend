// Todo lo que necesitamos para hablar con la API del backend (la que se ve en Swagger).
// Vive en un solo archivo para no copiar las mismas direcciones y tipos en cada página.

// Direcciones de la API. Sin filtros = traen TODOS.
const URL_PRODUCTOS = "http://13.184.190.150:3000/productos"
const URL_PROVEEDORES = "http://13.184.190.150:3000/proveedores"

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
    imagen: string
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

// Lo que guardamos cuando un ADMIN inicia sesión.
type SesionAdmin = {
    token: string          // la "pulsera" que se muestra en cada pedido protegido
    email: string          // para mostrar quién está conectado
}

// ARREGLO TEMPORAL: la API entrega algunas tildes mal escritas (ej: "LÃ¡cteos" en vez de "Lácteos").
// Es un error del backend al guardar los datos. Mientras lo corrigen, cambiamos cada símbolo raro
// por la letra correcta. Si el texto viene bien, no cambia nada.
const tildesMalas = [
    ["Ã¡", "á"],
    ["Ã©", "é"],
    ["Ã­", "í"],     // la "í" mal escrita lleva un carácter invisible después de la Ã
    ["Ã³", "ó"],
    ["Ãº", "ú"],
    ["Ã±", "ñ"],
    ["Ã¼", "ü"],
    ["Ã‰", "É"],
    ["Ã“", "Ó"],
    ["Ãš", "Ú"],
    ["Ã‘", "Ñ"],
    ["Â¿", "¿"],
    ["Â¡", "¡"],
]

// Lee la respuesta de la API y arregla las tildes antes de convertirla a datos.
// Se usa en vez de "await respuesta.json()".
async function leerJson(respuesta: Response) {
    let texto = await respuesta.text()             // 1) la respuesta como texto
    for (const [mala, buena] of tildesMalas) {
        texto = texto.replaceAll(mala, buena)      // 2) cambiamos cada símbolo raro por la letra correcta
    }
    return JSON.parse(texto)                       // 3) texto JSON → datos (lo mismo que hace .json())
}

export type {ProductoApi, ProveedorApi, CategoriaApi, UsuarioApi, SesionAdmin}
export {URL_PRODUCTOS, URL_PROVEEDORES, URL_CATEGORIAS, URL_LOGIN, URL_USUARIOS, leerJson}
