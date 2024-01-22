import { sql } from "drizzle-orm";
import {
  mysqlTable,
  bigint,
  varchar,
  timestamp,
  json,
  text,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

// messages table
export const messages = mysqlTable("messages", {
  id: varchar("id", {
    length: 15, // change this when using custom user ids
  }).primaryKey(),
  content: text("content"),
  role: mysqlEnum("role", [
    "system",
    "user",
    "assistant",
    "tool",
    "function",
  ]).notNull(),
  tool_calls: json("tool_calls"),
  userId: varchar("user_id", {
    length: 15,
  }).notNull(),
  name: varchar("name", {
    length: 15,
  }).notNull(),
  created_at: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// auth related tables
export const user = mysqlTable("auth_user", {
  id: varchar("id", {
    length: 15, // change this when using custom user ids
  }).primaryKey(),
  // other user attributes
  username: varchar("username", {
    length: 255,
  }).notNull(),
  name: varchar("name", {
    length: 255,
  }),
  discord_username: varchar("discord_username", {
    length: 255,
  }),
  email: varchar("email", {
    length: 255,
  }),
  points: bigint("points", {
    mode: "number",
  }).default(0),
  role: varchar("role", {
    length: 255,
  }).default("npc"),
});

export const key = mysqlTable("user_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  }).notNull(),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
});

export const session = mysqlTable("user_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  }).notNull(),
  interface: mysqlEnum("interface", ["discord", "web"]).notNull(),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
});
