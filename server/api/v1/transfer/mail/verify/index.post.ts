import * as y from "yup";

import { transferVerificationChallenges, transfers } from "~~/server/db/schema";

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
    const transferVerificationChallengeRes = await db
        .select()
        .from(transferVerificationChallenges)
        .where(eq(transferVerificationChallenges.tokenHash, tokenHash));
    if (transferVerificationChallengeRes.length <= 0)
        return createError({
            statusCode: 400,
            statusMessage: "Invalid Token",
            message: "The verification token provided is invalid.",
        });
    const verificationChallenge = transferVerificationChallengeRes[0];

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

    const transferRes = await db
        .select()
        .from(transfers)
        .where(eq(transfers.token, verificationChallenge.transferToken));
    const transfer = transferRes[0];

    if (transfer.fromVerified)
        return createError({
            statusCode: 409,
            statusMessage: "Already Verified",
            message: "This account has already been verified.",
        });

    // update verificationChallenge used, usedAt and user verified where verificationChallenge.userId eq user.id
    await db.transaction(async (tx) => {
        await tx
            .update(transferVerificationChallenges)
            .set({ used: true, usedAt: now })
            .where(eq(transferVerificationChallenges.tokenHash, tokenHash));
        await tx
            .update(transfers)
            .set({ fromVerified: true })
            .where(eq(transfers.token, verificationChallenge.transferToken));
    });

    // TODO: after verify send emails

    // send error email to sender if there was an issue with sending an email

    return {};
});
