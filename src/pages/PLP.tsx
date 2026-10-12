// useState: para recordar si el panel de filtros está abierto.
import { useState } from "react"
// useSearchParams lee y cambia lo que va después del "?" en la dirección.
// Ej: en "/catalogo?categoria=Quesos&orden=precio-menor"
import { useSearchParams } from "react-router"
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
    // Los filtros y el orden ya NO viven en useState: viven en la dirección (la URL).
    // Así se mantienen al ir a un producto y volver atrás, y se pueden compartir con un link.
    const [parametros, setParametros] = useSearchParams()

    // getAll("categoria") devuelve TODOS los valores con ese nombre.
    // Ej: "?categoria=Quesos&categoria=Aceites" → ["Quesos", "Aceites"]
    const categoriasElegidas = parametros.getAll("categoria")

    // Los valores de la URL siempre son texto ("1"), así que los pasamos a número.
    const productoresElegidos = parametros.getAll("productor").map((id) => Number(id))

    // get("orden") devuelve un solo valor, o null si no está. Si no está, usamos "destacados".
    const orden = parametros.get("orden") || "destacados"

    // El panel de filtros abierto o cerrado. Esto sí es useState: no hace falta guardarlo en la URL.
    const [mostrarFiltros, setMostrarFiltros] = useState(true)

    // Escribe en la URL las categorías, productores y orden que le pasemos.
    // Las funciones de abajo la usan cada vez que algo cambia.
    function actualizarUrl(categorias: string[], productores: number[], nuevoOrden: string) {
        const nuevos = new URLSearchParams()
        for (const categoria of categorias) {
            nuevos.append("categoria", categoria)
        }
        for (const id of productores) {
            nuevos.append("productor", String(id))  // la URL guarda texto, por eso String(id)
        }
        // "destacados" es el orden por defecto: no hace falta escribirlo en la URL.
        if (nuevoOrden !== "destacados") {
            nuevos.set("orden", nuevoOrden)
        }
        setParametros(nuevos)
    }

    // Marca o desmarca una categoría:
    // si ya estaba en la lista, la sacamos; si no estaba, la agregamos.
    function cambiarCategoria(categoria: string) {
        let nuevas
        if (categoriasElegidas.includes(categoria)) {
            nuevas = categoriasElegidas.filter((c) => c !== categoria)
        } else {
            nuevas = [...categoriasElegidas, categoria]
        }
        actualizarUrl(nuevas, productoresElegidos, orden)
    }

    // Lo mismo, pero con los productores (usamos su id).
    function cambiarProductor(id: number) {
        let nuevos
        if (productoresElegidos.includes(id)) {
            nuevos = productoresElegidos.filter((p) => p !== id)
        } else {
            nuevos = [...productoresElegidos, id]
        }
        actualizarUrl(categoriasElegidas, nuevos, orden)
    }

    // Cambia el orden (lo llama el selector "Ordenar por").
    function cambiarOrden(nuevoOrden: string) {
        actualizarUrl(categoriasElegidas, productoresElegidos, nuevoOrden)
    }

    // Desmarca todos los filtros, pero mantiene el orden elegido.
    function limpiarFiltros() {
        actualizarUrl([], [], orden)
    }

    // 1) FILTRAR: nos quedamos solo con los productos que pasan LOS DOS filtros.
    // Si un grupo no tiene nada marcado, ese grupo no filtra (deja pasar todo).
    const productosFiltrados = productosTienda.filter((producto) => {
        const pasaCategoria = categoriasElegidas.length === 0 || categoriasElegidas.includes(producto.categoria)
        const pasaProductor = productoresElegidos.length === 0 || productoresElegidos.includes(producto.productorId)
        return pasaCategoria && pasaProductor
    })

    // 2) ORDENAR: "sort" cambia la lista original, por eso primero hacemos una copia con [...].
    // sort recibe una función que compara dos productos (a y b):
    //   número negativo → a va primero · número positivo → b va primero
    const productosVisibles = [...productosFiltrados]
    if (orden === "precio-menor") {
        productosVisibles.sort((a, b) => a.precio - b.precio)
    } else if (orden === "precio-mayor") {
        productosVisibles.sort((a, b) => b.precio - a.precio)
    } else if (orden === "nombre") {
        // localeCompare compara textos en orden alfabético (respetando tildes y la ñ)
        productosVisibles.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    }
    // "destacados": se queda en el orden original de la lista.

    // Título: si hay UNA sola categoría marcada, usamos su nombre.
    let titulo = "Todos los productos"
    if (categoriasElegidas.length === 1) {
        titulo = categoriasElegidas[0]
    }

    return(
    <>
    <Encabezado></Encabezado>
    <main className="contenedor">
    <CabeceraCatalogo
      titulo={titulo}
      cantidad={productosVisibles.length}
      orden={orden}
      onCambiarOrden={cambiarOrden}
      filtrosAbiertos={mostrarFiltros}
      onAlternarFiltros={() => setMostrarFiltros(!mostrarFiltros)}
    ></CabeceraCatalogo>
    {/* Si los filtros están cerrados, la grilla usa todo el ancho */}
    <div className={mostrarFiltros ? "contenedor-catalogo" : "contenedor-catalogo sin-filtros"}>
    {mostrarFiltros && (
      <FiltrosCatalogo
        categoriasElegidas={categoriasElegidas}
        productoresElegidos={productoresElegidos}
        onCambiarCategoria={cambiarCategoria}
        onCambiarProductor={cambiarProductor}
        onLimpiar={limpiarFiltros}
      ></FiltrosCatalogo>
    )}
    <section className="grilla-productos" aria-label="Productos">
    {/* Si ningún producto pasa los filtros, avisamos */}
    {productosVisibles.length === 0 && (
      <p className="texto-muted">No hay productos con esos filtros.</p>
    )}
    {/* Una tarjeta por cada producto que pasó los filtros, ya ordenados */}
    {productosVisibles.map((producto) => (
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
