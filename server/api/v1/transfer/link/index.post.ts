import * as y from "yup";

import { objects, transfers } from "~~/server/db/schema";

import { db } from "~~/server/db/client";
import { linkSchema } from "~~/shared/schema/transfer";
import { objectSchema } from "~~/shared/schema/objects";

const schema = linkSchema.omit(["files"]).shape({
    file: objectSchema,
    duration: y
        .object({
            start: y.date(),
            end: y.date(),
        })
        .nullable(),
});

export default defineEventHandler(async (event) => {
    const {
        title,
        message,
        isBeacon,
        duration,
        downloadLimit,
        file,
        anonimize,
    } = await schema.validate(await readBody(event));

    const { user } = event.context.auth;

    const transferToken = generateToken(6);
    const { token: objectToken, tokenHash: objectTokenHash } =
        generateTokenHashPair(32);

    // check that file is not too large
    if (!user)
        if (file.size > 1024 * 1024 * 1024 * 2)
            return createError({
                statusCode: 413,
                statusMessage: "File too large",
                message:
                    "File size exceeds the 2GB limit for unauthenticated users. Please sign in to upload larger files.",
            });

    // create object
    const objectRes = await db
        .insert(objects)
        .values({
            id: objectToken,
            fileName: file.name,
            contentType: file.type,
            size: file.size,
            md5: file.md5,
            s3Bucket: "zipft-cdn",
            s3Key: `transfer/${objectTokenHash}`,
        })
        .returning();
    if (objectRes.length < 1) return createError({});
    const object = objectRes[0];

    // create transfer
    await db.insert(transfers).values({
        transferType: "link",
        token: transferToken,
        objectId: object.id,
        userId: user?.id,
        title,
        message,
        beacon: isBeacon,
        durationStart: duration?.start,
        durationEnd: duration?.end,
        downloadLimit,
        anonymous: anonimize,
    });

    // return object key
    return {
        token: transferToken,
        file: {
            key: object.id,
            path: "/api/v1/object/upload",
            method: "POST",
        },
    };
});
