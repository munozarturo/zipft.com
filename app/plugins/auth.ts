import type { Session, User } from "~~/server/db/schema";

type AuthContext =
    | {
          user: Omit<User, "passwordHash">;
          session: Omit<Session, "tokenHash" | "userId">;
      }
    | {
          user: null;
          session: null;
      }
    | { user: undefined; session: undefined };

export default defineNuxtPlugin(async () => {
    const context = useState<AuthContext>("auth:context", () => ({
        user: undefined,
        session: undefined,
    }));

    const user = computed(() => context.value?.user || null);
    const session = computed(() => context.value?.session || null);
    const isAuthenticated = computed(() => !!user.value);

    const fetch = async () => {
        let headers = {};

        if (import.meta.client) {
            const sessionCookie = useCookie("session");
            if (sessionCookie.value) {
                headers = {
                    Cookie: `session=${sessionCookie.value}`,
                };
            }
        } else {
            const event = useRequestEvent();
            if (event?.node?.req?.headers?.cookie) {
                headers = {
                    Cookie: event.node.req.headers.cookie,
                };
            }
        }

        const response = await $fetch("/api/v1/auth", {
            headers,
            credentials: "include",
        });

        context.value = response as AuthContext;
        return response;
    };

    try {
        await fetch();
    } catch (error) {
        console.error(error);
    }

    return {
        provide: {
            auth: {
                session,
                user,
                isAuthenticated,
                fetch,
            },
        },
    };
});
