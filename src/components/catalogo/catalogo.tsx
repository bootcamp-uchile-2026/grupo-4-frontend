import "../estilosPLP/estilosPLP.css"

function CabeceraCatalogo() {
    return(
        <div className="cabecera-catalogo">
      <div>
        <p className="texto-eyebrow">Productos</p>
        <h1>Quesos Artesanales</h1>
      </div>
      <div className="acciones-catalogo">
        <button type="button" className="boton boton-secundario">Filtros</button>
        <button type="button" className="boton boton-secundario">Ordenar por destacados</button>
      </div>
    </div>
    )
}

export {CabeceraCatalogo}