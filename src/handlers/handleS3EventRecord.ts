import { S3EventRecord } from "aws-lambda";
import { getObject, putObject } from "../services/aws/s3";
import { simpleParser } from "mailparser";

export const handleS3EventRecord = async (record: S3EventRecord) => {
  const bucket = record.s3.bucket.name;
  const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
  const fileSize = record.s3.object.size;
  const billingBucket = process.env.BILLING_BUCKET;

  if (!billingBucket) {
    console.error("Billing bucket not defined, exit");
    return;
  }

  if (fileSize === 0) {
    console.warn("File size is 0, exit");
    return;
  }

  const buffer = await getObject(bucket, key);

  if (buffer) {
    const mail = await simpleParser(buffer);

    const date = new Date().toISOString().split("T");

    for (const attachment of mail.attachments) {
      try {
        await putObject(
          billingBucket,
          `billing/${date[0]}/${date[1]}-${attachment.filename}`,
          attachment.content,
        );
      } catch (e) {
        console.error("Failed to process", {
          filename: attachment.filename,
        });
      }
    }
  } else {
    console.warn("No buffer from", { bucket, key });
  }
};