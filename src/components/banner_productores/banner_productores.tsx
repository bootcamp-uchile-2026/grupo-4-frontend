// RESUMEN: "Productores destacados" del Home: pide los productores a la API y muestra una tarjeta por cada uno.
import "../estilos/estilos.css"
import "../Header/header.css"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { URL_PROVEEDORES } from "../../datos/api"
import type { ProveedorApi } from "../../datos/api"
import { TarjetaProductorResumen } from "../productores/tarjeta_productor_resumen"

function ProductoresBanner() {
    // Productores que llegan de la API. Empieza vacía.
    const [productores, setProductores] = useState<ProveedorApi[]>([])

    useEffect(() => {
        async function cargarProductores() {
            try {
                const respuesta = await fetch(URL_PROVEEDORES)
                if (!respuesta.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datos = await respuesta.json()
                setProductores(datos)
            } catch (error) {
                // Si falla, la sección queda vacía (el resto del Home sigue funcionando).
                console.error("Error:", error)
            }
        }
        cargarProductores()
    }, [])

    // Si todavía no llegan (o la API falló), no dibujamos la sección.
    if (productores.length === 0) {
        return null
    }

    return(
        <section className="contenedor seccion">
      <div className="cabecera-seccion">
        <h2>Productores destacados</h2>
        <Link to="/productores" className="enlace-texto">Ver todos</Link>
      </div>
      <div className="grilla-productores">
        {productores.map((productor) => (
          <TarjetaProductorResumen key={productor.id} productor={productor} conDescripcion={false}></TarjetaProductorResumen>
        ))}
      </div>
    </section>

    )
}

export {ProductoresBanner}
