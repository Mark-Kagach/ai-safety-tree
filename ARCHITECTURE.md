# Architecture

This document captures the planned design before any code is written. It is intentionally a sketch, not a spec — items marked **(open)** still need decisions.

---

## 1. User-facing surface

### 1.1 Two views

| View | Purpose | Notes |
|---|---|---|
| **Canvas view** | Pan/zoom map of the whole tree. Each node is a card with title + score. | Primary landing experience. URL: `/` |
| **Side panel** | Slides in from right, ~33% width. Shows the clicked node's details. Clicking another node swaps content (does not stack). | URL: `/?node=<slug>` so links are shareable. The canvas remains visible and interactive on the left ~67%. |

### 1.2 Node card (on canvas)

- Node title
- Vote score (single number, can be negative)
- Subtle visual cue if the node has unread proposals or is "hot" *(open: do we need this in v1?)*

### 1.3 Side panel contents

In order, top to bottom:

1. **Node title**
2. **Short post** (a few paragraphs, markdown). Hard cap on length — see §3.2.
3. **Author** (LessWrong username, links to their LW profile) and **created date**
4. **Vote control** (▲ / ▼) and current score
5. **Comments** — flat or shallow-threaded *(open)*. Each comment shows author, body, timestamp, own vote score.
6. **Edit / propose-change** affordances (gated by login)

### 1.4 Read vs. write

| Action | Logged out | Logged in |
|---|---|---|
| View canvas + side panel | ✅ | ✅ |
| Upvote / downvote node or comment | ❌ | ✅ |
| Comment | ❌ | ✅ |
| Propose new node | ❌ | ✅ |
| Propose edit / deletion of a node | ❌ | ✅ |

---

## 2. Authentication — the load-bearing open question

The user-facing requirement is "log in with LessWrong." LessWrong **does not currently expose a public OAuth provider**, so this needs a concrete strategy. Three options, ranked by ambition:

### Option A — Ask the LessWrong team to add OAuth
- **Pro:** the cleanest UX; one click to log in.
- **Con:** depends on LW roadmap; could take months or never happen.
- **Action:** open a conversation with the LW team early. Don't block v1 on it.

### Option B — Username linking via verification code (recommended for v1)
- User enters their LW username on our site.
- We give them a short code (e.g., `aist-7f3k`) and ask them to paste it into their LW profile bio or a designated shortform post.
- Our backend fetches the LW profile via the public GraphQL API, confirms the code is present, marks the link verified, and stores their LW username + karma.
- Authentication on our side is then a separate mechanism — see Option B-auth.

### Option B-auth — what actually authenticates a session
- **Email magic link** (passwordless), or
- **Google OAuth**.

Either way, the LW link is *identity decoration* (display name, karma badge, vote weight gating), not the auth primary. **(open: which of magic-link vs. Google to pick — magic-link is simpler and avoids Google dependency.)**

### Option C — Skip LW linking for v1
- Plain Google/email login, no LW connection. Lose the "LW community" framing but ship faster.
- Re-add LW linking in v2.

**Recommendation:** start with B + magic-link. It's a tiny amount of extra code over plain auth and preserves the "LW community" signal that the project wants.

### 2.1 LW karma — what we actually do with it

Optional uses, decide which apply:
- **Gate writes** (e.g., LW karma ≥ 10 to propose nodes). Filters trolls cheaply.
- **Vote weighting** — high-LW-karma users' votes count more. *(open: probably skip in v1, easy to game perception of legitimacy.)*
- **Just display it** as a badge for context.

---

## 3. Data model

Postgres, accessed via Prisma (assumed, see §5). Tables:

### 3.1 `users`
| Field | Type | Notes |
|---|---|---|
| `id` | uuid | pk |
| `email` | text | unique, used for magic link |
| `lw_username` | text? | nullable until linked |
| `lw_karma` | int? | refreshed on login + nightly job |
| `lw_link_verified_at` | timestamptz? | non-null once verified |
| `created_at` | timestamptz | |

