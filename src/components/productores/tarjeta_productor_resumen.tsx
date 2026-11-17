// RESUMEN: tarjeta chica de un productor (foto o inicial, nombre y descripción) que lleva a su perfil.
// Se usa en el Home ("Productores destacados") y en la página /productores.
import { Link } from "react-router"
import { fotoPrincipal } from "../../datos/api"
import type { ProveedorApi } from "../../datos/api"
import "../estilos/estilos.css"
import "../Header/header.css"
import "./productores.css"

type TarjetaProductorResumenProps = {
    productor: ProveedorApi  // el productor (de la API) que muestra esta tarjeta
    conDescripcion: boolean  // true = muestra también la descripción (en la página de productores)
}

function TarjetaProductorResumen({ productor, conDescripcion }: TarjetaProductorResumenProps) {
    // La foto principal del productor ("" si todavía no tiene).
    const foto = fotoPrincipal(productor)

    return(
      <Link to={`/productores/${productor.id}`} className="tarjeta-base tarjeta-productor">
        {/* Si tiene foto la mostramos en el círculo; si no, la primera letra del nombre.
            productor.nombre[0] = el primer carácter del texto (ej: "L" de "Lácteos del Campo") */}
        <div className="imagen-placeholder avatar-productor" aria-hidden="true">
          {foto ? <img src={foto} alt="" /> : productor.nombre[0]}
        </div>
        <div>
          <h3>{productor.nombre}</h3>
          {conDescripcion && <p className="descripcion-productor">{productor.descripcion}</p>}
        </div>
      </Link>
    )
}

export {TarjetaProductorResumen}
