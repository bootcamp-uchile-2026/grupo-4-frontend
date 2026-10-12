import { productosTienda } from "./productos"

// Forma que tiene cada producto del carrito.
// La usan varias páginas (Carrito y Checkout), por eso vive en su propio archivo.
type Producto = {
    id: number
    nombre: string
    productorId: number  // el nombre se busca con nombreProductor (datos/productores.ts)
    precio: number
    meta: string
    imagen: string   // dirección de la foto
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
// Los sacamos de la lista de la tienda para no escribir dos veces los mismos datos:
// "...productosTienda[0]" copia todos los datos del queso y le sumamos la cantidad.
const productosIniciales: Producto[] = [
    { ...productosTienda[0], cantidad: 1 },
    { ...productosTienda[1], cantidad: 2 },
]

// Pone al día una lista de productos guardada en el navegador (localStorage).
//
// ¿Por qué hace falta? Lo guardado puede estar viejo: si el equipo cambia un precio,
// o publica una versión nueva del sitio (la dirección de las fotos cambia), los datos
// guardados ya no coinciden. Por eso de lo guardado solo usamos el "id" y la "cantidad",
// y el resto (nombre, precio, foto...) lo leemos siempre de la tienda actual.
function actualizarDatosProductos(guardados: Producto[]): Producto[] {
    const actualizados: Producto[] = []
    for (const guardado of guardados) {
        const enLaTienda = productosTienda.find((producto) => producto.id === guardado.id)
        // Si el producto ya no existe en la tienda, no lo agregamos (desaparece del carrito).
        if (enLaTienda) {
            actualizados.push({ ...enLaTienda, cantidad: guardado.cantidad })
        }
    }
    return actualizados
}

export type {Producto, Pedido}
export {productosIniciales, actualizarDatosProductos}
