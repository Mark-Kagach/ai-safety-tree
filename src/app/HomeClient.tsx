"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CanvasView } from "@/components/CanvasView";
import type { TreeViewNode } from "@/components/TreeView";
import {
  ProposeForm,
  type ProposeFormParent,
  type ProposeFormPayload,
} from "@/components/ProposeForm";
import { SidePanel, type SidePanelNode } from "@/components/SidePanel";
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
  // Navigation stack of slugs. The top is what the slider is currently
  // showing. Empty = slider closed. Length > 1 = back button shown.
  const [slugStack, setSlugStack] = useState<string[]>([]);
  const [panelNode, setPanelNode] = useState<SidePanelNode | null>(null);

  const selectedSlug = slugStack.at(-1) ?? null;
  const canGoBack = slugStack.length > 1;

  const fetchNode = useCallback(
    async (slug: string): Promise<SidePanelNode> => {
      const res = await fetch(`/api/nodes/${slug}`);
      if (!res.ok) throw new Error(`Failed to load node ${slug}`);
      return res.json();
    },
    [],
  );

  // Fetch the currently-selected slug whenever the top of the stack changes.
  useEffect(() => {
    if (!selectedSlug) {
      setPanelNode(null);
      return;
    }
    let cancelled = false;
    setPanelNode(null);
    fetchNode(selectedSlug).then((n) => {
      if (!cancelled) setPanelNode(n);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedSlug, fetchNode]);

  const refreshTree = async () => {
    const res = await fetch("/api/tree");
    if (res.ok) setTree(await res.json());
  };

  const refreshPanel = async () => {
    if (!selectedSlug) return;
    const fresh = await fetchNode(selectedSlug);
    setPanelNode(fresh);
  };

  const requireLogin = (action: string) => {
    const ok = window.confirm(`Log in to ${action}?`);
    if (ok) router.push("/login");
  };

  // ── Stack handlers (called by canvas + side panel) ──────────────────────

  const onNodeSelect = (slug: string) => setSlugStack([slug]);
  const onNavigate = (slug: string) =>
    setSlugStack((s) => [...s, slug]);
  const onBack = () => setSlugStack((s) => s.slice(0, -1));
  const onClose = () => setSlugStack([]);

  // ── Side-panel actions ──────────────────────────────────────────────────

  const handleVote = async (value: 1 | -1) => {
    if (!selectedSlug) return;
    if (!currentUser) {
      requireLogin("vote");
      return;
    }
    const res = await fetch(`/api/nodes/${selectedSlug}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (res.ok) {
      await Promise.all([refreshTree(), refreshPanel()]);
    }
  };

  const handleComment = async (body: string) => {
    if (!selectedSlug) return;
    if (!currentUser) {
      requireLogin("comment");
      return;
    }
    const res = await fetch(`/api/nodes/${selectedSlug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (res.ok) await refreshPanel();
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
    if (!panelNode) return;
    setProposeCtx({
      mode: "edit",
      parentId: panelNode.parentId ?? undefined,
      title: panelNode.title,
      body: panelNode.body,
    });
  };

  const openAddChild = () => {
    if (!currentUser) {
      requireLogin("add a child node");
      return;
    }
    if (!panelNode) return;
    setProposeCtx({ mode: "add-child", parentId: panelNode.id });
  };

  const handlePropose = async (payload: ProposeFormPayload) => {
    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setProposeCtx(null);
      // Active tree is unaffected (proposals aren't on the canvas), but the
      // panel needs to refresh so the new proposal shows under "Other
      // Proposals" of the targeted node.
      await Promise.all([refreshTree(), refreshPanel()]);
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
              diverge outward and upward; asymmetric branches with leaves. */}
          {/* Two leaning trunks, asymmetric, all strokes width 6, square caps,
              miter joins — no curves anywhere. */}
          <svg width="32" height="32" viewBox="0 0 100 100" aria-hidden className="block">
            <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#000000" strokeWidth="2" />
            <g stroke="#000000" strokeWidth="6" strokeLinecap="square" strokeLinejoin="miter" fill="none">
              <path d="M55 92 L60 30" />
              <path d="M60 30 L50 14" />
              <path d="M60 30 L72 14" />
              <path d="M48 92 L36 50" />
              <path d="M41 70 L48 62" />
              <path d="M36 50 L28 38" />
              <path d="M36 50 L42 42" />
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
          selectedSlug={selectedSlug}
          onNodeSelect={onNodeSelect}
        />
      </main>

      <SidePanel
        node={panelNode}
        canGoBack={canGoBack}
        onClose={onClose}
        onBack={onBack}
        onNavigate={onNavigate}
        onVote={handleVote}
        onComment={handleComment}
        onProposeEdit={openProposeEdit}
        onAddChild={openAddChild}
      />

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
