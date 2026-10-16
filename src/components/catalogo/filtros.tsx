import "../estilosPLP/estilosPLP.css"
import { productores } from "../../datos/productores"
import { categorias } from "../../datos/productos"

type FiltrosCatalogoProps = {
    categoriasElegidas: string[]                 // categorías marcadas, ej: ["Quesos"]
    productoresElegidos: number[]                // id de los productores marcados, ej: [1, 3]
    onCambiarCategoria: (categoria: string) => void  // se llama al marcar o desmarcar una categoría
    onCambiarProductor: (id: number) => void         // se llama al marcar o desmarcar un productor
    onLimpiar: () => void                            // desmarca todo
}

// Los checkboxes de la izquierda del catálogo.
// No guardan nada: solo muestran lo que les dice la página y le avisan cuando cambia algo.
function FiltrosCatalogo({ categoriasElegidas, productoresElegidos, onCambiarCategoria, onCambiarProductor, onLimpiar }: FiltrosCatalogoProps){
    return(
        <aside className="filtros" aria-label="Filtros">
        <fieldset className="grupo-filtros">
          <legend>Categorías</legend>
          {categorias.map((categoria) => (
            <label key={categoria} className="filtro-opcion">
              {/* checked = si está marcado o no. Está marcado si la categoría está en la lista de elegidas */}
              <input
                type="checkbox"
                name="categoria"
                value={categoria}
                checked={categoriasElegidas.includes(categoria)}
                onChange={() => onCambiarCategoria(categoria)}
              /> {categoria}
            </label>
          ))}
        </fieldset>

        <fieldset className="grupo-filtros">
          <legend>Productores</legend>
          {productores.map((productor) => (
            <label key={productor.id} className="filtro-opcion">
              <input
                type="checkbox"
                name="productor"
                value={productor.id}
                checked={productoresElegidos.includes(productor.id)}
                onChange={() => onCambiarProductor(productor.id)}
              /> {productor.nombre}
            </label>
          ))}
        </fieldset>

        <button type="button" className="boton boton-terciario boton-sm" onClick={onLimpiar}>Limpiar filtros</button>
      </aside>

    )
}

export {FiltrosCatalogo}
