
import "../estilos/estilos.css"
import "../Header/header.css"
import { Link } from "react-router"

function Newsletter() {

    return(
        <section className="banda-newsletter">
      <div className="contenedor banda-newsletter-interior">
        <div>
          <p className="texto-eyebrow">Newsletter</p>
          <h2>Suscríbete a nuestra caja gourmet mensual</h2>
          <p>Descubre nuevos sabores cada mes.</p>
        </div>
        <Link to="/suscripcion" className="boton boton-secundario boton-lg">Quiero saber más</Link>
      </div>
    </section>
    )
}

export {Newsletter}