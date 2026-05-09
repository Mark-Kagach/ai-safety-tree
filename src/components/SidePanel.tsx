"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import ReactMarkdown from "react-markdown";

export type SidePanelComment = {
  id: string;
  body: string;
  authorUsername: string;
  createdAt: string;
};

export type SidePanelOutput = {
  title: string;
  url?: string;
  authors?: string;
};

export type RelatedProposal = {
  slug: string;
  title: string;
  authorUsername: string;
  score: number;
  commentCount: number;
  kind: "child" | "edit";
};

export type SidePanelNode = {
  id: string;
  slug: string;
  title: string;
  body: string;
  outputs: SidePanelOutput[];
  authorUsername: string;
  parentId: string | null;
  status: "active" | "proposed";
  score: number;
  alignmentKarma: number;
  userVote: -1 | 0 | 1;
  comments: SidePanelComment[];
  relatedProposals: RelatedProposal[];
};

export type SidePanelProps = {
  node: SidePanelNode | null;
  /** Number of nodes deeper than the root in the navigation stack. When > 0,
   *  the close button is replaced with a back arrow. */
  canGoBack?: boolean;
  /** Position of this panel in the stack — 0 is the oldest / rightmost,
   *  larger indices stack progressively to the left. The most-recent panel
   *  has stackIndex === stackSize - 1. */
  stackIndex?: number;
  stackSize?: number;
  /** Whether this is the most-recent panel (the only one that responds to
   *  vote / comment / propose). Inactive panels are still interactive for
   *  navigation and close. */
  isActive?: boolean;
  /** Shared panel width in px (null = use default). Lives on the parent
   *  so dragging the handle on any one panel updates the whole stack
   *  in lockstep. */
  width?: number | null;
  onWidthChange?: (next: number | null) => void;
  onClose: () => void;
  onBack?: () => void;
  /** Called when the user clicks a proposal row to drill into it. */
  onNavigate?: (slug: string) => void;
  onVote?: (value: 1 | -1) => void;
  onComment?: (body: string) => void;
  onProposeEdit?: () => void;
  onAddChild?: () => void;
};

const DEFAULT_PROPOSAL_LIMIT = 5;

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

const UI_TEXT: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
};

