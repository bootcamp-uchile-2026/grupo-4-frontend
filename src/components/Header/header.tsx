// RESUMEN: barra de navegación de arriba. Se dibuja UNA sola vez, en App.tsx, para todas las páginas.
// Si el usuario es ADMIN, agrega el menú desplegable "Administrar" con los 4 CRUD.
import { useState } from "react"
import { Link } from "react-router"
import "./header.css"
import "../estilos/estilos.css"

// Opciones del menú "Administrar". Para agregar una, basta con sumarla a esta lista.
const opcionesAdmin = [
    { texto: "Productos", enlace: "/admin/productos" },
    { texto: "Categorías", enlace: "/admin/categorias" },
    { texto: "Productores", enlace: "/admin/proveedores" },
    { texto: "Usuarios", enlace: "/admin/usuarios" },
]

type EncabezadoProps = {
    esAdmin: boolean   // true = mostrar el menú "Administrar"
}

function Encabezado({ esAdmin }: EncabezadoProps){
    // true = el menú desplegable está abierto.
    const [menuAbierto, setMenuAbierto] = useState(false)

    return(
        <header className="encabezado">
        <div className="contenedor encabezado-interior">
          <Link to="/" className="logo">La Sobremesa</Link>

          <nav className="menu-navegacion" aria-label="Principal">
            <Link to="/catalogo">Productos</Link>
            <Link to="/productores">Productores</Link>
            <Link to="/suscripcion">Suscripción</Link>

            {/* Solo los ADMIN ven este menú */}
            {esAdmin && (
              <div className="menu-administrar">
                <button
                  type="button"
                  className="boton-administrar"
                  aria-expanded={menuAbierto}
                  onClick={() => setMenuAbierto(!menuAbierto)}
                >
                  Administrar {menuAbierto ? "▲" : "▼"}
                </button>

                {/* La lista solo se dibuja si el menú está abierto */}
                {menuAbierto && (
                  <ul className="submenu-administrar">
                    {opcionesAdmin.map((opcion) => (
                      <li key={opcion.enlace}>
                        {/* Al elegir una opción, cerramos el menú */}
                        <Link to={opcion.enlace} onClick={() => setMenuAbierto(false)}>{opcion.texto}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </nav>

          {/* En React los atributos de los dibujos (SVG) se escriben juntos: strokeWidth, no stroke-width */}
          <div className="iconos-usuario">
            <Link to="/catalogo" className="boton boton-terciario boton-icono boton-sm" aria-label="Buscar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            </Link>
            <a href="favoritos.html" className="boton boton-terciario boton-icono boton-sm" aria-label="Favoritos">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/></svg>
            </a>
            <Link to="/cuenta" className="boton boton-terciario boton-icono boton-sm" aria-label="Mi cuenta">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
            </Link>
            <Link to="/carrito" className="boton boton-terciario boton-icono boton-sm" aria-label="Carrito">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </Link>
          </div>
        </div>
      </header>
    )
}

export {Encabezado}
