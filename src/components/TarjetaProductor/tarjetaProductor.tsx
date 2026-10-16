
import "../estilos PDP/estilosPDP.css"
import "../productores/productores.css"
import { Link } from "react-router"
import type { Productor } from "../../datos/productores"

type TarjetaProductorProps = {
    productor: Productor  // el productor del producto que se está viendo
}

// "Conoce a ..." en la página de un producto.
function TarjetaProductor({ productor }: TarjetaProductorProps){
    return(
        <section className="seccion-pdp">
        <h2>Conoce a {productor.nombre}</h2>
        <Link to={`/productores/${productor.id}`} className="tarjeta-suave caja-productor-cliqueable">
          <div className="imagen-placeholder foto-productor-mini" aria-hidden="true">{productor.nombre[0]}</div>
          <div className="texto-productor-mini">
            <p>{productor.descripcion}</p>
            <span className="enlace-texto">Ver su historia</span>
          </div>
        </Link>
      </section>
    )
}

export {TarjetaProductor}
