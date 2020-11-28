import { SQSHandler } from "aws-lambda";
import "source-map-support/register";
import { pool } from "../products-db";
import { uuid } from 'uuid';
import * as AWS from "aws-sdk";

export const catalogBatchProcess: SQSHandler = async (event) => {
  let product_id: uuid;
  let error: Error;
  console.log("Lambda catalogBatchProcess was called with event: ", event);

  for (const record of event.Records) {
    console.log("Lambda catalogBatchProcess handle record: ", record);
    const product = JSON.parse(record.body);
    const { title, description, count, price } = product;
    console.log(
      `Lambda catalogBatchProcess product's title: ${title}, description: ${description}, count: ${count}, price: ${price}.`
    );

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const productQueryText = 'INSERT INTO products (title, description, price) VALUES($1, $2, $3) RETURNING id';
        const productsRes = await client.query(productQueryText, [title, description, price]);
        product_id = productsRes.rows[0].id;

        console.log("Lambda catalogBatchProcess returns new product id: ", product_id);

        const stocksQueryText = 'INSERT INTO stocks(product_id, count) VALUES ($1, $2)';
        await client.query(stocksQueryText, [product_id, count]);
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        error = e;
        console.log("Lambda catalogBatchProcess returns error during transaction: ", e);
    } finally {
      client.release();
      if (!error) {
        const sns = new AWS.SNS({ region: `${process.env.REGION}` });
        sns.publish({
          TopicArn: process.env.SNS_ARN,
          Message: `New product --${record.body}-- was created.`,
          Subject: 'Data was saved!'
        }).promise();
      }
    }
  }
};
