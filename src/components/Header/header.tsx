import "./header.css"
import "../estilos/estilos.css"

function Encabezado(){
    return(
        <header className="encabezado">
        <div className="contenedor encabezado-interior">
          <a href="index.html" className="logo">La Sobremesa</a>
    
          <nav className="menu-navegacion" aria-label="Principal">
            <a href="../PLP/catalogo.html">Productos</a>
            <a href="productores.html">Productores</a>
            <a href="../suscripcion.html">Suscripción</a>
          </nav>
    
          <div className="iconos-usuario">
            <a href="../PLP/catalogo.html" className="boton boton-terciario boton-icono boton-sm" aria-label="Buscar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            </a>
            <a href="favoritos.html" className="boton boton-terciario boton-icono boton-sm" aria-label="Favoritos">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></svg>
            </a>
            <a href="../Cuenta Usuario/cuenta.html" className="boton boton-terciario boton-icono boton-sm" aria-label="Mi cuenta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
            </a>
            <a href="../carrito/carrito.html" className="boton boton-terciario boton-icono boton-sm" aria-label="Carrito">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </a>
          </div>
        </div>
      </header>


    )
}

export {Encabezado}