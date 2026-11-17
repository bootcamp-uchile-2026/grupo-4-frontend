// RESUMEN: página "Mi cuenta" (/cuenta).
// Sin sesión muestra el ingreso (crear cuenta o iniciar sesión). Con sesión muestra el resumen
// del usuario, y si su rol es ADMIN, el menú agrega el enlace al panel de administración.

// Componentes que arman la página. Cada uno es una parte de la pantalla.
import { MenuLateral } from "../components/cuenta/menu_lateral"            // menú de la izquierda
import { AccesoCuenta } from "../components/cuenta/acceso_cuenta"          // "Crear cuenta" o "Iniciar sesión"
import { ProximoPedido } from "../components/cuenta/proximo_pedido"        // tarjeta del último pedido
import { TarjetaSuscripcion } from "../components/cuenta/tarjeta_suscripcion" // tarjeta de suscripción
import { AccesosRapidos } from "../components/cuenta/accesos_rapidos"      // 4 accesos directos
import { VuelveATuMesa } from "../components/cuenta/vuelve_a_tu_mesa"      // productos ya comprados
import { Footer } from "../components/footer/footer"                        // pie de página
import type { Pedido } from "../datos/carrito"                              // forma de un pedido
import type { Suscripcion } from "../datos/suscripcion"                     // forma de una suscripción
import type { Usuario } from "../datos/usuario"                             // forma del usuario

// La página recibe desde App.tsx todo lo que necesita mostrar.
type CuentaPageProps = {
    usuario: Usuario | null
    pedidos: Pedido[]
    suscripcion: Suscripcion | null
    onCuentaCreada: (usuario: Usuario) => void
    onCerrarSesion: () => void
}

function CuentaPage({ usuario, pedidos, suscripcion, onCuentaCreada, onCerrarSesion }: CuentaPageProps){
    // Si nadie ha iniciado sesión, en vez del panel mostramos el ingreso.
    if (!usuario) {
        return (
            <>
            {/* Reusamos el estilo centrado del checkout */}
            <main className="contenedor contenedor-principal-centrado">
              <AccesoCuenta titulo="Crea tu cuenta para ver tus pedidos" modoInicial="ingresar" onCuentaCreada={onCuentaCreada}></AccesoCuenta>
            </main>
            <Footer></Footer>
            </>
        )
    }

    // El último pedido es el que está al final de la lista.
    // Si la lista está vacía, ultimoPedido queda como undefined.
    const ultimoPedido = pedidos[pedidos.length - 1]

    return(
        <>

        <main className="contenedor contenedor-perfil">
          {/* esAdmin: true solo si el rol del usuario es ADMIN */}
          <MenuLateral esAdmin={usuario.rol === "ADMIN"} onCerrarSesion={onCerrarSesion}></MenuLateral>

          <section className="panel-contenido">
            <h1>Hola, {usuario.nombre}</h1>

            <div className="grilla-resumen">
              <ProximoPedido pedido={ultimoPedido}></ProximoPedido>
              <TarjetaSuscripcion suscripcion={suscripcion}></TarjetaSuscripcion>
            </div>

            <AccesosRapidos></AccesosRapidos>

            <VuelveATuMesa pedidos={pedidos}></VuelveATuMesa>
          </section>
        </main>

        <Footer></Footer>
        </>
    )
}

export {CuentaPage}
