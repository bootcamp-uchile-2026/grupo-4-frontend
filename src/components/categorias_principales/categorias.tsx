import "../estilos/estilos.css"
import "../Header/header.css"

function Categorias(){
    return(
<section className="contenedor seccion">
      <div className="cabecera-seccion">
        <h2>Categorías principales</h2>
        <a href="../PLP/catalogo.html" className="enlace-texto">Ver todas</a>
      </div>
      <div className="grilla-categorias">
        <a href="../PLP/catalogo.html" className="tarjeta-base tarjeta-categoria">
          <div className="imagen-placeholder">Imagen</div>
          <p>Quesos</p>
        </a>
        <a href="../PLP/catalogo.html" className="tarjeta-base tarjeta-categoria">
          <div className="imagen-placeholder">Imagen</div>
          <p>Mermeladas</p>
        </a>
        <a href="../PLP/catalogo.html" className="tarjeta-base tarjeta-categoria">
          <div className="imagen-placeholder">Imagen</div>
          <p>Conservas</p>
        </a>
        <a href="../PLP/catalogo.html" className="tarjeta-base tarjeta-categoria">
          <div className="imagen-placeholder">Imagen</div>
          <p>Aceites</p>
        </a>
        <a href="../PLP/catalogo.html" className="tarjeta-base tarjeta-categoria">
          <div className="imagen-placeholder">Imagen</div>
          <p>Vinos</p>
        </a>
      </div>
    </section>

    )
}

export {Categorias}