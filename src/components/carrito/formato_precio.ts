// Convierte un número en precio chileno: 2327.5 → "$2.328".
// Math.round redondea (no existen los medios pesos) y toLocaleString pone los puntos de miles.
const formatoPrecio = (valor: number) => "$" + Math.round(valor).toLocaleString("es-CL")

export {formatoPrecio}
