namespace API.Entities.OrderAggregate;

public class OrderItem
{
    public int Id { get; set;}
    public ProductItemOrder ItemOrder { get; set; }
    public long Price { get; set; }
    public int Qunatity { get; set; }
}
