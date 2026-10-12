import { Route, Routes } from "react-router"
import { HomePage } from "./pages/Home"
import { PaginaProducto } from "./pages/PDP"
import { PaginaCatalogo } from "./pages/PLP"
import { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import { productosIniciales } from "./datos/carrito"
import type { Pedido } from "./datos/carrito"
import type { Suscripcion } from "./datos/suscripcion"
import type { Usuario } from "./datos/usuario"
import { CarritoPage } from "./pages/Carrito"
import { CheckoutPage } from "./pages/Checkout"
import { CuentaPage } from "./pages/Cuenta"
import { HomePage } from "./pages/Home"
import { SuscripcionPage } from "./pages/Suscripcion"



function App() {
  // Aquí, en App, viven los datos que comparten VARIAS páginas.
  // Si vivieran dentro de una página, las demás no podrían verlos.

  // El carrito: lo usan Carrito (para mostrarlo y cambiarlo) y Checkout (para comprar).
  const [productos, setProductos] = useState(productosIniciales)

  // Lista de compras hechas. Empieza vacía y la muestra "Mi cuenta".
  // <Pedido[]> le dice a TypeScript que será una lista de pedidos (al estar vacía no lo puede adivinar).
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  // El usuario con cuenta. null = nadie ha creado cuenta todavía.
  // Lo usan Checkout, Suscripción y Mi cuenta.
  const [usuario, setUsuario] = useState<Usuario | null>(null)

  // La suscripción activa. null = no está suscrito.
  const [suscripcion, setSuscripcion] = useState<Suscripcion | null>(null)

  // Se llama cuando termina una compra:
  // 1) agrega el pedido nuevo al final de la lista
  // 2) deja el carrito vacío
  function finalizarCompra(pedidoNuevo: Pedido) {
    setPedidos([...pedidos, pedidoNuevo])
    setProductos([])
  }

  // Se llama al apretar "Cerrar sesión" en Mi cuenta.
  function cerrarSesion() {
    setUsuario(null)
  }

  return (
    <>
      <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/PaginaProducto" element={<PaginaProducto/>}/>
      <Route path="/PaginaCatalogo" element={<PaginaCatalogo/>}/>
      </Routes>


    </>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/carrito" element={<CarritoPage productos={productos} setProductos={setProductos}></CarritoPage>} />
        <Route path="/checkout" element={
          <CheckoutPage
            productos={productos}
            usuario={usuario}
            onCuentaCreada={setUsuario}
            onCompraFinalizada={finalizarCompra}
          ></CheckoutPage>
        } />
        <Route path="/suscripcion" element={
          <SuscripcionPage
            usuario={usuario}
            suscripcion={suscripcion}
            onCuentaCreada={setUsuario}
            onSuscribirse={setSuscripcion}
          ></SuscripcionPage>
        } />
        <Route path="/cuenta" element={
          <CuentaPage
            usuario={usuario}
            pedidos={pedidos}
            suscripcion={suscripcion}
            onCuentaCreada={setUsuario}
            onCerrarSesion={cerrarSesion}
          ></CuentaPage>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
