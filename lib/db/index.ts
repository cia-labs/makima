import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}
// create the connection
export const connection = await mysql.createConnection(
  process.env.DATABASE_URL
);

export const db = drizzle(connection, { schema, mode: "planetscale" });
