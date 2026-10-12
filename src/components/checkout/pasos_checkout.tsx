// Fragment agrupa varios elementos sin agregar una etiqueta extra al HTML.
import { Fragment } from "react"
import "../estilos/estilos.css"
import "./checkout.css"

// Nombres de los 4 pasos del checkout, en orden.
const pasos = ["Datos", "Entrega", "Pago", "Resumen"]

type PasosCheckoutProps = {
    pasoActual: number  // número del paso en que está el usuario (1, 2, 3 o 4)
}

function PasosCheckout({ pasoActual }: PasosCheckoutProps) {
    return(
      <ol className="pasos-checkout">
        {/* Recorremos la lista de pasos. "indice" empieza en 0, por eso sumamos 1. */}
        {pasos.map((nombre, indice) => {
            const numero = indice + 1
            const esActivo = numero === pasoActual
            const esUltimo = numero === pasos.length

            // El "key" va en el elemento de más afuera para que React distinga cada paso.
            return (
              <Fragment key={nombre}>
                <li
                  className={esActivo ? "paso activo" : "paso"}
                  aria-current={esActivo ? "step" : undefined}
                >
                  <span className="circulo-paso">{numero}</span>
                  <span>{nombre}</span>
                </li>

                {/* La línea que une los pasos va entre ellos, no después del último. */}
                {!esUltimo && <li className="linea-conector" aria-hidden="true"></li>}
              </Fragment>
            )
        })}
      </ol>
    )
}

export {PasosCheckout}
