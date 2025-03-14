// See https://svelte.dev/docs/kit/types#app.d.ts

import type { User, Session } from '$lib/server/db/schema';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: { user: User; session: Session } | { user: null; session: null };
			ipAddr: string | null;
			userAgent: string | null;
			redirect: string | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
