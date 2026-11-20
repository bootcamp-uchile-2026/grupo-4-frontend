// RESUMEN: sección /admin/usuarios: listar, crear, editar (incluido su rol) y eliminar usuarios.
import { useEffect, useState } from "react"
import { URL_USUARIOS, URL_ROLES } from "../../datos/api"
import type { UsuarioApi, RolApi } from "../../datos/api"
import "../../components/checkout/checkout.css"

type AdminUsuariosProps = {
    token: string
}

// El formulario vacío. Sirve para CREAR y también para EDITAR.
const formularioVacio = {
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    password: "",
    rol: "CLIENTE",
}

// Los 3 roles que conocemos. Se usan mientras llega la lista de la API (o si falla).
const rolesIniciales: RolApi[] = [
    { id: 1, nombre: "CLIENTE" },
    { id: 2, nombre: "ADMIN" },
    { id: 3, nombre: "PROVEEDOR" },
]

function AdminUsuarios({ token }: AdminUsuariosProps) {
    const [usuarios, setUsuarios] = useState<UsuarioApi[]>([])
    const [formulario, setFormulario] = useState(formularioVacio)
    // null = el formulario está CREANDO. Un número = está EDITANDO el usuario con ese id.
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [mensaje, setMensaje] = useState("")
    // true = el formulario está abierto (acordeón, igual que en Productos).
    const [mostrarFormulario, setMostrarFormulario] = useState(false)
    // Los roles para el selector. Empiezan con los 3 conocidos y se reemplazan por los de la API.
    const [roles, setRoles] = useState<RolApi[]>(rolesIniciales)

    // READ: al abrir la sección, pedimos la lista (con token, porque /usuarios está protegida).
    useEffect(() => {
        async function cargarUsuarios() {
            try {
                const respuesta = await fetch(URL_USUARIOS, {
                    headers: { "Authorization": "Bearer " + token },
                })
                if (!respuesta.ok) {
                    throw new Error("Error " + respuesta.status)
                }
                const datos = await respuesta.json()
                setUsuarios(datos)

                // Los roles que existen (GET /roles, también con token).
                // Si falla, no es grave: el selector sigue con los 3 roles conocidos.
                const respuestaRoles = await fetch(URL_ROLES, {
                    headers: { "Authorization": "Bearer " + token },
                })
                if (respuestaRoles.ok) {
                    const datosRoles = await respuestaRoles.json()
                    setRoles(datosRoles)
                }
            } catch (error) {
                console.error("Error:", error)
                setMensaje("No pudimos cargar los usuarios. " + error)
            }
        }
        cargarUsuarios()
    }, [token])   // si cambia el token (nueva sesión), volvemos a cargar

    // CREATE y UPDATE: el mismo formulario hace las dos cosas.
    async function guardar(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        setMensaje("")

        // ¿Cambió el rol? Solo puede pasar al editar: comparamos con el rol que tenía en la lista.
        const usuarioOriginal = usuarios.find((u) => u.id === editandoId)
        const cambioDeRol = usuarioOriginal !== undefined && usuarioOriginal.rol !== formulario.rol
        // Cambiar un rol da o quita permisos: pedimos confirmación antes de guardar nada.
        if (cambioDeRol && !confirm("¿Cambiar el rol de " + formulario.nombre + " de " + usuarioOriginal.rol + " a " + formulario.rol + "?")) {
            return
        }

        // Si estamos editando: PATCH a /usuarios/ID. Si estamos creando: POST a /usuarios.
        let url = URL_USUARIOS
        let metodo = "POST"
        if (editandoId !== null) {
            url = URL_USUARIOS + "/" + editandoId
            metodo = "PATCH"
        }

        // Los campos vacíos van como undefined → JSON.stringify los deja FUERA.
        // Así, al editar, lo que dejes vacío no se cambia (ej: la contraseña).
        const datos = {
            nombre: formulario.nombre || undefined,
            apellido: formulario.apellido || undefined,
            email: formulario.email || undefined,
            telefono: formulario.telefono || undefined,
            password: formulario.password || undefined,
            // Al CREAR el rol va aquí. Al EDITAR no: la API lo cambia con otra dirección (/usuarios/ID/rol, más abajo).
            rol: editandoId === null ? formulario.rol : undefined,
        }

        try {
            const respuesta = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify(datos),
            })
            if (respuesta.status === 401) {
                throw new Error("Tu sesión expiró (dura 15 minutos). Cierra sesión y vuelve a ingresar.")
            }
            if (!respuesta.ok) {
                const datosError = await respuesta.json()
                throw new Error("Error " + respuesta.status + ": " + datosError.message)
            }
            let usuarioGuardado: UsuarioApi = await respuesta.json()

            // Si cambió el rol: PATCH /usuarios/ID/rol con { rol: "ADMIN" } (solo un ADMIN puede hacerlo).
            // Si falla, los otros datos YA quedaron guardados: avisamos solo del rol.
            let textoRol = ""
            if (cambioDeRol) {
                const respuestaRol = await fetch(URL_USUARIOS + "/" + editandoId + "/rol", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                    },
                    body: JSON.stringify({ rol: formulario.rol }),
                })
                if (respuestaRol.ok) {
                    usuarioGuardado = await respuestaRol.json()   // el usuario ya con su rol nuevo
                    textoRol = " Rol cambiado a " + usuarioGuardado.rol + "."
                } else {
                    textoRol = " Pero el rol no se pudo cambiar (error " + respuestaRol.status + ")."
                }
            }

            if (editandoId === null) {
                // Creado: lo agregamos al final de la lista (spread, sin modificar la original).
                setUsuarios([...usuarios, usuarioGuardado])
                setMensaje("Usuario creado.")
            } else {
                // Editado: reemplazamos solo ese usuario en la lista.
                setUsuarios(usuarios.map((u) => (u.id === editandoId ? usuarioGuardado : u)))
                setMensaje("Usuario actualizado." + textoRol)
                setMostrarFormulario(false)   // terminó de editar: cerramos el formulario
            }
            setFormulario(formularioVacio)
            setEditandoId(null)
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos guardar. " + error)
        }
    }

    // Al apretar "Editar": llenamos el formulario con los datos de ese usuario.
    function empezarEdicion(usuario: UsuarioApi) {
        setEditandoId(usuario.id)
        setMostrarFormulario(true)    // abrimos el acordeón para que se vea el formulario
        setFormulario({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefono: usuario.telefono || "",
            password: "",            // vacía = no se cambia
            rol: usuario.rol,
        })
    }

    function cancelarEdicion() {
        setEditandoId(null)
        setFormulario(formularioVacio)
        setMostrarFormulario(false)
    }

    // Botón del acordeón: si está abierto lo cierra (y cancela la edición si había una); si está cerrado lo abre.
    function alternarFormulario() {
        if (mostrarFormulario) {
            cancelarEdicion()
        } else {
            setMostrarFormulario(true)
        }
    }

    // DELETE
    async function eliminar(usuario: UsuarioApi) {
        // confirm muestra una ventanita del navegador con "Aceptar" / "Cancelar".
        if (!confirm("¿Eliminar a " + usuario.nombre + " " + usuario.apellido + "?")) {
            return
        }
        try {
            const respuesta = await fetch(URL_USUARIOS + "/" + usuario.id, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token },
            })
            if (!respuesta.ok) {
                throw new Error("Error " + respuesta.status)
            }
            // filter: nos quedamos con todos MENOS el eliminado.
            setUsuarios(usuarios.filter((u) => u.id !== usuario.id))
            setMensaje("Usuario eliminado.")
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos eliminar. " + error)
        }
    }

    return (
        <section>
            <h2>Usuarios</h2>
            {mensaje && <p className="texto-muted">{mensaje}</p>}

            <table>
                <thead>
                    <tr><th>Id</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.nombre} {usuario.apellido}</td>
                            <td>{usuario.email}</td>
                            <td>{usuario.rol}</td>
                            <td>
                                <button type="button" className="boton boton-secundario boton-sm" onClick={() => empezarEdicion(usuario)}>Editar</button>
                                <button type="button" className="boton boton-terciario boton-sm" onClick={() => eliminar(usuario)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* CREATE y EDIT tipo acordeón: el botón abre y cierra el formulario.
                "Editar" en la tabla también lo abre, ya lleno con los datos. */}
            <button type="button" className="boton boton-primario"
                aria-expanded={mostrarFormulario}
                onClick={alternarFormulario}>
                {mostrarFormulario ? "▲ Cerrar formulario" : "▼ Ingresar nuevo usuario"}
            </button>

            {/* Solo se dibuja si está abierto */}
            {mostrarFormulario && (
                <div className="acordeon-admin">
                    <div className="tarjeta-base">
                        {/* El título cambia según si estamos creando o editando */}
                        <h3>{editandoId === null ? "Nuevo usuario" : "Editar usuario " + editandoId}</h3>
                        <form onSubmit={guardar}>
                            <div className="campo-form">
                                <label htmlFor="usuario-nombre">Nombre</label>
                                {/* required solo al crear: al editar, vacío = no cambiar */}
                                <input id="usuario-nombre" type="text" className="campo" required={editandoId === null}
                                    value={formulario.nombre}
                                    onChange={(evento) => setFormulario({ ...formulario, nombre: evento.target.value })} />
                            </div>
                            <div className="campo-form">
                                <label htmlFor="usuario-apellido">Apellido</label>
                                <input id="usuario-apellido" type="text" className="campo" required={editandoId === null}
                                    value={formulario.apellido}
                                    onChange={(evento) => setFormulario({ ...formulario, apellido: evento.target.value })} />
                            </div>
                            <div className="campo-form">
                                <label htmlFor="usuario-email">Email</label>
                                <input id="usuario-email" type="email" className="campo" required={editandoId === null}
                                    value={formulario.email}
                                    onChange={(evento) => setFormulario({ ...formulario, email: evento.target.value })} />
                            </div>
                            <div className="campo-form">
                                <label htmlFor="usuario-telefono">Teléfono</label>
                                <input id="usuario-telefono" type="tel" className="campo" placeholder="+56912345678" required={editandoId === null}
                                    value={formulario.telefono}
                                    onChange={(evento) => setFormulario({ ...formulario, telefono: evento.target.value })} />
                            </div>
                            <div className="campo-form">
                                <label htmlFor="usuario-password">
                                    {editandoId === null ? "Contraseña" : "Nueva contraseña (vacía = no cambiar)"}
                                </label>
                                <input id="usuario-password" type="password" className="campo" minLength={8} required={editandoId === null}
                                    value={formulario.password}
                                    onChange={(evento) => setFormulario({ ...formulario, password: evento.target.value })} />
                            </div>
                            {/* El rol se elige al crear y también se puede cambiar al editar.
                                Las opciones salen de GET /roles (CLIENTE, ADMIN, PROVEEDOR). */}
                            <div className="campo-form">
                                <label htmlFor="usuario-rol">Rol</label>
                                <select id="usuario-rol" className="campo"
                                    value={formulario.rol}
                                    onChange={(evento) => setFormulario({ ...formulario, rol: evento.target.value })}>
                                    {roles.map((rol) => (
                                        <option key={rol.id} value={rol.nombre}>{rol.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="boton boton-primario">
                                {editandoId === null ? "Crear usuario" : "Guardar cambios"}
                            </button>
                            {editandoId !== null && (
                                <button type="button" className="boton boton-terciario" onClick={cancelarEdicion}>Cancelar</button>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export {AdminUsuarios}
