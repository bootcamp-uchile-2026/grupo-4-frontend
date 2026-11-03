// useState permite que la página recuerde qué plan se eligió.
// useEffect permite llamar a la API apenas se abre la página.
import { useEffect, useState } from "react"
// Link es como un <a>, pero cambia de página sin recargar el navegador.
import { Link } from "react-router"

// Componentes que arman la página. Cada uno es una parte de la pantalla.
import { Encabezado } from "../components/Header/header"                           // barra de navegación superior
import { TarjetaPlan } from "../components/suscripcion/tarjeta_plan"               // tarjeta de cada plan
import { CrearCuenta } from "../components/cuenta/crear_cuenta"                    // formulario "Crear cuenta"
import { ConfirmarSuscripcion } from "../components/suscripcion/confirmar_suscripcion" // botón de confirmar
import { Beneficios } from "../components/suscripcion/beneficios"                  // "Qué incluye"
import { Footer } from "../components/footer/footer"                               // pie de página
import { fechaEnDias } from "../datos/fechas"
import { planes } from "../datos/suscripcion"
import type { Plan, Suscripcion } from "../datos/suscripcion"
import type { Usuario } from "../datos/usuario"

// Dirección de la API de suscripciones (la que se ve en Swagger).
const URL_SUSCRIPCIONES = "http://3.144.233.145:3001/suscripciones"

// Forma de cada suscripción que devuelve la API (copiada de Swagger).
type SuscripcionApi = {
    id: string
    nombre: string
    descripcion: string
    precio: number
    productosId: string[]
    activa: boolean       // false = el plan está deshabilitado
}

// La página recibe desde App.tsx el usuario, la suscripción y las funciones para cambiarlos.
type SuscripcionPageProps = {
    usuario: Usuario | null                            // null = no ha creado cuenta
    suscripcion: Suscripcion | null                    // null = no está suscrito
    onCuentaCreada: (usuario: Usuario) => void         // guarda el usuario nuevo en App
    onSuscribirse: (suscripcion: Suscripcion) => void  // guarda la suscripción en App
}

