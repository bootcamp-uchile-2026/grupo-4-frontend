import { Route, Routes } from "react-router"
import { aProductoCarrito } from "./datos/carrito"
import type { Pedido, Producto } from "./datos/carrito"
import type { ProductoApi } from "./datos/api"
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
import { RutaAdmin } from "./components/admin/ruta_admin"
import { AdminProductos } from "./pages/admin/AdminProductos"
import { AdminCategorias } from "./pages/admin/AdminCategorias"
import { AdminProveedores } from "./pages/admin/AdminProveedores"
import { AdminUsuarios } from "./pages/admin/AdminUsuarios"
import { useEstadoGuardado } from "./hooks/useEstadoGuardado"
import { Encabezado } from "./components/Header/header"



function App() {
  // Aquí, en App, viven los datos que comparten VARIAS páginas.
  // Si vivieran dentro de una página, las demás no podrían verlos.
  //
  // Usamos useEstadoGuardado (en vez de useState) para que estos datos NO se borren
  // al recargar la página (F5). El primer texto es el nombre con que se guardan en el navegador.
  // Puedes verlos en el navegador: F12 → pestaña "Application" (o "Almacenamiento") → Local Storage.

  // El carrito: lo usan Carrito (para mostrarlo y cambiarlo), Checkout (para comprar)
  // y Home, Catálogo y Producto (para agregar con el botón "Agregar"). Empieza vacío.
  // Las claves terminan en "-api": así se ignoran los carritos y pedidos viejos guardados
  // en el navegador, que tenían productos de la lista local (con otros ids).
  const [productos, setProductos] = useEstadoGuardado<Producto[]>("sobremesa-carrito-api", [])

  // Lista de compras hechas. Empieza vacía y la muestra "Mi cuenta".
  // <Pedido[]> le dice a TypeScript que será una lista de pedidos (al estar vacía no lo puede adivinar).
  const [pedidos, setPedidos] = useEstadoGuardado<Pedido[]>("sobremesa-pedidos-api", [])

  // El usuario que inició sesión (con su rol y su token). null = nadie ha ingresado.
  // Lo usan Checkout, Suscripción, Mi cuenta y el panel de administración.
  // La clave cambió a "sobremesa-usuario-api": así se ignoran los usuarios viejos guardados
  // en el navegador, que no tenían token ni rol.
  const [usuario, setUsuario] = useEstadoGuardado<Usuario | null>("sobremesa-usuario-api", null)

  // La suscripción activa. null = no está suscrito.
  const [suscripcion, setSuscripcion] = useEstadoGuardado<Suscripcion | null>("sobremesa-suscripcion", null)

  // El token para las páginas del panel. Si no hay sesión, texto vacío.
  // Ojo: el token dura 15 minutos. Pasado ese tiempo el panel avisa "Tu sesión expiró".
  const token = usuario ? usuario.token : ""

  // Se llama al apretar "Agregar" en Home, Catálogo o la página de un producto.
  // Recibe el producto TAL COMO VIENE DE LA API, el nombre de su productor y cuántas unidades.
  // Si el producto ya está en el carrito, le sumamos la cantidad.
  // Si no está, lo agregamos al final de la lista.
  function agregarAlCarrito(productoApi: ProductoApi, nombreProveedor: string, cantidad: number) {
    // Lo convertimos al formato del carrito (copia de nombre, precio, foto, productor...).
    const productoNuevo = aProductoCarrito(productoApi, nombreProveedor, cantidad)
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
      // Lo agregamos al final (ya trae su cantidad).
      setProductos([...productos, productoNuevo])
    }
  }

  // Se llama cuando termina una compra:
  // 1) agrega el pedido nuevo al final de la lista
  // 2) deja el carrito vacío
  function finalizarCompra(pedidoNuevo: Pedido) {
    setPedidos([...pedidos, pedidoNuevo])
    setProductos([])
  }

  // Se llama al apretar "Cerrar sesión" en Mi cuenta o en el panel de administración.
  function cerrarSesion() {
    setUsuario(null)
  }

  return (
    <>
    {/* El header se dibuja UNA vez, aquí, para todas las páginas (las páginas ya no lo traen).
        Como App conoce al usuario, le avisa al header si es ADMIN para mostrar "Administrar". */}
    <Encabezado esAdmin={usuario !== null && usuario.rol === "ADMIN"}></Encabezado>

    {/* No usamos <BrowserRouter> aquí porque ya está en main.tsx, envolviendo a <App />.
        Todas las rutas van en UN solo <Routes>, con nombres en minúscula. */}
    <Routes>
      <Route path="/" element={<HomePage onAgregarAlCarrito={agregarAlCarrito}></HomePage>} />
      <Route path="/catalogo" element={<PaginaCatalogo onAgregarAlCarrito={agregarAlCarrito}></PaginaCatalogo>} />
      {/* ":id" es una parte variable: /producto/1, /producto/2... La página la lee con useParams */}
      <Route path="/producto/:id" element={<PaginaProducto onAgregarAlCarrito={agregarAlCarrito}></PaginaProducto>} />
      <Route path="/productores" element={<PaginaProductores></PaginaProductores>} />
      <Route path="/productores/:id" element={<PaginaProductor onAgregarAlCarrito={agregarAlCarrito}></PaginaProductor>} />
      {/* Página pública para ver las categorías (crearlas se hace en /admin/categorias) */}
      <Route path="/categorias" element={<PaginaCategorias></PaginaCategorias>} />
      {/* Panel de administración: solo para usuarios con rol ADMIN (se ingresa desde Mi cuenta).
          RutaAdmin revisa el rol. Las rutas de adentro se dibujan en su <Outlet /> */}
      <Route path="/admin" element={<RutaAdmin usuario={usuario} onCerrarSesion={cerrarSesion}></RutaAdmin>}>
        <Route path="productos" element={<AdminProductos token={token}></AdminProductos>} />
        <Route path="categorias" element={<AdminCategorias token={token}></AdminCategorias>} />
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
    </>
  )
}

export default App
