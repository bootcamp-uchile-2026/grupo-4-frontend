import "../estilos/estilos.css"
import "../Header/header.css"



function Destacados() {

    return(
<section className="contenedor seccion">
      <div className="cabecera-seccion">
        <h2>Productos destacados</h2>
      </div>
      <div className="grilla-productos">

        <article className="tarjeta-base tarjeta-producto">
          <a href="../PDP/PDP.html" className="imagen-placeholder foto-producto">Imagen producto</a>
          <div className="tarjeta-producto-cuerpo">
            <h3><a href="../PDP/PDP.html">Queso maduro Don Pedro</a></h3>
            <p className="productor">Dirección productor</p>
            <div className="pie-tarjeta-producto">
              <p className="precio">$12.990</p>
              <a href="../carrito/carrito.html" className="boton boton-primario boton-sm">Agregar</a>
            </div>
          </div>
        </article>

        <article className="tarjeta-base tarjeta-producto">
          <a href="../PDP/PDP.html" className="imagen-placeholder foto-producto">Imagen producto</a>
          <div className="tarjeta-producto-cuerpo">
            <h3><a href="../PDP/PDP.html">Aceite de oliva Emilia</a></h3>
            <p className="productor">Dirección productor</p>
            <div className="pie-tarjeta-producto">
              <p className="precio">$8.990</p>
              <a href="../carrito/carrito.html" className="boton boton-primario boton-sm">Agregar</a>
            </div>
          </div>
        </article>

        <article className="tarjeta-base tarjeta-producto">
          <a href="../PDP/PDP.html" className="imagen-placeholder foto-producto">Imagen producto</a>
          <div className="tarjeta-producto-cuerpo">
            <h3><a href="../PDP/PDP.html">Mermelada de frutillas</a></h3>
            <p className="productor">Dirección productor</p>
            <div className="pie-tarjeta-producto">
              <p className="precio">$6.500</p>
              <a href="../carrito/carrito.html" className="boton boton-primario boton-sm">Agregar</a>
            </div>
          </div>
        </article>

      </div>
    </section>
    )
}

export {Destacados}