"use client";

import { useEffect, useState } from "react";
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

export type SidePanelNode = {
  id: string;
  slug: string;
  title: string;
  body: string;
  outputs: SidePanelOutput[];
  authorUsername: string;
  parentId: string | null;
  score: number;
  alignmentKarma: number;
  userVote: -1 | 0 | 1;
  comments: SidePanelComment[];
};

export type SidePanelProps = {
  node: SidePanelNode | null;
  onClose: () => void;
  onVote?: (value: 1 | -1) => void;
  onComment?: (body: string) => void;
  onProposeEdit?: () => void;
  onAddChild?: () => void;
};

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

export function SidePanel({
  node,
  onClose,
  onVote,
  onComment,
  onProposeEdit,
  onAddChild,
}: SidePanelProps) {
  const [draft, setDraft] = useState("");
  const [outputsOpen, setOutputsOpen] = useState(false);

  useEffect(() => {
    setOutputsOpen(false);
  }, [node?.id]);

  if (!node) return null;

  const handlePost = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onComment?.(trimmed);
    setDraft("");
  };

  const upActive = node.userVote === 1;
  const downActive = node.userVote === -1;

  return (
    <aside
      aria-label={`Details for ${node.title}`}
      // Width: 682px on desktop, but never more than 33% of the viewport.
      // Mobile (<sm) takes the full screen.
      className="side-panel-enter fixed right-0 top-16 bottom-0 w-full sm:w-[min(682px,33vw)] bg-side-panel border-l border-border overflow-y-auto z-30 shadow-[var(--shadow-md)]"
    >
      {/* 24px padding on all sides — text spans the whole inner column. */}
      <div className="p-6 relative">
        <button
          type="button"
          aria-label="Close panel"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full text-fg-muted hover:text-fg hover:bg-canvas-elev-hover flex items-center justify-center transition-colors"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            aria-hidden
          >
            <path
              d="M5.5 5.5 L16.5 16.5 M16.5 5.5 L5.5 16.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="font-serif font-semibold leading-tight text-fg text-[1.9rem] pr-12">
          {node.title}
        </h2>

        <div
          className="text-fg-muted flex items-center gap-2 mt-1 mb-6"
          style={UI_TEXT}
        >
          <span>by</span>
          <span className="text-fg">{node.authorUsername}</span>
        </div>

        <div
          className="prose-lw mb-7 text-fg space-y-4 [&_p]:m-0 [&_strong]:font-semibold [&_strong]:text-fg"
          style={{ fontSize: "18.2px", lineHeight: 1.65 }}
        >
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
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
            }}
          >
            {node.body}
          </ReactMarkdown>
        </div>

        {node.outputs.length > 0 && (
          <div className="mb-8 border-y border-border">
            <button
              type="button"
              onClick={() => setOutputsOpen((v) => !v)}
              aria-expanded={outputsOpen}
              className="w-full flex items-center justify-between py-3 text-fg hover:text-selected-hover transition-colors"
              style={UI_TEXT}
            >
              <span className="uppercase tracking-[0.08em] font-semibold">
                Some outputs ({node.outputs.length})
              </span>
              <span
                className="text-fg-muted text-base leading-none"
                aria-hidden
              >
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

        {/* ─── Compact karma column + horizontal action buttons ───────────
            All three sit on one row. The karma column uses tight spacing
            and 13px text so its overall height matches the buttons. */}
        <div className="flex items-center gap-3 mb-8" style={UI_TEXT}>
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
            className="flex items-center gap-1.5 px-2 py-1.5 rounded text-fg-muted hover:text-selected-hover hover:bg-canvas-elev-hover transition-colors uppercase tracking-wide whitespace-nowrap"
            title="Propose an edit to this node"
          >
            <PencilIcon />
            <span>Suggest edit</span>
          </button>
          <button
            type="button"
            onClick={onAddChild}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded text-fg-muted hover:text-selected-hover hover:bg-canvas-elev-hover transition-colors uppercase tracking-wide whitespace-nowrap"
            title="Add a new node below this one"
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
            <button
              type="button"
              onClick={handlePost}
              className="self-end bg-selected text-white px-4 py-1.5 rounded-sm hover:bg-selected-hover transition-colors uppercase tracking-wide"
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
