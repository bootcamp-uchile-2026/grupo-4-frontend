import "../estilos PDP/estilosPDP.css"


function PestañasIngredientes() {
    return(
        <section className="pestanas-seccion">
      <nav className="cabecera-pestanas">
        <a href="#descripcion" className="pestana activa" aria-current="true">Descripción</a>
        <a href="#ingredientes" className="pestana">Ingredientes</a>
        <a href="#conservacion" className="pestana">Conservación</a>
        <a href="#despacho" className="pestana">Despacho</a>
      </nav>
      <div className="contenido-pestana" id="descripcion">
        <p>Queso madurado de leche de vaca, con 6 meses de maduración mínima. Sabor intenso y textura firme.</p>
      </div>
    </section>
    )
}

export {PestañasIngredientes}