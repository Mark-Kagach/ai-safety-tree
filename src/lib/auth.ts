import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { signUserId, verifyUserId } from "./session";

const COOKIE_NAME = "aist_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function getSecret(): string {
  return process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me";
}

export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const userId = verifyUserId(token, getSecret());
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

const USERNAME_RE = /^[a-z0-9_-]{3,32}$/;

export async function signUp(rawUsername: string, password: string) {
  const username = rawUsername.trim().toLowerCase();
  if (!USERNAME_RE.test(username)) {
    throw new Error(
      "Username must be 3-32 lowercase letters, numbers, hyphen, or underscore",
    );
  }
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) throw new Error("Username already taken");

  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      username,
      passwordHash,
      displayName: rawUsername.trim(),
    },
  });
}

export async function signIn(rawUsername: string, password: string) {
  const username = rawUsername.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export async function setSessionCookie(userId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, signUserId(userId, getSecret()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
