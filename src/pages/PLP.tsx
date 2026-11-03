// useState: para recordar datos (productos, proveedores, si está cargando, si hubo error, filtros abiertos).
// useEffect: para llamar a la API apenas se abre la página.
import { useEffect, useState } from "react"
// useSearchParams lee y cambia lo que va después del "?" en la dirección.
// Ej: en "/catalogo?productor=2&orden=precio-menor"
import { useSearchParams } from "react-router"
import { CabeceraCatalogo, TarjetaProductoApi } from "../components/catalogo/catalogo"
import { FiltrosCatalogo } from "../components/catalogo/filtros"
import { Encabezado } from "../components/Header/header"
import "../components/estilosPLP/estilosPLP.css"
import { Footer } from "../components/footer/footer"
import { URL_PRODUCTOS, URL_PROVEEDORES } from "../datos/api"
import type { ProductoApi, ProveedorApi } from "../datos/api"


function PaginaCatalogo() {
    // Los filtros y el orden NO viven en useState: viven en la dirección (la URL).
    // Así se mantienen al ir a un producto y volver atrás, y se pueden compartir con un link.
    const [parametros, setParametros] = useSearchParams()

    // Los valores de la URL siempre son texto ("1"), así que los pasamos a número.
    // getAll("productor") devuelve TODOS los valores con ese nombre. Ej: "?productor=1&productor=3" → [1, 3]
    const productoresElegidos = parametros.getAll("productor").map((id) => Number(id))

    // get("orden") devuelve un solo valor, o null si no está. Si no está, usamos "destacados".
    const orden = parametros.get("orden") || "destacados"

    // El panel de filtros abierto o cerrado. Esto sí es useState: no hace falta guardarlo en la URL.
    const [mostrarFiltros, setMostrarFiltros] = useState(true)

    // Datos que llegan de la API. Empiezan vacíos porque todavía no llegan.
    const [productos, setProductos] = useState<ProductoApi[]>([])
    const [proveedores, setProveedores] = useState<ProveedorApi[]>([])
    // true mientras esperamos a la API. Empieza en true: apenas se abre la página ya pedimos los datos.
    const [cargando, setCargando] = useState(true)
    // Mensaje de error si algo falla. "" = no hay error.
    const [error, setError] = useState("")

    // useEffect = "haz esto DESPUÉS de dibujar la página".
    // El [] del final significa: hazlo UNA sola vez, cuando la página se abre.
    useEffect(() => {
        // Para usar "await", la función debe estar marcada con "async".
        // useEffect no acepta "async" directo, por eso creamos la función adentro.
        async function cargarCatalogo() {
            try {                                             // "try" = intenta hacer todo esto...
                // 1) Pedimos los productos y esperamos la respuesta.
                const respuestaProductos = await fetch(URL_PRODUCTOS)
                // Si la respuesta no fue exitosa, lanzamos un error (saltamos directo al "catch").
                if (!respuestaProductos.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datosProductos = await respuestaProductos.json()  // texto JSON → datos

                // 2) Pedimos los proveedores (para el filtro y para el nombre en cada tarjeta).
                const respuestaProveedores = await fetch(URL_PROVEEDORES)
                if (!respuestaProveedores.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datosProveedores = await respuestaProveedores.json()

                // 3) Guardamos todo → React vuelve a dibujar la página.
                setProductos(datosProductos)
                setProveedores(datosProveedores)
            } catch (error) {
                // ...y si algo falla, entra aquí (la API está caída o no hay internet).
                console.error("Error:", error)
                setError("No pudimos cargar los productos. Intenta más tarde.")
            }
            setCargando(false)                                // 4) haya salido bien o mal, ya terminó de cargar
        }

        cargarCatalogo()                                      // la llamamos
    }, [])

    // Escribe en la URL los productores y el orden que le pasemos.
    // Las funciones de abajo la usan cada vez que algo cambia.
    function actualizarUrl(productores: number[], nuevoOrden: string) {
        const nuevos = new URLSearchParams()
        for (const id of productores) {
            nuevos.append("productor", String(id))  // la URL guarda texto, por eso String(id)
        }
        // "destacados" es el orden por defecto: no hace falta escribirlo en la URL.
        if (nuevoOrden !== "destacados") {
            nuevos.set("orden", nuevoOrden)
        }
        setParametros(nuevos)
    }

    // Marca o desmarca un productor (usamos su id):
    // si ya estaba en la lista, lo sacamos; si no estaba, lo agregamos.
    function cambiarProductor(id: number) {
        let nuevos
        if (productoresElegidos.includes(id)) {
            nuevos = productoresElegidos.filter((p) => p !== id)
        } else {
            nuevos = [...productoresElegidos, id]
        }
        actualizarUrl(nuevos, orden)
    }

    // Cambia el orden (lo llama el selector "Ordenar por").
    function cambiarOrden(nuevoOrden: string) {
        actualizarUrl(productoresElegidos, nuevoOrden)
    }

    // Desmarca todos los filtros, pero mantiene el orden elegido.
    function limpiarFiltros() {
        actualizarUrl([], orden)
    }

    // Busca el nombre del proveedor por su id. Si todavía no llega (o no existe), devuelve "".
    function nombreProveedor(id: number) {
        const proveedor = proveedores.find((p) => p.id === id)
        if (proveedor) {
            return proveedor.nombre
        }
        return ""
    }

    // 1) FILTRAR: nos quedamos solo con los productos de los productores marcados.
    // Si no hay ninguno marcado, el filtro no hace nada (deja pasar todo).
    const productosFiltrados = productos.filter((producto) => {
        return productoresElegidos.length === 0 || productoresElegidos.includes(producto.proveedorId)
    })

    // 2) ORDENAR: "sort" cambia la lista original, por eso primero hacemos una copia con [...].
    // sort recibe una función que compara dos productos (a y b):
    //   número negativo → a va primero · número positivo → b va primero
    const productosVisibles = [...productosFiltrados]
    if (orden === "precio-menor") {
        productosVisibles.sort((a, b) => a.precio - b.precio)
    } else if (orden === "precio-mayor") {
        productosVisibles.sort((a, b) => b.precio - a.precio)
    } else if (orden === "nombre") {
        // localeCompare compara textos en orden alfabético (respetando tildes y la ñ)
        productosVisibles.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    }
    // "destacados": se queda en el orden en que llegan de la API.

    // Título: si hay UN solo productor marcado, usamos su nombre.
    let titulo = "Todos los productos"
    if (productoresElegidos.length === 1 && nombreProveedor(productoresElegidos[0]) !== "") {
        titulo = nombreProveedor(productoresElegidos[0])
    }

    return(
    <>
    <Encabezado></Encabezado>
    <main className="contenedor">
    <CabeceraCatalogo
      titulo={titulo}
      cantidad={productosVisibles.length}
      orden={orden}
      onCambiarOrden={cambiarOrden}
      filtrosAbiertos={mostrarFiltros}
      onAlternarFiltros={() => setMostrarFiltros(!mostrarFiltros)}
    ></CabeceraCatalogo>
    {/* Si los filtros están cerrados, la grilla usa todo el ancho */}
    <div className={mostrarFiltros ? "contenedor-catalogo" : "contenedor-catalogo sin-filtros"}>
    {mostrarFiltros && (
      <FiltrosCatalogo
        proveedores={proveedores}
        productoresElegidos={productoresElegidos}
        onCambiarProductor={cambiarProductor}
        onLimpiar={limpiarFiltros}
      ></FiltrosCatalogo>
    )}
    <section className="grilla-productos" aria-label="Productos">
    {/* Mientras esperamos a la API mostramos un aviso */}
    {cargando && <p className="texto-muted">Cargando productos...</p>}
    {/* Si hubo error, mostramos el mensaje */}
    {error && <p className="texto-muted">{error}</p>}
    {/* Si ya cargó, no hubo error y ningún producto pasa los filtros, avisamos */}
    {!cargando && !error && productosVisibles.length === 0 && (
      <p className="texto-muted">No hay productos con esos filtros.</p>
    )}
    {/* Una tarjeta por cada producto que pasó los filtros, ya ordenados */}
    {productosVisibles.map((producto) => (
      <TarjetaProductoApi key={producto.id} producto={producto} nombreProveedor={nombreProveedor(producto.proveedorId)}></TarjetaProductoApi>
    ))}
    </section>
    </div>
    </main>
    <Footer></Footer>
    </>
    )
}

export {PaginaCatalogo}
