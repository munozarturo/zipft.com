import { and, eq, isNotNull, sql } from "drizzle-orm";
import { requests, sessions } from "~~/server/db/schema";

import { db } from "~~/server/db/client";

export default defineEventHandler(async (event) => {
    const { user, session } = event.context.auth;

    if (!user || !session)
        return createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "No active session found.",
        });

    const sessionsRes = await db
        .selectDistinctOn([sessions.id], {
            id: sessions.id,
            createdAt: sessions.createdAt,
            lastVerifiedAt: sessions.lastVerifiedAt,
            lastUsed: sql`(
                SELECT MAX(${requests.madeAt}) 
                FROM ${requests} 
                WHERE ${requests.sessionId} = ${sessions.id}
            )`.as("lastUsed"),

            ipAddress: requests.ipAddress,
            userAgent: requests.userAgent,
            platform: requests.platform,
            browser: requests.browser,
            isMobile: requests.isMobile,
        })
        .from(sessions)
        .leftJoin(
            requests,
            and(
                eq(sessions.id, requests.sessionId),
                isNotNull(requests.ipAddress)
            )
        )
        .where(eq(sessions.userId, user.id))
        .orderBy(sessions.id, requests.madeAt);

    return {
        sessions: sessionsRes,
    };
});
