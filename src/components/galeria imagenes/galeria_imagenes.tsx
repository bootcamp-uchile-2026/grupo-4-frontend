import "../estilos PDP/estilosPDP.css"
import "../estilos/estilos.css"

function GaleriaImagenes() {
    return(

<section className="contenedor-producto">

  <div className="galeria-producto">
    <div className="imagen-placeholder imagen-principal-producto">Imagen principal</div>
    <div className="carrusel-miniaturas">
      <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Imagen anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      <a href="#" className="imagen-placeholder miniatura activa" aria-label="Imagen 1"></a>
      <a href="#" className="imagen-placeholder miniatura" aria-label="Imagen 2"></a>
      <a href="#" className="imagen-placeholder miniatura" aria-label="Imagen 3"></a>
      <a href="#" className="imagen-placeholder miniatura" aria-label="Imagen 4"></a>
      <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Imagen siguiente">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </div>

  
  <div className="info-compra-producto">
    <p className="texto-eyebrow">Quesos</p>
    <h1>Queso Madurado Artesanal</h1>
    <p className="subtitulo-productor">Don Pedro · Curicó</p>

    <div className="valoracion">
      <span className="estrellas" aria-hidden="true">★★★★★</span>
      <span className="rating-texto">4.8 (43 reseñas)</span>
    </div>

    <p className="precio-producto">$12.990</p>

   
    <ul className="lista-atributos">
      <li><span aria-hidden="true">✅</span> Disponible</li>
      <li><span aria-hidden="true">📅</span> Vence: 24 ago 2025</li>
      <li><span aria-hidden="true">❄️</span> Mantener refrigerado</li>
      <li><span aria-hidden="true">📦</span> Entrega estimada 22–24 ago</li>
    </ul>

    
    <div className="selector-cantidad">
      <label >Cantidad</label>
      <div className="control-cantidad">
        <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Quitar uno">−</button>
        <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Agregar uno">+</button>
      </div>
    </div>

    <div className="acciones-compra">
      <a href="../carrito/carrito.html" className="boton boton-primario boton-lg">Agregar al carrito</a>
      <button type="button" className="boton boton-secundario boton-lg">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></svg>
        Agregar a favoritos
      </button>
    </div>
  </div>

</section>



    )
}

export {GaleriaImagenes}