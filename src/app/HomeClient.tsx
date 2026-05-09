"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CanvasView } from "@/components/CanvasView";
import type { TreeViewNode } from "@/components/TreeView";
import {
  ProposeForm,
  type ProposeFormParent,
  type ProposeFormPayload,
} from "@/components/ProposeForm";
import type { SidePanelNode } from "@/components/SidePanel";
import { ThemeToggle } from "@/components/ThemeToggle";

type CurrentUser = { id: string; username: string };

type HomeClientProps = {
  initialTree: TreeViewNode[];
  currentUser: CurrentUser | null;
};

type ProposeContext = {
  mode: "new" | "edit" | "add-child";
  parentId?: string;
  title?: string;
  body?: string;
};

function flattenForPicker(nodes: TreeViewNode[]): ProposeFormParent[] {
  const result: ProposeFormParent[] = [];
  function walk(n: TreeViewNode) {
    result.push({ id: n.id, title: n.title });
    n.children.forEach(walk);
  }
  nodes.forEach(walk);
  return result;
}

const SMALL_TEXT: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
};

export function HomeClient({ initialTree, currentUser }: HomeClientProps) {
  const router = useRouter();
  const [tree, setTree] = useState(initialTree);
  const [proposeCtx, setProposeCtx] = useState<ProposeContext | null>(null);
  // Cache the most recently fetched node so the slider's edit/add-child
  // buttons can pre-fill the propose modal without an extra round-trip.
  const [lastNode, setLastNode] = useState<SidePanelNode | null>(null);

  // Stable identity — without useCallback, every HomeClient render produces
  // a new function, which retriggers CanvasView's useEffect, which cancels
  // the in-flight fetch via its cleanup. The slider then never opens because
  // setPanelNode(n) is gated on `!cancelled`.
  const fetchNode = useCallback(
    async (slug: string): Promise<SidePanelNode> => {
      const res = await fetch(`/api/nodes/${slug}`);
      if (!res.ok) throw new Error(`Failed to load node ${slug}`);
      const json = (await res.json()) as SidePanelNode;
      setLastNode(json);
      return json;
    },
    [],
  );

  const refreshTree = async () => {
    const res = await fetch("/api/tree");
    if (res.ok) setTree(await res.json());
  };

  const requireLogin = (action: string) => {
    const ok = window.confirm(`Log in to ${action}?`);
    if (ok) router.push("/login");
  };

  const handleVote = async (slug: string, value: 1 | -1) => {
    if (!currentUser) {
      requireLogin("vote");
      return;
    }
    const res = await fetch(`/api/nodes/${slug}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (res.ok) await refreshTree();
  };

  const handleComment = async (slug: string, body: string) => {
    if (!currentUser) {
      requireLogin("comment");
      return;
    }
    await fetch(`/api/nodes/${slug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
  };

  const openProposeNew = () => {
    if (!currentUser) {
      requireLogin("propose a new node");
      return;
    }
    setProposeCtx({ mode: "new" });
  };

  const openProposeEdit = () => {
    if (!currentUser) {
      requireLogin("propose an edit");
      return;
    }
    if (!lastNode) return;
    setProposeCtx({
      mode: "edit",
      // An "edit" creates a sibling of the current node so it can be voted on
      // alongside the original; full edit-as-first-class is Phase 3.
      parentId: lastNode.parentId ?? undefined,
      title: lastNode.title,
      body: lastNode.body,
    });
  };

  const openAddChild = () => {
    if (!currentUser) {
      requireLogin("add a child node");
      return;
    }
    if (!lastNode) return;
    setProposeCtx({ mode: "add-child", parentId: lastNode.id });
  };

  const handlePropose = async (payload: ProposeFormPayload) => {
    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setProposeCtx(null);
      await refreshTree();
    } else {
      const text = await res.text();
      window.alert(`Failed: ${text}`);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  const proposeTitle =
    proposeCtx?.mode === "edit"
      ? "Suggest edit"
      : proposeCtx?.mode === "add-child"
        ? "Add child node"
        : "Propose new node";

  return (
    <div className="h-full relative bg-canvas">
      <header className="dirty-mirror absolute top-0 left-0 right-0 z-20 h-16 flex items-center px-5 sm:px-7 gap-3">
        <a
          href="/"
          aria-label="AI Safety Tree home"
          className="shrink-0 inline-flex"
        >
          {/* Black tree inside a white circle. Parallel trunks at the bottom
              diverge outward and upward, each ending in a Y of small
              branches. Hardcoded black/white so the mark reads in both
              light and dark themes. */}
          <svg width="32" height="32" viewBox="0 0 100 100" aria-hidden className="block">
            <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#000000" strokeWidth="2" />
            <g stroke="#000000" strokeLinecap="square" strokeLinejoin="miter" fill="none">
              <path d="M46 88 L46 70" strokeWidth="6" />
              <path d="M54 88 L54 70" strokeWidth="6" />
              <path d="M46 70 L28 38" strokeWidth="6" />
              <path d="M54 70 L72 38" strokeWidth="6" />
              <path d="M28 38 L20 22" strokeWidth="5" />
              <path d="M28 38 L36 22" strokeWidth="5" />
              <path d="M72 38 L64 22" strokeWidth="5" />
              <path d="M72 38 L80 22" strokeWidth="5" />
            </g>
          </svg>
        </a>

        <h1
          className="font-serif font-normal text-fg uppercase tracking-wide leading-none whitespace-nowrap"
          style={{ fontSize: "19px" }}
        >
          AI Safety Tree
        </h1>

        <div
          className="ml-auto flex items-center gap-4 text-fg-muted"
          style={SMALL_TEXT}
        >
          {currentUser ? (
            <>
              <button
                type="button"
                onClick={openProposeNew}
                className="hover:text-selected-hover transition-colors uppercase tracking-wide"
              >
                + Propose
              </button>
              <span className="text-fg uppercase tracking-wide hidden sm:inline">
                {currentUser.username}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="hover:text-fg transition-colors uppercase tracking-wide"
              >
                Log out
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="text-selected hover:text-selected-hover transition-colors uppercase tracking-wide"
            >
              LW LOGIN
            </a>
          )}
          <span className="w-px h-3 bg-border" aria-hidden />
          <ThemeToggle />
        </div>
      </header>

      <main className="absolute inset-0">
        <CanvasView
          tree={tree}
          fetchNode={fetchNode}
          onVote={handleVote}
          onComment={handleComment}
          onProposeEdit={openProposeEdit}
          onAddChild={openAddChild}
        />
      </main>

      {proposeCtx && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setProposeCtx(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="bg-canvas-elev border border-border shadow-[var(--shadow-md)] p-7 max-w-lg w-full rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-baseline mb-5">
              <h2 className="font-serif text-xl font-semibold text-fg uppercase tracking-wide">
                {proposeTitle}
              </h2>
              <button
                type="button"
                onClick={() => setProposeCtx(null)}
                aria-label="Close"
                className="ml-auto text-fg-muted hover:text-fg w-8 h-8 flex items-center justify-center text-xl leading-none"
                style={SMALL_TEXT}
              >
                ×
              </button>
            </div>
            <ProposeForm
              parents={flattenForPicker(tree)}
              defaultParentId={proposeCtx.parentId}
              defaultTitle={proposeCtx.title}
              defaultBody={proposeCtx.body}
              onSubmit={handlePropose}
            />
          </div>
        </div>
      )}
    </div>
  );
}
