import { S3Client } from "@aws-sdk/client-s3";

const AWS_REGION = process.env.AWS_REGION;
if (!AWS_REGION) throw new Error("AWS_REGION is not set");

const AWS_KEY = process.env.AWS_KEY;
if (!AWS_KEY) throw new Error("AWS_KEY is not set");

const AWS_SECRET = process.env.AWS_SECRET;
if (!AWS_SECRET) throw new Error("AWS_SECRET is not set");

const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_KEY,
        secretAccessKey: AWS_SECRET,
    },
});

export { s3Client };
