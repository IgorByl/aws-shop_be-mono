import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { errorHandler } from "../utils";
import { get } from "../db-product";

export const getProducts: APIGatewayProxyHandler = errorHandler(
  async (event) => {
    console.log("Lambda getProducts was called with event: ", event);
    const products = get();
    console.log("Lambda getProducts returns the result: ", products);
    return products;
  }
);
