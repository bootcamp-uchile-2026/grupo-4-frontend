import "../estilos/estilos.css"
import "./carrito.css"
import { Link } from "react-router"
import { productosTienda } from "../../datos/productos"

// "También te puede interesar": una tarjeta por cada producto de la tienda.
function Sugerencias() {
    return(
      <section className="seccion-interes">
        <h2>También te puede interesar</h2>
        <div className="grid-sugerencias">
          {productosTienda.map((producto) => (
            <Link key={producto.id} to={`/producto/${producto.id}`} className="imagen-placeholder tarjeta-sugerencia">
              <img src={producto.imagen} alt={producto.nombre} />
            </Link>
          ))}
        </div>
      </section>
    )
}

export {Sugerencias}
