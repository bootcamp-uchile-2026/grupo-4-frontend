import { TarjetaProductos } from "../components/card/card"
import { CabeceraCatalogo } from "../components/catalogo/catalogo"
import { FiltrosCatalogo } from "../components/catalogo/filtros"
import { Encabezado } from "../components/Header/header"
import "../components/estilosPLP/estilosPLP.css"
import { Footer } from "../components/footer/footer"
import { productosTienda } from "../datos/productos"
import type { AgregarAlCarrito } from "../datos/productos"



type PaginaCatalogoProps = {
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App; se la pasamos a cada tarjeta
}

function PaginaCatalogo({ onAgregarAlCarrito }: PaginaCatalogoProps) {
    return(
    <>
    <Encabezado></Encabezado>
    <main className="contenedor">
    <CabeceraCatalogo></CabeceraCatalogo>
    <div className="contenedor-catalogo">
    <FiltrosCatalogo></FiltrosCatalogo>
    <section className="grilla-productos" aria-label="Productos">
    {/* Una tarjeta por cada producto de la tienda */}
    {productosTienda.map((producto) => (
      <TarjetaProductos key={producto.id} producto={producto} onAgregarAlCarrito={onAgregarAlCarrito}></TarjetaProductos>
    ))}
    </section>
    </div>
    </main>
    <Footer></Footer>
    </>
    )
}

export {PaginaCatalogo}