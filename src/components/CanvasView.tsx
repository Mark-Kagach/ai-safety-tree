"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { TreeViewNode } from "./TreeView";
import { pruneCollapsed } from "@/domain/collapse";
import { useTheme } from "@/lib/useTheme";

export type Orientation = "TB" | "LR";

export type CanvasViewProps = {
  tree: TreeViewNode[];
  /** Slug of the currently-displayed slider node (for highlighting). */
  selectedSlug: string | null;
  /** Called when a canvas node is clicked — replaces any open slider. */
  onNodeSelect: (slug: string) => void;
};

type FlowData = {
  title: string;
  score: number;
  slug: string;
  nodeId: string;
  isSelected: boolean;
  hasChildren: boolean;
  isCollapsed: boolean;
  onToggle: (id: string) => void;
};

const NODE_W = 220;
const NODE_H = 78;
const H_GAP = 36;
const V_GAP = 110;
const H_GAP_LR = 140;
const V_GAP_LR = 30;

function findNodesWithChildren(tree: TreeViewNode[]): Set<string> {
  const out = new Set<string>();
  function walk(n: TreeViewNode) {
    if (n.children.length > 0) {
      out.add(n.id);
      n.children.forEach(walk);
    }
  }
  tree.forEach(walk);
  return out;
}

function computeInitialCollapsed(tree: TreeViewNode[]): Set<string> {
  const out = new Set<string>();
  function walk(n: TreeViewNode, depth: number) {
    if (depth >= 1 && n.children.length > 0) out.add(n.id);
    n.children.forEach((c) => walk(c, depth + 1));
  }
  tree.forEach((root) => walk(root, 0));
  return out;
}

function cardData(
  n: TreeViewNode,
  selectedSlug: string | null,
  hasChildren: Set<string>,
  collapsedIds: Set<string>,
  onToggle: (id: string) => void,
): FlowData {
  return {
    title: n.title,
    score: n.score,
    slug: n.slug,
    nodeId: n.id,
    isSelected: n.slug === selectedSlug,
    hasChildren: hasChildren.has(n.id),
    isCollapsed: collapsedIds.has(n.id),
    onToggle,
  };
}

