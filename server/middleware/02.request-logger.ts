import { and, count, eq, gt } from "drizzle-orm";

import { db } from "../db/client";
import { requests } from "../db/schema";
import { useEventMetadata } from "../utils/metadata";

const rateLimitPerMinute = 500;
const oneMinuteSeconds = 60 * 1000;

export default defineEventHandler(async (event) => {
    if (!getRequestURL(event).pathname.startsWith("/api/v1/")) return;

    const { session } = event.context.auth;
    const metadata = useEventMetadata(event);

    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - oneMinuteSeconds * 1000);

    try {
        if (metadata.ipAddress) {
            const minuteResult = await db
                .select({ count: count() })
                .from(requests)
                .where(
                    and(
                        gt(requests.madeAt, oneMinuteAgo),
                        eq(requests.ipAddress, metadata.ipAddress)
                    )
                );

            const minuteCount = minuteResult[0]?.count || 0;

            // Check if rate limit is exceeded
            if (minuteCount >= rateLimitPerMinute) {
                throw createError({
                    statusCode: 429,
                    statusMessage: "Too Many Requests",
                    message:
                        "Rate limit exceeded. Please try again in a minute.",
                });
            }

            // Log request
            await db.insert(requests).values({
                sessionId: session?.id,
                madeAt: now,
                path: event.path,
                method: event.method,
                ...metadata,
            });
        }
    } catch (error: any) {
        if (error.statusCode === 429) {
            throw error;
        }
    }
});