function ChevronUp({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.65)}
      viewBox="0 0 14 9"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 7 L7 2 L12 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDown({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.65)}
      viewBox="0 0 14 9"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 2 L7 7 L12 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 12 L2.6 9.4 L9.4 2.6 L11.4 4.6 L4.6 11.4 L2 12 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M8.4 3.6 L10.4 5.6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M7 2 L7 12 M2 7 L12 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 3 L12 3 L12 10 L8 10 L6 12 L6 10 L2 10 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M14 5 L7 11 L14 17 M7 11 L18 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path
        d="M5.5 5.5 L16.5 16.5 M16.5 5.5 L5.5 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SidePanel({
  node,
  canGoBack = false,
  stackIndex = 0,
  stackSize = 1,
  isActive = true,
  width = null,
  onWidthChange,
  onClose,
  onBack,
  onNavigate,
  onVote,
  onComment,
  onProposeEdit,
  onAddChild,
}: SidePanelProps) {
  const [draft, setDraft] = useState("");
  const [outputsOpen, setOutputsOpen] = useState(false);
  const [proposalsOpen, setProposalsOpen] = useState(false);
  const [showAllProposals, setShowAllProposals] = useState(false);
  // Width is owned by the parent so a stack of panels stays in lockstep
  // when one of them is dragged — a pixel value (post-drag) or null
  // (= use the default Tailwind class).
  const panelWidth = width;
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  // Enter-animation gate. On first paint the panel is rendered at the
  // *previous* slot's translateX so its slide-into-place is just the
  // CSS transition resolving. We flip `mounted` on the next frame so
  // browsers register the transition. Two RAFs are needed because React
  // batches initial-render state into the same paint that includes the
  // mount, so a single RAF would skip the start state.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
    };
  }, []);

  // Reset disclosure state when the displayed node changes.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setOutputsOpen(false);
    setProposalsOpen(false);
    setShowAllProposals(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [node?.id]);

  const onResizeStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!onWidthChange) return;
    e.preventDefault();
    e.stopPropagation();
    const startWidth =
      panelWidth ?? Math.min(682, window.innerWidth * 0.33);
    dragRef.current = { startX: e.clientX, startWidth };

    const onMove = (ev: globalThis.PointerEvent) => {
      if (!dragRef.current) return;
      // Slider is anchored on the right; dragging left increases width.
      const delta = dragRef.current.startX - ev.clientX;
      const next = dragRef.current.startWidth + delta;
      const min = Math.min(682, window.innerWidth * 0.33);
      const max = window.innerWidth * 0.4;
      onWidthChange(Math.max(min, Math.min(max, next)));
    };

    const onEnd = () => {
      dragRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
  };

  if (!node) return null;

  const handlePost = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onComment?.(trimmed);
    setDraft("");
  };

  const upActive = node.userVote === 1;
  const downActive = node.userVote === -1;

  const visibleProposals = showAllProposals
    ? node.relatedProposals
    : node.relatedProposals.slice(0, DEFAULT_PROPOSAL_LIMIT);
  const hasMoreProposals =
    node.relatedProposals.length > DEFAULT_PROPOSAL_LIMIT;

  // ─── Stack positioning ────────────────────────────────────────────────
  //
  // The panel is anchored at `right: 0` and slid horizontally by its index
  // — each older panel pushes the next one one panel-width further left.
  // CSS `transition: transform` handles the smooth shift when an earlier
  // panel closes and the rest consolidate to the right.
  //
  // Newer panels sit *behind* older ones (lower z-index) so a freshly-
  // opened panel slides in *underneath* the existing rightmost one to its
  // resting place. Once everything is at rest, panels don't overlap.

  // Resting position: each older panel pushes us one panel-width further
  // left of the rightmost slot. Enter-animation start position: the slot
  // *to our right* (i.e., where the previous-newest panel sits — or, for
  // the very first panel, just off-screen to the right). Sliding from
  // there into the resting position produces the "card slips in from the
  // right and tucks under the previous one" effect.
  const targetTransform = `translateX(calc(var(--side-panel-w) * ${-stackIndex}))`;
  const startTransform = `translateX(calc(var(--side-panel-w) * ${1 - stackIndex}))`;
  const zIndex = 30 + (stackSize - 1 - stackIndex);

  const widthCss =
    panelWidth !== null ? `${panelWidth}px` : "min(682px, 33vw)";

  return (
    <aside
      aria-label={`Details for ${node.title}`}
      data-stack-index={stackIndex}
      data-active={isActive ? "true" : "false"}
      // Stack sliders use a CSS variable for width so the offset math
      // ("translate left by N panel widths") stays in lockstep with any
      // drag-resize on this single panel.
      style={{
        // The width var is set on this same element so descendants and
        // siblings stacked from it can reference it.
        ["--side-panel-w" as string]:
          panelWidth !== null ? `${panelWidth}px` : "min(682px, 33vw)",
        width: widthCss,
        maxWidth: panelWidth !== null ? "none" : undefined,
        transform: mounted ? targetTransform : startTransform,
        zIndex,
      }}
      className="side-panel-stacked fixed right-0 top-16 bottom-0 w-full sm:w-[min(682px,33vw)] bg-side-panel border-l border-border overflow-y-auto shadow-[var(--shadow-md)] sm:transition-transform sm:duration-[360ms] sm:ease-[cubic-bezier(0.22,1,0.36,1)]"
    >
      {/* Drag handle on the very left edge of the slider. Only the
          leftmost (active) panel shows it — handles on stacked panels
          would sit behind the sibling above them. Hidden on mobile,
          where the slider is full-screen. */}
      {isActive && onWidthChange && (
        <div
          onPointerDown={onResizeStart}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panel — drag to widen, max 40% of viewport"
          className="hidden sm:block absolute left-0 top-0 bottom-0 w-1.5 z-40 cursor-col-resize hover:bg-selected/30 active:bg-selected/50 transition-colors"
        />
      )}
      <div className="p-6 relative">
        {/* The top-right control is either a back arrow (when stacked) or
            the close cross. */}
        {canGoBack ? (
          <button
            type="button"
            aria-label="Back to previous node"
            onClick={onBack}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full text-fg-muted hover:text-fg hover:bg-canvas-elev-hover flex items-center justify-center transition-colors"
          >
            <ArrowLeftIcon />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full text-fg-muted hover:text-fg hover:bg-canvas-elev-hover flex items-center justify-center transition-colors"
          >
            <CloseIcon />
          </button>
        )}

        {/* "Proposed" badge for nodes drilled into via Other Proposals. */}
        {node.status === "proposed" && (
          <span
            className="inline-block uppercase tracking-[0.08em] text-selected border border-selected px-2 py-0.5 rounded mb-3"
            style={{ ...UI_TEXT, fontSize: "11px" }}
          >
            Proposal
          </span>
        )}

        <h2 className="font-serif font-semibold leading-tight text-fg text-[1.9rem] pr-12 break-words">
          {node.title}
        </h2>

        <div
          className="text-fg-muted flex items-center gap-2 mt-1 mb-6"
          style={UI_TEXT}
        >
          <span>by</span>
          <span className="text-fg">{node.authorUsername}</span>
        </div>

        <div className="slider-body mb-7 [&_strong]:font-semibold [&_p]:my-0">
          <ReactMarkdown
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-selected hover:text-selected-hover underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 space-y-1">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
            }}
          >
            {node.body}
          </ReactMarkdown>
        </div>

        {node.outputs.length > 0 && (
          <div className="mb-6 border-y border-border">
            <button
              type="button"
              onClick={() => setOutputsOpen((v) => !v)}
              aria-expanded={outputsOpen}
              className="w-full flex items-center justify-between py-3 text-fg hover:text-selected-hover transition-colors"
              style={UI_TEXT}
            >
              <span className="min-w-0 text-left uppercase tracking-[0.08em] font-semibold break-words">
                Some outputs ({node.outputs.length})
              </span>
              <span className="text-fg-muted text-base leading-none" aria-hidden>
                {outputsOpen ? "−" : "+"}
              </span>
            </button>
            {outputsOpen && (
              <ul className="pb-4 pt-1 space-y-2">
                {node.outputs.map((o, i) => (
                  <li key={i} className="leading-snug">
                    {o.url ? (
                      <a
                        href={o.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-selected hover:text-selected-hover underline underline-offset-2 font-serif"
                        style={{ fontSize: "16px" }}
                      >
                        {o.title}
                      </a>
                    ) : (
                      <span
                        className="text-fg font-serif"
                        style={{ fontSize: "16px" }}
                      >
                        {o.title}
                      </span>
                    )}
                    {o.authors && (
                      <span className="text-fg-muted ml-2" style={UI_TEXT}>
                        {o.authors}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* "Other Proposals for the Node" — collapsible. Top 5 by default, with
            a "View More" button to reveal the rest. Only renders when there
            actually are proposals on this node. */}
        {node.relatedProposals.length > 0 && (
          <div className="mb-6 border-y border-border">
            <button
              type="button"
              onClick={() => setProposalsOpen((v) => !v)}
              aria-expanded={proposalsOpen}
              className="w-full flex items-center justify-between py-3 text-fg hover:text-selected-hover transition-colors"
              style={UI_TEXT}
            >
              <span className="min-w-0 text-left uppercase tracking-[0.08em] font-semibold break-words">
                Other proposals for the node ({node.relatedProposals.length})
              </span>
              <span className="text-fg-muted text-base leading-none" aria-hidden>
                {proposalsOpen ? "−" : "+"}
              </span>
            </button>
            {proposalsOpen && (
              <ul className="pb-4 pt-1 divide-y divide-border">
                {visibleProposals.map((p) => (
                  <li
                    key={p.slug}
                    className="py-3 flex items-center gap-3"
                    style={UI_TEXT}
                  >
                    <div className="flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => onNavigate?.(p.slug)}
                        className="block text-left font-serif text-fg hover:text-selected-hover transition-colors truncate"
                        style={{ fontSize: "16px" }}
                        title={p.title}
                      >
                        {p.title}
                      </button>
                      <div className="text-fg-muted text-[12px] mt-0.5 flex items-center gap-1.5">
                        <span>by</span>
                        <span className="text-fg">{p.authorUsername}</span>
                        {p.kind === "child" && (
                          <>
                            <span className="text-fg-subtle">·</span>
                            <span>new child</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-fg-muted tabular-nums">
                      <span
                        className="flex items-center gap-1"
                        title={`${p.score} points`}
                      >
                        <ChevronUp size={11} />
                        {p.score}
                      </span>
                      <span
                        className="flex items-center gap-1"
                        title={`${p.commentCount} comments`}
                      >
                        <CommentIcon />
                        {p.commentCount}
                      </span>
                    </div>
                  </li>
                ))}
                {hasMoreProposals && !showAllProposals && (
                  <li className="pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAllProposals(true)}
                      className="text-selected hover:text-selected-hover transition-colors uppercase tracking-wide"
                      style={UI_TEXT}
                    >
                      View more (
                      {node.relatedProposals.length - DEFAULT_PROPOSAL_LIMIT}{" "}
                      more)
                    </button>
                  </li>
                )}
              </ul>
            )}
          </div>
        )}

        {/* ─── Compact karma column + horizontal action buttons ─────────── */}
        <div className="flex flex-wrap items-center gap-3 mb-8" style={UI_TEXT}>
          <div
            className="flex flex-col items-center select-none text-fg-muted"
            style={{ minWidth: 26, fontSize: "13px", lineHeight: 1 }}
          >
            <button
              type="button"
              aria-label="Upvote"
              aria-pressed={upActive}
              onClick={() => onVote?.(1)}
              className={`w-6 h-5 flex items-center justify-center transition-colors ${
                upActive ? "text-selected" : "hover:text-fg"
              }`}
            >
              <ChevronUp size={14} />
            </button>
            <span
              className={`tabular-nums my-0.5 ${
                upActive || downActive ? "text-selected" : "text-fg"
              }`}
              aria-label={`${node.score} karma`}
            >
              {node.score}
            </span>
            <span
              className="text-fg-subtle my-0.5"
              aria-hidden
              title="Alignment karma"
            >
              Ω
            </span>
            <span
              className="tabular-nums my-0.5 text-fg-muted"
              aria-label={`${node.alignmentKarma} alignment karma`}
            >
              {node.alignmentKarma}
            </span>
            <button
              type="button"
              aria-label="Downvote"
              aria-pressed={downActive}
              onClick={() => onVote?.(-1)}
              className={`w-6 h-5 flex items-center justify-center transition-colors ${
                downActive ? "text-selected" : "hover:text-fg"
              }`}
            >
              <ChevronDown size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={onProposeEdit}
            disabled={!onProposeEdit}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded text-fg-muted hover:text-selected-hover hover:bg-canvas-elev-hover transition-colors uppercase tracking-wide whitespace-nowrap disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-fg-muted"
            title={
              onProposeEdit
                ? "Propose an edit to this node"
                : "Open this panel to suggest edits"
            }
          >
            <PencilIcon />
            <span>Suggest edit</span>
          </button>
          <button
            type="button"
            onClick={onAddChild}
            disabled={!onAddChild}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded text-fg-muted hover:text-selected-hover hover:bg-canvas-elev-hover transition-colors uppercase tracking-wide whitespace-nowrap disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-fg-muted"
            title={
              onAddChild
                ? "Add a new node below this one"
                : "Open this panel to add a child"
            }
          >
            <PlusIcon />
            <span>Add child</span>
          </button>
        </div>

        <section aria-label="Comments" className="border-t border-border pt-5">
          <h3
            className="text-fg-muted uppercase tracking-[0.08em] font-semibold mb-4"
            style={UI_TEXT}
          >
            Comments ({node.comments.length})
          </h3>

          <ul className="space-y-0 mb-5">
            {node.comments.map((c, i) => (
              <li
                key={c.id}
                className={`py-4 ${i > 0 ? "border-t border-border" : ""}`}
              >
                <div
                  className="text-fg-muted mb-2 flex items-center gap-2"
                  style={UI_TEXT}
                >
                  <span className="text-fg">{c.authorUsername}</span>
                  <span className="text-fg-subtle">·</span>
                  <span>{formatDate(c.createdAt)}</span>
                </div>
                <div
                  className="font-serif text-fg"
                  style={{ fontSize: "16px", lineHeight: 1.6 }}
                >
                  {c.body}
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <textarea
              placeholder="Add a comment"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="font-sans border border-border bg-canvas-soft text-fg p-3 min-h-[110px] focus:outline-none focus:border-fg-muted rounded-sm resize-y"
              style={{ fontSize: "14px", lineHeight: 1.6 }}
            />
            {/* Post-comment button is a fixed shade of green across both
                themes — does NOT track --selected. */}
            <button
              type="button"
              onClick={handlePost}
              className="self-end bg-[#5f9b65] hover:bg-[#4f8a55] text-white px-4 py-1.5 rounded-sm transition-colors uppercase tracking-wide"
              style={UI_TEXT}
            >
              Post comment
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
}
