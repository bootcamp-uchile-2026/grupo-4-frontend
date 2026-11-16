import { useState } from "react";
import { URL_CATEGORIAS, leerJson } from "../../datos/api";
import type { CategoriaApi } from "../../datos/api";
// Reutilizamos los estilos de formulario que ya existen (campo-form, campo, boton...).
import "../checkout/checkout.css";

type CrearCategoriaProps = {
  onCategoriaCreada: (categoria: CategoriaApi) => void; // le avisa a la página que se creó una nueva
};

// Formulario para crear una categoría nueva en la API.
function CrearCategoria({ onCategoriaCreada }: CrearCategoriaProps) {
  // Lo que el usuario escribe en el campo.
  const [nombre, setNombre] = useState("");
  // true mientras esperamos la respuesta de la API (para desactivar el botón).
  const [enviando, setEnviando] = useState(false);
  // Mensaje para el usuario: éxito o error. "" = sin mensaje.
  const [mensaje, setMensaje] = useState("");

  // Se ejecuta al apretar "Crear categoría".
  // Es "async" porque adentro esperamos a la API con "await".
  async function enviarFormulario(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault(); // evita que el navegador recargue la página
    setEnviando(true);
    setMensaje("");

    try {
      // "try" = intenta hacer todo esto...
      // Esta vez no solo PEDIMOS datos: los ENVIAMOS.
      // Por eso a fetch le pasamos un segundo dato con 3 cosas:
      const respuesta = await fetch(URL_CATEGORIAS, {
        method: "POST", // POST = "crear algo nuevo"
        headers: { "Content-Type": "application/json" }, // le decimos que enviamos JSON
        body: JSON.stringify({ nombre: nombre }), // el dato, convertido a texto JSON
      });
      // Si la respuesta no fue exitosa, lanzamos un error (saltamos directo al "catch").
      if (!respuesta.ok) {
        throw new Error("La solicitud no fue exitosa");
      }
      // La API nos devuelve la categoría creada, ya con su id.
      const categoriaNueva = await leerJson(respuesta);
      // Si la API no devolvió una categoría con id, no se guardó de verdad.
      if (!categoriaNueva.id) {
        throw new Error("La API no devolvió la categoría creada");
      }

      onCategoriaCreada(categoriaNueva); // le avisamos a la página
      setMensaje("Categoría creada: " + nombre);
      setNombre(""); // dejamos el campo vacío para crear otra
    } catch (error) {
      // ...y si algo falla, entra aquí (la API está caída, no hay internet o el dato no era válido).
      console.error("Error:", error);
      setMensaje("No pudimos crear la categoría. Intenta más tarde.");
    }
    setEnviando(false); // haya salido bien o mal, ya terminó
  }

  return (
    <div className="tarjeta-base">
      <h2>Nueva categoría</h2>
      <form onSubmit={enviarFormulario}>
        <div className="campo-form">
          <label htmlFor="categoria-nombre">Nombre</label>
          {/* maxLength={100}: Swagger dice que el nombre puede tener máximo 100 letras */}
          <input
            id="categoria-nombre"
            type="text"
            className="campo"
            placeholder="Ej: Mermeladas"
            required
            maxLength={100}
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
          />
        </div>
        {/* disabled: mientras se envía, el botón no se puede apretar (así no se crea 2 veces) */}
        <button
          type="submit"
          className="boton boton-primario"
          disabled={enviando}
        >
          {enviando ? "Creando..." : "Crear categoría"}
        </button>
      </form>
      {mensaje && <p className="texto-muted">{mensaje}</p>}
    </div>
  );
}

export { CrearCategoria };
