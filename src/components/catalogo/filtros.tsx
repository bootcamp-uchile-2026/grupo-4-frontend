import "../estilosPLP/estilosPLP.css"
import type { ProveedorApi } from "../../datos/api"

type FiltrosCatalogoProps = {
    proveedores: ProveedorApi[]                  // los productores que llegaron de la API
    productoresElegidos: number[]                // id de los productores marcados, ej: [1, 3]
    onCambiarProductor: (id: number) => void     // se llama al marcar o desmarcar un productor
    onLimpiar: () => void                        // desmarca todo
}

// Los checkboxes de la izquierda del catálogo.
// No guardan nada: solo muestran lo que les dice la página y le avisan cuando cambia algo.
// (El filtro de Categorías se sacó: la API todavía no entrega los nombres de las categorías).
function FiltrosCatalogo({ proveedores, productoresElegidos, onCambiarProductor, onLimpiar }: FiltrosCatalogoProps){
    return(
        <aside className="filtros" aria-label="Filtros">
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
