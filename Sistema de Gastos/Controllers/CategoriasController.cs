using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sistema_de_Gastos.Models; // Importamos tus modelos

namespace GastosApi.Controllers
{
    [Route("api/[controller]")] // La URL será: api/categorias
    [ApiController] // Le dice a .NET que esto es una API (no una página web común)
    public class CategoriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR: Aquí "inyectamos" la base de datos.
        // C# nos pasa el jefe de obra (DbContext) para que lo usemos acá.
        public CategoriasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ACCIÓN GET: Para listar todas las categorías
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            // Le decimos al contexto: "Traeme la lista de Categorias de SQL"
            // ToListAsync() es lo que ejecuta el "SELECT * FROM Categorias"
            return await _context.Categorias.ToListAsync();
        }
    }
}