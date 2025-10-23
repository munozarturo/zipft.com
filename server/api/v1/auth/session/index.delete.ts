import * as y from "yup";

import { and, eq, inArray } from "drizzle-orm";

import { db } from "~~/server/db/client";
import { sessions } from "~~/server/db/schema";

const schema = y.object({
    id: y.array(y.string().required()).ensure().required(),
});

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const { user, session } = event.context.auth;
    if (!user || !session)
        return createError({
            statusCode: 401,
            statusMessage: "Unauthorized",
            message: "No active session found.",
        });

    const { id } = await schema.validate(getQuery(event));

    if (id.includes(session.id))
        setCookie(event, "session", "", {
            maxAge: 0,
            httpOnly: true,
            secure: config.enviornment === "production",
            path: "/",
            sameSite: "lax",
            domain: config.cookies.domain,
        });

    await db
        .delete(sessions)
        .where(and(eq(sessions.userId, user.id), inArray(sessions.id, id)))
        .returning();

    return {};
});
