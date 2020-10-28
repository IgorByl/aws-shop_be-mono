import { APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import errorHandler from "../utils";
import dynamoDB from "../db-product";

interface IScanRequestParams {
  TableName: string;
  Limit?: number;
  ExclusiveStartKey?: { [key: string]: any };
}

export const getProductById: APIGatewayProxyHandler = errorHandler(async (event, context) => {
  const scanResults = [];
  let items;

  const params: IScanRequestParams = {
    TableName: process.env.tableName
  };

  if (event.queryStringParameters && event.queryStringParameters.lastEvaluatedKey) {
    params.ExclusiveStartKey = {id: event.queryStringParameters.lastEvaluatedKey};
  }

  if (event.queryStringParameters && event.queryStringParameters.limit) {
    params.Limit = event.queryStringParameters.limit
  }

  const handleData = async () => {
    items = await dynamoDB.scan(params);
    items.Items.forEach(item => scanResults.push(item));
    params.ExclusiveStartKey = items.LastEvaluatedKey;
  }

  if (params.Limit) {
    await handleData();
  } else {
    do {
      await handleData();
    } while (items.LastEvaluatedKey);
  }

  return { scanResults, exclusiveStartKey: params.ExclusiveStartKey || null };
});
