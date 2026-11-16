import { useState } from "react"
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
import { PaginaCategorias } from "./pages/Categorias"
import { LoginAdmin } from "./pages/admin/LoginAdmin"
import { RutaAdmin } from "./components/admin/ruta_admin"
import { AdminProductos } from "./pages/admin/AdminProductos"
import { AdminProveedores } from "./pages/admin/AdminProveedores"
import { AdminUsuarios } from "./pages/admin/AdminUsuarios"
import type { SesionAdmin } from "./datos/api"
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

  // La sesión del administrador. null = nadie ha iniciado sesión.
  // Usamos useState (y no useEstadoGuardado) a propósito: el token dura solo 15 minutos,
  // así que no tiene sentido guardarlo en el navegador. Al recargar (F5) hay que volver a ingresar.
  const [sesionAdmin, setSesionAdmin] = useState<SesionAdmin | null>(null)
  // El token para las páginas del panel. Si no hay sesión, texto vacío.
  const token = sesionAdmin ? sesionAdmin.token : ""

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
      <Route path="/catalogo" element={<PaginaCatalogo></PaginaCatalogo>} />
      {/* ":id" es una parte variable: /producto/1, /producto/2... La página la lee con useParams */}
      <Route path="/producto/:id" element={<PaginaProducto onAgregarAlCarrito={agregarAlCarrito}></PaginaProducto>} />
      <Route path="/productores" element={<PaginaProductores></PaginaProductores>} />
      <Route path="/productores/:id" element={<PaginaProductor onAgregarAlCarrito={agregarAlCarrito}></PaginaProductor>} />
      {/* Página para ver y crear categorías en la API */}
      <Route path="/categorias" element={<PaginaCategorias></PaginaCategorias>} />
      {/* Panel de administración: solo para usuarios con rol ADMIN */}
      <Route path="/admin/login" element={<LoginAdmin sesion={sesionAdmin} onIngresar={setSesionAdmin}></LoginAdmin>} />
      {/* Ruta protegida: RutaAdmin revisa la sesión. Las rutas de adentro se dibujan en su <Outlet /> */}
      <Route path="/admin" element={<RutaAdmin sesion={sesionAdmin} onCerrarSesion={() => setSesionAdmin(null)}></RutaAdmin>}>
        <Route path="productos" element={<AdminProductos token={token}></AdminProductos>} />
        <Route path="proveedores" element={<AdminProveedores token={token}></AdminProveedores>} />
        <Route path="usuarios" element={<AdminUsuarios token={token}></AdminUsuarios>} />
      </Route>
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
