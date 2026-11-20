

<!-- local-development:start -->
# Desarrollo local

Puedes abrir este repositorio en VS Code, Antigravity o Sublime Text. El compilador y los servicios necesarios dependen del componente indicado abajo.

## Archivos ignorados

`.gitignore` excluye credenciales locales, estado del editor y salidas de las herramientas detectadas. No deja de versionar archivos que ya estaban en Git. Los manifiestos, archivos de bloqueo, recursos fuente y scripts de esquema forman parte del código.
<!-- local-development:end -->


<!-- improvements-20261120:start -->
## Mejoras y verificación — 2026-11-20 (Portal web de vacantes TI y seguimiento de postulaciones)

- **Cambios:** Implementada aplicación web persistente (`web-app/index.html` + `web-app/jobs-store.js`) con búsqueda, filtros por modalidad y salario mínimo, vacantes guardadas, alta de puestos, registro de postulaciones en `localStorage` y tema claro/oscuro.
- **Validación:** Node 24 `node --test web-app/tests/jobs-store.test.mjs` (filtros, guardado, CRUD y persistencia aprobados).
<!-- improvements-20261120:end -->
