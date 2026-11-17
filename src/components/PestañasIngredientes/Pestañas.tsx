// RESUMEN: pestañas de la ficha de producto (Descripción, Ingredientes, Conservación, Despacho).
// Muestra los datos reales del producto. Al apretar una pestaña, cambia el texto de abajo.
import { useState } from "react"
import "../estilos PDP/estilosPDP.css"

type PestañasIngredientesProps = {
    descripcion: string
    ingredientes: string
    conservacion: string   // "Ambiente", "Refrigerado" o "Congelado"
}

function PestañasIngredientes({ descripcion, ingredientes, conservacion }: PestañasIngredientesProps) {
    // Qué pestaña está elegida. Empieza en "descripcion".
    const [pestana, setPestana] = useState("descripcion")

    // Las 4 pestañas: el valor que se guarda en el estado y el texto que se ve.
    const pestanas = [
        { valor: "descripcion", texto: "Descripción" },
        { valor: "ingredientes", texto: "Ingredientes" },
        { valor: "conservacion", texto: "Conservación" },
        { valor: "despacho", texto: "Despacho" },
    ]

    // El texto que se muestra según la pestaña elegida.
    let contenido = descripcion
    if (pestana === "ingredientes") {
        contenido = ingredientes
    } else if (pestana === "conservacion") {
        contenido = "Mantener a temperatura: " + conservacion + "."
    } else if (pestana === "despacho") {
        contenido = "Despacho en 2 a 3 días hábiles. Los productos refrigerados viajan en caja térmica."
    }

    return(
        <section className="pestanas-seccion">
      <nav className="cabecera-pestanas">
        {pestanas.map((opcion) => (
          // La pestaña elegida lleva la clase "activa" (subrayada en verde).
          <button
            key={opcion.valor}
            type="button"
            className={pestana === opcion.valor ? "pestana activa" : "pestana"}
            aria-current={pestana === opcion.valor}
            onClick={() => setPestana(opcion.valor)}
          >
            {opcion.texto}
          </button>
        ))}
      </nav>
      <div className="contenido-pestana">
        {/* Si el dato viene vacío desde la API, avisamos */}
        <p>{contenido || "Sin información."}</p>
      </div>
    </section>
    )
}

export {PestañasIngredientes}
