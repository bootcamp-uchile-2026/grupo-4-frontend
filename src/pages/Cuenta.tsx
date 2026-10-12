// Componentes que arman la página. Cada uno es una parte de la pantalla.
import { Encabezado } from "../components/Header/header"                    // barra de navegación superior
import { MenuLateral } from "../components/cuenta/menu_lateral"            // menú de la izquierda
import { CrearCuenta } from "../components/cuenta/crear_cuenta"            // formulario "Crear cuenta"
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
    // Si nadie ha creado cuenta, en vez del panel mostramos el formulario.
    if (!usuario) {
        return (
            <>
            <Encabezado></Encabezado>
            {/* Reusamos el estilo centrado del checkout */}
            <main className="contenedor contenedor-principal-centrado">
              <CrearCuenta titulo="Crea tu cuenta para ver tus pedidos" onCuentaCreada={onCuentaCreada}></CrearCuenta>
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
        <Encabezado></Encabezado>

        <main className="contenedor contenedor-perfil">
          <MenuLateral onCerrarSesion={onCerrarSesion}></MenuLateral>

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
