// Forma que tiene cada plan de suscripción.
type Plan = {
    id: number
    nombre: string
    descripcion: string
    precio: number
    destacado: boolean  // true = es el "Más elegido" (se ve resaltado)
}

// Forma de una suscripción activa: el plan elegido y sus próximas fechas.
type Suscripcion = {
    plan: Plan
    proximaCaja: string   // ej: "24 – 26 ago"
    proximoCobro: string  // ej: "20 ago"
}

// Los 3 planes que se muestran en la página de suscripción.
const planes: Plan[] = [
    { id: 1, nombre: "Básica", descripcion: "4 a 5 productos", precio: 29990, destacado: false },
    { id: 2, nombre: "Plus", descripcion: "6 a 8 productos", precio: 39990, destacado: true },
    { id: 3, nombre: "Premium", descripcion: "Elige 5 productos, tú decides", precio: 49990, destacado: false },
]

export type {Plan, Suscripcion}
export {planes}
