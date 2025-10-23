import * as y from "yup";

import { desc, eq } from "drizzle-orm";
import { transferChallenges, users } from "~~/server/db/schema";

import { db } from "~~/server/db/client";

const schema = y.object({
    token: y.string().required("Required"),
});

export default defineEventHandler(async (event) => {
    const now = new Date();

    const { token } = await schema.validate(getQuery(event));
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

    // fetch user
    const userRes = await db
        .select({
            id: users.id,
            email: users.email,
            name: users.name,
            avatarUrl: users.avatarUrl,
            verified: users.verified,
        })
        .from(users)
        .where(eq(users.id, transferChallenge.userId));
    if (userRes.length <= 0)
        return createError({
            statusCode: 404,
            statusMessage: "User doesn't exist",
            message: "Requested user does not exist.",
        });
    const user = userRes[0];

    const mostRecentTransferChallengeRes = await db
        .select()
        .from(transferChallenges)
        .where(eq(transferChallenges.userId, user.id))
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

    return {
        user,
        transfer: {
            email: transferChallenge.email,
            createdAt: transferChallenge.createdAt,
            expiresAt: transferChallenge.expiresAt,
        },
    };
});
