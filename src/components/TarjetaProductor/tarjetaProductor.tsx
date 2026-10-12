
import "../estilos PDP/estilosPDP.css"

function TarjetaProductor(){
    return(
        <section className="seccion-pdp">
        <h2>Conoce a Don Pedro</h2>
        <a href="../Home/historia-productor.html" className="tarjeta-suave caja-productor-cliqueable">
          <div className="imagen-placeholder foto-productor-mini" aria-hidden="true"></div>
          <div className="texto-productor-mini">
            <p>Productor de Curicó con más de 20 años elaborando quesos artesanales con leche de su propio rebaño.</p>
            <span className="enlace-texto">Ver su historia</span>
          </div>
        </a>
      </section>
    )
}

export {TarjetaProductor}