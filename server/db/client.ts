import "dotenv/config";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw Error("process.env.DATABASE_URL is undefined.");
}

export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);
