# Sistema de Gestión de Gastos - Fullstack

Aplicación de gestión de gastos personales. El sistema consta de una API construida con **.NET 10** que gestiona la persistencia en **SQL Server** y un frontend en **React** para la visualización dinámica de datos.

## Tecnologías usadas
* **Lenguaje:** C# y JavaScript (React)
* **Framework Backend:** ASP.NET Core Web API (.NET 10)
* **ORM:** Entity Framework Core (para la comunicación con la base de datos)
* **Base de Datos:** Microsoft SQL Server
* **Frontend:** React (Bootstrap, Chart.js, Day.js)
* **Documentación:** Swagger / OpenAPI

## Lo que aprendí y apliqué en este módulo
En esta etapa del proyecto, me enfoqué en construir una arquitectura sólida y una interfaz funcional:
* **Mapeo de Datos:** Aprendí a usar Data Annotations (`[Table]`, `[Key]`, `[Column]`) para que el código de C# se entienda perfectamente con las tablas de SQL, incluso cuando los nombres no coinciden exactamente.
* **Manejo de Fechas:** Implementé la librería **Day.js** en el frontend para gestionar correctamente las zonas horarias y permitir filtros precisos por mes calendario, evitando desfasajes de días al consultar la API.
* **Controladores Asíncronos:** Implementé métodos `async/await` para asegurar que la API pueda manejar múltiples pedidos sin bloquearse.
* **Visualización de Datos:** Integré **Chart.js** para transformar los registros de la base de datos en gráficos de torta dinámicos que reflejan la distribución de gastos.
* **Relaciones en DB:** Configuré relaciones de Llave Foránea entre Gastos y Categorías, usando `.Include()` para traer datos relacionados en una sola consulta.
* **Solución de Problemas:** Logré configurar el entorno de desarrollo sorteando obstáculos con certificados SSL, puertos de red y errores de inserción de objetos en SQL (Msg 208).

## Endpoints Principales
* `GET /api/Categorias`: Lista todas las categorías disponibles (Comida, Transporte, etc.).
* `GET /api/Transacciones`: Obtiene el historial de gastos, incluyendo el detalle de su categoría.
* `POST /api/Transacciones`: Permite registrar un nuevo gasto en el sistema.

## Cómo ejecutarlo
1. Clona el repositorio.
2. Asegúrate de tener **SQL Server** corriendo con una base llamada `SistemaGastosDB`.
3. Ejecuta el script de carga de categorías iniciales en tu base de datos:
   ```sql
   USE SistemaGastosDB;
   INSERT INTO Categorias (Nombre) VALUES ('Sueldo'), ('Comida'), ('Transporte'), ('Salud'), ('Ocio'), ('Servicios');