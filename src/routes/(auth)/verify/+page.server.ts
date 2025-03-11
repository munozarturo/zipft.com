import { db } from '$lib/server/db/index.js';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const token = event.url.searchParams.get('token');
	event.url.searchParams.delete('token');
	const secret = event.url.searchParams.get('secret');
	event.url.searchParams.delete('secret');

	if (!token || !secret) {
		return {
			status: 'info',
			title: 'Verify your identity',
			message: 'A verification link was sent to your email. Open it to verify your identity.'
		};
	}

	try {
		const [challenge] = await db
			.select()
			.from(verificationChallenges)
			.where(eq(verificationChallenges.token, token))
			.execute();

		if (!challenge) {
			return {
				status: 'error',
				title: 'Verification error',
				message: 'Verification link not found. Please request a new one.'
			};
		}

		const [user] = await db.select().from(users).where(eq(users.id, challenge.userId)).execute();
		if (user.verified) {
			return {
				status: 'info',
				title: 'Verification successful',
				message: 'Your account is already verified. You can proceed to sign in.'
			};
		}

		if (challenge.defeated) {
			return {
				status: 'error',
				title: 'Verification error',
				message: 'This verification link has already been used.'
			};
		}

		const currentTime = new Date(Date.now());
		if (currentTime < challenge.createdAt || currentTime > challenge.expiresAt) {
			return {
				status: 'error',
				title: 'Verification error',
				message: 'Verification link has expired. Please request a new one.'
			};
		}

		const correctSecret = await argon2.verify(challenge.secretHash, secret);
		if (!correctSecret) {
			return {
				status: 'error',
				title: 'Verification error',
				message: 'Invalid verification link. Please request a new link.'
			};
		}

		await db.transaction(async (tx) => {
			await tx
				.update(verificationChallenges)
				.set({ defeated: true, defeatedAt: currentTime })
				.where(eq(verificationChallenges.token, token))
				.execute();

			await tx
				.update(users)
				.set({ verified: true })
				.where(eq(users.id, challenge.userId))
				.execute();
		});

		const sessionToken = csprng(256, 32);

		await db.insert(sessions).values({
			token: sessionToken,
			userId: user.id,
			ipAddr: event.getClientAddress(),
			userAgent: event.request.headers.get('user-agent')
		});

		event.cookies.set('token', sessionToken, {
			path: '/',
			secure: true,
			sameSite: 'lax',
			httpOnly: false
		});

		throw redirect(303, '/dashboard');
	} catch (error) {
		console.error('Verification error:', error);
		return {
			status: 'error',
			title: 'Verification error',
			message: 'An error occurred during verification. Please try again.'
		};
	}
};
