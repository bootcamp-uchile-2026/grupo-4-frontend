// useState permite que la página recuerde qué plan se eligió.
import { useState } from "react"
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

    // Los planes que se muestran. Empiezan siendo los locales (los de siempre).
    const [listaPlanes, setListaPlanes] = useState<Plan[]>(planes)
    // true mientras esperamos a la API. Empieza en false: nadie ha apretado el botón aún.
    const [cargando, setCargando] = useState(false)
    // Mensaje de error si la API falla. "" = sin error.
    const [error, setError] = useState("")

    // Se ejecuta SOLO al apretar el botón "Ver planes desde la API".
    function cargarPlanesApi() {
        setCargando(true)   // mostramos "Cargando..." y bloqueamos el botón
        setError("")        // borramos un error anterior, si lo había

        fetch(URL_SUSCRIPCIONES)                      // 1) le pedimos los datos a la API
            .then((respuesta) => {
                // respuesta.ok es true si el servidor respondió bien (código 200 a 299).
                if (!respuesta.ok) {
                    throw new Error("Error " + respuesta.status)  // saltamos directo al .catch
                }
                return respuesta.json()               // 2) convertimos el texto JSON a datos de JavaScript
            })
            .then((datos: SuscripcionApi[]) => {
                // 3) "Traducimos" los datos de la API al formato Plan que usan nuestras tarjetas.
                const traducidos: Plan[] = datos
                    .filter((s) => s.activa)          // filter: nos quedamos solo con los planes activos
                    .map((s) => ({                    // map: armamos un Plan por cada uno
                        id: s.id,
                        nombre: s.nombre,
                        descripcion: s.descripcion,
                        precio: s.precio,
                        destacado: false,             // la API no dice cuál es el destacado
                    }))
                setListaPlanes(traducidos)            // 4) mostramos los planes nuevos
                // Si había un plan elegido de la lista anterior, ya no está en pantalla: lo olvidamos.
                setPlanElegido(null)
            })
            .catch(() => {
                // Entra aquí si no hay internet, la API está caída o hubo un error arriba.
                setError("No pudimos cargar los planes. Se muestran los planes de siempre.")
            })
            .finally(() => {
                setCargando(false)                    // haya salido bien o mal, ya terminó de cargar
            })
    }

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

          {/* onClick = qué hacer al apretar. disabled = no se puede apretar mientras carga */}
          <button type="button" className="boton boton-secundario" onClick={cargarPlanesApi} disabled={cargando}>
            {cargando ? "Cargando..." : "Ver planes desde la API"}
          </button>
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
