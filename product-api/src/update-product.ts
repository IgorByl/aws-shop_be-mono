import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import errorHandler from "../utils";
import dynamoDB from "../db-product";

export const updateProduct: APIGatewayProxyHandler = errorHandler(
  async event => {
    const data = JSON.parse(event.body);

    const updateParams = {
      TableName: process.env.tableName,
      Key: {
        id: event.pathParameters.id,
      },
      UpdateExpression:
        "SET title = :title, description = :description, productCost = :productCost",
      ExpressionAttributeValues: {
        ":title": data.title || null,
        ":description": data.description || null,
        ":productCost": data.productCost || null,
      },
      ReturnValues: "UPDATED_NEW",
    };

    return await dynamoDB.update(updateParams);
  }
);
