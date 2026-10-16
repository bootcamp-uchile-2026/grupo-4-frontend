
import "../estilos PDP/estilosPDP.css"
import "../estilos/estilos.css"
import { Link } from "react-router"
import type { ProductoTienda } from "../../datos/productos"

type BreadscrumbsProps = {
    producto: ProductoTienda  // el producto de la página, para mostrar su categoría y nombre
}

function Breadscrumbs({ producto }: BreadscrumbsProps) {
    return(
        <nav className="miga-de-pan" aria-label="Ruta de navegación">
      <Link to="/">Inicio</Link> /
      <Link to="/catalogo">Productos</Link> /
      {/* Lleva al catálogo ya filtrado por la categoría del producto. Ej: /catalogo?categoria=Quesos */}
      <Link to={`/catalogo?categoria=${producto.categoria}`}>{producto.categoria}</Link> /
      <span aria-current="page">{producto.nombre}</span>
    </nav>
    )
}

export {Breadscrumbs}
