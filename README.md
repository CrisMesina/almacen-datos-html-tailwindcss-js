# Diario Online (HTML, JS, CSS Y TAILWINDCSS)

Proyecto simple de inventario con autenticación Firebase y gestión básica de stock.

## Funcionalidades principales

- Registro e inicio de sesión de usuarios con Firebase Auth.
- Creación de notas.
- Visualización de notas.
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
  - Crear notas. 
  - Ver notas creadas.
  - Cambiar visibilidad de la nota.
  - Dar "Me gusta" o "Corazón" a las notas.


## Tecnologías

- HTML
- CSS
- JavaScript
- Firebase Auth
- Firebase Firestore (para almacenar datos de usuarios y productos)

## Notas

- El proyecto está pensado para extenderse con una página sobre Diarios personales
- La lógica de usuario conectado debe hacerse en el JavaScript de la página, no directamente en el HTML.

## Checklist — Cosas que faltan

- [ ] Validación de formularios en el cliente (mensajes claros por campo).
- [ ] Editar y eliminar notas (UI + permisos en Firestore).
- [ ] Botón para alternar visibilidad en cada nota (toggle) y listener delegado.
- [ ] Reglas de seguridad de Firestore que restrinjan operaciones solo al propietario (`request.auth.uid == resource.data.uid`).
- [ ] Manejo de errores y notificaciones consistentes (usar `Swal` o similar en todos los flujos).
- [ ] Soporte para paginación o carga perezosa si hay muchas notas.
- [ ] Búsqueda y filtrado de notas por título/contenido/fecha.
- [ ] Tests básicos (script de pruebas manuales o unitarias simples).
- [ ] Responsive y accesibilidad: revisar tamaños, contraste y navegación por teclado.
- [ ] Sanitizar/escapar contenido mostrado para evitar inyección de HTML.
- [ ] Optimizar consultas a Firestore (indexar campos usados en filtros/orden).
- [ ] Documentación de despliegue (cómo publicar en Netlify/Vercel o Firebase Hosting).
- [ ] Añadir ejemplo de reglas de Firestore en `README` o archivo separado.
