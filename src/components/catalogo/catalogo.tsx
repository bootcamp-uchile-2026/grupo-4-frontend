import "../estilosPLP/estilosPLP.css"

type CabeceraCatalogoProps = {
    titulo: string                            // cambia según los filtros, ej: "Quesos" o "Todos los productos"
    cantidad: number                          // cuántos productos se están mostrando
    orden: string                             // el orden elegido, ej: "precio-menor"
    onCambiarOrden: (orden: string) => void   // se llama al elegir otra opción del selector
    filtrosAbiertos: boolean                  // true = el panel de filtros se ve
    onAlternarFiltros: () => void             // abre o cierra el panel de filtros
}

// Opciones del selector "Ordenar por": valor (lo que va en la URL) y texto (lo que se ve).
const opcionesOrden = [
    { valor: "destacados", texto: "Destacados" },
    { valor: "precio-menor", texto: "Precio: menor a mayor" },
    { valor: "precio-mayor", texto: "Precio: mayor a menor" },
    { valor: "nombre", texto: "Nombre: A a Z" },
]

function CabeceraCatalogo({ titulo, cantidad, orden, onCambiarOrden, filtrosAbiertos, onAlternarFiltros }: CabeceraCatalogoProps) {
    return(
        <div className="cabecera-catalogo">
      <div>
        <p className="texto-eyebrow">Productos</p>
        <h1>{titulo}</h1>
        <p className="texto-muted">{cantidad} {cantidad === 1 ? "producto" : "productos"}</p>
      </div>
      <div className="acciones-catalogo">
        {/* aria-expanded le dice a los lectores de pantalla si el panel está abierto */}
        <button type="button" className="boton boton-secundario" onClick={onAlternarFiltros} aria-expanded={filtrosAbiertos}>
          {filtrosAbiertos ? "Ocultar filtros" : "Mostrar filtros"}
        </button>

        <label className="selector-orden">
          <span>Ordenar por</span>
          {/* evento.target.value = el "value" de la opción elegida */}
          <select className="campo" value={orden} onChange={(evento) => onCambiarOrden(evento.target.value)}>
            {opcionesOrden.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>{opcion.texto}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
    )
}

export {CabeceraCatalogo}
