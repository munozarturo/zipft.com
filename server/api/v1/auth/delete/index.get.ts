import * as y from "yup";

import { deletionChallenges, users } from "~~/server/db/schema";

import { db } from "~~/server/db/client";
import { eq } from "drizzle-orm";

const schema = y.object({
    token: y.string().required("Required"),
});

export default defineEventHandler(async (event) => {
    const now = new Date();

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

    return {
        user,
        request: {
            createdAt: deletionChallenge.createdAt,
            expiresAt: deletionChallenge.expiresAt,
        },
    };
});
