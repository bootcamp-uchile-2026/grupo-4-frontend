import "../estilos/estilos.css"
import "./suscripcion.css"

// Lo que incluye cualquier plan. Agregar uno nuevo es solo sumar una línea aquí.
const beneficios = [
    "Despacho refrigerado",
    "Productos de temporada",
    "Pausa o cancela cuando quieras",
    "Ahorra comprando con precio unitario",
]

function Beneficios() {
    return(
      <section className="tarjeta-suave contenedor-beneficios">
        <h2>Qué incluye</h2>
        <ul className="lista-beneficios">
          {beneficios.map((beneficio) => (
            <li key={beneficio}>✓ {beneficio}</li>
          ))}
        </ul>
        <a href="#como-funciona" className="boton boton-terciario">
          Ver cómo funciona la suscripción
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </a>
      </section>
    )
}

export {Beneficios}
