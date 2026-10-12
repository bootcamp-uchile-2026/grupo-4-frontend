import type { Pedido, Producto } from "../../datos/carrito"
import { formatoPrecio } from "../carrito/formato_precio"
import "../estilos/estilos.css"
import "./cuenta.css"

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

    return(
      <section className="seccion-cuenta">
        <div className="cabecera-seccion">
          <h2>Vuelve a tu mesa</h2>
          <a href="../PLP/catalogo.html" className="enlace-texto">Ver todos</a>
        </div>

        {/* Si todavía no compró nada, mostramos un mensaje */}
        {comprados.length === 0 && (
          <p className="texto-vacio">Cuando compres, tus productos aparecerán aquí.</p>
        )}

        <div className="grilla-productos-mini">
          {comprados.map((producto) => (
            <a key={producto.id} href="../PDP/PDP.html" className="tarjeta-producto-mini">
              <div className="imagen-placeholder foto-producto-mini" aria-hidden="true"></div>
              <p className="nombre-producto">{producto.nombre}</p>
              <p className="precio-producto">{formatoPrecio(producto.precio)}</p>
            </a>
          ))}
        </div>
      </section>
    )
}

export {VuelveATuMesa}
