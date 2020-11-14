import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { ApiError, errorHandler } from "../utils";
import { pool } from "../products-db";
import { uuid } from 'uuid';

export const createProduct: APIGatewayProxyHandler = errorHandler(
  async (event) => {
    console.log("Lambda createProduct was called with event: ", event);

    let product_id: uuid;
    const data = JSON.parse(event.body);
    const { title, description, count, price } = data;

    if (!title || !count || !price) {
      throw new ApiError(400, "Product data invalid");
    }

    console.log("Lambda createProduct parse data: ", data);
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const productQueryText = 'INSERT INTO products (title, description, price) VALUES($1, $2, $3) RETURNING id';
        const productsRes = await client.query(productQueryText, [title, description, price]);
        product_id = productsRes.rows[0].id;

        console.log("Lambda createProduct returns new product id: ", product_id);

        const stocksQueryText = 'INSERT INTO stocks(product_id, count) VALUES ($1, $2)';
        await client.query(stocksQueryText, [product_id, count]);
        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(error);
    } finally {
      client.release();
    }

    return product_id;
  }
);
