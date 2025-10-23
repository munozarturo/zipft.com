import * as y from "yup";

import { and, eq, gte } from "drizzle-orm";
import { communications, transferChallenges, users } from "~~/server/db/schema";
import {
    compileAccountTransferFailureTemplate,
    compileAccountTransferRequestTemplate,
    compileAccountTransferSuccessTemplate,
} from "~~/server/utils/email";

import { db } from "~~/server/db/client";
import { emailSchema } from "~~/shared/schema/auth";
import { generateTokenHashPair } from "~~/server/utils/crypto";
import { sendEmail } from "~~/server/aws/ses";

const schema = y.object({
    email: emailSchema.required("Required"),
});

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const { email } = await schema.validate(await readBody(event));

    // create token, tokenHash
    const { token, tokenHash } = generateTokenHashPair(32);

    const { user, session } = event.context.auth;
    if (!user || !session)
        return createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "No active session found.",
        });

    if (user.email === email)
        return createError({
            statusCode: 400,
            statusMessage: "Bad request",
            message: "Can't transfer account ownership to current email.",
        });

    // check for rate limit with transfer emails
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const lastCommunicationRes = await db
        .select({ createdAt: communications.createdAt })
        .from(communications)
        .where(
            and(
                eq(communications.type, "email"),
                eq(communications.purpose, "transfer"),
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

    // create communication
    const communicationRes = await db
        .insert(communications)
        .values({
            userId: user.id,
            type: "email",
            purpose: "transfer",
        })
        .returning({ id: communications.id });
    const communication = communicationRes[0];

    const existingUser = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.email, email));
    if (existingUser.length > 0) {
        const body = await compileAccountTransferFailureTemplate({
            oldEmail: user.email,
            communication,
        });
        await sendEmail({
            source: `"zipft" <account@${config.brand.mailFrom}>`,
            subject: "Account Transfer Request",
            destination: { to: email },
            body,
        });
    } else {
        // create transfer challenge
        await db
            .insert(transferChallenges)
            .values({ userId: user.id, email, tokenHash });

        const transferUrl = new URL("/auth/transfer", config.baseUrl);
        transferUrl.searchParams.set("t", token);

        const body = await compileAccountTransferRequestTemplate({
            user,
            oldEmail: user.email,
            transferUrl: transferUrl.toString(),
            communication,
        });
        await sendEmail({
            source: `"zipft" <account@${config.brand.mailFrom}>`,
            subject: "Account Transfer Request",
            destination: { to: email },
            body,
        });
    }

    return {};
});
