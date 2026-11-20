// RESUMEN: "Conoce a [productor]" en la ficha de un producto: foto o inicial, descripción
// y enlace a la página del productor.
import "../estilos PDP/estilosPDP.css"
import "../productores/productores.css"
import { Link } from "react-router"
import { fotoPrincipal } from "../../datos/api"
import type { ProveedorApi } from "../../datos/api"

type TarjetaProductorProps = {
    productor: ProveedorApi  // el productor (de la API) del producto que se está viendo
}

function TarjetaProductor({ productor }: TarjetaProductorProps){
    // La foto principal del productor ("" si todavía no tiene).
    const foto = fotoPrincipal(productor)

    return(
        <section className="seccion-pdp">
        <h2>Conoce a {productor.nombre}</h2>
        <Link to={`/productores/${productor.id}`} className="tarjeta-suave caja-productor-cliqueable">
          {/* Si tiene foto la mostramos; si no, la primera letra del nombre */}
          <div className="imagen-placeholder foto-productor-mini" aria-hidden="true">
            {foto ? <img src={foto} alt="" /> : productor.nombre[0]}
          </div>
          <div className="texto-productor-mini">
            <p>{productor.descripcion}</p>
            <span className="enlace-texto">Ver productor</span>
          </div>
        </Link>
      </section>
    )
}

export {TarjetaProductor}
