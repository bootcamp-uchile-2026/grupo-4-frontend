import { Link } from "react-router"
import type { Suscripcion } from "../../datos/suscripcion"
import { formatoPrecio } from "../carrito/formato_precio"
import "../estilos/estilos.css"
import "./cuenta.css"

type TarjetaSuscripcionProps = {
    suscripcion: Suscripcion | null  // null = todavía no está suscrito
}

// Tarjeta "Tu suscripción" en Mi cuenta.
function TarjetaSuscripcion({ suscripcion }: TarjetaSuscripcionProps) {
    // Si no tiene suscripción, lo invitamos a elegir un plan.
    if (!suscripcion) {
        return (
          <div className="tarjeta-suave tarjeta-resumen">
            <h2>Tu suscripción</h2>
            <p className="texto-vacio">Aún no tienes una caja mensual.</p>
            <Link to="/suscripcion" className="boton boton-secundario boton-bloque">Ver planes</Link>
          </div>
        )
    }

    // Si tiene, mostramos el plan y las fechas.
    return(
      <div className="tarjeta-suave tarjeta-resumen">
        <h2>Tu suscripción · Plan {suscripcion.plan.nombre}</h2>
        <p className="etiqueta-secundaria">Próxima caja</p>
        <p className="destacado-fecha">{suscripcion.proximaCaja}</p>
        <p className="codigo-pedido">
          Próximo cobro: {suscripcion.proximoCobro} · {formatoPrecio(suscripcion.plan.precio)}
        </p>
        <Link to="/suscripcion" className="boton boton-secundario boton-bloque">Gestionar suscripción</Link>
      </div>
    )
}

export {TarjetaSuscripcion}
