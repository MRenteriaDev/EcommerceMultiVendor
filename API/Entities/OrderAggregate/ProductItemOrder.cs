using System.ComponentModel.DataAnnotations;

namespace API.Entities.OrderAggregate;

public class ProductItemOrder
{
    [Key]
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Name { get; set; }
    public string PictureUrl { get; set; }
}
