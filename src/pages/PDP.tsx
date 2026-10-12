
// useParams lee las partes variables de la dirección. Ej: en "/producto/3" nos da { id: "3" }.
import { Link, useParams } from "react-router";
import { Breadscrumbs } from "../components/breadscrumbs/breadcrumbs";
import { Footer } from "../components/footer/footer";
import { GaleriaImagenes } from "../components/galeria imagenes/galeria_imagenes";
import { Encabezado } from "../components/Header/header";
import { PestañasIngredientes } from "../components/PestañasIngredientes/Pestañas";
import { TarjetaProductor } from "../components/TarjetaProductor/tarjetaProductor";
import { TarjetasReseñas } from "../components/TarjetaReseñas/tarjetasReseñas";
import "../components/estilos PDP/estilosPDP.css"
import { productosTienda } from "../datos/productos";
import type { AgregarAlCarrito } from "../datos/productos";


type PaginaProductoProps = {
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App; la usa el botón "Agregar al carrito"
}

function PaginaProducto({ onAgregarAlCarrito }: PaginaProductoProps) {
    // "id" sale de la ruta "/producto/:id" definida en App.tsx.
    // Siempre llega como texto ("3"), por eso lo convertimos a número con Number().
    const { id } = useParams()

    // "find" busca en la lista el PRIMER producto que cumpla la condición.
    // Si no encuentra ninguno, devuelve undefined.
    const producto = productosTienda.find((p) => p.id === Number(id))

    // Si alguien escribe un id que no existe (ej: /producto/99), mostramos un aviso.
    if (!producto) {
        return (
            <>
            <Encabezado></Encabezado>
            <main className="contenedor">
              <h1>Producto no encontrado</h1>
              <p>El producto que buscas no existe o ya no está disponible.</p>
              <Link to="/catalogo" className="boton boton-primario">Ver todos los productos</Link>
            </main>
            <Footer></Footer>
            </>
        )
    }

    return(

        <>
        <Encabezado></Encabezado>
        <main className="contenedor">
        <Breadscrumbs producto={producto}></Breadscrumbs>
        {/* key={producto.id}: si cambiamos de producto, React crea la galería de nuevo
            y la cantidad vuelve a 1 (si no, se quedaría con la del producto anterior) */}
        <GaleriaImagenes key={producto.id} producto={producto} onAgregarAlCarrito={onAgregarAlCarrito}></GaleriaImagenes>
        <PestañasIngredientes></PestañasIngredientes>
        <TarjetaProductor></TarjetaProductor>
        <TarjetasReseñas></TarjetasReseñas>
        </main>
        <Footer></Footer>
        </>


    )
}

export {PaginaProducto}
