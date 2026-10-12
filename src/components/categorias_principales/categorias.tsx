import "../estilos/estilos.css"
import "../Header/header.css"
import { Link } from "react-router"

function Categorias(){
    return(
<section className="contenedor seccion">
      <div className="cabecera-seccion">
        <h2>Categorías principales</h2>
        <Link to="/catalogo" className="enlace-texto">Ver todas</Link>
      </div>
      <div className="grilla-categorias">
        <Link to="/catalogo" className="tarjeta-base tarjeta-categoria">
          <div className="imagen-placeholder">Imagen</div>
          <p>Quesos</p>
        </Link>
        <Link to="/catalogo" className="tarjeta-base tarjeta-categoria">
          <div className="imagen-placeholder">Imagen</div>
          <p>Mermeladas</p>
        </Link>
        <Link to="/catalogo" className="tarjeta-base tarjeta-categoria">
          <div className="imagen-placeholder">Imagen</div>
          <p>Conservas</p>
        </Link>
        <Link to="/catalogo" className="tarjeta-base tarjeta-categoria">
          <div className="imagen-placeholder">Imagen</div>
          <p>Aceites</p>
        </Link>
        <Link to="/catalogo" className="tarjeta-base tarjeta-categoria">
          <div className="imagen-placeholder">Imagen</div>
          <p>Vinos</p>
        </Link>
      </div>
    </section>

    )
}

export {Categorias}