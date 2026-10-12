import { TarjetaProductos } from "../components/card/card"
import { CabeceraCatalogo } from "../components/catalogo/catalogo"
import { FiltrosCatalogo } from "../components/catalogo/filtros"
import { Encabezado } from "../components/Header/header"
import "../components/estilosPLP/estilosPLP.css"
import { Footer } from "../components/footer/footer"



function PaginaCatalogo() {
    return(
    <>
    <Encabezado></Encabezado>
    <main className="contenedor">
    <CabeceraCatalogo></CabeceraCatalogo>
    <div className="contenedor-catalogo">
    <FiltrosCatalogo></FiltrosCatalogo>
    <section className="grilla-productos" aria-label="Productos">
    <TarjetaProductos></TarjetaProductos>
    <TarjetaProductos></TarjetaProductos>
    <TarjetaProductos></TarjetaProductos>
    <TarjetaProductos></TarjetaProductos>
    <TarjetaProductos></TarjetaProductos>
    <TarjetaProductos></TarjetaProductos>
    </section>
    </div>
    </main>
    <Footer></Footer>
    </>
    )
}

export {PaginaCatalogo}