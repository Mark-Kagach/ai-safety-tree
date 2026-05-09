export type FlatNode = {
  id: string;
  parentId: string | null;
  title: string;
};

export type TreeNode = FlatNode & { children: TreeNode[] };

export function buildTree(nodes: FlatNode[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  for (const n of nodes) {
    if (byId.has(n.id)) {
      throw new Error(`duplicate id: ${n.id}`);
    }
    byId.set(n.id, { ...n, children: [] });
  }

  const roots: TreeNode[] = [];
  for (const n of nodes) {
    const node = byId.get(n.id)!;
    if (n.parentId === null) {
      roots.push(node);
      continue;
    }
    const parent = byId.get(n.parentId);
    if (!parent) {
      throw new Error(`missing parent: ${n.parentId} (referenced by ${n.id})`);
    }
    parent.children.push(node);
  }

  const reachable = new Set<string>();
  const stack: TreeNode[] = [...roots];
  while (stack.length > 0) {
    const node = stack.pop()!;
    if (reachable.has(node.id)) continue;
    reachable.add(node.id);
    stack.push(...node.children);
  }
  if (reachable.size < nodes.length) {
    throw new Error("cycle detected: not all nodes reachable from a root");
  }

  return roots;
}
