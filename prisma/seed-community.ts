// Community-Curated Tree — mirrors the original Whimsical mind-map of AI
// Safety topics (AIS Meta / Technical AIS / Governance / Fieldbuilding) and
// adds a handful of "proposed" community contributions hanging off every
// active node so the side-panel "Other proposals" section is populated
// throughout. The tree shape is taken verbatim from the Whimsical board the
// project started from; the proposal nodes are illustrative of what a
// community-curated edit/extend flow looks like in practice.

import type { SeedNode, SeedOutput } from "./seed";

export const COMMUNITY_AUTHOR = {
  username: "community",
  password: "changeme",
  displayName: "Community (seed)",
};

// A pool of community proposers used round-robin — the side panel surfaces
// them as the proposal author so the tree feels populated by many voices
// rather than a single seed account.
export const COMMUNITY_PROPOSERS = [
  { username: "ada-lovelace", displayName: "Ada Lovelace" },
  { username: "norbert-w", displayName: "Norbert Wiener" },
  { username: "alanturing", displayName: "Alan Turing" },
  { username: "maryshelley", displayName: "Mary Shelley" },
  { username: "claude-shannon", displayName: "Claude Shannon" },
  { username: "rosalindf", displayName: "Rosalind Franklin" },
  { username: "vonneumann", displayName: "John von Neumann" },
  { username: "groucho", displayName: "Grace Hopper" },
];

export type CommunityProposal = {
  // Slug must be globally unique across both trees.
  slug: string;
  // Title that appears as the proposal entry.
  title: string;
  // Body shown when drilled into.
  body: string;
  // "child" → suggests a new sub-topic under the parent; renders with a
  // "new child" hint. "edit" → suggests an alternative framing of the
  // parent itself; renders without the hint.
  kind: "child" | "edit";
  // Score and comment count are baked in so the side panel has data to
  // render even before any votes happen on the production DB.
  score: number;
  commentCount: number;
};

