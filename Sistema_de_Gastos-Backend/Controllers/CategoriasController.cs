using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sistema_de_Gastos.Models; // Importo modelos s para usar ApplicationDbContext y Categoria

namespace GastosApi.Controllers
{
    [Route("api/[controller]")] //  URL
    [ApiController] // Le paso a .NET que esta clase es un controlador de API
    public class CategoriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // CONSTRUCTOR: Acá meto la inyección de dependencias para el contexto de la base de datos.
        // c# va a crear una instancia de ApplicationDbContext y se la va a pasar a este controlador cada vez que se necesite.
        public CategoriasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ACCIÓN GET: Para listar todas las categorías
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
            // Esto trae TODO lo que insertaste en SQL
            return await _context.Categorias.ToListAsync();
        }
    }
}