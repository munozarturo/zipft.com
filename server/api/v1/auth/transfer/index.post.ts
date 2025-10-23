import * as y from "yup";

import {
    communications,
    sessions,
    transferChallenges,
    users,
} from "~~/server/db/schema";
import { desc, eq } from "drizzle-orm";

import { compileAccountTransferSuccessTemplate } from "~~/server/utils/email";
import { db } from "~~/server/db/client";
import { hashToken } from "~~/server/utils/crypto";
import { sendEmail } from "~~/server/aws/ses";

const schema = y.object({
    token: y.string().required("Required"),
});

export default defineEventHandler(async (event) => {
    const now = new Date();

    const config = useRuntimeConfig();

    const { token } = await schema.validate(await readBody(event));
    const tokenHash = hashToken(token);

    // Find recovery challenge
    const transferChallengeRes = await db
        .select()
        .from(transferChallenges)
        .where(eq(transferChallenges.tokenHash, tokenHash));
    if (transferChallengeRes.length <= 0)
        return createError({
            statusCode: 400,
            statusMessage: "Invalid Token",
            message: "The transfer token provided is invalid.",
        });
    const transferChallenge = transferChallengeRes[0];

    // If token has been used return error
    if (transferChallenge.used)
        return createError({
            statusCode: 409,
            statusMessage: "Token Already Used",
            message: "This transfer token has already been used.",
        });

    // If token expired return error
    if (now > transferChallenge.expiresAt)
        return createError({
            statusCode: 410,
            statusMessage: "Token Expired",
            message: "This transfer token has expired.",
        });

    const mostRecentTransferChallengeRes = await db
        .select()
        .from(transferChallenges)
        .where(eq(transferChallenges.userId, transferChallenge.userId))
        .orderBy(desc(transferChallenges.createdAt))
        .limit(1);
    const mostRecentTransferChallenge = mostRecentTransferChallengeRes[0];
    if (
        mostRecentTransferChallenge &&
        mostRecentTransferChallenge.tokenHash !== tokenHash
    )
        return createError({
            statusCode: 410,
            statusMessage: "Token Superseded",
            message:
                "This transfer token has been superseded by a more recent transfer request.",
        });

    // Get the old email before updating
    const userBeforeUpdate = await db
        .select({ id: users.id, name: users.name, email: users.email })
        .from(users)
        .where(eq(users.id, transferChallenge.userId))
        .limit(1);
    const user = userBeforeUpdate[0];

    const communicationRes = await db
        .insert(communications)
        .values({
            userId: user.id,
            type: "email",
            purpose: "transfer",
        })
        .returning({ id: communications.id });
    const communication = communicationRes[0];

    // Update challenge and user email in transaction
    await db.transaction(async (tx) => {
        await tx
            .update(transferChallenges)
            .set({ used: true, usedAt: now })
            .where(eq(transferChallenges.tokenHash, tokenHash));
        await tx
            .update(users)
            .set({ verified: true, email: transferChallenge.email })
            .where(eq(users.id, transferChallenge.userId));
        await tx.delete(sessions).where(eq(sessions.userId, user.id));

        const body = await compileAccountTransferSuccessTemplate({
            user,
            oldEmail: user.email,
            newEmail: transferChallenge.email,
            communication,
        });
        await sendEmail({
            source: `"zipft" <account@${config.brand.mailFrom}>`,
            subject: "Account Transferred",
            destination: { to: transferChallenge.email },
            body,
        });

        if (user.email) {
            await sendEmail({
                source: `"zipft" <account@${config.brand.mailFrom}>`,
                subject: "Account Transferred",
                destination: { to: user.email },
                body,
            });
        }
    });

    return {};
});
