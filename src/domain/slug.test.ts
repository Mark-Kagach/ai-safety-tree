import { describe, it, expect } from "vitest";
import { slugify, ensureUniqueSlug } from "./slug";

describe("slugify", () => {
  it("lowercases and hyphenates a simple title", () => {
    expect(slugify("Technical AI Safety")).toBe("technical-ai-safety");
  });

  it("collapses multiple spaces", () => {
    expect(slugify("AI   Safety   Meta")).toBe("ai-safety-meta");
  });

  it("strips punctuation", () => {
    expect(slugify("AI's Safety, & Governance!")).toBe("ais-safety-governance");
  });

  it("trims leading/trailing whitespace and hyphens", () => {
    expect(slugify("  Hello World  ")).toBe("hello-world");
    expect(slugify("---test---")).toBe("test");
  });

  it("handles non-ASCII characters by stripping them", () => {
    expect(slugify("Café résumé")).toBe("caf-rsum");
  });

  it("returns empty string for input with no slug-able characters", () => {
    expect(slugify("!!!")).toBe("");
  });
});

describe("ensureUniqueSlug", () => {
  it("returns the slug as-is if not taken", () => {
    expect(ensureUniqueSlug("foo", new Set())).toBe("foo");
  });

  it("appends -2 if the slug is taken once", () => {
    expect(ensureUniqueSlug("foo", new Set(["foo"]))).toBe("foo-2");
  });

  it("appends -3 if -2 is also taken", () => {
    expect(ensureUniqueSlug("foo", new Set(["foo", "foo-2"]))).toBe("foo-3");
  });

  it("does not collide with similar but unrelated slugs", () => {
    expect(ensureUniqueSlug("foo", new Set(["foobar"]))).toBe("foo");
  });
});