function layoutTree(
  tree: TreeViewNode[],
  collapsedIds: Set<string>,
  hasChildrenOriginal: Set<string>,
  selectedSlug: string | null,
  onToggle: (id: string) => void,
  orientation: Orientation,
): { nodes: Node<FlowData>[]; edges: Edge[] } {
  const pruned = pruneCollapsed(tree, collapsedIds);
  const nodes: Node<FlowData>[] = [];
  const edges: Edge[] = [];

  function widthOfTB(n: TreeViewNode): number {
    if (n.children.length === 0) return NODE_W;
    const childrenW =
      n.children.reduce((s, c) => s + widthOfTB(c), 0) +
      H_GAP * (n.children.length - 1);
    return Math.max(NODE_W, childrenW);
  }

  function placeTB(n: TreeViewNode, x: number, y: number) {
    nodes.push({
      id: n.id,
      type: "treeCard",
      position: { x, y },
      data: cardData(
        n,
        selectedSlug,
        hasChildrenOriginal,
        collapsedIds,
        onToggle,
      ),
    });
    if (n.children.length > 0) {
      const totalW =
        n.children.reduce((s, c) => s + widthOfTB(c), 0) +
        H_GAP * (n.children.length - 1);
      let cursor = x + NODE_W / 2 - totalW / 2;
      for (const c of n.children) {
        const cw = widthOfTB(c);
        const cx = cursor + cw / 2 - NODE_W / 2;
        placeTB(c, cx, y + NODE_H + V_GAP);
        edges.push({
          id: `${n.id}-${c.id}`,
          source: n.id,
          target: c.id,
          sourceHandle: "b",
          targetHandle: "t",
          type: "smoothstep",
        });
        cursor += cw + H_GAP;
      }
    }
  }

  function heightOfLR(n: TreeViewNode): number {
    if (n.children.length === 0) return NODE_H;
    const childrenH =
      n.children.reduce((s, c) => s + heightOfLR(c), 0) +
      V_GAP_LR * (n.children.length - 1);
    return Math.max(NODE_H, childrenH);
  }

  function placeLR(n: TreeViewNode, x: number, y: number) {
    nodes.push({
      id: n.id,
      type: "treeCard",
      position: { x, y },
      data: cardData(
        n,
        selectedSlug,
        hasChildrenOriginal,
        collapsedIds,
        onToggle,
      ),
    });
    if (n.children.length > 0) {
      const totalH =
        n.children.reduce((s, c) => s + heightOfLR(c), 0) +
        V_GAP_LR * (n.children.length - 1);
      let cursor = y + NODE_H / 2 - totalH / 2;
      for (const c of n.children) {
        const ch = heightOfLR(c);
        const cy = cursor + ch / 2 - NODE_H / 2;
        placeLR(c, x + NODE_W + H_GAP_LR, cy);
        edges.push({
          id: `${n.id}-${c.id}`,
          source: n.id,
          target: c.id,
          sourceHandle: "r",
          targetHandle: "l",
          type: "smoothstep",
        });
        cursor += ch + V_GAP_LR;
      }
    }
  }

  if (orientation === "LR") {
    let rootCursorY = 0;
    for (const root of pruned) {
      const h = heightOfLR(root);
      placeLR(root, 0, rootCursorY + h / 2 - NODE_H / 2);
      rootCursorY += h + V_GAP_LR * 2;
    }
  } else {
    let rootCursorX = 0;
    for (const root of pruned) {
      const w = widthOfTB(root);
      placeTB(root, rootCursorX + w / 2 - NODE_W / 2, 0);
      rootCursorX += w + H_GAP * 2;
    }
  }

  return { nodes, edges };
}

