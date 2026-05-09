"use client";

import { useCallback, useEffect, useState } from "react";
import { SidePanel, type SidePanelNode } from "./SidePanel";

export type TreeViewNode = {
  id: string;
  slug: string;
  title: string;
  score: number;
  children: TreeViewNode[];
};

export type TreeViewProps = {
  tree: TreeViewNode[];
  fetchNode: (slug: string) => Promise<SidePanelNode>;
  onVote?: (slug: string, value: 1 | -1) => Promise<void>;
  onComment?: (slug: string, body: string) => Promise<void>;
};

function NodeButton({
  node,
  onSelect,
  depth,
}: {
  node: TreeViewNode;
  onSelect: (slug: string) => void;
  depth: number;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(node.slug)}
        className="flex items-center gap-3 w-full text-left rounded px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        style={{ paddingLeft: 12 + depth * 16 }}
      >
        <span className="font-medium">{node.title}</span>
        <span className="ml-auto font-mono text-sm text-neutral-500">
          {node.score}
        </span>
      </button>
      {node.children.length > 0 && (
        <ul className="ml-2 border-l border-neutral-200 dark:border-neutral-800">
          {node.children.map((c) => (
            <NodeButton
              key={c.id}
              node={c}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeView({
  tree,
  fetchNode,
  onVote,
  onComment,
}: TreeViewProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [panelNode, setPanelNode] = useState<SidePanelNode | null>(null);

  const refetch = useCallback(async () => {
    if (!selectedSlug) return;
    const fresh = await fetchNode(selectedSlug);
    setPanelNode(fresh);
  }, [selectedSlug, fetchNode]);

  useEffect(() => {
    if (!selectedSlug) {
      return;
    }
    let cancelled = false;
    fetchNode(selectedSlug).then((n) => {
      if (!cancelled) setPanelNode(n);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedSlug, fetchNode]);

  const handleVote = onVote
    ? async (value: 1 | -1) => {
        if (!selectedSlug) return;
        await onVote(selectedSlug, value);
        await refetch();
      }
    : undefined;

  const handleComment = onComment
    ? async (body: string) => {
        if (!selectedSlug) return;
        await onComment(selectedSlug, body);
        await refetch();
      }
    : undefined;

  return (
    <>
      <ul className="max-w-2xl mx-auto p-4">
        {tree.map((n) => (
          <NodeButton key={n.id} node={n} onSelect={setSelectedSlug} depth={0} />
        ))}
      </ul>
      <SidePanel
        node={panelNode}
        onClose={() => {
          setSelectedSlug(null);
          setPanelNode(null);
        }}
        onVote={handleVote}
        onComment={handleComment}
      />
    </>
  );
}
