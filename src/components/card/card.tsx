
import "../estilosPLP/estilosPLP.css"

function TarjetaProductos() {
    return(

        <article className="tarjeta-base tarjeta-producto">
        <a href="../PDP/PDP.html" className="imagen-placeholder foto-producto">Imagen producto</a>
        <div className="tarjeta-producto-cuerpo">
          <h3><a href="../PDP/PDP.html">Queso Maduro</a></h3>
          <p className="productor">Don Pedro</p>
          <p className="envio">Envío: 2 a 3 días</p>
          <div className="pie-tarjeta-producto">
            <p className="precio">$12.990</p>
            <a href="../carrito/carrito.html" className="boton boton-primario boton-sm">Agregar</a>
          </div>
        </div>
      </article>
    )
}
export {TarjetaProductos}