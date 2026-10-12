import "../estilos/estilos.css"
import "./carrito.css"

function Sugerencias() {
    return(
      <section className="seccion-interes">
        <h2>También te puede interesar</h2>
        <div className="grid-sugerencias">
          <a href="../PDP/PDP.html" className="imagen-placeholder tarjeta-sugerencia">Producto</a>
          <a href="../PDP/PDP.html" className="imagen-placeholder tarjeta-sugerencia">Producto</a>
          <a href="../PDP/PDP.html" className="imagen-placeholder tarjeta-sugerencia">Producto</a>
          <a href="../PDP/PDP.html" className="imagen-placeholder tarjeta-sugerencia">Producto</a>
        </div>
      </section>
    )
}

export {Sugerencias}
