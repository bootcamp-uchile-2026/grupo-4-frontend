import { useState } from "react"
// Navigate: redirige a otra página.
import { Navigate } from "react-router"
import { Encabezado } from "../../components/Header/header"
import { Footer } from "../../components/footer/footer"
import { URL_LOGIN, URL_USUARIOS } from "../../datos/api"
import type { SesionAdmin } from "../../datos/api"
import "../../components/Header/header.css"
import "../../components/checkout/checkout.css"
import "../../components/admin/admin.css"

type LoginAdminProps = {
    sesion: SesionAdmin | null                      // para saber si ya ingresó
    onIngresar: (sesion: SesionAdmin) => void       // le entrega la sesión a App
}

// Página /admin/login: ingreso para administradores.
function LoginAdmin({ sesion, onIngresar }: LoginAdminProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [enviando, setEnviando] = useState(false)
    const [mensaje, setMensaje] = useState("")

    // Si ya hay sesión (recién ingresó o ya estaba), lo mandamos al panel.
    if (sesion !== null) {
        return <Navigate to="/admin/productos" />
    }

    async function ingresar(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault()   // evita que el navegador recargue la página
        setEnviando(true)
        setMensaje("")

        try {
            // 1) Iniciamos sesión: la API revisa email y contraseña y nos da el token.
            const respuestaLogin = await fetch(URL_LOGIN, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email, password: password }),
            })
            if (!respuestaLogin.ok) {
                throw new Error("Email o contraseña incorrectos")
            }
            const datosLogin = await respuestaLogin.json()
            const token = datosLogin.access_token      // así lo entrega la API (lo comprobamos)

            // 2) Revisamos si es ADMIN: pedimos la lista de usuarios, que SOLO un ADMIN puede ver.
            const respuestaAdmin = await fetch(URL_USUARIOS, {
                headers: { "Authorization": "Bearer " + token },   // mostramos la "pulsera"
            })
            if (respuestaAdmin.status === 403) {
                throw new Error("Tu cuenta no tiene permisos de administrador")
            }
            if (!respuestaAdmin.ok) {
                throw new Error("La solicitud no fue exitosa")
            }

            // 3) Es ADMIN: guardamos la sesión en App → esta página se vuelve a dibujar y el
            //    "if (sesion !== null)" de arriba lo manda al panel.
            onIngresar({ token: token, email: email })
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos ingresar. " + error)
        }
        setEnviando(false)
    }

    return (
        <>
        <Encabezado></Encabezado>
        <main className="contenedor">
            {/* login-admin: tarjeta angosta y centrada (ver admin.css) */}
            <div className="tarjeta-base login-admin">
                <h1>Administración</h1>
                <p className="texto-muted">Ingresa con tu cuenta de administrador.</p>
                <form onSubmit={ingresar}>
                    <div className="campo-form">
                        <label htmlFor="admin-email">Email</label>
                        <input id="admin-email" type="email" className="campo" required
                            value={email} onChange={(evento) => setEmail(evento.target.value)} />
                    </div>
                    <div className="campo-form">
                        <label htmlFor="admin-password">Contraseña</label>
                        <input id="admin-password" type="password" className="campo" required
                            value={password} onChange={(evento) => setPassword(evento.target.value)} />
                    </div>
                    <button type="submit" className="boton boton-primario boton-bloque" disabled={enviando}>
                        {enviando ? "Ingresando..." : "Ingresar"}
                    </button>
                </form>
                {mensaje && <p className="texto-muted">{mensaje}</p>}
            </div>
        </main>
        <Footer></Footer>
        </>
    )
}

export {LoginAdmin}
