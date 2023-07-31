using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy)
        {
            if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(p => p.Name);

            query = orderBy switch
            {
                "price" => query.OrderBy(prod => prod.Price),
                "priceDesc" => query.OrderByDescending(prod => prod.Price),
                _ => query.OrderBy(prod => prod.Name)
            };

            return query;
        }


        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchString)
        {
            if (string.IsNullOrWhiteSpace(searchString)) return query;

            var lowerCaseSearchTerm = searchString.Trim().ToLower();

            return query.Where(p => p.Name.ToLower().Contains(lowerCaseSearchTerm));

        }

        public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, string types)
        {
            var brandList = new List<string>();
            var typesList = new List<string>();

            if (!string.IsNullOrWhiteSpace(brands))
                brandList.AddRange(brands.ToLower().Split(",").ToList());


            if (!string.IsNullOrWhiteSpace(types))
                typesList.AddRange(types.ToLower().Split(",").ToList());

            query = query.Where(p => brandList.Count == 0 || brandList.Contains(p.Brand.ToLower()));
            query = query.Where(p => typesList.Count == 0 || typesList.Contains(p.Type.ToLower()));

            return query;
        }
    }
}