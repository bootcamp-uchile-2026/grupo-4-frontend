import { actualizarDatosProductos } from "../../datos/carrito"
import type { Pedido, Producto } from "../../datos/carrito"
import { formatoPrecio } from "../carrito/formato_precio"
import "../estilos/estilos.css"
import "./cuenta.css"
import { Link } from "react-router"

type VuelveATuMesaProps = {
    pedidos: Pedido[]  // todas las compras hechas
}

// "Vuelve a tu mesa": productos que el usuario ya compró, para comprarlos otra vez.
function VuelveATuMesa({ pedidos }: VuelveATuMesaProps) {
    // Juntamos los productos de todos los pedidos, sin repetir.
    const comprados: Producto[] = []
    for (const pedido of pedidos) {
        for (const producto of pedido.productos) {
            // "some" revisa si ALGÚN producto de la lista ya tiene ese id.
            const yaEsta = comprados.some((p) => p.id === producto.id)
            if (!yaEsta) {
                comprados.push(producto)
            }
        }
    }

    // Los pedidos se guardan en el navegador y sus fotos pueden quedar viejas:
    // tomamos foto y precio actuales de la tienda (para comprarlos de nuevo al precio de hoy).
    const paraMostrar = actualizarDatosProductos(comprados)

    return(
      <section className="seccion-cuenta">
        <div className="cabecera-seccion">
          <h2>Vuelve a tu mesa</h2>
          <Link to="/catalogo" className="enlace-texto">Ver todos</Link>
        </div>

        {/* Si todavía no compró nada, mostramos un mensaje */}
        {paraMostrar.length === 0 && (
          <p className="texto-vacio">Cuando compres, tus productos aparecerán aquí.</p>
        )}

        <div className="grilla-productos-mini">
          {paraMostrar.map((producto) => (
            <Link key={producto.id} to={`/producto/${producto.id}`} className="tarjeta-producto-mini">
              {/* alt="" porque el nombre ya aparece escrito justo abajo */}
              <div className="imagen-placeholder foto-producto-mini">
                <img src={producto.imagen} alt="" />
              </div>
              <p className="nombre-producto">{producto.nombre}</p>
              <p className="precio-producto">{formatoPrecio(producto.precio)}</p>
            </Link>
          ))}
        </div>
      </section>
    )
}

export {VuelveATuMesa}
