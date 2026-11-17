// RESUMEN: banner principal de la página de inicio (texto a la izquierda, foto a la derecha).
import "../estilos/estilos.css"
import "../Header/header.css"
import { Link } from "react-router"
// Vite convierte la foto en una dirección (texto) que podemos usar en src.
import fotoBanner from "../../assets/productos/banner.jpg"



function Carrusel(){
    return(
<section className="hero">
      <div className="contenedor hero-interior">
        <div className="hero-texto">
          <p className="texto-eyebrow">Productos</p>
          <h1>Productos artesanales que vale la pena descubrir</h1>
          <p className="hero-descripcion">Sabores de productores locales, seleccionados para llegar directo a tu mesa.</p>
          <Link to="/catalogo" className="boton boton-primario boton-lg">Ver productos</Link>

          <div className="carrusel-controles">
            <button type="button" className="boton boton-secundario boton-icono boton-sm" aria-label="Anterior">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="carrusel-puntos" aria-hidden="true">
              <span></span><span className="activo"></span><span></span>
            </div>
            <button type="button" className="boton boton-secundario boton-icono boton-sm" aria-label="Siguiente">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <span className="carrusel-contador">2 / 3</span>
          </div>
        </div>

        <Link to="/catalogo" className="imagen-placeholder hero-imagen">
          {/* alt: describe la foto para quien usa lector de pantalla o si la imagen no carga */}
          <img src={fotoBanner} alt="Mesa con quesos, frutillas, naranjas, kiwi y conservas artesanales" />
          <span className="hero-etiqueta">Lácteos, aceites y conservas</span>
        </Link>
      </div>
    </section>

    )
}

export {Carrusel}