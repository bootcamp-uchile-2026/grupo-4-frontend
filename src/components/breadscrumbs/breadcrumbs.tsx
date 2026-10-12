
import "../estilos PDP/estilosPDP.css"
import "../estilos/estilos.css"

function Breadscrumbs() {
    return(
        <nav className="miga-de-pan" aria-label="Ruta de navegación">
      <a href="../Home/index.html">Inicio</a> /
      <a href="../PLP/catalogo.html">Productos</a> /
      <a href="../PLP/catalogo.html">Quesos</a> /
      <span aria-current="page">Queso Madurado</span>
    </nav>
    )
}

export {Breadscrumbs}