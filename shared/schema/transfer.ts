import * as y from "yup";

const transferTokenSchema = y
    .array(y.string().length(1))
    .test("valid-characters", "Token contains invalid characters", (value) => {
        if (!value) return false;
        const joined = value.join("");
        return /^[abcdefghijkmnpqrstuvwxyz23456789]{6}$/.test(joined);
    });

const maxTransferTitleLength = 64;
const transferTitleSchema = y
    .string()
    .max(
        maxTransferTitleLength,
        `Title must be ${maxTransferTitleLength} characters or less`
    )
    .nullable();

const maxTransferMessageLength = 64;
const transferMessageSchema = y
    .string()
    .max(
        maxTransferMessageLength,
        `Message must be ${maxTransferMessageLength} characters or less`
    )
    .nullable();

// Shared field definitions to avoid duplication
const sharedFields = {
    title: transferTitleSchema,
    message: transferMessageSchema,
    isBeacon: y.boolean().default(false),
    downloadLimit: y
        .number()
        .positive("Download limit must be a positive number")
        .integer("Download limit must be a whole number")
        .nullable(),
};

// Form-specific validation schemas
const linkSchema = y.object({
    ...sharedFields,
    files: y
        .array()
        .of(y.mixed())
        .min(1, "Please select at least one file to share via link")
        .required("Files are required for link sharing"),
    anonimize: y.boolean().default(false),
});

const maxTransferRecipients = 5;
const mailSchema = y.object({
    ...sharedFields,
    files: y
        .array()
        .of(y.mixed())
        .min(1, "Please select at least one file to send")
        .required("Files are required"),
    from: y
        .string()
        .email("Please enter a valid sender email address")
        .required("Sender email is required"),
    to: y
        .array()
        .of(y.string().email("Please enter valid email addresses").required())
        .min(1, "Please add at least one recipient")
        .max(
            maxTransferRecipients,
            `You can send to a maximum of ${maxTransferRecipients} recipients`
        )
        .required("At least one recipient is required"),
});

export {
    transferTokenSchema,
    maxTransferTitleLength,
    transferTitleSchema,
    maxTransferMessageLength,
    transferMessageSchema,
    linkSchema,
    maxTransferRecipients,
    mailSchema,
};
