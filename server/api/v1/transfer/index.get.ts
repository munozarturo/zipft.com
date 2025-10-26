import * as y from "yup";

import { transferTokenSchema } from "~~/shared/schema/transfer";

const query = y.object({
    token: transferTokenSchema,
});

export default defineEventHandler(async (event) => {
    const {} = await query.validate(await getQuery(event));
});
