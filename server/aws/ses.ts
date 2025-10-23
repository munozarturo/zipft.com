import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

type Attachment = {
    filename: string;
    content: Buffer;
    contentType: string;
};

type InlineImage = {
    filename: string;
    content: Buffer;
    contentType: string;
    contentId: string;
};

type EmailBody =
    | { html: string }
    | { text: string }
    | { html: string; text: string };

type Email = {
    source: string;
    replyTo?: string | string[];
    destination: {
        to: string | string[];
        cc?: string | string[];
        bcc?: string | string[];
    };
    subject: string;
    body: EmailBody;
    attachments?: Attachment[];
    inlineImages?: InlineImage[];
    sesOptions?: Record<string, any>;
};

const AWS_REGION = process.env.AWS_REGION;
if (!AWS_REGION) throw new Error("AWS_REGION is not set");

const AWS_KEY = process.env.AWS_KEY;
if (!AWS_KEY) throw new Error("AWS_KEY is not set");

const AWS_SECRET = process.env.AWS_SECRET;
if (!AWS_SECRET) throw new Error("AWS_SECRET is not set");

const sesClient = new SESv2Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_KEY,
        secretAccessKey: AWS_SECRET,
    },
});

async function sendEmail(email: Email): Promise<nodemailer.SentMessageInfo> {
    const transporter = nodemailer.createTransport({
        SES: {
            sesClient,
            SendEmailCommand,
        },
    });

    const mailOptions: Mail.Options = {
        from: email.source,
        to: Array.isArray(email.destination.to)
            ? email.destination.to.join(",")
            : email.destination.to,
        subject: email.subject,
        replyTo: email.replyTo
            ? Array.isArray(email.replyTo)
                ? email.replyTo.join(",")
                : email.replyTo
            : email.source,
    };

    if (email.destination.cc) {
        mailOptions.cc = Array.isArray(email.destination.cc)
            ? email.destination.cc.join(",")
            : email.destination.cc;
    }

    if (email.destination.bcc) {
        mailOptions.bcc = Array.isArray(email.destination.bcc)
            ? email.destination.bcc.join(",")
            : email.destination.bcc;
    }

    if ("text" in email.body) {
        mailOptions.text = email.body.text;
    }

    if ("html" in email.body) {
        mailOptions.html = email.body.html;
    }

    const attachments: Mail.Attachment[] = [];

    if (email.attachments?.length) {
        email.attachments.forEach((attachment) => {
            attachments.push({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType,
            });
        });
    }

    if (email.inlineImages?.length) {
        email.inlineImages.forEach((image) => {
            attachments.push({
                filename: image.filename,
                content: image.content,
                contentType: image.contentType,
                cid: image.contentId,
                contentDisposition: "inline",
            });
        });
    }

    if (attachments.length > 0) {
        mailOptions.attachments = attachments;
    }

    if (email.sesOptions) {
        (mailOptions as any).ses = email.sesOptions;
    }

    return transporter.sendMail(mailOptions);
}

export { sesClient, sendEmail, type Email, type Attachment, type InlineImage };
