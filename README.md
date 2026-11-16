# 🧺 LaSobremesa — Frontend

Ecommerce de productos artesanales chilenos (mermeladas, quesos, aceites)
con suscripción mensual de cajas. Proyecto del Bootcamp DCC 2026 — Grupo 4.

<!-- Pendiente: agregar una captura del Home en docs/captura-home.png y descomentar la línea de abajo -->
<!-- ![Captura del Home](docs/captura-home.png) -->

## 🛠️ Tecnologías

- [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) — servidor de desarrollo y build
- [React Router 8](https://reactrouter.com) — navegación entre páginas
- [Zod](https://zod.dev) — validación de formularios
- ESLint — revisión de estilo de código

## 📋 Requisitos previos

- Node.js 20 o superior
- npm (o pnpm, según lo que acuerde el equipo)

## 🚀 Instalación

```bash
git clone https://github.com/bootcamp-uchile-2026/grupo-4-frontend.git
cd grupo-4-frontend
npm install
npm run dev
```

Abre http://localhost:5173 en el navegador.

## 📜 Scripts

| Comando           | Qué hace                                          |
|-------------------|---------------------------------------------------|
| `npm run dev`     | Levanta el sitio en modo desarrollo               |
| `npm run build`   | Revisa tipos y genera la versión final en `dist/` |
| `npm run preview` | Muestra la versión final localmente               |
| `npm run lint`    | Revisa el código con ESLint                       |

## 🔌 API (backend)

El frontend consume la API **LaSobremesa API**.
URL base: http://13.184.190.150:3000/
Documentación Swagger: http://13.184.190.150:3000/api

| Página      | Endpoint                             | Cómo se usa                              |
|-------------|--------------------------------------|------------------------------------------|
| Catálogo    | `GET /productos`, `GET /proveedores` | Se cargan solos al abrir la página       |
| Productores | `GET /proveedores`                   | Se cargan solos al abrir la página       |
| Suscripción | `GET /suscripciones`                 | Se cargan solos; si viene vacía, se usan los planes locales |
| Categorías  | `GET /categorias`, `POST /categorias` | Lista de categorías y formulario para crear una |
| Admin       | `POST /autenticacion/login`          | Login; devuelve `{ access_token }` (dura 15 minutos) |
| Admin       | `/productos`, `/proveedores`, `/usuarios` | CRUD completo con `Authorization: Bearer <token>` (solo rol ADMIN) |

## 🔐 Panel de administración

Solo pueden entrar los usuarios con rol **ADMIN**. La cuenta ADMIN la entrega el equipo de backend
(las cuentas creadas con `/registro` quedan como `CLIENTE`).

```
Cliente escribe /admin/productos
   └─ RutaAdmin: ¿sesion es null? → sí → <Navigate to="/admin/login" />

En /admin/login escribe email + contraseña
   ├─ POST /autenticacion/login → { access_token }
   ├─ GET /usuarios con el token
   │     ├─ 403 → "Tu cuenta no tiene permisos de administrador"  (CLIENTE / PROVEEDOR)
   │     └─ 200 → es ADMIN → onIngresar → App guarda la sesión
   └─ LoginAdmin ve sesion ≠ null → <Navigate to="/admin/productos" />

Dentro del panel, cada acción envía "Authorization: Bearer <token>"
   ├─ Crear  → POST
   ├─ Editar → PATCH /…/id
   ├─ Borrar → DELETE /…/id
   └─ Después de 15 min → 401 → "Tu sesión expiró…"
```

## 📁 Estructura

```
src/
├── pages/        # Una página por ruta (Home, PLP, PDP, Carrito...)
├── components/   # Piezas reutilizables, agrupadas por sección
├── datos/        # Datos locales y tipos (productos, planes, usuario)
├── hooks/        # Hooks propios (useEstadoGuardado → localStorage)
├── assets/       # Imágenes
├── App.tsx       # Todas las rutas
└── main.tsx      # Punto de entrada
```

## 🗺️ Páginas

| Ruta               | Página                    |
|--------------------|---------------------------|
| `/`                | Home                      |
| `/catalogo`        | Catálogo (PLP)            |
| `/producto/:id`    | Detalle de producto (PDP) |
| `/productores`     | Productores               |
| `/productores/:id` | Perfil de un productor    |
| `/carrito`         | Carrito                   |
| `/checkout`        | Pago                      |
| `/suscripcion`     | Suscripción               |
| `/cuenta`          | Mi cuenta                 |
| `/categorias`      | Categorías (ver y crear)  |
| `/admin/login`     | Ingreso de administrador  |
| `/admin/productos` | Admin: CRUD de productos (solo ADMIN)   |
| `/admin/proveedores` | Admin: CRUD de productores (solo ADMIN) |
| `/admin/usuarios`  | Admin: CRUD de usuarios (solo ADMIN)    |

## 🌿 Flujo de trabajo

- `main`: versión estable · `develop`: integración
- Cada tarea en su rama: `feature/<número-de-issue>` (ej: `feature/53`)
- Pull Request hacia `develop`, con al menos 1 revisión del equipo
- Mensajes de commit en español, en presente: "Se agrega el componente Productor"

## ✍️ Convenciones

- Componentes en PascalCase (`TarjetaPlan`), archivos en snake_case (`tarjeta_plan.tsx`)
- Comentarios en español, explicando el "por qué"
- Correr `npm run lint` antes de abrir un PR

## 👥 Equipo

| Nombre   | GitHub     |
|----------|------------|
| [Nombre] | [@usuario] |

## 📄 Licencia

MIT — ver [LICENSE](LICENSE).
