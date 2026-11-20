// RESUMEN: perfil de un productor (/productores/:id).
// Pide a la API el productor y sus productos, y muestra sus datos de contacto y sus productos
// (con las mismas tarjetas del catálogo, cada una con su botón "Agregar").

// useState: para recordar lo que llega de la API. useEffect: para pedirlo al abrir la página.
import { useEffect, useState } from "react"
// useParams lee las partes variables de la dirección. Ej: en "/productores/2" nos da { id: "2" }.
import { Link, useParams } from "react-router"

// Componentes que arman la página. Cada uno es una parte de la pantalla.
import { TarjetaProductoApi } from "../components/catalogo/catalogo"   // la misma tarjeta del catálogo
import { Footer } from "../components/footer/footer"                  // pie de página
import { URL_PRODUCTOS, URL_PROVEEDORES, fotoPrincipal } from "../datos/api"
import type { ProductoApi, ProveedorApi } from "../datos/api"
import type { AgregarAlCarrito } from "../datos/carrito"
import "../components/estilosPLP/estilosPLP.css"
import "../components/productores/productores.css"

type PaginaProductorProps = {
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App; se la pasamos a cada tarjeta de producto
}

function PaginaProductor({ onAgregarAlCarrito }: PaginaProductorProps) {
    // "id" sale de la ruta "/productores/:id" definida en App.tsx (llega como texto, ej: "2").
    const { id } = useParams()

    // Lo que llega de la API. null = todavía no llega.
    const [productor, setProductor] = useState<ProveedorApi | null>(null)
    const [productos, setProductos] = useState<ProductoApi[]>([])
    // true mientras esperamos a la API.
    const [cargando, setCargando] = useState(true)
    // true si la API responde que el productor no existe (404) o si algo falla.
    const [noEncontrado, setNoEncontrado] = useState(false)

    // Pedimos los datos al abrir la página. [id]: si cambia el id, los volvemos a pedir.
    useEffect(() => {
        async function cargarProductor() {
            try {
                // 1) El productor. Si no existe, la API responde 404.
                const respuestaProductor = await fetch(URL_PROVEEDORES + "/" + id)
                if (!respuestaProductor.ok) {
                    throw new Error("Productor no encontrado")
                }
                const datosProductor = await respuestaProductor.json()

                // 2) Solo SUS productos: la API filtra con "?proveedorId=2" (ver Swagger).
                const respuestaProductos = await fetch(URL_PRODUCTOS + "?proveedorId=" + id)
                if (!respuestaProductos.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datosProductos = await respuestaProductos.json()

                setProductor(datosProductor)
                setProductos(datosProductos)
                setNoEncontrado(false)
            } catch (error) {
                console.error("Error:", error)
                setNoEncontrado(true)
            }
            setCargando(false)
        }
        cargarProductor()
    }, [id])

    // Mientras esperamos a la API.
    if (cargando) {
        return (
            <main className="contenedor">
              <p className="texto-muted">Cargando productor...</p>
            </main>
        )
    }

    // Si el id no existe (ej: /productores/99), mostramos un aviso.
    if (noEncontrado || !productor) {
        return (
            <>
            <main className="contenedor">
              <h1>Productor no encontrado</h1>
              <Link to="/productores" className="boton boton-primario">Ver todos los productores</Link>
            </main>
            <Footer></Footer>
            </>
        )
    }

    // La foto principal del productor ("" si todavía no tiene).
    const foto = fotoPrincipal(productor)

    return(
        <>

        <main className="contenedor">
          <section className="perfil-productor">
            {/* Si tiene foto la mostramos; si no, la primera letra del nombre */}
            <div className="imagen-placeholder avatar-productor" aria-hidden="true">
              {foto ? <img src={foto} alt="" /> : productor.nombre[0]}
            </div>
            <div>
              <p className="texto-eyebrow">Productor</p>
              <h1>{productor.nombre}</h1>
            </div>
          </section>

          <section className="tarjeta-suave historia-productor">
            <h2>Sobre {productor.nombre}</h2>
            <p>{productor.descripcion}</p>
            {/* mailto: abre el programa de correo · tel: abre el marcador en el celular.
                Solo los mostramos si vienen con datos. */}
            {productor.email && <p>✉️ <a href={"mailto:" + productor.email}>{productor.email}</a></p>}
            {productor.telefono && <p>☎️ <a href={"tel:" + productor.telefono}>{productor.telefono}</a></p>}
          </section>

          <section className="productos-productor">
            <h2>Productos de {productor.nombre}</h2>
            {/* Si todavía no tiene productos, avisamos */}
            {productos.length === 0 && <p className="texto-muted">Este productor todavía no tiene productos.</p>}
            <div className="grilla-productos">
              {productos.map((producto) => (
                <TarjetaProductoApi
                  key={producto.id}
                  producto={producto}
                  nombreProveedor={productor.nombre}
                  onAgregarAlCarrito={onAgregarAlCarrito}
                ></TarjetaProductoApi>
              ))}
            </div>
          </section>

          <Link to="/productores" className="boton boton-terciario">← Ver todos los productores</Link>
        </main>

        <Footer></Footer>
        </>
    )
}

export {PaginaProductor}
