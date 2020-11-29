import { S3Handler, S3Event } from "aws-lambda";
import "source-map-support/register";
import * as AWS from "aws-sdk";
import * as csv from "csv-parser";
import { ProductImportBucketFolders } from "../constants";

export const importFileParser: S3Handler = async (event: S3Event) => {
  const s3 = new AWS.S3({ maxRetries: 0, signatureVersion: "v4" });
  const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
  console.log("Lambda importFileParser was called with event: ", event);

  for (const record of event.Records) {
    console.log("Lambda importFileParser handle record: ", record);

    const srcBucket = record.s3.bucket.name;
    console.log("Lambda importFileParser s3 Bucket name:", srcBucket);

    const srcKey = record.s3.object.key;
    console.log("Lambda importFileParser s3 Bucket key:", srcKey);

    try {
      const s3Object = await s3.getObject({
        Bucket: srcBucket,
        Key: srcKey,
      });
      console.log("Lambda importFileParser selected object: ", s3Object);

      s3Object
        .createReadStream()
        .pipe(csv())
        .on("data", async (data) => {
          const sqsPayload = {
            MessageBody: JSON.stringify(data),
            QueueUrl: process.env.SQS_URL
          };
      
          await sqs.sendMessage(sqsPayload).promise();
          console.log("Lambda importFileParser sqs sent data: ", sqsPayload);
        });
    } catch (error) {
      console.log("Lambda importFileParser parsing stream error: ", error);
    }

    try {
      await s3
        .copyObject({
          Bucket: srcBucket,
          CopySource: `${srcBucket}/${srcKey}`,
          Key: srcKey.replace(
            ProductImportBucketFolders.UPLOADED,
            ProductImportBucketFolders.PARSED
          ),
        })
        .promise();

      await s3
        .deleteObject({
          Bucket: srcBucket,
          Key: srcKey,
        })
        .promise();

      console.log(
        `Lambda importFileParser transfer for the folder ${
          srcKey.split("/")[1]
        } was done.`
      );
    } catch (error) {
      console.log("Lambda importFileParser moving files error: ", error);
    }
  }
};
