import { fotoPrincipal } from "../../datos/api"      // dirección completa de la foto principal
import type { ProductoApi } from "../../datos/api"  // forma de un producto de la API
import type { AgregarAlCarrito } from "../../datos/carrito"
import { Link } from "react-router"
import "../estilosPLP/estilosPLP.css"
import { formatoPrecio } from "../carrito/formato_precio"  // convierte 5000 en "$5.000"

type CabeceraCatalogoProps = {
    titulo: string                            // cambia según los filtros, ej: "Quesos" o "Todos los productos"
    cantidad: number                          // cuántos productos se están mostrando
    orden: string                             // el orden elegido, ej: "precio-menor"
    onCambiarOrden: (orden: string) => void   // se llama al elegir otra opción del selector
    filtrosAbiertos: boolean                  // true = el panel de filtros se ve
    onAlternarFiltros: () => void             // abre o cierra el panel de filtros
}

// Opciones del selector "Ordenar por": valor (lo que va en la URL) y texto (lo que se ve).
const opcionesOrden = [
    { valor: "destacados", texto: "Destacados" },
    { valor: "precio-menor", texto: "Precio: menor a mayor" },
    { valor: "precio-mayor", texto: "Precio: mayor a menor" },
    { valor: "nombre", texto: "Nombre: A a Z" },
]

function CabeceraCatalogo({ titulo, cantidad, orden, onCambiarOrden, filtrosAbiertos, onAlternarFiltros }: CabeceraCatalogoProps) {
    return(
        <div className="cabecera-catalogo">
      <div>
        <p className="texto-eyebrow">Productos</p>
        <h1>{titulo}</h1>
        <p className="texto-muted">{cantidad} {cantidad === 1 ? "producto" : "productos"}</p>
      </div>
      <div className="acciones-catalogo">
        {/* aria-expanded le dice a los lectores de pantalla si el panel está abierto */}
        <button type="button" className="boton boton-secundario" onClick={onAlternarFiltros} aria-expanded={filtrosAbiertos}>
          {filtrosAbiertos ? "Ocultar filtros" : "Mostrar filtros"}
        </button>

        <label className="selector-orden">
          <span>Ordenar por</span>
          {/* evento.target.value = el "value" de la opción elegida */}
          <select className="campo" value={orden} onChange={(evento) => onCambiarOrden(evento.target.value)}>
            {opcionesOrden.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
    )
}

type TarjetaProductoApiProps = {
    producto: ProductoApi      // el producto (de la API) que muestra esta tarjeta
    nombreProveedor: string    // el nombre de quien lo hace, ej: "Mermeladas del Valle"
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App, pasando por PaginaCatalogo
}

// Tarjeta de un producto que viene de la API.
// No pide nada a la API: solo muestra lo que le pasa la página del catálogo.
function TarjetaProductoApi({ producto, nombreProveedor, onAgregarAlCarrito }: TarjetaProductoApiProps) {
    // La foto principal del producto ("" si todavía no tiene fotos).
    const foto = fotoPrincipal(producto)

    return (
        <article className="tarjeta-base tarjeta-producto">
            {/* `/producto/${producto.id}` arma la dirección con el id. Ej: "/producto/8" */}
            <Link to={`/producto/${producto.id}`} className="imagen-placeholder foto-producto">
                {/* Si tiene foto la mostramos; si no, el cuadro gris con un aviso */}
                {foto ? <img src={foto} alt={producto.nombre} /> : "Sin foto"}
            </Link>
            <div className="tarjeta-producto-cuerpo">
                <h3><Link to={`/producto/${producto.id}`}>{producto.nombre}</Link></h3>
                <p className="productor">{nombreProveedor}</p>
                <p className="texto-muted">{producto.descripcion}</p>
                <p className="envio">Conservación: {producto.tipoConservacion}</p>
                {/* "★".repeat(5) = "★★★★★": repite la estrella según la valoración */}
                <p>{"★".repeat(producto.valoracion)}</p>
                <div className="pie-tarjeta-producto">
                    {/* Si tiene descuento (mayor a 0) mostramos el precio rebajado; si no, el normal */}
                    <p className="precio">
                        {formatoPrecio(producto.descuento > 0 ? producto.precioDescuento : producto.precio)}
                        {/* Si tiene descuento (mayor a 0) mostramos también el % */}
                        {producto.descuento > 0 && <small> (-{producto.descuento}%)</small>}
                    </p>
                    {/* Al apretar: primero se agrega 1 unidad al carrito y luego Link nos lleva a /carrito */}
                    <Link to="/carrito" className="boton boton-primario boton-sm"
                        onClick={() => onAgregarAlCarrito(producto, nombreProveedor, 1)}>Agregar</Link>
                </div>
            </div>
        </article>
    )
}

export {CabeceraCatalogo, TarjetaProductoApi}
