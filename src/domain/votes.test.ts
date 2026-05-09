import { describe, it, expect } from "vitest";
import { tallyVotes, applyVote, type Vote } from "./votes";

describe("tallyVotes", () => {
  it("returns 0 for an empty list", () => {
    expect(tallyVotes([])).toBe(0);
  });

  it("sums +1 votes", () => {
    const votes: Vote[] = [
      { userId: "a", value: 1 },
      { userId: "b", value: 1 },
      { userId: "c", value: 1 },
    ];
    expect(tallyVotes(votes)).toBe(3);
  });

  it("sums mixed votes", () => {
    const votes: Vote[] = [
      { userId: "a", value: 1 },
      { userId: "b", value: -1 },
      { userId: "c", value: 1 },
    ];
    expect(tallyVotes(votes)).toBe(1);
  });

  it("can return negative scores", () => {
    const votes: Vote[] = [
      { userId: "a", value: -1 },
      { userId: "b", value: -1 },
    ];
    expect(tallyVotes(votes)).toBe(-2);
  });
});

describe("applyVote", () => {
  it("adds a new vote when the user has not voted", () => {
    const existing: Vote[] = [];
    const result = applyVote(existing, { userId: "a", value: 1 });
    expect(result).toEqual([{ userId: "a", value: 1 }]);
  });

  it("replaces an existing vote when the user votes again differently", () => {
    const existing: Vote[] = [{ userId: "a", value: 1 }];
    const result = applyVote(existing, { userId: "a", value: -1 });
    expect(result).toEqual([{ userId: "a", value: -1 }]);
  });

  it("removes the vote when value is 0 (toggle off)", () => {
    const existing: Vote[] = [{ userId: "a", value: 1 }];
    const result = applyVote(existing, { userId: "a", value: 0 });
    expect(result).toEqual([]);
  });

  it("removing a non-existent vote is a no-op", () => {
    const existing: Vote[] = [{ userId: "b", value: 1 }];
    const result = applyVote(existing, { userId: "a", value: 0 });
    expect(result).toEqual([{ userId: "b", value: 1 }]);
  });

  it("rejects values other than -1, 0, +1", () => {
    expect(() =>
      applyVote([], { userId: "a", value: 2 as 1 | -1 | 0 }),
    ).toThrow(/invalid vote value/i);
  });

  it("does not mutate the input array", () => {
    const existing: Vote[] = [{ userId: "a", value: 1 }];
    applyVote(existing, { userId: "a", value: -1 });
    expect(existing).toEqual([{ userId: "a", value: 1 }]);
  });
});
