import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import errorHandler from "../utils";
import dynamoDB from "../db-product";
import * as uuid from "uuid";

export const createProduct: APIGatewayProxyHandler = errorHandler(
  async event => {

    const data = JSON.parse(event.body);

    const createParams = {
      TableName: process.env.tableName,
      Item: {
        id: uuid.v1(),
        title: data.title,
        description: data.description,
        productCost: data.productCost,
        createdAt: Date.now(),
      },
      ReturnValues: "ALL_OLD",
    };

    return await dynamoDB.put(createParams);
  }
);
