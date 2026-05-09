export type Vote = {
  userId: string;
  value: 1 | -1;
};

export type VoteInput = {
  userId: string;
  value: 1 | -1 | 0;
};

export function tallyVotes(votes: Vote[]): number {
  return votes.reduce((sum, v) => sum + v.value, 0);
}

export function applyVote(existing: Vote[], vote: VoteInput): Vote[] {
  if (vote.value !== -1 && vote.value !== 0 && vote.value !== 1) {
    throw new Error(`invalid vote value: ${vote.value}`);
  }
  const filtered = existing.filter((v) => v.userId !== vote.userId);
  if (vote.value === 0) return filtered;
  return [...filtered, { userId: vote.userId, value: vote.value }];
}
