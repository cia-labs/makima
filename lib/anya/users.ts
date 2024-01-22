import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema";
import { auth } from "./auth";

type UserAttributes = {
  username: string;
  email: string;
  name: string;
  discord_username: string;
  role: string;
};

export function registerUser(
  username: string,
  password: string,
  attributes?: Omit<UserAttributes, "role" | "discord_username" | "name"> & {
    role?: string;
    discord_username?: string;
    name?: string;
  },
) {
  return auth.createUser({
    attributes: {
      username,
      name: username,
      ...attributes,
    },
    key: {
      providerUserId: username,
      providerId: "anya",
      password,
    },
  });
}

export function updateUser(
  username: string,
  attributes: Partial<UserAttributes>,
) {
  return db.update(user).set(attributes).where(eq(user.username, username));
}

export function deleteUser(username: string) {
  return db.delete(user).where(eq(user.username, username));
}

export function setPoints(username: string, points: number) {
  return db.update(user).set({ points }).where(eq(user.username, username));
}
export async function addPointsByDiscordUsername(
  discord_username: string,
  points: number,
) {
  const res = await db
    .select({
      points: user.points,
    })
    .from(user)
    .where(eq(user.discord_username, discord_username));
  if (res) {
    const oldPoints = res[0].points ?? 0;
    return await db
      .update(user)
      .set({ points: oldPoints + points })
      .where(eq(user.discord_username, discord_username));
  }
}
export function getUser(username: string) {
  return db.select().from(user).where(eq(user.username, username));
}
export function getUserByDiscordUsername(discord_username: string) {
  return db
    .select()
    .from(user)
    .where(eq(user.discord_username, discord_username));
}

export function setRole(username: string, role: string) {
  return db.update(user).set({ role }).where(eq(user.username, username));
}

export function listUsers() {
  return db.select().from(user);
}
