import * as t from "drizzle-orm/pg-core";
import { sql, type InferSelectModel } from "drizzle-orm";

export const zipft = t.pgSchema("zipft");

/* Auth */
export const userRoles = zipft.enum("user_roles", ["user", "admin"]);
export const users = zipft.table("users", {
    id: t.uuid().primaryKey().defaultRandom(),
    email: t.text().notNull().unique(),
    passwordHash: t.text("password_hash").notNull(),

    name: t.text(),

    avatar: t.text().references(() => objects.id),
    avatarUrl: t.text("avatar_url"),

    role: userRoles().notNull().default("user"),

    verified: t.boolean().notNull().default(false),
    deleted: t.boolean().notNull().default(false),
    onboarded: t.boolean().notNull().default(false),
});
export type User = InferSelectModel<typeof users>;

export const sessions = zipft.table("sessions", {
    id: t.text().primaryKey(),

    userId: t
        .uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    tokenHash: t.text("token_hash").notNull(),

    createdAt: t.timestamp("created_at").notNull().defaultNow(),
    lastVerifiedAt: t.timestamp("last_verified_at").notNull().defaultNow(),
});
export type Session = InferSelectModel<typeof sessions>;
export interface SessionWithToken extends Session {
    token: string;
}

export const requests = zipft.table("requests", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),

    sessionId: t
        .text("session_id")
        .references(() => sessions.id, { onDelete: "cascade" }),

    path: t.text().notNull(),
    method: t.text().notNull(),

    ipAddress: t.text("ip_address"),
    userAgent: t.text("user_agent"),

    isMobile: t.boolean("is_mobile"),
    browser: t.text(),
    platform: t.text(),

    madeAt: t.timestamp("made_at").notNull().defaultNow(),
});
export type Request = InferSelectModel<typeof requests>;

export const objectBuckets = zipft.enum("object_buckets", [
    "zipft-cdn",
    "zipft-cdn-public",
]);
export const objects = zipft.table("objects", {
    id: t.text().primaryKey(),

    fileName: t.text("file_name").notNull(),
    contentType: t.text("content_type").notNull(),

    size: t.integer().notNull(),
    md5: t.text().notNull(),

    s3Bucket: objectBuckets("s3_bucket").notNull(),
    s3Key: t.text("s3_key").notNull(),

    verified: t.boolean().notNull().default(false),

    createdAt: t.timestamp("created_at").notNull().defaultNow(),
    verifiedAt: t.timestamp("verified_at"),
    expiresAt: t
        .timestamp("expires_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP + INTERVAL '1 hour'`),
});

export const communicationType = zipft.enum("communication_type", ["email"]);
export const communicationPurpose = zipft.enum("communication_purpose", [
    "verification",
    "recovery",
    "transfer/verification",
    "transfer/recipient",
    "deletion",
]);
export const communications = zipft.table("communications", {
    id: t.uuid().primaryKey().defaultRandom(),

    userId: t
        .uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    type: communicationType().notNull(),
    purpose: communicationPurpose().notNull(),

    createdAt: t
        .timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
export type Communication = InferSelectModel<typeof communications>;

export const incognitoCommunications = zipft.table("communications", {
    id: t.uuid().primaryKey().defaultRandom(),

    identifier: t.text(),

    type: communicationType().notNull(),
    purpose: communicationPurpose().notNull(),

    createdAt: t
        .timestamp("created_at", { withTimezone: true })
        .notNull()
        .defaultNow(),
});
export type IncognitoCommunication = InferSelectModel<
    typeof incognitoCommunications
>;
export type CommunicationType = typeof communications.$inferSelect.type;
export type CommunicationPurpose = typeof communications.$inferSelect.purpose;

export const verificationChallenges = zipft.table("verification_challenges", {
    tokenHash: t.text("token_hash").primaryKey(),
    userId: t
        .uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    createdAt: t.timestamp("created_at").notNull().defaultNow(),
    expiresAt: t
        .timestamp("expires_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP + INTERVAL '30 minutes'`),

    used: t.boolean().notNull().default(false), // enforce: used is false
    usedAt: t.timestamp("used_at"), // enforce: createdAt <= usedAt <= expiresAt
});
export type VerificationChallenge = InferSelectModel<
    typeof verificationChallenges
>;

export const recoveryChallenges = zipft.table("recovery_challenges", {
    tokenHash: t.text("token_hash").primaryKey(),
    userId: t
        .uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    createdAt: t.timestamp("created_at").notNull().defaultNow(),
    expiresAt: t
        .timestamp("expires_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP + INTERVAL '10 minutes'`),

    used: t.boolean().notNull().default(false), // enforce: used is false
    usedAt: t.timestamp("used_at"), // enforce: createdAt <= usedAt <= expiresAt
});
export type RecoveryChallenge = InferSelectModel<typeof recoveryChallenges>;

export const transferChallenges = zipft.table("transfer_challenges", {
    tokenHash: t.text("token_hash").primaryKey().notNull(),

    email: t.text().notNull(),

    userId: t
        .uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),

    createdAt: t.timestamp("created_at").notNull().defaultNow(),
    expiresAt: t
        .timestamp("expires_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP + INTERVAL '10 minutes'`),

    used: t.boolean().notNull().default(false),
    usedAt: t.timestamp("used_at"),
});
export type TransferChallenge = InferSelectModel<typeof transferChallenges>;

export const deletionChallenges = zipft.table("deletion_challenges", {
    tokenHash: t.text("token_hash").primaryKey().notNull(),

    userId: t
        .uuid("user_id")
        .references(() => users.id, { onDelete: "set null" }),

    createdAt: t.timestamp("created_at").notNull().defaultNow(),
    expiresAt: t
        .timestamp("expires_at")
        .notNull()
        .default(sql`CURRENT_TIMESTAMP + INTERVAL '30 minutes'`),

    used: t.boolean().notNull().default(false),
    usedAt: t.timestamp("used_at"),
});
export type DeletionChallenge = InferSelectModel<typeof deletionChallenges>;

export const transferType = zipft.enum("transfer_type", ["mail", "link"]);
export const transfers = zipft.table("transfers", {
    token: t.text("token").primaryKey().notNull(),

    transferType: transferType("transfer_type").notNull(),

    userId: t
        .uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" }),
    anonymous: t.boolean().default(false),

    from: t.text(),
    fromVerified: t.boolean().default(false),
    to: t.text().array(),

    objectId: t
        .text()
        .notNull()
        .references(() => objects.id),

    createdAt: t.timestamp("created_at").notNull().defaultNow(),

    beacon: t.boolean().default(false),
    downloadLimit: t.integer("download_limit"),
    durationStart: t.timestamp("duration_start"),
    durationEnd: t.timestamp("duration_end"),

    title: t.text(),
    message: t.text(),
});
export type Transfer = InferSelectModel<typeof transfers>;

export const transferVerificationChallenges = zipft.table(
    "transfer_verification_challenges",
    {
        tokenHash: t.text("token_hash").primaryKey(),
        transferToken: t
            .text()
            .notNull()
            .references(() => transfers.token, { onDelete: "cascade" }),

        createdAt: t.timestamp("created_at").notNull().defaultNow(),
        expiresAt: t
            .timestamp("expires_at")
            .notNull()
            .default(sql`CURRENT_TIMESTAMP + INTERVAL '30 minutes'`),

        used: t.boolean().notNull().default(false), // enforce: used is false
        usedAt: t.timestamp("used_at"), // enforce: createdAt <= usedAt <= expiresAt
    }
);
export type TransferVerificationChallenge = InferSelectModel<
    typeof transferVerificationChallenges
>;
