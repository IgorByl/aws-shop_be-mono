import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { errorHandler } from "../utils";
import { pool } from "../products-db";

export const getProductsList: APIGatewayProxyHandler = errorHandler(
  async (event) => {
    const client = await pool.connect();
    console.log("Lambda getProductsList was called with event: ", event);

    const result = await client.query(
      "SELECT p.*, s.count FROM products p, stocks s WHERE p.id=s.product_id"
    );
    console.log("Lambda getProductsList returns the result: ", result);
    client.release();
    return result.rows;
  }
);
