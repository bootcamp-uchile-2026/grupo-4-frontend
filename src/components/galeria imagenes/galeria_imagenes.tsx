import "../estilos PDP/estilosPDP.css"
import "../estilos/estilos.css"
import { useState } from "react"
import { Link } from "react-router"
import { formatoPrecio } from "../carrito/formato_precio"
import type { AgregarAlCarrito, ProductoTienda } from "../../datos/productos"

type GaleriaImagenesProps = {
    producto: ProductoTienda              // el producto que muestra la página
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App, pasando por PaginaProducto
}

function GaleriaImagenes({ producto, onAgregarAlCarrito }: GaleriaImagenesProps) {
    // Cuántas unidades quiere agregar. Empieza en 1.
    const [cantidad, setCantidad] = useState(1)

    // Botón "−": resta 1, pero nunca baja de 1.
    function quitarUno() {
        if (cantidad > 1) {
            setCantidad(cantidad - 1)
        }
    }

    // Botón "+": suma 1.
    function agregarUno() {
        setCantidad(cantidad + 1)
    }

    return(

<section className="contenedor-producto">

  <div className="galeria-producto">
    <div className="imagen-placeholder imagen-principal-producto">
      <img src={producto.imagen} alt={producto.nombre} />
    </div>
    <div className="carrusel-miniaturas">
      <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Imagen anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      {/* Por ahora cada producto tiene una sola foto: la mostramos en la primera miniatura */}
      <a href="#" className="imagen-placeholder miniatura activa" aria-label="Imagen 1">
        <img src={producto.imagen} alt="" />
      </a>
      <a href="#" className="imagen-placeholder miniatura" aria-label="Imagen 2"></a>
      <a href="#" className="imagen-placeholder miniatura" aria-label="Imagen 3"></a>
      <a href="#" className="imagen-placeholder miniatura" aria-label="Imagen 4"></a>
      <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Imagen siguiente">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </div>

  
  <div className="info-compra-producto">
    <p className="texto-eyebrow">{producto.categoria}</p>
    <h1>{producto.nombre}</h1>
    <p className="subtitulo-productor">Don Pedro · Curicó</p>

    <div className="valoracion">
      <span className="estrellas" aria-hidden="true">★★★★★</span>
      <span className="rating-texto">4.8 (43 reseñas)</span>
    </div>

    <p className="precio-producto">{formatoPrecio(producto.precio)}</p>

   
    <ul className="lista-atributos">
      <li><span aria-hidden="true">✅</span> Disponible</li>
      <li><span aria-hidden="true">📅</span> Vence: 24 ago 2025</li>
      <li><span aria-hidden="true">❄️</span> Mantener refrigerado</li>
      <li><span aria-hidden="true">📦</span> Entrega estimada 22–24 ago</li>
    </ul>

    
    <div className="selector-cantidad">
      <label htmlFor="cantidad">Cantidad</label>
      <div className="control-cantidad">
        <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Quitar uno" onClick={quitarUno} disabled={cantidad <= 1}>−</button>
        {/* El número muestra lo que hay en el estado "cantidad" */}
        <input id="cantidad" type="number" value={cantidad} readOnly />
        <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Agregar uno" onClick={agregarUno}>+</button>
      </div>
    </div>

    <div className="acciones-compra">
      {/* Al apretar: se agregan las unidades elegidas al carrito y luego Link nos lleva a /carrito */}
      <Link to="/carrito" className="boton boton-primario boton-lg" onClick={() => onAgregarAlCarrito(producto, cantidad)}>Agregar al carrito</Link>
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