import { APIGatewayProxyHandler } from "aws-lambda";
import "source-map-support/register";
import { errorHandler } from "../utils";
import * as AWS from "aws-sdk";
import * as util from "util";

export const importProductsFile: APIGatewayProxyHandler = errorHandler(
  async (event) => {
    console.log("Lambda importProductsFile was called with event: ", event);

    const s3 = new AWS.S3({ maxRetries: 0, signatureVersion: "v4" }),
      getSignedUrl = util.promisify(s3.getSignedUrl.bind(s3));

    const { name } = event.queryStringParameters;
    console.log("Lambda importProductsFile requested file .csv: ", name);

    const { BUCKET_NAME } = process.env;
    const putParams = {
      Bucket: BUCKET_NAME,
      Key: `uploaded/${name}.csv`,
      Expires: 120,
      ContentType: "text/csv",
    };

    const putUrl = await getSignedUrl("putObject", putParams);
    console.log("Lambda importProductsFile returns putObject url: ", putUrl);

    return putUrl;
  }
);
