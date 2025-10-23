import * as y from "yup";

import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { db } from "~~/server/db/client";
import { eq } from "drizzle-orm";
import { objects } from "~~/server/db/schema";
import { s3Client } from "~~/server/aws/s3";

const schema = y.object({
    key: y.string().required(),
});

export default defineEventHandler(async (event) => {
    const { key } = await schema.validate(await readBody(event));

    const objectRes = await db
        .select()
        .from(objects)
        .where(eq(objects.id, key));
    if (objectRes.length < 1)
        return createError({
            statusCode: 404,
            statusMessage: "Object not found",
            message: "The requested object does not exist",
        });
    const object = objectRes[0];

    if (object.verified)
        return createError({
            statusCode: 409,
            statusMessage: "Object already exists",
            message:
                "This object has already been uploaded and verified. Cannot upload again.",
        });

    const presignedPost = await createPresignedPost(s3Client, {
        Bucket: object.s3Bucket,
        Key: object.s3Key,
        Conditions: [
            ["content-length-range", object.size, object.size],
            ["eq", "$Content-Type", object.contentType],
            ["eq", "$Content-MD5", object.md5],
            ["eq", "$x-amz-meta-key", object.id],
        ],
        Fields: {
            "Content-Type": object.contentType,
            "Content-MD5": object.md5,
            "x-amz-meta-key": object.id,
            key: object.s3Key,
        },
        Expires: 3600,
    });

    return {
        url: presignedPost.url,
        fields: presignedPost.fields,
    };
});
