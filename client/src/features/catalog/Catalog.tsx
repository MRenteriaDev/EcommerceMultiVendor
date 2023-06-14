import { useEffect, useState } from "react";
import { Product } from "../../app/models/products";
import ProductList from "./ProductList";

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:5068/api/Product")
      .then((res) => res.json())
      .then((res) => setProducts(res))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <ProductList products={products} />
    </>
  );
}
