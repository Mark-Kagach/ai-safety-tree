import crypto from "node:crypto";

export function signUserId(userId: string, secret: string): string {
  const hmac = crypto.createHmac("sha256", secret).update(userId).digest("hex");
  return `${userId}.${hmac}`;
}

export function verifyUserId(token: string, secret: string): string | null {
  if (!token || typeof token !== "string") return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;

  const userId = token.slice(0, dot);
  const hmac = token.slice(dot + 1);
  if (!userId || !hmac) return null;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(userId)
    .digest("hex");
  if (hmac.length !== expected.length) return null;
  if (
    !crypto.timingSafeEqual(
      Buffer.from(hmac, "hex"),
      Buffer.from(expected, "hex"),
    )
  ) {
    return null;
  }
  return userId;
}
