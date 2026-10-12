import type { Plan } from "../../datos/suscripcion"
import { formatoPrecio } from "../carrito/formato_precio"
import "../estilos/estilos.css"
import "./suscripcion.css"

type TarjetaPlanProps = {
    plan: Plan
    esActual: boolean     // true = el usuario ya está suscrito a este plan
    onElegir: () => void  // se llama al apretar "Elegir"
}

// Tarjeta de un plan (Básica, Plus o Premium).
function TarjetaPlan({ plan, esActual, onElegir }: TarjetaPlanProps) {
    // Armamos las clases de la tarjeta según el plan.
    let clases = "tarjeta-base tarjeta-plan"
    if (plan.destacado) {
        clases = clases + " tarjeta-plan-destacada"
    }
    if (esActual) {
        clases = clases + " tarjeta-plan-actual"
    }

    return(
      <div className={clases}>
        {/* La insignia solo aparece en el plan destacado */}
        {plan.destacado && <span className="insignia">Más elegida</span>}

        <h2>{plan.nombre}</h2>
        <p className="descripcion">{plan.descripcion}</p>
        <p className="precio-plan">{formatoPrecio(plan.precio)} <span>/ mes</span></p>

        {/* Si ya es su plan, el botón queda desactivado */}
        <button
          type="button"
          className={plan.destacado ? "boton boton-primario boton-bloque" : "boton boton-secundario boton-bloque"}
          onClick={onElegir}
          disabled={esActual}
        >
          {esActual ? "Tu plan actual" : "Elegir"}
        </button>
      </div>
    )
}

export {TarjetaPlan}
