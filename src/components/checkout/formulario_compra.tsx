import { useState } from "react"
import { Link } from "react-router"
import { z } from "zod"  // Zod: librería para revisar (validar) que los datos tengan el formato correcto
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

// "Esquema" de Zod: son las reglas que debe cumplir cada campo del formulario.
// z.object({...}) dice: "esto es un objeto con estos campos".
const esquemaCompra = z.object({
    // nombre: texto, sin espacios sobrantes (.trim), con al menos 3 letras.
    nombre: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres"),
    // email: texto que tenga forma de correo (algo@algo.cl).
    email: z.email("Ingresa un correo válido, por ejemplo tu@email.com"),
    // telefono: debe calzar con el patrón de un celular chileno: +56 9 1234 5678.
    // El "regex" es un patrón: \+? = un "+" opcional, \s? = un espacio opcional, \d{4} = 4 números.
    telefono: z.string().trim().regex(/^\+?56\s?9\s?\d{4}\s?\d{4}$/, "Ingresa un celular válido: +56 9 1234 5678"),
    // direccion: texto con al menos 5 caracteres.
    direccion: z.string().trim().min(5, "Ingresa información mas detallada  de tu dirección"),
})

// Tipo para guardar los mensajes de error. El "?" significa que cada campo puede no tener error.
type ErroresFormulario = {
    nombre?: string
    email?: string
    telefono?: string
    direccion?: string
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

    // Aquí guardamos los mensajes de error de Zod. Empieza vacío ({}) = sin errores.
    const [errores, setErrores] = useState<ErroresFormulario>({})

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

        // Le pasamos a Zod los datos escritos. safeParse NO lanza error: devuelve un resultado
        // con "success" = true (todo bien) o false (algo falló).
        const resultado = esquemaCompra.safeParse({ nombre, email, telefono, direccion })

        if (!resultado.success) {
            // Si falló, armamos un objeto con un mensaje por cada campo malo.
            const nuevosErrores: ErroresFormulario = {}
            // resultado.error.issues es la lista de problemas que encontró Zod.
            for (const problema of resultado.error.issues) {
                // problema.path[0] es el nombre del campo con error (ej: "email").
                const campo = problema.path[0] as keyof ErroresFormulario
                // Guardamos solo el primer error de cada campo (si ya hay uno, no lo pisamos).
                if (!nuevosErrores[campo]) {
                    nuevosErrores[campo] = problema.message
                }
            }
            setErrores(nuevosErrores)  // mostramos los errores en pantalla
            return                     // cortamos aquí: NO se hace la compra
        }

        setErrores({})  // si todo está bien, borramos errores anteriores

        // Armamos el pedido con todo lo necesario para mostrarlo en "Mi cuenta".
        const pedido: Pedido = {
            numero: numeroAlAzar(),                              // número de pedido de 5 dígitos
            entrega: fechaEnDias(3) + " – " + fechaEnDias(5),     // llega entre 3 y 5 días más
            productos: productos,
            total: total,
            nombre: resultado.data.nombre,         // usamos los datos ya revisados por Zod
            email: resultado.data.email,
            direccion: resultado.data.direccion,
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

        {/* noValidate apaga la validación del navegador, para que la haga Zod */}
        <form onSubmit={confirmarCompra} noValidate>
          {/* value = lo que muestra el input. onChange = qué hacer cuando el usuario escribe. */}
          <div className="campo-form">
            <label htmlFor="invitado-nombre">Nombre completo</label>
            <input id="invitado-nombre" type="text" className="campo"
              value={nombre} onChange={(evento) => setNombre(evento.target.value)} />
            {/* Si hay error en este campo, lo mostramos debajo del input */}
            {errores.nombre && <p className="mensaje-error">{errores.nombre}</p>}
          </div>

          <div className="campo-form">
            <label htmlFor="invitado-email">Correo electrónico</label>
            <input id="invitado-email" type="email" className="campo" placeholder="tu@email.com"
              value={email} onChange={(evento) => setEmail(evento.target.value)} />
            {/* Si hay error en este campo, lo mostramos debajo del input */}
            {errores.email && <p className="mensaje-error">{errores.email}</p>}
          </div>

          <div className="campo-form">
            <label htmlFor="invitado-telefono">Teléfono</label>
            <input id="invitado-telefono" type="tel" className="campo" placeholder="+56 9 1234 5678"
              value={telefono} onChange={(evento) => setTelefono(evento.target.value)} />
            {/* Si hay error en este campo, lo mostramos debajo del input */}
            {errores.telefono && <p className="mensaje-error">{errores.telefono}</p>}
          </div>

          <div className="campo-form">
            <label htmlFor="invitado-direccion">Dirección de entrega</label>
            <input id="invitado-direccion" type="text" className="campo" placeholder="Calle, número, comuna"
              value={direccion} onChange={(evento) => setDireccion(evento.target.value)} />
            {/* Si hay error en este campo, lo mostramos debajo del input */}
            {errores.direccion && <p className="mensaje-error">{errores.direccion}</p>}
          </div>

          <button type="submit" className="boton boton-primario boton-lg boton-bloque">
            Confirmar compra · {formatoPrecio(total)}
          </button>
        </form>
      </div>
    )
}

export {FormularioCompra}
