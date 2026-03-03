using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sistema_de_Gastos.Models; // Asegurate que este sea tu namespace real

namespace Sistema_de_Gastos.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransaccionesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TransaccionesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/Transacciones (Para ver todos los gastos)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaccion>>> GetTransacciones()
        {
            // El Include hace un "JOIN" en SQL para traer también el nombre de la categoría
            return await _context.Transacciones.Include(t => t.Categoria).ToListAsync();
        }

        // 2. POST: api/Transacciones (Para guardar un gasto nuevo)
        [HttpPost]
        public async Task<ActionResult<Transaccion>> PostTransaccion(Transaccion transaccion)
        {
            _context.Transacciones.Add(transaccion);
            await _context.SaveChangesAsync(); // Guarda en la base de datos

            return CreatedAtAction("GetTransacciones", new { id = transaccion.TransaccionId }, transaccion);
        }
    }
}