using Sistema_de_Gastos.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Transacciones")]
public class Transaccion
{
    [Key]
    [Column("TransaccionesID")] // <--- ESTO ES LO IMPORTANTE: Le dice a C# que en SQL se llama así
    public int TransaccionId { get; set; } // En C# lo podemos seguir llamando así por comodidad

    [Column(TypeName = "decimal(18,2)")]
    public decimal Monto { get; set; }

    public DateTime Fecha { get; set; }
    public string? Descripcion { get; set; }
    public int CategoriaId { get; set; }

    public Categoria? Categoria { get; set; }
}