function TreeCard({ data }: NodeProps) {
  const d = data as FlowData;
  return (
    <div
      className={`relative px-4 py-3 transition-colors cursor-pointer shadow-[var(--shadow-sm)] bg-canvas-elev border-2 ${
        d.isSelected
          ? "border-selected"
          : "border-border hover:bg-canvas-elev-hover"
      }`}
      style={{ width: NODE_W, height: NODE_H, borderRadius: 4 }}
    >
      <Handle id="t" type="target" position={Position.Top} />
      <Handle id="b" type="source" position={Position.Bottom} />
      <Handle id="l" type="target" position={Position.Left} />
      <Handle id="r" type="source" position={Position.Right} />

      <div className="font-serif font-medium text-[15px] leading-snug line-clamp-2 pr-7 text-fg">
        {d.title}
      </div>
      <div className="text-[11px] text-fg-subtle mt-1.5 font-sans tabular-nums">
        {d.score === 0
          ? "0 points"
          : d.score === 1
            ? "1 point"
            : `${d.score} points`}
      </div>

      {d.hasChildren && (
        <button
          type="button"
          aria-label={d.isCollapsed ? "Expand children" : "Collapse children"}
          aria-expanded={!d.isCollapsed}
          onClick={(e) => {
            e.stopPropagation();
            d.onToggle(d.nodeId);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full text-fg-muted hover:text-fg text-[16px] leading-none flex items-center justify-center font-sans transition-colors"
          title={d.isCollapsed ? "Expand" : "Collapse"}
        >
          {d.isCollapsed ? "+" : "−"}
        </button>
      )}
    </div>
  );
}

const nodeTypes = { treeCard: TreeCard };

function FlipIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className="inline-block align-text-bottom mr-1"
    >
      <path
        d="M2 4 H10 M10 4 L7 1.5 M10 4 L7 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10 H4 M4 10 L7 7.5 M4 10 L7 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CanvasView({
  tree,
  selectedSlug,
  onNodeSelect,
}: CanvasViewProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() =>
    computeInitialCollapsed(tree),
  );
  const [orientation, setOrientation] = useState<Orientation>("TB");
  const { resolved: resolvedTheme } = useTheme();

  const hasChildrenOriginal = useMemo(
    () => findNodesWithChildren(tree),
    [tree],
  );

  const toggleCollapse = useCallback((id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const { nodes, edges } = useMemo(
    () =>
      layoutTree(
        tree,
        collapsedIds,
        hasChildrenOriginal,
        selectedSlug,
        toggleCollapse,
        orientation,
      ),
    [
      tree,
      collapsedIds,
      hasChildrenOriginal,
      selectedSlug,
      toggleCollapse,
      orientation,
    ],
  );

  const canvasColors = useMemo(
    () =>
      resolvedTheme === "dark"
        ? {
            backgroundDots: "#525252",
            minimapBg: "#1e1e1e",
            minimapMask: "rgba(38, 38, 38, 0.72)",
            minimapNode: "#3a3a3a",
            minimapNodeStroke: "#777777",
          }
        : {
            backgroundDots: "#d8d3c7",
            minimapBg: "#ffffff",
            minimapMask: "rgba(248, 244, 238, 0.72)",
            minimapNode: "#f0ece5",
            minimapNodeStroke: "#a8a39a",
          },
    [resolvedTheme],
  );

  const collapseAll = () => setCollapsedIds(new Set(hasChildrenOriginal));
  const expandAll = () => setCollapsedIds(new Set());
  const resetView = () => setCollapsedIds(computeInitialCollapsed(tree));
  const flipOrientation = () =>
    setOrientation((o) => (o === "TB" ? "LR" : "TB"));

  return (
    <div className="absolute inset-0 bg-canvas">
      <div
        className="absolute top-20 left-3 z-10 flex gap-1"
        style={{ fontFamily: "var(--font-sans)", fontSize: "14px" }}
      >
        <button
          type="button"
          onClick={resetView}
          className="px-3 py-1.5 border border-border bg-canvas-elev text-fg-muted hover:text-fg hover:bg-canvas-elev-hover rounded-sm transition-colors uppercase tracking-wide"
          title="Show only the first level"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={collapseAll}
          className="px-3 py-1.5 border border-border bg-canvas-elev text-fg-muted hover:text-fg hover:bg-canvas-elev-hover rounded-sm transition-colors uppercase tracking-wide"
        >
          Collapse all
        </button>
        <button
          type="button"
          onClick={expandAll}
          className="px-3 py-1.5 border border-border bg-canvas-elev text-fg-muted hover:text-fg hover:bg-canvas-elev-hover rounded-sm transition-colors uppercase tracking-wide"
        >
          Expand all
        </button>
        <button
          type="button"
          onClick={flipOrientation}
          className="px-3 py-1.5 border border-border bg-canvas-elev text-fg-muted hover:text-fg hover:bg-canvas-elev-hover rounded-sm transition-colors uppercase tracking-wide flex items-center"
          title={
            orientation === "TB"
              ? "Switch to horizontal layout"
              : "Switch to vertical layout"
          }
        >
          <FlipIcon />
          {orientation === "TB" ? "Horizontal" : "Vertical"}
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.4, maxZoom: 1, duration: 0 }}
        colorMode={resolvedTheme}
        onNodeClick={(_e, node) => {
          const slug = (node.data as FlowData).slug;
          onNodeSelect(slug);
        }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={28} size={1.4} color={canvasColors.backgroundDots} />
        <Controls showInteractive={false} />
        <MiniMap
          pannable
          zoomable
          bgColor={canvasColors.minimapBg}
          maskColor={canvasColors.minimapMask}
          nodeColor={canvasColors.minimapNode}
          nodeStrokeColor={canvasColors.minimapNodeStroke}
          nodeStrokeWidth={1}
        />
      </ReactFlow>
    </div>
  );
}
