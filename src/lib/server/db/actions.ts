import * as argon2 from 'argon2';
import crypto from 'crypto';

import {
	type AccountTransfer,
	type Communication,
	type CommunicationPurpose,
	type CommunicationType,
	type PasswordReset,
	type Session,
	type User,
	type VerificationChallenge,
	accountTransferTable,
	communicationTable,
	passwordResetTable,
	sessionTable,
	userTable,
	verificationChallengeTable
} from '$lib/server/db/schema';
import { db } from '.';
import { eq, sql, desc, and } from 'drizzle-orm';

function sha256Hash(data: any) {
	const sha256 = crypto.createHash('sha256');
	sha256.update(data);
	return sha256.digest('hex');
}

export async function emailInUse(email: string): Promise<{ used: boolean }> {
	const res = await db
		.select({ count: sql<number>`count(*)` })
		.from(userTable)
		.where(eq(userTable.email, email));
	const count = res[0]?.count || 0;

	return { used: count > 0 };
}

export async function getUserByEmail(email: string): Promise<User | null> {
	const res = await db.select().from(userTable).where(eq(userTable.email, email));
	if (res.length < 1) return null;

	return res[0];
}

export async function createUser(
	email: string,
	first: string,
	last: string,
	password: string
): Promise<User> {
	const passwordHash = await argon2.hash(password);

	const res = await db
		.insert(userTable)
		.values({ email, firstName: first, lastName: last, passwordHash })
		.returning();
	if (res.length < 1) throw new Error('Error creating user.');

	return res[0];
}

export async function updateUser(user: User): Promise<User> {
	const res = await db.update(userTable).set(user).returning();
	if (res.length < 1) throw new Error('Error updating user.');

	return res[0];
}

export async function createSession(
	token: string,
	userId: number,
	ipAddr?: string | null,
	userAgent?: string | null,
	fingerprint?: string | null
): Promise<Session> {
	const tokenHash = sha256Hash(token);

	const res = await db
		.insert(sessionTable)
		.values({ tokenHash, userId, ipAddr, userAgent, fingerprint })
		.returning();
	if (res.length < 1) throw new Error('Error creating session.');

	return res[0];
}

export type SessionValidationResult =
	| {
			session: Session;
			user: User;
	  }
	| {
			session: null;
			user: null;
	  };

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const tokenHash = sha256Hash(token);

	const res = await db
		.select({ user: userTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.tokenHash, tokenHash));
	if (res.length < 1) throw new Error('Invalid session token');

	const { user, session } = res[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.tokenHash, tokenHash));
		throw new Error('Session expired');
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(sessionTable)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(sessionTable.tokenHash, session.tokenHash));
	}

	return { user, session };
}

export async function invalidateSession(tokenHash: string): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.tokenHash, tokenHash)).returning();
}

export async function invalidateAllSessions(userId: number): Promise<void> {
	await db.delete(sessionTable).where(eq(sessionTable.userId, userId)).returning();
}

export async function createCommunication(
	userId: number,
	type: CommunicationType,
	purpose: CommunicationPurpose
): Promise<Communication> {
	const res = await db.insert(communicationTable).values({ userId, type, purpose }).returning();
	if (res.length < 1) throw new Error('Error creating communication');

	return res[0];
}

export async function getLastCommunication(
	userId: number,
	type: CommunicationType,
	purpose: CommunicationPurpose
): Promise<Communication | null> {
	const res = await db
		.select()
		.from(communicationTable)
		.where(
			and(
				eq(communicationTable.type, type),
				and(eq(communicationTable.purpose, purpose), eq(communicationTable.userId, userId))
			)
		)
		.orderBy(desc(communicationTable.createdAt))
		.limit(1);

	if (res.length < 1) return null;

	return res[0];
}

export async function createVerificationChallenge(
	token: string,
	userId: number
): Promise<VerificationChallenge> {
	const tokenHash = sha256Hash(token);

	const res = await db.insert(verificationChallengeTable).values({ tokenHash, userId }).returning();
	if (res.length < 1) throw new Error('Error creating verification token');

	return res[0];
}

