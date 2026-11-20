// RESUMEN: muestra "Crear cuenta" o "Iniciar sesión" y permite cambiar entre los dos.
// Las páginas (Mi cuenta, Checkout y Suscripción) usan este componente en vez de CrearCuenta,
// así todas tienen el mismo ingreso conectado a la API.
import { useState } from "react"
import { CrearCuenta } from "./crear_cuenta"
import { IniciarSesion } from "./iniciar_sesion"
import type { Usuario } from "../../datos/usuario"

type AccesoCuentaProps = {
    titulo: string                              // título del formulario "Crear cuenta"
    modoInicial: string                         // con qué formulario partir: "crear" o "ingresar"
    onCuentaCreada: (usuario: Usuario) => void  // le entrega el usuario a App
}

function AccesoCuenta({ titulo, modoInicial, onCuentaCreada }: AccesoCuentaProps) {
    // Qué formulario se ve: "crear" o "ingresar".
    const [modo, setModo] = useState(modoInicial)

    if (modo === "ingresar") {
        return (
            <IniciarSesion
                onSesionIniciada={onCuentaCreada}
                onIrACrearCuenta={() => setModo("crear")}
            ></IniciarSesion>
        )
    }

    return (
        <CrearCuenta
            titulo={titulo}
            onCuentaCreada={onCuentaCreada}
            onIrAIniciarSesion={() => setModo("ingresar")}
        ></CrearCuenta>
    )
}

export {AccesoCuenta}
