import "../estilos/estilos.css"
import "../Header/header.css"

function ProductoresBanner() {
    return(
        <section className="contenedor seccion">
      <div className="cabecera-seccion">
        <h2>Productores destacados</h2>
        <a href="productores.html" className="enlace-texto">Ver todos</a>
      </div>
      <div className="grilla-productores">
        <a href="historia-productor.html" className="tarjeta-base tarjeta-productor">
          <div className="imagen-placeholder avatar-productor" aria-hidden="true"></div>
          <div>
            <h3>Nombre Productor</h3>
            <p className="productor">Dirección productor</p>
          </div>
        </a>
        <a href="historia-productor.html" className="tarjeta-base tarjeta-productor">
          <div className="imagen-placeholder avatar-productor" aria-hidden="true"></div>
          <div>
            <h3>Nombre Productor</h3>
            <p className="productor">Dirección productor</p>
          </div>
        </a>
        <a href="historia-productor.html" className="tarjeta-base tarjeta-productor">
          <div className="imagen-placeholder avatar-productor" aria-hidden="true"></div>
          <div>
            <h3>Nombre Productor</h3>
            <p className="productor">Dirección productor</p>
          </div>
        </a>
      </div>
    </section>

    )
}

export {ProductoresBanner}