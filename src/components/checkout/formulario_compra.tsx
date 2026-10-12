import { useState } from "react"
import { Link } from "react-router"
import type { Pedido, Producto } from "../../datos/carrito"
import { fechaEnDias } from "../../datos/fechas"
import type { Usuario } from "../../datos/usuario"
import { formatoPrecio } from "../carrito/formato_precio"
import "../estilos/estilos.css"
import "./checkout.css"

type FormularioCompraProps = {
    productos: Producto[]           // lo que hay en el carrito
    usuario: Usuario | null         // el usuario con cuenta, o null si compra como invitado
    onCompraFinalizada: (pedido: Pedido) => void  // le entrega el pedido a App (lo guarda y vacía el carrito)
}

// Devuelve un número al azar entre 10000 y 99999 (para el número de pedido).
function numeroAlAzar() {
    return Math.floor(Math.random() * 90000) + 10000
}

// Formulario de compra. Sirve para el invitado y para el usuario con cuenta.
function FormularioCompra({ productos, usuario, onCompraFinalizada }: FormularioCompraProps) {
    // Un estado por cada campo del formulario.
    // Si hay usuario, nombre y email empiezan ya escritos con sus datos.
    // Si no hay (invitado), empiezan vacíos ("").
    const [nombre, setNombre] = useState(usuario ? usuario.nombre : "")
    const [email, setEmail] = useState(usuario ? usuario.email : "")
    const [telefono, setTelefono] = useState("")
    const [direccion, setDireccion] = useState("")

    // Guardamos el total pagado. Mientras sea 0, todavía no se ha comprado.
    // (Lo guardamos aparte porque al vaciar el carrito el total pasa a 0).
    const [totalPagado, setTotalPagado] = useState(0)
    const [numeroPedido, setNumeroPedido] = useState(0)

    // Calculamos el total del carrito.
    let total = 0
    for (const producto of productos) {
        total += producto.precio * producto.cantidad
    }

    // Se ejecuta al apretar "Confirmar compra".
    function confirmarCompra(evento: React.FormEvent<HTMLFormElement>) {
        evento.preventDefault()  // evita que el navegador recargue la página

        // Armamos el pedido con todo lo necesario para mostrarlo en "Mi cuenta".
        const pedido: Pedido = {
            numero: numeroAlAzar(),                              // número de pedido de 5 dígitos
            entrega: fechaEnDias(3) + " – " + fechaEnDias(5),     // llega entre 3 y 5 días más
            productos: productos,
            total: total,
            nombre: nombre,
            email: email,
            direccion: direccion,
        }

        setNumeroPedido(pedido.numero)  // para mostrarlo en el mensaje de éxito
        setTotalPagado(total)           // recordamos cuánto se pagó
        onCompraFinalizada(pedido)      // App guarda el pedido y vacía el carrito
    }

    // CASO 1: la compra ya se hizo → mostramos el mensaje de éxito.
    if (totalPagado > 0) {
        return (
          <div className="tarjeta-base seccion-registro mensaje-compra">
            <h2>¡Gracias por tu compra, {nombre}! 🎉</h2>
            <p>Pedido <strong>#{numeroPedido}</strong> · Pagaste <strong>{formatoPrecio(totalPagado)}</strong>.</p>
            <p>Te enviamos el detalle a <strong>{email}</strong>.</p>
            <p>Lo despacharemos a: {direccion}</p>
            {/* Este botón lleva a "Mi cuenta", donde aparece el pedido recién hecho */}
            <Link to="/cuenta" className="boton boton-primario boton-bloque">Ver mi pedido en Mi cuenta</Link>
            <Link to="/" className="boton boton-terciario boton-bloque">Volver al inicio</Link>
          </div>
        )
    }

    // CASO 2: el carrito está vacío → no hay nada que comprar.
    if (productos.length === 0) {
        return (
          <div className="tarjeta-base seccion-registro mensaje-compra">
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos antes de comprar.</p>
            <Link to="/" className="boton boton-primario boton-bloque">Ver productos</Link>
          </div>
        )
    }

    // CASO 3: hay productos → mostramos el formulario.
    return(
      <div className="tarjeta-base seccion-registro">
        {/* El título cambia según si tiene cuenta o no */}
        <h2>{usuario ? "Completa tu compra" : "Comprar como invitado"}</h2>

        {/* Resumen de lo que se va a comprar */}
        <ul className="resumen-invitado">
          {productos.map((producto) => (
            <li key={producto.id}>
              <span>{producto.nombre} × {producto.cantidad}</span>
              <span>{formatoPrecio(producto.precio * producto.cantidad)}</span>
            </li>
          ))}
          <li className="resumen-invitado-total">
            <span>Total</span>
            <span>{formatoPrecio(total)}</span>
          </li>
        </ul>

        <form onSubmit={confirmarCompra}>
          {/* value = lo que muestra el input. onChange = qué hacer cuando el usuario escribe. */}
          <div className="campo-form">
            <label htmlFor="invitado-nombre">Nombre completo</label>
            <input id="invitado-nombre" type="text" className="campo" required
              value={nombre} onChange={(evento) => setNombre(evento.target.value)} />
          </div>

          <div className="campo-form">
            <label htmlFor="invitado-email">Correo electrónico</label>
            <input id="invitado-email" type="email" className="campo" placeholder="tu@email.com" required
              value={email} onChange={(evento) => setEmail(evento.target.value)} />
          </div>

          <div className="campo-form">
            <label htmlFor="invitado-telefono">Teléfono</label>
            <input id="invitado-telefono" type="tel" className="campo" placeholder="+56 9 1234 5678" required
              value={telefono} onChange={(evento) => setTelefono(evento.target.value)} />
          </div>

          <div className="campo-form">
            <label htmlFor="invitado-direccion">Dirección de entrega</label>
            <input id="invitado-direccion" type="text" className="campo" placeholder="Calle, número, comuna" required
              value={direccion} onChange={(evento) => setDireccion(evento.target.value)} />
          </div>

          <button type="submit" className="boton boton-primario boton-lg boton-bloque">
            Confirmar compra · {formatoPrecio(total)}
          </button>
        </form>
      </div>
    )
}

export {FormularioCompra}
