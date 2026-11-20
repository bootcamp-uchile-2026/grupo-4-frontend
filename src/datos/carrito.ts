// RESUMEN: forma de los productos del carrito y de los pedidos, y la función que convierte
// un producto de la API en un producto del carrito (aProductoCarrito).
import { fotoPrincipal } from "./api"
import type { ProductoApi } from "./api"

// Forma de cada producto DENTRO del carrito: una copia de los datos al momento de agregarlo.
// La usan varias páginas (Carrito, Checkout y Mi cuenta), por eso vive en su propio archivo.
type Producto = {
    id: number          // el id del producto en la API (para el enlace a su página)
    nombre: string
    productor: string   // el nombre del productor, ya escrito
    precio: number      // precio final (con descuento si tiene)
    meta: string        // ej: "❄️ Refrigerado"
    imagen: string      // dirección de la foto principal
    cantidad: number
}

// Forma que tiene un pedido: se crea al confirmar una compra
// y se muestra después en "Mi cuenta".
type Pedido = {
    numero: number          // ej: 48201
    entrega: string         // rango de fechas de entrega, ej: "22 – 24 ago"
    productos: Producto[]   // lo que se compró
    total: number
    nombre: string
    email: string
    direccion: string
}

// Forma de la función "agregar al carrito" que App pasa a las páginas.
// Le ponemos nombre para no repetir "(producto: ProductoApi, ...) => void" en cada archivo.
type AgregarAlCarrito = (producto: ProductoApi, nombreProveedor: string, cantidad: number) => void

// Convierte un producto de la API en un producto del carrito.
// Guardamos una COPIA de los datos: así el carrito no depende de volver a preguntarle a la API.
function aProductoCarrito(producto: ProductoApi, nombreProveedor: string, cantidad: number) {
    // Si tiene descuento, se cobra el precio rebajado.
    let precio = producto.precio
    if (producto.descuento > 0) {
        precio = producto.precioDescuento
    }

    // Ícono según cómo se conserva: ambiente o frío (refrigerado / congelado).
    let icono = "🌡️"
    if (producto.tipoConservacion !== "Ambiente") {
        icono = "❄️"
    }

    const nuevo: Producto = {
        id: producto.id,
        nombre: producto.nombre,
        productor: nombreProveedor,
        precio: Math.round(precio),       // Math.round redondea: 2327,5 → 2328 (no hay medio peso)
        meta: icono + " " + producto.tipoConservacion,
        imagen: fotoPrincipal(producto),
        cantidad: cantidad,
    }
    return nuevo
}

export type {Producto, Pedido, AgregarAlCarrito}
export {aProductoCarrito}
