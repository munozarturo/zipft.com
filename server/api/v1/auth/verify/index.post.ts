import * as y from "yup";

import { users, verificationChallenges } from "~~/server/db/schema";

import { db } from "~~/server/db/client";
import { eq } from "drizzle-orm";

const schema = y.object({
    token: y.string().required("Required"),
});

export default defineEventHandler(async (event) => {
    const now = new Date();

    const { token } = await schema.validate(await readBody(event));

    // compute tokenHash
    const tokenHash = hashToken(token);

    // find verificationChallenge
    const verificationChallengeRes = await db
        .select()
        .from(verificationChallenges)
        .where(eq(verificationChallenges.tokenHash, tokenHash));
    if (verificationChallengeRes.length <= 0)
        return createError({
            statusCode: 400,
            statusMessage: "Invalid Token",
            message: "The verification token provided is invalid.",
        });
    const verificationChallenge = verificationChallengeRes[0];

    // if token has been used return error
    if (verificationChallenge.used)
        return createError({
            statusCode: 409,
            statusMessage: "Token Already Used",
            message: "This verification token has already been used.",
        });

    // if token expired return error
    if (now > verificationChallenge.expiresAt)
        return createError({
            statusCode: 410,
            statusMessage: "Token Expired",
            message: "This verification token has expired.",
        });

    const userRes = await db
        .select({ verified: users.verified })
        .from(users)
        .where(eq(users.id, verificationChallenge.userId));
    const user = userRes[0];

    if (user.verified)
        return createError({
            statusCode: 409,
            statusMessage: "Already Verified",
            message: "This account has already been verified.",
        });

    // update verificationChallenge used, usedAt and user verified where verificationChallenge.userId eq user.id
    await db.transaction(async (tx) => {
        await tx
            .update(verificationChallenges)
            .set({ used: true, usedAt: now })
            .where(eq(verificationChallenges.tokenHash, tokenHash));
        await tx
            .update(users)
            .set({ verified: true })
            .where(eq(users.id, verificationChallenge.userId));
    });

    return {};
});
