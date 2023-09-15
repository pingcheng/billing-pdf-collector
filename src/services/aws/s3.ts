import { S3 } from "@aws-sdk/client-s3";

const s3 = new S3({
  region: process.env.REGION,
});

export const getObject = async (
  bucket: string,
  key: string,
): Promise<Buffer | null> => {
  console.log("Trying to get object from s3", { bucket, key });

  const response = await s3.getObject({
    Bucket: bucket,
    Key: key,
  });

  const body = response.Body;

  if (!body) {
    return null;
  }

  const buffer = Buffer.from(await body.transformToByteArray());

  console.log(`File received, size: ${buffer.length}`);

  return buffer;
};

export const putObject = async (
  bucket: string,
  key: string,
  buffer: Buffer,
) => {
  console.log("Trying to put object into s3", {
    bucket,
    key,
    bufferSize: buffer.length,
  });

  await s3.putObject({
    Bucket: bucket,
    Key: key,
    Body: buffer,
  });
};

export const deleteObject = async (bucket: string, key: string) => {
  console.log("Trying to delete object from s3", {
    bucket,
    key,
  });

  await s3.deleteObject({
    Bucket: bucket,
    Key: key,
  });
};
