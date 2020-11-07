import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { errorHandler } from "../utils";
import { getProducts } from "../products-db";

export const getProductsList: APIGatewayProxyHandler = errorHandler(
  async (event) => {
    console.log("Lambda getProductsList was called with event: ", event);

    const products = getProducts();
    console.log("Lambda getProductsList returns the result: ", products);

    return products;
  }
);
