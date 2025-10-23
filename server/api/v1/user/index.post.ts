import * as argon2 from "argon2";
import * as y from "yup";

import { emailSchema, passwordSchema } from "~~/shared/schema/auth";
import { eq, sql } from "drizzle-orm";

import { db } from "~~/server/db/client";
import { users } from "~~/server/db/schema";

const schema = y.object({
    email: emailSchema.required("Required"),
    password: passwordSchema.required("Required"),
});

export default defineEventHandler(async (event) => {
    const { email, password } = await schema.validate(await readBody(event));
    const passwordHash = await argon2.hash(password);

    // count the number of users that exist with this email
    const res = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(eq(users.email, email));
    const count = res[0]?.count || 0;
    if (count > 0)
        return createError({
            statusCode: 400,
            statusMessage: "Email already in use",
            message: "Email already in use.",
            data: { field: "email" },
        });

    // create user
    await db.insert(users).values({ email, passwordHash }).execute();

    return {};
});
