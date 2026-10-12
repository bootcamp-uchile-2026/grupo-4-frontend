import { useEffect, useState } from "react"

// =====================================================================
// useEstadoGuardado: igual que useState, pero el valor NO se pierde al recargar (F5).
//
// ¿Cómo? Usa localStorage, un "cajón" del navegador donde se puede guardar texto.
// Lo que se guarda ahí sigue estando aunque recargues la página o cierres la pestaña.
//
// Se usa igual que useState, pero con un nombre (la "clave") para el cajón:
//     const [usuario, setUsuario] = useEstadoGuardado("sobremesa-usuario", null)
//
// Un "hook propio" es simplemente una función nuestra que usa hooks de React
// (useState, useEffect...). Por convención su nombre empieza con "use".
// =====================================================================

// Lee un valor guardado. Si no hay nada (o está dañado), devuelve el valor inicial.
//
// <T> se llama "genérico": significa "cualquier tipo". Así la misma función sirve
// para guardar un usuario, una lista de pedidos, un carrito, etc.
function leerGuardado<T>(clave: string, valorInicial: T): T {
    // try/catch: "intenta esto, y si falla, haz esto otro en vez de romper la página".
    // Puede fallar si el navegador bloquea localStorage (ej: modo privado) o si el texto guardado está dañado.
    try {
        const texto = localStorage.getItem(clave)  // devuelve el texto guardado, o null si no hay nada
        if (texto === null) {
            return valorInicial
        }
        // localStorage solo guarda TEXTO. JSON.parse convierte ese texto de vuelta en datos (objetos, listas...).
        return JSON.parse(texto)
    } catch {
        return valorInicial
    }
}

function useEstadoGuardado<T>(clave: string, valorInicial: T): [T, (nuevoValor: T) => void] {
    // 1) Al empezar, en vez de usar directamente valorInicial, miramos si había algo guardado.
    //    Pasamos una FUNCIÓN a useState: así React la ejecuta solo la primera vez, no en cada dibujo.
    const [valor, setValor] = useState<T>(() => leerGuardado(clave, valorInicial))

    // 2) useEffect ejecuta código DESPUÉS de que React dibuja la pantalla.
    //    La lista [clave, valor] del final dice CUÁNDO repetirlo: cada vez que "valor" cambie.
    //    O sea: cada vez que se llame a setValor, el nuevo valor se guarda en el cajón.
    useEffect(() => {
        try {
            // JSON.stringify convierte los datos en texto, porque localStorage solo guarda texto.
            localStorage.setItem(clave, JSON.stringify(valor))
        } catch {
            // Si no se puede guardar (ej: modo privado), la página sigue funcionando igual, solo que sin recordar.
        }
    }, [clave, valor])

    // 3) Devolvemos lo mismo que useState: el valor y la función para cambiarlo.
    return [valor, setValor]
}

export {useEstadoGuardado}
