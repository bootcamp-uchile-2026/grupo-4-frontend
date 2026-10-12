import "../estilos/estilos.css"
import "../Header/header.css"
import { Link } from "react-router"
import { nombreProductor } from "../../datos/productores"
import { formatoPrecio } from "../carrito/formato_precio"
import { productosTienda } from "../../datos/productos"
import type { AgregarAlCarrito } from "../../datos/productos"

type DestacadosProps = {
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App, pasando por HomePage
}

// Los 3 productos que mostramos en el Home (posiciones 0, 2 y 3 de la lista de la tienda).
const destacados = [productosTienda[0], productosTienda[2], productosTienda[3]]

function Destacados({ onAgregarAlCarrito }: DestacadosProps) {

    return(
<section className="contenedor seccion">
      <div className="cabecera-seccion">
        <h2>Productos destacados</h2>
      </div>
      <div className="grilla-productos">

        {destacados.map((producto) => (
          <article key={producto.id} className="tarjeta-base tarjeta-producto">
            {/* `/producto/${producto.id}` arma la dirección con el id. Ej: "/producto/3" */}
            <Link to={`/producto/${producto.id}`} className="imagen-placeholder foto-producto">
              {/* alt = texto que se lee si la foto no carga (y el que usan los lectores de pantalla) */}
              <img src={producto.imagen} alt={producto.nombre} />
            </Link>
            <div className="tarjeta-producto-cuerpo">
              <h3><Link to={`/producto/${producto.id}`}>{producto.nombre}</Link></h3>
              <p className="productor">{nombreProductor(producto.productorId)}</p>
              <div className="pie-tarjeta-producto">
                <p className="precio">{formatoPrecio(producto.precio)}</p>
                {/* Al apretar: primero se agrega 1 unidad al carrito y luego Link nos lleva a /carrito */}
                <Link to="/carrito" className="boton boton-primario boton-sm" onClick={() => onAgregarAlCarrito(producto, 1)}>Agregar</Link>
              </div>
            </div>
          </article>
        ))}

      </div>
    </section>
    )
}

export {Destacados}