function SuscripcionPage({ usuario, suscripcion, onCuentaCreada, onSuscribirse }: SuscripcionPageProps){
    // El plan que apretó el usuario. Empieza en null (todavía no elige).
    const [planElegido, setPlanElegido] = useState<Plan | null>(null)

    // true justo después de confirmar, para mostrar el mensaje de éxito.
    const [recienSuscrito, setRecienSuscrito] = useState(false)

    // Los planes que se muestran. Empiezan siendo los locales (los de siempre),
    // y se reemplazan por los de la API cuando lleguen.
    const [listaPlanes, setListaPlanes] = useState<Plan[]>(planes)
    // true mientras esperamos a la API. Empieza en true: apenas se abre la página ya pedimos los planes.
    const [cargando, setCargando] = useState(true)
    // Mensaje de error si la API falla. "" = sin error.
    const [error, setError] = useState("")

    // useEffect = "haz esto DESPUÉS de dibujar la página".
    // El [] del final significa: hazlo UNA sola vez, cuando la página se abre.
    useEffect(() => {
        // Para usar "await", la función debe estar marcada con "async".
        // useEffect no acepta "async" directo, por eso creamos la función adentro.
        async function cargarPlanesApi() {
            try {                                         // "try" = intenta hacer todo esto...
                const respuesta = await fetch(URL_SUSCRIPCIONES)  // 1) le pedimos los datos a la API y esperamos la respuesta
                // Si la respuesta no fue exitosa, lanzamos un error (saltamos directo al "catch").
                if (!respuesta.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datos: SuscripcionApi[] = await respuesta.json()  // 2) convertimos el texto JSON a datos de JavaScript

                // 3) "Traducimos" los datos de la API al formato Plan que usan nuestras tarjetas.
                const traducidos: Plan[] = datos
                    .filter((s) => s.activa)              // filter: nos quedamos solo con los planes activos
                    .map((s) => ({                        // map: armamos un Plan por cada uno
                        id: s.id,
                        nombre: s.nombre,
                        descripcion: s.descripcion,
                        precio: s.precio,
                        destacado: false,                 // la API no dice cuál es el destacado
                    }))
                setListaPlanes(traducidos)                // 4) mostramos los planes nuevos
                // Si alcanzó a elegir un plan local antes de que llegara la API, ya no está en pantalla: lo olvidamos.
                setPlanElegido(null)
            } catch (error) {
                // ...y si algo falla, entra aquí: no hay internet o la API está caída.
                console.error("Error:", error)
                setError("No pudimos cargar los planes. Se muestran los planes de siempre.")
            }
            setCargando(false)                            // haya salido bien o mal, ya terminó de cargar
        }

        cargarPlanesApi()                                 // la llamamos
    }, [])

    // Al apretar "Elegir" en una tarjeta.
    function elegirPlan(plan: Plan) {
        setPlanElegido(plan)
        setRecienSuscrito(false)
    }

    // Al apretar "Confirmar suscripción".
    function confirmar(plan: Plan) {
        const nuevaSuscripcion: Suscripcion = {
            plan: plan,
            proximaCaja: fechaEnDias(7) + " – " + fechaEnDias(9),  // la primera caja llega en 7 a 9 días
            proximoCobro: fechaEnDias(30),                          // se cobra cada 30 días
        }
        onSuscribirse(nuevaSuscripcion)  // App la guarda
        setRecienSuscrito(true)
    }

    return(
        <>
        <Encabezado></Encabezado>

        <main className="contenedor">
          <section className="titulo-suscripcion">
            <p className="texto-eyebrow">Suscripción</p>
            <h1>Elige tu caja mensual</h1>
            <p>Cada mes, productos artesanales seleccionados para ti.</p>
          </section>

          {/* Mientras esperamos a la API mostramos un aviso */}
          {cargando && <p className="texto-muted">Cargando planes...</p>}
          {/* Si hubo error, mostramos el mensaje */}
          {error && <p className="texto-muted">{error}</p>}

          {/* Una tarjeta por cada plan de la lista (locales o de la API) */}
          <section className="contenedor-tarjetas-suscripcion">
            {listaPlanes.map((plan) => (
              <TarjetaPlan
                key={plan.id}
                plan={plan}
                // "?." revisa primero que suscripcion no sea null antes de leer .plan
                esActual={suscripcion?.plan.id === plan.id}
                onElegir={() => elegirPlan(plan)}
              ></TarjetaPlan>
            ))}
          </section>

          {/* Debajo de las tarjetas mostramos UNO de estos 3 pasos */}
          <div className="paso-suscripcion">
            {/* PASO 3: ya confirmó → mensaje de éxito */}
            {recienSuscrito && suscripcion && (
              <div className="tarjeta-base confirmar-suscripcion">
                <h2>¡Listo! Ya tienes el plan {suscripcion.plan.nombre} 🎉</h2>
                <p>Tu primera caja llega entre el {suscripcion.proximaCaja}.</p>
                <Link to="/cuenta" className="boton boton-primario boton-bloque">Ver mi suscripción en Mi cuenta</Link>
              </div>
            )}

            {/* PASO 1: eligió plan pero no tiene cuenta → crear cuenta */}
            {!recienSuscrito && planElegido && !usuario && (
              <CrearCuenta
                titulo={"Crea tu cuenta para suscribirte al plan " + planElegido.nombre}
                onCuentaCreada={onCuentaCreada}
              ></CrearCuenta>
            )}

            {/* PASO 2: eligió plan y tiene cuenta → confirmar */}
            {!recienSuscrito && planElegido && usuario && (
              <ConfirmarSuscripcion
                plan={planElegido}
                usuario={usuario}
                onConfirmar={() => confirmar(planElegido)}
              ></ConfirmarSuscripcion>
            )}
          </div>

          <Beneficios></Beneficios>
        </main>

        <Footer></Footer>
        </>
    )
}

export {SuscripcionPage}
