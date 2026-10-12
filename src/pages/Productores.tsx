// Componentes que arman la página. Cada uno es una parte de la pantalla.
import { Encabezado } from "../components/Header/header"                                  // barra de navegación superior
import { TarjetaProductorResumen } from "../components/productores/tarjeta_productor_resumen" // tarjeta de cada productor
import { Footer } from "../components/footer/footer"                                      // pie de página
import { productores } from "../datos/productores"
import "../components/Header/header.css"
import "../components/productores/productores.css"

// Página /productores: lista de todos los productores.
function PaginaProductores() {
    return(
        <>
        <Encabezado></Encabezado>

        <main className="contenedor">
          <section className="titulo-productores">
            <p className="texto-eyebrow">Productores</p>
            <h1>Conoce a quienes hacen tus productos</h1>
            <p>Productores locales que elaboran cada producto a mano y en pequeñas cantidades.</p>
          </section>

          <div className="grilla-productores">
            {/* conDescripcion={true}: aquí sí mostramos la frase corta de cada uno */}
            {productores.map((productor) => (
              <TarjetaProductorResumen key={productor.id} productor={productor} conDescripcion={true}></TarjetaProductorResumen>
            ))}
          </div>
        </main>

        <Footer></Footer>
        </>
    )
}

export {PaginaProductores}
