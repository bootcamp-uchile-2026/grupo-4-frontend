
import "../estilos/estilos.css"
import "../Header/header.css"

function Newsletter() {

    return(
        <section className="banda-newsletter">
      <div className="contenedor banda-newsletter-interior">
        <div>
          <p className="texto-eyebrow">Newsletter</p>
          <h2>Suscríbete a nuestra caja gourmet mensual</h2>
          <p>Descubre nuevos sabores cada mes.</p>
        </div>
        <a href="../suscripcion.html" className="boton boton-secundario boton-lg">Quiero saber más</a>
      </div>
    </section>
    )
}

export {Newsletter}