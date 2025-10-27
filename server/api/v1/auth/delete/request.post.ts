import { and, eq, gte } from "drizzle-orm";
import { communications, deletionChallenges } from "~~/server/db/schema";

import { compileAccountDeletionRequestTemplate } from "~~/server/utils/email";
import { db } from "~~/server/db/client";
import { sendEmail } from "~~/server/aws/ses";

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const { token, tokenHash } = generateTokenHashPair(32);

    const { user, session } = event.context.auth;
    if (!user || !session)
        return createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "No active session found.",
        });

    // check for rate limit with transfer emails
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const lastCommunicationRes = await db
        .select({ createdAt: communications.createdAt })
        .from(communications)
        .where(
            and(
                eq(communications.type, "email"),
                eq(communications.purpose, "deletion"),
                eq(communications.userId, user.id),
                gte(communications.createdAt, oneMinuteAgo)
            )
        )
        .limit(1);
    if (lastCommunicationRes.length > 0) {
        const lastCommunication = lastCommunicationRes[0];
        const waitTime = Math.ceil(
            (lastCommunication.createdAt.getTime() + 60 * 1000 - Date.now()) /
                1000
        );

        return createError({
            statusCode: 429,
            statusMessage: "Rate Limit Exceeded",
            message: `Please wait ${waitTime} seconds before requesting another verification email.`,
            data: { waitTime },
        });
    }

    // create verification challenge
    await db.insert(deletionChallenges).values({ userId: user.id, tokenHash });

    const communicationRes = await db
        .insert(communications)
        .values({
            userId: user.id,
            type: "email",
            purpose: "deletion",
        })
        .returning({ id: communications.id });
    const communication = communicationRes[0];

    const deletionUrl = new URL("/auth/delete", config.public.baseUrl);
    deletionUrl.searchParams.set("t", token);

    const body = await compileAccountDeletionRequestTemplate({
        user,
        deletionUrl: deletionUrl.toString(),
        communication,
    });
    await sendEmail({
        source: `"zipft" <account@${config.brand.mailFrom}>`,
        subject: "Account Deletion Request",
        destination: { to: user.email },
        body,
    });

    return {};
});
