// Componentes que arman la página. Cada uno es una parte de la pantalla.
import { Encabezado } from "../components/Header/header"            // barra de navegación superior
import { ProductoCarrito } from "../components/carrito/producto_carrito" // tarjeta de un producto
import { Sugerencias } from "../components/carrito/sugerencias"     // "También te puede interesar"
import { ResumenCompra } from "../components/carrito/resumen_compra" // panel con el total
import { Footer } from "../components/footer/footer"                // pie de página
import { nombreProductor } from "../datos/productores"                // busca el nombre del productor
import type { Producto } from "../datos/carrito"                    // forma de cada producto ("import type" = solo traemos un type)

// La lista de productos ya no se crea aquí: la recibimos desde App.tsx.
type CarritoPageProps = {
    productos: Producto[]                            // "Producto[]" = una lista de productos
    setProductos: (nuevaLista: Producto[]) => void  // función para reemplazarla
}

function CarritoPage({ productos, setProductos }: CarritoPageProps){
    // Suma (+1) o resta (-1) unidades a un producto.
    function cambiarCantidad(id: number, cambio: number) {
        const nuevaLista = productos.map((producto) => {
            if (producto.id === id) {
                // Copiamos el producto y le ponemos la nueva cantidad.
                return { ...producto, cantidad: producto.cantidad + cambio }
            }
            return producto
        })
        setProductos(nuevaLista)
    }

    // Quita un producto: nos quedamos con todos los que NO tienen ese id.
    function eliminar(id: number) {
        const nuevaLista = productos.filter((producto) => producto.id !== id)
        setProductos(nuevaLista)
    }

    // Recorremos la lista para contar unidades y sumar el precio total.
    let totalUnidades = 0
    let subtotal = 0
    for (const producto of productos) {
        totalUnidades += producto.cantidad
        subtotal += producto.precio * producto.cantidad
    }

    return(
        <>
        <Encabezado></Encabezado>

        <main className="contenedor contenedor-principal-dos-columnas">
          {/* Columna izquierda: los productos */}
          <section className="columna-principal">
            <h1 className="titulo-seccion">
              Tu carrito <span className="contador-productos">({totalUnidades} productos)</span>
            </h1>

            {/* Por cada producto de la lista dibujamos una tarjeta */}
            {productos.map((producto) => (
              <ProductoCarrito
                key={producto.id}
                id={producto.id}
                nombre={producto.nombre}
                imagen={producto.imagen}
                productor={nombreProductor(producto.productorId)}
                precio={producto.precio}
                meta={producto.meta}
                cantidad={producto.cantidad}
                onAgregar={() => cambiarCantidad(producto.id, 1)}
                onQuitar={() => cambiarCantidad(producto.id, -1)}
                onEliminar={() => eliminar(producto.id)}
              />
            ))}

            <Sugerencias></Sugerencias>
          </section>

          {/* Columna derecha: el resumen recibe el subtotal ya calculado */}
          <ResumenCompra subtotal={subtotal}></ResumenCompra>
        </main>

        <Footer></Footer>
        </>
    )
}

export {CarritoPage}
