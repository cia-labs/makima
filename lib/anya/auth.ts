// lucia.ts
import { lucia } from "lucia";
import { mysql2 } from "@lucia-auth/adapter-mysql";
import { connection } from "../db";

export const auth = lucia({
  adapter: mysql2(connection, {
    key: "user_key",
    session: "user_session",
    user: "auth_user",
  }),
  env: "DEV",
  getUserAttributes: (data) => {
    return {
      username: data.username,
      email: data.email,
      discord_username: data.discord_username,
      role: data.role,
    };
  },
});

export type Auth = typeof auth;
