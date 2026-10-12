// useParams lee las partes variables de la dirección. Ej: en "/productores/2" nos da { id: "2" }.
import { Link, useParams } from "react-router"

// Componentes que arman la página. Cada uno es una parte de la pantalla.
import { Encabezado } from "../components/Header/header"   // barra de navegación superior
import { TarjetaProductos } from "../components/card/card"   // tarjeta de producto del catálogo
import { Footer } from "../components/footer/footer"       // pie de página
import { productores } from "../datos/productores"
import { productosTienda } from "../datos/productos"
import type { AgregarAlCarrito } from "../datos/productos"
import "../components/estilosPLP/estilosPLP.css"
import "../components/productores/productores.css"

type PaginaProductorProps = {
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App; se la pasamos a cada tarjeta de producto
}

// Página /productores/:id: la historia de un productor y sus productos.
function PaginaProductor({ onAgregarAlCarrito }: PaginaProductorProps) {
    // "id" llega como texto ("2"), por eso lo convertimos a número con Number().
    const { id } = useParams()
    const productor = productores.find((p) => p.id === Number(id))

    // Si el id no existe (ej: /productores/99), mostramos un aviso.
    if (!productor) {
        return (
            <>
            <Encabezado></Encabezado>
            <main className="contenedor">
              <h1>Productor no encontrado</h1>
              <Link to="/productores" className="boton boton-primario">Ver todos los productores</Link>
            </main>
            <Footer></Footer>
            </>
        )
    }

    // "filter" se queda con TODOS los productos que cumplen la condición
    // (a diferencia de "find", que devuelve solo el primero).
    const susProductos = productosTienda.filter((producto) => producto.productorId === productor.id)

    return(
        <>
        <Encabezado></Encabezado>

        <main className="contenedor">
          <section className="perfil-productor">
            <div className="imagen-placeholder avatar-productor" aria-hidden="true">{productor.nombre[0]}</div>
            <div>
              <p className="texto-eyebrow">{productor.ubicacion}</p>
              <h1>{productor.nombre}</h1>
            </div>
          </section>

          <section className="tarjeta-suave historia-productor">
            <h2>Su historia</h2>
            <p>{productor.historia}</p>
          </section>

          <section className="productos-productor">
            <h2>Productos de {productor.nombre}</h2>
            <div className="grilla-productos">
              {susProductos.map((producto) => (
                <TarjetaProductos key={producto.id} producto={producto} onAgregarAlCarrito={onAgregarAlCarrito}></TarjetaProductos>
              ))}
            </div>
          </section>

          <Link to="/productores" className="boton boton-terciario">← Ver todos los productores</Link>
        </main>

        <Footer></Footer>
        </>
    )
}

export {PaginaProductor}
