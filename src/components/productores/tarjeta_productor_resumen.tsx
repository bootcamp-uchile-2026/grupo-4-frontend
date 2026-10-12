import { Link } from "react-router"
import type { Productor } from "../../datos/productores"
import "../estilos/estilos.css"
import "../Header/header.css"
import "./productores.css"

type TarjetaProductorResumenProps = {
    productor: Productor
    conDescripcion: boolean  // true = muestra también la frase corta (en la página de productores)
}

// Tarjeta chica de un productor: avatar, nombre y ubicación.
// Se usa en el Home ("Productores destacados") y en la página /productores.
function TarjetaProductorResumen({ productor, conDescripcion }: TarjetaProductorResumenProps) {
    return(
      <Link to={`/productores/${productor.id}`} className="tarjeta-base tarjeta-productor">
        {/* Todavía no hay fotos de productores: mostramos la primera letra del nombre.
            productor.nombre[0] = el primer carácter del texto (ej: "D" de "Don Pedro") */}
        <div className="imagen-placeholder avatar-productor" aria-hidden="true">{productor.nombre[0]}</div>
        <div>
          <h3>{productor.nombre}</h3>
          <p className="productor">{productor.ubicacion}</p>
          {conDescripcion && <p className="descripcion-productor">{productor.descripcion}</p>}
        </div>
      </Link>
    )
}

export {TarjetaProductorResumen}
