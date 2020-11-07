import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { errorHandler } from "../utils";
import { pool } from "../products-db";

export const getProductsById: APIGatewayProxyHandler = errorHandler(
  async (event) => {
    console.log("Lambda getProductsById was called with event: ", event);

    const id = event.pathParameters.id;
    console.log("Lambda getProductsById gets product's id: ", id);
    const client = await pool.connect();
    const result = await client.query(
      `SELECT p.*, s.count FROM products p, stocks s WHERE p.id=s.product_id AND p.id='${id}'`
    );
    console.log("Lambda getProductsById returns the result: ", result);
    client.release();
    return result.rows;
  }
);
