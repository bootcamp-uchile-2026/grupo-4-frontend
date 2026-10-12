import "../estilosPLP/estilosPLP.css"

function FiltrosCatalogo(){
    return(
        <aside className="filtros" aria-label="Filtros">
        <fieldset className="grupo-filtros">
          <legend>Categorías</legend>
        <label className="filtro-opcion">
          <input type="checkbox" name="categoria" value="quesos"/> Quesos
        </label>
        <label className="filtro-opcion">
          <input type="checkbox" name="categoria" value="conservas"/> Conservas
        </label>
        <label className="filtro-opcion">
          <input type="checkbox" name="categoria" value="dulces"/> Dulces
        </label>
        <label className="filtro-opcion">
          <input type="checkbox" name="categoria" value="aceites"/> Aceites
        </label>
        <label className="filtro-opcion">
          <input type="checkbox" name="categoria" value="otros"/> Otros
        </label>
        </fieldset>
        <fieldset className="grupo-filtros">
          <legend>Productores</legend>
        <label className="filtro-opcion">
          <input type="checkbox" name="productor" value="Pepito"/> Pepito
        </label>
        <label className="filtro-opcion">
          <input type="checkbox" name="productor" value="Juanito"/> Juanito
        </label>
        <label className="filtro-opcion">
          <input type="checkbox" name="productor" value="Dieguito"/> Dieguito
        </label>
        </fieldset>
      </aside>

    )
}

export {FiltrosCatalogo}