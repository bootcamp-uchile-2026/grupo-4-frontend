import { useState } from "react"
import { URL_PRODUCTOS, leerJson } from "../../datos/api"
import type { ProductoApi, ProveedorApi } from "../../datos/api"
// Reutilizamos los estilos de formulario que ya existen (campo-form, campo, boton...).
import "../checkout/checkout.css"

type CrearProductoProps = {
    proveedores: ProveedorApi[]                           // para llenar el selector "Productor"
    token: string                                         // la "pulsera" del ADMIN: sin ella la API responde 401
    onProductoCreado: (producto: ProductoApi) => void     // avisa al panel para que lo agregue a la tabla
}

// FLAG DE REVISIÓN: en true muestra en pantalla y en la consola el motivo exacto del error.
// Cuando todo funcione, cámbialo a false para que el cliente vea solo el mensaje simple.
const MODO_REVISION = true

// Cómo empieza el formulario: todo vacío.
// Los números también los guardamos como texto (así llegan desde los <input>),
// y los convertimos con Number() recién al enviarlos.
const formularioVacio = {
    nombre: "",
    descripcion: "",
    ingredientes: "",
    proveedorId: "",
    categoriaId: "",
    precio: "",
    descuento: "0",
    tipoConservacion: "Ambiente",
    imagen: "",
    fechaVencimiento: "",
}

