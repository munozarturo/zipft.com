import * as y from "yup";

import { and, eq, gte } from "drizzle-orm";
import {
    communications,
    users,
    verificationChallenges,
} from "~~/server/db/schema";

import { compileVerifyEmailTemplate } from "~~/server/utils/email";
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

    // create token, tokenHash
    const { token, tokenHash } = generateTokenHashPair(32);

    // if user email doesn't exist redirect to signup
    const userRes = await db
        .select({
            id: users.id,
            name: users.name,
            email: users.email,
            verified: users.verified,
        })
        .from(users)
        .where(eq(users.email, email));
    if (userRes.length <= 0)
        return createError({
            statusCode: 404,
            statusMessage: "User Not Found",
            message: "No account found for this email address.",
        });
    const user = userRes[0];

    // if user is verified redirect to signin
    if (user.verified)
        return createError({
            statusCode: 409,
            statusMessage: "Already Verified",
            message:
                "This email address is already verified. Please sign in instead.",
        });

    // check for rate limit with verification emails
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const lastCommunicationRes = await db
        .select({ createdAt: communications.createdAt })
        .from(communications)
        .where(
            and(
                eq(communications.type, "email"),
                eq(communications.purpose, "verification"),
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
    await db
        .insert(verificationChallenges)
        .values({ userId: user.id, tokenHash });

    // create communication
    const communicationRes = await db
        .insert(communications)
        .values({
            userId: user.id,
            type: "email",
            purpose: "verification",
        })
        .returning({ id: communications.id });
    const communication = communicationRes[0];

    const verificationUrl = new URL("/auth/verify", config.baseUrl);
    verificationUrl.searchParams.set("t", token);
    if (callback) verificationUrl.searchParams.set("c", callback);

    const body = await compileVerifyEmailTemplate({
        user,
        verificationUrl: verificationUrl.toString(),
        communication,
    });

    await sendEmail({
        source: `"zipft" <account@${config.brand.mailFrom}>`,
        subject: "Verify your zipft account",
        destination: { to: email },
        body,
    });

    return {};
});
