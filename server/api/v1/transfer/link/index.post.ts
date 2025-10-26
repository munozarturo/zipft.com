import { linkSchema } from "~~/shared/schema/transfer";
import { objectSchema } from "~~/shared/schema/objects";

const schema = linkSchema.omit(["files"]).shape({
    file: objectSchema,
});

export default defineEventHandler(async (event) => {
    const {} = await schema.validate(await readBody(event));
});
