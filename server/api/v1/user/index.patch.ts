import * as y from "yup";

import { objects, users } from "~~/server/db/schema";

import { db } from "~~/server/db/client";
import { eq } from "drizzle-orm";
import { objectSchema } from "~~/shared/schema/objects";

interface Result {
    path: URL | null;
    avatar: {
        key: string;
        path: string;
        method: string;
        url: string;
    } | null;
}

const schema = y.object({
    name: y.string().min(1).max(20).optional().nullable(),
    avatar: objectSchema
        .shape({
            size: y
                .number()
                .required()
                .max(4 * 1024 * 1024, "Avatar must be less than 4MB"),
            type: y
                .string()
                .required()
                .oneOf(
                    ["image/jpeg", "image/png", "image/webp"],
                    "Avatar must be JPEG, PNG, or WebP"
                ),
        })
        .optional()
        .nullable(),
});

export default defineEventHandler(async (event) => {
    const { user } = event.context.auth;

    if (!user)
        return createError({
            statusCode: 401,
            statusMessage: "Authentication required",
            message: "You must be logged in to update your profile.",
        });

    const result: Result = { path: null, avatar: null };

    const { name, avatar } = await schema.validate(await readBody(event));

    if (name) {
        await db
            .update(users)
            .set({ name: name, onboarded: true })
            .where(eq(users.id, user.id));
    }

    if (avatar) {
        const key = generateToken(32);
        const avatarObjectRes = await db
            .insert(objects)
            .values({
                id: key,
                fileName: avatar.name,
                size: avatar.size,
                contentType: avatar.type,
                md5: avatar.md5,
                s3Bucket: "zipft-cdn-public",
                s3Key: `avatar/${user.id}`,
            })
            .returning();
        const avatarObject = avatarObjectRes[0];

        const avatarUrl = `https://${avatarObject.s3Bucket}.s3.amazonaws.com/${avatarObject.s3Key}`;

        await db
            .update(users)
            .set({
                avatar: avatarObject.id,
                avatarUrl: avatarUrl,
            })
            .where(eq(users.id, user.id));

        result.avatar = {
            key: avatarObject.id,
            path: "/api/v1/object/upload",
            method: "POST",
            url: avatarUrl,
        };
    }

    return result;
});
