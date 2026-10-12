// Devuelve la fecha de dentro de "dias" días, en formato corto. Ej: "22 ago".
// La usan la compra (fecha de entrega) y la suscripción (próxima caja).
function fechaEnDias(dias: number) {
    const fecha = new Date()                   // hoy
    fecha.setDate(fecha.getDate() + dias)      // le sumamos los días
    return fecha.toLocaleDateString("es-CL", { day: "numeric", month: "short" })
}

export {fechaEnDias}
