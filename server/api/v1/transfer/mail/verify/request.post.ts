import * as y from "yup";

import { and, eq, gte } from "drizzle-orm";
import {
    incognitoCommunications,
    transferVerificationChallenges,
    transfers,
} from "~~/server/db/schema";

import { db } from "~~/server/db/client";
import { generateTokenHashPair } from "~~/server/utils/crypto";
import { sendEmail } from "~~/server/aws/ses";

const schema = y.object({
    token: y.string().required("Required"),
});

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const { token: transferToken } = await schema.validate(
        await readBody(event)
    );

    // create token, tokenHash
    const { token, tokenHash } = generateTokenHashPair(32);

    // if transfer doesn't exist return error
    const transferRes = await db
        .select()
        .from(transfers)
        .where(eq(transfers.token, transferToken));
    if (transferRes.length <= 0)
        return createError({
            statusCode: 404,
            statusMessage: "Transfer Not Found",
            message: "No transfer found for this token.",
        });
    const transfer = transferRes[0];

    // if transfer sender is undefined error
    if (!transfer.from) return createError({});

    // if transfer isn't mail transfer error
    if (transfer.transferType !== "mail") return createError({});

    // if transfer is verified redirect to signin
    if (transfer.fromVerified)
        return createError({
            statusCode: 409,
            statusMessage: "Already Verified",
            message: "This transfer has already been verified.",
        });

    // check for rate limit with verification emails
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);
    const lastCommunicationRes = await db
        .select({ createdAt: incognitoCommunications.createdAt })
        .from(incognitoCommunications)
        .where(
            and(
                eq(incognitoCommunications.identifier, transfer.from),
                eq(incognitoCommunications.type, "email"),
                eq(incognitoCommunications.purpose, "transfer/verification"),
                gte(incognitoCommunications.createdAt, oneMinuteAgo)
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
        .insert(transferVerificationChallenges)
        .values({ transferToken, tokenHash });

    // create communication
    const communicationRes = await db
        .insert(incognitoCommunications)
        .values({
            identifier: transfer.from,
            type: "email",
            purpose: "verification",
        })
        .returning({ id: incognitoCommunications.id });
    const communication = communicationRes[0];

    const verificationUrl = new URL("/send/verify", config.public.baseUrl);
    verificationUrl.searchParams.set("t", token);

    const body = await compileVerifyTransferEmailTemplate({
        user: { name: transfer.from },
        verificationUrl: verificationUrl.toString(),
        communication,
    });

    await sendEmail({
        source: `"zipft" <account@${config.brand.mailFrom}>`,
        subject: "Verify your zipft transfer",
        destination: { to: transfer.from },
        body,
    });

    return {};
});
