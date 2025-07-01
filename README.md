# Plataforma de Subastas en Línea

## Descripción del Proyecto
Esta es una plataforma de subastas en línea donde los usuarios pueden:
- Ver productos disponibles para subastar.
- Realizar ofertas en tiempo real.
- Seguir el progreso de cada subasta mediante un cronómetro.

### Características principales:
- **Registro de usuarios**: Los usuarios pueden registrarse eligiendo un rol (usuario o admin).
- **Panel de administración**: Los admins pueden gestionar productos y usuarios desde un panel exclusivo.
- **Actualización en tiempo real**: Las pujas se actualizan en tiempo real usando SSE (Server-Sent Events) simulados en Node.js.
- **Historial de pujas**: Se registra el historial de pujas y resultados para que los usuarios puedan revisar sus actividades.
- **Interfaz**: Desarrollada con **React** y **MUI**, con soporte multilenguaje (i18n).
- **Backend simulado**: Utiliza **JSON Server** para la persistencia de datos de usuarios y productos.

## Cómo levantar el proyecto

### Requisitos Previos
- **Node.js** instalado (versión 14+ recomendada).
- **npm**  instalado.

### Backend con JSON Server y SSE

1. **Instalar dependencias**  
   En la raíz del backend (o carpeta donde tengas el `index.js` y el `package.json`):
   ```bash
   npm install
   ```

2. **Iniciar JSON Server**  
   Este servidor simula una base de datos REST con archivos JSON (`usuarios.json`, `products.json`).  
   ```bash
   npx json-server db.json
   ```

3. **Iniciar el servidor SSE (Server-Sent Events)**  
   Este servidor se encuentra en la carpeta `/sse` y emite actualizaciones de pujas en tiempo real.  
   Ejecuta lo siguiente desde la raíz del proyecto:
   ```bash
   node sse/index.js
   ```
   Asegúrate de que el archivo `index.js` esté ubicado en la carpeta `/sse` y que utilice un puerto (por ejemplo, 5000) diferente al de JSON Server.

### Frontend

1. **Instalar dependencias**  
   En la carpeta del frontend:
   ```bash
   npm install
   ```

2. **Iniciar la app React**  
   ```bash
   npm run start
   ```