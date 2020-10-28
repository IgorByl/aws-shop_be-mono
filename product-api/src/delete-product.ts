import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import errorHandler from "../utils";
import dynamoDB from "../db-product";

export const deleteProduct: APIGatewayProxyHandler = errorHandler(
  async event => {

    const deleteParams = {
      TableName: process.env.tableName,
      Key: {
        id: event.pathParameters.id,
      },
    };

    return await dynamoDB.delete(deleteParams);
  }
);
