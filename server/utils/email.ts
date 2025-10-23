import mjml2html from "mjml";
import { readFile } from "fs/promises";
import { resolve } from "path";

interface EmailTemplate {
    html: string;
    text: string;
}

function flattenObject(obj: any, prefix = ""): Record<string, string> {
    const flattened: Record<string, string> = {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const newKey = prefix ? `${prefix}.${key}` : key;

            if (
                typeof obj[key] === "object" &&
                obj[key] !== null &&
                !Array.isArray(obj[key])
            ) {
                Object.assign(flattened, flattenObject(obj[key], newKey));
            } else {
                flattened[newKey] = String(obj[key]);
            }
        }
    }

    return flattened;
}

async function compileMjmlTemplate(
    templateName: string,
    variables: Record<string, any>
): Promise<EmailTemplate> {
    const templatePath = resolve(
        process.cwd(),
        `app/assets/email/templates/${templateName}.mjml`
    );
    let mjmlContent = await readFile(templatePath, "utf-8");

    // Flatten nested object properties
    const flattenedVariables = flattenObject(variables);

    // Replace template variables
    for (const [key, value] of Object.entries(flattenedVariables)) {
        mjmlContent = mjmlContent.replace(
            new RegExp(`\\$\\{${key}\\}`, "g"),
            value
        );
    }

    // Compile MJML to HTML
    const { html } = mjml2html(mjmlContent);

    // Generate better text version by extracting content from MJML
    const textContent = mjmlContent
        .replace(/<mj-text[^>]*>(.*?)<\/mj-text>/gs, "$1\n\n")
        .replace(
            /<mj-button[^>]*href="([^"]*)"[^>]*>(.*?)<\/mj-button>/gs,
            "$2: $1\n\n"
        )
        .replace(/<[^>]*>/g, "") // Remove remaining tags
        .replace(/\s+/g, " ") // Normalize whitespace
        .replace(/\n\s+/g, "\n") // Clean up line breaks
        .trim();

    return { html, text: textContent };
}

export async function compileVerifyEmailTemplate(props: {
    user: { name: string | null };
    verificationUrl: string;
    communication: { id: string };
}): Promise<EmailTemplate> {
    props.user.name = props.user.name || "there";

    return compileMjmlTemplate("verify-email", {
        verificationUrl: props.verificationUrl,
        user: props.user,
        communication: props.communication,
    });
}

export async function compilePasswordResetTemplate(props: {
    user: { name: string | null };
    passwordResetUrl: string;
    communication: { id: string };
}): Promise<EmailTemplate> {
    props.user.name = props.user.name || "there";

    return compileMjmlTemplate("password-reset", {
        passwordResetUrl: props.passwordResetUrl,
        user: props.user,
        communication: props.communication,
    });
}

export async function compileAccountDeletionRequestTemplate(props: {
    user: { name: string | null };
    deletionUrl: string;
    communication: { id: string };
}): Promise<EmailTemplate> {
    props.user.name = props.user.name || "there";

    return compileMjmlTemplate("account-deletion-request", {
        deletionUrl: props.deletionUrl,
        user: props.user,
        communication: props.communication,
    });
}

export async function compileAccountDeletionConfirmationTemplate(props: {
    user: { name: string | null };
    communication: { id: string };
}): Promise<EmailTemplate> {
    props.user.name = props.user.name || "there";

    return compileMjmlTemplate("account-deletion-confirmation", {
        user: props.user,
        communication: props.communication,
    });
}

export async function compileAccountTransferRequestTemplate(props: {
    user: { name: string | null };
    oldEmail: string;
    transferUrl: string;
    communication: { id: string };
}): Promise<EmailTemplate> {
    props.user.name = props.user.name || "there";

    return compileMjmlTemplate("account-transfer-request", {
        oldEmail: props.oldEmail,
        transferUrl: props.transferUrl,
        user: props.user,
        communication: props.communication,
    });
}

export async function compileAccountTransferSuccessTemplate(props: {
    user: { name: string | null };
    oldEmail: string;
    newEmail: string;
    communication: { id: string };
}): Promise<EmailTemplate> {
    props.user.name = props.user.name || "there";

    return compileMjmlTemplate("account-transfer-success", {
        oldEmail: props.oldEmail,
        newEmail: props.newEmail,
        user: props.user,
        communication: props.communication,
    });
}

export async function compileAccountTransferFailureTemplate(props: {
    oldEmail: string;
    communication: { id: string };
}): Promise<EmailTemplate> {
    return compileMjmlTemplate("account-transfer-failiure", {
        oldEmail: props.oldEmail,
        communication: props.communication,
    });
}
