import { data } from "./__mock-data__";

interface Product {
  id: string;
  price: number;
  title: string;
  description: string;
  count: number;
}

export const getProducts = (id?: string): Product[] | Product => {
  const products = id ? data.find((item) => item.id === id) : data;
  if(!products) throw new Error('Product not found')
  return products;
};
