// Forma que tiene cada producto del carrito.
// La usan varias páginas (Carrito y Checkout), por eso vive en su propio archivo.
type Producto = {
    id: number
    nombre: string
    marca: string
    precio: number
    meta: string
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

// Productos con los que empieza el carrito (más adelante vendrán de una API).
const productosIniciales: Producto[] = [
    { id: 1, nombre: "Queso Maduro Artesanal", marca: "Don Pedro", precio: 12990, meta: "❄️ Refrigerado · Entrega 22-24 ago", cantidad: 1 },
    { id: 2, nombre: "Mermelada de Frambuesa", marca: "La Emilia", precio: 6990, meta: "🌡️ Ambiente · Entrega 21-23 ago", cantidad: 2 },
]

export type {Producto, Pedido}
export {productosIniciales}
