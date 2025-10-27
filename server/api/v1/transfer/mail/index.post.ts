import * as y from "yup";

import { objects, transfers } from "~~/server/db/schema";

import { db } from "~~/server/db/client";
import { mailSchema } from "~~/shared/schema/transfer";
import { objectSchema } from "~~/shared/schema/objects";

const schema = mailSchema.omit(["files"]).shape({
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
        from,
        to,
        title,
        message,
        isBeacon,
        duration,
        downloadLimit,
        file,
    } = await schema.validate(await readBody(event));

    const { user } = event.context.auth;
    // user is not authorized to act on another's behalf
    if (user && user.email !== from) return createError({});

    const transferToken = generateToken(6);
    const { token: objectToken, tokenHash: objectTokenHash } =
        generateTokenHashPair(32);

    // check that file is not too large
    if (!user)
        if (file.size > 1024 * 1024)
            // 2GB limit
            return createError({});

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
    const transferRes = await db
        .insert(transfers)
        .values({
            transferType: "mail",
            from,
            to,
            token: transferToken,
            objectId: object.id,
            userId: user?.id,
            title,
            message,
            beacon: isBeacon,
            durationStart: duration?.start,
            durationEnd: duration?.end,
            downloadLimit,
        })
        .returning({ token: transfers.token });
    const transfer = transferRes[0];

    // return object key
    return {
        token: transfer.token,
        file: {
            key: object.id,
            path: "/api/v1/object/upload",
            method: "POST",
        },
        transfer: {
            path: "/api/v1/transfer/verify/request",
            body: {
                token: transfer.token,
            },
            method: "POST",
        },
    };
});
