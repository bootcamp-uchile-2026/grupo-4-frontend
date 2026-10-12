// Forma que tiene cada productor.
type Productor = {
    id: number
    nombre: string
    ubicacion: string    // ciudad o zona, ej: "Curicó"
    descripcion: string  // frase corta para las tarjetas
    historia: string     // texto largo para su página
}

// Todos los productores (más adelante vendrán de una API).
// Cada producto de datos/productos.ts dice de qué productor es con "productorId".
const productores: Productor[] = [
    {
        id: 1,
        nombre: "Don Pedro",
        ubicacion: "Curicó",
        descripcion: "Productor de Curicó con más de 20 años elaborando quesos artesanales con leche de su propio rebaño.",
        historia: "Don Pedro aprendió a hacer queso de su abuela, en el mismo campo donde hoy cría a sus vacas. Cada pieza se madura al menos tres meses en una bodega de adobe, dándole vuelta a mano todas las semanas.",
    },
    {
        id: 2,
        nombre: "La Emilia",
        ubicacion: "Limache",
        descripcion: "Huerto familiar de Limache que prepara mermeladas y aceite de oliva con frutos de su propia cosecha.",
        historia: "La Emilia es un huerto que maneja una misma familia desde hace tres generaciones. Cosechan a mano sus olivos y frambuesas, y cocinan las mermeladas en pequeñas ollas de cobre, sin preservantes.",
    },
    {
        id: 3,
        nombre: "Huerto Los Aromos",
        ubicacion: "Paine",
        descripcion: "Pequeño huerto de Paine especializado en frutillas de temporada y conservas caseras.",
        historia: "En Huerto Los Aromos las frutillas se cultivan sin pesticidas y se recogen el mismo día en que se transforman en mermelada. Así conservan todo su sabor y color natural.",
    },
]

// Busca un productor por su id. Devuelve undefined si no existe.
function buscarProductor(id: number) {
    return productores.find((productor) => productor.id === id)
}

// Devuelve solo el nombre del productor (o un texto vacío si no existe).
// La usan las tarjetas y el carrito para mostrar "Don Pedro", "La Emilia", etc.
function nombreProductor(id: number) {
    const productor = buscarProductor(id)
    if (productor) {
        return productor.nombre
    }
    return ""
}

export type {Productor}
export {productores, buscarProductor, nombreProductor}
