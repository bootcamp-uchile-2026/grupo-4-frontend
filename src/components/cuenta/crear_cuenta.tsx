import { useState } from "react"
import type { Usuario } from "../../datos/usuario"
import "../estilos/estilos.css"
// Los estilos del formulario (campos, separador, botones sociales) están en checkout.css.
import "../checkout/checkout.css"

type CrearCuentaProps = {
    titulo: string                              // texto de arriba, cambia según la página
    onCuentaCreada: (usuario: Usuario) => void  // le entrega el usuario nuevo a App
}

// Formulario para crear una cuenta.
// Se usa en 3 lugares: Checkout, Suscripción y Mi cuenta.
// Por eso recibe el título como prop: así cada página puede poner su propio texto.
function CrearCuenta({ titulo, onCuentaCreada }: CrearCuentaProps) {
    // Un estado por cada campo del formulario.
    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // true = la contraseña se ve, false = se ve con puntitos.
    const [mostrarPassword, setMostrarPassword] = useState(false)

    // Cambia entre mostrar y ocultar la contraseña.
    function alternarPassword() {
        setMostrarPassword(!mostrarPassword)
    }

    // Se ejecuta al apretar "Crear cuenta".
    function enviarFormulario(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault()  // evita que el navegador recargue la página
        // Le pasamos a App solo el nombre y el email.
        // La contraseña la enviaremos al backend cuando exista.
        onCuentaCreada({ nombre: nombre, email: email })
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
            <label htmlFor="cuenta-email">Correo electrónico</label>
            <input id="cuenta-email" type="email" className="campo" placeholder="tu@email.com" required
              value={email} onChange={(evento) => setEmail(evento.target.value)} />
          </div>

          <div className="campo-form">
            <label htmlFor="cuenta-password">Contraseña</label>
            <div className="contenedor-password">
              {/* Si mostrarPassword es true el input es "text" (se lee), si no es "password" */}
              <input id="cuenta-password" type={mostrarPassword ? "text" : "password"} className="campo" required minLength={6}
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

          <button type="submit" className="boton boton-primario boton-lg boton-bloque">Crear cuenta</button>
        </form>

        <div className="separador-o">
          <span>O continuar con</span>
        </div>

        <div className="botones-sociales">
          <a href="#google" className="boton boton-secundario">G Google</a>
          <a href="#apple" className="boton boton-secundario"> Apple</a>
          <a href="#facebook" className="boton boton-secundario">f Facebook</a>
        </div>

        <p className="texto-login-link">
          ¿Ya tienes cuenta? <a href="#login" className="enlace-texto">Inicia sesión</a>
        </p>
      </div>
    )
}

export {CrearCuenta}
