import { useEffect, useState } from "react"
import { URL_PROVEEDORES, leerJson } from "../../datos/api"
import type { ProveedorApi } from "../../datos/api"
import "../../components/checkout/checkout.css"

type AdminProveedoresProps = {
    token: string
}

// El formulario vacío. Sirve para CREAR y también para EDITAR.
const formularioVacio = {
    nombre: "",               // nombre del negocio, ej: "Mermeladas del Valle"
    nombreResponsable: "",    // la persona a cargo
    apellido: "",
    descripcion: "",
    email: "",
    telefono: "",
    password: "",             // al crear un productor, la API también le crea su cuenta
}

// Sección /admin/proveedores: listar, crear, editar y eliminar productores.
// Sigue la misma receta que AdminUsuarios.
function AdminProveedores({ token }: AdminProveedoresProps) {
    const [proveedores, setProveedores] = useState<ProveedorApi[]>([])
    const [formulario, setFormulario] = useState(formularioVacio)
    // null = el formulario está CREANDO. Un número = está EDITANDO el productor con ese id.
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [mensaje, setMensaje] = useState("")

    // READ: /proveedores es pública, no necesita token.
    useEffect(() => {
        async function cargarProveedores() {
            try {
                const respuesta = await fetch(URL_PROVEEDORES)
                if (!respuesta.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datos = await leerJson(respuesta)
                setProveedores(datos)
            } catch (error) {
                console.error("Error:", error)
                setMensaje("No pudimos cargar los productores. " + error)
            }
        }
        cargarProveedores()
    }, [])

    // CREATE y UPDATE: el mismo formulario hace las dos cosas.
    async function guardar(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        setMensaje("")

        // Si estamos editando: PATCH a /proveedores/ID. Si estamos creando: POST a /proveedores.
        let url = URL_PROVEEDORES
        let metodo = "POST"
        if (editandoId !== null) {
            url = URL_PROVEEDORES + "/" + editandoId
            metodo = "PATCH"
        }

        // Los campos vacíos van como undefined → JSON.stringify los deja FUERA (= no se cambian).
        const datos = {
            nombre: formulario.nombre || undefined,
            nombreResponsable: formulario.nombreResponsable || undefined,
            apellido: formulario.apellido || undefined,
            descripcion: formulario.descripcion || undefined,
            email: formulario.email || undefined,
            telefono: formulario.telefono || undefined,
            password: formulario.password || undefined,
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
            const proveedorGuardado = await leerJson(respuesta)

            if (editandoId === null) {
                setProveedores([...proveedores, proveedorGuardado])
                setMensaje("Productor creado.")
            } else {
                setProveedores(proveedores.map((p) => (p.id === editandoId ? proveedorGuardado : p)))
                setMensaje("Productor actualizado.")
            }
            setFormulario(formularioVacio)
            setEditandoId(null)
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos guardar. " + error)
        }
    }

    // La lista de la API no trae nombreResponsable ni apellido: quedan vacíos (= no se cambian).
    function empezarEdicion(proveedor: ProveedorApi) {
        setEditandoId(proveedor.id)
        setFormulario({
            ...formularioVacio,
            nombre: proveedor.nombre,
            descripcion: proveedor.descripcion,
            email: proveedor.email,
            telefono: proveedor.telefono,
        })
    }

    function cancelarEdicion() {
        setEditandoId(null)
        setFormulario(formularioVacio)
    }

    // DELETE
    async function eliminar(proveedor: ProveedorApi) {
        if (!confirm("¿Eliminar a " + proveedor.nombre + "?")) {
            return
        }
        try {
            const respuesta = await fetch(URL_PROVEEDORES + "/" + proveedor.id, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token },
            })
            if (!respuesta.ok) {
                throw new Error("Error " + respuesta.status)
            }
            setProveedores(proveedores.filter((p) => p.id !== proveedor.id))
            setMensaje("Productor eliminado.")
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos eliminar. " + error)
        }
    }

    return (
        <section>
            <h2>Productores</h2>
            {mensaje && <p className="texto-muted">{mensaje}</p>}

            <table>
                <thead>
                    <tr><th>Id</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {proveedores.map((proveedor) => (
                        <tr key={proveedor.id}>
                            <td>{proveedor.id}</td>
                            <td>{proveedor.nombre}</td>
                            <td>{proveedor.email}</td>
                            <td>{proveedor.telefono}</td>
                            <td>
                                <button type="button" className="boton boton-secundario boton-sm" onClick={() => empezarEdicion(proveedor)}>Editar</button>
                                <button type="button" className="boton boton-terciario boton-sm" onClick={() => eliminar(proveedor)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="tarjeta-base">
                <h3>{editandoId === null ? "Nuevo productor" : "Editar productor " + editandoId}</h3>
                <form onSubmit={guardar}>
                    <div className="campo-form">
                        <label htmlFor="proveedor-nombre">Nombre del negocio</label>
                        <input id="proveedor-nombre" type="text" className="campo" required={editandoId === null}
                            value={formulario.nombre}
                            onChange={(evento) => setFormulario({ ...formulario, nombre: evento.target.value })} />
                    </div>
                    <div className="campo-form">
                        <label htmlFor="proveedor-responsable">Nombre del responsable</label>
                        <input id="proveedor-responsable" type="text" className="campo" required={editandoId === null}
                            value={formulario.nombreResponsable}
                            onChange={(evento) => setFormulario({ ...formulario, nombreResponsable: evento.target.value })} />
                    </div>
                    <div className="campo-form">
                        <label htmlFor="proveedor-apellido">Apellido del responsable</label>
                        <input id="proveedor-apellido" type="text" className="campo" required={editandoId === null}
                            value={formulario.apellido}
                            onChange={(evento) => setFormulario({ ...formulario, apellido: evento.target.value })} />
                    </div>
                    <div className="campo-form">
                        <label htmlFor="proveedor-descripcion">Descripción</label>
                        <textarea id="proveedor-descripcion" className="campo" required={editandoId === null}
                            value={formulario.descripcion}
                            onChange={(evento) => setFormulario({ ...formulario, descripcion: evento.target.value })} />
                    </div>
                    <div className="campo-form">
                        <label htmlFor="proveedor-email">Email</label>
                        <input id="proveedor-email" type="email" className="campo" required={editandoId === null}
                            value={formulario.email}
                            onChange={(evento) => setFormulario({ ...formulario, email: evento.target.value })} />
                    </div>
                    <div className="campo-form">
                        <label htmlFor="proveedor-telefono">Teléfono</label>
                        <input id="proveedor-telefono" type="tel" className="campo" placeholder="+56912345678" required={editandoId === null}
                            value={formulario.telefono}
                            onChange={(evento) => setFormulario({ ...formulario, telefono: evento.target.value })} />
                    </div>
                    <div className="campo-form">
                        <label htmlFor="proveedor-password">
                            {editandoId === null ? "Contraseña de su cuenta" : "Nueva contraseña (vacía = no cambiar)"}
                        </label>
                        <input id="proveedor-password" type="password" className="campo" minLength={8} required={editandoId === null}
                            value={formulario.password}
                            onChange={(evento) => setFormulario({ ...formulario, password: evento.target.value })} />
                    </div>
                    <button type="submit" className="boton boton-primario">
                        {editandoId === null ? "Crear productor" : "Guardar cambios"}
                    </button>
                    {editandoId !== null && (
                        <button type="button" className="boton boton-terciario" onClick={cancelarEdicion}>Cancelar</button>
                    )}
                </form>
            </div>
        </section>
    )
}

export {AdminProveedores}
