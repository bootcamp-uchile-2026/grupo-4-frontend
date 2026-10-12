
import "../estilos PDP/estilosPDP.css"

function TarjetasReseñas() {
    return(
        <section className="seccion-pdp">
      <div className="cabecera-seccion">
        <h2>Reseñas (43)</h2>
        <a href="resenas.html" className="enlace-texto">Ver todas las reseñas</a>
      </div>
      <article className="tarjeta-base tarjeta-resena">
        <div className="estrellas" aria-label="5 de 5 estrellas">★★★★★</div>
        <p className="autor-resena">María José</p>
        <p className="comentario-resena">Muy buen queso, llegó en perfecto estado y dentro del plazo. ¡Lo recomiendo!</p>
        <span className="fecha-resena">Hace 2 días</span>
      </article>
    </section>
    )
}

export {TarjetasReseñas}