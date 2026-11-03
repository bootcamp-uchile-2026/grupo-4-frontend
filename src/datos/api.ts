// Todo lo que necesitamos para hablar con la API del backend (la que se ve en Swagger).
// Vive en un solo archivo para no copiar las mismas direcciones y tipos en cada página.

// Direcciones de la API. Sin filtros = traen TODOS.
const URL_PRODUCTOS = "http://3.144.233.145:3001/productos"
const URL_PROVEEDORES = "http://3.144.233.145:3001/proveedores"

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

export type {ProductoApi, ProveedorApi}
export {URL_PRODUCTOS, URL_PROVEEDORES}
