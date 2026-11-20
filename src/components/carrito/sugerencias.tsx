// RESUMEN: "También te puede interesar" en el carrito.
// Pide los productos a la API y muestra hasta 4 que tengan foto (cada uno lleva a su ficha).
import "../estilos/estilos.css"
import "./carrito.css"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { URL_PRODUCTOS, fotoPrincipal } from "../../datos/api"
import type { ProductoApi } from "../../datos/api"

function Sugerencias() {
    // Los productos que llegan de la API. Empieza vacía.
    const [productos, setProductos] = useState<ProductoApi[]>([])

    useEffect(() => {
        async function cargarSugerencias() {
            try {
                const respuesta = await fetch(URL_PRODUCTOS)
                if (!respuesta.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datos: ProductoApi[] = await respuesta.json()
                // Solo los que tienen foto ("" cuenta como falso), y máximo 4.
                const conFoto = datos.filter((producto) => fotoPrincipal(producto))
                setProductos(conFoto.slice(0, 4))
            } catch (error) {
                // Si falla, la sección queda vacía (el carrito sigue funcionando).
                console.error("Error:", error)
            }
        }
        cargarSugerencias()
    }, [])

    // Si no hay sugerencias con foto, no dibujamos la sección.
    if (productos.length === 0) {
        return null
    }

    return(
      <section className="seccion-interes">
        <h2>También te puede interesar</h2>
        <div className="grid-sugerencias">
          {productos.map((producto) => (
            <Link key={producto.id} to={`/producto/${producto.id}`} className="imagen-placeholder tarjeta-sugerencia">
              <img src={fotoPrincipal(producto)} alt={producto.nombre} />
            </Link>
          ))}
        </div>
      </section>
    )
}

export {Sugerencias}
