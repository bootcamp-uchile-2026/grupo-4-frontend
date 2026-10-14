// useState permite que la página recuerde datos (la lista de la API, si está cargando, si hubo error).
import { useState } from "react"
// Componentes que arman la página. Cada uno es una parte de la pantalla.
import { Encabezado } from "../components/Header/header"                                  // barra de navegación superior
import { TarjetaProductorResumen } from "../components/productores/tarjeta_productor_resumen" // tarjeta de cada productor
import { Footer } from "../components/footer/footer"                                      // pie de página
import { productores } from "../datos/productores"
import "../components/Header/header.css"
import "../components/productores/productores.css"

// Dirección de la API de proveedores (la que se ve en Swagger).
const URL_PROVEEDORES = "http://3.144.233.145:3001/proveedores"

// Forma de cada proveedor que devuelve la API (copiada de Swagger).
type ProveedorApi = {
    id: number
    nombre: string
    descripcion: string
    email: string
    telefono: string
}

// Página /productores: lista de todos los productores.
function PaginaProductores() {
    // Proveedores que llegan de la API. Empieza vacía: nadie ha apretado el botón aún.
    const [proveedores, setProveedores] = useState<ProveedorApi[]>([])
    // true mientras esperamos la respuesta. Empieza en false.
    const [cargando, setCargando] = useState(false)
    // Mensaje de error si la API falla. "" = sin error.
    const [error, setError] = useState("")
    // true = las tarjetas de la API se ven · false = están ocultas (pero los datos siguen guardados).
    const [mostrarApi, setMostrarApi] = useState(true)

    // Se ejecuta SOLO al apretar el botón "Ver productores desde la API".
    function cargarProveedores() {
        setCargando(true)   // mostramos "Cargando..." y bloqueamos el botón
        setError("")        // borramos un error anterior, si lo había

        fetch(URL_PROVEEDORES)                        // 1) le pedimos los datos a la API
            .then((respuesta) => {
                // respuesta.ok es true si el servidor respondió bien (código 200 a 299).
                if (!respuesta.ok) {
                    throw new Error("Error " + respuesta.status)  // saltamos directo al .catch
                }
                return respuesta.json()               // 2) convertimos el texto JSON a datos de JavaScript
            })
            .then((datos: ProveedorApi[]) => {
                setProveedores(datos)                 // 3) guardamos la lista → React dibuja las tarjetas
                setMostrarApi(true)                   // y nos aseguramos de que se vean
            })
            .catch(() => {
                // Entra aquí si no hay internet, la API está caída o hubo un error arriba.
                setError("No pudimos cargar los productores. Intenta más tarde.")
            })
            .finally(() => {
                setCargando(false)                    // 4) haya salido bien o mal, ya terminó de cargar
            })
    }

    // Lo que hace el botón depende de si ya tenemos los datos o no.
    function manejarBoton() {
        if (proveedores.length === 0) {
            cargarProveedores()            // primera vez (o si falló antes): pedimos a la API
        } else {
            setMostrarApi(!mostrarApi)     // ya los tenemos: solo mostramos u ocultamos (sin volver a llamar)
        }
    }

    // Texto del botón según la situación. Lo armamos aquí para que el JSX quede más simple.
    let textoBoton = "Ver productores desde la API"
    if (cargando) {
        textoBoton = "Cargando..."
    } else if (proveedores.length > 0 && mostrarApi) {
        textoBoton = "Ocultar productores de la API"
    } else if (proveedores.length > 0 && !mostrarApi) {
        textoBoton = "Mostrar productores de la API"
    }

    return(
        <>
        <Encabezado></Encabezado>

        <main className="contenedor">
          <section className="titulo-productores">
            <p className="texto-eyebrow">Productores</p>
            <h1>Conoce a quienes hacen tus productos</h1>
            <p>Productores locales que elaboran cada producto a mano y en pequeñas cantidades.</p>
          </section>

          <div className="grilla-productores">
            {/* conDescripcion={true}: aquí sí mostramos la frase corta de cada uno */}
            {productores.map((productor) => (
              <TarjetaProductorResumen key={productor.id} productor={productor} conDescripcion={true}></TarjetaProductorResumen>
            ))}
          </div>

          {/* ===== Productores desde la API ===== */}
          <section className="seccion-api-productores">
            {/* onClick = qué hacer al apretar. disabled = no se puede apretar mientras carga */}
            {/* aria-expanded le dice a los lectores de pantalla si las tarjetas están visibles */}
            <button type="button" className="boton boton-secundario" onClick={manejarBoton} disabled={cargando}
              aria-expanded={proveedores.length > 0 && mostrarApi}>
              {textoBoton}
            </button>

            {/* Si hubo error, mostramos el mensaje */}
            {error && <p className="texto-muted">{error}</p>}

            {/* Usamos la misma grilla y el mismo estilo de tarjeta que arriba, para que se vean iguales.
                Si la lista está vacía, map no dibuja nada.
                mostrarApi && (...) = la grilla solo se dibuja si mostrarApi es true. */}
            {mostrarApi && (
            <div className="grilla-productores">
              {proveedores.map((proveedor) => (
                // <article> y no <Link>: estos productores aún no tienen página propia en nuestro sitio.
                <article key={proveedor.id} className="tarjeta-base tarjeta-productor">
                  {/* La primera letra del nombre como avatar, igual que en las tarjetas de arriba */}
                  <div className="imagen-placeholder avatar-productor" aria-hidden="true">{proveedor.nombre[0]}</div>
                  <div>
                    <h3>{proveedor.nombre}</h3>
                    <p className="descripcion-productor">{proveedor.descripcion}</p>
                    {/* mailto: abre el programa de correo · tel: abre el marcador en el celular */}
                    <p className="productor"><a href={"mailto:" + proveedor.email}>{proveedor.email}</a></p>
                    <p className="productor"><a href={"tel:" + proveedor.telefono}>{proveedor.telefono}</a></p>
                  </div>
                </article>
              ))}
            </div>
            )}
          </section>
        </main>

        <Footer></Footer>
        </>
    )
}

export {PaginaProductores}
