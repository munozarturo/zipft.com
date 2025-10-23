import * as y from "yup";

import { and, eq, gte } from "drizzle-orm";
import { communications, recoveryChallenges, users } from "~~/server/db/schema";

import { compilePasswordResetTemplate } from "~~/server/utils/email";
import { db } from "~~/server/db/client";
import { emailSchema } from "~~/shared/schema/auth";
import { generateTokenHashPair } from "~~/server/utils/crypto";
import { sendEmail } from "~~/server/aws/ses";

const schema = y.object({
    email: emailSchema.required("Required"),
    callback: y.string().optional(),
});

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const { email, callback } = await schema.validate(await readBody(event));

    // Check if user email exists
    const userRes = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            verified: users.verified,
        })
        .from(users)
        .where(and(eq(users.email, email), eq(users.deleted, false)));

    // Always return the same message to prevent email enumeration
    const baseResponse = {
        message:
            "If an account with that email exists, a recovery email has been sent.",
    };

    // If user doesn't exist, return obscure message without doing anything
    if (userRes.length <= 0) {
        return baseResponse;
    }
    const user = userRes[0];

    // Check if not exceeding one password reset communication per minute
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const recentCommunicationRes = await db
        .select({ createdAt: communications.createdAt })
        .from(communications)
        .where(
            and(
                eq(communications.type, "email"),
                eq(communications.purpose, "recovery"),
                eq(communications.userId, user.id),
                gte(communications.createdAt, oneMinuteAgo)
            )
        )
        .limit(1);

    // If there's a recent recovery communication, return rate limit info
    if (recentCommunicationRes.length > 0) {
        const recentCommunication = recentCommunicationRes[0];
        const waitTime = Math.ceil(
            (recentCommunication.createdAt.getTime() + 60 * 1000 - Date.now()) /
                1000
        );

        return createError({
            statusCode: 429,
            statusMessage: "Rate Limit Exceeded",
            message: `Please wait ${waitTime} seconds before requesting another recovery email.`,
            data: { waitTime },
        });
    }

    // Generate token and hash
    const { token, tokenHash } = generateTokenHashPair(32);

    try {
        // Create recovery challenge
        await db
            .insert(recoveryChallenges)
            .values({ userId: user.id, tokenHash });

        // Create communication record
        const communicationRes = await db
            .insert(communications)
            .values({
                userId: user.id,
                type: "email",
                purpose: "recovery",
            })
            .returning({ id: communications.id });
        const communication = communicationRes[0];

        const recoveryUrl = new URL("/auth/recover", config.baseUrl);
        recoveryUrl.searchParams.set("t", token);
        if (callback) recoveryUrl.searchParams.set("c", callback);

        // TODO: standardize email sending and templating
        // Send recovery email with token
        const body = await compilePasswordResetTemplate({
            user,
            passwordResetUrl: recoveryUrl.toString(),
            communication,
        });
        await sendEmail({
            source: `"zipft" <account@${config.brand.mailFrom}>`,
            subject: "Reset your zipft password",
            destination: { to: email },
            body,
        });
    } catch (error) {
        // Log error but still return obscure message
        console.error("Failed to process recovery request:", error);
    }

    return baseResponse;
});
