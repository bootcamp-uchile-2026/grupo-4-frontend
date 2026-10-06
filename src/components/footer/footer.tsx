import "../estilos/estilos.css"
import "../Header/header.css"

function Footer() {

    return(
        <footer className="pie-pagina">
    <div className="contenedor columnas-footer">
      <div className="columna-footer">
        <h4>Ayuda</h4>
        <a href="faq.html">Preguntas frecuentes</a>
        <a href="envios.html">Envíos</a>
        <a href="devoluciones.html">Devoluciones</a>
        <a href="contacto.html">Contacto</a>
      </div>
      <div className="columna-footer">
        <h4>Legal</h4>
        <a href="terminos.html">Términos y condiciones</a>
        <a href="privacidad.html">Política de privacidad</a>
      </div>
      <div className="columna-footer">
        <h4>Síguenos</h4>
        <div className="iconos-redes">
          <a href="https://instagram.com" className="boton boton-secundario boton-icono boton-sm" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
          <a href="https://facebook.com" className="boton boton-secundario boton-icono boton-sm" target="_blank" rel="noopener" aria-label="Facebook">FB</a>
        </div>
      </div>
      <div className="columna-footer">
        <h4>Recibe novedades</h4>
        <form action="#" className="formulario-boletin">
          <button type="submit" className="boton boton-primario boton-icono" aria-label="Suscribirme">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </form>
      </div>
    </div>
    <div className="contenedor copyright">
      <p>© 2025 La Sobremesa. Todos los derechos reservados.</p>
    </div>
  </footer>
    )
}

export {Footer}