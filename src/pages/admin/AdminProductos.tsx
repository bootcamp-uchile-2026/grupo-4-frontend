import { useEffect, useState } from "react"
import { CrearProducto } from "../../components/productos/crear_producto"
import { formatoPrecio } from "../../components/carrito/formato_precio"
import { URL_PRODUCTOS, URL_PROVEEDORES, URL_CATEGORIAS, fotoPrincipal, reemplazarImagen } from "../../datos/api"
import type { ProductoApi, ProveedorApi, CategoriaApi } from "../../datos/api"
import "../../components/checkout/checkout.css"

type AdminProductosProps = {
    token: string
}

// Cuántos productos se muestran en cada página de la tabla.
const PRODUCTOS_POR_PAGINA = 10

// RESUMEN: sección /admin/productos: listar (con buscador y páginas), crear, editar
// (precio, descuento y foto) y eliminar productos.
function AdminProductos({ token }: AdminProductosProps) {
    const [productos, setProductos] = useState<ProductoApi[]>([])
    const [proveedores, setProveedores] = useState<ProveedorApi[]>([])   // para el formulario de crear
    const [categorias, setCategorias] = useState<CategoriaApi[]>([])     // para el selector "Categoría"
    const [mensaje, setMensaje] = useState("")
    // Edición rápida: qué producto se está editando y los valores nuevos.
    const [editandoId, setEditandoId] = useState<number | null>(null)
    const [precioNuevo, setPrecioNuevo] = useState("")
    const [descuentoNuevo, setDescuentoNuevo] = useState("")
    // La foto nueva elegida al editar. null = no se cambia la foto.
    // (File es el tipo que usa el navegador para un archivo. No está en los PDFs del curso.)
    const [fotoNueva, setFotoNueva] = useState<File | null>(null)
    // true mientras se guarda (para apagar el botón "Guardar" y no enviar dos veces).
    const [guardando, setGuardando] = useState(false)
    // Lo que se escribe en el buscador. "" = mostrar todos.
    const [busqueda, setBusqueda] = useState("")
    // La página de la tabla que se está viendo (empieza en la 1).
    const [pagina, setPagina] = useState(1)
    // true = el formulario "Nuevo producto" está abierto (acordeón).
    const [mostrarFormulario, setMostrarFormulario] = useState(false)

    // READ: productos, proveedores y categorías (los tres son públicos).
    useEffect(() => {
        async function cargarDatos() {
            try {
                const respuestaProductos = await fetch(URL_PRODUCTOS)
                if (!respuestaProductos.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datosProductos = await respuestaProductos.json()

                const respuestaProveedores = await fetch(URL_PROVEEDORES)
                if (!respuestaProveedores.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datosProveedores = await respuestaProveedores.json()

                const respuestaCategorias = await fetch(URL_CATEGORIAS)
                if (!respuestaCategorias.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datosCategorias = await respuestaCategorias.json()

                setProductos(datosProductos)
                setProveedores(datosProveedores)
                setCategorias(datosCategorias)
            } catch (error) {
                console.error("Error:", error)
                setMensaje("No pudimos cargar los productos. " + error)
            }
        }
        cargarDatos()
    }, [])

    function empezarEdicion(producto: ProductoApi) {
        setEditandoId(producto.id)
        setPrecioNuevo(String(producto.precio))         // el <input> trabaja con texto
        setDescuentoNuevo(String(producto.descuento))
        setFotoNueva(null)                              // empieza sin foto nueva elegida
    }

    function cancelarEdicion() {
        setEditandoId(null)
        setFotoNueva(null)
    }

    // UPDATE: solo enviamos lo que cambia (PATCH = "cambiar una parte").
    // Si además se eligió una foto, después la subimos y borramos la anterior.
    async function guardarEdicion(id: number) {
        setGuardando(true)
        try {
            const respuesta = await fetch(URL_PRODUCTOS + "/" + id, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({ precio: Number(precioNuevo), descuento: Number(descuentoNuevo) }),
            })
            if (respuesta.status === 401) {
                throw new Error("Tu sesión expiró (dura 15 minutos). Cierra sesión y vuelve a ingresar.")
            }
            if (!respuesta.ok) {
                const datosError = await respuesta.json()
                throw new Error("Error " + respuesta.status + ": " + datosError.message)
            }
            // La API devuelve el producto ya actualizado (con el precioDescuento recalculado).
            const productoActualizado: ProductoApi = await respuesta.json()

            // Si eligió una foto nueva, la cambiamos. Si falla, el precio y el descuento YA quedaron guardados.
            let textoFoto = ""
            if (fotoNueva) {
                try {
                    const resultado = await reemplazarImagen(URL_PRODUCTOS, productoActualizado, fotoNueva, token)
                    // Ahora el producto tiene una sola foto: la nueva.
                    productoActualizado.imagenes = [resultado.nueva]
                    textoFoto = " Foto cambiada." + resultado.aviso
                } catch (errorFoto) {
                    console.error("Error al cambiar la foto:", errorFoto)
                    textoFoto = " Pero la foto no se pudo cambiar. " + errorFoto
                }
            }

            setProductos(productos.map((p) => (p.id === id ? productoActualizado : p)))
            setEditandoId(null)
            setFotoNueva(null)
            setMensaje("Producto " + id + " actualizado." + textoFoto)
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos actualizar. " + error)
        }
        setGuardando(false)
    }

    // DELETE
    async function eliminar(producto: ProductoApi) {
        // confirm muestra una ventanita del navegador con "Aceptar" / "Cancelar".
        if (!confirm("¿Eliminar " + producto.nombre + "?")) {
            return
        }
        try {
            const respuesta = await fetch(URL_PRODUCTOS + "/" + producto.id, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token },
            })
            if (!respuesta.ok) {
                throw new Error("Error " + respuesta.status)
            }
            // filter: nos quedamos con todos MENOS el eliminado.
            setProductos(productos.filter((p) => p.id !== producto.id))
            setMensaje("Producto eliminado.")
        } catch (error) {
            console.error("Error:", error)
            setMensaje("No pudimos eliminar. " + error)
        }
    }

    // Al escribir en el buscador volvemos a la página 1
    // (si estabas en la página 3, puede que la búsqueda tenga menos páginas).
    function cambiarBusqueda(texto: string) {
        setBusqueda(texto)
        setPagina(1)
    }

    // 1) BUSCAR (tipo LIKE): nos quedamos con los productos cuyo nombre CONTIENE lo escrito.
    //    toLowerCase pasa todo a minúsculas, así "QUESO", "queso" y "Queso" encuentran lo mismo.
    const productosEncontrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    )

    // 2) PAGINAR: cuántas páginas hay en total (Math.ceil redondea hacia arriba: 12 / 10 = 1,2 → 2).
    //    Si no hay resultados, igual decimos que hay 1 página.
    const totalPaginas = Math.max(1, Math.ceil(productosEncontrados.length / PRODUCTOS_POR_PAGINA))
    // Si borraste el último producto de la última página, esa página ya no existe:
    // Math.min nos deja en la última que sí existe.
    const paginaActual = Math.min(pagina, totalPaginas)
    // slice(desde, hasta) corta un pedazo de la lista. Página 1 → del 0 al 10, página 2 → del 10 al 20...
    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA
    const productosDeLaPagina = productosEncontrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA)

    return (
        <section>
            <h2>Productos</h2>
            {mensaje && <p className="texto-muted">{mensaje}</p>}

            {/* Buscador */}
            {/* campo-form: la misma clase de los otros formularios (etiqueta arriba, cuadro abajo) */}
            <div className="campo-form buscador-admin">
                <label htmlFor="buscar-producto">Buscar producto</label>
                <input id="buscar-producto" type="search" className="campo" placeholder="Ej: queso, miel, mermelada..."
                    value={busqueda} onChange={(evento) => cambiarBusqueda(evento.target.value)} />
                <p className="texto-muted">
                    {productosEncontrados.length} de {productos.length} productos
                </p>
            </div>

            {/* Si la búsqueda no encuentra nada, avisamos */}
            {productos.length > 0 && productosEncontrados.length === 0 && (
                <p className="texto-muted">No hay productos que contengan "{busqueda}".</p>
            )}

            <table>
                <thead>
                    <tr><th>Id</th><th>Foto</th><th>Nombre</th><th>Precio</th><th>Descuento</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {/* Solo dibujamos los productos de la página actual */}
                    {productosDeLaPagina.map((producto) => (
                        <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td className="celda-foto-admin">
                                {/* Miniatura de la foto principal, o "Sin foto" */}
                                {fotoPrincipal(producto)
                                    ? <img src={fotoPrincipal(producto)} alt="" className="miniatura-admin" />
                                    : <span className="texto-muted">Sin foto</span>}
                                {/* Solo en la fila que se está editando: el botón para elegir otra foto.
                                    accept: solo deja elegir fotos jpg, png o webp. */}
                                {editandoId === producto.id && (
                                    <input type="file" className="campo-foto-admin" aria-label="Foto nueva"
                                        accept="image/jpeg, image/png, image/webp"
                                        onChange={(evento) => setFotoNueva(evento.target.files ? evento.target.files[0] : null)} />
                                )}
                            </td>
                            <td>{producto.nombre}</td>
                            {/* Si esta fila se está editando, mostramos inputs; si no, el texto */}
                            {editandoId === producto.id ? (
                                <>
                                <td><input type="number" className="campo" min={0} aria-label="Precio nuevo" value={precioNuevo}
                                    onChange={(evento) => setPrecioNuevo(evento.target.value)} /></td>
                                <td><input type="number" className="campo" min={0} max={100} aria-label="Descuento nuevo" value={descuentoNuevo}
                                    onChange={(evento) => setDescuentoNuevo(evento.target.value)} /></td>
                                <td>
                                    <button type="button" className="boton boton-primario boton-sm" disabled={guardando}
                                        onClick={() => guardarEdicion(producto.id)}>{guardando ? "Guardando..." : "Guardar"}</button>
                                    <button type="button" className="boton boton-terciario boton-sm" onClick={cancelarEdicion}>Cancelar</button>
                                </td>
                                </>
                            ) : (
                                <>
                                <td>{formatoPrecio(producto.precio)}</td>
                                <td>{producto.descuento}%</td>
                                <td>
                                    <button type="button" className="boton boton-secundario boton-sm" onClick={() => empezarEdicion(producto)}>Editar</button>
                                    <button type="button" className="boton boton-terciario boton-sm" onClick={() => eliminar(producto)}>Eliminar</button>
                                </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Paginación: "disabled" apaga el botón cuando no hay página anterior o siguiente */}
            <div className="paginacion-admin">
                <button type="button" className="boton boton-secundario boton-sm"
                    disabled={paginaActual === 1} onClick={() => setPagina(paginaActual - 1)}>
                    ← Anterior
                </button>
                <span>Página {paginaActual} de {totalPaginas}</span>
                <button type="button" className="boton boton-secundario boton-sm"
                    disabled={paginaActual === totalPaginas} onClick={() => setPagina(paginaActual + 1)}>
                    Siguiente →
                </button>
            </div>

            {/* CREATE tipo acordeón: el botón abre y cierra el formulario */}
            <button type="button" className="boton boton-primario"
                aria-expanded={mostrarFormulario}
                onClick={() => setMostrarFormulario(!mostrarFormulario)}>
                {mostrarFormulario ? "▲ Cerrar formulario" : "▼ Ingresar nuevo producto"}
            </button>

            {/* Solo se dibuja si está abierto */}
            {mostrarFormulario && (
                <div className="acordeon-admin">
                    <CrearProducto
                        proveedores={proveedores}
                        categorias={categorias}
                        token={token}
                        onProductoCreado={(productoNuevo) => setProductos([...productos, productoNuevo])}
                    ></CrearProducto>
                </div>
            )}
        </section>
    )
}

export {AdminProductos}
