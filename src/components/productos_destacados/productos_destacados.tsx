// RESUMEN: sección "Productos destacados" del Home.
// Pide a la API los productos más vendidos (GET /productos/top-ventas) y muestra los 3 primeros,
// cada uno con su botón "Agregar" al carrito.
import "../estilos/estilos.css"
import "../Header/header.css"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import { formatoPrecio } from "../carrito/formato_precio"
import { URL_PRODUCTOS, URL_PROVEEDORES, fotoPrincipal } from "../../datos/api"
import type { ProductoApi, ProveedorApi } from "../../datos/api"
import type { AgregarAlCarrito } from "../../datos/carrito"

type DestacadosProps = {
    onAgregarAlCarrito: AgregarAlCarrito  // viene de App, pasando por HomePage
}

function Destacados({ onAgregarAlCarrito }: DestacadosProps) {
    // Datos que llegan de la API. Empiezan vacíos porque todavía no llegan.
    const [productos, setProductos] = useState<ProductoApi[]>([])
    const [proveedores, setProveedores] = useState<ProveedorApi[]>([])

    // Al abrir el Home, pedimos los más vendidos y los proveedores (para el nombre).
    useEffect(() => {
        async function cargarDestacados() {
            try {
                const respuestaProductos = await fetch(URL_PRODUCTOS + "/top-ventas")
                if (!respuestaProductos.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datosProductos = await respuestaProductos.json()

                const respuestaProveedores = await fetch(URL_PROVEEDORES)
                if (!respuestaProveedores.ok) {
                    throw new Error("La solicitud no fue exitosa")
                }
                const datosProveedores = await respuestaProveedores.json()

                // slice(0, 3): nos quedamos solo con los 3 primeros.
                setProductos(datosProductos.slice(0, 3))
                setProveedores(datosProveedores)
            } catch (error) {
                // Si falla, la sección simplemente queda vacía (el resto del Home sigue funcionando).
                console.error("Error:", error)
            }
        }
        cargarDestacados()
    }, [])

    // Busca el nombre del proveedor por su id. Si no lo encuentra, devuelve "".
    function nombreProveedor(id: number) {
        const proveedor = proveedores.find((p) => p.id === id)
        if (proveedor) {
            return proveedor.nombre
        }
        return ""
    }

    // Si todavía no llegan (o la API falló), no dibujamos la sección.
    if (productos.length === 0) {
        return null
    }

    return(
<section className="contenedor seccion">
      <div className="cabecera-seccion">
        <h2>Productos destacados</h2>
      </div>
      <div className="grilla-productos">

        {productos.map((producto) => {
          // La foto principal del producto ("" si todavía no tiene).
          const foto = fotoPrincipal(producto)
          // El precio que se cobra: con descuento si tiene.
          const precio = producto.descuento > 0 ? producto.precioDescuento : producto.precio

          return (
          <article key={producto.id} className="tarjeta-base tarjeta-producto">
            {/* `/producto/${producto.id}` arma la dirección con el id. Ej: "/producto/3" */}
            <Link to={`/producto/${producto.id}`} className="imagen-placeholder foto-producto">
              {/* alt = texto que se lee si la foto no carga (y el que usan los lectores de pantalla) */}
              {foto ? <img src={foto} alt={producto.nombre} /> : "Sin foto"}
            </Link>
            <div className="tarjeta-producto-cuerpo">
              <h3><Link to={`/producto/${producto.id}`}>{producto.nombre}</Link></h3>
              <p className="productor">{nombreProveedor(producto.proveedorId)}</p>
              <div className="pie-tarjeta-producto">
                <p className="precio">{formatoPrecio(precio)}</p>
                {/* Al apretar: primero se agrega 1 unidad al carrito y luego Link nos lleva a /carrito */}
                <Link to="/carrito" className="boton boton-primario boton-sm"
                  onClick={() => onAgregarAlCarrito(producto, nombreProveedor(producto.proveedorId), 1)}>Agregar</Link>
              </div>
            </div>
          </article>
          )
        })}

      </div>
    </section>
    )
}

export {Destacados}
