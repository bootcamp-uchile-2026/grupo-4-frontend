import { Link } from "react-router"
import type { Pedido } from "../../datos/carrito"
import { formatoPrecio } from "../carrito/formato_precio"
import "../estilos/estilos.css"
import "./cuenta.css"

type ProximoPedidoProps = {
    // El "?" significa que puede venir vacío (undefined) si todavía no hay compras.
    pedido?: Pedido
}

// Tarjeta "Tu próximo pedido". Muestra la última compra.
function ProximoPedido({ pedido }: ProximoPedidoProps) {
    // Si no hay pedido, mostramos un mensaje y un botón para ir a comprar.
    if (!pedido) {
        return (
          <div className="tarjeta-base tarjeta-resumen">
            <h2>Tu próximo pedido</h2>
            <p className="texto-vacio">Aún no tienes pedidos.</p>
            <Link to="/carrito" className="boton boton-primario boton-bloque">Ir al carrito</Link>
          </div>
        )
    }

    // Si hay pedido, mostramos sus datos.
    return(
      <div className="tarjeta-base tarjeta-resumen">
        <h2>Tu próximo pedido</h2>
        <p className="etiqueta-secundaria">Llega entre</p>
        <p className="destacado-fecha">{pedido.entrega}</p>
        <p className="codigo-pedido">
          Pedido #{pedido.numero} · {formatoPrecio(pedido.total)}<br />
          {pedido.direccion}
        </p>
        <a href="#seguimiento" className="boton boton-primario boton-bloque">Seguir pedido</a>
      </div>
    )
}

export {ProximoPedido}
