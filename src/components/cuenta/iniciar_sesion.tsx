// RESUMEN: formulario "Inicia sesión" (email y contraseña).
// Al enviarlo llama a iniciarSesion (api.ts), que pide el token y los datos a la API,
// y le entrega el usuario a App. Sirve para todos los roles: CLIENTE, ADMIN y PROVEEDOR.
import { useState } from "react"
import { iniciarSesion } from "../../datos/api"
import type { Usuario } from "../../datos/usuario"
import "../estilos/estilos.css"
import "../checkout/checkout.css"

type IniciarSesionProps = {
    onSesionIniciada: (usuario: Usuario) => void   // le entrega el usuario a App
    onIrACrearCuenta: () => void                   // cambia al formulario "Crear cuenta"
}

function IniciarSesion({ onSesionIniciada, onIrACrearCuenta }: IniciarSesionProps) {
    // Un estado por cada campo del formulario.
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // true mientras esperamos a la API (para apagar el botón y no enviar dos veces).
    const [enviando, setEnviando] = useState(false)
    // Mensaje de error para mostrar en pantalla. "" = no hay error.
    const [mensaje, setMensaje] = useState("")

    // Se ejecuta al apretar "Ingresar". Es async porque espera a la API.
    async function enviarFormulario(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault()   // evita que el navegador recargue la página
        setEnviando(true)
        setMensaje("")
        try {
            const usuario = await iniciarSesion(email, password)
            onSesionIniciada(usuario)   // App guarda el usuario y la página muestra "Hola, ..."
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos ingresar. " + error)
        }
        setEnviando(false)
    }

    return (
        <div className="tarjeta-base seccion-registro">
            <h2>Inicia sesión</h2>
            <form onSubmit={enviarFormulario}>
                <div className="campo-form">
                    <label htmlFor="login-email">Correo electrónico</label>
                    <input id="login-email" type="email" className="campo" placeholder="tu@email.com" required
                        value={email} onChange={(evento) => setEmail(evento.target.value)} />
                </div>

                <div className="campo-form">
                    <label htmlFor="login-password">Contraseña</label>
                    <input id="login-password" type="password" className="campo" required
                        value={password} onChange={(evento) => setPassword(evento.target.value)} />
                </div>

                <button type="submit" className="boton boton-primario boton-lg boton-bloque" disabled={enviando}>
                    {enviando ? "Ingresando..." : "Ingresar"}
                </button>
            </form>

            {/* Solo se muestra si hay un error */}
            {mensaje && <p className="texto-muted">{mensaje}</p>}

            <p className="texto-login-link">
                ¿No tienes cuenta?{" "}
                {/* Es un botón (no un enlace) porque no cambia de página: solo cambia el formulario */}
                <button type="button" className="enlace-texto boton-como-enlace" onClick={onIrACrearCuenta}>Crea una</button>
            </p>
        </div>
    )
}

export {IniciarSesion}
