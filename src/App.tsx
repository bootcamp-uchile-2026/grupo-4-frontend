import { Route, Routes } from "react-router"
import { actualizarDatosProductos, productosIniciales } from "./datos/carrito"
import type { Pedido, Producto } from "./datos/carrito"
import type { ProductoTienda } from "./datos/productos"
import type { Suscripcion } from "./datos/suscripcion"
import type { Usuario } from "./datos/usuario"
import { CarritoPage } from "./pages/Carrito"
import { CheckoutPage } from "./pages/Checkout"
import { CuentaPage } from "./pages/Cuenta"
import { HomePage } from "./pages/Home"
import { PaginaProducto } from "./pages/PDP"
import { PaginaProductor } from "./pages/Productor"
import { PaginaProductores } from "./pages/Productores"
import { PaginaCatalogo } from "./pages/PLP"
import { SuscripcionPage } from "./pages/Suscripcion"
import { useEstadoGuardado } from "./hooks/useEstadoGuardado"



function App() {
  // Aquí, en App, viven los datos que comparten VARIAS páginas.
  // Si vivieran dentro de una página, las demás no podrían verlos.
  //
  // Usamos useEstadoGuardado (en vez de useState) para que estos datos NO se borren
  // al recargar la página (F5). El primer texto es el nombre con que se guardan en el navegador.
  // Puedes verlos en el navegador: F12 → pestaña "Application" (o "Almacenamiento") → Local Storage.

  // El carrito: lo usan Carrito (para mostrarlo y cambiarlo), Checkout (para comprar)
  // y Home, Catálogo y Producto (para agregar con el botón "Agregar").
  const [carritoGuardado, setProductos] = useEstadoGuardado<Producto[]>("sobremesa-carrito", productosIniciales)
  // Lo guardado puede tener precios o fotos viejas: lo ponemos al día con los datos actuales de la tienda.
  const productos = actualizarDatosProductos(carritoGuardado)

  // Lista de compras hechas. Empieza vacía y la muestra "Mi cuenta".
  // <Pedido[]> le dice a TypeScript que será una lista de pedidos (al estar vacía no lo puede adivinar).
  const [pedidos, setPedidos] = useEstadoGuardado<Pedido[]>("sobremesa-pedidos", [])

  // El usuario con cuenta. null = nadie ha creado cuenta todavía.
  // Lo usan Checkout, Suscripción y Mi cuenta.
  const [usuario, setUsuario] = useEstadoGuardado<Usuario | null>("sobremesa-usuario", null)

  // La suscripción activa. null = no está suscrito.
  const [suscripcion, setSuscripcion] = useEstadoGuardado<Suscripcion | null>("sobremesa-suscripcion", null)

  // Se llama al apretar "Agregar" en Home, Catálogo o la página de un producto.
  // Si el producto ya está en el carrito, le sumamos la cantidad.
  // Si no está, lo agregamos al final de la lista.
  function agregarAlCarrito(productoNuevo: ProductoTienda, cantidad: number) {
    // "some" revisa si ALGÚN producto del carrito ya tiene ese id.
    const yaEsta = productos.some((producto) => producto.id === productoNuevo.id)

    if (yaEsta) {
      const nuevaLista = productos.map((producto) => {
        if (producto.id === productoNuevo.id) {
          return { ...producto, cantidad: producto.cantidad + cantidad }
        }
        return producto
      })
      setProductos(nuevaLista)
    } else {
      // Copiamos los datos del producto y le agregamos la cantidad.
      setProductos([...productos, { ...productoNuevo, cantidad: cantidad }])
    }
  }

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
    // No usamos <BrowserRouter> aquí porque ya está en main.tsx, envolviendo a <App />.
    // Todas las rutas van en UN solo <Routes>, con nombres en minúscula.
    <Routes>
      <Route path="/" element={<HomePage onAgregarAlCarrito={agregarAlCarrito}></HomePage>} />
      <Route path="/catalogo" element={<PaginaCatalogo onAgregarAlCarrito={agregarAlCarrito}></PaginaCatalogo>} />
      {/* ":id" es una parte variable: /producto/1, /producto/2... La página la lee con useParams */}
      <Route path="/producto/:id" element={<PaginaProducto onAgregarAlCarrito={agregarAlCarrito}></PaginaProducto>} />
      <Route path="/productores" element={<PaginaProductores></PaginaProductores>} />
      <Route path="/productores/:id" element={<PaginaProductor onAgregarAlCarrito={agregarAlCarrito}></PaginaProductor>} />
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
  )
}

export default App
