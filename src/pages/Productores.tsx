// RESUMEN: página /productores: pide los productores a la API y muestra una tarjeta por cada uno
// (cada tarjeta lleva al perfil del productor).

// useState permite que la página recuerde datos (la lista de la API, si está cargando, si hubo error).
// useEffect permite llamar a la API apenas se abre la página.
import { useEffect, useState } from "react"
// Componentes que arman la página. Cada uno es una parte de la pantalla.
import { TarjetaProductorResumen } from "../components/productores/tarjeta_productor_resumen" // tarjeta de cada productor
import { Footer } from "../components/footer/footer"                                      // pie de página
import { URL_PROVEEDORES } from "../datos/api"          // dirección de la API de proveedores
import type { ProveedorApi } from "../datos/api"        // forma de cada proveedor de la API
import "../components/Header/header.css"
import "../components/productores/productores.css"

// Página /productores: lista de todos los productores.
function PaginaProductores() {
    // Proveedores que llegan de la API. Empieza vacía: todavía no llegan.
    const [proveedores, setProveedores] = useState<ProveedorApi[]>([])
    // true mientras esperamos la respuesta. Empieza en true: apenas se abre la página ya pedimos los datos.
    const [cargando, setCargando] = useState(true)
    // Mensaje de error si la API falla. "" = sin error.
    const [error, setError] = useState("")

    // useEffect = "haz esto DESPUÉS de dibujar la página".
    // El [] del final significa: hazlo UNA sola vez, cuando la página se abre.
    useEffect(() => {
        // Para usar "await", la función debe estar marcada con "async".
        // useEffect no acepta "async" directo, por eso creamos la función adentro.
        async function cargarProveedores() {
            try {                                         // "try" = intenta hacer todo esto...
                const respuesta = await fetch(URL_PROVEEDORES)  // 1) le pedimos los datos a la API y esperamos la respuesta
                // Si la respuesta no fue exitosa, lanzamos un error (saltamos directo al "catch").
                if (!respuesta.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datos = await respuesta.json()      // 2) convertimos el texto JSON a datos de JavaScript
                setProveedores(datos)                     // 3) guardamos la lista → React dibuja las tarjetas
            } catch (error) {
                // ...y si algo falla, entra aquí: no hay internet o la API está caída.
                console.error("Error:", error)
                setError("No pudimos cargar los productores. Intenta más tarde.")
            }
            setCargando(false)                            // 4) haya salido bien o mal, ya terminó de cargar
        }

        cargarProveedores()                               // la llamamos
    }, [])

    return(
        <>

        <main className="contenedor">
          <section className="titulo-productores">
            <p className="texto-eyebrow">Productores</p>
            <h1>Conoce a quienes hacen tus productos</h1>
            <p>Productores locales que elaboran cada producto a mano y en pequeñas cantidades.</p>
          </section>

          {/* Mientras esperamos a la API mostramos un aviso */}
          {cargando && <p className="texto-muted">Cargando productores...</p>}

          {/* Si hubo error, mostramos el mensaje */}
          {error && <p className="texto-muted">{error}</p>}

          <div className="grilla-productores">
            {/* Una tarjeta por productor. conDescripcion={true}: aquí sí mostramos su descripción.
                Si la lista está vacía, map no dibuja nada. */}
            {proveedores.map((proveedor) => (
              <TarjetaProductorResumen key={proveedor.id} productor={proveedor} conDescripcion={true}></TarjetaProductorResumen>
            ))}
          </div>
        </main>

        <Footer></Footer>
        </>
    )
}

export {PaginaProductores}
