import "../estilos/estilos.css"
import "./cuenta.css"

// Los 4 accesos rápidos. Agregar uno nuevo es solo sumar una línea aquí.
const accesos = [
    { icono: "📦", texto: "Mis pedidos", enlace: "#mis-pedidos" },
    { icono: "♡", texto: "Favoritos", enlace: "#favoritos" },
    { icono: "📍", texto: "Direcciones", enlace: "#direcciones" },
    { icono: "💳", texto: "Métodos de pago", enlace: "#metodos-pago" },
]

function AccesosRapidos() {
    return(
      <section className="seccion-cuenta">
        <h2>Accesos rápidos</h2>
        <div className="grilla-accesos">
          {accesos.map((acceso) => (
            <a key={acceso.texto} href={acceso.enlace} className="tarjeta-base tarjeta-acceso-rapido">
              <span className="icono-acceso" aria-hidden="true">{acceso.icono}</span>
              <span>{acceso.texto}</span>
            </a>
          ))}
        </div>
      </section>
    )
}

export {AccesosRapidos}
