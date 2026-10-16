import { useState } from "react"  // useState: para que el componente recuerde datos
import "../estilosPLP/estilosPLP.css"
import { formatoPrecio } from "../carrito/formato_precio"  // convierte 5000 en "$5.000"

type CabeceraCatalogoProps = {
    titulo: string                            // cambia según los filtros, ej: "Quesos" o "Todos los productos"
    cantidad: number                          // cuántos productos se están mostrando
    orden: string                             // el orden elegido, ej: "precio-menor"
    onCambiarOrden: (orden: string) => void   // se llama al elegir otra opción del selector
    filtrosAbiertos: boolean                  // true = el panel de filtros se ve
    onAlternarFiltros: () => void             // abre o cierra el panel de filtros
}

// Opciones del selector "Ordenar por": valor (lo que va en la URL) y texto (lo que se ve).
const opcionesOrden = [
    { valor: "destacados", texto: "Destacados" },
    { valor: "precio-menor", texto: "Precio: menor a mayor" },
    { valor: "precio-mayor", texto: "Precio: mayor a menor" },
    { valor: "nombre", texto: "Nombre: A a Z" },
]

function CabeceraCatalogo({ titulo, cantidad, orden, onCambiarOrden, filtrosAbiertos, onAlternarFiltros }: CabeceraCatalogoProps) {
    return(
        <div className="cabecera-catalogo">
      <div>
        <p className="texto-eyebrow">Productos</p>
        <h1>{titulo}</h1>
        <p className="texto-muted">{cantidad} {cantidad === 1 ? "producto" : "productos"}</p>
      </div>
      <div className="acciones-catalogo">
        {/* aria-expanded le dice a los lectores de pantalla si el panel está abierto */}
        <button type="button" className="boton boton-secundario" onClick={onAlternarFiltros} aria-expanded={filtrosAbiertos}>
          {filtrosAbiertos ? "Ocultar filtros" : "Mostrar filtros"}
        </button>

        <label className="selector-orden">
          <span>Ordenar por</span>
          {/* evento.target.value = el "value" de la opción elegida */}
          <select className="campo" value={orden} onChange={(evento) => onCambiarOrden(evento.target.value)}>
            {opcionesOrden.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
    )
}

// Dirección de la API (la que se ve en Swagger). "/productos" sin filtros = trae TODOS.
const URL_PRODUCTOS = "http://3.144.233.145:3001/productos"

// Forma de cada producto que devuelve la API (copiada del "Response body" de Swagger).
type ProductoApi = {
    id: number
    nombre: string
    descripcion: string
    ingredientes: string
    valorNutricional: string
    categoriaId: number
    proveedorId: number
    precio: number
    fechaVencimiento: string      // viene como texto, ej: "2027-12-31T00:00:00.000Z"
    descuento: number             // porcentaje, ej: 10 = 10%
    precioDescuento: number       // precio ya con el descuento aplicado
    imagen: string
    tipoConservacion: string      // "Ambiente", "Refrigerado" o "Congelado"
    valoracion: number
    favorito: boolean
}

// Componente que pide los productos a la API y muestra una tarjeta por cada uno.
function ProductosApi() {
    // Lista de productos. Empieza vacía ([]) porque todavía no llegan de la API.
    const [productos, setProductos] = useState<ProductoApi[]>([])
    // true mientras esperamos la respuesta de la API. Empieza en false: nadie ha pedido nada aún.
    const [cargando, setCargando] = useState(false)
    // Mensaje de error si algo falla. "" = no hay error.
    const [error, setError] = useState("")

    // Se ejecuta SOLO cuando el usuario presiona el botón 
    function cargarProductos() {
        setCargando(true)                             // mostramos "Cargando..." y bloqueamos el botón
        setError("")                                  // borramos un error anterior, si lo había

        fetch(URL_PRODUCTOS)                          // 1) le pedimos los datos a la API
            .then((respuesta) => {
                // respuesta.ok es true si el servidor respondió bien (código 200 a 299).
                if (!respuesta.ok) {
                    throw new Error("Error " + respuesta.status)  // saltamos directo al .catch
                }
                return respuesta.json()               // 2) convertimos el texto JSON a datos de JavaScript
            })
            .then((datos: ProductoApi[]) => {
                setProductos(datos)                   // 3) guardamos la lista → React vuelve a dibujar
            })
            .catch(() => {
                // Entra aquí si encuentra cualquier tipo de error al consultar la API(está caída o hubo un error en backend o interneet)
                setError("No pudimos cargar los productos. Intenta más tarde.")
            })
            .finally(() => {
                setCargando(false)                    // 4) haya salido bien o mal, ya terminó de cargar
            })
    }

    return (
        <>
        {/* onClick = qué hacer al apretar. disabled = el botón no se puede apretar mientras carga */}
        <button type="button" className="boton boton-secundario" onClick={cargarProductos} disabled={cargando}>
            {/* El texto cambia: si ya hay productos, el botón sirve para volver a cargarlos */}
            {cargando ? "Cargando..." : productos.length > 0 ? "Volver a cargar" : "Cargar productos desde la API"}
        </button>

        {/* Si hubo error, mostramos el mensaje */}
        {error && <p className="texto-muted">{error}</p>}

        {/* Una tarjeta (<article>) por cada producto. Si la lista está vacía, no se ve nada */}
        <section className="grilla-productos" aria-label="Productos desde la API">
            {/* map recorre la lista y devuelve una tarjeta por producto. key ayuda a React a distinguirlas */}
            {productos.map((producto) => (
                <article key={producto.id} className="tarjeta-base tarjeta-producto">
                    <div className="imagen-placeholder foto-producto">
                        <img src={producto.imagen} alt={producto.nombre} />
                    </div>
                    <div className="tarjeta-producto-cuerpo">
                        <h3>{producto.nombre}</h3>
                        <p className="texto-muted">{producto.descripcion}</p>
                        <p className="envio">Conservación: {producto.tipoConservacion}</p>
                        {/* "★".repeat(5) = "★★★★★": repite la estrella según la valoración */}
                        <p>{"★".repeat(producto.valoracion)}</p>
                        <div className="pie-tarjeta-producto">
                            {/* Si tiene descuento (mayor a 0) mostramos el precio rebajado y el % */}
                            {producto.descuento > 0 ? (
                                <p className="precio">
                                    {formatoPrecio(producto.precioDescuento)} <small>(-{producto.descuento}%)</small>
                                </p>
                            ) : (
                                <p className="precio">{formatoPrecio(producto.precio)}</p>
                            )}
                        </div>
                    </div>
                </article>
            ))}
        </section>
        </>
    )
}

export {CabeceraCatalogo, ProductosApi}
