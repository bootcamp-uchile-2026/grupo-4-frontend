// useState permite que la página recuerde qué opción eligió el usuario.
import { useState } from "react"
// Link es como un <a>, pero cambia de página sin recargar el navegador.
import { Link } from "react-router"

// Componentes que arman la página. Cada uno es una parte de la pantalla.
import { Encabezado } from "../components/Header/header"                  // barra de navegación superior
import { PasosCheckout } from "../components/checkout/pasos_checkout"     // pasos 1-2-3-4
import { OpcionesAcceso } from "../components/checkout/opciones_acceso"   // "¿Tienes cuenta?"
import { CrearCuenta } from "../components/cuenta/crear_cuenta"           // formulario "Crear cuenta"
import { FormularioCompra } from "../components/checkout/formulario_compra" // datos de entrega y confirmar
import { Footer } from "../components/footer/footer"                      // pie de página
import type { Pedido, Producto } from "../datos/carrito"                  // forma de producto y pedido
import type { Usuario } from "../datos/usuario"                           // forma del usuario

// La página recibe desde App.tsx el carrito, el usuario y las funciones para cambiarlos.
type CheckoutPageProps = {
    productos: Producto[]
    usuario: Usuario | null                       // null = nadie ha creado cuenta todavía
    onCuentaCreada: (usuario: Usuario) => void    // guarda el usuario nuevo en App
    onCompraFinalizada: (pedido: Pedido) => void  // recibe el pedido recién comprado
}

function CheckoutPage({ productos, usuario, onCuentaCreada, onCompraFinalizada }: CheckoutPageProps){
    // "cuenta" = mostrar el formulario de crear cuenta (empieza así).
    // "invitado" = mostrar el formulario para comprar sin cuenta.
    const [opcion, setOpcion] = useState("cuenta")

    return(
        <>
        <Encabezado></Encabezado>

        <main className="contenedor contenedor-principal-centrado">
          <section className="seccion-checkout">
            <h1 className="titulo-checkout">Checkout</h1>

            {/* Le decimos al componente que estamos en el paso 1 (Datos) */}
            <PasosCheckout pasoActual={1}></PasosCheckout>

            {/* CASO A: ya tiene cuenta → va directo al formulario de compra con sus datos */}
            {usuario && (
              <>
                <h2 className="pregunta-cuenta">Hola, {usuario.nombre} 👋</h2>
                <FormularioCompra productos={productos} usuario={usuario} onCompraFinalizada={onCompraFinalizada}></FormularioCompra>
              </>
            )}

            {/* CASO B: no tiene cuenta → elige entre crear cuenta o comprar como invitado */}
            {!usuario && (
              <>
                <OpcionesAcceso opcionElegida={opcion} onElegir={setOpcion}></OpcionesAcceso>

                {/* Al crear la cuenta, App guarda el usuario y esta página pasa al CASO A */}
                {opcion === "cuenta" && <CrearCuenta titulo="Crear cuenta" onCuentaCreada={onCuentaCreada}></CrearCuenta>}
                {opcion === "invitado" && <FormularioCompra productos={productos} usuario={null} onCompraFinalizada={onCompraFinalizada}></FormularioCompra>}
              </>
            )}

            <div className="footer-volver-carrito">
              <Link to="/carrito" className="boton boton-terciario">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
                Volver al carrito
              </Link>
            </div>
          </section>
        </main>

        <Footer></Footer>
        </>
    )
}

export {CheckoutPage}
