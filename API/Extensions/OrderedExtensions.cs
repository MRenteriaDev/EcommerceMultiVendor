using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions;

public static class OrderedExtensions
{
    public static IQueryable<OrderDto> ProjectOrderToOrderDto(this IQueryable<Order> query)
    {
        return query
        .Select(order => new OrderDto
        {
            Id = order.Id,
            BuyerId = order.BuyerId,
            OrderDate = order.OrderDate,
            ShippingAddress = order.ShippingAddress,
            DeliveryFree = order.DeliveryFree,
            Subtotal = order.Subtotal,
            OrderStatus = order.OrderStatus.ToString(),
            Total = order.GetTotal(),
            OrderItems = order.OrderItems.Select(item => new OrderItemDto
            {
                ProductId = item.ItemOrder.ProductId,
                Name = item.ItemOrder.Name,
                PictureUrl = item.ItemOrder.PictureUrl,
                Price = item.Price,
                Quantity = item.Qunatity
            }).ToList()
        }).AsNoTracking();
    }
}
