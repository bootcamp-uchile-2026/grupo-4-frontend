// RESUMEN: parte de arriba de la ficha de producto: foto, nombre, productor, precio,
// selector de cantidad y botón "Agregar al carrito". Recibe el producto de la API.
import "../estilos PDP/estilosPDP.css"
import "../estilos/estilos.css"
import { useState } from "react"
import { Link } from "react-router"
import { formatoPrecio } from "../carrito/formato_precio"
import { fotoPrincipal } from "../../datos/api"
import type { ProductoApi } from "../../datos/api"
import type { AgregarAlCarrito } from "../../datos/carrito"

type GaleriaImagenesProps = {
    producto: ProductoApi                 // el producto (de la API) que muestra la página
    nombreProveedor: string               // ej: "Lácteos del Campo"
    nombreCategoria: string               // ej: "Lácteos"
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App, pasando por PaginaProducto
}

function GaleriaImagenes({ producto, nombreProveedor, nombreCategoria, onAgregarAlCarrito }: GaleriaImagenesProps) {
    // La foto principal ("" si el producto todavía no tiene fotos).
    const foto = fotoPrincipal(producto)
    // El precio que se cobra: con descuento si tiene.
    const precio = producto.descuento > 0 ? producto.precioDescuento : producto.precio

    // La fecha de vencimiento llega como "2026-11-27T00:00:00.000Z".
    // new Date(...) la convierte en fecha, y toLocaleDateString la escribe a la chilena: "27-11-2026".
    // timeZone "UTC": la "Z" del final significa hora UTC. Sin esto, al pasarla a la hora de Chile
    // (3 o 4 horas menos) la medianoche retrocede al día anterior y saldría "26-11-2026".
    let vence = ""
    if (producto.fechaVencimiento) {
        vence = new Date(producto.fechaVencimiento).toLocaleDateString("es-CL", { timeZone: "UTC" })
    }

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
      {/* Si tiene foto la mostramos; si no, el cuadro gris con un aviso */}
      {foto ? <img src={foto} alt={producto.nombre} /> : "Sin foto"}
    </div>
    <div className="carrusel-miniaturas">
      <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Imagen anterior">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      {/* Por ahora cada producto tiene una sola foto: la mostramos en la primera miniatura */}
      <a href="#" className="imagen-placeholder miniatura activa" aria-label="Imagen 1">
        {foto && <img src={foto} alt="" />}
      </a>
      <a href="#" className="imagen-placeholder miniatura" aria-label="Imagen 2"></a>
      <a href="#" className="imagen-placeholder miniatura" aria-label="Imagen 3"></a>
      <a href="#" className="imagen-placeholder miniatura" aria-label="Imagen 4"></a>
      <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Imagen siguiente">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </div>

  
  <div className="info-compra-producto">
    <p className="texto-eyebrow">{nombreCategoria}</p>
    <h1>{producto.nombre}</h1>
    <p className="subtitulo-productor">{nombreProveedor}</p>

    {/* Las estrellas solo se muestran si el producto ya tiene valoración (mayor a 0) */}
    {producto.valoracion > 0 && (
      <div className="valoracion">
        {/* "★".repeat(4) = "★★★★": repite la estrella según la valoración */}
        <span className="estrellas" aria-hidden="true">{"★".repeat(producto.valoracion)}</span>
        <span className="rating-texto">{producto.valoracion} de 5</span>
      </div>
    )}

    <p className="precio-producto">
      {formatoPrecio(precio)}
      {/* Si tiene descuento, mostramos también el % */}
      {producto.descuento > 0 && <small> (-{producto.descuento}%)</small>}
    </p>

    <ul className="lista-atributos">
      <li><span aria-hidden="true">✅</span> Disponible</li>
      {/* La fecha de vencimiento es opcional: solo la mostramos si viene */}
      {vence && <li><span aria-hidden="true">📅</span> Vence: {vence}</li>}
      <li>
        <span aria-hidden="true">{producto.tipoConservacion === "Ambiente" ? "🌡️" : "❄️"}</span> Conservación: {producto.tipoConservacion}
      </li>
      <li><span aria-hidden="true">📦</span> Entrega estimada: 2 a 3 días</li>
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
      <Link to="/carrito" className="boton boton-primario boton-lg" onClick={() => onAgregarAlCarrito(producto, nombreProveedor, cantidad)}>Agregar al carrito</Link>
      <button type="button" className="boton boton-secundario boton-lg">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></svg>
        Agregar a favoritos
      </button>
    </div>
  </div>

</section>



    )
}

export {GaleriaImagenes}