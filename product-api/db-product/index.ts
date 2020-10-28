import { data } from "../__mock-data__";
interface Product {}

export const get = (id?: string): Product[] | Product => {
  return id ? data.find((item) => item.id === id) : data;
};
