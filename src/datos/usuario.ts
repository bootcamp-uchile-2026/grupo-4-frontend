// Forma que tiene el usuario que creó una cuenta.
// (La contraseña no se guarda aquí: eso lo hará el backend más adelante).
type Usuario = {
    nombre: string
    email: string
}

export type {Usuario}
