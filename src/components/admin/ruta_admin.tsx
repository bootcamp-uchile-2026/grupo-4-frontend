// RESUMEN: ruta protegida del panel de administración.
// Si no hay sesión, o el rol no es ADMIN, manda a "Mi cuenta". Si es ADMIN, muestra el panel.

// Navigate: redirige a otra página. Outlet: el "hueco" donde se dibuja la ruta hija.
import { Link, Navigate, Outlet } from "react-router"
import { Footer } from "../footer/footer"
import type { Usuario } from "../../datos/usuario"
import "../Header/header.css"
import "./admin.css"

type RutaAdminProps = {
    usuario: Usuario | null     // el usuario que inició sesión (o null)
    onCerrarSesion: () => void
}

function RutaAdmin({ usuario, onCerrarSesion }: RutaAdminProps) {
    // Sin sesión, o con sesión pero sin rol ADMIN → a "Mi cuenta" (ahí está el ingreso).
    if (usuario === null || usuario.rol !== "ADMIN") {
        return <Navigate to="/cuenta" />
    }

    return (
        <>
        <main className="contenedor panel-admin">
            <h1>Panel de administración</h1>
            <p className="texto-muted">
                Conectado como {usuario.nombre} ({usuario.email}){" "}
                <button type="button" className="boton boton-terciario boton-sm" onClick={onCerrarSesion}>Cerrar sesión</button>
            </p>

            <nav className="menu-admin">
                <Link to="/admin/productos">Productos</Link>{" · "}
                <Link to="/admin/categorias">Categorías</Link>{" · "}
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
