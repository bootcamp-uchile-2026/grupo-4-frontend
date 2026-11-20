// RESUMEN: define la forma del usuario que inició sesión.
// Los datos vienen de la API (GET /usuarios/me) y el token del login.

type Usuario = {
    nombre: string
    apellido: string
    email: string
    rol: string     // "CLIENTE", "ADMIN" o "PROVEEDOR"
    token: string   // la "pulsera" para los pedidos protegidos (dura 15 minutos)
}

export type {Usuario}
