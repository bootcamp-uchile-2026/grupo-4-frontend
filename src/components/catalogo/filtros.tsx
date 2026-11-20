// RESUMEN: los checkboxes de la izquierda del catálogo (Categorías y Productores).
// No guardan nada: solo muestran lo que les dice la página y le avisan cuando cambia algo.
import "../estilosPLP/estilosPLP.css"
import type { CategoriaApi, ProveedorApi } from "../../datos/api"

type FiltrosCatalogoProps = {
    categorias: CategoriaApi[]                   // las categorías que llegaron de la API
    categoriasElegidas: number[]                 // id de las categorías marcadas, ej: [1]
    onCambiarCategoria: (id: number) => void     // se llama al marcar o desmarcar una categoría
    proveedores: ProveedorApi[]                  // los productores que llegaron de la API
    productoresElegidos: number[]                // id de los productores marcados, ej: [1, 3]
    onCambiarProductor: (id: number) => void     // se llama al marcar o desmarcar un productor
    onLimpiar: () => void                        // desmarca todo
}

function FiltrosCatalogo({ categorias, categoriasElegidas, onCambiarCategoria, proveedores, productoresElegidos, onCambiarProductor, onLimpiar }: FiltrosCatalogoProps){
    return(
        <aside className="filtros" aria-label="Filtros">
        <fieldset className="grupo-filtros">
          <legend>Categorías</legend>
          {categorias.map((categoria) => (
            <label key={categoria.id} className="filtro-opcion">
              {/* Está marcada si su id está en la lista de elegidas */}
              <input
                type="checkbox"
                name="categoria"
                value={categoria.id}
                checked={categoriasElegidas.includes(categoria.id)}
                onChange={() => onCambiarCategoria(categoria.id)}
              /> {categoria.nombre}
            </label>
          ))}
        </fieldset>

        <fieldset className="grupo-filtros">
          <legend>Productores</legend>
          {proveedores.map((proveedor) => (
            <label key={proveedor.id} className="filtro-opcion">
              {/* checked = si está marcado o no. Está marcado si su id está en la lista de elegidos */}
              <input
                type="checkbox"
                name="productor"
                value={proveedor.id}
                checked={productoresElegidos.includes(proveedor.id)}
                onChange={() => onCambiarProductor(proveedor.id)}
              /> {proveedor.nombre}
            </label>
          ))}
        </fieldset>

        <button type="button" className="boton boton-terciario boton-sm" onClick={onLimpiar}>Limpiar filtros</button>
      </aside>

    )
}

export {FiltrosCatalogo}
