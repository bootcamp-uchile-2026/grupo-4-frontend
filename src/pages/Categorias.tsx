// useState: para recordar la lista de categorías, si está cargando y si hubo error.
// useEffect: para llamar a la API apenas se abre la página.
import { useEffect, useState } from "react"
import { Encabezado } from "../components/Header/header"
import { Footer } from "../components/footer/footer"
import { CrearCategoria } from "../components/categorias/crear_categoria"
import { URL_CATEGORIAS, leerJson } from "../datos/api"
import type { CategoriaApi } from "../datos/api"
import "../components/Header/header.css"

// Página /categorias: muestra las categorías de la API y permite crear nuevas.
function PaginaCategorias() {
    // Categorías que llegan de la API. Empieza vacía: todavía no llegan.
    const [categorias, setCategorias] = useState<CategoriaApi[]>([])
    // true mientras esperamos a la API. Empieza en true: apenas se abre la página ya pedimos los datos.
    const [cargando, setCargando] = useState(true)
    // Mensaje de error si la API falla. "" = sin error.
    const [error, setError] = useState("")

    // Al abrir la página, pedimos la lista (GET).
    // El [] del final significa: hazlo UNA sola vez, cuando la página se abre.
    useEffect(() => {
        async function cargarCategorias() {
            try {                                         // "try" = intenta hacer todo esto...
                const respuesta = await fetch(URL_CATEGORIAS)   // 1) le pedimos los datos a la API
                if (!respuesta.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datos = await leerJson(respuesta)      // 2) texto JSON → datos
                setCategorias(datos)                      // 3) guardamos la lista → React la dibuja
            } catch (error) {
                // ...y si algo falla, entra aquí: no hay internet o la API está caída.
                console.error("Error:", error)
                setError("No pudimos cargar las categorías. Intenta más tarde.")
            }
            setCargando(false)                            // 4) haya salido bien o mal, ya terminó de cargar
        }

        cargarCategorias()                                // la llamamos
    }, [])

    // La llama el formulario cuando la API confirma que creó una categoría.
    // Copiamos la lista con [...] y agregamos la nueva al final (sin modificar la original).
    function agregarCategoria(categoriaNueva: CategoriaApi) {
        setCategorias([...categorias, categoriaNueva])
    }

    return (
        <>
        <Encabezado></Encabezado>
        <main className="contenedor">
            <h1>Categorías</h1>

            <CrearCategoria onCategoriaCreada={agregarCategoria}></CrearCategoria>

            {cargando && <p className="texto-muted">Cargando categorías...</p>}
            {error && <p className="texto-muted">{error}</p>}
            {/* Si ya cargó, no hubo error y la lista está vacía, avisamos */}
            {!cargando && !error && categorias.length === 0 && (
                <p className="texto-muted">Todavía no hay categorías.</p>
            )}

            <ul>
                {categorias.map((categoria) => (
                    <li key={categoria.id}>{categoria.id} — {categoria.nombre}</li>
                ))}
            </ul>
        </main>
        <Footer></Footer>
        </>
    )
}

export {PaginaCategorias}
