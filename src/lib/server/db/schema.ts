import { PgSchema, boolean, integer, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { sql, type InferSelectModel } from 'drizzle-orm';

export const schema = new PgSchema('zipft');

export const userTable = schema.table('user', {
	id: serial('id').primaryKey(),

	email: text().unique().notNull(),
	// argon2 hash
	passwordHash: text('password_hash').notNull(),

	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),

	verified: boolean().notNull().default(false)
});
export type User = InferSelectModel<typeof userTable>;

export const sessionTable = schema.table('session', {
	tokenHash: text('token_hash').notNull().primaryKey(),

	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),

	ipAddr: text('ip_addr'),
	userAgent: text('user_agent'),
	fingerprint: text('fingerprint'),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	expiresAt: timestamp('expires_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP + INTERVAL '1 month'`)
});
export type Session = InferSelectModel<typeof sessionTable>;

export const communicationType = schema.enum('communication_type', ['email']);
export const communicationPurpose = schema.enum('communication_purpose', [
	'verification',
	'password_reset'
]);

export const communicationTable = schema.table('communication', {
	id: uuid('id').defaultRandom().primaryKey(),

	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),

	type: communicationType().notNull(),
	purpose: communicationPurpose().notNull(),

	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});
export type Communication = InferSelectModel<typeof communicationTable>;
export type CommunicationType = typeof communicationTable.$inferSelect.type;
export type CommunicationPurpose = typeof communicationTable.$inferSelect.purpose;

export const verificationChallengeTable = schema.table('verification_challenges', {
	// token generated using CSPRNG
	// SHA256 hash
	tokenHash: text('token_hash').notNull().primaryKey(),

	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	expiresAt: timestamp('expires_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP + INTERVAL '30 minutes'`),

	defeatedAt: timestamp('used_at'), // enforce: createdAt <= defeatedAt <= expiresAt
	defeated: boolean().notNull().default(false)
});
export type VerificationChallenge = InferSelectModel<typeof verificationChallengeTable>;

export const passwordResetTable = schema.table('password_resets', {
	// token generated using CSPRNG
	// SHA256 hash
	tokenHash: text('token_hash').notNull().primaryKey(),

	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	expiresAt: timestamp('expires_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP + INTERVAL '30 minutes'`),

	usedAt: timestamp('used_at'), // enforce: createdAt <= usedAt <= expiresAt
	used: boolean().notNull().default(false)
});
export type PasswordReset = InferSelectModel<typeof passwordResetTable>;

export const accountTransferTable = schema.table('account_transfers', {
	tokenHash: text('token_hash').notNull().primaryKey(),

	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id, { onDelete: 'cascade' }),

	transferTo: text('transfer_to').notNull(),

	createdAt: timestamp('created_at').notNull().defaultNow(),
	expiresAt: timestamp('expires_at')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP + INTERVAL '30 minutes'`),

	usedAt: timestamp('used_at'), // enforce: createdAt <= usedAt <= expiresAt
	used: boolean().notNull().default(false)
});
export type AccountTransfer = InferSelectModel<typeof accountTransferTable>;
