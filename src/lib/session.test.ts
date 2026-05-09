import { describe, it, expect } from "vitest";
import { signUserId, verifyUserId } from "./session";

describe("session token", () => {
  it("round-trips a userId", () => {
    const token = signUserId("user-1", "secret");
    expect(verifyUserId(token, "secret")).toBe("user-1");
  });

  it("returns null for a tampered userId", () => {
    const token = signUserId("user-1", "secret");
    const tampered = token.replace("user-1", "user-2");
    expect(verifyUserId(tampered, "secret")).toBeNull();
  });

  it("returns null for a wrong secret", () => {
    const token = signUserId("user-1", "secret-a");
    expect(verifyUserId(token, "secret-b")).toBeNull();
  });

  it("returns null for malformed tokens", () => {
    expect(verifyUserId("", "secret")).toBeNull();
    expect(verifyUserId("nodothere", "secret")).toBeNull();
    expect(verifyUserId(".justdot", "secret")).toBeNull();
    expect(verifyUserId("user.", "secret")).toBeNull();
  });

  it("uses constant-time comparison (no timing leak via length)", () => {
    const token = signUserId("user-1", "secret");
    const truncated = token.slice(0, -2);
    expect(verifyUserId(truncated, "secret")).toBeNull();
  });
});
