import "../estilos/estilos.css"
import "../Header/header.css"

function Confianza() {
    return(
<section className="franja-confianza" aria-label="Por qué comprar en La Sobremesa">
      <ul className="contenedor franja-confianza-lista">
        <li><span aria-hidden="true">🌿</span> Productores locales</li>
        <li><span aria-hidden="true">🥣</span> Ingredientes reales</li>
        <li><span aria-hidden="true">📦</span> Envío cuidadoso</li>
        <li><span aria-hidden="true">🔒</span> Pago seguro</li>
      </ul>
    </section>

    )
}

export {Confianza}