### 3.2 `nodes`
| Field | Type | Notes |
|---|---|---|
| `id` | uuid | pk |
| `slug` | text | unique, URL-safe |
| `title` | text | |
| `body` | text | markdown, **hard cap ~2000 chars** to enforce "few paragraphs" |
| `parent_id` | uuid? | self-referential. Null for root. |
| `author_id` | uuid | fk → users |
| `position_x`, `position_y` | float? | optional manual canvas position; auto-laid-out if null |
| `is_seed` | bool | true for the creator's prefilled nodes |
| `created_at`, `updated_at` | timestamptz | |

**Tree shape:** strict tree (one parent) for v1 simplicity. *(open: do we want DAG / multi-parent later? Probably yes, but v1 = tree.)*

### 3.3 `node_votes`
| Field | Type | Notes |
|---|---|---|
| `user_id` | uuid | fk |
| `node_id` | uuid | fk |
| `value` | smallint | -1 or +1 |
| `created_at` | timestamptz | |
| pk | (user_id, node_id) | one vote per user per node |

Score = `SUM(value)` over `node_votes` for that node. Cache as a column on `nodes` for read perf if needed.

### 3.4 `comments`
| Field | Type | Notes |
|---|---|---|
| `id` | uuid | pk |
| `node_id` | uuid | fk |
| `author_id` | uuid | fk |
| `parent_comment_id` | uuid? | for shallow threading; null = top-level |
| `body` | text | markdown |
| `created_at`, `updated_at` | timestamptz | |

Optional: `comment_votes` table mirroring `node_votes`.

### 3.5 `proposals` (v2, not v1)
For community-driven create / edit / delete operations on nodes.

| Field | Type | Notes |
|---|---|---|
| `id` | uuid | pk |
| `kind` | enum | `create`, `edit`, `delete` |
| `target_node_id` | uuid? | null for `create` |
| `parent_node_id` | uuid? | for `create` — where in tree |
| `proposed_title`, `proposed_body` | text? | for `create` / `edit` |
| `proposed_by` | uuid | fk users |
| `status` | enum | `open`, `accepted`, `rejected`, `withdrawn` |
| `resolved_at` | timestamptz? | |
| `created_at` | timestamptz | |

Plus `proposal_votes` mirroring `node_votes`. Acceptance threshold is a tunable rule — see §4.

---

## 4. Governance: what votes actually do

This is the easiest thing to get wrong. Two separate vote systems:

### 4.1 Quality votes (on existing nodes and comments)
- Cosmetic only. Drives sort order and visibility. Cannot delete content.
- Equivalent to LW/Reddit karma on a post.

### 4.2 Governance votes (on proposals)
- Drive create / edit / delete decisions.
- Acceptance rule for v2 — pick **one** to start, don't combine yet:
  - **Threshold:** e.g., +10 net votes from accounts with verified LW link and karma ≥ N → auto-accept after a 48h cooling window.
  - **Moderator-confirmed:** community votes act as a signal; a small mod team makes the call.
- Deletion is the dangerous one. Default to "demote / hide" rather than hard-delete in v2; preserve history.

**v1 ships without proposals.** Only the seed tree exists; community contribution = comments + votes only. This is deliberate: it lets us validate engagement before building the harder system.

---

## 5. Tech stack (proposed, not final)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Single repo for frontend + API routes. SSR for shareable node URLs. |
| Graph rendering | **React Flow** | Built for interactive node-edge canvases. Pan/zoom/drag out of the box. Cytoscape.js is the alternative if we outgrow it. |
| UI | **Tailwind + shadcn/ui** | Fast to compose; the side panel is a stock component. |
| Database | **Postgres** | Relational fits the data well. |
| ORM | **Prisma** | Schema-first, plays well with Next.js. |
| Auth | **NextAuth (Auth.js)** with email magic-link provider | Standard, batteries-included. Layer LW-linking on top. |
| Hosting | **Vercel** for the app, **Neon / Supabase** for Postgres | Cheap, fast to set up. Move off if we hit limits. |
| Markdown rendering | `react-markdown` + sanitizer | Avoid raw HTML injection in node bodies / comments. |

**(open):** any of these can be swapped. The shape that matters is "Next.js + React Flow + Postgres + magic-link auth." The brand names are placeholders.

---

## 6. Layout: where do nodes go on the canvas?

Two strategies, both needed:

1. **Manual positioning** — creator sets `position_x/y` on seed nodes by hand to get a clean initial layout.
2. **Auto-layout fallback** — for any node without manual position, run a layout algorithm (`dagre` for tree layout via React Flow's plugin). New community-proposed nodes get auto-positioned near their parent.

**(open):** can users drag nodes? If yes, whose drag wins — proposer's, last editor's, or computed average? Easiest v1 answer: **no manual drag in the public UI**; only the creator can manually position via an admin tool.

---

## 7. API surface (v1)

REST or tRPC — picking tRPC if we go all-Next.js, otherwise REST. Endpoints:

### Public read
- `GET /api/tree` — full tree (nodes + edges + scores). Cached aggressively.
- `GET /api/nodes/:slug` — node detail incl. body and comments.

### Authed write
- `POST /api/nodes/:slug/vote` — body `{ value: 1 | -1 | 0 }` (0 = clear vote)
- `POST /api/nodes/:slug/comments` — body `{ body, parentCommentId? }`
- `POST /api/comments/:id/vote`
- `POST /api/auth/lw-link/start` — issue verification code
- `POST /api/auth/lw-link/verify` — check the user pasted the code

### Admin (creator only, v1)
- `POST /api/admin/nodes` — create / edit / delete seed nodes
- `POST /api/admin/nodes/:slug/position` — manual layout

### v2 additions
- `POST /api/proposals` — propose create / edit / delete
- `POST /api/proposals/:id/vote`
- `POST /api/proposals/:id/resolve` — server-side rule check

---

## 8. Build phases

### Phase 0 — Seed prep (no code)
- Mark exports the Whimsical tree to a structured format (JSON or CSV with `parent, title, body`).
- Write the body text for each seed node (a few paragraphs each).
- This is the bottleneck for content quality. Do it before or in parallel with Phase 1.

### Phase 1 — Read-only MVP
- Next.js scaffold, Postgres, seed loader script.
- Canvas view with React Flow, prefilled tree, no auth.
- Side-panel view that opens on node click and is URL-shareable.
- Goal: shareable artefact that proves the tree-as-explorable-thing is appealing.

### Phase 2 — Login + write
- Magic-link auth.
- LW username linking via verification code.
- Upvote/downvote on nodes.
- Comments on nodes (no threading or shallow threading only).

### Phase 3 — Community contribution
- `proposals` system for new nodes.
- One acceptance rule (threshold or mod-confirmed).
- Auto-layout for newly-accepted nodes.

### Phase 4 — Edits, deletions, history
- Propose edit / delete on existing nodes.
- Edit history visible per node.
- Soft-delete (hide) instead of hard-delete.

Stop and re-evaluate after each phase. Phase 1 alone may be enough to learn that the tree-without-voting isn't compelling, in which case the rest doesn't matter.

---

## 9. Open questions (consolidated)

1. **Auth strategy** — confirm Option B + magic-link, or pick differently. (§2)
2. **LW karma usage** — display only, gate writes, or weight votes? (§2.1)
3. **Tree vs. DAG** — strict single-parent tree v1, but mark whether multi-parent is on the roadmap. (§3.2)
4. **Comment threading** — flat or one-level nesting? (§3.4)
5. **Proposal acceptance rule** — vote threshold vs. moderator-confirmed. (§4.2)
6. **Deletion semantics** — soft hide vs. hard delete. (§4.2)
7. **User dragging of nodes** — allowed or admin-only? (§6)
8. **Body length cap** — exact character limit, e.g., 2000. (§3.2)
9. **Spam mitigation** — minimum LW karma to propose? rate limits? (§4)
10. **License** — MIT for code, CC-BY-SA for content? (§README)

---

## 10. Risks

- **Arbital risk:** the audience exists but doesn't engage with custom-built tools when LW already covers 80% of the use case. Counter: ship Phase 1 cheaply, validate engagement before building proposals.
- **Auth friction risk:** asking users to paste a verification code into LW is a real funnel hit. Counter: allow Google login as fallback with no LW link.
- **Content quality vs. graffiti:** open editing without enough karma threshold attracts noise. Counter: keep v1 closed (creator-only), open up with karma gating in v2.
- **Layout ugliness:** auto-laid-out trees often look bad. Counter: manual seed positioning + tasteful auto-layout for new nodes near their parent only.
- **Scope creep:** every feature here is optional past Phase 1. Resist the pull to ship Phase 3 in the first PR.