export async function validateVerficiationChallenge(token: string): Promise<void> {
	const tokenHash = sha256Hash(token);
	const res = await db
		.select()
		.from(verificationChallengeTable)
		.where(eq(verificationChallengeTable.tokenHash, tokenHash));
	if (res.length < 1) throw new Error('Invalid verification token.');

	const challenge = res[0];
	if (challenge.defeated) throw new Error('Verification token has already been used.');
	if (Date.now() >= challenge.expiresAt.getTime()) throw new Error('Verification token expired.');

	await db.transaction(async (tx) => {
		await tx
			.update(verificationChallengeTable)
			.set({
				defeated: true,
				defeatedAt: new Date(Date.now())
			})
			.where(eq(verificationChallengeTable.tokenHash, tokenHash));
		await tx.update(userTable).set({ verified: true }).where(eq(userTable.id, challenge.userId));
	});
}

export async function createPasswordReset(token: string, userId: number): Promise<PasswordReset> {
	const tokenHash = sha256Hash(token);

	const res = await db.insert(passwordResetTable).values({ tokenHash, userId }).returning();
	if (res.length < 1) throw new Error('Error creating password reset.');

	return res[0];
}

export async function resetPassword(token: string, password: string): Promise<void> {
	const tokenHash = sha256Hash(token);
	const passwordHash = await argon2.hash(password);

	const res = await db
		.select()
		.from(passwordResetTable)
		.where(eq(passwordResetTable.tokenHash, tokenHash));
	if (res.length < 1) throw new Error('Invalid password reset link.');
	const passwordReset = res[0];

	if (passwordReset.used) throw new Error('Password has already been reset.');
	if (Date.now() >= passwordReset.expiresAt.getTime())
		throw new Error('Password reset request expired.');

	await db.transaction(async (tx) => {
		await tx
			.update(passwordResetTable)
			.set({
				used: true,
				usedAt: new Date(Date.now())
			})
			.where(eq(passwordResetTable.tokenHash, tokenHash));
		await tx
			.update(userTable)
			.set({ passwordHash, verified: true })
			.where(eq(userTable.id, passwordReset.userId));
	});
}

export async function createAccountTransferRequest(
	token: string,
	userId: number,
	transferTo: string
): Promise<AccountTransfer | null> {
	const tokenHash = sha256Hash(token);

	// get user
	const userFetchRes = await db.select().from(userTable).where(eq(userTable.id, userId));
	if (userFetchRes.length < 1) throw Error('Invalid user account.');
	const user = userFetchRes[0];

	/*
	make sure no user exists with the transfer email
	- return null so server can handle appropriately
	- doesn't throw an error to avoid the requesting user to know whether or not
	  the transferTo address is a registered user.
	*/
	if (getUserByEmail(transferTo) !== null) return null;

	// create request
	const createRes = await db
		.insert(accountTransferTable)
		.values({ tokenHash, userId: user.id, transferTo })
		.returning();
	if (createRes.length < 1) throw Error('Error creating account transfer request.');
	const accountTransfer = createRes[0];

	return accountTransfer;
}

export async function transferAccount(token: string): Promise<void> {
	const tokenHash = sha256Hash(token);

	const accountTransferRes = await db
		.select()
		.from(accountTransferTable)
		.where(eq(accountTransferTable.tokenHash, tokenHash));
	if (accountTransferRes.length < 1) throw Error('Invalid account transfer token.');
	const accountTransfer = accountTransferRes[0];

	await db.transaction(async (tx) => {
		await tx
			.update(accountTransferTable)
			.set({ used: true, usedAt: new Date(Date.now()) })
			.where(eq(accountTransferTable.tokenHash, accountTransfer.tokenHash));

		await tx
			.update(userTable)
			.set({ email: accountTransfer.transferTo })
			.where(eq(userTable.id, accountTransfer.userId));
	});
}
