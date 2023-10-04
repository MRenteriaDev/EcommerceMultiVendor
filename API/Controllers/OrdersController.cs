using System.Collections.Generic;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
public class OrderController : BaseApiController
{
    private readonly DataContext _context;
    public OrderController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetOrders()
    {
        return await _context.Orders.Include(o => o.OrderItems)
        .ProjectOrderToOrderDto()
        .Where(x => x.BuyerId == User.Identity.Name)
        .ToListAsync();
    }

    [HttpGet("{id}", Name = "GetOrder")]
    public async Task<ActionResult<OrderDto>> GetOrder(int id)
    {
        return await _context.Orders
            .ProjectOrderToOrderDto()
            .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync();
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateOrder(CreateOrderDto createOrderDto)
    {
        var basket = await _context.Baskets
            .RetrieveBasketWithItems(User.Identity.Name)
            .FirstOrDefaultAsync();

        if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not locate basket for the user" });

        var items = new List<OrderItem>();

        foreach (var item in basket.Items)
        {
            var productItem = await _context.Products.FindAsync(item.ProductId);
            var itemOrdered = new ProductItemOrder
            {
                ProductId = productItem.Id,
                Name = productItem.Name,
                PictureUrl = productItem.PcitureUrl,
            };

            var orderedItem = new OrderItem
            {
                ItemOrder = itemOrdered,
                Price = productItem.Price,
                Qunatity = item.Quantity,
            };

            items.Add(orderedItem);
            productItem.QuantityInStock -= item.Quantity;
        }

        var subtotal = items.Sum(item => item.Price * item.Qunatity);
        var deliveryFree = subtotal > 10000 ? 0 : 500;

        var order = new Order
        {
            OrderItems = items,
            BuyerId = User.Identity.Name,
            ShippingAddress = createOrderDto.ShippingAddress,
            Subtotal = subtotal,
            DeliveryFree = deliveryFree,
            PaymentIntentId = basket.PaymentIntentId
        };

        _context.Orders.Add(order);
        _context.Baskets.Remove(basket);

        if (createOrderDto.SaveAddress)
        {
            var user = await _context.Users
                .Include(x => x.Address)
                .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

            var address = new UserAddress
            {
                FullName = createOrderDto.ShippingAddress.FullName,
                Address1 = createOrderDto.ShippingAddress.Address1,
                Address2 = createOrderDto.ShippingAddress.Address2,
                City = createOrderDto.ShippingAddress.City,
                State = createOrderDto.ShippingAddress.State,
                Zip = createOrderDto.ShippingAddress.Zip,
                Country = createOrderDto.ShippingAddress.Country,
            };

            user.Address = address;
        }

        var result = await _context.SaveChangesAsync() > 0;

        if (result) return CreatedAtRoute("GetOrder", new { id = order.Id }, order.Id);

        return BadRequest("Problem creating Order");
    }
}
