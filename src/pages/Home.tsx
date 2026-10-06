import { Confianza } from "../components/banner_confianza/confianza"
import { ProductoresBanner } from "../components/banner_productores/banner_productores"
import { Carrusel } from "../components/carrusel/carrusel"
import { Categorias } from "../components/categorias_principales/categorias"
import { Footer } from "../components/footer/footer"
import { Encabezado } from "../components/Header/header"
import { Newsletter } from "../components/newsletter/newsletter"
import { Destacados } from "../components/productos_destacados/productos_destacados"


function HomePage(){
    return(
        <>
        <Encabezado></Encabezado>
        <Carrusel></Carrusel>
        <Confianza></Confianza>
        <Categorias></Categorias>
        <Destacados></Destacados>
        <ProductoresBanner></ProductoresBanner>
        <Newsletter></Newsletter>
        <Footer></Footer>
        </>
    )
}

export {HomePage}
