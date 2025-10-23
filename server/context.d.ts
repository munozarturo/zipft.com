import { Session, User } from "~~/server/db/schema";

declare module "h3" {
    interface H3EventContext {
        auth:
            | {
                  user: Omit<User, "passwordHash">;
                  session: Omit<Session, "tokenHash" | "userId">;
              }
            | {
                  user: null;
                  session: null;
              };
    }
}

export {};
