# Diario Online (HTML, JS, CSS Y TAILWINDCSS)

Proyecto simple de inventario con autenticación Firebase y gestión básica de stock.

## Funcionalidades principales

- Registro e inicio de sesión de usuarios con Firebase Auth.
- Control de stock de inventario.
- Visualización de ganancias y pérdidas.
- Listado de compras para planificar compras futuras.
- Estructura modular con HTML, CSS y JavaScript.

## Estructura del proyecto

- `index.html`: página principal de acceso o inicio de sesión.
- `index.css`: estilos globales del proyecto.
- `scripts/`: scripts de la aplicación.
  - `autenticacion.js`: manejo de Firebase Auth y lógica de autenticación.
- `templates/`: plantillas de páginas internas.
  - `home.html`: página interna donde se mostrará el inventario y los datos del usuario.
- `images/`: recursos gráficos usados en la aplicación.

## Cómo funciona

1. El usuario se registra o inicia sesión desde `index.html`.
2. Firebase Auth mantiene la sesión iniciada.
3. Al acceder a la página interna (`home.html`), el JavaScript debe capturar el usuario autenticado y cargar sus datos.
4. Desde la interfaz se debe poder:
   - Administrar el stock de productos.
   - Ver reportes de ganancias y pérdidas.
   - Generar un listado de compras para futuros pedidos.

## Tecnologías

- HTML
- CSS
- JavaScript
- Firebase Auth
- Firebase Firestore (para almacenar datos de usuarios y productos)

## Notas

- El proyecto está pensado para extenderse con una página de inventario, reportes y lista de compras.
- La lógica de usuario conectado debe hacerse en el JavaScript de la página, no directamente en el HTML.
