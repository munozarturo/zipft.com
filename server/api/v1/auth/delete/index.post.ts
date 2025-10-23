import * as y from "yup";

import { communications, deletionChallenges, users } from "~~/server/db/schema";

import { compileAccountDeletionConfirmationTemplate } from "~~/server/utils/email";
import { db } from "~~/server/db/client";
import { eq } from "drizzle-orm";
import { sendEmail } from "~~/server/aws/ses";

const schema = y.object({
    token: y.string().required("Required"),
});

export default defineEventHandler(async (event) => {
    const now = new Date();

    const config = useRuntimeConfig();

    const { token } = await schema.validate(getQuery(event));
    const tokenHash = hashToken(token);

    // Find recovery challenge
    const deletionChallengeRes = await db
        .select()
        .from(deletionChallenges)
        .where(eq(deletionChallenges.tokenHash, tokenHash));
    if (deletionChallengeRes.length <= 0)
        return createError({
            statusCode: 400,
            statusMessage: "Invalid Token",
            message: "The transfer token provided is invalid.",
        });
    const deletionChallenge = deletionChallengeRes[0];

    // If token has been used return error
    if (deletionChallenge.used)
        return createError({
            statusCode: 409,
            statusMessage: "Token Already Used",
            message: "This transfer token has already been used.",
        });

    // If token expired return error
    if (now > deletionChallenge.expiresAt)
        return createError({
            statusCode: 410,
            statusMessage: "Token Expired",
            message: "This transfer token has expired.",
        });

    // If userId is null, the user was already deleted
    if (!deletionChallenge.userId)
        return createError({
            statusCode: 409,
            statusMessage: "Token Already Used",
            message: "This deletion token has already been used.",
        });

    const userRes = await db
        .select({
            id: users.id,
            email: users.email,
            name: users.name,
            avatarUrl: users.avatarUrl,
            verified: users.verified,
        })
        .from(users)
        .where(eq(users.id, deletionChallenge.userId));
    if (userRes.length <= 0)
        return createError({
            statusCode: 409,
            statusMessage: "Token Already Used",
            message: "This deletion token has already been used.",
        });
    const user = userRes[0];

    const communicationRes = await db
        .insert(communications)
        .values({
            userId: user.id,
            type: "email",
            purpose: "deletion",
        })
        .returning({ id: communications.id });
    const communication = communicationRes[0];

    // Update challenge and user email in transaction
    await db.transaction(async (tx) => {
        await tx
            .update(deletionChallenges)
            .set({ used: true, usedAt: now })
            .where(eq(deletionChallenges.tokenHash, tokenHash));

        // We know userId is not null because we checked above
        await tx.delete(users).where(eq(users.id, deletionChallenge.userId!));

        const body = await compileAccountDeletionConfirmationTemplate({
            user,
            communication,
        });
        await sendEmail({
            source: `"zipft" <account@${config.brand.mailFrom}>`,
            subject: "Account Deleted",
            destination: { to: user.email },
            body,
        });
    });

    return {};
});
