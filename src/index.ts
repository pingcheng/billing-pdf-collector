import { S3Handler } from "aws-lambda";
import {handleS3EventRecord} from "./handlers/handleS3EventRecord";

export const handler: S3Handler = async (event) => {
  console.log("Received triggering from S3 upload");
  console.log("Event", JSON.stringify(event));

  const records = event.Records;

  for (const index in records) {
    const record = records[index];

    try {
      await handleS3EventRecord(record);
    } catch (e) {
      console.error(`Failed on process record index at ${index}`, e);
    }
  }
}