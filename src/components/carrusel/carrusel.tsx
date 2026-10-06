import "../estilos/estilos.css"
import "../Header/header.css"



function Carrusel(){
    return(
<section className="hero">
      <div className="contenedor hero-interior">
        <div className="hero-texto">
          <p className="texto-eyebrow">Productos</p>
          <h1>Productos artesanales que vale la pena descubrir</h1>
          <p className="hero-descripcion">Sabores de productores locales, seleccionados para llegar directo a tu mesa.</p>
          <a href="../PLP/catalogo.html" className="boton boton-primario boton-lg">Ver productos</a>

          <div className="carrusel-controles">
            <button type="button" className="boton boton-secundario boton-icono boton-sm" aria-label="Anterior">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <div className="carrusel-puntos" aria-hidden="true">
              <span></span><span className="activo"></span><span></span>
            </div>
            <button type="button" className="boton boton-secundario boton-icono boton-sm" aria-label="Siguiente">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <span className="carrusel-contador">2 / 3</span>
          </div>
        </div>

        <a href="../PLP/catalogo.html" className="imagen-placeholder hero-imagen">
          Imagen banner
          <span className="hero-etiqueta">Quesos, vinos y conservas</span>
        </a>
      </div>
    </section>

    )
}

export {Carrusel}