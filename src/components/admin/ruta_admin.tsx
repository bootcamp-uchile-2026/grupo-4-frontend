// Navigate: redirige a otra página. Outlet: el "hueco" donde se dibuja la ruta hija.
import { Link, Navigate, Outlet } from "react-router"
import { Encabezado } from "../Header/header"
import { Footer } from "../footer/footer"
import type { SesionAdmin } from "../../datos/api"
import "../Header/header.css"
import "./admin.css"

type RutaAdminProps = {
    sesion: SesionAdmin | null
    onCerrarSesion: () => void
}

// Ruta protegida: si no hay sesión de ADMIN, redirige al login.
// Si la hay, muestra el menú del panel y, en el <Outlet />, la sección elegida.
function RutaAdmin({ sesion, onCerrarSesion }: RutaAdminProps) {
    if (sesion === null) {
        return <Navigate to="/admin/login" />
    }

    return (
        <>
        <Encabezado></Encabezado>
        <main className="contenedor panel-admin">
            <h1>Panel de administración</h1>
            <p className="texto-muted">
                Conectado como {sesion.email}{" "}
                <button type="button" className="boton boton-terciario boton-sm" onClick={onCerrarSesion}>Cerrar sesión</button>
            </p>

            <nav className="menu-admin">
                <Link to="/admin/productos">Productos</Link>{" · "}
                <Link to="/admin/proveedores">Productores</Link>{" · "}
                <Link to="/admin/usuarios">Usuarios</Link>
            </nav>

            {/* Aquí React Router dibuja AdminProductos, AdminProveedores o AdminUsuarios */}
            <Outlet />
        </main>
        <Footer></Footer>
        </>
    )
}

export {RutaAdmin}
