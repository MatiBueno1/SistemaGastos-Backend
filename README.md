#  Sistema de Gestión de Gastos - Backend

Aplicación de gestión de gastos personales. API construida con **.NET 10** que se comunica con una base de datos SQL Server para gestionar categorías y transacciones financieras.

## Tecnologías usadas
* **Lenguaje:** C#
* **Framework:** ASP.NET Core Web API (.NET 10)
* **ORM:** Entity Framework Core (para la comunicación con la base de datos)
* **Base de Datos:** Microsoft SQL Server
* **Documentación:** Swagger / OpenAPI

## Lo que aprendí y apliqué en este módulo
En esta etapa del proyecto, me enfoqué en construir una arquitectura sólida:
* **Mapeo de Datos:** Aprendí a usar Data Annotations (`[Table]`, `[Key]`, `[Column]`) para que el código de C# se entienda perfectamente con las tablas de SQL, incluso cuando los nombres no coinciden exactamente.
* **Controladores Asíncronos:** Implementé métodos `async/await` para asegurar que la API pueda manejar múltiples pedidos sin bloquearse.
* **Relaciones en DB:** Configuré relaciones de Llave Foránea entre Gastos y Categorías, usando `.Include()` para traer datos relacionados en una sola consulta.
* **Solución de Problemas:** Logré configurar el entorno de desarrollo sorteando obstáculos con certificados SSL y puertos de red.

## Endpoints Principales
* `GET /api/Categorias`: Lista todas las categorías disponibles (Comida, Transporte, etc.).
* `GET /api/Transacciones`: Obtiene el historial de gastos, incluyendo el detalle de su categoría.
* `POST /api/Transacciones`: Permite registrar un nuevo gasto en el sistema.

## Cómo ejecutarlo
1. Clona el repositorio.
2. Asegúrate de tener **SQL Server** corriendo con una base llamada `SistemaGastosDB`.
3. Actualiza la `ConnectionString` en el archivo `appsettings.json` si es necesario.
4. Presioná **F5** en Visual Studio para iniciar el servidor.
5. Accede a `http://localhost:5181/api/Categorias` para verificar que los datos fluyen.
