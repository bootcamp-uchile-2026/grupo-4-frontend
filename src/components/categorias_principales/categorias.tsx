// RESUMEN: sección "Categorías principales" del Home.
// Pide las categorías a la API y muestra una tarjeta con foto por cada una,
// que lleva al catálogo ya filtrado (ej: /catalogo?categoria=1).
import "../estilos/estilos.css"
import "../Header/header.css"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { URL_CATEGORIAS, URL_PRODUCTOS, fotoPrincipal } from "../../datos/api"
import type { CategoriaApi, ProductoApi } from "../../datos/api"
// Fotos propias de algunas categorías (Vite convierte cada foto en una dirección para usar en src).
import fotoLacteos from "../../assets/productos/quesos.jpg"
import fotoAceites from "../../assets/productos/aceites.jpg"
import fotoMermeladas from "../../assets/productos/mermeladas.jpg"

// Qué foto va con cada categoría. El nombre debe ser IGUAL al de la API (con mayúscula y tilde).
const fotosCategorias = [
    { categoria: "Lácteos", foto: fotoLacteos },
    { categoria: "Aceites", foto: fotoAceites },
    { categoria: "Mermeladas", foto: fotoMermeladas },
]

function Categorias(){
    // Lo que llega de la API. Empieza vacío.
    const [categorias, setCategorias] = useState<CategoriaApi[]>([])
    // Los productos solo los usamos para la foto de una categoría nueva que no tenga foto propia.
    const [productos, setProductos] = useState<ProductoApi[]>([])

    useEffect(() => {
        async function cargarCategorias() {
            try {
                const respuestaCategorias = await fetch(URL_CATEGORIAS)
                if (!respuestaCategorias.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datosCategorias = await respuestaCategorias.json()

                const respuestaProductos = await fetch(URL_PRODUCTOS)
                if (!respuestaProductos.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datosProductos = await respuestaProductos.json()

                setCategorias(datosCategorias)
                setProductos(datosProductos)
            } catch (error) {
                // Si falla, la sección queda vacía (el resto del Home sigue funcionando).
                console.error("Error:", error)
            }
        }
        cargarCategorias()
    }, [])

    // Elige la foto de una categoría:
    // 1) su foto propia (lista de arriba); 2) si no tiene, la del primer producto de esa categoría
    //    que tenga foto; 3) si tampoco hay, "" (queda el cuadro gris).
    function fotoDeCategoria(categoria: CategoriaApi) {
        const fotoPropia = fotosCategorias.find((item) => item.categoria === categoria.nombre)
        if (fotoPropia) {
            return fotoPropia.foto
        }
        const productoConFoto = productos.find((producto) => producto.categoriaId === categoria.id && fotoPrincipal(producto))
        if (productoConFoto) {
            return fotoPrincipal(productoConFoto)
        }
        return ""
    }

    // Si todavía no llegan (o la API falló), no dibujamos la sección.
    if (categorias.length === 0) {
        return null
    }

    return(
<section className="contenedor seccion">
      <div className="cabecera-seccion">
        <h2>Categorías principales</h2>
        <Link to="/catalogo" className="enlace-texto">Ver todas</Link>
      </div>
      <div className="grilla-categorias">
        {categorias.map((categoria) => {
            const foto = fotoDeCategoria(categoria)

            return (
              // El link lleva al catálogo YA filtrado por el id. Ej: /catalogo?categoria=1
              // (el catálogo lee ese "?categoria=" con useSearchParams, ver pages/PLP.tsx)
              <Link key={categoria.id} to={`/catalogo?categoria=${categoria.id}`} className="tarjeta-base tarjeta-categoria">
                <div className="imagen-placeholder">
                  {/* "foto &&": solo dibuja la foto si encontró una ("" cuenta como falso) */}
                  {foto && <img src={foto} alt="" />}
                </div>
                <p>{categoria.nombre}</p>
              </Link>
            )
        })}
      </div>
    </section>

    )
}

export {Categorias}
