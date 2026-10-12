import type { Plan } from "../../datos/suscripcion"
import type { Usuario } from "../../datos/usuario"
import { formatoPrecio } from "../carrito/formato_precio"
import "../estilos/estilos.css"
import "./suscripcion.css"

type ConfirmarSuscripcionProps = {
    plan: Plan               // el plan que eligió
    usuario: Usuario         // a nombre de quién queda
    onConfirmar: () => void  // se llama al apretar "Confirmar suscripción"
}

// Último paso: el usuario ya tiene cuenta y eligió plan. Solo falta confirmar.
function ConfirmarSuscripcion({ plan, usuario, onConfirmar }: ConfirmarSuscripcionProps) {
    return(
      <div className="tarjeta-base confirmar-suscripcion">
        <h2>Plan {plan.nombre} · {formatoPrecio(plan.precio)} / mes</h2>
        <p>A nombre de <strong>{usuario.nombre}</strong> ({usuario.email})</p>
        <button type="button" className="boton boton-primario boton-lg boton-bloque" onClick={onConfirmar}>
          Confirmar suscripción
        </button>
      </div>
    )
}

export {ConfirmarSuscripcion}
