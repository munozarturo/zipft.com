import * as argon2 from "argon2";
import * as y from "yup";

import { sessions, users } from "~~/server/db/schema";

import { db } from "~~/server/db/client";
import { emailSchema } from "~~/shared/schema/auth";
import { eq } from "drizzle-orm";
import { generateToken } from "~~/server/utils/crypto";

const schema = y.object({
    email: emailSchema.required("Required"),
    password: y.string().required("Required"), // don't use passwordSchema
});

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    const { email, password } = await schema.validate(await readBody(event));
    const sessionId = generateToken(32);
    const { token, tokenHash } = generateTokenHashPair(32);

    // fetch user
    const userRes = await db.select().from(users).where(eq(users.email, email));
    if (userRes.length <= 0)
        return createError({
            statusCode: 401,
            statusMessage: "Invalid credentials",
            message: "Invalid email or password.",
        });
    const user = userRes[0];

    // check password
    const passwordValid = await argon2.verify(user.passwordHash, password);
    if (!passwordValid)
        return createError({
            statusCode: 401,
            statusMessage: "Invalid credentials",
            message: "Invalid email or password.",
        });

    // check verified
    if (!user.verified)
        return createError({
            statusCode: 403,
            statusMessage: "Account not verified",
            message: "Please verify your account before signing in.",
        });

    // create session
    const sessionRes = await db
        .insert(sessions)
        .values({
            id: sessionId,
            userId: user.id,
            tokenHash,
        })
        .returning({ id: sessions.id });
    const session = sessionRes[0];

    // set session cookie
    const sessionToken = `${session.id}.${token}`;
    setCookie(event, "session", sessionToken, {
        maxAge: 86400,
        httpOnly: true,
        secure: config.enviornment === "production",
        path: "/",
        sameSite: "lax",
        domain: config.cookies.domain,
    });

    return {};
});