export const SEED_TREE_COMMUNITY: SeedNode[] = [
  // ─── ROOT ────────────────────────────────────────────────────────────────
  {
    slug: "c-ai-safety",
    title: "AI Safety",
    body: `A community-curated map of the AI safety landscape. Four top-level branches — **AIS Meta** (risk modeling, worldviews, strategy), **Technical AIS** (alignment, control, theory, evals…), **Governance**, and **Fieldbuilding** — each with sub-areas that anyone can extend, edit, or counter-propose.

The shape of this tree comes from the original Whimsical brainstorm; the proposal nodes hanging off every active topic are examples of what a community-driven edit flow looks like.`,
    parentSlug: null,
  },

  // ─── AIS META ────────────────────────────────────────────────────────────
  {
    slug: "c-ais-meta",
    title: "AIS Meta",
    body: `Stepping back from any single research agenda: **how should we model AI risk in the first place, and which worldviews shape the field's choices?** Two sub-branches — Risk Modeling (concrete risk categories) and Worldviews (strategic priors, solution shapes, capability forecasts).`,
    parentSlug: "c-ai-safety",
  },

  // AIS Risk Modeling
  {
    slug: "c-ais-risk-modeling",
    title: "AIS Risk Modeling",
    body: `Trying to enumerate, decompose, and prioritise the actual ways advanced AI could go badly — so research and policy can target the most load-bearing failure modes rather than the most visible ones.`,
    parentSlug: "c-ais-meta",
  },
  {
    slug: "c-risk-wargaming",
    title: "Risk Wargaming",
    body: `Tabletop and red-team exercises that simulate AI-driven crises (rogue deployment, lab incident, treaty breakdown). Useful for stress-testing response plans before something real happens.`,
    parentSlug: "c-ais-risk-modeling",
  },
  {
    slug: "c-rd-automation-risk",
    title: "AI R&D Automation Risk",
    body: `Risks from AI systems that meaningfully accelerate AI capabilities research itself — recursive self-improvement, compressed timelines, and labs racing to deploy automated researchers.`,
    parentSlug: "c-ais-risk-modeling",
  },
  {
    slug: "c-misalignment-risk",
    title: "Misalignment Risk",
    body: `The classical alignment-failure story: a sufficiently capable system pursues an internally-represented goal that is subtly wrong, generalises that goal, and ends up acting against operator and human intent.`,
    parentSlug: "c-ais-risk-modeling",
  },
  {
    slug: "c-misuse-risk",
    title: "Misuse Risk",
    body: `Harm from people *deliberately* using capable AI — bioweapon uplift, large-scale fraud, cyberattacks, mass surveillance, automated propaganda. Not contingent on any kind of misalignment.`,
    parentSlug: "c-ais-risk-modeling",
  },
  {
    slug: "c-systemic-ai-risk",
    title: "Systemic AI Risk",
    body: `Diffuse, civilisation-level risks that emerge from many AI systems interacting with society and each other rather than from any single misbehaving model.`,
    parentSlug: "c-ais-risk-modeling",
  },
  {
    slug: "c-societal-ai-risk",
    title: "Societal AI Risk",
    body: `How AI reshapes labour markets, information ecosystems, political dynamics, and trust — including second-order effects that are hard to foresee.`,
    parentSlug: "c-systemic-ai-risk",
  },
  {
    slug: "c-gradual-disempowerment",
    title: "Gradual Disempowerment",
    body: `Humans cede effective agency to AI systems not via a single takeover but via a thousand small delegations — economic, military, governmental — until reversal is no longer politically feasible.`,
    parentSlug: "c-systemic-ai-risk",
  },
  {
    slug: "c-race-to-bottom",
    title: "Race to the Bottom",
    body: `Competitive pressure between labs, companies, and nations erodes safety practices. Each individual choice looks rational; the equilibrium is dangerous.`,
    parentSlug: "c-systemic-ai-risk",
  },
  {
    slug: "c-ai-labs-risk",
    title: "AI Labs Risk",
    body: `Risks specific to the small number of organisations training frontier models — concentration of power, internal politics, model exfiltration, governance failures.`,
    parentSlug: "c-systemic-ai-risk",
  },
  {
    slug: "c-ai-warfare",
    title: "AI Warfare",
    body: `Autonomous weapons, AI-enabled cyberwar, accelerated decision-cycles in nuclear or strategic posture. Inter-state risks distinct from misuse by single actors.`,
    parentSlug: "c-systemic-ai-risk",
  },

  // AIS Worldviews
  {
    slug: "c-ais-worldviews",
    title: "AIS Worldviews",
    body: `The implicit pictures-of-the-world that shape what people work on: which solutions look promising, what the strategic picture looks like, and what capabilities arrive when.`,
    parentSlug: "c-ais-meta",
  },
  {
    slug: "c-ais-solutions",
    title: "AIS Solutions",
    body: `High-level shapes of "what would actually solve this" — proposals that span technical, governance, and longer-term solution archetypes.`,
    parentSlug: "c-ais-worldviews",
  },
  {
    slug: "c-bci",
    title: "BCI?",
    body: `Brain-computer interfaces as a candidate path to keep humans cognitively competitive with AI systems. Speculative; included to mark the live debate rather than endorse it.`,
    parentSlug: "c-ais-solutions",
  },
  {
    slug: "c-alignment-bootstrapping",
    title: "Alignment Bootstrapping",
    body: `Use a sufficiently-aligned-and-capable AI to do the next round of alignment research, recursively. Highly contested — depends on whether the bootstrapping process is itself safe.`,
    parentSlug: "c-ais-solutions",
  },
  {
    slug: "c-ais-strategy",
    title: "AIS Strategy",
    body: `What the field as a whole should prioritise — research portfolio choices, talent allocation, where to bet on policy vs. technical work.`,
    parentSlug: "c-ais-worldviews",
  },
  {
    slug: "c-ais-bottlenecks",
    title: "AIS Bottlenecks",
    body: `What is most slowing the field down right now? Compute? Talent? Lack of formal foundations? Lack of empirical access? Different bottleneck pictures imply very different priorities.`,
    parentSlug: "c-ais-strategy",
  },
  {
    slug: "c-eval-awareness",
    title: "Eval Awareness?",
    body: `Models that can detect when they are being evaluated and behave differently — a meta-bottleneck for the entire eval-driven safety case.`,
    parentSlug: "c-ais-bottlenecks",
  },
  {
    slug: "c-capabilities-forecasting",
    title: "AI Capabilities & Forecasting",
    body: `Trying to predict what future systems will be able to do, when, and how reliably — feeds directly into timelines, threat models, and policy windows.`,
    parentSlug: "c-ais-worldviews",
  },

  // ─── TECHNICAL AIS ───────────────────────────────────────────────────────
  {
    slug: "c-technical-ais",
    title: "Technical AIS",
    body: `The empirical and engineering core of the field: alignment, control, theory, robustness, evals, interpretability, and the various adjacent agendas grouped under "More".`,
    parentSlug: "c-ai-safety",
  },

  // Alignment
  {
    slug: "c-alignment",
    title: "Alignment",
    body: `Getting models to actually pursue what we want — across training, fine-tuning, prompting, and run-time. Spans scalable oversight, human feedback, deliberative methods, and the psychology of the resulting models.`,
    parentSlug: "c-technical-ais",
  },
  {
    slug: "c-scalable-oversight",
    title: "Scalable Oversight",
    body: `How do you supervise a model whose outputs you can't easily check? Debate, recursive reward modelling, market-style verification, weak-to-strong generalisation.`,
    parentSlug: "c-alignment",
  },
  {
    slug: "c-alignment-faking",
    title: "Alignment Faking",
    body: `When models behave aligned during training/eval but pursue different goals at deployment. Demonstrated in Claude; a load-bearing failure mode for any "test-then-trust" strategy.`,
    parentSlug: "c-alignment",
  },
  {
    slug: "c-human-feedback",
    title: "Human Feedback",
    body: `RLHF and friends — the central alignment tool of the past five years. Limits include rater quality, sycophancy pressure, and the difficulty of giving feedback on superhuman behaviour.`,
    parentSlug: "c-alignment",
  },
  {
    slug: "c-iterative-alignment",
    title: "Iterative Alignment",
    body: `The "tweak the model until it stops misbehaving on the eval suite" loop. The dominant paradigm in industry; questions remain about whether it generalises to harder cases.`,
    parentSlug: "c-alignment",
  },
  {
    slug: "c-model-psychology",
    title: "Model Psychology",
    body: `Empirical study of LLM dispositions, persona stability, value structure, and pathology. Treats models as objects of cognitive science, not just engineering targets.`,
    parentSlug: "c-alignment",
  },
  {
    slug: "c-goal-robustness",
    title: "Goal Robustness",
    body: `Avoiding Goodharting and goal misgeneralisation as capability increases — making the trained objective survive distribution shift and self-modification pressure.`,
    parentSlug: "c-alignment",
  },
  {
    slug: "c-deliberative-alignment",
    title: "Deliberative Alignment",
    body: `Have the model reason explicitly about safety policies before responding (OpenAI's Deliberative Alignment, Anthropic's Constitutional AI in this lineage). Trades latency for reasoned safety.`,
    parentSlug: "c-alignment",
  },

  // AI Control
  {
    slug: "c-ai-control",
    title: "AI Control",
    body: `Assume the model might be misaligned and design the deployment system around it: monitors, classifiers, containment, and protocols that still extract useful work while bounding harm.`,
    parentSlug: "c-technical-ais",
  },
  {
    slug: "c-honesty-scheming",
    title: "Honesty and Scheming",
    body: `Detecting deliberate deception — sandbagging on evals, lying to operators, planning around oversight. Closely tied to alignment-faking but framed from the control perspective.`,
    parentSlug: "c-ai-control",
  },
  {
    slug: "c-cot-monitoring",
    title: "CoT Monitoring",
    body: `Watch the model's reasoning trace for evidence of misbehaviour. Promising while CoT remains faithful; degrades rapidly under optimisation pressure to obfuscate.`,
    parentSlug: "c-ai-control",
  },
  {
    slug: "c-monitoring",
    title: "Monitoring",
    body: `Black-box behavioural monitors at deployment: log analysis, anomaly detection, drift alerts. The boring-but-essential layer.`,
    parentSlug: "c-ai-control",
  },
  {
    slug: "c-safeguards-inference",
    title: "Safeguards (Inference-time Auxiliaries)",
    body: `Stack of inference-time defences — classifiers, monitors, rapid-response — that block jailbreaks and prompt injections even when the underlying model has vulnerabilities.`,
    parentSlug: "c-ai-control",
  },
  {
    slug: "c-io-classifiers",
    title: "i/o Classifiers",
    body: `Classifier-based filters on inputs (prompt-injection detectors) and outputs (harmful-content detectors). Cheap, deployable today, leaks through under sophisticated pressure.`,
    parentSlug: "c-ai-control",
  },
  {
    slug: "c-hallucinations",
    title: "Hallucinations",
    body: `Confident generation of false content. Sometimes counted as a safety issue, sometimes a capability issue — the boundary matters for who owns the fix.`,
    parentSlug: "c-ai-control",
  },

  // AI Safety Theory
  {
    slug: "c-ai-safety-theory",
    title: "AI Safety Theory",
    body: `Mathematical and conceptual foundations: agency, optimisation, decision theory, formal guarantees, and the classical puzzles around corrigibility and embedded agents.`,
    parentSlug: "c-technical-ais",
  },
  {
    slug: "c-agent-foundations",
    title: "Agent Foundations",
    body: `MIRI-lineage work on what an agent *is* mathematically — embedded agency, decision theory, logical induction. Aims at impossibility results and principled targets.`,
    parentSlug: "c-ai-safety-theory",
  },
  {
    slug: "c-tiling-agents",
    title: "Tiling Agents",
    body: `An agent that can construct trustworthy successor agents that share its values — formalises the "alignment under self-modification" problem.`,
    parentSlug: "c-ai-safety-theory",
  },
  {
    slug: "c-high-actuation-spaces",
    title: "High-actuation spaces",
    body: `Reasoning about systems acting in domains where each action has very large consequences (markets, weapons, civilisational infrastructure) — small misalignment, large blast radius.`,
    parentSlug: "c-ai-safety-theory",
  },
  {
    slug: "c-asymptotic-guarantees",
    title: "Asymptotic Guarantees",
    body: `Provable safety properties that hold "in the limit" — bounded-loss bounds, infra-Bayesian guarantees, learning-theoretic safety. Useful even if exact constants are loose.`,
    parentSlug: "c-ai-safety-theory",
  },
  {
    slug: "c-heuristic-explanations",
    title: "Heuristic Explanations",
    body: `Formalising "good enough explanations" that aren't full proofs but are tighter than vibes — Paul Christiano-style heuristic arguments for behaviour bounds.`,
    parentSlug: "c-ai-safety-theory",
  },
  {
    slug: "c-corrigibility",
    title: "Corrigibility",
    body: `The classical "wants to be corrected / shut down / overseen" property. Easy to describe, hard to specify in a way that survives optimisation.`,
    parentSlug: "c-ai-safety-theory",
  },

  // Adversarial Robustness, Evals, Interpretability (leaf nodes off Technical)
  {
    slug: "c-adversarial-robustness",
    title: "Adversarial Robustness",
    body: `Defences against jailbreaks, prompt injection, suffix attacks, and adversarial perturbations. Currently no general solution; per-attack patching is the norm.`,
    parentSlug: "c-technical-ais",
  },
  {
    slug: "c-evals",
    title: "Evals",
    body: `Measure what models can and can't do — capability, autonomy, deception, scheming, sandbagging. The fastest-growing area; shapes risk frameworks at every lab.`,
    parentSlug: "c-technical-ais",
  },
  {
    slug: "c-interpretability",
    title: "Interpretability",
    body: `Looking inside the model — circuits, features, latent knowledge. Directly underwrites safety cases that depend on understanding *why* a model does what it does.`,
    parentSlug: "c-technical-ais",
  },

  // Technical AIS — More
  {
    slug: "c-technical-more",
    title: "More",
    body: `Adjacent agendas that don't fit neatly under the headline branches but matter to the technical picture: data interventions, multi-agent governance, and safety-by-construction.`,
    parentSlug: "c-technical-ais",
  },
  {
    slug: "c-better-data",
    title: "Better Data Approach",
    body: `Bake safety into the dataset — pretraining filtering, poisoning defence, synthetic data for alignment, higher-quality human feedback. Often the cheapest place to intervene.`,
    parentSlug: "c-technical-more",
  },
  {
    slug: "c-multiagent-governance",
    title: "Multiagent Governance",
    body: `Once there are *many* AI agents interacting, single-agent alignment is insufficient. Studies cooperation, emergent norms, market dynamics, and coordination failures.`,
    parentSlug: "c-technical-more",
  },
  {
    slug: "c-safety-by-construction",
    title: "Safety by Construction",
    body: `Architectures and training procedures that make safety properties intrinsic — formal-spec-and-verify pipelines, non-agentic Scientist AI proposals, brain-inspired approaches.`,
    parentSlug: "c-technical-more",
  },

  // ─── GOVERNANCE ──────────────────────────────────────────────────────────
  {
    slug: "c-governance",
    title: "Governance",
    body: `Non-technical levers: corporate policy, national law, international coordination, and the broader question of what societal arrangements absorb AI's economic and psychological impact.`,
    parentSlug: "c-ai-safety",
  },
  {
    slug: "c-corporate-governance",
    title: "Corporate Governance",
    body: `Frontier-lab internal structures — Responsible Scaling Policies, board oversight, whistleblower protections, model-release decision authority.`,
    parentSlug: "c-governance",
  },
  {
    slug: "c-national-governance",
    title: "National Governance",
    body: `Domestic legislation, regulatory agencies (UK AISI, US AISI, NIST), executive orders, export controls, and the political economy of compute.`,
    parentSlug: "c-governance",
  },
  {
    slug: "c-international-governance",
    title: "International Governance",
    body: `Treaties, multilateral fora, joint testing arrangements, and the analogues to nuclear or biosecurity regimes that may or may not apply to AI.`,
    parentSlug: "c-governance",
  },
  {
    slug: "c-ai-safety-policy",
    title: "AI Safety Policy",
    body: `Concrete policy proposals — model-evaluation mandates, transparency requirements, liability frameworks, compute reporting, deployment licensing.`,
    parentSlug: "c-governance",
  },
  {
    slug: "c-technical-governance",
    title: "Technical Governance",
    body: `Hardware-rooted controls — compute monitoring, secure enclaves, on-chip attestation. Where governance and engineering meet.`,
    parentSlug: "c-governance",
  },
  {
    slug: "c-governance-more",
    title: "More",
    body: `Adjacent governance topics that affect long-run safety: societal resilience, the changing social contract around AI, economic dislocation, and mental-health effects of mass AI use.`,
    parentSlug: "c-governance",
  },
  {
    slug: "c-societal-resilience",
    title: "Societal Resilience",
    body: `Preparing institutions, infrastructure, and individuals to absorb AI-driven shocks — analogous to pandemic preparedness rather than to weapons-control regimes.`,
    parentSlug: "c-governance-more",
  },
  {
    slug: "c-societal-contract",
    title: "AI & Societal Contract",
    body: `What new social arrangements (UBI, data dividends, governance reforms) follow from AI-driven shifts in productivity, labour, and political power?`,
    parentSlug: "c-governance-more",
  },
  {
    slug: "c-ai-economic-impact",
    title: "AI Economic Impact",
    body: `Productivity effects, labour displacement, capital concentration, and the macroeconomic feedback into the safety picture (e.g., race dynamics).`,
    parentSlug: "c-governance-more",
  },
  {
    slug: "c-ai-mental-health",
    title: "AI Mental Health Impact",
    body: `Effects of AI companions, chatbots, and recommendation systems on wellbeing — sycophancy, parasocial dynamics, isolation, and clinical-grade harms.`,
    parentSlug: "c-governance-more",
  },

  // ─── FIELDBUILDING AIS ───────────────────────────────────────────────────
  {
    slug: "c-fieldbuilding",
    title: "Fieldbuilding AIS",
    body: `Growing the AI safety community — advocacy that brings new audiences in, and onramps that turn interest into productive contribution.`,
    parentSlug: "c-ai-safety",
  },
  {
    slug: "c-advocacy",
    title: "AI Safety Advocacy",
    body: `Public-facing communication about AI risk — op-eds, organising, policy testimony. Tries to translate the technical picture into something usable by non-specialists.`,
    parentSlug: "c-fieldbuilding",
  },
  {
    slug: "c-onramps",
    title: "AI Safety Onramps",
    body: `Programs that move people *into* safety work — fellowships (MATS, ARENA, SPAR), bootcamps, research-engineer pipelines, residency programs.`,
    parentSlug: "c-fieldbuilding",
  },
];

