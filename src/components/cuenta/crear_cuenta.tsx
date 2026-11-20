// RESUMEN: formulario "Crear cuenta".
// Al enviarlo crea la cuenta en la API (POST /registro, siempre queda con rol CLIENTE),
// después inicia sesión solo (iniciarSesion) y le entrega el usuario a App.
import { useState } from "react"
import { URL_REGISTRO, iniciarSesion } from "../../datos/api"
import type { Usuario } from "../../datos/usuario"
import "../estilos/estilos.css"
// Los estilos del formulario (campos, separador, botones sociales) están en checkout.css.
import "../checkout/checkout.css"

type CrearCuentaProps = {
    titulo: string                              // texto de arriba, cambia según la página
    onCuentaCreada: (usuario: Usuario) => void  // le entrega el usuario nuevo a App
    onIrAIniciarSesion: () => void              // cambia al formulario "Iniciar sesión"
}

// Se usa en 3 lugares (Checkout, Suscripción y Mi cuenta), a través de AccesoCuenta.
// Por eso recibe el título como prop: así cada página puede poner su propio texto.
function CrearCuenta({ titulo, onCuentaCreada, onIrAIniciarSesion }: CrearCuentaProps) {
    // Un estado por cada campo del formulario (la API pide todos).
    const [nombre, setNombre] = useState("")
    const [apellido, setApellido] = useState("")
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [password, setPassword] = useState("")
    const [confirmarPassword, setConfirmarPassword] = useState("")

    // true = la contraseña se ve, false = se ve con puntitos.
    const [mostrarPassword, setMostrarPassword] = useState(false)
    // true mientras esperamos a la API (para apagar el botón y no enviar dos veces).
    const [enviando, setEnviando] = useState(false)
    // Mensaje de error para mostrar en pantalla. "" = no hay error.
    const [mensaje, setMensaje] = useState("")

    // Cambia entre mostrar y ocultar la contraseña.
    function alternarPassword() {
        setMostrarPassword(!mostrarPassword)
    }

    // Se ejecuta al apretar "Crear cuenta". Es async porque espera a la API.
    async function enviarFormulario(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault()  // evita que el navegador recargue la página

        // Revisamos antes de enviar: así no esperamos a la API para algo obvio.
        if (password !== confirmarPassword) {
            setMensaje("Las contraseñas no coinciden.")
            return
        }

        setEnviando(true)
        setMensaje("")
        try {
            // 1) Creamos la cuenta. No enviamos rol: la API siempre la deja como CLIENTE.
            const respuesta = await fetch(URL_REGISTRO, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nombre,
                    apellido: apellido,
                    email: email,
                    telefono: telefono,
                    password: password,
                    confirmarPassword: confirmarPassword,
                }),
            })
            // 409 = "conflicto": ya hay una cuenta con ese email.
            if (respuesta.status === 409) {
                throw new Error("Ya existe una cuenta con ese email")
            }
            if (!respuesta.ok) {
                const datosError = await respuesta.json()
                throw new Error("Error " + respuesta.status + ": " + datosError.message)
            }

            // 2) Cuenta creada: iniciamos sesión de inmediato para obtener el token.
            const usuario = await iniciarSesion(email, password)
            onCuentaCreada(usuario)   // App guarda el usuario y la página muestra "Hola, ..."
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos crear tu cuenta. " + error)
        }
        setEnviando(false)
    }

    return(
      <div className="tarjeta-base seccion-registro">
        <h2>{titulo}</h2>
        <form onSubmit={enviarFormulario}>
          <div className="campo-form">
            <label htmlFor="cuenta-nombre">Nombre</label>
            <input id="cuenta-nombre" type="text" className="campo" required
              value={nombre} onChange={(evento) => setNombre(evento.target.value)} />
          </div>

          <div className="campo-form">
            <label htmlFor="cuenta-apellido">Apellido</label>
            <input id="cuenta-apellido" type="text" className="campo" required
              value={apellido} onChange={(evento) => setApellido(evento.target.value)} />
          </div>

          <div className="campo-form">
            <label htmlFor="cuenta-email">Correo electrónico</label>
            <input id="cuenta-email" type="email" className="campo" placeholder="tu@email.com" required
              value={email} onChange={(evento) => setEmail(evento.target.value)} />
          </div>

          <div className="campo-form">
            <label htmlFor="cuenta-telefono">Teléfono</label>
            {/* type="tel": en el celular abre el teclado de números */}
            <input id="cuenta-telefono" type="tel" className="campo" placeholder="+56912345678" required
              value={telefono} onChange={(evento) => setTelefono(evento.target.value)} />
          </div>

          <div className="campo-form">
            <label htmlFor="cuenta-password">Contraseña (mínimo 8 caracteres)</label>
            <div className="contenedor-password">
              {/* Si mostrarPassword es true el input es "text" (se lee), si no es "password" */}
              <input id="cuenta-password" type={mostrarPassword ? "text" : "password"} className="campo" required minLength={8}
                value={password} onChange={(evento) => setPassword(evento.target.value)} />
              <button
                type="button"
                className="boton boton-terciario boton-icono boton-sm icono-revelar"
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={alternarPassword}
              >
                👁
              </button>
            </div>
          </div>

          <div className="campo-form">
            <label htmlFor="cuenta-confirmar">Repetir contraseña</label>
            <input id="cuenta-confirmar" type={mostrarPassword ? "text" : "password"} className="campo" required minLength={8}
              value={confirmarPassword} onChange={(evento) => setConfirmarPassword(evento.target.value)} />
          </div>

          <button type="submit" className="boton boton-primario boton-lg boton-bloque" disabled={enviando}>
            {enviando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Solo se muestra si hay un error */}
        {mensaje && <p className="texto-muted">{mensaje}</p>}

        <div className="separador-o">
          <span>O continuar con</span>
        </div>

        <div className="botones-sociales">
          <a href="#google" className="boton boton-secundario">G Google</a>
          <a href="#apple" className="boton boton-secundario"> Apple</a>
          <a href="#facebook" className="boton boton-secundario">f Facebook</a>
        </div>

        <p className="texto-login-link">
          ¿Ya tienes cuenta?{" "}
          {/* Es un botón (no un enlace) porque no cambia de página: solo cambia el formulario */}
          <button type="button" className="enlace-texto boton-como-enlace" onClick={onIrAIniciarSesion}>Inicia sesión</button>
        </p>
      </div>
    )
}

export {CrearCuenta}
