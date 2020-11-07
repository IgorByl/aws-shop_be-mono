import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { errorHandler } from "../utils";
import { getProducts } from "../products-db";

export const getProductsById: APIGatewayProxyHandler = errorHandler(
  async (event) => {
    console.log("Lambda getProductsById was called with event: ", event);

    const id = event.pathParameters.id;
    console.log("Lambda getProductsById gets product's id: ", id);

    const product = getProducts(id);
    console.log("Lambda getProductsById returns the result: ", product);

    return product;
  }
);
