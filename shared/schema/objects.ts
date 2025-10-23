import * as y from "yup";

const objectSchema = y.object({
    name: y.string().required().min(1, "Name cannot be empty"),
    type: y.string().required(),
    md5: y
        .string()
        .required()
        .matches(/^[A-Za-z0-9+/]{22}==$/, "Invalid base64 MD5 hash format"),
    size: y.number().required().min(0, "Size must be non-negative"),
});
export { objectSchema };
