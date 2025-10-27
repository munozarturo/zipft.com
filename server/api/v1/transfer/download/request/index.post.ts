import * as y from "yup";

import { db } from "~~/server/db/client";
import { eq } from "drizzle-orm";
import { transferTokenSchema } from "~~/shared/schema/transfer";
import { transfers } from "~~/server/db/schema";

const query = y.object({
    token: transferTokenSchema.required(),
});

export default defineEventHandler(async (event) => {
    const { token } = await query.validate(await getQuery(event));

    const transferRes = await db
        .select()
        .from(transfers)
        .where(eq(transfers.token, token));
    if (transferRes.length <= 0) return createError({}); // TODO: make this error better
    const transfer = transferRes[0];
});
