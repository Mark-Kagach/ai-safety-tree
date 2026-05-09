import { prisma } from "./prisma";
import type { Prisma } from "@prisma/client";
import { buildTree, type FlatNode, type TreeNode } from "@/domain/tree";
import { tallyVotes } from "@/domain/votes";
import type { TreeViewNode } from "@/components/TreeView";
import type { SidePanelNode, SidePanelOutput } from "@/components/SidePanel";
import { SEED_AUTHOR, SEED_TREE } from "../../prisma/seed";
import {
  SEED_TREE_COMMUNITY,
  COMMUNITY_PROPOSALS,
  COMMUNITY_AUTHOR,
  COMMUNITY_PROPOSERS,
  flattenProposals,
} from "../../prisma/seed-community";

// Two parallel seed trees ship with the build — clients pick which one to
// render via the `?variant=` query string on `/api/tree` and
// `/api/nodes/:slug`. The "community" tree is read-only seed data; the
// "shallow" tree may be backed by Postgres in production.
export type TreeVariant = "shallow" | "community";

const VARIANTS: TreeVariant[] = ["shallow", "community"];

export function parseTreeVariant(v: string | null | undefined): TreeVariant {
  return v === "community" ? "community" : "shallow";
}

export function isTreeVariant(v: unknown): v is TreeVariant {
  return typeof v === "string" && (VARIANTS as string[]).includes(v);
}

type TreeDbNode = Prisma.NodeGetPayload<{ include: { votes: true } }>;
type PanelDbNode = Prisma.NodeGetPayload<{
  include: {
    author: true;
    votes: true;
    comments: { include: { author: true } };
  };
}>;
type ProposalDbNode = Prisma.NodeGetPayload<{
  include: {
    author: true;
    votes: true;
    _count: { select: { comments: true } };
  };
}>;

function parseOutputs(raw: string | null): SidePanelOutput[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (o): o is SidePanelOutput => o && typeof o.title === "string",
    );
  } catch {
    return [];
  }
}

function fallbackTreeForView(variant: TreeVariant): TreeViewNode[] {
  const source = variant === "community" ? SEED_TREE_COMMUNITY : SEED_TREE;
  const flat: FlatNode[] = source.map((n) => ({
    id: n.slug,
    parentId: n.parentSlug,
    title: n.title,
  }));
  const tree = buildTree(flat);

  function decorate(t: TreeNode): TreeViewNode {
    return {
      id: t.id,
      slug: t.id,
      title: t.title,
      score: 0,
      children: t.children.map(decorate),
    };
  }

  return tree.map(decorate);
}

function fallbackNodeBySlug(
  slug: string,
  variant: TreeVariant,
): SidePanelNode | null {
  if (variant === "community") return communityNodeBySlug(slug);

  const seedNode = SEED_TREE.find((n) => n.slug === slug);
  if (!seedNode) return null;

  return {
    id: seedNode.slug,
    slug: seedNode.slug,
    title: seedNode.title,
    body: seedNode.body,
    outputs: seedNode.outputs ?? [],
    authorUsername: SEED_AUTHOR.username,
    parentId: seedNode.parentSlug,
    status: "active",
    score: 0,
    alignmentKarma: 0,
    userVote: 0,
    comments: [],
    relatedProposals: [],
  };
}

function communityNodeBySlug(slug: string): SidePanelNode | null {
  // Active node lookup
  const active = SEED_TREE_COMMUNITY.find((n) => n.slug === slug);
  if (active) {
    const proposals = COMMUNITY_PROPOSALS[active.slug] ?? [];
    return {
      id: active.slug,
      slug: active.slug,
      title: active.title,
      body: active.body,
      outputs: active.outputs ?? [],
      authorUsername: COMMUNITY_AUTHOR.username,
      parentId: active.parentSlug,
      status: "active",
      score: 0,
      alignmentKarma: 0,
      userVote: 0,
      comments: [],
      relatedProposals: proposals.map((p) => ({
        slug: p.slug,
        title: p.title,
        authorUsername: pickProposer(p.slug).username,
        score: p.score,
        commentCount: p.commentCount,
        kind: p.kind,
      })),
    };
  }

  // Proposal-node lookup (when a user clicks into a proposal row)
  const proposalEntry = flattenProposals().find((p) => p.slug === slug);
  if (proposalEntry) {
    const parent = SEED_TREE_COMMUNITY.find(
      (n) => n.slug === proposalEntry.parentSlug,
    );
    return {
      id: proposalEntry.slug,
      slug: proposalEntry.slug,
      title: proposalEntry.title,
      body: proposalEntry.body,
      outputs: [],
      authorUsername: proposalEntry.authorUsername,
      parentId: parent?.slug ?? null,
      status: "proposed",
      score: proposalEntry.score,
      alignmentKarma: 0,
      userVote: 0,
      comments: [],
      relatedProposals: [],
    };
  }

  return null;
}

