import { getProducts } from "./";
import { data } from "./__mock-data__";

describe("GetProducts function: ", () => {
  let products, product;

  beforeEach(() => {
    products = data;
    product = data[0];
  });

  test("Should be defined", () => {
    expect(getProducts).toBeDefined();
  });

  test("Should return Product object", () => {
    expect(getProducts("7567ec4b-b10c-48c5-9345-fc73c48a80aa")).toEqual(
      product
    );
  });

  test("Should return Product[]", () => {
    expect(getProducts()).toEqual(products);
  });

  test("Should return error", () => {
    expect(() => getProducts("7567ec4efgeg")).toThrow(Error);
  });
});
