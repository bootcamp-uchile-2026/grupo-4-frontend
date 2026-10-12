import { Link } from "react-router"
import "../estilos/estilos.css"
import "./cuenta.css"

// Opciones del menú. Las que aún no tienen página apuntan a un ancla (#).
const opciones = [
    { icono: "📦", texto: "Mis pedidos", enlace: "#mis-pedidos" },
    { icono: "🧺", texto: "Mi suscripción", enlace: "#mi-suscripcion" },
    { icono: "♡", texto: "Favoritos", enlace: "#favoritos" },
    { icono: "📍", texto: "Direcciones", enlace: "#direcciones" },
    { icono: "💳", texto: "Métodos de pago", enlace: "#metodos-pago" },
    { icono: "👤", texto: "Mis datos", enlace: "#mis-datos" },
    { icono: "❓", texto: "Ayuda", enlace: "#ayuda" },
]

type MenuLateralProps = {
    onCerrarSesion: () => void  // se llama al apretar "Cerrar sesión"
}

// Menú de la izquierda en "Mi cuenta".
function MenuLateral({ onCerrarSesion }: MenuLateralProps) {
    return(
    <aside className="menu-lateral">
      <nav className="lista-menu-lateral" aria-label="Mi cuenta">
        {/* "Resumen" es la página actual, por eso lleva la clase "activo" */}
        <Link to="/cuenta" className="item-menu-lateral activo" aria-current="page">
          <span className="icono-menu" aria-hidden="true">📋</span>
          <span>Resumen</span>
        </Link>

        {/* El resto de las opciones salen de la lista de arriba */}
        {opciones.map((opcion) => (
          <a key={opcion.texto} href={opcion.enlace} className="item-menu-lateral">
            <span className="icono-menu" aria-hidden="true">{opcion.icono}</span>
            <span>{opcion.texto}</span>
          </a>
        ))}

        <Link to="/" className="item-menu-lateral cerrar-sesion" onClick={onCerrarSesion}>
          <span className="icono-menu" aria-hidden="true">↩</span>
          <span>Cerrar sesión</span>
        </Link>
      </nav>
    </aside>
    )
}

export {MenuLateral}
