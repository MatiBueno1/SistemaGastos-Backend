using Sistema_de_Gastos.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("Transacciones")]
public class Transaccion
{
    [Key]
    [Column("TransaccionesID")] 
    public int TransaccionId { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Monto { get; set; }

    public DateTime Fecha { get; set; }

    [System.ComponentModel.DataAnnotations.Schema.Column(TypeName = "nvarchar(500)")]
    public string? Descripcion { get; set; }
    public int CategoriaId { get; set; }

    public Categoria? Categoria { get; set; }
}