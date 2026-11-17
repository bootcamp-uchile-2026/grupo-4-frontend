// RESUMEN: ficha de un producto (/producto/:id).
// Pide a la API el producto, el nombre de su productor y el de su categoría,
// y muestra la galería con el botón "Agregar al carrito", las pestañas y las reseñas.

// useState: para recordar el producto que llega de la API. useEffect: para pedirlo al abrir la página.
import { useEffect, useState } from "react"
// useParams lee las partes variables de la dirección. Ej: en "/producto/3" nos da { id: "3" }.
import { Link, useParams } from "react-router";
import { Breadscrumbs } from "../components/breadscrumbs/breadcrumbs";
import { Footer } from "../components/footer/footer";
import { GaleriaImagenes } from "../components/galeria imagenes/galeria_imagenes";
import { PestañasIngredientes } from "../components/PestañasIngredientes/Pestañas";
import { TarjetasReseñas } from "../components/TarjetaReseñas/tarjetasReseñas";
import { TarjetaProductor } from "../components/TarjetaProductor/tarjetaProductor";
import "../components/estilos PDP/estilosPDP.css"
import { URL_PRODUCTOS, URL_PROVEEDORES, URL_CATEGORIAS } from "../datos/api"
import type { ProductoApi, ProveedorApi } from "../datos/api"
import type { AgregarAlCarrito } from "../datos/carrito"


type PaginaProductoProps = {
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App; la usa el botón "Agregar al carrito"
}

function PaginaProducto({ onAgregarAlCarrito }: PaginaProductoProps) {
    // "id" sale de la ruta "/producto/:id" definida en App.tsx (siempre llega como texto, ej: "3").
    const { id } = useParams()

    // El producto que llega de la API. null = todavía no llega.
    const [producto, setProducto] = useState<ProductoApi | null>(null)
    // Su productor completo (para el nombre y la tarjeta "Conoce a..."). null = no llegó.
    const [productor, setProductor] = useState<ProveedorApi | null>(null)
    // Nombre de la categoría para mostrar (la API del producto solo trae el id).
    const [nombreCategoria, setNombreCategoria] = useState("")
    // true mientras esperamos a la API.
    const [cargando, setCargando] = useState(true)
    // true si la API responde que el producto no existe (404) o si algo falla.
    const [noEncontrado, setNoEncontrado] = useState(false)

    // Pedimos los datos al abrir la página. [id] al final: si cambia el id
    // (ej: apretamos otro producto en "También te puede interesar"), lo volvemos a pedir.
    useEffect(() => {
        async function cargarProducto() {
            try {
                // 1) El producto. Si no existe, la API responde 404.
                const respuesta = await fetch(URL_PRODUCTOS + "/" + id)
                if (!respuesta.ok) {
                    throw new Error("Producto no encontrado")
                }
                const datos: ProductoApi = await respuesta.json()

                // 2) Su productor y su categoría.
                //    Si alguno falla, queda vacío pero la página igual se muestra.
                let proveedor: ProveedorApi | null = null
                const respuestaProveedor = await fetch(URL_PROVEEDORES + "/" + datos.proveedorId)
                if (respuestaProveedor.ok) {
                    proveedor = await respuestaProveedor.json()
                }
                let categoria = ""
                const respuestaCategoria = await fetch(URL_CATEGORIAS + "/" + datos.categoriaId)
                if (respuestaCategoria.ok) {
                    const datosCategoria = await respuestaCategoria.json()
                    categoria = datosCategoria.nombre
                }

                setProducto(datos)
                setProductor(proveedor)
                setNombreCategoria(categoria)
                setNoEncontrado(false)
            } catch (error) {
                console.error("Error:", error)
                setNoEncontrado(true)
            }
            setCargando(false)
        }
        cargarProducto()
    }, [id])

    // Mientras esperamos a la API.
    if (cargando) {
        return (
            <main className="contenedor">
              <p className="texto-muted">Cargando producto...</p>
            </main>
        )
    }

    // Si alguien escribe un id que no existe (ej: /producto/99), mostramos un aviso.
    if (noEncontrado || !producto) {
        return (
            <>
            <main className="contenedor">
              <h1>Producto no encontrado</h1>
              <p>El producto que buscas no existe o ya no está disponible.</p>
              <Link to="/catalogo" className="boton boton-primario">Ver todos los productos</Link>
            </main>
            <Footer></Footer>
            </>
        )
    }

    return(

        <>
        <main className="contenedor">
        <Breadscrumbs nombre={producto.nombre} categoria={nombreCategoria} categoriaId={producto.categoriaId}></Breadscrumbs>
        {/* key={producto.id}: si cambiamos de producto, React crea la galería de nuevo
            y la cantidad vuelve a 1 (si no, se quedaría con la del producto anterior) */}
        <GaleriaImagenes
            key={producto.id}
            producto={producto}
            nombreProveedor={productor ? productor.nombre : ""}
            nombreCategoria={nombreCategoria}
            onAgregarAlCarrito={onAgregarAlCarrito}
        ></GaleriaImagenes>
        <PestañasIngredientes
            descripcion={producto.descripcion}
            ingredientes={producto.ingredientes}
            conservacion={producto.tipoConservacion}
        ></PestañasIngredientes>
        {/* Solo mostramos "Conoce a..." si llegó el productor */}
        {productor && <TarjetaProductor productor={productor}></TarjetaProductor>}
        <TarjetasReseñas></TarjetasReseñas>
        </main>
        <Footer></Footer>
        </>


    )
}

export {PaginaProducto}
