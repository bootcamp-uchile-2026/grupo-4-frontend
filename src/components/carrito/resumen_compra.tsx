import "../estilos/estilos.css"
import "./carrito.css"
import { formatoPrecio } from "./formato_precio"
import { Link } from "react-router"

type ResumenCompraProps = {
    subtotal: number
}

function ResumenCompra({ subtotal }: ResumenCompraProps) {
    return(
    <aside className="columna-lateral">
      <div className="tarjeta-base tarjeta-resumen-compra">
        <h2>Resumen de compra</h2>
        <div className="linea-resumen">
          <span>Productos</span>
          <span>{formatoPrecio(subtotal)}</span>
        </div>
        <div className="linea-resumen">
          <span>Despacho</span>
          <span className="monto-subtexto">Se calcula en el checkout</span>
        </div>
        <hr className="divisor-resumen" />
        <div className="linea-resumen total">
          <span>Total</span>
          <span>{formatoPrecio(subtotal)}</span>
        </div>
        <Link to="/checkout" className="boton boton-primario boton-lg boton-bloque">Ir al checkout</Link>
        <a href="../PLP/catalogo.html" className="boton boton-terciario boton-bloque">Seguir comprando</a>
        <p className="nota-seguridad">🔒 Compra 100% segura</p>
      </div>
    </aside>
    )
}

export {ResumenCompra}
