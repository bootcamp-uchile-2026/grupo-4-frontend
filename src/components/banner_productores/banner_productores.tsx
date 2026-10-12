import "../estilos/estilos.css"
import "../Header/header.css"
import { Link } from "react-router"
import { productores } from "../../datos/productores"
import { TarjetaProductorResumen } from "../productores/tarjeta_productor_resumen"

// "Productores destacados" del Home: una tarjeta por cada productor.
function ProductoresBanner() {
    return(
        <section className="contenedor seccion">
      <div className="cabecera-seccion">
        <h2>Productores destacados</h2>
        <Link to="/productores" className="enlace-texto">Ver todos</Link>
      </div>
      <div className="grilla-productores">
        {productores.map((productor) => (
          <TarjetaProductorResumen key={productor.id} productor={productor} conDescripcion={false}></TarjetaProductorResumen>
        ))}
      </div>
    </section>

    )
}

export {ProductoresBanner}
