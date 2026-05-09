"use client";

import { useState, type FormEvent } from "react";

export const PROPOSE_BODY_MAX = 2000;

export type ProposeFormParent = {
  id: string;
  title: string;
};

export type ProposeFormPayload = {
  title: string;
  body: string;
  parentId: string;
};

export type ProposeFormProps = {
  parents: ProposeFormParent[];
  defaultParentId?: string;
  defaultTitle?: string;
  defaultBody?: string;
  onSubmit: (payload: ProposeFormPayload) => void;
};

export function ProposeForm({
  parents,
  defaultParentId,
  defaultTitle,
  defaultBody,
  onSubmit,
}: ProposeFormProps) {
  const [title, setTitle] = useState(defaultTitle ?? "");
  const [body, setBody] = useState(defaultBody ?? "");
  const [parentId, setParentId] = useState(
    defaultParentId ?? parents[0]?.id ?? "",
  );

  const isValid =
    title.trim() !== "" &&
    body.trim() !== "" &&
    body.length <= PROPOSE_BODY_MAX;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ title: title.trim(), body, parentId });
    setTitle("");
    setBody("");
  };

  const inputClass =
    "w-full border border-border bg-canvas-soft text-fg px-3 py-2 focus:outline-none focus:border-fg-muted rounded-sm font-sans";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      <div>
        <label
          htmlFor="propose-title"
          className="block text-xs font-medium uppercase tracking-wide text-fg-muted mb-1.5"
        >
          Title
        </label>
        <input
          id="propose-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`${inputClass} font-serif text-base`}
        />
      </div>

      <div>
        <label
          htmlFor="propose-parent"
          className="block text-xs font-medium uppercase tracking-wide text-fg-muted mb-1.5"
        >
          Parent
        </label>
        <select
          id="propose-parent"
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          className={inputClass}
        >
          {parents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="propose-body"
          className="block text-xs font-medium uppercase tracking-wide text-fg-muted mb-1.5"
        >
          Body
        </label>
        <textarea
          id="propose-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className={`${inputClass} font-serif text-[0.95rem] leading-[1.6] min-h-[160px] resize-y`}
        />
        <div
          className={`text-xs mt-1 ${
            body.length > PROPOSE_BODY_MAX ? "text-accent" : "text-fg-subtle"
          }`}
        >
          {body.length} / {PROPOSE_BODY_MAX}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="bg-accent text-white px-4 py-2 rounded-sm hover:bg-accent-hover disabled:bg-fg-subtle disabled:cursor-not-allowed transition-colors text-sm"
      >
        Propose new node
      </button>
    </form>
  );
}
