// RESUMEN: "miga de pan" de la ficha de producto: Inicio / Productos / Categoría / Nombre.
import "../estilos PDP/estilosPDP.css"
import "../estilos/estilos.css"
import { Link } from "react-router"

type BreadscrumbsProps = {
    nombre: string       // nombre del producto
    categoria: string    // nombre de su categoría ("" si no llegó)
    categoriaId: number  // id de su categoría (para el enlace al catálogo filtrado)
}

function Breadscrumbs({ nombre, categoria, categoriaId }: BreadscrumbsProps) {
    return(
        <nav className="miga-de-pan" aria-label="Ruta de navegación">
      <Link to="/">Inicio</Link> /
      <Link to="/catalogo">Productos</Link> /
      {/* Lleva al catálogo ya filtrado por la categoría del producto. Ej: /catalogo?categoria=1 */}
      {categoria && <><Link to={`/catalogo?categoria=${categoriaId}`}>{categoria}</Link> /</>}
      <span aria-current="page">{nombre}</span>
    </nav>
    )
}

export {Breadscrumbs}
