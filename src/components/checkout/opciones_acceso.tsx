import "../estilos/estilos.css"
import "./checkout.css"

type OpcionesAccesoProps = {
    opcionElegida: string              // "cuenta" o "invitado"
    onElegir: (opcion: string) => void // avisa a la página qué tarjeta se apretó
}

// Dos tarjetas para elegir: iniciar sesión o comprar como invitado.
function OpcionesAcceso({ opcionElegida, onElegir }: OpcionesAccesoProps) {
    return(
      <>
        <h2 className="pregunta-cuenta">¿Tienes cuenta?</h2>
        <div className="opciones-acceso">
          {/* La tarjeta elegida recibe la clase "seleccionada" para resaltarla */}
          <button
            type="button"
            className={opcionElegida === "cuenta" ? "tarjeta-base tarjeta-opcion-acceso seleccionada" : "tarjeta-base tarjeta-opcion-acceso"}
            onClick={() => onElegir("cuenta")}
          >
            <strong>Iniciar sesión</strong>
            <p>Accede a tu cuenta para comprar más rápido</p>
          </button>
          <button
            type="button"
            className={opcionElegida === "invitado" ? "tarjeta-base tarjeta-opcion-acceso seleccionada" : "tarjeta-base tarjeta-opcion-acceso"}
            onClick={() => onElegir("invitado")}
          >
            <strong>Continuar como invitado</strong>
            <p>No necesitas registrarte</p>
          </button>
        </div>
      </>
    )
}

export {OpcionesAcceso}
