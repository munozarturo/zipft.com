import * as argon2 from "argon2";
import * as y from "yup";

import { recoveryChallenges, users } from "~~/server/db/schema";

import { db } from "~~/server/db/client";
import { eq } from "drizzle-orm";
import { hashToken } from "~~/server/utils/crypto";
import { passwordSchema } from "~~/shared/schema/auth";

const schema = y.object({
    token: y.string().required("Required"),
    password: passwordSchema.required("Required"),
});

export default defineEventHandler(async (event) => {
    const now = new Date();

    const { token, password } = await schema.validate(await readBody(event));
    const passwordHash = await argon2.hash(password);
    const tokenHash = hashToken(token);

    // Find recovery challenge
    const recoveryChallengeRes = await db
        .select()
        .from(recoveryChallenges)
        .where(eq(recoveryChallenges.tokenHash, tokenHash));
    if (recoveryChallengeRes.length <= 0)
        return createError({
            statusCode: 400,
            statusMessage: "Invalid Token",
            message: "The recovery token provided is invalid.",
        });
    const recoveryChallenge = recoveryChallengeRes[0];

    // If token has been used return error
    if (recoveryChallenge.used)
        return createError({
            statusCode: 409,
            statusMessage: "Token Already Used",
            message: "This recovery token has already been used.",
        });

    // If token expired return error
    if (now > recoveryChallenge.expiresAt)
        return createError({
            statusCode: 410,
            statusMessage: "Token Expired",
            message: "This recovery token has expired.",
        });

    // Update recovery challenge and user password in transaction
    await db.transaction(async (tx) => {
        await tx
            .update(recoveryChallenges)
            .set({ used: true, usedAt: now })
            .where(eq(recoveryChallenges.tokenHash, tokenHash));
        await tx
            .update(users)
            .set({ verified: true, passwordHash })
            .where(eq(users.id, recoveryChallenge.userId));
    });

    return {};
});
