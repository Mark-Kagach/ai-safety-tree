"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
type TreeVariant = "shallow" | "community";

type HomeClientProps = {
  initialShallowTree: TreeViewNode[];
  initialCommunityTree: TreeViewNode[];
  initialVariant: TreeVariant;
  currentUser: CurrentUser | null;
};

type ProposeContext = {
  mode: "new" | "edit" | "add-child";
  parentId?: string;
  title?: string;
  body?: string;
};

// Each entry in the slider stack is an independent panel. The panel keeps
// its own back-stack of slugs so a user can drill into proposals inside one
// panel without affecting the others. The numeric `id` is monotonic across
// the session and gives each panel a stable React key for animation.
type SliderState = {
  id: number;
  slugStack: string[];
  node: SidePanelNode | null;
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

const TREE_LABELS: Record<TreeVariant, string> = {
  shallow: "Shallow Technical Review Tree",
  community: "Community-Curated Tree",
};

export function HomeClient({
  initialShallowTree,
  initialCommunityTree,
  initialVariant,
  currentUser,
}: HomeClientProps) {
  const router = useRouter();
  const [variant, setVariant] = useState<TreeVariant>(initialVariant);
  const [shallowTree, setShallowTree] = useState(initialShallowTree);
  const [communityTree, setCommunityTree] = useState(initialCommunityTree);

  // Active tree picked off the variant — the canvas always renders this.
  const tree = variant === "community" ? communityTree : shallowTree;

  const [proposeCtx, setProposeCtx] = useState<ProposeContext | null>(null);
  const [sliders, setSliders] = useState<SliderState[]>([]);
  const nextSliderIdRef = useRef(1);

  // Shared panel width across the stack — null means "use the default
  // class width". Lifted here (instead of inside SidePanel) so dragging
  // any one handle resizes every stacked panel uniformly.
  const [panelWidth, setPanelWidth] = useState<number | null>(null);

  // Clamp width when the viewport narrows below the panel's current size.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => {
      setPanelWidth((w) => {
        if (w === null) return null;
        const min = Math.min(682, window.innerWidth * 0.33);
        const max = window.innerWidth * 0.4;
        return Math.max(min, Math.min(max, w));
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // The "active" slider — the leftmost / most-recent — is the one that
  // receives keyboard interactions and whose vote/comment actions take
  // effect. The rest are visible but passive.
  const activeIndex = sliders.length - 1;
  const activeSlider: SliderState | null = sliders[activeIndex] ?? null;
  const activeSlug = activeSlider?.slugStack.at(-1) ?? null;

  // ─── Data fetching ─────────────────────────────────────────────────────

  const fetchNode = useCallback(
    async (slug: string, v: TreeVariant): Promise<SidePanelNode> => {
      const res = await fetch(
        `/api/nodes/${slug}?variant=${encodeURIComponent(v)}`,
      );
      if (!res.ok) throw new Error(`Failed to load node ${slug}`);
      return res.json();
    },
    [],
  );

  const refreshTree = useCallback(async () => {
    const res = await fetch(`/api/tree?variant=${encodeURIComponent(variant)}`);
    if (!res.ok) return;
    const data: TreeViewNode[] = await res.json();
    if (variant === "community") setCommunityTree(data);
    else setShallowTree(data);
  }, [variant]);

  // Whenever a slider's top-of-stack slug changes (push, pop, init), refetch
  // its node payload from the API and store it on the slider. We collapse
  // each slider to a stable string key so the effect can statically depend
  // on the join — it changes whenever any panel's slug changes or any
  // panel is added/removed.
  const slidersKey = sliders
    .map((s) => `${s.id}:${s.slugStack.at(-1) ?? ""}`)
    .join("|");
  useEffect(() => {
    let cancelled = false;
    sliders.forEach((s) => {
      const slug = s.slugStack.at(-1);
      if (!slug) return;
      // Skip when the panel already has the right node loaded.
      if (s.node && s.node.slug === slug) return;
      fetchNode(slug, variant).then((n) => {
        if (cancelled) return;
        setSliders((prev) =>
          prev.map((p) => (p.id === s.id ? { ...p, node: n } : p)),
        );
      }).catch(() => {
        if (cancelled) return;
        setSliders((prev) =>
          prev.map((p) => (p.id === s.id ? { ...p, node: null } : p)),
        );
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slidersKey, variant]);

  const refreshActivePanel = useCallback(async () => {
    if (!activeSlider || !activeSlug) return;
    const fresh = await fetchNode(activeSlug, variant);
    setSliders((prev) =>
      prev.map((p) => (p.id === activeSlider.id ? { ...p, node: fresh } : p)),
    );
  }, [activeSlider, activeSlug, fetchNode, variant]);

  const requireLogin = (action: string) => {
    const ok = window.confirm(`Log in to ${action}?`);
    if (ok) router.push("/login");
  };

  // ─── Slider lifecycle ──────────────────────────────────────────────────

  // Click on a canvas node → push a new slider to the right edge, stacking
  // any existing panels left. If the user clicks the same node that's
  // already on top of the active slider, just leave the existing stack
  // alone (avoid creating duplicates from accidental double-clicks).
  const onCanvasNodeSelect = (slug: string) => {
    if (sliders.some((s) => s.slugStack.at(-1) === slug)) return;
    setSliders((prev) => [
      ...prev,
      { id: nextSliderIdRef.current++, slugStack: [slug], node: null },
    ]);
  };

  const onSliderClose = (id: number) => {
    setSliders((prev) => prev.filter((s) => s.id !== id));
  };

  // Drill into a related proposal inside a specific slider.
  const onSliderNavigate = (id: number, slug: string) => {
    setSliders((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, slugStack: [...s.slugStack, slug], node: null }
          : s,
      ),
    );
  };

  const onSliderBack = (id: number) => {
    setSliders((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, slugStack: s.slugStack.slice(0, -1), node: null }
          : s,
      ),
    );
  };

  // ─── Vote / comment / propose actions (apply to the active slider) ────

  const handleVote = async (value: 1 | -1) => {
    if (!activeSlug) return;
    if (variant === "community") {
      // Community tree is read-only seed data — surface a clear message
      // rather than firing a write that won't persist.
      window.alert(
        "Voting is disabled on the Community-Curated Tree (read-only sample).",
      );
      return;
    }
    if (!currentUser) {
      requireLogin("vote");
      return;
    }
    const res = await fetch(`/api/nodes/${activeSlug}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (res.ok) {
      await Promise.all([refreshTree(), refreshActivePanel()]);
    }
  };

  const handleComment = async (body: string) => {
    if (!activeSlug) return;
    if (variant === "community") {
      window.alert(
        "Comments are disabled on the Community-Curated Tree (read-only sample).",
      );
      return;
    }
    if (!currentUser) {
      requireLogin("comment");
      return;
    }
    const res = await fetch(`/api/nodes/${activeSlug}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    if (res.ok) await refreshActivePanel();
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
    if (!activeSlider?.node) return;
    setProposeCtx({
      mode: "edit",
      parentId: activeSlider.node.parentId ?? undefined,
      title: activeSlider.node.title,
      body: activeSlider.node.body,
    });
  };

  const openAddChild = () => {
    if (!currentUser) {
      requireLogin("add a child node");
      return;
    }
    if (!activeSlider?.node) return;
    setProposeCtx({ mode: "add-child", parentId: activeSlider.node.id });
  };

  const handlePropose = async (payload: ProposeFormPayload) => {
    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setProposeCtx(null);
      await Promise.all([refreshTree(), refreshActivePanel()]);
    } else {
      const text = await res.text();
      window.alert(`Failed: ${text}`);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  };

  // ─── Tree-variant switching ────────────────────────────────────────────

  const switchVariant = (v: TreeVariant) => {
    if (v === variant) return;
    setVariant(v);
    // Clear any open sliders — the slugs come from the other tree and
    // wouldn't resolve. Keep the propose modal open if the user had one.
    setSliders([]);
    // Sync the URL so refresh / share preserves the selection.
    const url = new URL(window.location.href);
    if (v === "shallow") url.searchParams.delete("variant");
    else url.searchParams.set("variant", v);
    window.history.replaceState({}, "", url.toString());
  };

  // ─── Selection feedback for the canvas ─────────────────────────────────

  // The canvas highlights nodes that have *any* slider open on them, with
  // the active slider's node taking the strongest highlight.
  const openSlugs = useMemo(
    () =>
      new Set(
        sliders
          .map((s) => s.slugStack.at(-1))
          .filter((s): s is string => Boolean(s)),
      ),
    [sliders],
  );

  const proposeTitle =
    proposeCtx?.mode === "edit"
      ? "Suggest edit"
      : proposeCtx?.mode === "add-child"
        ? "Add child node"
        : "Propose new node";

  return (
    <div className="h-full relative bg-canvas">
      <header className="dirty-mirror absolute top-0 left-0 right-0 z-20 h-16 flex items-center px-5 sm:px-7 gap-3">
        <Link
          href="/"
          aria-label="AI Safety Tree home"
          className="shrink-0 inline-flex"
        >
          <Image
            src="/logo.svg"
            alt=""
            width={32}
            height={32}
            priority
            unoptimized
            className="block h-8 w-8"
          />
        </Link>

        <h1
          className="font-serif font-normal text-fg uppercase tracking-wide leading-none whitespace-nowrap"
          style={{ fontSize: "19px" }}
        >
          AI Safety Tree
        </h1>

        {/* Tree variant switcher — segmented control, centred so both
            options are equally prominent. */}
        <div
          className="ml-3 hidden md:flex items-center border border-border rounded-sm overflow-hidden"
          style={SMALL_TEXT}
          role="group"
          aria-label="Switch tree"
        >
          <button
            type="button"
            onClick={() => switchVariant("shallow")}
            aria-pressed={variant === "shallow"}
            className={`px-3 py-1.5 uppercase tracking-wide transition-colors ${
              variant === "shallow"
                ? "bg-selected text-white"
                : "bg-canvas-elev text-fg-muted hover:text-fg hover:bg-canvas-elev-hover"
            }`}
            title="Shallow Technical Review Tree — based on the Arb Research review"
          >
            Shallow Review
          </button>
          <button
            type="button"
            onClick={() => switchVariant("community")}
            aria-pressed={variant === "community"}
            className={`px-3 py-1.5 uppercase tracking-wide transition-colors border-l border-border ${
              variant === "community"
                ? "bg-selected text-white"
                : "bg-canvas-elev text-fg-muted hover:text-fg hover:bg-canvas-elev-hover"
            }`}
            title="Community-Curated Tree — broader, with proposed sub-topics throughout"
          >
            Community-Curated
          </button>
        </div>

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
          // Re-mount the canvas when the tree variant changes — different
          // node IDs, different shape, simplest fix is a fresh ReactFlow.
          key={variant}
          tree={tree}
          selectedSlug={activeSlug}
          openSlugs={openSlugs}
          onNodeSelect={onCanvasNodeSelect}
          variantLabel={TREE_LABELS[variant]}
        />
      </main>

      {/* Stack of side panels — leftmost is most recent. Each panel renders
          itself at `right: 0` and is translated horizontally by its index;
          the SidePanel component handles its own enter animation. */}
      {sliders.map((s, i) => (
        <SidePanel
          key={s.id}
          stackIndex={i}
          stackSize={sliders.length}
          isActive={i === activeIndex}
          width={panelWidth}
          onWidthChange={setPanelWidth}
          node={s.node}
          canGoBack={s.slugStack.length > 1}
          onClose={() => onSliderClose(s.id)}
          onBack={() => onSliderBack(s.id)}
          onNavigate={(slug) => onSliderNavigate(s.id, slug)}
          onVote={i === activeIndex ? handleVote : undefined}
          onComment={i === activeIndex ? handleComment : undefined}
          onProposeEdit={i === activeIndex ? openProposeEdit : undefined}
          onAddChild={i === activeIndex ? openAddChild : undefined}
        />
      ))}

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
                &times;
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
