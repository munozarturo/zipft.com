import * as y from "yup";

import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { db } from "~~/server/db/client";
import { eq } from "drizzle-orm";
import { objects } from "~~/server/db/schema";
import { s3Client } from "~~/server/aws/s3";

const schema = y.object({
    key: y.string().required(),
});

export default defineEventHandler(async (event) => {
    const now = new Date();

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

    if (!object.verified) {
        let exists: boolean = true;
        try {
            const headCommand = new HeadObjectCommand({
                Bucket: object.s3Bucket,
                Key: object.s3Key,
            });
            await s3Client.send(headCommand);
        } catch (error: any) {
            if (
                error.name === "NotFound" ||
                error.$metadata?.httpStatusCode === 404
            )
                exists = false;
            throw error;
        }

        if (exists)
            await db
                .update(objects)
                .set({ verified: true, verifiedAt: now })
                .where(eq(objects.id, key));
    }

    return {};
});
