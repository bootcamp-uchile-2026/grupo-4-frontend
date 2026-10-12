
import "../estilosPLP/estilosPLP.css"
import { Link } from "react-router"
import { formatoPrecio } from "../carrito/formato_precio"
import type { AgregarAlCarrito, ProductoTienda } from "../../datos/productos"

type TarjetaProductosProps = {
    producto: ProductoTienda              // el producto que muestra esta tarjeta
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App, pasando por PaginaCatalogo
}

function TarjetaProductos({ producto, onAgregarAlCarrito }: TarjetaProductosProps) {
    return(

        <article className="tarjeta-base tarjeta-producto">
        {/* `/producto/${producto.id}` arma la dirección con el id. Ej: "/producto/3" */}
            <Link to={`/producto/${producto.id}`} className="imagen-placeholder foto-producto">
              {/* alt = texto que se lee si la foto no carga (y el que usan los lectores de pantalla) */}
              <img src={producto.imagen} alt={producto.nombre} />
            </Link>
        <div className="tarjeta-producto-cuerpo">
          <h3><Link to={`/producto/${producto.id}`}>{producto.nombre}</Link></h3>
          <p className="productor">{producto.marca}</p>
          <p className="envio">Envío: 2 a 3 días</p>
          <div className="pie-tarjeta-producto">
            <p className="precio">{formatoPrecio(producto.precio)}</p>
            {/* Al apretar: primero se agrega 1 unidad al carrito y luego Link nos lleva a /carrito */}
            <Link to="/carrito" className="boton boton-primario boton-sm" onClick={() => onAgregarAlCarrito(producto, 1)}>Agregar</Link>
          </div>
        </div>
      </article>
    )
}
export {TarjetaProductos}
