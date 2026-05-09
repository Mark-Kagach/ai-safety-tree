export type CollapsibleTreeNode = {
  id: string;
  children: CollapsibleTreeNode[];
} & Record<string, unknown>;

export function pruneCollapsed<T extends CollapsibleTreeNode>(
  tree: T[],
  collapsedIds: Set<string>,
): T[] {
  return tree.map((n) => ({
    ...n,
    children: collapsedIds.has(n.id)
      ? []
      : pruneCollapsed(n.children as T[], collapsedIds),
  })) as T[];
}
