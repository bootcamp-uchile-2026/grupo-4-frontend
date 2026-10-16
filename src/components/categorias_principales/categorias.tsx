import "../estilos/estilos.css"
import "../Header/header.css"
import { Link } from "react-router"
import { categorias, productosTienda } from "../../datos/productos"

// "Categorías principales" del Home.
//
// Antes las 5 categorías estaban escritas a mano (incluía "Conservas" y "Vinos",
// que no tienen productos y llevaban a un catálogo vacío).
// Ahora usamos la lista "categorias" que se arma sola a partir de los productos
// (ver datos/productos.ts). Si mañana se agrega un vino, aparece "Vinos" aquí sin tocar este archivo.
function Categorias(){
    return(
<section className="contenedor seccion">
      <div className="cabecera-seccion">
        <h2>Categorías principales</h2>
        <Link to="/catalogo" className="enlace-texto">Ver todas</Link>
      </div>
      <div className="grilla-categorias">
        {categorias.map((categoria) => {
            // Para la foto de la categoría usamos la del PRIMER producto de esa categoría.
            // "find" devuelve el primero que cumple la condición.
            const productoEjemplo = productosTienda.find((producto) => producto.categoria === categoria)

            return (
              // El link lleva al catálogo YA filtrado. Ej: /catalogo?categoria=Quesos
              // (el catálogo lee ese "?categoria=" con useSearchParams, ver pages/PLP.tsx)
              <Link key={categoria} to={`/catalogo?categoria=${categoria}`} className="tarjeta-base tarjeta-categoria">
                <div className="imagen-placeholder">
                  {/* "productoEjemplo &&": solo dibuja la foto si encontró un producto */}
                  {productoEjemplo && <img src={productoEjemplo.imagen} alt="" />}
                </div>
                <p>{categoria}</p>
              </Link>
            )
        })}
      </div>
    </section>

    )
}

export {Categorias}