// Stable proposer assignment based on the proposal's slug — keeps the same
// "author" attached across reloads without a database.
function pickProposer(slug: string): { username: string; displayName: string } {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) | 0;
  const idx = Math.abs(h) % COMMUNITY_PROPOSERS.length;
  return COMMUNITY_PROPOSERS[idx];
}

function logDbFallback(context: string, error: unknown) {
  console.warn(
    `Database unavailable while loading ${context}; using read-only seed data fallback.`,
    error,
  );
}

export async function getTreeForView(
  variant: TreeVariant = "shallow",
): Promise<TreeViewNode[]> {
  // The community tree ships as static seed data; never hit the DB.
  if (variant === "community") return fallbackTreeForView("community");

  let nodes: TreeDbNode[];
  try {
    nodes = await prisma.node.findMany({
      // Only "active" nodes appear on the canvas; "proposed" nodes are
      // surfaced exclusively under their target's "Other Proposals" panel.
      where: { status: "active" },
      include: { votes: true },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    logDbFallback("tree", error);
    return fallbackTreeForView(variant);
  }

  const flat: FlatNode[] = nodes.map((n) => ({
    id: n.id,
    parentId: n.parentId,
    title: n.title,
  }));
  const tree = buildTree(flat);

  const slugById = new Map(nodes.map((n) => [n.id, n.slug]));
  const scoreById = new Map(
    nodes.map((n) => [
      n.id,
      tallyVotes(
        n.votes.map((v) => ({
          userId: v.userId,
          value: v.value as 1 | -1,
        })),
      ),
    ]),
  );

  function decorate(t: TreeNode): TreeViewNode {
    return {
      id: t.id,
      slug: slugById.get(t.id) ?? "",
      title: t.title,
      score: scoreById.get(t.id) ?? 0,
      children: t.children.map(decorate),
    };
  }

  return tree.map(decorate);
}

export async function getNodeBySlug(
  slug: string,
  currentUserId: string | null,
  variant: TreeVariant = "shallow",
): Promise<SidePanelNode | null> {
  if (variant === "community") return communityNodeBySlug(slug);

  let node: PanelDbNode | null;
  try {
    node = await prisma.node.findUnique({
      where: { slug },
      include: {
        author: true,
        votes: true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  } catch (error) {
    logDbFallback(`node ${slug}`, error);
    return fallbackNodeBySlug(slug, variant);
  }
  if (!node) return null;

  const score = tallyVotes(
    node.votes.map((v) => ({
      userId: v.userId,
      value: v.value as 1 | -1,
    })),
  );

  let userVote: -1 | 0 | 1 = 0;
  if (currentUserId) {
    const v = node.votes.find((vv) => vv.userId === currentUserId);
    if (v) userVote = v.value === 1 ? 1 : v.value === -1 ? -1 : 0;
  }

  // Pull all "proposed" nodes that target this one. Two kinds:
  //   • Siblings → parentId === node.parentId (alternative versions / edits)
  //   • Children → parentId === node.id (proposed new sub-topics)
  // We fetch both, sort by computed score desc, and include comment counts.
  const proposalWhere: {
    status: "proposed";
    OR: Array<{ parentId: string | null }>;
  } = {
    status: "proposed",
    OR: [{ parentId: node.id }],
  };
  if (node.parentId) proposalWhere.OR.push({ parentId: node.parentId });

  let proposed: ProposalDbNode[];
  try {
    proposed = await prisma.node.findMany({
      where: proposalWhere,
      include: {
        author: true,
        votes: true,
        _count: { select: { comments: true } },
      },
    });
  } catch (error) {
    logDbFallback(`related proposals for ${slug}`, error);
    return fallbackNodeBySlug(slug, variant);
  }

  const relatedProposals = proposed
    // Don't list the node itself in its own proposals.
    .filter((p) => p.id !== node.id)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      authorUsername: p.author.username,
      score: tallyVotes(
        p.votes.map((v) => ({
          userId: v.userId,
          value: v.value as 1 | -1,
        })),
      ),
      commentCount: p._count.comments,
      kind: (p.parentId === node.id ? "child" : "edit") as "child" | "edit",
    }))
    .sort((a, b) => b.score - a.score);

  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    body: node.body,
    outputs: parseOutputs(node.outputs),
    authorUsername: node.author.username,
    parentId: node.parentId,
    status: node.status as "active" | "proposed",
    score,
    alignmentKarma: node.alignmentKarma,
    userVote,
    comments: node.comments.map((c) => ({
      id: c.id,
      body: c.body,
      authorUsername: c.author.username,
      createdAt: c.createdAt.toISOString(),
    })),
    relatedProposals,
  };
}

export async function listAllNodesForParentPicker() {
  try {
    const nodes = await prisma.node.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: "asc" },
    });
    return nodes;
  } catch (error) {
    logDbFallback("parent picker", error);
    return SEED_TREE.map((n) => ({ id: n.slug, title: n.title }));
  }
}
