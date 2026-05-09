# AI Safety Tree

A public, community-curated tree of AI safety subfields. Each node is a subfield with a short post explaining it. Logged-in users can upvote, comment, and propose new nodes.

## What it is

- A **canvas view** (React Flow) showing the whole tree — pan, zoom, click to inspect.
- A **side panel** (slides in from the right, ~33% width) showing the selected node: title, short post, author, vote count, comments. Clicking another node swaps the panel content.
- **Logged-in users** (username/password, v1) can vote, comment, and propose new nodes. Reading is open to everyone.
- **Seed tree** is prefilled by the creator. The community grows it from there.

## Top-level structure (v1 seed)

Root: **AI Safety**

Children:
1. AI Safety Meta
2. Technical AI Safety
3. AI Safety Governance
4. AI Safety Community

(Source: [AI Safety Tree by Mark — Whimsical](https://whimsical.com/tilburguniversity59/ai-safety-tree-mark-STL67f2Ywu4SdbmpjjyUbf))

## Status

**v1 implemented.** What works:

- Canvas (React Flow) with seeded nodes, pan/zoom, fit-to-view, mini-map.
- Click a node → side panel opens with title, body, author, score, comments.
- Click another node → panel swaps. Click the X → panel closes.
- Sign up / log in / log out (username + password, hashed with bcrypt, HMAC-signed cookie session).
- Upvote / downvote nodes (logged-in only).
- Comment on nodes (logged-in only).
- Propose new node (logged-in only) — in v1 this **directly creates** a child node; proposal-voting acceptance is Phase 3 work (see [ARCHITECTURE.md §4.2](ARCHITECTURE.md)).

**Not in v1 (deferred):**
- LessWrong account linking (see [ARCHITECTURE.md §2](ARCHITECTURE.md) for the load-bearing open question).
- Editing or deleting existing nodes.
- Proposal acceptance voting (community vote → auto-accept).
- Karma-based write gating.

## Run it locally

```bash
npm install
npx prisma db push        # creates prisma/dev.db
npm run db:seed           # loads the 5 seed nodes
npm run dev               # http://localhost:3000
```

Default seed author: `mark` / `changeme`. Sign up with any other username for testing.

## Tests

```bash
npm test                  # runs Vitest, all 63 tests
```

The codebase was built red/green TDD where it was test-worthy:

| Layer | Tested | File(s) |
|---|---|---|
| Tree-building from flat list | 10 tests | `src/domain/tree.test.ts` |
| Vote tally + apply | 10 tests | `src/domain/votes.test.ts` |
| Slug generation + uniqueness | 10 tests | `src/domain/slug.test.ts` |
| Session HMAC sign/verify | 5 tests | `src/lib/session.test.ts` |
| `<SidePanel>` | 11 tests | `src/components/SidePanel.test.tsx` |
| `<TreeView>` (list-mode orchestrator) | 6 tests | `src/components/TreeView.test.tsx` |
| `<ProposeForm>` | 11 tests | `src/components/ProposeForm.test.tsx` |

The Prisma data layer, API routes, auth helpers, pages, and `<CanvasView>` (React Flow wrapper) were verified by smoke test against a running dev server, not by unit tests — they're either thin glue over Prisma/Next.js primitives, or hard to test in jsdom.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Prisma + SQLite** (swap to Postgres later by changing the datasource)
- **@xyflow/react** for the canvas
- **Tailwind v4**
- **Vitest + React Testing Library + jsdom** for tests
- **bcryptjs** + HMAC cookie session (no NextAuth in v1 — see notes)

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for the design doc, data model, build phases, and open questions.

## Why this is hard (prior art)

- **Arbital** tried something close and went dormant. Read the post-mortem before adding more features.
- **Stampy / aisafety.info** — community Q&A, overlapping audience.
- **Kialo** — closest live UX analog (argument trees + voting), generic.
- **LessWrong wiki-tags** — already form a graph of AI-safety concepts with karma-gated edits.

The bet: a visual, single-domain tree with a low edit-friction loop is different enough from tags / Q&A to be worth its own tool. That bet should be tested with v1 before building proposal-voting and the rest.

## License

TBD.
