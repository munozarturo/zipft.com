import * as y from "yup";

const emailSchema = y.string().email("Invalid email");

const passwordSchema = y
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
        /[@$!%*?&]/,
        "Password must contain at least one of these characters @, $, !, %, *, ?, &."
    );

export { emailSchema, passwordSchema };
