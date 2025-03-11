import * as argon2 from 'argon2';

import crypto from 'crypto';

import {
	type Communication,
	type CommunicationPurpose,
	type CommunicationType,
	type PasswordReset,
	type Session,
	type User,
	type VerificationChallenge,
	communicationTable,
	passwordResetTable,
	sessionTable,
	userTable,
	verificationChallengeTable
} from './schema';
import { db } from '.';
import { eq, sql } from 'drizzle-orm';

type SuccessResult<T> = {
	error: false;
	message?: string;
	data: T;
};

type ErrorResult = {
	error: true;
	message: string;
	data: null;
};

type DatabaseResult<T> = SuccessResult<T> | ErrorResult;

function sha256Hash(data: any) {
	const sha256 = crypto.createHash('sha256');
	sha256.update(data);
	return sha256.digest('hex');
}

export async function emailInUse(email: string): Promise<DatabaseResult<{ used: boolean }>> {
	const res = await db
		.select({ count: sql<number>`count(*)` })
		.from(userTable)
		.where(eq(userTable.email, email));
	const count = res[0]?.count || 0;

	return { error: false, data: { used: count > 0 } };
}

export async function getUserByEmail(email: string): Promise<DatabaseResult<{ user: User }>> {
	const res = await db.select().from(userTable).where(eq(userTable.email, email));
	if (res.length < 1) return { error: true, data: null, message: 'Invalid email address.' };

	const fetched = res[0];
	return { error: false, data: { user: fetched } };
}

export async function createUser(
	email: string,
	first: string,
	last: string,
	password: string
): Promise<DatabaseResult<{ user: User }>> {
	const passwordHash = await argon2.hash(password);

	const res = await db
		.insert(userTable)
		.values({ email, firstName: first, lastName: last, passwordHash })
		.returning();
	if (res.length < 1) return { error: true, data: null, message: 'Error creating user.' };

	const inserted = res[0];
	return { error: false, data: { user: inserted } };
}

export async function updateUser(user: User): Promise<DatabaseResult<{ user: User }>> {
	const res = await db.update(userTable).set(user).returning();
	if (res.length < 1) return { error: true, data: null, message: 'Error updating user.' };

	const inserted = res[0];
	return { error: false, data: { user: inserted } };
}

export async function createSession(
	token: string,
	userId: number,
	ipAddr?: string,
	userAgent?: string,
	fingerprint?: string
): Promise<DatabaseResult<{ session: Session }>> {
	const tokenHash = sha256Hash(token);

	const res = await db
		.insert(sessionTable)
		.values({ tokenHash, userId, ipAddr, userAgent, fingerprint })
		.returning();
	if (res.length < 1) return { error: true, data: null, message: 'Error creating session.' };

	const inserted = res[0];
	return { error: false, data: { session: inserted } };
}

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };
export async function validateSessionToken(
	token: string
): Promise<DatabaseResult<SessionValidationResult>> {
	const tokenHash = sha256Hash(token);

	const res = await db
		.select({ user: userTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(userTable, eq(sessionTable.userId, userTable.id))
		.where(eq(sessionTable.tokenHash, tokenHash));
	if (res.length < 1) return { error: true, data: null, message: 'Invalid session token' };

	const { user, session } = res[0];
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.tokenHash, tokenHash));
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

	return { error: false, data: { user, session } };
}

export async function invalidateSession(token: string): Promise<DatabaseResult<{}>> {
	const tokenHash = sha256Hash(token);

	await db.delete(sessionTable).where(eq(sessionTable.tokenHash, tokenHash)).returning();
	return { error: false, data: {} };
}

export async function invalidateAllSessions(userId: number): Promise<DatabaseResult<{}>> {
	await db.delete(sessionTable).where(eq(sessionTable.userId, userId)).returning();
	return { error: false, data: {} };
}

export async function createCommunication(
	userId: number,
	type: CommunicationType,
	purpose: CommunicationPurpose
): Promise<DatabaseResult<{ communication: Communication }>> {
	const res = await db.insert(communicationTable).values({ userId, type, purpose }).returning();
	if (res.length < 1) return { error: true, data: null, message: 'Error creating communication' };

	const inserted = res[0];
	return { error: false, data: { communication: inserted } };
}

export async function createVerificationChallenge(
	token: string,
	userId: number
): Promise<DatabaseResult<{ challenge: VerificationChallenge }>> {
	const tokenHash = sha256Hash(token);

	const res = await db.insert(verificationChallengeTable).values({ tokenHash, userId }).returning();
	if (res.length < 1) return { error: true, data: null, message: 'Error creating communication' };

	const inserted = res[0];
	return { error: false, data: { challenge: inserted } };
}

export async function validateVerficiationChallenge(token: string): Promise<DatabaseResult<{}>> {
	const tokenHash = sha256Hash(token);
	const res = await db
		.select()
		.from(verificationChallengeTable)
		.where(eq(verificationChallengeTable.tokenHash, tokenHash));
	if (res.length < 1) return { error: true, data: null, message: 'Invalid verification token .' };

	const challenge = res[0];
	if (challenge.defeated)
		return { error: true, data: null, message: 'Verification token  has already been used.' };
	if (Date.now() >= challenge.expiresAt.getTime())
		return { error: true, data: null, message: 'Verification token expired.' };

	await db
		.update(verificationChallengeTable)
		.set({
			defeated: true,
			defeatedAt: new Date(Date.now())
		})
		.where(eq(verificationChallengeTable.tokenHash, tokenHash));
	await db.update(userTable).set({ verified: true }).where(eq(userTable.id, challenge.userId));
	return { error: false, data: {} };
}

export async function createPasswordReset(
	token: string,
	userId: number
): Promise<DatabaseResult<{ reset: PasswordReset }>> {
	const tokenHash = sha256Hash(token);

	const res = await db.insert(passwordResetTable).values({ tokenHash, userId }).returning();
	if (res.length < 1) return { error: true, data: null, message: 'Error creating password reset.' };

	const inserted = res[0];
	return { error: false, data: { reset: inserted } };
}

export async function resetPassword(token: string, password: string): Promise<DatabaseResult<{}>> {
	const tokenHash = sha256Hash(token);
	const passwordHash = await argon2.hash(password);
	const res = await db
		.select()
		.from(passwordResetTable)
		.where(eq(passwordResetTable.tokenHash, tokenHash));
	if (res.length < 1) return { error: true, data: null, message: 'Invalid reset token.' };

	const passwordReset = res[0];
	if (passwordReset.used) return { error: true, data: null, message: 'Reset token already used.' };
	if (Date.now() >= passwordReset.expiresAt.getTime())
		return { error: true, data: null, message: 'Reset token expired.' };

	await db
		.update(passwordResetTable)
		.set({
			used: true,
			usedAt: new Date(Date.now())
		})
		.where(eq(passwordResetTable.tokenHash, tokenHash));
	await db.update(userTable).set({ passwordHash }).where(eq(userTable.id, passwordReset.userId));
	return { error: false, data: {} };
}
