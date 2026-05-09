import { prisma } from "./prisma";
import { buildTree, type FlatNode, type TreeNode } from "@/domain/tree";
import { tallyVotes } from "@/domain/votes";
import type { TreeViewNode } from "@/components/TreeView";
import type { SidePanelNode, SidePanelOutput } from "@/components/SidePanel";

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

export async function getTreeForView(): Promise<TreeViewNode[]> {
  const nodes = await prisma.node.findMany({
    include: { votes: true },
    orderBy: { createdAt: "asc" },
  });

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
): Promise<SidePanelNode | null> {
  const node = await prisma.node.findUnique({
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

  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    body: node.body,
    outputs: parseOutputs(node.outputs),
    authorUsername: node.author.username,
    parentId: node.parentId,
    score,
    alignmentKarma: node.alignmentKarma,
    userVote,
    comments: node.comments.map((c) => ({
      id: c.id,
      body: c.body,
      authorUsername: c.author.username,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}

export async function listAllNodesForParentPicker() {
  const nodes = await prisma.node.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "asc" },
  });
  return nodes;
}
