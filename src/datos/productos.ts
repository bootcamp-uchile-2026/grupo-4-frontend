// Las fotos se importan como si fueran código. Vite nos devuelve la dirección del archivo
// (un texto como "/assets/queso-maduro.jpg") que después usamos en <img src={...}>.
import fotoQueso from "../assets/productos/queso-maduro.jpg"
import fotoFrambuesa from "../assets/productos/mermelada-frambuesa.jpg"
import fotoAceite from "../assets/productos/aceite-oliva.jpg"
import fotoFrutilla from "../assets/productos/mermelada-frutilla.jpg"

// Forma de un producto de la tienda (todavía no está en el carrito, por eso no tiene "cantidad").
type ProductoTienda = {
    id: number
    nombre: string
    productorId: number  // id del productor en datos/productores.ts (su nombre se busca con nombreProductor)
    precio: number
    meta: string    // tipo de envío y fecha, se muestra en el carrito
    categoria: string  // se muestra en la página del producto, ej: "Quesos"
    imagen: string     // dirección de la foto (viene de los import de arriba)
}

// Forma de la función "agregar al carrito" que App pasa a las páginas.
// Le ponemos nombre para no repetir "(producto: ProductoTienda, cantidad: number) => void" en cada archivo.
type AgregarAlCarrito = (producto: ProductoTienda, cantidad: number) => void

// Todos los productos de la tienda (más adelante vendrán de una API).
// Los id 1 y 2 son los mismos que ya están en el carrito inicial (datos/carrito.ts).
const productosTienda: ProductoTienda[] = [
    { id: 1, nombre: "Queso Maduro Artesanal", productorId: 1, precio: 12990, meta: "❄️ Refrigerado · Entrega 22-24 ago", categoria: "Quesos", imagen: fotoQueso },
    { id: 2, nombre: "Mermelada de Frambuesa", productorId: 2, precio: 6990, meta: "🌡️ Ambiente · Entrega 21-23 ago", categoria: "Mermeladas", imagen: fotoFrambuesa },
    { id: 3, nombre: "Aceite de oliva Emilia", productorId: 2, precio: 8990, meta: "🌡️ Ambiente · Entrega 21-23 ago", categoria: "Aceites", imagen: fotoAceite },
    { id: 4, nombre: "Mermelada de frutillas", productorId: 3, precio: 6500, meta: "🌡️ Ambiente · Entrega 21-23 ago", categoria: "Mermeladas", imagen: fotoFrutilla },
]

// Lista de categorías SIN repetir, sacada de los productos.
// Así, si mañana agregamos un producto de "Vinos", el filtro lo muestra solo.
const categorias: string[] = []
for (const producto of productosTienda) {
    // "includes" revisa si la lista ya tiene ese texto.
    if (!categorias.includes(producto.categoria)) {
        categorias.push(producto.categoria)
    }
}

export type {ProductoTienda, AgregarAlCarrito}
export {productosTienda, categorias}