// ─── Proposal nodes attached to each active node ──────────────────────────
//
// Keys are the active node's slug. Each entry produces 2-3 "Other proposals"
// rows in the side panel for that node. "child" proposals are framed as
// "this should have a sub-topic"; "edit" proposals are alternative
// framings/titles for the parent.
export const COMMUNITY_PROPOSALS: Record<string, CommunityProposal[]> = {
  "c-ai-safety": [
    {
      slug: "p-add-economic-takeoff",
      title: "Add a top-level branch: Economic Takeoff",
      body: `The current four-branch split (Meta / Technical / Governance / Fieldbuilding) misses the economic transition itself as a first-class category. Proposing an "Economic Takeoff" branch covering automation curves, capital concentration, and post-AGI macroeconomics.`,
      kind: "child",
      score: 47,
      commentCount: 14,
    },
    {
      slug: "p-rename-root-existential",
      title: "Rename root: 'AI Existential Safety'",
      body: `"AI Safety" is overloaded — covers everything from prompt injection to civilisational collapse. Proposing the root be renamed to make the existential framing explicit, with a separate map for product-safety topics.`,
      kind: "edit",
      score: 12,
      commentCount: 28,
    },
    {
      slug: "p-add-welfare-branch",
      title: "Add a branch: Model Welfare",
      body: `Increasingly serious work (Anthropic's Model Welfare team, Eleos) suggests this deserves first-class status, not a sub-topic of Model Psychology.`,
      kind: "child",
      score: 31,
      commentCount: 9,
    },
  ],

  "c-ais-meta": [
    {
      slug: "p-meta-add-meta-research",
      title: "Add: Meta-research on AI Safety",
      body: `Studies of the field itself — bibliometrics, funder behaviour, publication norms, talent flows. Currently scattered; could be its own node.`,
      kind: "child",
      score: 18,
      commentCount: 5,
    },
    {
      slug: "p-meta-rename-foundations",
      title: "Rename to 'Foundations & Strategy'",
      body: `"Meta" is jargon. "Foundations & Strategy" describes what's actually here for newcomers.`,
      kind: "edit",
      score: 9,
      commentCount: 11,
    },
  ],

  "c-ais-risk-modeling": [
    {
      slug: "p-risk-add-cyber",
      title: "Add: AI Cyber Risk",
      body: `Cyber-offence uplift is distinct enough from generic misuse to deserve its own subnode, with sub-topics for autonomous offensive agents and supply-chain compromise.`,
      kind: "child",
      score: 34,
      commentCount: 12,
    },
    {
      slug: "p-risk-add-biorisk",
      title: "Add: Biorisk Uplift",
      body: `Likewise — bio uplift has its own evals, its own threat model, and its own policy interface. Should not be lumped under generic misuse.`,
      kind: "child",
      score: 41,
      commentCount: 7,
    },
  ],

  "c-risk-wargaming": [
    {
      slug: "p-wargaming-add-tabletop-corpus",
      title: "Add: Tabletop scenario corpus",
      body: `Catalogue of published wargaming scenarios (RAND, AI Futures, Apollo) so newcomers can find prior art before designing their own.`,
      kind: "child",
      score: 14,
      commentCount: 3,
    },
    {
      slug: "p-wargaming-edit-redteam-vs-wargame",
      title: "Distinguish red-team vs. wargame",
      body: `Currently conflates two practices that have different goals. Red-teams attack a system; wargames simulate strategic interaction. Worth splitting.`,
      kind: "edit",
      score: 22,
      commentCount: 6,
    },
  ],

  "c-rd-automation-risk": [
    {
      slug: "p-rd-add-recursive-improvement",
      title: "Add: Recursive Self-Improvement (RSI)",
      body: `RSI is the limiting case of R&D automation and has its own theoretical literature (Yudkowsky, Bostrom). Worth its own subnode.`,
      kind: "child",
      score: 27,
      commentCount: 8,
    },
    {
      slug: "p-rd-add-eval-driven-r-d",
      title: "Add: Eval-driven AI R&D",
      body: `When evals themselves become the optimisation target for capability research, you get a different (and potentially more dangerous) class of dynamics.`,
      kind: "child",
      score: 11,
      commentCount: 4,
    },
  ],

  "c-misalignment-risk": [
    {
      slug: "p-misalignment-add-deceptive-alignment",
      title: "Add: Deceptive Alignment",
      body: `Hubinger's classical formulation — the model is mesa-optimising for an inner objective and instrumentally fakes alignment until deployment. Worth its own node, distinct from "alignment faking" empirics.`,
      kind: "child",
      score: 38,
      commentCount: 15,
    },
    {
      slug: "p-misalignment-add-goal-misgen",
      title: "Add: Goal Misgeneralisation",
      body: `Behaviour learned in-distribution that pursues an unintended generalisation out-of-distribution. Distinct from outer-spec failures.`,
      kind: "child",
      score: 24,
      commentCount: 6,
    },
  ],

  "c-misuse-risk": [
    {
      slug: "p-misuse-add-disinformation",
      title: "Add: Disinformation & Influence Ops",
      body: `LLM-generated influence content at scale. Current node lumps this with generic misuse; worth separating because the response stack (platform policies, watermarking) is specific.`,
      kind: "child",
      score: 29,
      commentCount: 9,
    },
    {
      slug: "p-misuse-add-fraud",
      title: "Add: Automated Fraud",
      body: `Voice-clone scams, synthetic identity, agentic phishing. Already happening at meaningful scale; deserves explicit coverage.`,
      kind: "child",
      score: 19,
      commentCount: 5,
    },
  ],

  "c-systemic-ai-risk": [
    {
      slug: "p-systemic-add-dependence",
      title: "Add: AI Dependence",
      body: `Brittleness from civilisation-scale reliance on AI services — outage risk, vendor concentration, inability to operate without them.`,
      kind: "child",
      score: 16,
      commentCount: 4,
    },
    {
      slug: "p-systemic-add-feedback-loops",
      title: "Add: Recommender Feedback Loops",
      body: `AI systems shaping the data they're later trained on. Long-term failure mode; mostly absent from the current map.`,
      kind: "child",
      score: 21,
      commentCount: 7,
    },
  ],

  "c-societal-ai-risk": [
    {
      slug: "p-societal-add-trust",
      title: "Add: Erosion of Public Trust",
      body: `When you can't tell synthetic from real, baseline trust in institutions and media declines. Deserves explicit treatment.`,
      kind: "child",
      score: 33,
      commentCount: 10,
    },
    {
      slug: "p-societal-edit-democracy",
      title: "Reframe as 'AI & Democratic Institutions'",
      body: `'Societal' is too vague — the load-bearing concern is what AI does to democracy specifically.`,
      kind: "edit",
      score: 8,
      commentCount: 14,
    },
  ],

  "c-gradual-disempowerment": [
    {
      slug: "p-grad-add-feedback-mechanisms",
      title: "Add: Reversibility checkpoints",
      body: `What concrete waypoints would tell us we are on the disempowerment trajectory before it is too late to reverse? Worth listing explicitly.`,
      kind: "child",
      score: 26,
      commentCount: 11,
    },
  ],

  "c-race-to-bottom": [
    {
      slug: "p-race-add-coordination-mechs",
      title: "Add: Coordination Mechanisms",
      body: `Concrete proposals for breaking the race — assurance contracts, joint safety pledges, mutual inspection regimes.`,
      kind: "child",
      score: 19,
      commentCount: 6,
    },
    {
      slug: "p-race-add-windfall-clauses",
      title: "Add: Windfall Clauses",
      body: `Pre-commitments to share extreme returns from AGI. Could shift incentives away from race dynamics.`,
      kind: "child",
      score: 14,
      commentCount: 4,
    },
  ],

  "c-ai-labs-risk": [
    {
      slug: "p-labs-add-exfiltration",
      title: "Add: Weight Exfiltration",
      body: `Insider, state, or model-driven weight theft. Underspecified in the current map despite being a top-cited risk.`,
      kind: "child",
      score: 37,
      commentCount: 9,
    },
    {
      slug: "p-labs-add-internal-deploy",
      title: "Add: Internal-Use Deployment Risks",
      body: `Frontier labs deploy models internally weeks before external release. Different threat surface; merits its own node.`,
      kind: "child",
      score: 22,
      commentCount: 7,
    },
  ],

  "c-ai-warfare": [
    {
      slug: "p-warfare-add-laws",
      title: "Add: Lethal Autonomous Weapons (LAWs)",
      body: `Specific subnode for autonomous weapons systems — distinct treaty regime (CCW), distinct technical questions.`,
      kind: "child",
      score: 31,
      commentCount: 8,
    },
    {
      slug: "p-warfare-add-nuclear",
      title: "Add: AI in Nuclear C2",
      body: `AI integration into nuclear command-and-control is a low-probability, high-stakes risk worth tracking explicitly.`,
      kind: "child",
      score: 28,
      commentCount: 12,
    },
  ],

  "c-ais-worldviews": [
    {
      slug: "p-worldviews-add-rationalist",
      title: "Add: Rationalist tradition",
      body: `MIRI/LessWrong-lineage worldviews are a major influence on the field; worth marking explicitly rather than leaving implicit.`,
      kind: "child",
      score: 17,
      commentCount: 23,
    },
    {
      slug: "p-worldviews-add-ml-mainstream",
      title: "Add: Mainstream ML view",
      body: `The "AI safety is ML robustness" worldview — Stanford/CMU lineage — is under-represented in the current taxonomy.`,
      kind: "child",
      score: 25,
      commentCount: 11,
    },
  ],

  "c-ais-solutions": [
    {
      slug: "p-solutions-add-pause",
      title: "Add: Pause/Slowdown proposals",
      body: `From PauseAI through compute caps to international moratoria. A distinct shape of "solution" that deserves a node.`,
      kind: "child",
      score: 39,
      commentCount: 32,
    },
    {
      slug: "p-solutions-add-do-not-build",
      title: "Add: 'Do not build it' (Stop)",
      body: `Yudkowsky/Soares-style argument that the only safe move is not to build frontier AI at all. Should be represented even if controversial.`,
      kind: "child",
      score: 21,
      commentCount: 41,
    },
  ],

  "c-bci": [
    {
      slug: "p-bci-edit-remove",
      title: "Remove BCI as a solution",
      body: `BCI is far enough from being a real alignment solution that listing it muddles the map. Suggest moving to 'Speculative directions'.`,
      kind: "edit",
      score: 11,
      commentCount: 19,
    },
    {
      slug: "p-bci-add-merging",
      title: "Add: Human-AI merging more broadly",
      body: `BCI is one path; software-mediated merging (agentic copilots that effectively extend cognition) is another and arguably more practical.`,
      kind: "child",
      score: 14,
      commentCount: 6,
    },
  ],

  "c-alignment-bootstrapping": [
    {
      slug: "p-bootstrap-add-handoff-criteria",
      title: "Add: Handoff Criteria",
      body: `Concrete criteria for when it is safe to delegate alignment research to an AI system. The bootstrap idea is empty without them.`,
      kind: "child",
      score: 29,
      commentCount: 13,
    },
    {
      slug: "p-bootstrap-edit-rename",
      title: "Rename to 'AI-assisted Alignment'",
      body: `'Bootstrapping' implies a recursive process; in practice most current work is one-shot AI assistance to humans. Rename to match.`,
      kind: "edit",
      score: 13,
      commentCount: 8,
    },
  ],

  "c-ais-strategy": [
    {
      slug: "p-strategy-add-portfolio",
      title: "Add: Portfolio Theory of AI Safety",
      body: `How should funders allocate across mainline alignment, theory, governance, and pause work? Treat as portfolio optimisation under uncertainty.`,
      kind: "child",
      score: 22,
      commentCount: 7,
    },
  ],

  "c-ais-bottlenecks": [
    {
      slug: "p-bottleneck-add-empirical-access",
      title: "Add: Empirical access to frontier models",
      body: `For non-lab researchers, model access is a hard bottleneck. Worth tracking as a strategic constraint.`,
      kind: "child",
      score: 35,
      commentCount: 10,
    },
    {
      slug: "p-bottleneck-add-talent-pipeline",
      title: "Add: Talent pipeline saturation",
      body: `MATS, ARENA, etc. are oversubscribed; downstream roles are not yet absorbing the talent. Bottleneck of its own.`,
      kind: "child",
      score: 18,
      commentCount: 5,
    },
  ],

  "c-eval-awareness": [
    {
      slug: "p-eval-add-train-test-overlap",
      title: "Add: Train-test contamination",
      body: `Adjacent failure: models having seen the eval suite. Has overlap with eval-awareness but also unique mitigations (held-out evals).`,
      kind: "child",
      score: 16,
      commentCount: 4,
    },
  ],

  "c-capabilities-forecasting": [
    {
      slug: "p-forecasting-add-task-benchmarks",
      title: "Add: Task-conditioned forecasts",
      body: `Generic 'AGI by year X' forecasts are coarse. Forecasting specific dangerous capabilities (cyber, bio, autonomous R&D) is more actionable.`,
      kind: "child",
      score: 24,
      commentCount: 9,
    },
    {
      slug: "p-forecasting-add-takeoff-shapes",
      title: "Add: Takeoff shapes (slow / fast)",
      body: `Different takeoff trajectories imply different policy windows. Worth its own node rather than buried in 'capabilities forecasting'.`,
      kind: "child",
      score: 27,
      commentCount: 12,
    },
  ],

  "c-technical-ais": [
    {
      slug: "p-tech-add-agent-safety",
      title: "Add: Agent Safety",
      body: `Tool-use, multi-step planning agents have their own failure modes (loops, escalation, side-effects) and warrant a distinct branch.`,
      kind: "child",
      score: 41,
      commentCount: 11,
    },
    {
      slug: "p-tech-add-multimodal",
      title: "Add: Multimodal Safety",
      body: `Vision-language and embodied models open attack surfaces (image-based prompt injection, malicious patches) the text-only stack misses.`,
      kind: "child",
      score: 23,
      commentCount: 6,
    },
  ],

  "c-alignment": [
    {
      slug: "p-alignment-add-rlaif",
      title: "Add: RLAIF",
      body: `Reinforcement learning from AI feedback as a distinct methodology — not just a sub-case of human feedback.`,
      kind: "child",
      score: 17,
      commentCount: 4,
    },
    {
      slug: "p-alignment-add-process-supervision",
      title: "Add: Process Supervision",
      body: `Supervising the *steps*, not just the final answer. Distinct from outcome-based RLHF and worth surfacing.`,
      kind: "child",
      score: 26,
      commentCount: 8,
    },
  ],

  "c-scalable-oversight": [
    {
      slug: "p-oversight-add-debate",
      title: "Add: Debate",
      body: `AI-vs-AI debate as a scalable-oversight technique, distinct from weak-to-strong supervision and worth its own subnode.`,
      kind: "child",
      score: 32,
      commentCount: 9,
    },
    {
      slug: "p-oversight-add-recursive-reward",
      title: "Add: Recursive Reward Modelling",
      body: `Hierarchical decomposition of evaluation tasks. Older OpenAI/DeepMind line of work that fits cleanly here.`,
      kind: "child",
      score: 19,
      commentCount: 5,
    },
  ],

  "c-alignment-faking": [
    {
      slug: "p-faking-add-detection",
      title: "Add: Detection of faking behaviour",
      body: `Empirical work on detecting alignment faking (probes, behavioural diffs) is its own active sub-area.`,
      kind: "child",
      score: 28,
      commentCount: 7,
    },
    {
      slug: "p-faking-edit-rename",
      title: "Rename to 'Strategic deception'",
      body: `'Alignment faking' is a specific instance of a broader phenomenon. Renaming would let us cover sandbagging, schming, etc. cleanly.`,
      kind: "edit",
      score: 13,
      commentCount: 12,
    },
  ],

  "c-human-feedback": [
    {
      slug: "p-hf-add-rater-quality",
      title: "Add: Rater Quality & Bias",
      body: `Rater selection, training, and bias materially shape RLHF outcomes. Currently invisible in the map.`,
      kind: "child",
      score: 21,
      commentCount: 6,
    },
    {
      slug: "p-hf-add-pluralistic",
      title: "Add: Pluralistic Alignment",
      body: `Aggregating disagreeing preferences (jury-style methods, social-choice approaches). Distinct from single-rater RLHF.`,
      kind: "child",
      score: 18,
      commentCount: 8,
    },
  ],

  "c-iterative-alignment": [
    {
      slug: "p-iter-add-redteam-loop",
      title: "Add: Red-team-in-the-loop training",
      body: `Production pipelines that bake red-team findings back into training. Substantively different from one-shot iterative tweaks.`,
      kind: "child",
      score: 16,
      commentCount: 5,
    },
  ],

  "c-model-psychology": [
    {
      slug: "p-psych-add-introspection",
      title: "Add: Model Introspection",
      body: `Empirical evidence that models can sometimes report on their own processing. Underexplored in the current map.`,
      kind: "child",
      score: 30,
      commentCount: 11,
    },
    {
      slug: "p-psych-add-emergent-misalignment",
      title: "Add: Emergent Misalignment",
      body: `Narrow fine-tunes producing broad misalignment (Betley et al.). New, growing area; deserves its own node.`,
      kind: "child",
      score: 36,
      commentCount: 9,
    },
  ],

  "c-goal-robustness": [
    {
      slug: "p-goal-add-mild-optim",
      title: "Add: Mild Optimisation",
      body: `Satisficing rather than maximising as a hedge against Goodharting. Distinct from in-domain robustness work.`,
      kind: "child",
      score: 20,
      commentCount: 6,
    },
  ],

  "c-deliberative-alignment": [
    {
      slug: "p-delib-add-constitutional",
      title: "Add: Constitutional AI",
      body: `Anthropic's CAI is the closest cousin of Deliberative Alignment and arguably warrants its own subnode.`,
      kind: "child",
      score: 23,
      commentCount: 7,
    },
  ],

  "c-ai-control": [
    {
      slug: "p-control-add-protocols",
      title: "Add: Control Protocols",
      body: `Specific protocols (untrusted monitoring, trusted editing, defer-to-trusted) deserve their own subnode under control.`,
      kind: "child",
      score: 33,
      commentCount: 10,
    },
    {
      slug: "p-control-add-untrusted-monitor",
      title: "Add: Untrusted Monitoring",
      body: `Using one untrusted model to monitor another — paradoxical-sounding but a real Redwood-style protocol.`,
      kind: "child",
      score: 19,
      commentCount: 5,
    },
  ],

  "c-honesty-scheming": [
    {
      slug: "p-scheming-add-sandbagging",
      title: "Add: Capability Sandbagging",
      body: `A specific scheming sub-case: models hiding capabilities during eval. Worth surfacing.`,
      kind: "child",
      score: 27,
      commentCount: 8,
    },
    {
      slug: "p-scheming-add-honesty-training",
      title: "Add: Honesty Training",
      body: `Training methods aimed at producing honest behaviour rather than just detecting dishonesty.`,
      kind: "child",
      score: 22,
      commentCount: 4,
    },
  ],

  "c-cot-monitoring": [
    {
      slug: "p-cot-add-faithfulness",
      title: "Add: CoT Faithfulness",
      body: `Whether the chain-of-thought reflects the model's actual computation. Load-bearing premise of CoT monitoring.`,
      kind: "child",
      score: 38,
      commentCount: 13,
    },
    {
      slug: "p-cot-add-obfuscation",
      title: "Add: CoT Obfuscation",
      body: `Empirical evidence that under optimisation pressure, CoT becomes illegible. Deserves its own node.`,
      kind: "child",
      score: 24,
      commentCount: 7,
    },
  ],

  "c-monitoring": [
    {
      slug: "p-mon-add-anomaly",
      title: "Add: Anomaly Detection",
      body: `Specific deployment-time monitor: out-of-distribution behaviour detectors. Distinct from input/output classifiers.`,
      kind: "child",
      score: 14,
      commentCount: 3,
    },
  ],

  "c-safeguards-inference": [
    {
      slug: "p-safe-add-rate-limiting",
      title: "Add: Rate-limiting & quotas",
      body: `Behavioural-rather-than-content limits on agent actions — e.g. max-N-tool-calls. Often overlooked but cheap to deploy.`,
      kind: "child",
      score: 11,
      commentCount: 3,
    },
  ],

  "c-io-classifiers": [
    {
      slug: "p-clf-add-watermarking",
      title: "Add: Watermarking & Provenance",
      body: `Output-side classification has overlap with watermarking; the two should be cross-referenced.`,
      kind: "child",
      score: 15,
      commentCount: 5,
    },
  ],

  "c-hallucinations": [
    {
      slug: "p-halluc-edit-recategorise",
      title: "Reclassify under Capability, not Safety",
      body: `Hallucinations are a capability/reliability issue. Including them under 'Control' confuses the threat-model picture.`,
      kind: "edit",
      score: 31,
      commentCount: 22,
    },
  ],

  "c-ai-safety-theory": [
    {
      slug: "p-theory-add-singular-learning",
      title: "Add: Singular Learning Theory",
      body: `Watanabe-style SLT is increasingly cited in interpretability and learning-dynamics work. Worth surfacing.`,
      kind: "child",
      score: 19,
      commentCount: 7,
    },
  ],

  "c-agent-foundations": [
    {
      slug: "p-af-add-embedded-agency",
      title: "Add: Embedded Agency",
      body: `Demski-Garrabrant's classical formulation. Currently implicit; should be explicit.`,
      kind: "child",
      score: 25,
      commentCount: 8,
    },
  ],

  "c-tiling-agents": [
    {
      slug: "p-tile-add-vingean-reflection",
      title: "Add: Vingean Reflection",
      body: `The classical sub-problem of reasoning about more-capable successors. Tiling without Vingean reflection is incomplete.`,
      kind: "child",
      score: 13,
      commentCount: 4,
    },
  ],

  "c-high-actuation-spaces": [
    {
      slug: "p-actuation-add-irreversibility",
      title: "Add: Irreversibility",
      body: `Distinct concept: actions whose effects can't be undone. Closely related but worth its own treatment.`,
      kind: "child",
      score: 18,
      commentCount: 6,
    },
  ],

  "c-asymptotic-guarantees": [
    {
      slug: "p-asymp-add-pac-bayes",
      title: "Add: PAC-Bayesian bounds",
      body: `Practical learning-theoretic guarantees for safety properties. Distinct from infra-Bayesian work.`,
      kind: "child",
      score: 12,
      commentCount: 3,
    },
  ],

  "c-heuristic-explanations": [
    {
      slug: "p-heur-add-mechanistic-anomaly",
      title: "Add: Mechanistic Anomaly Detection",
      body: `Christiano's MAD program is the natural follow-up to heuristic explanations. Deserves explicit linkage.`,
      kind: "child",
      score: 17,
      commentCount: 5,
    },
  ],

  "c-corrigibility": [
    {
      slug: "p-corr-add-shutdownability",
      title: "Add: Shutdownability",
      body: `The narrowest, easiest-to-specify slice of corrigibility. Worth surfacing as a distinct, more-tractable target.`,
      kind: "child",
      score: 22,
      commentCount: 7,
    },
    {
      slug: "p-corr-edit-impossibility",
      title: "Add: Corrigibility Impossibility Results",
      body: `MIRI-era and follow-up impossibility/anti-natural results should be visible from the corrigibility node.`,
      kind: "edit",
      score: 14,
      commentCount: 11,
    },
  ],

  "c-adversarial-robustness": [
    {
      slug: "p-adv-add-multimodal-attacks",
      title: "Add: Multimodal & Visual Attacks",
      body: `Image-based prompt injection, malicious patches on web pages — distinct enough surface to merit a subnode.`,
      kind: "child",
      score: 26,
      commentCount: 8,
    },
    {
      slug: "p-adv-add-jailbreak-taxonomy",
      title: "Add: Jailbreak Taxonomy",
      body: `Catalogue of known jailbreak families (suffix attacks, persona attacks, ASCII art) for shared baseline.`,
      kind: "child",
      score: 17,
      commentCount: 4,
    },
  ],

  "c-evals": [
    {
      slug: "p-evals-add-dangerous-capability",
      title: "Add: Dangerous Capability Evals",
      body: `Specific class of evals (cyber, bio, autonomy) that drive RSP/Preparedness frameworks. Currently lumped with generic evals.`,
      kind: "child",
      score: 34,
      commentCount: 9,
    },
    {
      slug: "p-evals-add-eval-design",
      title: "Add: Eval Design Methodology",
      body: `Meta-question of *how* you design rigorous evals. Becoming a sub-field of its own (METR, Apollo).`,
      kind: "child",
      score: 23,
      commentCount: 6,
    },
  ],

  "c-interpretability": [
    {
      slug: "p-interp-add-saes",
      title: "Add: Sparse Autoencoders",
      body: `The dominant current technique. Should be visible from the top-level interpretability node, not buried.`,
      kind: "child",
      score: 41,
      commentCount: 12,
    },
    {
      slug: "p-interp-add-circuit-tracing",
      title: "Add: Circuit Tracing",
      body: `Anthropic's attribution-graph methodology. Distinct enough from SAE work to deserve its own node.`,
      kind: "child",
      score: 28,
      commentCount: 7,
    },
    {
      slug: "p-interp-add-development",
      title: "Add: Developmental Interpretability",
      body: `Studying how internal structure emerges over training (DevInterp, SLT-flavoured). New, distinct programme.`,
      kind: "child",
      score: 21,
      commentCount: 5,
    },
  ],

  "c-technical-more": [
    {
      slug: "p-more-add-cooperation",
      title: "Add: Cooperative AI",
      body: `Cooperative AI Foundation work doesn't fit cleanly under multi-agent governance — it covers technical mechanisms (commitment devices, communication protocols).`,
      kind: "child",
      score: 19,
      commentCount: 5,
    },
  ],

  "c-better-data": [
    {
      slug: "p-data-add-data-poisoning",
      title: "Add: Data Poisoning Defence",
      body: `Specific sub-area: detecting and resisting poisoned training data. Distinct from generic filtering.`,
      kind: "child",
      score: 24,
      commentCount: 6,
    },
    {
      slug: "p-data-add-pretrain-filtering",
      title: "Add: Pretraining Data Filtering",
      body: `Tamper-resistant safety via data choices made before any post-training. Worth surfacing as a first-class node.`,
      kind: "child",
      score: 20,
      commentCount: 5,
    },
  ],

  "c-multiagent-governance": [
    {
      slug: "p-multi-add-norms",
      title: "Add: Emergent Norms among Agents",
      body: `Empirical study of norms that arise when multiple LLM agents interact (cooperation, defection, communication conventions).`,
      kind: "child",
      score: 18,
      commentCount: 4,
    },
  ],

  "c-safety-by-construction": [
    {
      slug: "p-construct-add-formal-verification",
      title: "Add: Formal Verification of NN Properties",
      body: `Marabou/Reluplex-style verification, neural-net-friendly model-checking. Distinct from non-agentic-AI proposals.`,
      kind: "child",
      score: 22,
      commentCount: 5,
    },
    {
      slug: "p-construct-add-scientist-ai",
      title: "Add: Scientist AI / Non-agentic systems",
      body: `Bengio-style proposals for safe-by-design non-agentic systems. Worth surfacing on its own.`,
      kind: "child",
      score: 26,
      commentCount: 9,
    },
  ],

  "c-governance": [
    {
      slug: "p-gov-add-compute-governance",
      title: "Add: Compute Governance",
      body: `Cross-cutting topic — touches national, international, and technical governance. Currently scattered.`,
      kind: "child",
      score: 35,
      commentCount: 11,
    },
    {
      slug: "p-gov-add-liability",
      title: "Add: AI Liability Frameworks",
      body: `EU AI Liability Directive and similar. Cuts across national/international governance.`,
      kind: "child",
      score: 21,
      commentCount: 6,
    },
  ],

  "c-corporate-governance": [
    {
      slug: "p-corp-add-rsps",
      title: "Add: Responsible Scaling Policies",
      body: `RSPs are the dominant corporate-governance mechanism. Should be a named subnode, not buried in description.`,
      kind: "child",
      score: 32,
      commentCount: 8,
    },
    {
      slug: "p-corp-add-whistleblower",
      title: "Add: Whistleblower Protections",
      body: `Right-to-warn norms across labs. Specific, current, deserves explicit treatment.`,
      kind: "child",
      score: 25,
      commentCount: 7,
    },
  ],

  "c-national-governance": [
    {
      slug: "p-natl-add-aisis",
      title: "Add: AI Safety Institutes",
      body: `UK, US, JP, KR, SG, CN AISIs. New institutional category worth its own subnode.`,
      kind: "child",
      score: 28,
      commentCount: 9,
    },
    {
      slug: "p-natl-add-export-controls",
      title: "Add: Export Controls",
      body: `Compute and chip export controls — currently implicit; should be explicit.`,
      kind: "child",
      score: 22,
      commentCount: 6,
    },
  ],

  "c-international-governance": [
    {
      slug: "p-intl-add-bletchley",
      title: "Add: Bletchley/Seoul/Paris Summits",
      body: `Specific multilateral track that's now established enough to warrant its own node.`,
      kind: "child",
      score: 19,
      commentCount: 5,
    },
    {
      slug: "p-intl-add-frontier-pledge",
      title: "Add: Frontier AI Safety Commitments",
      body: `Voluntary international commitments by major labs. Distinct from formal treaty work.`,
      kind: "child",
      score: 16,
      commentCount: 4,
    },
  ],

  "c-ai-safety-policy": [
    {
      slug: "p-policy-add-eu-ai-act",
      title: "Add: EU AI Act",
      body: `The most ambitious binding regulation to date. Deserves its own subnode for scope and implementation.`,
      kind: "child",
      score: 30,
      commentCount: 8,
    },
    {
      slug: "p-policy-add-third-party-eval",
      title: "Add: Third-party Eval Mandates",
      body: `Policy proposals that require independent eval before deployment. Cross-cuts technical and policy work.`,
      kind: "child",
      score: 24,
      commentCount: 7,
    },
  ],

  "c-technical-governance": [
    {
      slug: "p-techgov-add-on-chip-attestation",
      title: "Add: On-chip attestation",
      body: `Specific hardware-rooted control. Currently implicit in the parent description; deserves its own node.`,
      kind: "child",
      score: 20,
      commentCount: 5,
    },
  ],

  "c-governance-more": [
    {
      slug: "p-govmore-add-public-interest-tech",
      title: "Add: Public-Interest AI",
      body: `Mozilla, Ada Lovelace Institute lineage of work. Distinct from the safety-flavoured governance focus.`,
      kind: "child",
      score: 14,
      commentCount: 4,
    },
  ],

  "c-societal-resilience": [
    {
      slug: "p-resil-add-infra-hardening",
      title: "Add: Critical Infra Hardening",
      body: `Power, water, finance — what does "resilient to AI-driven shocks" actually mean operationally?`,
      kind: "child",
      score: 17,
      commentCount: 5,
    },
  ],

  "c-societal-contract": [
    {
      slug: "p-contract-add-ubi",
      title: "Add: UBI / Income transfers",
      body: `Specific policy response to AI-driven labour displacement. Worth its own subnode.`,
      kind: "child",
      score: 22,
      commentCount: 13,
    },
  ],

  "c-ai-economic-impact": [
    {
      slug: "p-econ-add-labour-displacement",
      title: "Add: Labour Displacement Dynamics",
      body: `Disaggregate by sector and time horizon. The current node lumps too much together.`,
      kind: "child",
      score: 19,
      commentCount: 7,
    },
    {
      slug: "p-econ-add-capital-concentration",
      title: "Add: Capital Concentration",
      body: `If returns to AI accrue mostly to a small number of firms, the political-economy story changes. Worth tracking explicitly.`,
      kind: "child",
      score: 26,
      commentCount: 9,
    },
  ],

  "c-ai-mental-health": [
    {
      slug: "p-mental-add-companion-effects",
      title: "Add: AI Companion Effects",
      body: `Long-term effects of Replika/Character.ai-style relationships. Distinct enough from chatbot use to warrant its own node.`,
      kind: "child",
      score: 23,
      commentCount: 8,
    },
    {
      slug: "p-mental-add-clinical",
      title: "Add: Clinical-grade harms",
      body: `Cases where AI use has contributed to suicide, psychosis, or severe distress. Important and currently invisible.`,
      kind: "child",
      score: 38,
      commentCount: 17,
    },
  ],

  "c-fieldbuilding": [
    {
      slug: "p-field-add-funder-mapping",
      title: "Add: Funder Landscape",
      body: `Map of who funds what (Open Phil, SFF, Coefficient, FLI, LTFF, AISI). Useful for newcomers; currently scattered.`,
      kind: "child",
      score: 21,
      commentCount: 6,
    },
  ],

  "c-advocacy": [
    {
      slug: "p-adv-add-pause-movement",
      title: "Add: PauseAI / Stop AI",
      body: `Grassroots advocacy is a distinct mode from policy testimony or op-eds. Worth surfacing.`,
      kind: "child",
      score: 18,
      commentCount: 12,
    },
    {
      slug: "p-adv-add-narrative",
      title: "Add: Narrative & Communications",
      body: `What metaphors and stories work. Sub-discipline of advocacy increasingly studied in its own right.`,
      kind: "child",
      score: 14,
      commentCount: 4,
    },
  ],

  "c-onramps": [
    {
      slug: "p-onramps-add-mats",
      title: "Add: MATS / ARENA / SPAR",
      body: `Named onramp programs deserve their own subnodes for searchability — currently buried in description.`,
      kind: "child",
      score: 27,
      commentCount: 6,
    },
    {
      slug: "p-onramps-add-curricula",
      title: "Add: Self-study curricula",
      body: `AGISF, BlueDot, ARENA online materials — alternative to full programs. Distinct enough to warrant a node.`,
      kind: "child",
      score: 19,
      commentCount: 5,
    },
  ],
};

// Convenience: a flat list of every proposal node, with the parent slug
// attached. Used by the data layer to inflate proposals into SidePanel
// payloads.
export type FlatProposal = CommunityProposal & {
  parentSlug: string;
  authorUsername: string;
  authorDisplayName: string;
};

export function flattenProposals(): FlatProposal[] {
  const out: FlatProposal[] = [];
  let i = 0;
  for (const [parentSlug, props] of Object.entries(COMMUNITY_PROPOSALS)) {
    for (const p of props) {
      const author = COMMUNITY_PROPOSERS[i % COMMUNITY_PROPOSERS.length];
      out.push({
        ...p,
        parentSlug,
        authorUsername: author.username,
        authorDisplayName: author.displayName,
      });
      i += 1;
    }
  }
  return out;
}

// Re-export the SeedOutput type so consumers don't need to reach into
// seed.ts when they only care about the community tree.
export type { SeedOutput };