// Formulario para crear un producto nuevo en la API.
function CrearProducto({ proveedores, token, onProductoCreado }: CrearProductoProps) {
    // Un estado que guarda un OBJETO con todos los campos del formulario.
    const [producto, setProducto] = useState(formularioVacio)
    // true mientras esperamos a la API (para desactivar el botón).
    const [enviando, setEnviando] = useState(false)
    // Mensaje para el usuario: éxito o error. "" = sin mensaje.
    const [mensaje, setMensaje] = useState("")

    // Se ejecuta al apretar "Crear producto".
    // Es "async" porque adentro esperamos a la API con "await".
    async function enviarFormulario(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault()   // evita que el navegador recargue la página
        setEnviando(true)
        setMensaje("")

        // Armamos los datos que vamos a enviar.
        // Number("5990") → 5990: la API pide números, no texto.
        const datosProducto = {
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            ingredientes: producto.ingredientes,
            proveedorId: Number(producto.proveedorId),
            categoriaId: Number(producto.categoriaId),
            precio: Number(producto.precio),
            descuento: Number(producto.descuento),
            tipoConservacion: producto.tipoConservacion,
            imagen: producto.imagen,
            // La fecha es opcional: si está vacía mandamos undefined,
            // y JSON.stringify deja ese campo FUERA (la API no acepta una fecha vacía "").
            fechaVencimiento: producto.fechaVencimiento || undefined,
        }
        if (MODO_REVISION) {
            console.log("Datos enviados a la API:", datosProducto)
        }

        try {                                          // "try" = intenta hacer todo esto...
            const respuesta = await fetch(URL_PRODUCTOS, {
                method: "POST",                                    // POST = "crear algo nuevo"
                headers: {
                    "Content-Type": "application/json",            // enviamos JSON
                    "Authorization": "Bearer " + token,            // mostramos la "pulsera" de ADMIN
                },
                body: JSON.stringify(datosProducto),               // el objeto convertido a texto JSON
            })
            // Si la API rechazó los datos (ej: 400 = dato no válido), saltamos al "catch".
            if (!respuesta.ok) {
                // La API explica el motivo en su respuesta (campo "message"). La leemos para saber qué falló.
                const datosError = await respuesta.json()
                if (MODO_REVISION) {
                    console.log("Respuesta de la API (error " + respuesta.status + "):", datosError)
                }
                throw new Error("Error " + respuesta.status + ": " + datosError.message)
            }
            // La API devuelve el producto creado, ya con su id.
            const productoNuevo = await leerJson(respuesta)
            // Si no viene con id, no se guardó de verdad.
            if (!productoNuevo.id) {
                throw new Error("La API no devolvió el producto creado")
            }

            onProductoCreado(productoNuevo)            // le avisamos al panel
            setMensaje("Producto creado con id " + productoNuevo.id + ": " + productoNuevo.nombre)
            setProducto(formularioVacio)               // limpiamos el formulario para crear otro
        } catch (error) {
            // ...y si algo falla, entra aquí (la API está caída, no hay internet o un dato no era válido).
            console.error("Error:", error)
            if (MODO_REVISION) {
                // Mostramos el motivo exacto (ej: "Error 400: imagen debe ser una URL válida").
                setMensaje("No pudimos crear el producto. " + error)
            } else {
                setMensaje("No pudimos crear el producto. Revisa los datos e intenta de nuevo.")
            }
        }
        setEnviando(false)                             // haya salido bien o mal, ya terminó
    }

    return (
        <div className="tarjeta-base">
            <h2>Nuevo producto</h2>
            <form onSubmit={enviarFormulario}>
                {/* En cada campo: {...producto} copia TODO el objeto, y después cambiamos solo ese campo.
                    Así no perdemos lo que ya se escribió en los otros (no mutar, usar spread). */}
                <div className="campo-form">
                    <label htmlFor="producto-nombre">Nombre</label>
                    <input id="producto-nombre" type="text" className="campo" required
                        value={producto.nombre}
                        onChange={(evento) => setProducto({ ...producto, nombre: evento.target.value })} />
                </div>

                <div className="campo-form">
                    <label htmlFor="producto-descripcion">Descripción</label>
                    <textarea id="producto-descripcion" className="campo" required
                        value={producto.descripcion}
                        onChange={(evento) => setProducto({ ...producto, descripcion: evento.target.value })} />
                </div>

                <div className="campo-form">
                    <label htmlFor="producto-ingredientes">Ingredientes</label>
                    <input id="producto-ingredientes" type="text" className="campo" required
                        placeholder="Ej: Frutillas, azúcar, jugo de limón"
                        value={producto.ingredientes}
                        onChange={(evento) => setProducto({ ...producto, ingredientes: evento.target.value })} />
                </div>

                <div className="campo-form">
                    <label htmlFor="producto-proveedor">Productor</label>
                    {/* Las opciones salen de la API de proveedores */}
                    <select id="producto-proveedor" className="campo" required
                        value={producto.proveedorId}
                        onChange={(evento) => setProducto({ ...producto, proveedorId: evento.target.value })}>
                        <option value="">Elige un productor</option>
                        {proveedores.map((proveedor) => (
                            <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="campo-form">
                    {/* Número y no selector: la API de categorías todavía está vacía */}
                    <label htmlFor="producto-categoria">N° de categoría</label>
                    <input id="producto-categoria" type="number" className="campo" required min={1}
                        value={producto.categoriaId}
                        onChange={(evento) => setProducto({ ...producto, categoriaId: evento.target.value })} />
                </div>

                <div className="campo-form">
                    <label htmlFor="producto-precio">Precio</label>
                    <input id="producto-precio" type="number" className="campo" required min={0}
                        value={producto.precio}
                        onChange={(evento) => setProducto({ ...producto, precio: evento.target.value })} />
                </div>

                <div className="campo-form">
                    <label htmlFor="producto-descuento">Descuento (%)</label>
                    <input id="producto-descuento" type="number" className="campo" min={0} max={100}
                        value={producto.descuento}
                        onChange={(evento) => setProducto({ ...producto, descuento: evento.target.value })} />
                </div>

                <div className="campo-form">
                    <label htmlFor="producto-conservacion">Conservación</label>
                    {/* Solo estas 3 opciones: son las únicas que acepta la API */}
                    <select id="producto-conservacion" className="campo"
                        value={producto.tipoConservacion}
                        onChange={(evento) => setProducto({ ...producto, tipoConservacion: evento.target.value })}>
                        <option value="Ambiente">Ambiente</option>
                        <option value="Refrigerado">Refrigerado</option>
                        <option value="Congelado">Congelado</option>
                    </select>
                </div>

                <div className="campo-form">
                    {/* required: la API lo deja opcional, pero sin imagen la tarjeta del catálogo se vería vacía */}
                    <label htmlFor="producto-imagen">Imagen (URL)</label>
                    <input id="producto-imagen" type="url" className="campo" required
                        placeholder="https://..."
                        value={producto.imagen}
                        onChange={(evento) => setProducto({ ...producto, imagen: evento.target.value })} />
                </div>

                <div className="campo-form">
                    <label htmlFor="producto-vencimiento">Fecha de vencimiento (opcional)</label>
                    {/* type="date" entrega la fecha como "2026-12-31", justo el formato que pide la API */}
                    <input id="producto-vencimiento" type="date" className="campo"
                        value={producto.fechaVencimiento}
                        onChange={(evento) => setProducto({ ...producto, fechaVencimiento: evento.target.value })} />
                </div>

                {/* disabled: mientras se envía, el botón no se puede apretar (así no se crea 2 veces) */}
                <button type="submit" className="boton boton-primario" disabled={enviando}>
                    {enviando ? "Creando..." : "Crear producto"}
                </button>
            </form>
            {mensaje && <p className="texto-muted">{mensaje}</p>}
        </div>
    )
}

export {CrearProducto}
