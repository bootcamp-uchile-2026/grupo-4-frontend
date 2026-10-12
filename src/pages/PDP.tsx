
import { Breadscrumbs } from "../components/breadscrumbs/breadcrumbs";
import { Footer } from "../components/footer/footer";
import { GaleriaImagenes } from "../components/galeria imagenes/galeria_imagenes";
import { Encabezado } from "../components/Header/header";
import { PestañasIngredientes } from "../components/PestañasIngredientes/Pestañas";
import { TarjetaProductor } from "../components/TarjetaProductor/tarjetaProductor";
import { TarjetasReseñas } from "../components/TarjetaReseñas/tarjetasReseñas";
import "../components/estilos PDP/estilosPDP.css"


function PaginaProducto() {
    return(

        <>
        <Encabezado></Encabezado>
        <main className="contenedor">
        <Breadscrumbs></Breadscrumbs>
        <GaleriaImagenes></GaleriaImagenes>
        <PestañasIngredientes></PestañasIngredientes>
        <TarjetaProductor></TarjetaProductor>
        <TarjetasReseñas></TarjetasReseñas>
        </main>
        <Footer></Footer>
        </>
        

    )
}

export {PaginaProducto}