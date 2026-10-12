import "../estilos/estilos.css"
import "./carrito.css"
import { formatoPrecio } from "./formato_precio"
import { Link } from "react-router"

// Un "type" describe la forma que deben tener los datos.
// Así TypeScript nos avisa si olvidamos un dato o usamos el tipo equivocado.

// 1) Los DATOS del producto: lo que la tarjeta muestra en pantalla.
type DatosProducto = {
    id: number        // número que identifica al producto (para el enlace a su página)
    nombre: string    // texto
    imagen: string    // dirección de la foto
    marca: string     // texto
    precio: number    // número (ej: 12990)
    meta: string      // texto con tipo de envío y fecha
    cantidad: number  // número de unidades
}

// 2) Las FUNCIONES que la tarjeta ejecuta al apretar un botón.
// "() => void" significa: una función que no recibe nada y no devuelve nada.
// La tarjeta no sabe qué hacen; solo las llama. Las define la página (Carrito.tsx).
type AccionesProducto = {
    onAgregar: () => void   // botón "+"
    onQuitar: () => void    // botón "−"
    onEliminar: () => void  // botón "Eliminar"
}

// 3) Las props de la tarjeta = los datos + las funciones.
// El símbolo "&" junta los dos types en uno solo.
type ProductoCarritoProps = DatosProducto & AccionesProducto

function ProductoCarrito({ id, nombre, imagen, marca, precio, meta, cantidad, onAgregar, onQuitar, onEliminar }: ProductoCarritoProps) {
    return(
      <article className="tarjeta-base tarjeta-producto-carrito">
        <Link to={`/producto/${id}`} className="imagen-placeholder foto-carrito">
          <img src={imagen} alt={nombre} />
        </Link>
        <div className="info-producto">
          <div className="encabezado-producto">
            <div>
              <h2><Link to={`/producto/${id}`}>{nombre}</Link></h2>
              <p className="marca-autor">{marca}</p>
            </div>
            <span className="precio">{formatoPrecio(precio)}</span>
          </div>

          <p className="meta-info">{meta}</p>

          <div className="acciones-producto">
            <div className="control-cantidad">
              <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Quitar uno" onClick={onQuitar} disabled={cantidad <= 1}>−</button>
              <input type="text" value={cantidad} readOnly className="input-cantidad" aria-label="Cantidad" />
              <button type="button" className="boton boton-terciario boton-icono boton-sm" aria-label="Agregar uno" onClick={onAgregar}>+</button>
            </div>
            <button type="button" className="boton boton-terciario boton-sm" onClick={onEliminar}>Eliminar</button>
          </div>
        </div>
      </article>
    )
}

export {ProductoCarrito}
