import { sessions, users } from "~~/server/db/schema";

import { db } from "~~/server/db/client";
import { eq } from "drizzle-orm";
import { hashToken } from "~~/server/utils/crypto";
import { timingSafeEqual } from "crypto";

const inactivityTimeoutSeconds = 60 * 60 * 24 * 10;
const activityCheckIntervalSeconds = 60 * 60;

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const now = new Date();

    const sessionCookie = getCookie(event, "session");

    event.context.auth = { user: null, session: null };

    const clearAuth = async (sessionId?: string) => {
        setCookie(event, "session", "", {
            maxAge: 0,
            httpOnly: true,
            secure: config.enviornment === "production",
            path: "/",
            sameSite: "lax",
            domain: config.cookies.domain,
        });
        if (sessionId)
            await db.delete(sessions).where(eq(sessions.id, sessionId));
    };

    // Early return if no session cookie
    if (!sessionCookie) return;

    // Parse and validate token format
    const tokenParts = sessionCookie.split(".");
    if (tokenParts.length !== 2) return clearAuth();

    const [sessionId, sessionToken] = tokenParts;
    const tokenHash = hashToken(sessionToken);

    try {
        // Fetch session from database
        const sessionRes = await db
            .select()
            .from(sessions)
            .where(eq(sessions.id, sessionId));

        if (sessionRes.length === 0) return clearAuth();
        const session = sessionRes[0];

        // Verify token hash matches (should use constant time comparison for security)
        const sessionHashBuffer = Buffer.from(session.tokenHash, "hex");
        const tokenHashBuffer = Buffer.from(tokenHash, "hex");
        if (!timingSafeEqual(sessionHashBuffer, tokenHashBuffer))
            return clearAuth(sessionId);

        // Inactivity check
        if (
            now.getTime() - session.lastVerifiedAt.getTime() >=
            inactivityTimeoutSeconds * 1000
        )
            return clearAuth();
        // Refresh session last verification time
        if (
            now.getTime() - session.lastVerifiedAt.getTime() >=
            activityCheckIntervalSeconds * 1000
        ) {
            session.lastVerifiedAt = now;
            await db
                .update(sessions)
                .set({ lastVerifiedAt: now })
                .where(eq(sessions.id, session.id));
        }

        // Fetch user data
        const userRes = await db
            .select()
            .from(users)
            .where(eq(users.id, session.userId));
        if (userRes.length === 0) return clearAuth(sessionId);
        const user = userRes[0];

        // Create safe objects by excluding sensitive fields
        const { passwordHash, ...safeUser } = user;
        const { tokenHash: _, userId: __, ...safeSession } = session;

        // Attach auth context to event
        event.context.auth = {
            user: safeUser,
            session: safeSession,
        };
    } catch (error) {
        console.error("Auth middleware error:", error);
    }
});
