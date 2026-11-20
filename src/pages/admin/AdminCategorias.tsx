// RESUMEN: sección /admin/categorias: listar, crear, editar y eliminar categorías.
// Leer es público. Crear, editar y eliminar envían el token de ADMIN.
// Sigue la misma receta que AdminProveedores (una categoría solo tiene "nombre").
import { useEffect, useState } from "react"
import { URL_CATEGORIAS } from "../../datos/api"
import type { CategoriaApi } from "../../datos/api"
import "../../components/checkout/checkout.css"

type AdminCategoriasProps = {
    token: string
}

function AdminCategorias({ token }: AdminCategoriasProps) {
    const [categorias, setCategorias] = useState<CategoriaApi[]>([])
    // Lo que se escribe en el formulario.
    const [nombre, setNombre] = useState("")
    // null = el formulario está CREANDO. Un número = está EDITANDO la categoría con ese id.
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [mensaje, setMensaje] = useState("")
    // true = el formulario está abierto (acordeón, igual que en Productos).
    const [mostrarFormulario, setMostrarFormulario] = useState(false)

    // READ: /categorias es pública, no necesita token.
    useEffect(() => {
        async function cargarCategorias() {
            try {
                const respuesta = await fetch(URL_CATEGORIAS)
                if (!respuesta.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datos = await respuesta.json()
                setCategorias(datos)
            } catch (error) {
                console.error("Error:", error)
                setMensaje("No pudimos cargar las categorías. " + error)
            }
        }
        cargarCategorias()
    }, [])

    // CREATE y UPDATE: el mismo formulario hace las dos cosas.
    async function guardar(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        setMensaje("")

        // Si estamos editando: PATCH a /categorias/ID. Si estamos creando: POST a /categorias.
        let url = URL_CATEGORIAS
        let metodo = "POST"
        if (editandoId !== null) {
            url = URL_CATEGORIAS + "/" + editandoId
            metodo = "PATCH"
        }

        try {
            const respuesta = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({ nombre: nombre }),
            })
            if (respuesta.status === 401) {
                throw new Error("Tu sesión expiró (dura 15 minutos). Cierra sesión y vuelve a ingresar.")
            }
            // 409 = "conflicto": ya existe una categoría con ese nombre.
            if (respuesta.status === 409) {
                throw new Error("Ya existe una categoría con ese nombre")
            }
            if (!respuesta.ok) {
                const datosError = await respuesta.json()
                throw new Error("Error " + respuesta.status + ": " + datosError.message)
            }
            const categoriaGuardada = await respuesta.json()

            if (editandoId === null) {
                setCategorias([...categorias, categoriaGuardada])
                setMensaje("Categoría creada.")
            } else {
                setCategorias(categorias.map((c) => (c.id === editandoId ? categoriaGuardada : c)))
                setMensaje("Categoría actualizada.")
                setMostrarFormulario(false)   // terminó de editar: cerramos el formulario
            }
            setNombre("")
            setEditandoId(null)
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos guardar. " + error)
        }
    }

    // Al apretar "Editar": llenamos el formulario con el nombre de esa categoría.
    function empezarEdicion(categoria: CategoriaApi) {
        setEditandoId(categoria.id)
        setMostrarFormulario(true)    // abrimos el acordeón para que se vea el formulario
        setNombre(categoria.nombre)
    }

    function cancelarEdicion() {
        setEditandoId(null)
        setNombre("")
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
    async function eliminar(categoria: CategoriaApi) {
        // confirm muestra una ventanita del navegador con "Aceptar" / "Cancelar".
        if (!confirm("¿Eliminar la categoría " + categoria.nombre + "?")) {
            return
        }
        try {
            const respuesta = await fetch(URL_CATEGORIAS + "/" + categoria.id, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token },
            })
            // 409 = la categoría todavía tiene productos, la API no deja borrarla.
            if (respuesta.status === 409) {
                throw new Error("La categoría tiene productos. Cámbialos de categoría primero.")
            }
            if (!respuesta.ok) {
                throw new Error("Error " + respuesta.status)
            }
            // filter: nos quedamos con todas MENOS la eliminada.
            setCategorias(categorias.filter((c) => c.id !== categoria.id))
            setMensaje("Categoría eliminada.")
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos eliminar. " + error)
        }
    }

    return (
        <section>
            <h2>Categorías</h2>
            {mensaje && <p className="texto-muted">{mensaje}</p>}

            <table>
                <thead>
                    <tr><th>Id</th><th>Nombre</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {categorias.map((categoria) => (
                        <tr key={categoria.id}>
                            <td>{categoria.id}</td>
                            <td>{categoria.nombre}</td>
                            <td>
                                <button type="button" className="boton boton-secundario boton-sm" onClick={() => empezarEdicion(categoria)}>Editar</button>
                                <button type="button" className="boton boton-terciario boton-sm" onClick={() => eliminar(categoria)}>Eliminar</button>
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
                {mostrarFormulario ? "▲ Cerrar formulario" : "▼ Ingresar nueva categoría"}
            </button>

            {/* Solo se dibuja si está abierto */}
            {mostrarFormulario && (
                <div className="acordeon-admin">
                    <div className="tarjeta-base">
                        <h3>{editandoId === null ? "Nueva categoría" : "Editar categoría " + editandoId}</h3>
                        <form onSubmit={guardar}>
                            <div className="campo-form">
                                <label htmlFor="categoria-nombre">Nombre</label>
                                <input id="categoria-nombre" type="text" className="campo" required
                                    value={nombre} onChange={(evento) => setNombre(evento.target.value)} />
                            </div>
                            <button type="submit" className="boton boton-primario">
                                {editandoId === null ? "Crear categoría" : "Guardar cambios"}
                            </button>
                            {/* El botón "Cancelar" solo aparece mientras se edita */}
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

export {AdminCategorias}
