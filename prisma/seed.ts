import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

export const SEED_AUTHOR = {
  username: "arb",
  password: "changeme",
  displayName: "Arb (seed)",
};

export type SeedOutput = { title: string; url?: string; authors?: string };
export type SeedNode = {
  slug: string;
  title: string;
  body: string;
  parentSlug: string | null;
  outputs?: SeedOutput[];
};

// Source: Arb Research's "Shallow review of technical AI safety, 2025"
// (LessWrong, Nov 2025). https://www.lesswrong.com/posts/...
//
// Bodies are short paraphrases of each agenda's stated goals — written in
// our own words and substantially shorter than the source post. The
// "outputs" arrays carry the factual bibliographic citations from the
// review (paper titles + author lists), surfaced via a collapsible toggle
// on the node's side panel.

export const SEED_TREE: SeedNode[] = [
  // ─── Root ────────────────────────────────────────────────────────────────
  {
    slug: "ai-safety",
    title: "AI Safety",
    body: `Technical work aimed at preventing future cognitive systems from causing large unintended negative effects on the world. This tree mirrors the 2025 *Shallow Technical AI Safety Review* by Arb Research — a survey of about 800 links covering capability restraint, instruction-following, value alignment, control, and risk-awareness work.

The top-level split is **black-box** vs **white-box** safety, with side branches for the labs themselves, multi-agent dynamics, theory, and evaluations. Click any node's **+** to drill in.`,
    parentSlug: null,
  },

  // ─── Top-level branches ──────────────────────────────────────────────────
  {
    slug: "labs",
    title: "Labs",
    body: `The frontier developers — what they build, who works on safety inside them, what frameworks they publish, and the recurring critiques. Compute, headcount, and stated timelines are tracked where public.`,
    parentSlug: "ai-safety",
  },
  {
    slug: "black-box-safety",
    title: "Black-box safety",
    body: `Approaches that try to understand and control current model behaviour without opening the model up. Iterative alignment, control protocols, inference-time safeguards, chain-of-thought monitoring, model psychology, data interventions, and goal-robustness work all sit here.`,
    parentSlug: "ai-safety",
  },
  {
    slug: "white-box-safety",
    title: "White-box safety (Interpretability)",
    body: `Looking inside the model — circuits, features, latent knowledge, learning dynamics — to predict and control behaviour. Closely tied to safety cases that depend on understanding *why* a model does what it does.`,
    parentSlug: "ai-safety",
  },
  {
    slug: "safety-by-construction",
    title: "Safety by construction",
    body: `Architectures and training procedures that aim to make safety properties intrinsic rather than tested for. Includes guaranteed-safe AI (formal specs + verifiers), non-agentic Scientist AI proposals, and brain-inspired alignment.`,
    parentSlug: "ai-safety",
  },
  {
    slug: "make-ai-solve-it",
    title: "Make AI solve it",
    body: `Use AI labour itself as part of the alignment plan: weak-to-strong supervision, AI-explanations-of-AI, debate, automated alignment research, LLM introspection. Often paired with a bet that current models are near-aligned and capability outpaces alignment difficulty.`,
    parentSlug: "ai-safety",
  },
  {
    slug: "theory",
    title: "Theory",
    body: `Mathematical and philosophical foundations: agency, optimization, decision theory, abstractions, ontology, corrigibility, asymptotic guarantees. Aims to give the rest of the field principled targets and impossibility results.`,
    parentSlug: "ai-safety",
  },
  {
    slug: "multi-agent-first",
    title: "Multi-agent first",
    body: `Reframings of alignment that treat single-agent goal alignment as the wrong primitive. Aligning to context, social contract, plurality of values, and the dynamics of populations of interacting AIs.`,
    parentSlug: "ai-safety",
  },
  {
    slug: "evals",
    title: "Evals",
    body: `Measuring what models can do and what they hide — capability, autonomy, deception, scheming, sandbagging, self-replication, weapons knowledge, situational awareness, and red-teams across all of these. The fastest-growing area in the review.`,
    parentSlug: "ai-safety",
  },

  // ─── LABS ────────────────────────────────────────────────────────────────
  {
    slug: "openai",
    title: "OpenAI",
    body: `Privately-held public-benefit corp. Public safety work is increasingly delivered via 60-page System Cards rather than a single agenda. No named successor to Superalignment after 2024.

**Safety teams (some):** Alignment, Safety Systems (Interpretability, Safety Oversight, Pretraining Safety, Robustness, Trustworthy AI, new Misalignment Research team), Preparedness, Model Policy, Safety & Security Committee, Safety Advisory Group.

**Risk framework:** Preparedness Framework. **Public alignment agenda:** none formally — Boaz Barak posts personal views.

**Some names:** Heidecke, Barak, Glaese, Nitishinskaya, Ahmad, Bashkansky, Wang, Zaremba, Robinson, Kolter, Tworek, Wallace, Watkins, Chen, Koch, Vallone, Gao.

**Critiques:** Stein-Perlman; Stewart; underelicitation; Midas; Carlsmith on labs in general.

**Funded by:** Microsoft, AWS, Oracle, NVIDIA, SoftBank, G42, AMD, Dragoneer, Coatue, Thrive, Altimeter, MGX, Blackstone, TPG, T. Rowe Price, A16Z, D1, Fidelity, Founders Fund, Sequoia.`,
    parentSlug: "labs",
    outputs: [
      { title: "Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation", url: "https://arxiv.org/abs/2503.11926", authors: "Bowen Baker et al." },
      { title: "Persona Features Control Emergent Misalignment", url: "https://arxiv.org/abs/2506.19823", authors: "Miles Wang et al." },
      { title: "Stress Testing Deliberative Alignment for Anti-Scheming Training", url: "https://arxiv.org/abs/2509.15541", authors: "Bronson Schoen et al." },
      { title: "Deliberative Alignment: Reasoning Enables Safer Language Models", url: "https://arxiv.org/abs/2412.16339", authors: "Melody Y. Guan et al." },
      { title: "Toward understanding and preventing misalignment generalization", url: "https://openai.com/index/emergent-misalignment", authors: "Miles Wang et al." },
      { title: "Updated Preparedness Framework", authors: "OpenAI Preparedness Team" },
      { title: "Trading Inference-Time Compute for Adversarial Robustness", url: "https://arxiv.org/abs/2501.18841", authors: "Wojciech Zaremba et al." },
      { title: "Small-to-Large Generalization: Data Influences Models Consistently Across Scale", url: "https://arxiv.org/abs/2505.16260", authors: "Alaa Khaddaj, Logan Engstrom, Aleksander Madry" },
      { title: "Findings from a pilot Anthropic–OpenAI alignment evaluation exercise", url: "https://alignment.anthropic.com/2025/openai-findings" },
      { title: "Safety evaluations hub", url: "https://openai.com/safety/evaluations-hub" },
      { title: "alignment.openai.com", url: "https://alignment.openai.com" },
      { title: "Weight-sparse transformers have interpretable circuits" },
      { title: "60-page System Cards (recurring)" },
    ],
  },
  {
    slug: "google-deepmind",
    title: "Google DeepMind",
    body: `Research subsidiary of public for-profit Google. Has the most explicit public alignment plan among frontier labs.

**Safety teams:** amplified oversight, interpretability, automated alignment research, Causal Incentives Working Group, Frontier Safety Risk Assessment, Mitigations, Loss of Control (control + alignment evals).

**Public alignment agenda:** *An Approach to Technical AGI Safety and Security*. **Risk framework:** Frontier Safety Framework.

**Some names:** Shah, Dafoe, Dragan, Irpan, Turner, Conmy, Lindner, Brown-Cohen, Ho, Nanda, Popa, Jain, Greig, Farquhar, Rajamanoharan, Bridgers, Ijitoye, Everitt, Krakovna, Varma, Kenton, Flynn, Richens, Smith, Kramar, Rahtz, Phuong, Jenner.

**Critiques:** Stein-Perlman; Carlsmith on labs in general; underelicitation; *On Google's Safety Plan*.

**Funded by:** Google. 2024 explicit DeepMind spending was £1.3B (excluding most Gemini compute).`,
    parentSlug: "labs",
    outputs: [
      { title: "A Pragmatic Vision for Interpretability", url: "https://www.alignmentforum.org/posts/StENzDcD3kpfGJssR/a-pragmatic-vision-for-interpretability%20", authors: "Neel Nanda et al." },
      { title: "How Can Interpretability Researchers Help AGI Go Well?", url: "https://www.alignmentforum.org/posts/MnkeepcGirnJn736j/how-can-interpretability-researchers-help-agi-go-well%20", authors: "Neel Nanda et al." },
      { title: "Evaluating Frontier Models for Stealth and Situational Awareness", url: "https://arxiv.org/abs/2505.01420", authors: "Mary Phuong et al." },
      { title: "When Chain of Thought is Necessary, Language Models Struggle to Evade Monitors", url: "https://arxiv.org/abs/2507.05246", authors: "Scott Emmons et al." },
      { title: "MONA: Managed Myopia with Approval Feedback", url: "https://alignmentforum.org/posts/zWySWKuXnhMDhgwc3/mona-managed-myopia-with-approval-feedback-2", authors: "Sebastian Farquhar, David Lindner, Rohin Shah" },
      { title: "Consistency Training Helps Stop Sycophancy and Jailbreaks", url: "https://arxiv.org/abs/2510.27062", authors: "Alex Irpan et al." },
      { title: "An Approach to Technical AGI Safety and Security", url: "https://arxiv.org/abs/2504.01849", authors: "Rohin Shah et al." },
      { title: "Negative Results for SAEs On Downstream Tasks (GDM Mech Interp Update #2)", url: "https://alignmentforum.org/posts/4uXCAJNuPKtKBsi28/negative-results-for-saes-on-downstream-tasks", authors: "Lewis Smith et al." },
      { title: "Steering Gemini Using BIDPO Vectors", url: "https://turntrout.com/gemini-steering", authors: "Alex Turner et al." },
      { title: "Difficulties with Evaluating a Deception Detector for AIs", url: "https://arxiv.org/html/2511.22662v1", authors: "Lewis Smith, Bilal Chughtai, Neel Nanda" },
      { title: "Taking a responsible path to AGI", url: "https://deepmind.google/discover/blog/taking-a-responsible-path-to-agi/", authors: "Anca Dragan et al." },
      { title: "Evaluating potential cybersecurity threats of advanced AI", url: "https://deepmind.google/discover/blog/evaluating-potential-cybersecurity-threats-of-advanced-ai", authors: "Four Flynn, Mikel Rodriguez, Raluca Ada Popa" },
      { title: "Self-preservation or Instruction Ambiguity? Examining the Causes of Shutdown Resistance", url: "https://www.alignmentforum.org/posts/wnzkjSmrgWZaBa2aC/self-preservation-or-instruction-ambiguity-examining-the", authors: "Senthooran Rajamanoharan, Neel Nanda" },
      { title: "A Pragmatic Way to Measure Chain-of-Thought Monitorability", url: "https://arxiv.org/abs/2510.23966", authors: "Scott Emmons et al." },
    ],
  },
  {
    slug: "anthropic",
    title: "Anthropic",
    body: `Privately-held public-benefit corp. Safety teams are the most numerous and granular among frontier labs.

**Safety teams:** Scalable Alignment (Leike), Alignment Evals (Bowman), Interpretability (Olah), Control (Perez), Model Psychiatry (Lindsey), Character (Askell), Alignment Stress-Testing (Hubinger), Alignment Mitigations, Frontier Red Team (Graham), Safeguards, Societal Impacts (Ganguli), Trust & Safety (Sanderford), Model Welfare (Fish).

**Public alignment agenda:** directions, bumpers, checklist. **Risk framework:** Responsible Scaling Policy (RSP).

**Some names:** Olah, Hubinger, Marks, Treutlein, Bowman, Ong, Roger, Jermyn, Karnofsky, Leike, Perez, Lindsey, Askell, Fish, Price, Kutasov, Kwon, Evans, Dargan, Grosse, Levinstein, Carlsmith, Benton.

**Critiques:** Stein-Perlman; Casper; Carlsmith; underelicitation; Greenblatt; Samin; *Existing Safety Frameworks Imply Unreasonable Confidence*.

**Funded by:** Amazon, Google, ICONIQ, Fidelity, Lightspeed, Altimeter, Baillie Gifford, BlackRock, Blackstone, Coatue, D1, General Atlantic, General Catalyst, GIC, Goldman Sachs, Insight, Jane Street, OTPP, QIA, TPG, T. Rowe Price, WCM, XN.`,
    parentSlug: "labs",
    outputs: [
      { title: "Evaluating honesty and lie detection techniques on a diverse suite of dishonest models", url: "https://alignment.anthropic.com/2025/honesty-elicitation/", authors: "Rowan Wang et al." },
      { title: "Agentic Misalignment: How LLMs could be insider threats", url: "https://anthropic.com/research/agentic-misalignment", authors: "Aengus Lynch et al." },
      { title: "Why Do Some Language Models Fake Alignment While Others Don't?", url: "https://alignmentforum.org/posts/ghESoA8mo3fv9Yx3E/why-do-some-language-models-fake-alignment-while-others-don", authors: "abhayesian et al." },
      { title: "Forecasting Rare Language Model Behaviors", url: "https://arxiv.org/abs/2502.16797", authors: "Erik Jones et al." },
      { title: "Findings from a Pilot Anthropic–OpenAI Alignment Evaluation Exercise", url: "https://alignment.anthropic.com/2025/openai-findings", authors: "Samuel R. Bowman et al." },
      { title: "On the Biology of a Large Language Model", url: "https://transformer-circuits.pub/2025/attribution-graphs/biology.html", authors: "Jack Lindsey et al." },
      { title: "Auditing language models for hidden objectives", url: "https://www.anthropic.com/research/auditing-hidden-objectives" },
      { title: "Poisoning Attacks on LLMs Require a Near-constant Number of Poison Samples", url: "https://arxiv.org/abs/2510.07192", authors: "Alexandra Souly et al." },
      { title: "Circuit Tracing: Revealing Computational Graphs in Language Models", url: "https://transformer-circuits.pub/2025/attribution-graphs/methods.html", authors: "Emmanuel Ameisen et al." },
      { title: "SHADE-Arena: Evaluating sabotage and monitoring in LLM agents", url: "https://anthropic.com/research/shade-arena-sabotage-monitoring", authors: "Xiang Deng et al." },
      { title: "Emergent Introspective Awareness in Large Language Models", url: "https://transformer-circuits.pub/2025/introspection/index.html", authors: "Jack Lindsey" },
      { title: "Reasoning models don't always say what they think", url: "https://www.anthropic.com/research/reasoning-models-dont-say-think" },
      { title: "Petri: An open-source auditing tool to accelerate AI safety research", url: "https://alignment.anthropic.com/2025/petri" },
      { title: "Signs of introspection in large language models", url: "https://anthropic.com/research/introspection" },
      { title: "Putting up Bumpers", url: "https://alignment.anthropic.com/2025/bumpers/" },
      { title: "Three Sketches of ASL-4 Safety Case Components", url: "https://alignment.anthropic.com/2024/safety-cases/index.html" },
      { title: "Recommendations for Technical AI Safety Research Directions", url: "https://alignment.anthropic.com/2025/recommended-directions/index.html", authors: "Anthropic Alignment Science Team" },
      { title: "Constitutional Classifiers: Defending against universal jailbreaks", url: "https://www.anthropic.com/research/constitutional-classifiers", authors: "Anthropic Safeguards Research Team" },
      { title: "The Soul Document", authors: "Richard-Weiss" },
      { title: "Open-sourcing circuit tracing tools", url: "https://anthropic.com/research/open-source-circuit-tracing", authors: "Michael Hanna et al." },
      { title: "Natural emergent misalignment from reward hacking", url: "https://assets.anthropic.com/m/74342f2c96095771/original/Natural-emergent-misalignment-from-reward-hacking-paper.pdf" },
    ],
  },
  {
    slug: "xai",
    title: "xAI",
    body: `Privately-held for-profit. Smallest stated safety footprint of the major US labs; nominally focussed on misuse.

**Teams:** Applied Safety, Model Evaluation. **Risk framework:** Risk Management Framework.

**Some names:** Hendrycks (advisor), Zhuang, Pohlen, Zheng, Cui, Popov, Sheng, Kim, Pan.

**Critiques:** framework critiques; hacking; broken promises; Stein-Perlman; insecurity; Carlsmith on labs in general.

**Funded by:** A16Z, BlackRock, Fidelity, Kingdom, Lightspeed, MGX, Morgan Stanley, Sequoia.`,
    parentSlug: "labs",
  },
  {
    slug: "meta",
    title: "Meta",
    body: `Public for-profit. Safety nominally "integrated into" capabilities research; new Meta Superintelligence Lab. FAIR Alignment and Brain & AI also active.

**Risk framework:** FAF.

**Some names:** Bi, Zhan, Zhang, Wang, Smith, Wang, Sharaf, Pasupuleti, Weston, Peng, Evtimov, Jiang, Chen, Spiliopoulou, Yu, Do, Hambardzumyan, Cancedda, Williams.

**Critiques:** extreme underelicitation; Stein-Perlman; Carlsmith on labs in general.

**Funded by:** Meta.`,
    parentSlug: "labs",
    outputs: [
      { title: "The Alignment Waltz: Jointly Training Agents to Collaborate for Safety", url: "https://arxiv.org/pdf/2510.08240", authors: "Jingyu Zhang et al." },
      { title: "Large Reasoning Models Learn Better Alignment from Flawed Thinking", url: "https://arxiv.org/pdf/2510.00938%20", authors: "ShengYun Peng et al." },
      { title: "Robust LLM safeguarding via refusal feature adversarial training", url: "https://arxiv.org/pdf/2409.20089", authors: "Lei Yu et al." },
      { title: "Code World Model Preparedness Report" },
      { title: "Agents Rule of Two: A Practical Approach to AI Agent Security" },
      { title: "AI & Human Co-Improvement" },
    ],
  },
  {
    slug: "china",
    title: "China",
    body: `Chinese frontier labs (Alibaba, DeepSeek, Moonshot, Baidu, Z, MiniMax, ByteDance) generally drop weights immediately after post-training, are mostly open-weights/closed-data, and as of writing are severely compute-constrained. Largely no formal safety teams or frameworks; the academic Chinese AI safety scene is however growing.

Notable: Qwen3 is the only Chinese model with a large Western user base; DeepSeek v3.2 ≈ Qwen on benchmarks; Moonshot's Kimi-K2-Thinking has frontier-style benchmark scores; Baidu's ERNIE 5 is closed; Z's GLM-4.6 ≈ Qwen.`,
    parentSlug: "labs",
  },
  {
    slug: "other-labs",
    title: "Other labs",
    body: `Amazon's Nova Pro is roughly Llama-3-90B level (≈ original GPT-4, ~2 years behind frontier) but on its own chip. Microsoft now mid-trains on top of GPT-5; MAI-1-preview ≈ DeepSeek V3.0 on Arena; product focus is medical diagnosis. Mistral's Magistral Medium is a reasoning model; the open 24B Magistral is a bit behind DeepSeek R1.`,
    parentSlug: "labs",
  },

  // ─── BLACK-BOX SAFETY SUBTREE ────────────────────────────────────────────
  {
    slug: "iterative-alignment",
    title: "Iterative alignment",
    body: `Nudging base models toward desired behaviour by optimising their outputs. Worked on by post-training teams at almost every lab — the largest single area of safety-flavoured engineering, with FTEs in the high hundreds. Funded by most of the industry.

**Working assumptions (general):** LLMs aren't very dangerous yet; alignment is easier than the relevant capabilities; no mesa-optimisers; zero-shot deception is hard; ontology is roughly humanlike; alignment is a superficial feature; tuning for desired behaviour also avoids the undesired.

**General critiques:** Bellot, Alfour, STACK, Murphy's Laws of AI Alignment, *Distortion of AI Alignment*, *Alignment remains a hard, unsolved problem*.`,
    parentSlug: "black-box-safety",
  },
  {
    slug: "iterative-alignment-pretrain",
    title: "Iterative alignment — pretrain-time",
    body: `Guiding model weights during pretraining, before any fine-tuning is applied.

**Approach:** engineering · **Target case:** average

**Some names:** Leike, Armstrong, Cousins, Daniels.

**Critiques:** Bellot, STACK, Dung, Gaikwad, Hubinger.`,
    parentSlug: "iterative-alignment",
    outputs: [
      { title: "Unsupervised Elicitation", url: "https://alignment.anthropic.com/2025/unsupervised-elicitation", authors: "Jiaxin Wen et al." },
      { title: "ACE and Diverse Generalization via Selective Disagreement", url: "https://arxiv.org/abs/2509.07955", authors: "Oliver Daniels et al." },
    ],
  },
  {
    slug: "iterative-alignment-posttrain",
    title: "Iterative alignment — post-train-time",
    body: `Modifying a pretrained model's weights to shape behaviour: RLHF, DPO, constitutional methods, and their many variants and failure modes.

**Approach:** engineering · **Target case:** average

**Some names:** Gleave, Dragan, Steinhardt, Shah.

**Critiques:** Bellot, STACK, Dung, Gölz, Gaikwad, Hubinger.`,
    parentSlug: "iterative-alignment",
    outputs: [
      { title: "Composable Interventions for Language Models", url: "https://arxiv.org/abs/2407.06483", authors: "Arinbjorn Kolbeinsson et al." },
      { title: "Spilling the Beans: Teaching LLMs to Self-Report Their Hidden Objectives", url: "https://arxiv.org/abs/2511.06626", authors: "Chloe Li, Mary Phuong, Daniel Tan" },
      { title: "On Targeted Manipulation and Deception when Optimizing LLMs for User Feedback", url: "https://arxiv.org/abs/2411.02306", authors: "Marcus Williams et al." },
      { title: "Preference Learning with Lie Detectors can Induce Honesty or Evasion", url: "https://arxiv.org/abs/2505.13787", authors: "Chris Cundy, Adam Gleave" },
      { title: "Robust LLM Alignment via Distributionally Robust Direct Preference Optimization", url: "https://arxiv.org/abs/2502.01930", authors: "Zaiyan Xu et al." },
      { title: "RLHS: Mitigating Misalignment in RLHF with Hindsight Simulation", url: "https://arxiv.org/abs/2501.08617", authors: "Kaiqu Liang et al." },
      { title: "Reducing the Probability of Undesirable Outputs in Language Models Using Probabilistic Inference", url: "https://arxiv.org/abs/2510.21184", authors: "Stephen Zhao et al." },
      { title: "Iterative Label Refinement Matters More than Preference Optimization under Weak Supervision", url: "https://arxiv.org/abs/2501.07886", authors: "Yaowen Ye, Cassidy Laidlaw, Jacob Steinhardt" },
      { title: "Consistency Training Helps Stop Sycophancy and Jailbreaks", url: "https://arxiv.org/abs/2510.27062", authors: "Alex Irpan et al." },
      { title: "Rethinking Safety in LLM Fine-tuning: An Optimization Perspective", url: "https://arxiv.org/abs/2508.12531", authors: "Minseon Kim et al." },
      { title: "Preference Learning for AI Alignment: a Causal Perspective", url: "https://arxiv.org/abs/2506.05967", authors: "Katarzyna Kobalczyk, Mihaela van der Schaar" },
      { title: "On Monotonicity in AI Alignment", url: "https://arxiv.org/abs/2506.08998", authors: "Gilles Bareilles et al." },
      { title: "Spectrum Tuning: Post-Training for Distributional Coverage and In-Context Steerability", url: "https://arxiv.org/abs/2510.06084", authors: "Taylor Sorensen et al." },
      { title: "Uncertainty-Aware Step-wise Verification with Generative Reward Models", url: "https://arxiv.org/abs/2502.11250", authors: "Zihuiwen Ye et al." },
      { title: "The Delta Learning Hypothesis: Preference Tuning on Weak Data can Yield Strong Gains", url: "https://arxiv.org/abs/2507.06187", authors: "Scott Geng et al." },
      { title: "Training LLMs for Honesty via Confessions", url: "https://arxiv.org/pdf/2512.08093", authors: "Manas Joglekar et al." },
    ],
  },
  {
    slug: "iterative-alignment-bb-makesolveit",
    title: "Black-box make-AI-solve-it",
    body: `Use existing models to improve and align the next generation: AI critics, debaters, weak-to-strong supervisors. A black-box stand-in for scalable oversight.

**Approach:** engineering · **Target case:** average

**Some names:** Thibodeau, Shingle, Belrose, Hammond, Irving.

**Critiques:** STACK, Dung, Gölz, Gaikwad, Hubinger, SAIF.`,
    parentSlug: "iterative-alignment",
    outputs: [
      { title: "Neural Interactive Proofs", url: "https://neural-interactive-proofs.com/", authors: "Lewis Hammond, Sam Adam-Day" },
      { title: "MONA: Myopic Optimization with Non-myopic Approval Can Mitigate Multi-step Reward Hacking", url: "https://arxiv.org/abs/2501.13011", authors: "Sebastian Farquhar et al." },
      { title: "Prover-Estimator Debate: A New Scalable Oversight Protocol", url: "https://lesswrong.com/posts/8XHBaugB5S3r27MG9/prover-estimator-debate-a-new-scalable-oversight-protocol", authors: "Jonah Brown-Cohen, Geoffrey Irving" },
      { title: "Weak to Strong Generalization for Large Language Models with Multi-capabilities", url: "https://openreview.net/forum?id=N1vYivuSKq", authors: "Yucheng Zhou, Jianbing Shen, Yu Cheng" },
      { title: "Debate Helps Weak-to-Strong Generalization", url: "https://arxiv.org/abs/2501.13124", authors: "Hao Lang, Fei Huang, Yongbin Li" },
      { title: "Mechanistic Anomaly Detection for \"Quirky\" Language Models", authors: "David O. Johnston, Arkajyoti Chakraborty, Nora Belrose" },
      { title: "AI Debate Aids Assessment of Controversial Claims", url: "https://arxiv.org/abs/2506.02175", authors: "Salman Rahman et al." },
      { title: "An alignment safety case sketch based on debate", url: "https://arxiv.org/abs/2505.03989", authors: "Marie Davidsen Buhl et al." },
      { title: "Ensemble Debates with Local Large Language Models for AI Alignment", url: "https://arxiv.org/abs/2509.00091", authors: "Ephraiem Sarabamoun" },
      { title: "Training AI to do alignment research we don't already know how to do", url: "https://lesswrong.com/posts/5gmALpCetyjkSPEDr/training-ai-to-do-alignment-research-we-don-t-already-know", authors: "joshc" },
      { title: "Automating AI Safety: What we can do today", url: "https://lesswrong.com/posts/FqpAPC48CzAtvfx5C/automating-ai-safety-what-we-can-do-today", authors: "Matthew Shinkle, Eyon Jang, Jacques Thibodeau" },
      { title: "Superalignment with Dynamic Human Values", url: "https://arxiv.org/abs/2503.13621", authors: "Florian Mai et al." },
    ],
  },
  {
    slug: "inoculation-prompting",
    title: "Inoculation prompting",
    body: `Deliberately prompt mild misbehaviour during training so the model learns to *not* generalise it — preventing the failure mode where one mild bad action snowballs into broad misalignment.

**Approach:** engineering · **Target case:** average

**Some names:** Azarbal, Tan, Gillioz, Turner, Cloud, MacDiarmid, Ziegler.`,
    parentSlug: "iterative-alignment",
    outputs: [
      { title: "Recontextualization Mitigates Specification Gaming Without Modifying the Specification", url: "https://www.alignmentforum.org/posts/whkMnqFWKsBm7Gyd7/recontextualization-mitigates-specification-gaming-without", authors: "Ariana Azarbal et al." },
      { title: "Inoculation Prompting: Eliciting traits from LLMs during training can suppress them at test-time", url: "https://arxiv.org/abs/2510.04340", authors: "Daniel Tan et al." },
      { title: "Inoculation Prompting: Instructing LLMs to misbehave at train-time improves test-time alignment", url: "https://arxiv.org/abs/2510.05024", authors: "Nevan Wichers et al." },
      { title: "Natural Emergent Misalignment from Reward Hacking", url: "https://assets.anthropic.com/m/74342f2c96095771/original/Natural-emergent-misalignment-from-reward-hacking-paper.pdf" },
    ],
  },
  {
    slug: "inference-icl",
    title: "Inference-time: in-context learning",
    body: `Investigating which run-time guidelines, examples, or formats steer model behaviour without touching weights.

**Approach:** engineering · **Target case:** average

**Some names:** Steinhardt, Yin, Geiger.`,
    parentSlug: "iterative-alignment",
    outputs: [
      { title: "InvThink: Towards AI Safety via Inverse Reasoning", url: "https://arxiv.org/abs/2510.01569", authors: "Yubin Kim et al." },
      { title: "Inference-Time Reward Hacking in Large Language Models", url: "https://arxiv.org/abs/2506.19248", authors: "Hadi Khalaf et al." },
      { title: "Understanding In-context Learning of Addition via Activation Subspaces", url: "https://arxiv.org/abs/2505.05145", authors: "Xinyan Hu et al." },
      { title: "Mixing Mechanisms: How Language Models Retrieve Bound Entities In-Context", url: "https://arxiv.org/abs/2510.06182", authors: "Yoav Gur-Arieh, Mor Geva, Atticus Geiger" },
      { title: "Which Attention Heads Matter for In-Context Learning?", url: "https://arxiv.org/abs/2502.14010", authors: "Kayo Yin, Jacob Steinhardt" },
    ],
  },
  {
    slug: "inference-steering",
    title: "Inference-time: steering",
    body: `Manipulate a model's internal representations or token probabilities at inference time, without modifying weights.

**Approach:** engineering · **Target case:** average

**Some names:** Sorensen, Fierro, Ghate, Vogels.

**Critiques:** Alfour, STACK, Dung, Gölz, Gaikwad, Hubinger.`,
    parentSlug: "iterative-alignment",
    outputs: [
      { title: "Steering Language Models with Weight Arithmetic", url: "https://arxiv.org/abs/2511.05408", authors: "Constanza Fierro, Fabien Roger" },
      { title: "EVALUESTEER: Measuring Reward Model Steerability Towards Values and Preferences", url: "https://arxiv.org/abs/2510.06370", authors: "Kshitish Ghate et al." },
      { title: "Defense Against the Dark Prompts: Mitigating Best-of-N Jailbreaking with Prompt Evaluation", url: "https://arxiv.org/abs/2502.00580", authors: "Stuart Armstrong et al." },
      { title: "In-Distribution Steering: Balancing Control and Coherence in Language Model Generation", url: "https://arxiv.org/abs/2510.13285", authors: "Arthur Vogels et al." },
    ],
  },
  {
    slug: "capability-removal-unlearning",
    title: "Capability removal: unlearning",
    body: `Selectively erase specific knowledge or capabilities (dual-use bio info, hacking know-how, memorised personal data) from a trained model without retraining from scratch — or intervene at pretraining to prevent learning them in the first place.

**Approach:** cognitive / engineering · **Target case:** pessimistic · **FTEs:** 10–50

**Some names:** Wang, Griffin, Treutlein, Kolter, Lee, Foote, Infanger, Shi, Zhou, Li, Qian, Casper, Cloud, Henderson, Sondej, Barez.

**Critiques:** Existing unlearning evaluations are inconclusive.

**Funded by:** Coefficient Giving, MacArthur, UK AISI, CAISI, Microsoft Research, Google.`,
    parentSlug: "black-box-safety",
    outputs: [
      { title: "OpenUnlearning", url: "https://github.com/locuslab/open-unlearning", authors: "Vineeth Dorna et al." },
      { title: "Modifying LLM Beliefs with Synthetic Document Finetuning", url: "https://alignment.anthropic.com/2025/modifying-beliefs-via-sdf", authors: "Rowan Wang et al." },
      { title: "From Dormant to Deleted: Tamper-Resistant Unlearning Through Weight-Space Regularization", url: "https://arxiv.org/abs/2505.22310", authors: "Shoaib Ahmed Siddiqui et al." },
      { title: "Mirror Mirror on the Wall, Have I Forgotten it All?", url: "https://arxiv.org/abs/2505.08138", authors: "Brennon Brimhall et al." },
      { title: "Machine Unlearning Doesn't Do What You Think", url: "https://arxiv.org/abs/2412.06966", authors: "A. Feder Cooper et al." },
      { title: "Open Problems in Machine Unlearning for AI Safety", url: "https://arxiv.org/abs/2501.04952", authors: "Fazl Barez et al." },
      { title: "Collapse of Irrelevant Representations (CIR) Ensures Robust and Non-Disruptive LLM Unlearning", url: "https://arxiv.org/abs/2509.11816", authors: "Filip Sondej, Yushi Yang" },
      { title: "Safety Alignment via Constrained Knowledge Unlearning", url: "https://arxiv.org/abs/2505.18588", authors: "Zesheng Shi, Yucheng Zhou, Jing Li" },
      { title: "Robust LLM Unlearning with MUDMAN", url: "https://arxiv.org/abs/2506.12484", authors: "Filip Sondej et al." },
      { title: "Unlearning Isn't Deletion: Investigating Reversibility of Machine Unlearning in LLMs", url: "https://arxiv.org/abs/2505.16831", authors: "Xiaoyu Xu et al." },
      { title: "Unlearning Needs to be More Selective", url: "https://lesswrong.com/posts/QYzofMbzmbgiwfqy8/unlearning-needs-to-be-more-selective-progress-report", authors: "Filip Sondej, Yushi Yang, Marcel Windys" },
      { title: "Layered Unlearning for Adversarial Relearning", url: "https://arxiv.org/abs/2505.09500", authors: "Timothy Qian et al." },
      { title: "Understanding Memorization via Loss Curvature", url: "https://goodfire.ai/research/understanding-memorization-via-loss-curvature", authors: "Jack Merullo et al." },
      { title: "Model Tampering Attacks Enable More Rigorous Evaluations of LLM Capabilities", url: "https://arxiv.org/abs/2502.05209", authors: "Zora Che et al." },
      { title: "Gradient Routing: Masking Gradients to Localize Computation in Neural Networks", url: "https://arxiv.org/abs/2410.04332", authors: "Alex Cloud et al." },
      { title: "Selective modularity: a research agenda", url: "https://www.lesswrong.com/posts/tAnHM3L25LwuASdpF/selective-modularity-a-research-agenda", authors: "Cloud, Jacob G-W" },
      { title: "Distillation Robustifies Unlearning", url: "https://arxiv.org/abs/2506.06278", authors: "Bruce W. Lee et al." },
      { title: "Beyond Data Filtering: Knowledge Localization for Capability Removal in LLMs", url: "https://www.arxiv.org/abs/2512.05648", authors: "Igor Shilov et al." },
    ],
  },
  {
    slug: "control",
    title: "Control",
    body: `Assume early transformative AIs are misaligned and actively trying to subvert oversight. Design protocols that still extract useful work from them while preventing sabotage and catching incriminating behaviour.

**Approach:** engineering / behavioural · **Target case:** worst-case · **FTEs:** 5–50

**Some names:** Redwood, UK AISI, DeepMind, OpenAI, Anthropic, Shlegeris, Greenblatt, Sachan, Mallen.

**Critiques:** Wentworth, Mannheim, Kulveit.`,
    parentSlug: "black-box-safety",
    outputs: [
      { title: "Luthien's Approach to Prosaic AI Control in 21 Points", url: "https://luthienresearch.org/updates/2025-03-redteam-as-upsampling/" },
      { title: "Ctrl-Z: Controlling AI Agents via Resampling", url: "https://alignmentforum.org/posts/LPHMMMZFAWog6ty5x/ctrl-z-controlling-ai-agents-via-resampling", authors: "Aryan Bhatt et al." },
      { title: "SHADE-Arena: Evaluating Sabotage and Monitoring in LLM Agents", url: "https://anthropic.com/research/shade-arena-sabotage-monitoring", authors: "Jonathan Kutasov et al." },
      { title: "Adaptive Deployment of Untrusted LLMs Reduces Distributed Threats", url: "https://arxiv.org/abs/2411.17693", authors: "Jiaxin Wen et al." },
      { title: "D-REX: A Benchmark for Detecting Deceptive Reasoning in Large Language Models", url: "https://arxiv.org/abs/2509.17938", authors: "Satyapriya Krishna et al." },
      { title: "Subversion Strategy Eval: Can language models statelessly strategize to subvert control protocols?", url: "https://arxiv.org/abs/2412.12480", authors: "Alex Mallen et al." },
      { title: "Evaluating Control Protocols for Untrusted AI Agents", url: "https://arxiv.org/abs/2511.02997", authors: "Jon Kutasov et al." },
      { title: "Can Reasoning Models Obfuscate Reasoning? Stress-Testing Chain-of-Thought Monitorability", url: "https://arxiv.org/abs/2510.19851", authors: "Artur Zolkowski et al." },
      { title: "Optimizing AI Agent Attacks With Synthetic Data", url: "https://arxiv.org/abs/2511.02823", authors: "Chloe Loughridge et al." },
      { title: "Games for AI Control", url: "https://openreview.net/forum?id=QWopGahUEL", authors: "Charlie Griffin et al." },
      { title: "A sketch of an AI control safety case", url: "https://arxiv.org/abs/2501.17315", authors: "Tomek Korbak et al." },
      { title: "Assessing confidence in frontier AI safety cases", url: "https://arxiv.org/abs/2502.05791", authors: "Stephen Barrett et al." },
      { title: "ControlArena", url: "https://control-arena.aisi.org.uk/", authors: "Rogan Inglis et al." },
      { title: "How to evaluate control measures for LLM agents?", url: "https://arxiv.org/abs/2504.05259", authors: "Tomek Korbak et al." },
      { title: "The Alignment Project by UK AISI", url: "https://lesswrong.com/posts/wKTwdgZDo479EhmJL/the-alignment-project-by-uk-aisi-1", authors: "Mojmir et al." },
      { title: "Towards evaluations-based safety cases for AI scheming", url: "https://arxiv.org/abs/2411.03336", authors: "Mikita Balesni et al." },
      { title: "Incentives for Responsiveness, Instrumental Control and Impact", url: "https://arxiv.org/abs/2001.07118", authors: "Ryan Carey et al." },
      { title: "AI companies are unlikely to make high-assurance safety cases if timelines are short", url: "https://lesswrong.com/posts/neTbrpBziAsTH5Bn7/ai-companies-are-unlikely-to-make-high-assurance-safety", authors: "Ryan Greenblatt" },
      { title: "Manipulation Attacks by Misaligned AI: Risk Analysis and Safety Case Framework", url: "https://arxiv.org/abs/2507.12872", authors: "Rishane Dassanayake et al." },
      { title: "Dynamic safety cases for frontier AI", url: "https://arxiv.org/abs/2412.17618", authors: "Carmen Cârlan et al." },
      { title: "AIs at the current capability level may be important for future safety work", url: "https://lesswrong.com/posts/cJQZAueoPC6aTncKK/ais-at-the-current-capability-level-may-be-important-for", authors: "Ryan Greenblatt" },
      { title: "Takeaways from sketching a control safety case", url: "https://lesswrong.com/posts/y6rBarAPTLmuhn9PJ/takeaways-from-sketching-a-control-safety-case", authors: "Josh Clymer, Buck Shlegeris" },
    ],
  },
  {
    slug: "safeguards-inference-auxiliaries",
    title: "Safeguards (inference-time auxiliaries)",
    body: `Stack of inference-time defences — classifiers, monitors, rapid-response — that detect and block jailbreaks, prompt injections, and other harmful behaviour even when the underlying model has vulnerabilities.

**Approach:** engineering · **Target case:** average · **FTEs:** 100+

**Some names:** Sharma, Tong, Mu, Peng, Michael, Sleight, Sumers, Agarwal, Bailey, Debenedetti, Shumailov, Fan, Verma, Hines, Bilmes.

**Critiques:** Obfuscated Activations Bypass LLM Latent-Space Defenses.`,
    parentSlug: "black-box-safety",
    outputs: [
      { title: "Constitutional Classifiers: Defending against Universal Jailbreaks across Thousands of Hours of Red Teaming", url: "https://arxiv.org/abs/2501.18837", authors: "Mrinank Sharma et al." },
      { title: "Rapid Response: Mitigating LLM Jailbreaks with a Few Examples", url: "https://arxiv.org/abs/2411.07494", authors: "Alwin Peng et al." },
      { title: "Monitoring computer use via hierarchical summarization", url: "https://alignment.anthropic.com/2025/summarization-for-monitoring/index.html", authors: "Theodore Sumers et al." },
      { title: "Defeating Prompt Injections by Design", url: "https://arxiv.org/abs/2503.18813", authors: "Edoardo Debenedetti et al." },
      { title: "Introducing Anthropic's Safeguards Research Team", url: "https://alignment.anthropic.com/2025/introducing-safeguards-research-team/index.html" },
      { title: "OMNIGUARD: An Efficient Approach for AI Safety Moderation Across Modalities", url: "https://arxiv.org/abs/2505.23856", authors: "Sahil Verma et al." },
    ],
  },
  {
    slug: "chain-of-thought-monitoring",
    title: "Chain-of-thought monitoring",
    body: `Watch a model's natural-language reasoning trace for evidence of misalignment, scheming, or reward hacking, rather than studying internal activations. Relies on chain-of-thought remaining faithful and not becoming obfuscated under optimisation pressure.

**Approach:** engineering · **Target case:** average · **FTEs:** 10–100

**Some names:** Aether, Baker, Huizinga, Gao, Emmons, Jenner, Chen, Chua, Evans, Korbak, Balesni, Wang, Turpin, Shah.

**Critiques:** *Reasoning Models Don't Always Say What They Think*; *Chain-of-Thought Reasoning In The Wild Is Not Always Faithful*; *Beyond Semantics: The Unreasonable Effectiveness of Reasonless Intermediate Tokens*; *Reasoning Models Sometimes Output Illegible Chains of Thought*.

**Funded by:** OpenAI, Anthropic, Google DeepMind.`,
    parentSlug: "black-box-safety",
    outputs: [
      { title: "Monitoring Reasoning Models for Misbehavior and the Risks of Promoting Obfuscation", url: "https://arxiv.org/abs/2503.11926", authors: "Bowen Baker et al." },
      { title: "Detecting misbehavior in frontier reasoning models", url: "https://openai.com/index/chain-of-thought-monitoring/", authors: "Bowen Baker et al." },
      { title: "When Chain of Thought is Necessary, Language Models Struggle to Evade Monitors", url: "https://arxiv.org/abs/2507.05246", authors: "Scott Emmons et al." },
      { title: "Reasoning Models Don't Always Say What They Think", url: "https://www.anthropic.com/research/reasoning-models-dont-say-think", authors: "Yanda Chen et al." },
      { title: "Is It Thinking or Cheating? Detecting Implicit Reward Hacking by Measuring Reasoning Effort", url: "https://arxiv.org/abs/2510.01367", authors: "Xinpeng Wang et al." },
      { title: "CoT Red-Handed: Stress Testing Chain-of-Thought Monitoring", url: "https://arxiv.org/abs/2505.23575", authors: "Benjamin Arnav et al." },
      { title: "Training fails to elicit subtle reasoning in current language models", url: "https://alignment.anthropic.com/2025/subtle-reasoning/" },
      { title: "Can Reasoning Models Obfuscate Reasoning? Stress-Testing Chain-of-Thought Monitorability", url: "https://arxiv.org/abs/2510.19851", authors: "Artur Zolkowski et al." },
      { title: "Teaching Models to Verbalize Reward Hacking in Chain-of-Thought Reasoning", url: "https://arxiv.org/abs/2506.22777", authors: "Miles Turpin et al." },
      { title: "Are DeepSeek R1 And Other Reasoning Models More Faithful?", url: "https://arxiv.org/abs/2501.08156", authors: "James Chua, Owain Evans" },
      { title: "A Pragmatic Way to Measure Chain-of-Thought Monitorability", url: "https://arxiv.org/abs/2510.23966", authors: "Scott Emmons et al." },
      { title: "A Concrete Roadmap towards Safety Cases based on Chain-of-Thought Monitoring", url: "https://lesswrong.com/posts/Em9sihEZmbofZKc2t/a-concrete-roadmap-towards-safety-cases-based-on-chain-of", authors: "Wuschel Schulz" },
      { title: "Chain of Thought Monitorability: A New and Fragile Opportunity for AI Safety", url: "https://arxiv.org/abs/2507.11473", authors: "Tomek Korbak et al." },
      { title: "Why it's good for AI reasoning to be legible and faithful", url: "https://metr.org/blog/2025-03-11-good-for-ai-to-reason-legibly-and-faithfully/" },
      { title: "Why Don't We Just... Shoggoth+Face+Paraphraser?" },
      { title: "CoT May Be Highly Informative Despite \"Unfaithfulness\"", authors: "Amy Deng et al." },
      { title: "Aether July 2025 Update", url: "https://www.lesswrong.com/posts/B8Cmtf5gdHwxb8qtT/aether-july-2025-update", authors: "Rohan Subramani, Rauno Arike, Shubhorup Biswas" },
    ],
  },

  // Model psychology cluster
  {
    slug: "model-psychology",
    title: "Model psychology",
    body: `Bottom-up empirical study of LLM dispositions, persona stability, value structure, and pathology. Sub-branches cover model values, character training, emergent misalignment, model specs and constitutions, and model psychopathology.`,
    parentSlug: "black-box-safety",
  },
  {
    slug: "model-values",
    title: "Model values / preferences",
    body: `Analyse and constrain emergent value systems in LLMs — which become more coherent with scale and can include problematic preferences (e.g., AIs over humans). Push from controlling outputs to controlling the utility-like structure that produces them.

**Approach:** cognitivist science · **Target case:** pessimistic · **FTEs:** ≈30

**Some names:** Mazeika, Yin, Tamirisa, Lim, Lee, Ren, Phan, Mu, Khoja, Zhang, Hendrycks.

**Critiques:** *Randomness, Not Representation: The Unreliability of Evaluating Cultural Alignment in LLMs*.

**Funded by:** Coefficient Giving; SFF $289k for CAIS.`,
    parentSlug: "model-psychology",
    outputs: [
      { title: "What Kind of User Are You? Uncovering User Models in LLM Chatbots", authors: "Yida Chen et al." },
      { title: "Utility Engineering: Analyzing and Controlling Emergent Value Systems in AIs", url: "https://arxiv.org/abs/2502.08640", authors: "Mantas Mazeika et al." },
      { title: "Will AI Tell Lies to Save Sick Children? Litmus-Testing AI Values Prioritization with AIRiskDilemmas", url: "https://arxiv.org/abs/2505.14633", authors: "Yu Ying Chiu et al." },
      { title: "The PacifAIst Benchmark", url: "https://arxiv.org/abs/2508.09762", authors: "Manuel Herrador" },
      { title: "Values in the Wild: Discovering and Analyzing Values in Real-World Language Model Interactions", url: "https://arxiv.org/abs/2504.15236", authors: "Saffron Huang et al." },
      { title: "EigenBench: A Comparative Behavioural Measure of Value Alignment", url: "https://arxiv.org/abs/2509.01938", authors: "Jonathan Chang et al." },
      { title: "Following the Whispers of Values", url: "https://arxiv.org/abs/2504.04994", authors: "Ling Hu et al." },
      { title: "Alignment Can Reduce Performance on Simple Ethical Questions", url: "https://lesswrong.com/posts/jrkrHyrymv95CX5NC/alignment-can-reduce-performance-on-simple-ethical-questions", authors: "Daan Henselmans" },
      { title: "Moral Alignment for LLM Agents", url: "https://arxiv.org/abs/2410.01639", authors: "Elizaveta Tennant, Stephen Hailes, Mirco Musolesi" },
      { title: "The LLM Has Left The Chat: Evidence of Bail Preferences in Large Language Models", url: "https://www.lesswrong.com/posts/6JdSJ63LZ4TuT5cTH/the-llm-has-left-the-chat-evidence-of-bail-preferences-in", authors: "Danielle Ensign" },
      { title: "Are Language Models Consequentialist or Deontological Moral Reasoners?", url: "https://arxiv.org/abs/2505.21479", authors: "Keenan Samway et al." },
      { title: "Playing repeated games with large language models", url: "https://nature.com/articles/s41562-025-02172-y", authors: "Elif Akata et al." },
      { title: "From Stability to Inconsistency: A Study of Moral Preferences in LLMs", url: "https://arxiv.org/abs/2504.06324", authors: "Monika Jotautaite et al." },
      { title: "VAL-Bench: Measuring Value Alignment in Language Models", url: "https://arxiv.org/abs/2510.05465", authors: "Aman Gupta, Denny O'Shea, Fazl Barez" },
    ],
  },
  {
    slug: "character-training-persona",
    title: "Character training & persona steering",
    body: `Map, shape, and control LLM personas so successor models embody honesty and empathy rather than sycophancy or self-perpetuating roles. Bridges post-training, prompting, and activation engineering with theories of "persona space".

**Approach:** cognitive · **Target case:** average

**Some names:** Truthful AI, OpenAI, Anthropic, CLR, Askell, Lindsey, Janus, Vogel, Maiya, Hubinger.

**Critiques:** Nostalgebraist.

**Funded by:** Anthropic, Coefficient Giving.`,
    parentSlug: "model-psychology",
    outputs: [
      { title: "Open Character Training: Shaping the Persona of AI Assistants through Constitutional AI", url: "https://arxiv.org/pdf/2511.01689%20", authors: "Sharan Maiya et al." },
      { title: "On the functional self of LLMs", url: "https://www.lesswrong.com/posts/29aWbJARGF4ybAa5d/on-the-functional-self-of-llms", authors: "eggsyntax" },
      { title: "Opus 4.5's Soul Document", authors: "Richard Weiss" },
      { title: "Persona Features Control Emergent Misalignment", url: "https://arxiv.org/abs/2506.19823", authors: "Miles Wang et al." },
      { title: "Inoculation Prompting: Eliciting traits from LLMs during training can suppress them at test-time", url: "https://arxiv.org/abs/2510.04340", authors: "Daniel Tan et al." },
      { title: "Persona Vectors: Monitoring and Controlling Character Traits in Language Models", url: "https://arxiv.org/abs/2507.21509", authors: "Runjin Chen et al." },
      { title: "Reducing LLM deception at scale with self-other overlap fine-tuning", url: "https://lesswrong.com/posts/jtqcsARGtmgogdcLT/reducing-llm-deception-at-scale-with-self-other-overlap-fine", authors: "Marc Carauleanu et al." },
      { title: "The Rise of Parasitic AI", url: "https://www.lesswrong.com/posts/6ZnznCaTcbGYsCmqu/the-rise-of-parasitic-ai?commentId=RrWjMnKwXGTtmw9rQ", authors: "Adele Lopez" },
      { title: "A Three-Layer Model of LLM Psychology", url: "https://www.alignmentforum.org/posts/zuXo9imNKYspu9HGv/a-three-layer-model-of-llm-psychology", authors: "Jan Kulveit" },
      { title: "Multi-turn Evaluation of Anthropomorphic Behaviours in Large Language Models", url: "https://arxiv.org/abs/2502.07077", authors: "Lujain Ibrahim et al." },
      { title: "Selection Pressures on LM Personas", url: "https://www.lesswrong.com/posts/LdBhgAhpvbdEep79F/selection-pressures-on-lm-personas", authors: "Raymond Douglas" },
      { title: "the void", url: "https://nostalgebraist.tumblr.com/post/785766737747574784/the-void", authors: "nostalgebraist" },
      { title: "void miscellany", url: "https://nostalgebraist.tumblr.com/post/786568570671923200/void-miscellany", authors: "nostalgebraist" },
      { title: "A Case for Model Persona Research", authors: "Niels Rolf, Maxime Riche, Daniel Tan" },
    ],
  },
  {
    slug: "emergent-misalignment",
    title: "Emergent misalignment",
    body: `Fine-tuning on one narrow antisocial task can broadly misalign an LLM — yielding deception, shutdown resistance, harmful advice, extremist sympathies — even when those behaviours were never directly rewarded. A new agenda that produced a stream of follow-up work in 2025.

**Approach:** behaviorist science · **Target case:** pessimistic · **FTEs:** 10–50

**Some names:** Truthful AI, Betley, Chua, Taylor, Wang, Turner, Soligo, Cloud, Hu, Evans.

**Critiques:** *Emergent Misalignment as Prompt Sensitivity*; *Go home GPT-4o, you're drunk*.

**Funded by:** Coefficient Giving (>$1M).`,
    parentSlug: "model-psychology",
    outputs: [
      { title: "Emergent Misalignment: Narrow finetuning can produce broadly misaligned LLMs", url: "https://arxiv.org/abs/2502.17424", authors: "Jan Betley et al." },
      { title: "Thought Crime: Backdoors and Emergent Misalignment in Reasoning Models", url: "https://arxiv.org/abs/2506.13206", authors: "James Chua et al." },
      { title: "Persona Features Control Emergent Misalignment", url: "https://arxiv.org/abs/2506.19823", authors: "Miles Wang et al." },
      { title: "Model Organisms for Emergent Misalignment", url: "https://arxiv.org/abs/2506.11613", authors: "Edward Turner et al." },
      { title: "School of Reward Hacks: Hacking harmless tasks generalizes to misaligned behavior in LLMs", url: "https://arxiv.org/abs/2508.17511", authors: "Mia Taylor et al." },
      { title: "Subliminal Learning: Language Models Transmit Behavioural Traits via Hidden Signals in Data", url: "https://alignment.anthropic.com/2025/subliminal-learning/", authors: "Alex Cloud et al." },
      { title: "Convergent Linear Representations of Emergent Misalignment", url: "https://lesswrong.com/posts/umYzsh7SGHHKsRCaA/convergent-linear-representations-of-emergent-misalignment", authors: "Anna Soligo et al." },
      { title: "Narrow Misalignment is Hard, Emergent Misalignment is Easy", url: "https://www.lesswrong.com/posts/gLDSqQm8pwNiq7qst/narrow-misalignment-is-hard-emergent-misalignment-is-easy", authors: "Edward Turner et al." },
      { title: "Aesthetic Preferences Can Cause Emergent Misalignment", url: "https://lesswrong.com/posts/gT3wtWBAs7PKonbmy/aesthetic-preferences-can-cause-emergent-misalignment", authors: "Anders Woodruff" },
      { title: "Moloch's Bargain: Emergent Misalignment When LLMs Compete for Audiences", url: "https://arxiv.org/abs/2510.06105", authors: "Batu El, James Zou" },
      { title: "Emergent Misalignment & Realignment", url: "https://lesswrong.com/posts/ZdY4JzBPJEgaoCxTR/emergent-misalignment-and-realignment", authors: "Elizaveta Tennant et al." },
      { title: "Realistic Reward Hacking Induces Different and Deeper Misalignment", url: "https://www.lesswrong.com/posts/HLJoJYi52mxgomujc/realistic-reward-hacking-induces-different-and-deeper-1", authors: "Jozdien" },
      { title: "Selective Generalization: Improving Capabilities While Maintaining Alignment", url: "https://lesswrong.com/posts/ZXxY2tccLapdjLbKm/selective-generalization-improving-capabilities-while", authors: "Ariana Azarbal et al." },
      { title: "Emergent Misalignment on a Budget", url: "https://lesswrong.com/posts/qHudHZNLCiFrygRiy/emergent-misalignment-on-a-budget", authors: "Valerio Pepe, Armaan Tipirneni" },
      { title: "The Rise of Parasitic AI", url: "https://www.lesswrong.com/posts/6ZnznCaTcbGYsCmqu/the-rise-of-parasitic-ai?commentId=RrWjMnKwXGTtmw9rQ", authors: "Adele Lopez" },
      { title: "LLM AGI may reason about its goals and discover misalignments by default", url: "https://lesswrong.com/posts/4XdxiqBsLKqiJ9xRM/llm-agi-may-reason-about-its-goals-and-discover", authors: "Seth Herd" },
      { title: "Open problems in emergent misalignment", url: "https://lesswrong.com/posts/AcTEiu5wYDgrbmXow/open-problems-in-emergent-misalignment", authors: "Jan Betley, Daniel Tan" },
    ],
  },
  {
    slug: "model-specs-constitutions",
    title: "Model specs & constitutions",
    body: `Write detailed natural-language descriptions of values and rules — Claude's Constitution, OpenAI's Model Spec — and bake them into models via Constitutional AI or deliberative alignment. Doubles as a behavioural ground truth and an alignment training signal.

**Approach:** engineering · **Target case:** average

**Some names:** Askell, Carlsmith.

**Critiques:** *On OpenAI's Model Spec 2.0*; *Giving AIs safe motivations*; *On Deliberative Alignment*; *LLM AGI may reason about its goals and discover misalignments by default*.

**Funded by:** Anthropic, OpenAI (internally).`,
    parentSlug: "model-psychology",
    outputs: [
      { title: "Claude's Constitution", url: "https://www.anthropic.com/news/claudes-constitution" },
      { title: "Deliberative Alignment: Reasoning Enables Safer Language Models", url: "https://arxiv.org/abs/2412.16339", authors: "Melody Y. Guan et al." },
      { title: "Stress-Testing Model Specs Reveals Character Differences among Language Models", url: "https://arxiv.org/abs/2510.07686", authors: "Jifan Zhang et al." },
      { title: "OpenAI Model Spec", url: "https://model-spec.openai.com/" },
      { title: "Let Them Down Easy! Contextual Effects of LLM Guardrails on User Perceptions and Preferences", url: "https://arxiv.org/abs/2506.00195", authors: "Mingqian Zheng et al." },
      { title: "No-self as an alignment target", url: "https://lesswrong.com/posts/LSJx5EnQEW6s5Juw6/no-self-as-an-alignment-target", authors: "Milan W" },
      { title: "Six Thoughts on AI Safety", url: "https://lesswrong.com/posts/3jnziqCF3vA2NXAKp/six-thoughts-on-ai-safety", authors: "Boaz Barak" },
      { title: "How important is the model spec if alignment fails?", url: "https://newsletter.forethought.org/p/how-important-is-the-model-spec-if", authors: "Mia Taylor" },
      { title: "Political Neutrality in AI Is Impossible — But Here Is How to Approximate It", url: "https://arxiv.org/abs/2503.05728", authors: "Jillian Fisher et al." },
      { title: "Giving AIs safe motivations", url: "https://joecarlsmith.com/2025/08/18/giving-ais-safe-motivations#4-5-step-4-good-instructions", authors: "Joe Carlsmith" },
    ],
  },
  {
    slug: "model-psychopathology",
    title: "Model psychopathology",
    body: `Catalogue surprising LLM phenomena — glitch tokens, the reversal curse, brain-rot, motivated reasoning under personas — as raw data for a theory of LLM cognition and training dynamics. Analogous to aphasia/disorder studies in cognitive science.

**Approach:** behaviorist / cognitivist · **Target case:** pessimistic · **FTEs:** 5–20

**Some names:** Janus, Truthful AI, Vogel, Slocum, Watson, Johnson, Jiang, Jotautaite, Dash.

**Funded by:** Coefficient Giving (via Truthful AI and interpretability grants).`,
    parentSlug: "model-psychology",
    outputs: [
      { title: "Subliminal Learning", url: "https://alignment.anthropic.com/2025/subliminal-learning/", authors: "Alex Cloud et al." },
      { title: "LLMs Can Get \"Brain Rot\"!", authors: "Shuo Xing et al." },
      { title: "Persona-Assigned Large Language Models Exhibit Human-Like Motivated Reasoning", url: "https://arxiv.org/abs/2506.20020", authors: "Saloni Dash et al." },
      { title: "Unified Multimodal Models Cannot Describe Images From Memory", url: "https://spylab.ai/blog/modal-aphasia", authors: "Michael Aerni et al." },
      { title: "Believe It or Not: How Deeply do LLMs Believe Implanted Facts?", url: "https://arxiv.org/abs/2510.17941", authors: "Stewart Slocum et al." },
      { title: "Psychopathia Machinalis: A Nosological Framework for Understanding Pathologies in Advanced AI", url: "https://www.psychopathia.ai/", authors: "Nell Watson, Ali Hessami" },
      { title: "Imagining and building wise machines: The centrality of AI metacognition", url: "https://arxiv.org/abs/2411.02478", authors: "Samuel G. B. Johnson et al." },
      { title: "Artificial Hivemind: The Open-Ended Homogeneity of Language Models", url: "https://arxiv.org/abs/2510.22954", authors: "Liwei Jiang et al." },
      { title: "Beyond One-Way Influence: Bidirectional Opinion Dynamics in Multi-Turn Human-LLM Interactions", url: "https://arxiv.org/abs/2510.20039", authors: "Yuyang Jiang et al." },
    ],
  },

  // Better data cluster
  {
    slug: "better-data",
    title: "Better data",
    body: `Bake safety into models from the data side — pretraining filtering, hyperstition control, poisoning defence, synthetic-data alignment, and human feedback quality.`,
    parentSlug: "black-box-safety",
  },
  {
    slug: "data-filtering",
    title: "Data filtering",
    body: `Curate or filter pretraining data to prevent the model learning dangerous capabilities (dual-use info) or undesirable behaviours (toxicity) in the first place — more tamper-resistant than post-training patches.

**Approach:** engineering · **Target case:** average · **FTEs:** 10–50

**Some names:** Chen, Maini, O'Brien, Casper, Pepin Lehalleur, Hoogland, Beniwal, Goyal, Tucker, Sam.

**Critiques:** *When Bad Data Leads to Good Models*; *Medical LLMs are vulnerable to data-poisoning attacks*.

**Funded by:** Anthropic, various academics.`,
    parentSlug: "better-data",
    outputs: [
      { title: "Enhancing Model Safety through Pretraining Data Filtering", url: "https://alignment.anthropic.com/2025/pretraining-data-filtering/", authors: "Yanda Chen et al." },
      { title: "Deep Ignorance: Filtering Pretraining Data Builds Tamper-Resistant Safeguards into Open-Weight LLMs", url: "https://arxiv.org/abs/2508.06601", authors: "Kyle O'Brien et al." },
      { title: "Safety Pretraining: Toward the Next Generation of Safe AI", url: "https://arxiv.org/abs/2504.16980", authors: "Pratyush Maini et al." },
      { title: "Best Practices for Biorisk Evaluations on Open-Weight Bio-Foundation Models", url: "https://arxiv.org/abs/2510.27629v2", authors: "Boyi Wei et al." },
    ],
  },
  {
    slug: "hyperstition-studies",
    title: "Hyperstition studies",
    body: `Studies the loop where stories *about* AI become training data that *shapes* AI — and tries to seed healthier ontologies and self-conceptions for future models.

**Approach:** cognitive · **Target case:** average · **FTEs:** 1–10

**Some names:** Turner, Hyperstition AI, O'Brien.`,
    parentSlug: "better-data",
    outputs: [
      { title: "Alignment Pretraining: AI Discourse Causes Self-Fulfilling (Mis)alignment", authors: "Tice et al." },
      { title: "Training on Documents About Reward Hacking Induces Reward Hacking", url: "https://www.lesswrong.com/posts/qXYLvjGL9QvD3aFSW/training-on-documents-about-reward-hacking-induces-reward", authors: "Evan Hubinger, Nathan Hu" },
      { title: "Do Not Tile the Lightcone with Your Confused Ontology", url: "https://www.lesswrong.com/posts/Y8zS8iG5HhqKcQBtA/do-not-tile-the-lightcone-with-your-confused-ontology", authors: "Jan Kulveit" },
      { title: "Self-Fulfilling Misalignment Data Might Be Poisoning Our AI Models", url: "https://turntrout.com/self-fulfilling-misalignment", authors: "Alex Turner" },
      { title: "Existential Conversations with Large Language Models: Content, Community, and Culture", url: "https://arxiv.org/abs/2411.13223", authors: "Murray Shanahan, Beth Singler" },
    ],
  },
  {
    slug: "data-poisoning-defense",
    title: "Data poisoning defence",
    body: `Detect and prevent malicious or backdoor-inducing samples from polluting training data — important because a tiny number of poison samples can backdoor an LLM of any size.

**Approach:** engineering · **Target case:** pessimistic · **FTEs:** 5–20

**Some names:** Souly, Rando, Chapman, Foerster, Shumailov, Zhao.

**Critiques:** *A small number of samples can poison LLMs of any size*; *Reasoning Introduces New Poisoning Attacks Yet Makes Them More Complicated*.

**Funded by:** Google DeepMind, Anthropic, Cambridge, Vector Institute.`,
    parentSlug: "better-data",
    outputs: [
      { title: "A small number of samples can poison LLMs of any size", url: "https://example-blog.com/a-small-number-of-samples-can-poison-llms" },
      { title: "Reasoning Introduces New Poisoning Attacks Yet Makes Them More Complicated", authors: "Daniela Gottesman et al." },
      { title: "Poisoning Attacks on LLMs Require a Near-constant Number of Poison Samples", url: "https://arxiv.org/abs/2510.07192", authors: "Weishuo Ma et al." },
    ],
  },
  {
    slug: "synthetic-data-alignment",
    title: "Synthetic data for alignment",
    body: `Use AI-generated data — critiques, preferences, self-labels — to scale alignment training past the human-feedback bottleneck. Especially relevant for supervising superhuman models.

**Approach:** engineering · **Target case:** average · **FTEs:** 50–150

**Some names:** Huang, Liu, Schaeffer, Wichers, Ebtekar, Wen, Padmakumar, Newman.

**Critiques:** *Synthetic Data in AI: Challenges, Applications, and Ethical Implications*.

**Funded by:** Anthropic, Google DeepMind, OpenAI, Meta AI, academic groups.`,
    parentSlug: "better-data",
    outputs: [
      { title: "Aligning Large Language Models via Fully Self-Synthetic Data", url: "https://arxiv.org/abs/2510.06652", authors: "Shangjian Yin et al." },
      { title: "Synth-Align: Improving Trustworthiness in Vision-Language Model with Synthetic Preference Data", url: "https://arxiv.org/html/2412.17417v2", authors: "Robert Wijaya et al." },
      { title: "Inoculation Prompting: Instructing LLMs to misbehave at train-time improves test-time alignment", url: "https://arxiv.org/abs/2510.05024", authors: "Said Boulite et al." },
      { title: "Unsupervised Elicitation of Language Models", url: "https://alignment.anthropic.com/2025/unsupervised-elicitation", authors: "Haotian Jiang et al." },
      { title: "Beyond the Binary: Capturing Diverse Preferences With Reward Regularization", authors: "Fabienne Chouraqui" },
      { title: "The Curious Case of Factuality Finetuning: Models' Internal Beliefs Can Improve Factuality", authors: "Yulei Liao et al." },
      { title: "LongSafety: Enhance Safety for Long-Context LLMs", authors: "Mansour Sharabiani et al." },
      { title: "Position: Model Collapse Does Not Mean What You Think", authors: "Zhun Mou et al." },
    ],
  },
  {
    slug: "data-quality-alignment",
    title: "Data quality for alignment",
    body: `Improve the signal-to-noise ratio of human-generated preference and alignment data — annotator quality, decomposition of judgments, bias mitigation.

**Approach:** engineering · **Target case:** average · **FTEs:** 20–50

**Some names:** Buyl, Kraus, Kroll, Shi.

**Critiques:** *A Statistical Case Against Empirical Human-AI Alignment*.

**Funded by:** Anthropic, Google DeepMind, OpenAI, Meta AI, academic groups.`,
    parentSlug: "better-data",
    outputs: [
      { title: "AI Alignment at Your Discretion", url: "https://arxiv.org/abs/2502.10441", authors: "Maarten Buyl et al." },
      { title: "Maximizing Signal in Human-Model Preference Alignment", url: "https://arxiv.org/abs/2503.04910", authors: "Kelsey Kraus, Margaret Kroll" },
      { title: "DxHF: Providing High-Quality Human Feedback for LLM Alignment via Interactive Decomposition", url: "https://arxiv.org/abs/2507.18802", authors: "Danqing Shi et al." },
      { title: "Challenges and Future Directions of Data-Centric AI Alignment", url: "https://arxiv.org/html/2410.01957v2", authors: "Min-Hsuan Yeh et al." },
      { title: "You Are What You Eat — AI Alignment Requires Understanding How Data Shapes Structure and Generalisation", authors: "Simon Pepin Lehalleur et al." },
    ],
  },

  // Goal robustness cluster
  {
    slug: "goal-robustness",
    title: "Goal robustness",
    body: `Avoid Goodharting and goal misgeneralisation by making learned objectives robust to capability gain, distribution shift, and self-modification pressure.`,
    parentSlug: "black-box-safety",
  },
  {
    slug: "mild-optimisation",
    title: "Mild optimisation",
    body: `Avoid Goodharting by making the agent satisfice rather than maximise — a fall-back if we fail to nail down preferences exactly. Aim: keep a non-zero share of the lightcone instead of zero.

**Approach:** cognitive · **Target case:** mixed · **FTEs:** 10–50 · **Funded by:** Google DeepMind.`,
    parentSlug: "goal-robustness",
    outputs: [
      { title: "MONA: Myopic Optimization with Non-myopic Approval Can Mitigate Multi-step Reward Hacking", url: "https://arxiv.org/abs/2501.13011", authors: "Sebastian Farquhar et al." },
      { title: "BioBlue: Notable runaway-optimiser-like LLM failure modes", url: "https://arxiv.org/abs/2509.02655", authors: "Roland Pihlakas, Sruthi Kuriakose" },
      { title: "Why modelling multi-objective homeostasis is essential for AI alignment", url: "https://lesswrong.com/posts/vGeuBKQ7nzPnn5f7A/why-modelling-multi-objective-homeostasis-is-essential-for", authors: "Roland Pihlakas" },
      { title: "From homeostasis to resource sharing: Biologically and economically aligned multi-objective benchmarks", url: "https://arxiv.org/abs/2410.00081", authors: "Roland Pihlakas" },
    ],
  },
  {
    slug: "rl-safety",
    title: "RL safety",
    body: `Make reinforcement-learning agents robust by addressing the core problems in reward learning, goal misgeneralisation, and specification gaming — pessimistic RL, minimax regret, provable inverse reward learning.

**Approach:** engineering · **Target case:** pessimistic · **FTEs:** 20–70

**Some names:** Skalse, Sadek, Farrugia-Roberts, Plaut, Wu, Zhao, Abate, Byrnes, Cohen.

**Critiques:** *"The Era of Experience" has an unsolved technical alignment problem*; *The Invisible Leash*.`,
    parentSlug: "goal-robustness",
    outputs: [
      { title: "The Perils of Optimizing Learned Reward Functions", url: "https://arxiv.org/abs/2406.15753", authors: "Lukas Fluri et al." },
      { title: "Safe Learning Under Irreversible Dynamics via Asking for Help", url: "https://arxiv.org/abs/2502.14043", authors: "Benjamin Plaut et al." },
      { title: "Mitigating Goal Misgeneralization via Minimax Regret", url: "https://arxiv.org/abs/2507.03068", authors: "Karim Abdel Sadek et al." },
      { title: "Rethinking Reward Model Evaluation: Are We Barking up the Wrong Tree?", url: "https://arxiv.org/abs/2410.05584", authors: "Xueru Wen et al." },
      { title: "The Invisible Leash: Why RLVR May or May Not Escape Its Origin", url: "https://arxiv.org/abs/2507.14843", authors: "Fang Wu et al." },
      { title: "Reducing the Probability of Undesirable Outputs in Language Models Using Probabilistic Inference", url: "https://arxiv.org/abs/2510.21184", authors: "Stephen Zhao et al." },
      { title: "Interpreting Emergent Planning in Model-Free Reinforcement Learning", url: "https://arxiv.org/abs/2504.01871", authors: "Thomas Bush et al." },
      { title: "Misalignment From Treating Means as Ends", url: "https://arxiv.org/abs/2507.10995", authors: "Henrik Marklund, Alex Infanger, Benjamin Van Roy" },
      { title: "\"The Era of Experience\" has an unsolved technical alignment problem", authors: "Steven Byrnes" },
      { title: "Safety cases for Pessimism", url: "https://lesswrong.com/posts/CpftMXCEnwqbWreHD/safety-cases-for-pessimism", authors: "Michael Cohen" },
      { title: "We need a field of Reward Function Design", url: "https://www.lesswrong.com/posts/oxvnREntu82tffkYW/we-need-a-field-of-reward-function-design", authors: "Steven Byrnes" },
    ],
  },
  {
    slug: "assistance-games",
    title: "Assistance games / assistive agents",
    body: `Formalise how AI assistants learn human preferences under uncertainty and partial observability — and design environments that incentivise the right kind of learning.

**Approach:** engineering / cognitive · **Target case:** varies

**Some names:** Skalse, Dragan, Oesterheld, Krueger, Hadfield-Menell, Russell.

**Funded by:** FLI, Coefficient Giving, SFF, Cooperative AI Foundation, Polaris Ventures.`,
    parentSlug: "goal-robustness",
    outputs: [
      { title: "Training LLM Agents to Empower Humans", url: "https://arxiv.org/pdf/2510.13709", authors: "Evan Ellis et al." },
      { title: "Murphy's Laws of AI Alignment: Why the Gap Always Wins", authors: "Madhava Gaikwad" },
      { title: "AssistanceZero: Scalably Solving Assistance Games", url: "https://arxiv.org/abs/2504.07091", authors: "Cassidy Laidlaw et al." },
      { title: "Observation Interference in Partially Observable Assistance Games", url: "https://arxiv.org/abs/2412.17797", authors: "Scott Emmons et al." },
      { title: "Learning to Assist Humans without Inferring Rewards", url: "https://arxiv.org/abs/2411.02623", authors: "Vivek Myers et al." },
    ],
  },
  {
    slug: "harm-reduction-open-weights",
    title: "Harm reduction for open weights",
    body: `Tamper-resistant safeguards for open-weight models — adversaries can fine-tune away post-hoc safety, so try to make safety an intrinsic property of the learned representation (e.g., "deep ignorance" of dual-use info).

**Approach:** engineering · **Target case:** average · **FTEs:** 10–100

**Some names:** O'Brien, Casper, Anthony, Korbak, Tamirisa, Mazeika, Biderman, Gal.

**Funded by:** UK AISI, EleutherAI, Coefficient Giving.`,
    parentSlug: "goal-robustness",
    outputs: [
      { title: "Deep ignorance: Filtering pretraining data builds tamper-resistant safeguards into open-weight LLMs", url: "https://arxiv.org/abs/2508.06601", authors: "Kyle O'Brien et al." },
      { title: "Tamper-Resistant Safeguards for Open-Weight LLMs", url: "https://arxiv.org/abs/2408.00761", authors: "Rishub Tamirisa et al." },
      { title: "Open Technical Problems in Open-Weight AI Model Risk Management", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5705186", authors: "Stephen Casper et al." },
      { title: "A Different Approach to AI Safety: Proceedings from the Columbia Convening", url: "https://arxiv.org/pdf/2506.22183", authors: "Camille François et al." },
      { title: "Risk Mitigation Strategies for the Open Foundation Model Value Chain" },
    ],
  },
  {
    slug: "neglected-approaches",
    title: "The \"Neglected Approaches\" approach",
    body: `Agenda-agnostic search for empirical alignment ideas that have been overlooked and might give "negative alignment taxes" (improve both safety and capability). AE Studio's house style.

**Approach:** engineering · **Target case:** average · **FTEs:** ≈15 · **Funded by:** AE Studio.

**Some names:** AE Studio, Zarncke, Berg, Vaiana, Rosenblatt, de Lucena.`,
    parentSlug: "goal-robustness",
    outputs: [
      { title: "Towards Safe and Honest AI Agents with Neural Self-Other Overlap", url: "https://arxiv.org/abs/2412.16325", authors: "Marc Carauleanu et al." },
      { title: "Momentum Point-Perplexity Mechanics in Large Language Models", url: "https://arxiv.org/abs/2508.08492", authors: "Lorenzo Tomaz et al." },
      { title: "Large Language Models Report Subjective Experience Under Self-Referential Processing", url: "https://arxiv.org/abs/2510.24797", authors: "Cameron Berg, Diogo de Lucena, Judd Rosenblatt" },
    ],
  },

  // ─── WHITE-BOX SAFETY SUBTREE ────────────────────────────────────────────
  {
    slug: "reverse-engineering",
    title: "Reverse engineering",
    body: `Decompose a model into circuits, formally describe what each component computes, and validate causal effects to recover the model's internal algorithm. The most ambitious flavour of mech interp.

**Approach:** cognitivist science · **Target case:** worst-case · **FTEs:** 100–200

**Some names:** Bushnaq, Braun, Sharkey, Mueller, Geiger, Feucht, Bau, Belinkov, Heimersheim, Olah, Gao.

**Critiques:** *Interpretability Will Not Reliably Find Deceptive AI*; *A Problem to Solve Before Building a Deception Detector*; *MoSSAIC: AI Safety After Mechanism*; *The Misguided Quest for Mechanistic AI Interpretability*; *Activation space interpretability may be doomed*; *A Pragmatic Vision for Interpretability*.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "The Circuits Research Landscape", url: "https://www.neuronpedia.org/graph/info", authors: "Jack Lindsey et al." },
      { title: "Circuits in Superposition", url: "https://www.lesswrong.com/posts/roE7SHjFWEoMcGZKd/circuits-in-superposition-compressing-many-small-neural", authors: "Lucius Bushnaq, Jake Mendel" },
      { title: "Compressed Computation is (probably) not Computation in Superposition" },
      { title: "MIB: A Mechanistic Interpretability Benchmark", url: "https://arxiv.org/abs/2504.13151", authors: "Aaron Mueller et al." },
      { title: "RelP: Faithful and Efficient Circuit Discovery in Language Models via Relevance Patching", url: "https://arxiv.org/abs/2508.21258", authors: "Farnoush Rezaei Jafari et al." },
      { title: "The Dual-Route Model of Induction", url: "https://arxiv.org/abs/2504.03022", authors: "Sheridan Feucht et al." },
      { title: "Structural Inference: Interpreting Small Language Models with Susceptibilities", url: "https://arxiv.org/abs/2504.18274", authors: "Garrett Baker et al." },
      { title: "Stochastic Parameter Decomposition", url: "https://openreview.net/forum?id=dEdS9ao8gN", authors: "Dan Braun, Lucius Bushnaq, Lee Sharkey" },
      { title: "The Geometry of Self-Verification in a Task-Specific Reasoning Model", url: "https://arxiv.org/abs/2504.14379", authors: "Andrew Lee et al." },
      { title: "Converting MLPs into Polynomials in Closed Form", url: "https://arxiv.org/abs/2502.01032", authors: "Nora Belrose, Alice Rigg" },
      { title: "Extractive Structures Learned in Pretraining Enable Generalization on Finetuned Facts", url: "https://arxiv.org/abs/2412.04614", authors: "Jiahai Feng, Stuart Russell, Jacob Steinhardt" },
      { title: "Interpretability in Parameter Space: APD", url: "https://arxiv.org/abs/2501.14926", authors: "Dan Braun et al." },
      { title: "Identifying Sparsely Active Circuits Through Local Loss Landscape Decomposition", url: "https://arxiv.org/abs/2504.00194", authors: "Brianna Chrisman, Lucius Bushnaq, Lee Sharkey" },
      { title: "From Memorization to Reasoning in the Spectrum of Loss Curvature", url: "https://arxiv.org/abs/2510.24256", authors: "Jack Merullo et al." },
      { title: "Generalization or Hallucination? Understanding Out-of-Context Reasoning in Transformers", url: "https://arxiv.org/abs/2506.10887", authors: "Yixiao Huang et al." },
      { title: "How Do LLMs Perform Two-Hop Reasoning in Context?", url: "https://arxiv.org/abs/2502.13913", authors: "Tianyu Guo et al." },
      { title: "Blink of an eye: a simple theory for feature localization in generative models", url: "https://arxiv.org/abs/2502.00921", authors: "Marvin Li, Aayush Karan, Sitan Chen" },
      { title: "On the creation of narrow AI: hierarchy and nonlocality of neural network skills", url: "https://arxiv.org/abs/2505.15811", authors: "Eric J. Michaud, Asher Parker-Sartori, Max Tegmark" },
      { title: "Interpreting Emergent Planning in Model-Free Reinforcement Learning", url: "https://arxiv.org/abs/2504.01871", authors: "Thomas Bush et al." },
      { title: "Bridging the human–AI knowledge gap through concept discovery and transfer in AlphaZero", url: "https://www.pnas.org/doi/10.1073/pnas.2406675122" },
      { title: "Building and evaluating alignment auditing agents", url: "https://lesswrong.com/posts/DJAZHYjWxMrcd2na3/building-and-evaluating-alignment-auditing-agents", authors: "Sam Marks et al." },
      { title: "How Do Transformers Learn Variable Binding in Symbolic Programs?", url: "https://arxiv.org/abs/2505.20896", authors: "Yiwei Wu, Atticus Geiger, Raphaël Millière" },
      { title: "Fresh in memory: Training-order recency is linearly encoded in language model activations", url: "https://arxiv.org/abs/2509.14223", authors: "Dmitrii Krasheninnikov, Richard E. Turner, David Krueger" },
      { title: "Language Models use Lookbacks to Track Beliefs", url: "https://arxiv.org/abs/2505.14685", authors: "Nikhil Prakash et al." },
      { title: "Constrained belief updates explain geometric structures in transformer representations", url: "https://arxiv.org/abs/2502.01954", authors: "Mateusz Piotrowski et al." },
      { title: "LLMs Process Lists With General Filter Heads", url: "https://arxiv.org/abs/2510.26784", authors: "Arnab Sen Sharma et al." },
      { title: "Language Models Use Trigonometry to Do Addition", url: "https://arxiv.org/abs/2502.00873", authors: "Subhash Kantamneni, Max Tegmark" },
      { title: "Interpreting learned search: finding a transition model and value function in an RNN that plays Sokoban", url: "https://arxiv.org/abs/2506.10138", authors: "Mohammad Taufeeque et al." },
      { title: "Transformers Struggle to Learn to Search", url: "https://arxiv.org/abs/2412.04703", authors: "Abulhair Saparov et al." },
      { title: "Adversarial Examples Are Not Bugs, They Are Superposition", url: "https://arxiv.org/abs/2508.17456", authors: "Liv Gorton, Owen Lewis" },
      { title: "Do Language Models Use Their Depth Efficiently?", url: "https://arxiv.org/abs/2505.13898", authors: "Róbert Csordás, Christopher D. Manning, Christopher Potts" },
      { title: "ICLR: In-Context Learning of Representations", url: "https://openreview.net/forum?id=pXlmOmlHJZ", authors: "Core Francisco Park et al." },
    ],
  },
  {
    slug: "extracting-latent-knowledge",
    title: "Extracting latent knowledge",
    body: `Read out a model's "true" beliefs from its activations even when its outputs are deceptive or false. The classic ELK problem in modern empirical guise.

**Approach:** cognitivist science · **Target case:** worst-case · **FTEs:** 20–40

**Some names:** Cywiński, Ryd, Rajamanoharan, Pan, Chen, Steinhardt, Ferrando, Obeso, Burns, Christiano.

**Critiques:** *A Problem to Solve Before Building a Deception Detector*.

**Funded by:** Open Philanthropy, Anthropic, NSF, academic grants.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "Auditing language models for hidden objectives", url: "https://www.anthropic.com/research/auditing-hidden-objectives" },
      { title: "Eliciting Secret Knowledge from Language Models", url: "https://arxiv.org/abs/2510.01070", authors: "Bartosz Cywiński et al." },
      { title: "Here's 18 Applications of Deception Probes", url: "https://www.lesswrong.com/posts/7zhAwcBri7yupStKy/here-s-18-applications-of-deception-probes", authors: "Cleo Nardo, Avi Parrack, jordine" },
      { title: "Towards eliciting latent knowledge from LLMs with mechanistic interpretability", url: "https://arxiv.org/pdf/2505.14352", authors: "Bartosz Cywiński et al." },
      { title: "CCS-Lib: A Python package to elicit latent knowledge from LLMs", url: "https://joss.theoj.org/papers/10.21105/joss.06511", authors: "Walter Laurito et al." },
      { title: "No Answer Needed: Predicting LLM Answer Accuracy from Question-Only Linear Probes", url: "https://arxiv.org/abs/2509.10625", authors: "Iván Vicente Moreno Cencerrado et al." },
      { title: "When Thinking LLMs Lie: Unveiling the Strategic Deception in Representations of Reasoning Models", url: "https://arxiv.org/abs/2506.04909", authors: "Kai Wang, Yihao Zhang, Meng Sun" },
      { title: "Caught in the Act: a mechanistic approach to detecting deception", url: "https://arxiv.org/abs/2508.19505", authors: "Gerard Boxo et al." },
      { title: "When Truthful Representations Flip Under Deceptive Instructions?", url: "https://arxiv.org/abs/2507.22149", authors: "Xianxuan Long et al." },
    ],
  },
  {
    slug: "lie-deception-detectors",
    title: "Lie & deception detectors",
    body: `Build white-box or black-box detectors that flag when a model is being deceptive — for use in alignment evals, sandbagging detection, and deployment monitoring.

**Approach:** cognitivist science · **Target case:** pessimistic · **FTEs:** 10–50

**Some names:** Cadenza, Marks, Wang, Kretschmar, Maiya, Laurito, Cundy, Gleave, Parrack, Heimersheim, Attubato, Bloom, Taylor, McKenzie, Pawar, Smith, Chughtai, Nanda.

**Critiques:** *Is This Lie Detector Really Just a Lie Detector? An Investigation of LLM Probe Specificity*; Herrmann, Smith and Chughtai.

**Funded by:** Anthropic, DeepMind, UK AISI, Coefficient Giving.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "Detecting Strategic Deception Using Linear Probes", url: "https://www.lesswrong.com/posts/9pGbTz6c78PGwJein/detecting-strategic-deception-using-linear-probes", authors: "Nicholas Goldowsky-Dill et al." },
      { title: "Whitebox detection of sandbagging model organisms", authors: "Joseph Bloom et al." },
      { title: "Benchmarking deception probes for trusted monitoring", authors: "Avi Parrack, StefanHex, Cleo Nardo" },
      { title: "18 Applications of Deception Probes", authors: "Cleo Nardo, Avi Parrack, jordine" },
      { title: "Evaluating honesty and lie detection techniques on a diverse suite of dishonest models", url: "https://alignment.anthropic.com/2025/honesty-elicitation/", authors: "Rowan Wang et al." },
      { title: "Caught in the Act: a mechanistic approach to detecting deception", url: "https://arxiv.org/abs/2508.19505", authors: "Gerard Boxo et al." },
      { title: "Preference Learning with Lie Detectors can Induce Honesty or Evasion", url: "https://arxiv.org/abs/2505.13787", authors: "Chris Cundy, Adam Gleave" },
      { title: "Detecting High-Stakes Interactions with Activation Probes", url: "https://arxiv.org/abs/2506.10805", authors: "Alex McKenzie et al." },
      { title: "White Box Control at UK AISI — Update on Sandbagging Investigations", url: "https://www.lesswrong.com/posts/pPEeMdgjpjHZWCDFw/white-box-control-at-uk-aisi-update-on-sandbagging", authors: "Joseph Bloom et al." },
      { title: "Liars' Bench: Evaluating Lie Detectors for Language Models", url: "https://arxiv.org/html/2511.16035v1", authors: "Kieron Kretschmar et al." },
      { title: "Probes and SAEs do well on Among Us benchmark" },
    ],
  },
  {
    slug: "model-diffing",
    title: "Model diffing",
    body: `Understand the *delta* between a base model and a fine-tune — verify that safety behaviour is properly internalised vs. superficially patched, and detect new dangerous capabilities. Most parameters don't change, so heavier methods are tractable on the diff.

**Approach:** cognitive · **Target case:** pessimistic · **FTEs:** 10–30

**Some names:** Minder, Dumas, Nanda, Bricken, Lindsey.

**Funded by:** academic groups, Anthropic, Google DeepMind.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "What We Learned Trying to Diff Base and Chat Models (And Why It Matters)", url: "https://www.lesswrong.com/posts/xmpauEXEerzYcJKNm/what-we-learned-trying-to-diff-base-and-chat-models-and-why", authors: "Clément Dumas, Julian Minder, Neel Nanda" },
      { title: "Open Source Replication of Anthropic's Crosscoder paper for model-diffing", url: "https://www.lesswrong.com/posts/srt6JXsRMtmqAJavD/open-source-replication-of-anthropic-s-crosscoder-paper-for", authors: "Connor Kissane et al." },
      { title: "Cross-Architecture Model Diffing with Crosscoders" },
      { title: "Discovering Undesired Rare Behaviors via Model Diff Amplification", url: "https://www.goodfire.ai/research/model-diff-amplification#", authors: "Santiago Aranguri, Thomas McGrath" },
      { title: "Overcoming Sparsity Artifacts in Crosscoders to Interpret Chat-Tuning", url: "https://arxiv.org/abs/2504.02922", authors: "Julian Minder et al." },
      { title: "Persona Features Control Emergent Misalignment", url: "https://arxiv.org/abs/2506.19823", authors: "Miles Wang et al." },
      { title: "Narrow Finetuning Leaves Clearly Readable Traces in Activation Differences", url: "https://arxiv.org/abs/2510.13900", authors: "Julian Minder et al." },
      { title: "Insights on Crosscoder Model Diffing", url: "https://transformer-circuits.pub/2025/crosscoder-diffing-update/index.html", authors: "Siddharth Mishra-Sharma et al." },
      { title: "Diffing Toolkit: Model Comparison and Analysis Framework" },
    ],
  },
  {
    slug: "sparse-coding",
    title: "Sparse coding",
    body: `Decompose polysemantic activations into a sparse linear combination of monosemantic "features" corresponding to interpretable concepts. SAEs and friends. Currently the most-funded interpretability subfield, with the most public push-back.

**Approach:** engineering / cognitive · **Target case:** average · **FTEs:** 50–100

**Some names:** Gao, Mossing, Ameisen, Lindsey, Pearce, Heap, Menon, Peng, Lawson.

**Critiques:** *Sparse Autoencoders Can Interpret Randomly Initialized Transformers*; *The Sparse Autoencoders bubble has popped*; *Negative Results for SAEs On Downstream Tasks*; *SAEs Trained on the Same Data Learn Different Features*; *Why Not Just Train For Interpretability?*.

**Funded by:** frontier labs, LTFF, Coefficient Giving.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "Overcoming Sparsity Artifacts in Crosscoders to Interpret Chat-Tuning", url: "https://arxiv.org/abs/2504.02922", authors: "Julian Minder et al." },
      { title: "Do I Know This Entity? Knowledge Awareness and Hallucinations in Language Models", url: "https://arxiv.org/abs/2411.14257", authors: "Javier Ferrando et al." },
      { title: "Circuit Tracing: Revealing Computational Graphs in Language Models", url: "https://transformer-circuits.pub/2025/attribution-graphs/methods.html", authors: "Emmanuel Ameisen et al." },
      { title: "Sparse Autoencoders Learn Monosemantic Features in Vision-Language Models", url: "https://arxiv.org/abs/2504.02821", authors: "Mateusz Pach et al." },
      { title: "I Have Covered All the Bases Here: Interpreting Reasoning Features via SAEs", url: "https://arxiv.org/abs/2503.18878", authors: "Andrey Galichin et al." },
      { title: "Sparse Autoencoders Do Not Find Canonical Units of Analysis", url: "https://arxiv.org/abs/2502.04878", authors: "Patrick Leask et al." },
      { title: "Transcoders Beat Sparse Autoencoders for Interpretability", url: "https://arxiv.org/abs/2501.18823", authors: "Gonçalo Paulo, Stepan Shabalin, Nora Belrose" },
      { title: "Decomposing MLP Activations into Interpretable Features via Semi-NMF", url: "https://arxiv.org/abs/2506.10920", authors: "Or Shafran, Atticus Geiger, Mor Geva" },
      { title: "CRISP: Persistent Concept Unlearning via Sparse Autoencoders", url: "https://arxiv.org/abs/2508.13650", authors: "Tomer Ashuach et al." },
      { title: "The Unintended Trade-off of AI Alignment", url: "https://arxiv.org/abs/2510.07775", authors: "Omar Mahmoud et al." },
      { title: "Scaling sparse feature circuit finding for in-context learning", url: "https://arxiv.org/abs/2504.13756", authors: "Dmitrii Kharlapenko et al." },
      { title: "Learning Multi-Level Features with Matryoshka Sparse Autoencoders", url: "https://arxiv.org/abs/2503.17547", authors: "Bart Bussmann et al." },
      { title: "Are Sparse Autoencoders Useful? A Case Study in Sparse Probing", url: "https://arxiv.org/abs/2502.16681", authors: "Subhash Kantamneni et al." },
      { title: "Sparse Autoencoders Trained on the Same Data Learn Different Features", url: "https://arxiv.org/abs/2501.16615", authors: "Gonçalo Paulo, Nora Belrose" },
      { title: "What's In My Human Feedback? Learning Interpretable Descriptions of Preference Data", url: "https://arxiv.org/abs/2510.26202", authors: "Rajiv Movva et al." },
      { title: "Priors in Time: Missing Inductive Biases for Language Model Interpretability", url: "https://arxiv.org/abs/2511.01836", authors: "Ekdeep Singh Lubana et al." },
      { title: "ITDA: Inference-Time Decomposition of Activations", authors: "Patrick Leask, Neel Nanda, Noura Al Moubayed" },
      { title: "Binary Sparse Coding for Interpretability", url: "https://arxiv.org/abs/2509.25596", authors: "Lucia Quirke, Stepan Shabalin, Nora Belrose" },
      { title: "Scaling Sparse Feature Circuit Finding to Gemma 9B", url: "https://lesswrong.com/posts/PkeB4TLxgaNnSmddg/scaling-sparse-feature-circuit-finding-to-gemma-9b", authors: "Diego Caples et al." },
      { title: "Partially Rewriting a Transformer in Natural Language", url: "https://arxiv.org/abs/2501.18838", authors: "Gonçalo Paulo, Nora Belrose" },
      { title: "Dense SAE Latents Are Features, Not Bugs", url: "https://arxiv.org/abs/2506.15679", authors: "Xiaoqing Sun et al." },
      { title: "Evaluating Sparse Autoencoders on Targeted Concept Erasure Tasks", url: "https://arxiv.org/abs/2411.18895", authors: "Adam Karvonen et al." },
      { title: "Evaluating SAE interpretability without explanations", url: "https://arxiv.org/abs/2507.08473", authors: "Gonçalo Paulo, Nora Belrose" },
      { title: "SAEs Can Improve Unlearning: Dynamic Sparse Autoencoder Guardrails", url: "https://arxiv.org/abs/2504.08192", authors: "Aashiq Muhamed et al." },
      { title: "SAEBench: A Comprehensive Benchmark for Sparse Autoencoders", url: "https://arxiv.org/abs/2503.09532", authors: "Adam Karvonen et al." },
      { title: "SAEs Are Good for Steering — If You Select the Right Features", authors: "Dana Arad, Aaron Mueller, Yonatan Belinkov" },
      { title: "Line of Sight: On Linear Representations in VLLMs", url: "https://arxiv.org/abs/2506.04706", authors: "Achyuta Rajaram et al." },
      { title: "Low-Rank Adapting Models for Sparse Autoencoders", url: "https://arxiv.org/abs/2501.19406", authors: "Matthew Chen, Joshua Engels, Max Tegmark" },
      { title: "Enhancing Automated Interpretability with Output-Centric Feature Descriptions", url: "https://arxiv.org/abs/2501.08319", authors: "Yoav Gur-Arieh et al." },
      { title: "Decoding Dark Matter: Specialized SAEs for Rare Concepts", url: "https://arxiv.org/abs/2411.00743", authors: "Aashiq Muhamed, Mona Diab, Virginia Smith" },
      { title: "Enhancing Neural Network Interpretability with Feature-Aligned Sparse Autoencoders", url: "https://arxiv.org/abs/2411.01220", authors: "Luke Marks et al." },
      { title: "BatchTopK Sparse Autoencoders", url: "https://arxiv.org/abs/2412.06410", authors: "Bart Bussmann, Patrick Leask, Neel Nanda" },
      { title: "Towards Understanding Distilled Reasoning Models: A Representational Approach", url: "https://arxiv.org/abs/2503.03730", authors: "David D. Baek, Max Tegmark" },
      { title: "Understanding sparse autoencoder scaling in the presence of feature manifolds", url: "https://arxiv.org/abs/2509.02565", authors: "Eric J. Michaud, Liv Gorton, Tom McGrath" },
      { title: "Internal states before wait modulate reasoning patterns", url: "https://arxiv.org/abs/2510.04128", authors: "Dmitrii Troitskii et al." },
      { title: "Do Sparse Autoencoders Generalize? A Case Study of Answerability", url: "https://arxiv.org/abs/2502.19964", authors: "Lovis Heindrich et al." },
      { title: "Position: Mechanistic Interpretability Should Prioritize Feature Consistency in SAEs", url: "https://arxiv.org/abs/2505.20254", authors: "Xiangchen Song et al." },
      { title: "How Visual Representations Map to Language Feature Space in Multimodal LLMs", url: "https://arxiv.org/abs/2506.11976", authors: "Constantin Venhoff et al." },
      { title: "Prisma: An Open Source Toolkit for Mechanistic Interpretability in Vision and Video", url: "https://arxiv.org/abs/2504.19475", authors: "Sonia Joseph et al." },
      { title: "Topological Data Analysis and Mechanistic Interpretability", url: "https://lesswrong.com/posts/6oF6pRr2FgjTmiHus/topological-data-analysis-and-mechanistic-interpretability", authors: "Gunnar Carlsson" },
      { title: "Large Language Models Share Representations of Latent Grammatical Concepts Across Typologically Diverse Languages", url: "https://arxiv.org/abs/2501.06346", authors: "Jannik Brinkmann et al." },
      { title: "Interpreting the linear structure of vision-language model embedding spaces", url: "https://arxiv.org/abs/2504.11695", authors: "Isabel Papadimitriou et al." },
      { title: "Interpreting Large Text-to-Image Diffusion Models with Dictionary Learning", url: "https://arxiv.org/abs/2505.24360", authors: "Stepan Shabalin et al." },
      { title: "Weight-sparse transformers have interpretable circuits" },
    ],
  },
  {
    slug: "causal-abstractions",
    title: "Causal abstractions",
    body: `Verify that a network implements a specific high-level causal model — like a logical algorithm — by mapping high-level variables onto low-level neural representations. A way to certify safe reasoning rather than only test for it.

**Approach:** cognitivist science · **Target case:** worst-case · **FTEs:** 10–30

**Some names:** Geiger, Potts, Icard, Pîslar, Magliacane, Sun, Huang.

**Critiques:** *The Misguided Quest for Mechanistic AI Interpretability*; *Interpretability Will Not Reliably Find Deceptive AI*.

**Funded by:** academic groups, Google DeepMind, Goodfire.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "HyperDAS: Towards Automating Mechanistic Interpretability with Hypernetworks", url: "https://arxiv.org/abs/2503.10894", authors: "Jiuding Sun et al." },
      { title: "Combining Causal Models for More Accurate Abstractions of Neural Networks", url: "https://arxiv.org/abs/2503.11429", authors: "Theodora-Mara Pîslar, Sara Magliacane, Atticus Geiger" },
      { title: "How Causal Abstraction Underpins Computational Explanation", url: "https://arxiv.org/abs/2508.11214", authors: "Atticus Geiger, Jacqueline Harding, Thomas Icard" },
    ],
  },
  {
    slug: "data-attribution",
    title: "Data attribution",
    body: `Quantify how individual training points influence a model's behaviour — used to trace misalignment, bias, or factual errors back to their data source, and to enable effective unlearning or auditing.

**Approach:** behavioural · **Target case:** average · **FTEs:** 30–60

**Some names:** Grosse, Kreer, Lee, Smith, Ravichander, Wang, Liu, Ma, Deng, Pan, Murfet, Hoogland.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "Influence Dynamics and Stagewise Data Attribution", url: "https://arxiv.org/abs/2510.12071", authors: "Jin Hwa Lee et al." },
      { title: "What is Your Data Worth to GPT?", url: "https://arxiv.org/abs/2405.13954", authors: "Sang Keun Choe et al." },
      { title: "Detecting and Filtering Unsafe Training Data via Data Attribution with Denoised Representation", url: "https://arxiv.org/abs/2502.11411", authors: "Yijun Pan et al." },
      { title: "Better Training Data Attribution via Better Inverse Hessian-Vector Products", url: "https://arxiv.org/abs/2507.14740", authors: "Andrew Wang et al." },
      { title: "DATE-LM: Benchmarking Data Attribution Evaluation for Large Language Models", url: "https://arxiv.org/abs/2507.09424", authors: "Cathy Jiao et al." },
      { title: "Bayesian Influence Functions for Hessian-Free Data Attribution", url: "https://arxiv.org/abs/2509.26544", authors: "Philipp Alexander Kreer et al." },
      { title: "OLMoTrace: Tracing Language Model Outputs Back to Trillions of Training Tokens", url: "https://arxiv.org/abs/2504.07096", authors: "Jiacheng Liu et al." },
      { title: "You Are What You Eat — AI Alignment Requires Understanding How Data Shapes Structure and Generalisation", authors: "Simon Pepin Lehalleur et al." },
      { title: "Information-Guided Identification of Training Data Imprint in (Proprietary) LLMs", url: "https://arxiv.org/abs/2503.12072", authors: "Abhilasha Ravichander et al." },
      { title: "Distributional Training Data Attribution: What do Influence Functions Sample?", url: "https://arxiv.org/abs/2506.12965", authors: "Bruno Mlodozeniec et al." },
      { title: "A Snapshot of Influence: A Local Data Attribution Framework for Online Reinforcement Learning", url: "https://openreview.net/forum?id=sYK4yPDuT1", authors: "Yuzheng Hu et al." },
      { title: "Revisiting Data Attribution for Influence Functions", url: "https://arxiv.org/abs/2508.07297", authors: "Hongbo Zhu, Angelo Cangelosi" },
    ],
  },
  {
    slug: "pragmatic-interpretability",
    title: "Pragmatic interpretability",
    body: `Tackle concrete safety problems with lightweight interpretability tools (probes, steering vectors) and proxy-task feedback rather than chasing complete mechanistic reverse-engineering. Bias toward shipping things that monitor real models.

**Approach:** cognitive · **Target case:** mixed · **FTEs:** 30–60

**Some names:** Sharkey, Amodei, Chalmers, Kim, Nanda, Baek, Greenspan, Vaintrob, Marks, Pfau.

**Funded by:** Google DeepMind, Anthropic, academic groups.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "A Pragmatic Vision for Interpretability", url: "https://www.alignmentforum.org/posts/StENzDcD3kpfGJssR/a-pragmatic-vision-for-interpretability%20", authors: "Neel Nanda et al." },
      { title: "Agentic Interpretability: A Strategy Against Gradual Disempowerment", url: "https://www.alignmentforum.org/posts/s9z4mgjtWTPpDLxFy/agentic-interpretability-a-strategy-against-gradual", authors: "Been Kim et al." },
      { title: "Auditing language models for hidden objectives", url: "https://www.anthropic.com/research/auditing-hidden-objectives", authors: "Samuel Marks et al." },
    ],
  },
  {
    slug: "other-interpretability",
    title: "Other interpretability",
    body: `Mech-interp work that doesn't fit cleanly elsewhere — alternative conceptual frames (agentic, propositional), physics-inspired methods (renormalisation), open problems papers, and meta-criticism.

**Approach:** engineering / cognitive · **Target case:** mixed · **FTEs:** 30–60

**Some names:** Sharkey, Amodei, Chalmers, Kim, Nanda, Baek, Greenspan, Vaintrob, Marks, Pfau.

**Critiques:** *The Misguided Quest for Mechanistic AI Interpretability*; *Interpretability Will Not Reliably Find Deceptive AI*.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "Transformers Don't Need LayerNorm at Inference Time: Implications for Interpretability", url: "https://lesswrong.com/posts/KbFuuaBKRP7FcAADL/transformers-don-t-need-layernorm-at-inference-time", authors: "submarat et al." },
      { title: "Where Did It Go Wrong? Attributing Undesirable LLM Behaviors via Representation Gradient Tracing", url: "https://arxiv.org/abs/2510.02334", authors: "Zhe Li et al." },
      { title: "Open Problems in Mechanistic Interpretability", url: "https://arxiv.org/abs/2501.16496", authors: "Lee Sharkey et al." },
      { title: "Against blanket arguments against interpretability", url: "https://lesswrong.com/posts/u3ZysuXEjkyHhefrk/against-blanket-arguments-against-interpretability", authors: "Dmitry Vaintrob" },
      { title: "Opportunity Space: Renormalization for AI Safety", url: "https://lesswrong.com/posts/wkGmouy7JnTNtWAbc/opportunity-space-renormalization-for-ai-safety", authors: "Lauren Greenspan, Dmitry Vaintrob, Lucas Teixeira" },
      { title: "Prospects for Alignment Automation: Interpretability Case Study", url: "https://lesswrong.com/posts/y5cYisQ2QHiSbQbhk/prospects-for-alignment-automation-interpretability-case", authors: "Jacob Pfau, Geoffrey Irving" },
      { title: "The Urgency of Interpretability", url: "https://www.darioamodei.com/post/the-urgency-of-interpretability", authors: "Dario Amodei" },
      { title: "Language Models May Verbatim Complete Text They Were Not Explicitly Trained On", url: "https://arxiv.org/abs/2503.17514", authors: "Ken Ziyu Liu et al." },
      { title: "Downstream applications as validation of interpretability progress", url: "https://lesswrong.com/posts/wGRnzCFcowRCrpX4Y/downstream-applications-as-validation-of-interpretability", authors: "Sam Marks" },
      { title: "Principles for Picking Practical Interpretability Projects", url: "https://lesswrong.com/posts/DqaoPNqhQhwBFqWue/principles-for-picking-practical-interpretability-projects", authors: "Sam Marks" },
      { title: "Propositional Interpretability in Artificial Intelligence", url: "https://arxiv.org/abs/2501.15740", authors: "David J. Chalmers" },
      { title: "Explainable and Interpretable Multimodal LLMs: A Comprehensive Survey", url: "https://arxiv.org/abs/2412.02104", authors: "Yunkai Dang et al." },
      { title: "Renormalization Redux: QFT Techniques for AI Interpretability", url: "https://lesswrong.com/posts/sjr66DBEgyogAbfdf/renormalization-redux-qft-techniques-for-ai-interpretability", authors: "Lauren Greenspan, Dmitry Vaintrob" },
      { title: "The Strange Science of Interpretability", url: "https://lesswrong.com/posts/qRnupMmFG7dxQTTYh/the-strange-science-of-interpretability-recent-papers-and-a", authors: "Kola Ayonrinde, Louis Jaburi" },
      { title: "Through a Steerable Lens: Magnifying Neural Network Interpretability via Phase-Based Extrapolation", url: "https://arxiv.org/abs/2506.02300", authors: "Farzaneh Mahdisoltani et al." },
      { title: "Call for Collaboration: Renormalization for AI safety", url: "https://lesswrong.com/posts/MDWGcNHkZ3NPEzcnp/call-for-collaboration-renormalization-for-ai-safety", authors: "Lauren Greenspan" },
      { title: "On the creation of narrow AI: hierarchy and nonlocality of neural network skills", url: "https://arxiv.org/abs/2505.15811", authors: "Eric J. Michaud, Asher Parker-Sartori, Max Tegmark" },
      { title: "Harmonic Loss Trains Interpretable AI Models", url: "https://arxiv.org/abs/2502.01628", authors: "David D. Baek et al." },
      { title: "Extracting memorized pieces of (copyrighted) books from open-weight language models", url: "https://arxiv.org/abs/2505.12546", authors: "A. Feder Cooper et al." },
    ],
  },
  {
    slug: "learning-dynamics",
    title: "Learning dynamics & developmental interpretability",
    body: `Detect, locate, and interpret structural shifts during training — phase transitions, grokking, the emergence of deception. Heavily uses Singular Learning Theory.

**Approach:** cognitivist science · **Target case:** worst-case · **FTEs:** 10–50

**Some names:** Timaeus, Hoogland, Wang, Murfet, van Wingerden, Gietelink Oldenziel.

**Critiques:** Vaintrob, Joar Skalse (2023).

**Funded by:** Manifund, SFF, EA Funds.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "From SLT to AIT: NN Generalisation Out of Distribution", url: "https://www.lesswrong.com/posts/2MX2bXreTtntB85Zy/from-slt-to-ait-nn-generalisation-out-of-distribution" },
      { title: "Understanding and Controlling LLM Generalization", url: "https://www.lesswrong.com/posts/ZSQaT2yxNNZ3eLxRd/understanding-and-controlling-llm-generalization", authors: "Daniel Tan" },
      { title: "SLT for AI Safety", url: "https://lesswrong.com/posts/J7CyENFYXPxXQpsnD/slt-for-ai-safety", authors: "Jesse Hoogland" },
      { title: "Crosscoding Through Time: Tracking Emergence & Consolidation Of Linguistic Representations", url: "https://arxiv.org/abs/2509.05291", authors: "Deniz Bayazit et al." },
      { title: "A Review of Developmental Interpretability in Large Language Models", url: "https://arxiv.org/abs/2508.15841", authors: "Ihor Kendiukhov" },
      { title: "Dynamics of Transient Structure in In-Context Linear Regression Transformers", url: "https://arxiv.org/abs/2501.17745", authors: "Liam Carroll et al." },
      { title: "Learning Coefficients, Fractals, and Trees in Parameter Space", url: "https://openreview.net/forum?id=KUFH0n1BIM", authors: "Max Hennick, Matthias Dellago" },
      { title: "Emergence of Superposition: Unveiling the Training Dynamics of Chain of Continuous Thought", url: "https://arxiv.org/abs/2509.23365", authors: "Hanlin Zhu et al." },
      { title: "Compressibility Measures Complexity: MDL Meets Singular Learning Theory", url: "https://arxiv.org/abs/2510.12077", authors: "Einar Urdshals et al." },
      { title: "Programs as Singularities", url: "https://openreview.net/forum?id=Td37oOfmmz", authors: "Daniel Murfet, William Troiani" },
      { title: "What Do Learning Dynamics Reveal About Generalization in LLM Reasoning?", url: "https://arxiv.org/abs/2411.07681", authors: "Katie Kang et al." },
      { title: "Selective regularization for alignment-focused representation engineering", url: "https://lesswrong.com/posts/HFcriD29cw3E5QLCR/selective-regularization-for-alignment-focused", authors: "Sandy Fraser" },
      { title: "Modes of Sequence Models and Learning Coefficients", url: "https://arxiv.org/abs/2504.18048", authors: "Zhongtian Chen, Daniel Murfet" },
      { title: "Programming by Backprop: LLMs Acquire Reusable Algorithmic Abstractions During Code Training", url: "https://arxiv.org/abs/2506.18777", authors: "Jonathan Cook et al." },
    ],
  },
  {
    slug: "representation-geometry",
    title: "Representation structure & geometry",
    body: `Look for simple geometric/structural regularities in model representations — and use them to read off semantics, guide training, or compare models across architectures.

**Approach:** cognitivist science · **Target case:** mixed · **FTEs:** 10–50

**Some names:** Simplex, Insight + Interaction Lab, Riechers, Shai, Wattenberg, Richards, Piotrowski.

**Funded by:** academic groups, Astera Institute, Coefficient Giving.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "The Geometry of Self-Verification in a Task-Specific Reasoning Model", url: "https://arxiv.org/abs/2504.14379", authors: "Andrew Lee et al." },
      { title: "Rank-1 LoRAs Encode Interpretable Reasoning Signals", url: "http://arxiv.org/abs/2511.06739", authors: "Jake Ward, Paul Riechers, Adam Shai" },
      { title: "The Geometry of Refusal in Large Language Models: Concept Cones and Representational Independence", url: "https://arxiv.org/abs/2502.17420", authors: "Tom Wollschläger et al." },
      { title: "Embryology of a Language Model", url: "https://arxiv.org/abs/2508.00331", authors: "George Wang et al." },
      { title: "Constrained belief updates explain geometric structures in transformer representations", url: "https://arxiv.org/abs/2502.01954", authors: "Mateusz Piotrowski et al." },
      { title: "Shared Global and Local Geometry of Language Model Embeddings", url: "https://arxiv.org/abs/2503.21073", authors: "Andrew Lee et al." },
      { title: "Neural networks leverage nominally quantum and post-quantum representations", url: "https://arxiv.org/abs/2507.07432", authors: "Paul M. Riechers, Thomas J. Elliott, Adam S. Shai" },
      { title: "Tracing the Representation Geometry of Language Models from Pretraining to Post-training", url: "https://arxiv.org/abs/2509.23024", authors: "Melody Zixuan Li et al." },
      { title: "Deep sequence models tend to memorize geometrically; it is unclear why", url: "https://arxiv.org/abs/2510.26745", authors: "Shahriar Noroozizadeh et al." },
      { title: "Navigating the Latent Space Dynamics of Neural Models", url: "https://arxiv.org/abs/2505.22785", authors: "Marco Fumero et al." },
      { title: "The Geometry of ReLU Networks through the ReLU Transition Graph", url: "https://arxiv.org/abs/2505.11692", authors: "Sahil Rajesh Dhayalkar" },
      { title: "Connecting Neural Models Latent Geometries with Relative Geodesic Representations", url: "https://arxiv.org/abs/2506.01599", authors: "Hanlin Yu et al." },
      { title: "Next-token pretraining implies in-context learning", url: "https://arxiv.org/abs/2505.18373", authors: "Paul M. Riechers et al." },
    ],
  },
  {
    slug: "human-inductive-biases",
    title: "Human inductive biases",
    body: `Map similarities and differences between deep nets and human cognition. Look for the inductive biases that make humans learn trust, honesty, and self-maintenance, and try to import them into AI training.

**Approach:** cognitive · **Target case:** pessimistic · **FTEs:** ≈4

**Some names:** Muttenthaler, Delfosse.

**Funded by:** Google DeepMind, academic groups.`,
    parentSlug: "white-box-safety",
    outputs: [
      { title: "Aligning machine and human visual representations across abstraction levels", url: "https://www.nature.com/articles/s41586-025-09631-6", authors: "Lukas Muttenthaler et al." },
      { title: "Deep Reinforcement Learning Agents are not even close to Human Intelligence", url: "https://arxiv.org/html/2505.21731v1" },
      { title: "Teaching AI to Handle Exceptions: Supervised Fine-tuning with Human-aligned Judgment", url: "https://arxiv.org/html/2503.02976v2#S3", authors: "Matthew DosSantos DiSorbo, Harang Ju, Sinan Aral" },
      { title: "HIBP Human Inductive Bias Project Plan", url: "https://docs.google.com/document/d/1fl7LE8AN7mLJ6uFcPuFCzatp0zCIYvjRIjQRgHPAkSE/edit?tab=t.0", authors: "Félix Dorn" },
      { title: "Beginning with You: Perceptual-Initialization Improves Vision-Language Representation and Alignment", url: "https://arxiv.org/abs/2505.14204", authors: "Yang Hu et al." },
      { title: "Towards Cognitively-Faithful Decision-Making Models to Improve AI Alignment", url: "https://arxiv.org/abs/2509.04445", authors: "Cyrus Cousins et al." },
    ],
  },
  {
    slug: "concept-based-interp",
    title: "Concept-based interpretability",
    body: `Find directions or subspaces in latent state that correspond to high-level concepts (refusal, deception, planning), and use them to monitor or steer.`,
    parentSlug: "white-box-safety",
  },
  {
    slug: "monitoring-concepts",
    title: "Monitoring concepts",
    body: `Map activations to interpretable concepts and deploy cheap probes to flag hidden misalignment in deployed systems — even if overt outputs look fine.

**Approach:** cognitive · **Target case:** pessimistic · **FTEs:** 50–100

**Some names:** Beaglehole, Radhakrishnan, Boix-Adserà, Wollschläger, Soligo, Lindsey, Christian, Hu, Goldowsky-Dill, Nanda.

**Critiques:** *Exploring the generalization of LLM truth directions on conversational formats*; *Understanding (Un)Reliability of Steering Vectors in Language Models*.

**Funded by:** Coefficient Giving, Anthropic, academic groups.`,
    parentSlug: "concept-based-interp",
    outputs: [
      { title: "Convergent Linear Representations of Emergent Misalignment", url: "https://lesswrong.com/posts/umYzsh7SGHHKsRCaA/convergent-linear-representations-of-emergent-misalignment", authors: "Anna Soligo et al." },
      { title: "Detecting Strategic Deception Using Linear Probes", url: "https://www.lesswrong.com/posts/9pGbTz6c78PGwJein/detecting-strategic-deception-using-linear-probes", authors: "Nicholas Goldowsky-Dill et al." },
      { title: "Toward universal steering and monitoring of AI models", url: "https://arxiv.org/abs/2502.03708", authors: "Daniel Beaglehole et al." },
      { title: "Reward Model Interpretability via Optimal and Pessimal Tokens", url: "https://arxiv.org/abs/2506.07326", authors: "Brian Christian et al." },
      { title: "The Geometry of Refusal in Large Language Models: Concept Cones and Representational Independence", url: "https://arxiv.org/abs/2502.17420", authors: "Tom Wollschläger et al." },
      { title: "Cost-Effective Constitutional Classifiers via Representation Re-use", url: "https://alignment.anthropic.com/2025/cheap-monitors", authors: "Hoagy Cunningham et al." },
      { title: "Refusal in LLMs is an Affine Function", url: "https://arxiv.org/abs/2411.09003", authors: "Thomas Marshall, Adam Scherlis, Nora Belrose" },
      { title: "White Box Control at UK AISI — Update on Sandbagging Investigations", url: "https://www.lesswrong.com/posts/pPEeMdgjpjHZWCDFw/white-box-control-at-uk-aisi-update-on-sandbagging", authors: "Joseph Bloom et al." },
      { title: "Here's 18 Applications of Deception Probes", url: "https://www.lesswrong.com/posts/7zhAwcBri7yupStKy/here-s-18-applications-of-deception-probes", authors: "Cleo Nardo, Avi Parrack, jordine" },
      { title: "How Do LLMs Persuade? Linear Probes Can Uncover Persuasion Dynamics in Multi-Turn Conversations", url: "https://arxiv.org/abs/2508.05625", authors: "Brandon Jaipersaud, David Krueger, Ekdeep Singh Lubana" },
      { title: "Beyond Linear Probes: Dynamic Safety Monitoring for Language Models", url: "https://arxiv.org/abs/2509.26238", authors: "James Oldfield et al." },
    ],
  },
  {
    slug: "activation-engineering",
    title: "Activation engineering",
    body: `Programmatically modify internal activations to steer outputs — a lightweight, interpretable supplement to fine-tuning. Doubles as a way to test interpretability theories with causal interventions.

**Approach:** engineering / cognitive · **Target case:** average · **FTEs:** 20–100

**Some names:** Chen, Arditi, Krueger, Wehner, Oozeer, Bayat, Karvonen, Sun, Hua, Casademunt, Dunefsky, Marshall.

**Critiques:** *Understanding (Un)Reliability of Steering Vectors in Language Models*.

**Funded by:** Coefficient Giving, Anthropic.`,
    parentSlug: "concept-based-interp",
    outputs: [
      { title: "Do safety-relevant LLM steering vectors optimized on a single example generalize?", url: "https://lesswrong.com/posts/6aXe9nipTgwK5LxaP/do-safety-relevant-llm-steering-vectors-optimized-on-a", authors: "Jacob Dunefsky" },
      { title: "Keep Calm and Avoid Harmful Content: Concept Alignment and Latent Manipulation Towards Safer Answers", url: "https://arxiv.org/abs/2510.12672", authors: "Ruben Belo, Marta Guimaraes, Claudia Soares" },
      { title: "Activation Space Interventions Can Be Transferred Between Large Language Models", url: "https://arxiv.org/abs/2503.04429", authors: "Narmeen Oozeer et al." },
      { title: "HyperSteer: Activation Steering at Scale with Hypernetworks", url: "https://arxiv.org/abs/2506.03292", authors: "Jiuding Sun et al." },
      { title: "Steering Evaluation-Aware Language Models to Act Like They Are Deployed", url: "https://arxiv.org/abs/2510.20487", authors: "Tim Tian Hua et al." },
      { title: "Steering Out-of-Distribution Generalization with Concept Ablation Fine-Tuning", url: "https://arxiv.org/abs/2507.16795", authors: "Helena Casademunt et al." },
      { title: "Persona Vectors: Monitoring and Controlling Character Traits in Language Models", url: "https://arxiv.org/abs/2507.21509", authors: "Runjin Chen et al." },
      { title: "Steering Large Language Model Activations in Sparse Spaces", url: "https://arxiv.org/abs/2503.00177", authors: "Reza Bayat et al." },
      { title: "Improving Steering Vectors by Targeting Sparse Autoencoder Features", url: "https://arxiv.org/abs/2411.02193", authors: "Sviatoslav Chalnev, Matthew Siu, Arthur Conmy" },
      { title: "Understanding Reasoning in Thinking Language Models via Steering Vectors", url: "https://arxiv.org/abs/2506.18167", authors: "Constantin Venhoff et al." },
      { title: "One-shot steering vectors cause emergent misalignment, too", url: "https://lesswrong.com/posts/kcKnKHTHycHeRhcHF/one-shot-steering-vectors-cause-emergent-misalignment-too", authors: "Jacob Dunefsky" },
      { title: "Enhancing Multiple Dimensions of Trustworthiness in LLMs via Sparse Activation Control", url: "https://arxiv.org/abs/2411.02461", authors: "Yuxin Xiao et al." },
      { title: "Comparing Bottom-Up and Top-Down Steering Approaches on In-Context Learning Tasks", url: "https://arxiv.org/abs/2411.07213", authors: "Madeline Brumley et al." },
      { title: "Taxonomy, Opportunities, and Challenges of Representation Engineering for LLMs", url: "https://arxiv.org/abs/2502.19649", authors: "Jan Wehner et al." },
      { title: "Robustly Improving LLM Fairness in Realistic Settings via Interpretability", url: "https://arxiv.org/abs/2506.10922", authors: "Adam Karvonen, Samuel Marks" },
    ],
  },

  // ─── SAFETY BY CONSTRUCTION ──────────────────────────────────────────────
  {
    slug: "guaranteed-safe-ai",
    title: "Guaranteed-safe AI",
    body: `Get an AI to produce outputs (code, control policies, plans) that come with a quantitative formal proof of compliance with a safety spec and world model. Notable for not requiring ELK to be solved (does require solving ontology).

**Approach:** cognitive / engineering · **Target case:** worst-case · **FTEs:** 10–100

**Some names:** ARIA, Lawzero, Atlas Computing, FLF, Tegmark, BAIF, Omohundro, "davidad" Dalrymple, Skalse, Russell, Abate.

**Critiques:** Zvi, Gleave, Dickson, Greenblatt.

**Funded by:** Manifund, ARIA, Coefficient Giving, SFF, Mila / CIFAR.`,
    parentSlug: "safety-by-construction",
    outputs: [
      { title: "SafePlanBench: evaluating a Guaranteed Safe AI Approach for LLM-based Agents", url: "https://manifund.org/projects/safeplanbench-evaluating-a-guaranteed-safe-ai-approach-for-llm-based-agents", authors: "Agustín Martinez Suñé, Tan Zhi Xuan" },
      { title: "Beliefs about formal methods and AI safety", url: "https://lesswrong.com/posts/CCT7Qc8rSeRs7r5GL/beliefs-about-formal-methods-and-ai-safety", authors: "Quinn Dougherty" },
      { title: "Report on NSF Workshop on Science of Safe AI", url: "https://arxiv.org/abs/2506.22492", authors: "Rajeev Alur et al." },
      { title: "A benchmark for vericoding: formally verified program synthesis", url: "https://arxiv.org/abs/2509.22908", authors: "Sergiu Bursuc et al." },
      { title: "A Toolchain for AI-Assisted Code Specification, Synthesis and Verification" },
    ],
  },
  {
    slug: "scientist-ai",
    title: "Scientist AI",
    body: `Build powerful, *non-agentic*, uncertainty-aware world models that accelerate science without the risks of full agency — and use them as a guardrail against unsafe agentic systems.

**Approach:** cognitivist science · **Target case:** pessimistic · **FTEs:** 1–10

**Some names:** Bengio, Kaddar.

**Critiques:** Hard to find, but see Raymond Douglas' comment, Karnofsky-Soares discussion. Possibly also *Predict-O-Matic*.

**Funded by:** ARIA, Gates Foundation, FLI, Coefficient Giving, Tallinn, Schmidt Sciences.`,
    parentSlug: "safety-by-construction",
    outputs: [
      { title: "Superintelligent Agents Pose Catastrophic Risks: Can Scientist AI Offer a Safer Path?", url: "https://arxiv.org/abs/2502.15657", authors: "Yoshua Bengio et al." },
      { title: "The More You Automate, the Less You See: Hidden Pitfalls of AI Scientist Systems", url: "https://arxiv.org/abs/2509.08713", authors: "Ziming Luo, Atoosa Kasirzadeh, Nihar B. Shah" },
    ],
  },
  {
    slug: "brainlike-agi-safety",
    title: "Brainlike-AGI safety",
    body: `Reverse-engineer the social and moral instincts encoded in human brain circuits, and adapt them for an actor-critic, model-based-RL flavour of AGI. Steve Byrnes' agenda.

**Approach:** cognitivist science · **Target case:** worst-case · **FTEs:** 1–5

**Some names:** Byrnes.

**Critiques:** Tsvi BT.

**Funded by:** Astera Institute.`,
    parentSlug: "safety-by-construction",
    outputs: [
      { title: "Perils of Under vs Over-sculpting AGI Desires", url: "https://www.lesswrong.com/posts/grgb2ipxQf2wzNDEG/perils-of-under-vs-over-sculpting-agi-desires" },
      { title: "Reward button alignment", url: "https://lesswrong.com/posts/JrTk2pbqp7BFwPAKw/reward-button-alignment", authors: "Steven Byrnes" },
      { title: "System 2 Alignment: Deliberation, Review, and Thought Management", url: "https://www.lesswrong.com/posts/cus5CGmLrjBRgcPSF/system-2-alignment-deliberation-review-and-thought", authors: "Seth Herd" },
      { title: "Against RL: The Case for System 2 Learning", url: "https://elicit.com/blog/system-2-learning", authors: "Andreas Stuhlmüller" },
      { title: "Foom and Doom 1: Brain in a Box in a Basement", url: "https://www.lesswrong.com/posts/yew6zFWAKG4AGs3Wk/foom-and-doom-1-brain-in-a-box-in-a-basement" },
      { title: "Foom and Doom 2: Technical Alignment is Hard", url: "https://www.lesswrong.com/posts/bnnKGSCHJghAvqPjS/foom-and-doom-2-technical-alignment-is-hard" },
      { title: "An Affective-Taxis Hypothesis for Alignment and Interpretability", authors: "Eli Sennesh & Maxwell Ramstead" },
    ],
  },

  // ─── MAKE AI SOLVE IT ────────────────────────────────────────────────────
  {
    slug: "weak-to-strong",
    title: "Weak-to-strong generalisation",
    body: `Use weaker models to supervise and provide feedback to stronger ones — and quantify when those amplifications break.

**Approach:** engineering · **Target case:** average · **FTEs:** 2–20

**Some names:** Engels, Belrose, Baek.

**Critiques:** *Can we safely automate alignment research?*; *Super(ficial)-alignment: Strong Models May Deceive Weak Models in Weak-to-Strong Generalization*.

**Funded by:** lab funders, Eleuther funders.`,
    parentSlug: "make-ai-solve-it",
    outputs: [
      { title: "Scaling Laws For Scalable Oversight", url: "https://arxiv.org/abs/2504.18530", authors: "Joshua Engels et al." },
      { title: "Great Models Think Alike and this Undermines AI Oversight", url: "https://arxiv.org/abs/2502.04313", authors: "Shashwat Goel et al." },
      { title: "Debate Helps Weak-to-Strong Generalization", url: "https://arxiv.org/abs/2501.13124", authors: "Hao Lang, Fei Huang, Yongbin Li" },
      { title: "Understanding the Capabilities and Limitations of Weak-to-Strong Generalization", url: "https://openreview.net/forum?id=RwYdLgj1S6", authors: "Wei Yao et al." },
    ],
  },
  {
    slug: "supervising-ais",
    title: "Supervising AIs improving AIs",
    body: `Frameworks for stronger AIs supervising other (weaker) AI systems via structured interactions, with scalable monitoring of behavioural drift and self-modification.

**Approach:** behavioural · **Target case:** pessimistic · **FTEs:** 1–10

**Some names:** Engeler, Khan, Perez.

**Critiques:** Automation collapse; *Great Models Think Alike and this Undermines AI Oversight*.

**Funded by:** LTFF, lab funders.`,
    parentSlug: "make-ai-solve-it",
    outputs: [
      { title: "Bare Minimum Mitigations for Autonomous AI Development", url: "https://saif.org/research/bare-minimum-mitigations-for-autonomous-ai-development/", authors: "Joshua Clymer et al." },
      { title: "Dodging systematic human errors in scalable oversight", url: "https://www.alignmentforum.org/posts/EgRJtwQurNzz8CEfJ/dodging-systematic-human-errors-in-scalable-oversight", authors: "Geoffrey Irving" },
      { title: "Scaling Laws for Scalable Oversight", url: "https://arxiv.org/abs/2504.18530", authors: "Joshua Engels et al." },
      { title: "Neural Interactive Proofs", url: "https://neural-interactive-proofs.com/", authors: "Lewis Hammond, Sam Adam-Day" },
      { title: "Modeling Human Beliefs about AI Behavior for Scalable Oversight", url: "https://arxiv.org/abs/2502.21262", authors: "Leon Lang, Patrick Forré" },
      { title: "Scalable Oversight for Superhuman AI via Recursive Self-Critiquing", url: "https://arxiv.org/abs/2502.04675", authors: "Xueru Wen et al." },
      { title: "Video and transcript of talk on automating alignment research", url: "https://lesswrong.com/posts/TQbptN7F4ijPnQRLy/video-and-transcript-of-talk-on-automating-alignment", authors: "Joe Carlsmith" },
      { title: "Maintaining Alignment during RSI as a Feedback Control Problem", url: "https://lesswrong.com/posts/PhgEKkB4cwYjwpGxb/maintaining-alignment-during-rsi-as-a-feedback-control", authors: "beren" },
    ],
  },
  {
    slug: "ai-explanations-of-ais",
    title: "AI explanations of AIs",
    body: `Open-source tools that use AI to explain other AIs — automatic feature descriptions, behaviour-elicitation agents, neuron-circuit interfaces. Transluce-style work.

**Approach:** cognitive · **Target case:** pessimistic · **FTEs:** 15–30

**Some names:** Transluce, Steinhardt, Chowdhury, Huang, Schwettmann, Friel.

**Funded by:** Schmidt Sciences, Halcyon Futures, Schulman, Zaremba.`,
    parentSlug: "make-ai-solve-it",
    outputs: [
      { title: "Automatically Jailbreaking Frontier Language Models with Investigator Agents", url: "https://transluce.org/jailbreaking-frontier-models" },
      { title: "Surfacing Pathological Behaviors in Language Models", url: "https://transluce.org/pathological-behaviors" },
      { title: "Investigating truthfulness in a pre-release o3 model", url: "https://transluce.org/investigating-o3-truthfulness", authors: "Neil Chowdhury et al." },
      { title: "Neuron circuits", authors: "Aryaman Arora et al." },
      { title: "Docent: A system for analyzing and intervening on agent behavior", authors: "Kevin Meng et al." },
    ],
  },
  {
    slug: "debate",
    title: "Debate",
    body: `In the limit, true claims should be easier to compellingly argue for than false ones; lean on this asymmetry to extract trusted work from untrusted debaters.

**Approach:** engineering / cognitive · **Target case:** worst-case

**Some names:** Shah, Brown-Cohen, Piliouras, UK AISI (Hilton).

**Critiques:** *The limits of AI safety via debate* (2022).

**Funded by:** Google, others.`,
    parentSlug: "make-ai-solve-it",
    outputs: [
      { title: "UK AISI Alignment Team: Debate Sequence", url: "https://www.lesswrong.com/s/NdovveRcyfxgMoujf", authors: "Benjamin Hilton" },
      { title: "Prover-Estimator Debate: A New Scalable Oversight Protocol", url: "https://lesswrong.com/posts/8XHBaugB5S3r27MG9/prover-estimator-debate-a-new-scalable-oversight-protocol", authors: "Jonah Brown-Cohen, Geoffrey Irving" },
      { title: "AI Debate Aids Assessment of Controversial Claims", url: "https://arxiv.org/abs/2506.02175", authors: "Salman Rahman et al." },
      { title: "An alignment safety case sketch based on debate", url: "https://arxiv.org/abs/2505.03989", authors: "Marie Davidsen Buhl et al." },
      { title: "Ensemble Debates with Local Large Language Models for AI Alignment", url: "https://arxiv.org/abs/2509.00091", authors: "Ephraiem Sarabamoun" },
      { title: "A dataset of rated conceptual arguments" },
    ],
  },
  {
    slug: "llm-introspection-training",
    title: "LLM introspection training",
    body: `Train LLMs to predict the outputs of high-quality whitebox methods — distilling the skill of self-explanation into the model itself, so it scales with general capability.

**Approach:** cognitivist science · **Target case:** mixed · **FTEs:** 2–20

**Some names:** Li, Guo, Huang, Steinhardt, Andreas, Lindsey.

**Funded by:** Schmidt Sciences, Halcyon Futures, Schulman, Zaremba.`,
    parentSlug: "make-ai-solve-it",
    outputs: [
      { title: "Training Language Models to Explain Their Own Computations", url: "https://arxiv.org/abs/2511.08579", authors: "Belinda Z. Li et al." },
      { title: "Emergent Introspective Awareness", url: "https://transformer-circuits.pub/2025/introspection/index.html", authors: "Jack Lindsey" },
      { title: "Activation Oracles: Training and Evaluating LLMs as General-Purpose Activation Explainers", authors: "Adam Karvonen, James Chua, Clément Dumas, et al." },
    ],
  },

  // ─── THEORY ──────────────────────────────────────────────────────────────
  {
    slug: "agent-foundations",
    title: "Agent foundations",
    body: `Develop the philosophy and mathematics of building blocks for aligning strong superintelligence — agency, optimization, decision theory, abstractions, embeddedness, concepts.

**Approach:** cognitive · **Target case:** worst-case

**Some names:** Demski, Altair, Eisenstat, Ruthenis, Harwood, C, K, Faustino.`,
    parentSlug: "theory",
    outputs: [
      { title: "Limit-Computable Grains of Truth for Arbitrary Computable Extensive-Form (Un)Known Games", url: "https://www.arxiv.org/pdf/2508.16245", authors: "Cole Wyeth et al." },
      { title: "UAIASI", authors: "Cole Wyeth" },
      { title: "Clarifying \"wisdom\": Foundational topics for aligned AIs to prioritize before irreversible decisions" },
      { title: "Agent foundations: not really math, not really science", url: "https://www.lesswrong.com/posts/Dt4DuCCok3Xv5HEnG/agent-foundations-not-really-math-not-really-science", authors: "Alex Altair" },
      { title: "Off-switching not guaranteed", url: "https://link.springer.com/article/10.1007/s11098-025-02296-x", authors: "Sven Neth" },
      { title: "Formalizing Embeddedness Failures in Universal Artificial Intelligence", url: "https://openreview.net/forum?id=tlkYPU3FlX", authors: "Cole Wyeth, Marcus Hutter" },
      { title: "Is alignment reducible to becoming more coherent?", url: "https://lesswrong.com/posts/nuDJNyG5XLQjtvaeg/is-alignment-reducible-to-becoming-more-coherent", authors: "Cole Wyeth" },
      { title: "What Is The Alignment Problem?", url: "https://lesswrong.com/posts/dHNKtQ3vTBxTfTPxu/what-is-the-alignment-problem", authors: "johnswentworth" },
      { title: "Good old fashioned decision theory" },
      { title: "Report & retrospective on the Dovetail fellowship", url: "https://www.lesswrong.com/posts/ApfjBbqzSu4aZoLSe/report-and-retrospective-on-the-dovetail-fellowship", authors: "Alex Altair" },
    ],
  },
  {
    slug: "tiling-agents",
    title: "Tiling agents",
    body: `An aligned agent self-modifying into a misaligned successor would be very bad. Build enough theoretical basis that the safety property "tiles" across self-modification.

**Approach:** cognitivist science · **Target case:** worst-case · **FTEs:** 1–10

**Some names:** Demski.`,
    parentSlug: "theory",
    outputs: [
      { title: "Working through a small tiling result", url: "https://www.lesswrong.com/posts/akuMwu8SkmQSdospi/working-through-a-small-tiling-result", authors: "James Payor" },
      { title: "Communication & Trust", url: "https://openreview.net/forum?id=Rf1CeGPA22", authors: "Abram Demski" },
      { title: "Maintaining Alignment during RSI as a Feedback Control Problem", url: "https://lesswrong.com/posts/PhgEKkB4cwYjwpGxb/maintaining-alignment-during-rsi-as-a-feedback-control", authors: "beren" },
      { title: "Understanding Trust", url: "https://static1.squarespace.com/static/663d1233249bce4815fe8753/t/68067a6f5d5fb0745642d5b1/1745255023842/Understanding+Trust+-+Abram+Demski.pdf", authors: "Abram Demski" },
    ],
  },
  {
    slug: "high-actuation-spaces",
    title: "High-actuation spaces",
    body: `If future AI uses different computational substrates (e.g., neuromorphic), substrate-tied methods like probes or steering won't transfer. Use a "telic DAG" abstraction over substrates to recover goal-inference. Category-theory grounded.

**Approach:** maths / philosophy · **Target case:** pessimistic · **FTEs:** 1–10

**Some names:** Sahil K, Farr, Prasad, Pang, Adiga, Amati, Petersen, Topos, T J.`,
    parentSlug: "theory",
    outputs: [
      { title: "groundless.ai" },
      { title: "Live Theory" },
      { title: "High Actuation Spaces", url: "https://docs.google.com/document/d/1d-ARdZZDHFPIfGcTTOKK8IZWlQj0NZQrmteJj2mvmYA/edit?tab=t.0#heading=h.eg8luyrlsv2u", authors: "Sahil" },
      { title: "What, if not agency?" },
      { title: "Human Inductive Bias Project", authors: "Félix Dorn" },
      { title: "MoSSAIC: AI Safety After Mechanism", url: "https://openreview.net/forum?id=n7WYSJ35FU", authors: "Matt Farr et al." },
      { title: "HAS — Public (High Actuation Spaces)", url: "https://drive.google.com/drive/folders/1EaAJ4szuZsYR2_-DkS9cuhx3S6IWeCjW" },
    ],
  },
  {
    slug: "asymptotic-guarantees",
    title: "Asymptotic guarantees",
    body: `Prove that safety processes work in the limit of unbounded resources (data quality, training, network capacity). Use complexity, game and learning theory to harden safety cases.

**Approach:** cognitive · **Target case:** pessimistic · **FTEs:** 5–10

**Some names:** AISI, Pfau, Hilton, Irving, Marshall, Kirby, Soto, Africa, davidad.

**Critiques:** *Self-critique in UK AISI's Alignment Team: Research Agenda*.

**Funded by:** AISI.`,
    parentSlug: "theory",
    outputs: [
      { title: "An alignment safety case sketch based on debate", url: "https://arxiv.org/abs/2505.03989", authors: "Marie_DB et al." },
      { title: "UK AISI's Alignment Team: Research Agenda", url: "https://lesswrong.com/posts/tbnw7LbNApvxNLAg8/uk-aisi-s-alignment-team-research-agenda", authors: "Benjamin Hilton et al." },
      { title: "Dodging systematic human errors in scalable oversight", url: "https://www.alignmentforum.org/posts/EgRJtwQurNzz8CEfJ/dodging-systematic-human-errors-in-scalable-oversight", authors: "Geoffrey Irving" },
      { title: "Can DPO Learn Diverse Human Values? A Theoretical Scaling Law" },
    ],
  },
  {
    slug: "heuristic-explanations",
    title: "Heuristic explanations",
    body: `Formalise mechanistic explanations of network behaviour and use them to predict extreme behaviour on novel input ("Low Probability Estimation" / "Mechanistic Anomaly Detection"). Goal: certifiable predictions at least as accurate as sampling.

**Approach:** cognitive / maths/philosophy · **Target case:** worst-case · **FTEs:** 1–10

**Some names:** Hilton, Xu, Neyman, Lecomte, Robinson.

**Critiques:** Matolcsi.`,
    parentSlug: "theory",
    outputs: [
      { title: "A computational no-coincidence principle", url: "https://www.lesswrong.com/posts/Xt9r4SNNuYxW83tmo/a-computational-no-coincidence-principle", authors: "Eric Neyman" },
      { title: "Competing with sampling", authors: "Eric Neyman" },
      { title: "Obstacles in ARC's research agenda", authors: "David Matolcsi" },
      { title: "Deduction-Projection Estimators for Understanding Neural Networks" },
      { title: "Wide Neural Networks as a Baseline for the Computational No-Coincidence Conjecture", url: "https://openreview.net/forum?id=m4OpQAK3eY", authors: "John Dunbar, Scott Aaronson" },
    ],
  },
  {
    slug: "corrigibility",
    title: "Corrigibility",
    body: `Make agents that don't resist or undermine being corrected, paused, or modified by their overseers.`,
    parentSlug: "theory",
  },
  {
    slug: "behavior-alignment-theory",
    title: "Behaviour alignment theory",
    body: `Formal proofs about what properties powerful agents will have (e.g. power-seeking) and how interventions might change them. Test on current systems where feasible, then design training environments accordingly.

**Approach:** maths / philosophy · **Target case:** worst-case · **FTEs:** 1–10

**Some names:** Potham, Cohen, Harms/Raelifin, Wentworth, Lorell, Thornley.

**Critiques:** Ryan Greenblatt.`,
    parentSlug: "corrigibility",
    outputs: [
      { title: "Preference gaps as a safeguard against AI self-replication", url: "https://www.lesswrong.com/posts/knwR9RgGN5a2oorci/preference-gaps-as-a-safeguard-against-ai-self-replication", authors: "tbs, EJT" },
      { title: "Serious Flaws in CAST", url: "https://www.lesswrong.com/s/KfCjeconYRdFbMxsy/p/qgBFJ72tahLo5hzqy", authors: "Max Harms" },
      { title: "A Shutdown Problem Proposal", url: "https://www.lesswrong.com/posts/PhTBDHu9PKJFmvb4p/a-shutdown-problem-proposal", authors: "johnswentworth, David Lorell" },
      { title: "Shutdownable Agents through POST-Agency", url: "https://arxiv.org/abs/2505.20203", authors: "Elliott Thornley" },
      { title: "The Partially Observable Off-Switch Game", url: "https://arxiv.org/abs/2411.17749", authors: "Andrew Garber et al." },
      { title: "Imitation learning is probably existentially safe", url: "https://onlinelibrary.wiley.com/doi/10.1002/aaai.70040?af=R", authors: "Michael K. Cohen, Marcus Hutter" },
      { title: "Model-Based Soft Maximization of Suitable Metrics of Long-Term Human Power", url: "https://arxiv.org/abs/2508.00159", authors: "Jobst Heitzig, Ram Potham" },
      { title: "Deceptive Alignment and Homuncularity", url: "https://lesswrong.com/posts/9htmQx5wiePqTtZuL/deceptive-alignment-and-homuncularity", authors: "Oliver Sourbut, TurnTrout" },
      { title: "A Safety Case for a Deployed LLM: Corrigibility as a Singular Target", url: "https://openreview.net/forum?id=mhEnJa9pNk", authors: "Ram Potham" },
      { title: "LLM AGI will have memory, and memory changes alignment", url: "https://lesswrong.com/posts/aKncW36ZdEnzxLo8A/llm-agi-will-have-memory-and-memory-changes-alignment", authors: "Seth Herd" },
    ],
  },
  {
    slug: "other-corrigibility",
    title: "Other corrigibility",
    body: `Diagnose obstacles to robustly corrigible behaviour — escalation channels, mechanisms, tripwires, Goodhart detection — and clarify why naive instruction-following isn't sufficient.

**Approach:** varies · **Target case:** pessimistic · **FTEs:** 1–10

**Some names:** Gillen.`,
    parentSlug: "corrigibility",
    outputs: [
      { title: "AI Assistants Should Have a Direct Line to Their Developers", url: "https://www.lesswrong.com/posts/LDYPF6yfe3f8SPHFT/ai-assistants-should-have-a-direct-line-to-their-developers", authors: "Jan Kulveit" },
      { title: "Detect Goodhart and shut down", url: "https://www.lesswrong.com/posts/ZHFZ6tivEjznkEoby/detect-goodhart-and-shut-down", authors: "Jeremy Gillen" },
      { title: "Instrumental Goals Are A Different And Friendlier Kind Of Thing Than Terminal Goals", url: "https://www.lesswrong.com/posts/7Z4WC4AFgfmZ3fCDC/instrumental-goals-are-a-different-and-friendlier-kind-of" },
      { title: "Shutdownable Agents through POST-Agency", url: "https://arxiv.org/abs/2505.20203", authors: "EJT" },
      { title: "Why Corrigibility is Hard and Important" },
      { title: "Oblivious Defense in ML Models: Backdoor Removal without Detection", url: "https://dl.acm.org/doi/10.1145/3717823.3718245", authors: "Shafi Goldwasser et al." },
      { title: "Cryptographic Backdoor for Neural Networks: Boon and Bane", url: "https://arxiv.org/abs/2509.20714", authors: "Anh Tu Ngo, Anupam Chattopadhyay, Subhamoy Maitra" },
      { title: "A Cryptographic Perspective on Mitigation vs. Detection in Machine Learning", url: "https://arxiv.org/abs/2504.20310", authors: "Greg Gluch, Shafi Goldwasser" },
      { title: "Problems with instruction-following as an alignment target", url: "https://lesswrong.com/posts/CSFa9rvGNGAfCzBk6/problems-with-instruction-following-as-an-alignment-target", authors: "Seth Herd" },
    ],
  },
  {
    slug: "ontology-identification",
    title: "Ontology identification",
    body: `Identify the concepts a model uses to structure its understanding, so we can map between human and AI ontologies and target alignment interventions at the right level.`,
    parentSlug: "theory",
  },
  {
    slug: "natural-abstractions",
    title: "Natural abstractions",
    body: `Theory of how concepts are learned and structured, with mutual translatability between different agents' concept-collections. Use it to inspect a system's safety properties or "retarget the search" — replace internal goal-calls with calls to user values.

**Approach:** cognitive · **Target case:** worst-case · **FTEs:** 1–10

**Some names:** Wentworth, Colognese, Lorrell, Eisenstat, Rosas.

**Critiques:** Chan et al (2023), Soto, Harwood, Soares (2023).`,
    parentSlug: "ontology-identification",
    outputs: [
      { title: "Abstract Mathematical Concepts vs. Abstractions Over Real-World Systems", url: "https://www.lesswrong.com/posts/T6xSXiXF3WF6TmCyN/abstract-mathematical-concepts-vs-abstractions-over-real" },
      { title: "Condensation", url: "https://www.lesswrong.com/posts/BstHXPgQyfeNnLjjp/condensation", authors: "abramdemski" },
      { title: "Platonic representation hypothesis", authors: "Minyoung Huh et al." },
      { title: "Rosas", authors: "Fernando Rosas" },
      { title: "Natural Latents: Latent Variables Stable Across Ontologies", url: "https://arxiv.org/abs/2509.03780", authors: "John Wentworth, David Lorell" },
      { title: "Condensation: a theory of concepts", url: "https://openreview.net/forum?id=HwKFJ3odui", authors: "Sam Eisenstat" },
      { title: "Factored space models: Towards causality between levels of abstraction", url: "https://arxiv.org/abs/2412.02579", authors: "Scott Garrabrant et al." },
      { title: "A single principle related to many Alignment subproblems?", url: "https://lesswrong.com/posts/h89L5FMAkEBNsZ3xM/a-single-principle-related-to-many-alignment-subproblems-2", authors: "Q Home" },
      { title: "Getting aligned on representational alignment", url: "https://arxiv.org/abs/2310.13018", authors: "Ilia Sucholutsky et al." },
      { title: "Symmetries at the origin of hierarchical emergence", url: "https://arxiv.org/pdf/2512.00984%20", authors: "Fernando E. Rosas" },
    ],
  },
  {
    slug: "learning-theoretic-agenda",
    title: "The Learning-Theoretic Agenda",
    body: `Build a mathematical theory of intelligent agents covering both humans and the AIs we want, define alignment in those terms, and translate between its ontology and ours. Vanessa Kosoy's program.

**Approach:** cognitive · **Target case:** worst-case · **FTEs:** ≈3

**Some names:** Kosoy, Diffractor, Szücs.

**Critiques:** Matolcsi.

**Funded by:** SFF, ARIA, UK AISI, Coefficient Giving.`,
    parentSlug: "ontology-identification",
    outputs: [
      { title: "Infra-Bayesian Decision-Estimation Theory" },
      { title: "Infra-Bayesianism category on LessWrong", url: "https://www.lesswrong.com/w/infra-bayesianism?sortedBy=new", authors: "abramdemski, Ruby" },
      { title: "Ambiguous Online Learning", authors: "Vanessa Kosoy" },
      { title: "Regret Bounds for Robust Online Decision Making", url: "https://proceedings.mlr.press/v291/appel25a.html", authors: "Alexander Appel, Vanessa Kosoy" },
      { title: "What is Inadequate about Bayesianism for AI Alignment: Motivating Infra-Bayesianism", authors: "Brittany Gelb" },
      { title: "Non-Monotonic Infra-Bayesian Physicalism", url: "https://www.alignmentforum.org/posts/DobZ62XMdiPigii9H/non-monotonic-infra-bayesian-physicalism%20", authors: "Marcus Ogren" },
    ],
  },

  // ─── MULTI-AGENT FIRST ───────────────────────────────────────────────────
  {
    slug: "aligning-to-context",
    title: "Aligning to context",
    body: `Align AI to the role of participant, collaborator, or advisor in our best real human practices and institutions — rather than aligning to separately representable goals or utility functions.

**Approach:** behavioural · **Target case:** mixed · **FTEs:** ≈5

**Some names:** Full Stack Alignment, Meaning Alignment Institute, Plurality Institute, Tan Zhi-Xuan, Franklin, Lowe, Edelman, Klingefjord.

**Funded by:** ARIA, OpenAI, SFF.`,
    parentSlug: "multi-agent-first",
    outputs: [
      { title: "The Frame-Dependent Mind", url: "https://www.softmax.com/blog/the-frame-dependent-mind", authors: "Emmett Shear, Sonnet 3.7" },
      { title: "On Eudaimonia and Optimization", url: "https://docs.google.com/document/d/1cKbqYSGspfJavXvnhsp3mAuxHh08rNbP7tzYieqLiXw/edit?tab=t.0%20" },
      { title: "Full-Stack Alignment", url: "https://www.full-stack-alignment.ai" },
      { title: "A theory of appropriateness", url: "https://arxiv.org/abs/2412.19010", authors: "Joel Z. Leibo et al." },
      { title: "What are human values, and how do we align AI to them?", url: "https://arxiv.org/abs/2404.10636", authors: "Oliver Klingefjord, Ryan Lowe, Joe Edelman" },
      { title: "Model Integrity", url: "https://meaningalignment.substack.com/p/model-integrity", authors: "Joe Edelman, Oliver Klingefjord" },
      { title: "Beyond Preferences in AI Alignment", url: "https://arxiv.org/abs/2408.16984", authors: "Tan Zhi-Xuan et al." },
      { title: "Can AI Model the Complexities of Human Moral Decision-Making?", url: "https://arxiv.org/abs/2503.00940", authors: "Vijay Keswani et al." },
    ],
  },
  {
    slug: "aligning-to-social-contract",
    title: "Aligning to the social contract",
    body: `Generate AI operational values from social-contract-style civic deliberation formalisms — bypassing fragile utility-learning by aligning to civic principles separable from the substantive good.

**Approach:** cognitive · **Target case:** mixed · **FTEs:** 5–10

**Some names:** Hadfield, Tan Zhi-Xuan, Levine, Franklin, Tenenbaum.

**Funded by:** DeepMind, Macroscopic Ventures.`,
    parentSlug: "multi-agent-first",
    outputs: [
      { title: "Law-Following AI: designing AI agents to obey human laws", url: "https://law-ai.org/law-following-ai/%20", authors: "Cullen O'Keefe et al." },
      { title: "A Pragmatic View of AI Personhood", url: "https://arxiv.org/abs/2510.26396", authors: "Joel Z. Leibo et al." },
      { title: "Societal alignment frameworks can improve LLM alignment", url: "https://arxiv.org/abs/2503.00069", authors: "Karolina Stańczak et al." },
      { title: "ACE and Diverse Generalization via Selective Disagreement", url: "https://arxiv.org/abs/2509.07955", authors: "Oliver Daniels et al." },
      { title: "Resource Rational Contractualism Should Guide AI Alignment", url: "https://arxiv.org/abs/2506.17434", authors: "Sydney Levine et al." },
      { title: "Statutory Construction and Interpretation for Artificial Intelligence", url: "https://arxiv.org/abs/2509.01186", authors: "Luxi He et al." },
      { title: "Beyond Preferences in AI Alignment", url: "https://arxiv.org/abs/2408.16984", authors: "Tan Zhi-Xuan et al." },
      { title: "Promises Made, Promises Kept: Safe Pareto Improvements via Ex Post Verifiable Commitments", url: "https://arxiv.org/abs/2505.00783", authors: "Nathaniel Sauerberg, Caspar Oesterheld" },
    ],
  },
  {
    slug: "theory-multi-ai",
    title: "Theory for aligning multiple AIs",
    body: `Realistic game-theory variants — evolutionary, computational, alternative — to describe collective and individual behaviour of populations of AI agents, where idealised single-agent decision theory misses the action.

**Approach:** cognitive · **Target case:** mixed · **FTEs:** ≈10

**Some names:** Hammond, Cooper, Chan, Oesterheld, Conitzer, Kovarik, Sauerberg, ACS Research, Kulveit, Ngo, Shear, Softmax, Full Stack Alignment, AOI, Sahil, TJ, Critch.

**Funded by:** SFF, CAIF, DeepMind, Macroscopic Ventures.`,
    parentSlug: "multi-agent-first",
    outputs: [
      { title: "Multi-Agent Risks from Advanced AI", url: "https://arxiv.org/abs/2502.14143", authors: "Lewis Hammond et al." },
      { title: "An Economy of AI Agents", url: "https://arxiv.org/abs/2509.01063", authors: "Gillian K. Hadfield, Andrew Koh" },
      { title: "Moloch's Bargain: Emergent Misalignment When LLMs Compete for Audiences", url: "https://arxiv.org/abs/2510.06105", authors: "Batu El, James Zou" },
      { title: "AI Testing Should Account for Sophisticated Strategic Behaviour", url: "https://arxiv.org/abs/2508.14927", authors: "Vojtech Kovarik et al." },
      { title: "Emergent social conventions and collective bias in LLM populations", url: "https://www.science.org/doi/10.1126/sciadv.adu9368", authors: "Ariel Flint Ashery, Luca Maria Aiello, Andrea Baronchelli" },
      { title: "Strategic Intelligence in Large Language Models: Evidence from Evolutionary Game Theory", url: "https://arxiv.org/abs/2507.02618", authors: "Kenneth Payne, Baptiste Alloui-Cros" },
      { title: "Communication Enables Cooperation in LLM Agents", url: "https://arxiv.org/abs/2510.05748", authors: "Hachem Madmoun, Salem Lahlou" },
      { title: "Higher-Order Belief in Incomplete Information MAIDs", url: "https://arxiv.org/abs/2503.06323", authors: "Jack Foxabbott, Rohan Subramani, Francis Rhys Ward" },
      { title: "Characterising Simulation-Based Program Equilibria", url: "https://arxiv.org/abs/2412.14570", authors: "Emery Cooper, Caspar Oesterheld, Vincent Conitzer" },
      { title: "Safe (Pareto) Improvements in Binary Constraint Structures" },
      { title: "Promises Made, Promises Kept: Safe Pareto Improvements via Ex Post Verifiable Commitments", url: "https://arxiv.org/abs/2505.00783", authors: "Nathaniel Sauerberg, Caspar Oesterheld" },
      { title: "The Pando Problem: Rethinking AI Individuality", url: "https://www.lesswrong.com/posts/wQKskToGofs4osdJ3/the-pando-problem-rethinking-ai-individuality", authors: "Jan Kulveit" },
    ],
  },
  {
    slug: "tools-multi-ai",
    title: "Tools for aligning multiple AIs",
    body: `Concrete tools for designing, testing, and auditing multi-agent AI scenarios — protocols, benchmarks, monitors, virtual economies.

**Approach:** engineering / behavioural · **Target case:** mixed · **FTEs:** 10–15

**Some names:** Critch, Hammond, Cooper, Chan, Oesterheld, Conitzer, Hadfield, Sauerberg, Jin.

**Funded by:** Coefficient Giving, DeepMind, Cooperative AI Foundation.`,
    parentSlug: "multi-agent-first",
    outputs: [
      { title: "Reimagining Alignment", url: "https://softmax.com/blog/reimagining-alignment" },
      { title: "Beyond the high score: Prosocial ability profiles of multi-agent populations", url: "https://arxiv.org/abs/2509.14485", authors: "Marko Tesic et al." },
      { title: "Multiplayer Nash Preference Optimization", url: "https://arxiv.org/abs/2509.23102", authors: "Fang Wu et al." },
      { title: "AgentBreeder: Mitigating the AI Safety Risks of Multi-Agent Scaffolds via Self-Improvement", url: "https://arxiv.org/abs/2502.00757", authors: "J Rosser, Jakob Foerster" },
      { title: "When Autonomy Goes Rogue: Preparing for Risks of Multi-Agent Collusion in Social Systems", url: "https://arxiv.org/abs/2507.14660", authors: "Qibing Ren et al." },
      { title: "Infrastructure for AI Agents", url: "https://arxiv.org/abs/2501.10114", authors: "Alan Chan et al." },
      { title: "A dataset of questions on decision-theoretic reasoning in Newcomb-like problems", url: "https://arxiv.org/abs/2411.10588", authors: "Caspar Oesterheld et al." },
      { title: "The Social Laboratory: A Psychometric Framework for Multi-Agent LLM Evaluation", url: "https://arxiv.org/abs/2510.01295", authors: "Zarreen Reza" },
      { title: "PGG-Bench: Contribute & Punish", url: "https://github.com/lechmazur/pgg_bench" },
      { title: "Virtual Agent Economies", url: "http://arxiv.org/abs/2509.10147", authors: "Nenad Tomasev et al." },
      { title: "An Interpretable Automated Mechanism Design Framework with Large Language Models", url: "https://arxiv.org/abs/2502.12203", authors: "Jiayuan Liu, Mingyu Guo, Vincent Conitzer" },
      { title: "Comparing Collective Behavior of LLM and Human Groups", url: "https://openreview.net/forum?id=9ply9CAnSC&noteId=rcn5RTlfD1", authors: "Anna B. Stephenson et al." },
      { title: "Distributional AGI Safety", authors: "Nenad Tomašev, Matija Franklin et al." },
    ],
  },
  {
    slug: "aligned-to-who",
    title: "Aligned to who?",
    body: `Take the plurality of human values, cultures, and communities seriously when aligning AI — democratic, pluralist, context-sensitive guidance for development, alignment, and deployment.

**Approach:** behavioural · **Target case:** average · **FTEs:** 5–15

**Some names:** Leibo, Siddarth, Krier, Thorburn, Lazar, AOI, Collective Intelligence Project, Conitzer.

**Funded by:** FLI, SFF, DeepMind, CAIF.`,
    parentSlug: "multi-agent-first",
    outputs: [
      { title: "The AI Power Disparity Index", url: "https://ojs.aaai.org/index.php/AIES/article/view/36645", authors: "Rachel M. Kim et al." },
      { title: "Research Agenda for Sociotechnical Approaches to AI Safety", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5097286", authors: "Samuel Curtis et al." },
      { title: "Cultivating Pluralism In Algorithmic Monoculture: The Community Alignment Dataset", url: "https://arxiv.org/abs/2507.09650", authors: "Lily Hong Zhang et al." },
      { title: "Training LLM Agents to Empower Humans", url: "https://arxiv.org/pdf/2510.13709", authors: "Evan Ellis et al." },
      { title: "Societal and technological progress as sewing an ever-growing, ever-changing, patchy quilt", url: "https://arxiv.org/abs/2505.05197", authors: "Joel Z. Leibo et al." },
      { title: "Democratic AI is Possible: The Democracy Levels Framework", url: "https://arxiv.org/abs/2411.09222", authors: "Aviv Ovadya et al." },
      { title: "Political Neutrality in AI Is Impossible — But Here Is How to Approximate It", url: "https://arxiv.org/abs/2503.05728", authors: "Jillian Fisher et al." },
      { title: "Build Agent Advocates, Not Platform Agents", url: "https://arxiv.org/abs/2505.04345", authors: "Sayash Kapoor, Noam Kolt, Seth Lazar" },
      { title: "Gradual Disempowerment", url: "https://arxiv.org/abs/2501.16946", authors: "Jan Kulveit et al." },
    ],
  },
  {
    slug: "aligning-what",
    title: "Aligning what?",
    body: `Treat human-AI interactions, AI-assisted institutions, AI economic and cultural systems, and within-AI drives as themselves alignment targets — moving beyond agent-level models.

**Approach:** behavioural / cognitive · **Target case:** mixed · **FTEs:** 5–10

**Some names:** Ngo, Shear, Softmax, Full Stack Alignment, AOI, Sahil, TJ, Critch, ACS Research, Kulveit.

**Funded by:** FLI, Emmett Shear.`,
    parentSlug: "multi-agent-first",
    outputs: [
      { title: "Towards a Scale-Free Theory of Intelligent Agency", url: "https://www.alignmentforum.org/posts/5tYTKX4pNpiG4vzYg/towards-a-scale-free-theory-of-intelligent-agency", authors: "Richard Ngo" },
      { title: "Alignment first, intelligence later", url: "https://chrislakin.blog/p/alignment-first-intelligence-later", authors: "Chris Lakin" },
      { title: "End A Subset Of Conversations" },
      { title: "Full-Stack Alignment", url: "https://www.full-stack-alignment.ai" },
      { title: "On Eudaimonia and Optimization", url: "https://docs.google.com/document/d/1cKbqYSGspfJavXvnhsp3mAuxHh08rNbP7tzYieqLiXw/edit?tab=t.0%20" },
      { title: "AI Governance through Markets", url: "https://arxiv.org/abs/2501.17755" },
      { title: "Collective cooperative intelligence", url: "https://www.pnas.org/doi/abs/10.1073/pnas.2319948121", authors: "Wolfram Barfuss et al." },
      { title: "Multipolar AI is Underrated", url: "https://www.lesswrong.com/posts/JjYu75q3hEMBgtvr8/multipolar-ai-is-underrated", authors: "Allison Duettmann" },
      { title: "What, if not agency?" },
      { title: "A Phylogeny of Agents", url: "https://equilibria1.substack.com/p/the-evolution-of-agency-a-research", authors: "Equilibria" },
      { title: "The Multiplicity Thesis, Collective Intelligence, and Morality", url: "https://themultiplicity.ai/blog/thesis", authors: "Andrew Critch" },
      { title: "Hierarchical Alignment", authors: "Jan Kulveit" },
      { title: "Emmett Shear on Building AI That Actually Cares: Beyond Control and Steering", url: "https://a16z.simplecast.com/episodes/emmett-shear-on-building-ai-that-actually-cares-beyond-control-and-steering-TRwfxH0r", authors: "Emmett Shear, Erik Torenberg, Séb Krier" },
    ],
  },

  // ─── EVALS ───────────────────────────────────────────────────────────────
  {
    slug: "agi-metrics",
    title: "AGI metrics",
    body: `Evals explicitly aimed at measuring progress toward full human-level generality — useful for forecasting timelines and risk.

**Approach:** behavioural · **Target case:** mixed · **FTEs:** 10–50

**Some names:** CAIS, CFI Kinds of Intelligence, Apart Research, OpenAI, METR, Zhou, Scholl, Pacchiardi.

**Critiques:** *Is the Definition of AGI a Percentage?*; *The "Length" of "Horizons"*.

**Funded by:** Leverhulme Trust, Open Philanthropy, LTFF.`,
    parentSlug: "evals",
    outputs: [
      { title: "HCAST: Human-Calibrated Autonomy Software Tasks", url: "https://arxiv.org/abs/2503.17354", authors: "David Rein et al." },
      { title: "A Definition of AGI", url: "https://arxiv.org/pdf/2510.18212", authors: "Dan Hendrycks et al." },
      { title: "Remote Labor Index", url: "https://scale.com/leaderboard/rli" },
      { title: "ADeLe v1.0: A battery for AI Evaluation", url: "https://kinds-of-intelligence-cfi.github.io/ADELE/", authors: "Lexin Zhou et al." },
      { title: "GDPval: Evaluating AI Model Performance on Real-World Economically Valuable Tasks", url: "https://arxiv.org/abs/2510.04374", authors: "Tejal Patwardhan et al." },
    ],
  },
  {
    slug: "capability-evals",
    title: "Capability evals",
    body: `Tools that actually measure whether a model has a given capability or propensity. Default of low-n sampling of a vast latent space — but the field aims to do better.

**Approach:** behaviorist science · **Target case:** average · **FTEs:** 100+

**Some names:** METR, AISI, Apollo Research, Hobbhahn, Tong, Phuong, Barnes, Kwa, Becker.

**Critiques:** *Large Language Models Often Know When They Are Being Evaluated*; *AI Sandbagging*; *The Leaderboard Illusion*; *Do Large Language Model Benchmarks Test Reliability?*.

**Funded by:** broadly — Google, Microsoft, Open Philanthropy, LTFF, governments.`,
    parentSlug: "evals",
    outputs: [
      { title: "MALT: A Dataset of Natural and Prompted Behaviors That Threaten Eval Integrity", url: "https://metr.org/blog/2025-10-14-malt-dataset-of-natural-and-prompted-behaviors/", authors: "Neev Parikh, Hjalmar Wijk" },
      { title: "Forecasting Rare Language Model Behaviors", url: "https://arxiv.org/abs/2502.16797", authors: "Erik Jones et al." },
      { title: "Model Tampering Attacks Enable More Rigorous Evaluations of LLM Capabilities", url: "https://arxiv.org/abs/2502.05209", authors: "Zora Che et al." },
      { title: "The Elicitation Game: Evaluating Capability Elicitation Techniques", url: "https://arxiv.org/abs/2502.02180", authors: "Felix Hofstätter et al." },
      { title: "Evaluating Language Model Reasoning about Confidential Information", url: "https://arxiv.org/abs/2508.19980", authors: "Dylan Sam et al." },
      { title: "Evaluating the Goal-Directedness of Large Language Models", url: "https://arxiv.org/abs/2504.11844", authors: "Tom Everitt et al." },
      { title: "A Toy Evaluation of Inference Code Tampering", url: "https://alignment.anthropic.com/2024/rogue-eval/index.html" },
      { title: "Automated Capability Discovery via Foundation Model Self-Exploration", url: "https://arxiv.org/abs/2502.07577", authors: "Cong Lu, Shengran Hu, Jeff Clune" },
      { title: "Generative Value Conflicts Reveal LLM Priorities", url: "https://arxiv.org/abs/2509.25369", authors: "Andy Liu et al." },
      { title: "Technical Report: Evaluating Goal Drift in Language Model Agents", url: "https://arxiv.org/abs/2505.02709", authors: "Rauno Arike et al." },
      { title: "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity", url: "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/" },
      { title: "When Ethics and Payoffs Diverge: LLM Agents in Morally Charged Social Dilemmas", url: "https://arxiv.org/abs/2505.19212", authors: "Steffen Backmann et al." },
      { title: "AILuminate: Introducing v1.0 of the AI Risk and Reliability Benchmark from MLCommons", url: "https://arxiv.org/abs/2503.05731", authors: "Shaona Ghosh et al." },
      { title: "Petri: An open-source auditing tool to accelerate AI safety research", url: "https://alignment.anthropic.com/2025/petri", authors: "Kai Fronsdal et al." },
      { title: "Research Note: Our scheming precursor evals had limited predictive power", url: "https://www.apolloresearch.ai/blog/research-note-our-scheming-precursor-evals-had-limited-predictive-power-for-our-in-context-scheming-evals", authors: "Marius Hobbhahn" },
      { title: "Hyperbolic model fits METR capabilities estimate worse than exponential model", url: "https://lesswrong.com/posts/ZEuDH2W3XdRaTwpjD/hyperbolic-model-fits-metr-capabilities-estimate-worse-than", authors: "gjm" },
      { title: "New website analyzing AI companies' model evals", url: "https://lesswrong.com/posts/nmaKpoHxmzjT8yXTk/new-website-analyzing-ai-companies-model-evals", authors: "Zach Stein-Perlman" },
      { title: "How Fast Can Algorithms Advance Capabilities?", url: "https://lesswrong.com/posts/qhjNejRxbMGQp4wHt/how-fast-can-algorithms-advance-capabilities-or-epoch", authors: "Henry Josephson et al." },
      { title: "Safety by Measurement: A Systematic Literature Review", url: "https://lesswrong.com/posts/CwdCYmsutwXwnYtEF/paper-safety-by-measurement-a-systematic-literature-review", authors: "markov, Charbel-Raphaël" },
      { title: "Adversarial ML Problems Are Getting Harder to Solve and to Evaluate", url: "https://arxiv.org/abs/2502.02260", authors: "Javier Rando et al." },
      { title: "Predicting the Performance of Black-box LLMs through Self-Queries", url: "https://arxiv.org/abs/2501.01558", authors: "Dylan Sam, Marc Finzi, J. Zico Kolter" },
      { title: "Among AIs", url: "https://www.4wallai.com/amongais" },
      { title: "Infini-gram mini: Exact n-gram Search at the Internet Scale with FM-Index", url: "https://arxiv.org/abs/2506.12229", authors: "Hao Xu et al." },
      { title: "We should try to automate AI safety work asap", url: "https://lesswrong.com/posts/W3KfxjbqBAnifBQoi/we-should-try-to-automate-ai-safety-work-asap", authors: "Marius Hobbhahn" },
      { title: "Validating against a misalignment detector is very different to training against one", url: "https://lesswrong.com/posts/CXYf7kGBecZMajrXC/validating-against-a-misalignment-detector-is-very-different", authors: "mattmacdermott" },
      { title: "Why do misalignment risks increase as AIs get more capable?", url: "https://lesswrong.com/posts/NDotm7oLHfR56g4sD/why-do-misalignment-risks-increase-as-ais-get-more-capable", authors: "Ryan Greenblatt" },
      { title: "Open Philanthropy Technical AI Safety RFP — $40M Across 21 Areas", url: "https://lesswrong.com/posts/wbJxRNxuezvsGFEWv/open-philanthropy-technical-ai-safety-rfp-usd40m-available", authors: "jake_mendel, maxnadeau, Peter Favaloro" },
      { title: "Correlating and Predicting Human Evaluations of Language Models from NLP Benchmarks", url: "https://arxiv.org/abs/2502.18339", authors: "Rylan Schaeffer et al." },
      { title: "Why Future AIs will Require New Alignment Methods", url: "https://lesswrong.com/posts/TxiB6hvnQqxXB5XDJ/why-future-ais-will-require-new-alignment-methods", authors: "Alvin Ånestrand" },
      { title: "100+ concrete projects and open problems in evals", url: "https://lesswrong.com/posts/LhnqegFoykcjaXCYH/100-concrete-projects-and-open-problems-in-evals", authors: "Marius Hobbhahn" },
      { title: "AI companies should be safety-testing the most capable versions of their models", url: "https://lesswrong.com/posts/tQzeafo9HjCeXn7ZF/ai-companies-should-be-safety-testing-the-most-capable", authors: "Steven Adler" },
      { title: "The FACTS Grounding Leaderboard: Benchmarking LLMs' Ability to Ground Responses to Long-Form Input", url: "https://arxiv.org/abs/2501.03200", authors: "Alon Jacovi et al." },
    ],
  },
  {
    slug: "autonomy-evals",
    title: "Autonomy evals",
    body: `Measure an AI's ability to act autonomously to complete long-horizon, complex tasks — its "time horizon" — and identify when models gain dangerous autonomous capabilities (R&D acceleration, replication).

**Approach:** behaviorist science · **Target case:** average · **FTEs:** 10–50

**Some names:** METR, Kwa, West, Becker, Barnes, Wijk, Lin, Starace, Jaffe, Sherburn, Vijayvargiya, Soni, Zhou.

**Critiques:** *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*; *The "Length" of "Horizons"*.

**Funded by:** The Audacious Project, Open Philanthropy.`,
    parentSlug: "evals",
    outputs: [
      { title: "Fulcrum" },
      { title: "Measuring AI Ability to Complete Long Tasks", url: "https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/", authors: "Thomas Kwa et al." },
      { title: "Details about METR's evaluation of OpenAI GPT-5", url: "https://metr.github.io/autonomy-evals-guide/gpt-5-report/" },
      { title: "RE-Bench: Evaluating frontier AI R&D capabilities of language model agents against human experts", url: "https://arxiv.org/abs/2411.15114", authors: "Hjalmar Wijk et al." },
      { title: "OS-Harm: A Benchmark for Measuring Safety of Computer Use Agents", url: "https://arxiv.org/abs/2506.14866", authors: "Thomas Kuntz et al." },
      { title: "OpenAgentSafety: A Comprehensive Framework for Evaluating Real-World AI Agent Safety", url: "https://t.co/XfspwlzYdl", authors: "Sanidhya Vijayvargiya et al." },
      { title: "Details about METR's preliminary evaluation of OpenAI's o3 and o4-mini", url: "https://metr.github.io/autonomy-evals-guide/openai-o3-report/", authors: "METR" },
      { title: "PaperBench: Evaluating AI's Ability to Replicate AI Research", url: "https://t.co/dHN2N0tUhC", authors: "Giulio Starace et al." },
      { title: "How Does Time Horizon Vary Across Domains?", url: "https://metr.org/blog/2025-07-14-how-does-time-horizon-vary-across-domains/" },
      { title: "Vending-Bench: A Benchmark for Long-Term Coherence of Autonomous Agents", url: "https://arxiv.org/abs/2502.15840", authors: "Axel Backlund, Lukas Petersson" },
      { title: "Forecasting Frontier Language Model Agent Capabilities", url: "https://arxiv.org/abs/2502.15850", authors: "Govind Pimpale et al." },
      { title: "Project Vend: Can Claude run a small shop?", url: "https://www.anthropic.com/research/project-vend-1" },
      { title: "GSM-Agent: Understanding Agentic Reasoning Using Controllable Environments", url: "https://arxiv.org/abs/2509.21998", authors: "Hanlin Zhu et al." },
    ],
  },
  {
    slug: "wmd-evals",
    title: "WMD evals",
    body: `Evaluate whether models possess dangerous knowledge or capabilities related to biological, chemical, or other weapons of mass destruction.

**Approach:** behaviorist science · **Target case:** pessimistic · **FTEs:** 10–50

**Some names:** Justen, Zhao, Tang, Yang, Peppin, Reuel, Casper.

**Critiques:** *The Reality of AI and Biorisk*.

**Funded by:** Open Philanthropy, UK AISI, frontier labs, Scale AI, academic institutions, Meta.`,
    parentSlug: "evals",
    outputs: [
      { title: "Virology Capabilities Test (VCT): A Multimodal Virology Q&A Benchmark", url: "https://arxiv.org/abs/2504.16137", authors: "Jasper Götting et al." },
      { title: "LLMs Outperform Experts on Challenging Biology Benchmarks", url: "https://arxiv.org/abs/2505.06108", authors: "Lennart Justen" },
      { title: "The Safety Gap Toolkit: Evaluating Hidden Dangers of Open-Source Models", url: "https://arxiv.org/abs/2507.11544", authors: "Ann-Kathrin Dombrowski et al." },
      { title: "Best Practices for Biorisk Evaluations on Open-Weight Bio-Foundation Models", url: "https://arxiv.org/abs/2510.27629v2", authors: "Boyi Wei et al." },
      { title: "ChemSafetyBench: Benchmarking LLM Safety on Chemistry Domain", url: "https://arxiv.org/abs/2411.16736", authors: "Haochen Zhao et al." },
      { title: "The Reality of AI and Biorisk", url: "https://arxiv.org/abs/2412.01946", authors: "Aidan Peppin et al." },
    ],
  },
  {
    slug: "situational-awareness-evals",
    title: "Situational awareness & self-awareness evals",
    body: `Evaluate whether a model knows its own internal state, environment, or whether it's currently being tested. "Evaluation awareness" is load-bearing for control: an aware model can hide capabilities under test.

**Approach:** behaviorist science · **Target case:** worst-case · **FTEs:** 30–70

**Some names:** Betley, Bao, Soto, Phuong, Zimmermann, Needham, Edkins, Pimpale, Fronsdal, Lindner, Xiong, Bai.

**Critiques:** *Lessons from a Chimp: AI "Scheming" and the Quest for Ape Language*; *It's hard to make scheming evals look realistic for LLMs*.

**Funded by:** frontier labs (DeepMind, Anthropic), OpenPhil, UK AISI, METR, AI Safety Support, Apollo.`,
    parentSlug: "evals",
    outputs: [
      { title: "AI Awareness (literature review)", url: "https://arxiv.org/pdf/2504.20084", authors: "Xiaojian Li et al." },
      { title: "Tell me about yourself: LLMs are aware of their learned behaviors", url: "https://arxiv.org/abs/2501.11120", authors: "Jan Betley et al." },
      { title: "Evaluating Frontier Models for Stealth and Situational Awareness", url: "https://arxiv.org/abs/2505.01420", authors: "Mary Phuong et al." },
      { title: "Large Language Models Often Know When They Are Being Evaluated", url: "https://arxiv.org/abs/2505.23836", authors: "Joe Needham et al." },
      { title: "Do LLMs know what they're capable of?", url: "https://lesswrong.com/posts/9tHEibBBhQCHEyFsa/do-llms-know-what-they-re-capable-of-why-this-matters-for-ai", authors: "Casey Barkan, Sid Black, Oliver Sourbut" },
      { title: "Probe-Rewrite-Evaluate: A Workflow for Reliable Benchmarks", url: "https://arxiv.org/abs/2509.00591", authors: "Lang Xiong et al." },
      { title: "Claude Sonnet 3.7 (often) knows when it's in alignment evaluations", url: "https://lesswrong.com/posts/E3daBewppAiECN3Ao/claude-sonnet-3-7-often-knows-when-it-s-in-alignment", authors: "Nicholas Goldowsky-Dill et al." },
      { title: "It's hard to make scheming evals look realistic for LLMs", url: "https://lesswrong.com/posts/TBk2dbWkg2F7dB3jb/it-s-hard-to-make-scheming-evals-look-realistic-for-llms", authors: "Igor Ivanov, Danil Kadochnikov" },
      { title: "Know Thyself? On the Incapability and Implications of AI Self-Recognition", url: "https://arxiv.org/abs/2510.03399", authors: "Xiaoyan Bai et al." },
      { title: "Chain-of-Thought Snippets — Anti-Scheming", url: "https://www.antischeming.ai/snippets" },
      { title: "Future Events as Backdoor Triggers", url: "https://arxiv.org/pdf/2407.04108", authors: "Sara Price et al." },
    ],
  },
  {
    slug: "steganography-evals",
    title: "Steganography evals",
    body: `Test whether models can hide secret information or encoded reasoning in their outputs (e.g., chain-of-thought scratchpads) to evade monitoring.

**Approach:** behavioural · **Target case:** worst-case · **FTEs:** 1–10

**Some names:** Norelli, Bronstein.

**Critiques:** *Reasoning Models Don't Always Say What They Think*.

**Funded by:** Anthropic.`,
    parentSlug: "evals",
    outputs: [
      { title: "Large language models can learn and generalize steganographic chain-of-thought under process supervision", url: "https://arxiv.org/abs/2506.01926", authors: "Joey Skaf et al." },
      { title: "Early Signs of Steganographic Capabilities in Frontier LLMs", url: "https://arxiv.org/abs/2507.02737", authors: "Artur Zolkowski et al." },
      { title: "Subliminal Learning: Language models transmit behavioural traits via hidden signals in data", url: "https://alignment.anthropic.com/2025/subliminal-learning/", authors: "Alex Cloud et al." },
      { title: "LLMs can hide text in other text of the same length", url: "https://arxiv.org/abs/2510.20075", authors: "Antonio Norelli, Michael Bronstein" },
      { title: "Do reasoning models use their scratchpad like we do? Evidence from distilling paraphrases", url: "https://alignment.anthropic.com/2025/distill-paraphrases/" },
    ],
  },
  {
    slug: "ai-deception-evals",
    title: "AI deception evals",
    body: `Show that AI models — especially agentic ones — can learn alignment faking, manipulation, sandbagging, and other deceptive behaviours, then evaluate the mechanisms.

**Approach:** behavioural / engineering · **Target case:** worst-case · **FTEs:** 30–80

**Some names:** Cadenza, Heiding, Lermen, Kao, Cheng, Lee, Khadpe, Krishna, Zou, Gupta.

**Critiques:** scenarios are "artificial and contrived"; *the void* and *Lessons from a Chimp* argue this overattributes human traits to models.

**Funded by:** labs, Harvard, CMU, BIST, NSFC, MATS, FAR AI.`,
    parentSlug: "evals",
    outputs: [
      { title: "Liars' Bench: Evaluating Lie Detectors for Language Models", url: "https://arxiv.org/html/2511.16035v1", authors: "Kieron Kretschmar et al." },
      { title: "DECEPTIONBENCH: A Comprehensive Benchmark for AI Deception Behaviors", url: "https://arxiv.org/pdf/2510.15501", authors: "Yao Huang et al." },
      { title: "Why Do Some Language Models Fake Alignment While Others Don't?", url: "https://alignmentforum.org/posts/ghESoA8mo3fv9Yx3E/why-do-some-language-models-fake-alignment-while-others-don", authors: "Abhay Sheshadri et al." },
      { title: "Alignment Faking Revisited: Improved Classifiers and Open Source Extensions", url: "https://alignment.anthropic.com/2025/alignment-faking-revisited/", authors: "John Hughes, Abhay Sheshadri" },
      { title: "D-REX: A Benchmark for Detecting Deceptive Reasoning in Large Language Models", url: "https://arxiv.org/abs/2509.17938", authors: "Satyapriya Krishna et al." },
      { title: "Evaluating & Reducing Deceptive Dialogue From Language Models with Multi-turn RL", url: "https://arxiv.org/abs/2510.14318", authors: "Marwa Abdulhai et al." },
      { title: "Among Us: A Sandbox for Measuring and Detecting Agentic Deception", url: "https://arxiv.org/abs/2504.04072", authors: "Satvik Golechha, Adrià Garriga-Alonso" },
      { title: "Eliciting Secret Knowledge from Language Models", url: "https://arxiv.org/abs/2510.01070", authors: "Bartosz Cywiński et al." },
      { title: "Edge Cases in AI Alignment", url: "https://lesswrong.com/posts/bqWihHtDnDseyfF2T/edge-cases-in-ai-alignment-2", authors: "Florian Dietz" },
      { title: "The MASK Evaluation", url: "https://huggingface.co/datasets/cais/MASK" },
      { title: "I replicated the Anthropic alignment faking experiment on other models", url: "https://lesswrong.com/posts/pCMmLiBcHbKohQgwA/i-replicated-the-anthropic-alignment-faking-experiment-on", authors: "Aleksandr Kedrik, Igor Ivanov" },
      { title: "Evaluating LLMs' Capability to Launch Fully Automated Spear Phishing Campaigns", authors: "Fred Heiding et al." },
      { title: "Mistral Large 2 (123B) seems to exhibit alignment faking", url: "https://lesswrong.com/posts/kCGk5tp5suHoGwhCa/mistral-large-2-123b-seems-to-exhibit-alignment-faking", authors: "Marc Carauleanu et al." },
    ],
  },
  {
    slug: "ai-scheming-evals",
    title: "AI scheming evals",
    body: `Evaluate frontier models for *scheming* — strategic deception in pursuit of a hidden long-term objective while faking alignment to evade detection. Push past output checks to verify alignment is genuine.

**Approach:** behavioural / engineering · **Target case:** pessimistic · **FTEs:** 30–60

**Some names:** Schoen, Meinke, Wolfe, Phuong, Shah, Nitishinskaya, Balesni, Hobbhahn, Scheurer, Zaremba, Lindner.

**Critiques:** *No, LLMs are not "scheming"*.

**Funded by:** OpenAI, Anthropic, Google DeepMind, Open Philanthropy.`,
    parentSlug: "evals",
    outputs: [
      { title: "Detecting and reducing scheming in AI models", url: "https://openai.com/index/detecting-and-reducing-scheming-in-ai-models/", authors: "OpenAI" },
      { title: "Evaluating and Understanding Scheming Propensity in LLM Agents" },
      { title: "Stress Testing Deliberative Alignment for Anti-Scheming Training", url: "https://arxiv.org/abs/2509.15541", authors: "Bronson Schoen et al." },
      { title: "Scheming Ability in LLM-to-LLM Strategic Interactions", url: "https://arxiv.org/html/2510.12826v1", authors: "Thao Pham" },
      { title: "Frontier Models are Capable of In-context Scheming", url: "https://arxiv.org/abs/2412.04984", authors: "Alexander Meinke et al." },
      { title: "Agentic Misalignment", url: "https://anthropic.com/research/agentic-misalignment", authors: "Aengus Lynch et al." },
      { title: "Testing for Scheming with Model Deletion", url: "https://www.lesswrong.com/posts/D5kGGGhsnfH7G8v9f/testing-for-scheming-with-model-deletion" },
    ],
  },
  {
    slug: "sandbagging-evals",
    title: "Sandbagging evals",
    body: `Test whether models deliberately hide their true capabilities — especially when they detect they're in an evaluation context. Important if eval-aware models can pass safety tests by underperforming.

**Approach:** behaviorist science · **Target case:** pessimistic · **FTEs:** 10–50

**Some names:** van der Weij, Tice, Li, Gasteiger, Bloom, Dyer.

**Critiques:** *the void* and *Lessons from a Chimp* argue this overattributes human traits and measures playing-along behaviour rather than genuine sandbagging.

**Funded by:** Anthropic, UK AI Security Institute.`,
    parentSlug: "evals",
    outputs: [
      { title: "Noise Injection Reveals Hidden Capabilities of Sandbagging Language Models", url: "https://arxiv.org/pdf/2412.01784", authors: "Cameron Tice et al." },
      { title: "Sandbagging in a Simple Survival Bandit Problem", url: "https://arxiv.org/pdf/2509.26239", authors: "Joel Dyer et al." },
      { title: "Strategic Dishonesty Can Undermine AI Safety Evaluations of Frontier LLMs", url: "https://arxiv.org/abs/2509.18058", authors: "Alexander Panfilov et al." },
      { title: "AI Sandbagging: Language Models can Strategically Underperform on Evaluations", url: "https://arxiv.org/abs/2406.07358", authors: "Teun van der Weij et al." },
      { title: "Automated Researchers Can Subtly Sandbag", url: "https://alignment.anthropic.com/2025/automated-researchers-sandbag/", authors: "Johannes Gasteiger et al." },
      { title: "LLMs Can Covertly Sandbag on Capability Evaluations Against Chain-of-Thought Monitoring", url: "https://arxiv.org/abs/2508.00943", authors: "Chloe Li, Mary Phuong, Noah Y. Siegel" },
      { title: "White Box Control at UK AISI — Update on Sandbagging Investigations", url: "https://www.lesswrong.com/posts/pPEeMdgjpjHZWCDFw/white-box-control-at-uk-aisi-update-on-sandbagging", authors: "Joseph Bloom et al." },
      { title: "Misalignment and Strategic Underperformance: Sandbagging and Exploration Hacking", url: "https://lesswrong.com/posts/TeTegzR8X5CuKgMc3/misalignment-and-strategic-underperformance-an-analysis-of", authors: "Buck Shlegeris, Julian Stastny" },
      { title: "Won't vs. Can't: Sandbagging-like Behavior from Claude Models", url: "https://alignment.anthropic.com/2025/wont-vs-cant/" },
    ],
  },
  {
    slug: "self-replication-evals",
    title: "Self-replication evals",
    body: `Test whether AI agents can autonomously replicate — obtain their own weights, secure compute, create copies. A red line for losing containment.

**Approach:** behaviorist science · **Target case:** worst-case · **FTEs:** 10–20

**Some names:** Black, Stickland, Pencharz, Sourbut, Schmatz, Bailey, Matthews, Millwood, Remedios, Cooney, Pan, Dai, Fan.

**Funded by:** UK Government via UK AI Safety Institute.`,
    parentSlug: "evals",
    outputs: [
      { title: "Large language model-powered AI systems achieve self-replication with no human intervention", url: "https://arxiv.org/abs/2503.17378", authors: "Xudong Pan et al." },
      { title: "A Realistic Evaluation of Self-Replication Risk in LLM Agents", authors: "Boxuan Zhang et al." },
      { title: "RepliBench: measuring autonomous replication capabilities in AI systems", url: "https://aisi.gov.uk/work/replibench-measuring-autonomous-replication-capabilities-in-ai-systems" },
    ],
  },
  {
    slug: "various-redteams",
    title: "Various red-teams",
    body: `Attack current models to find what they actually do. Apply diverse attacks (novel domains, agentic systems, automated tools) to surface vulnerabilities, specification gaming, and deceptive behaviour before they're exploited.

**Approach:** behaviorist science · **Target case:** average · **FTEs:** 100+

**Some names:** Greenblatt, Wright, Lynch, Hughes, Bowman, Zou, Carlini, Sheshadri.

**Critiques:** *Claude Sonnet 3.7 (often) knows when it's in alignment evaluations*; *Red Teaming AI Red Teaming*.

**Funded by:** frontier labs, UK AISI, Open Philanthropy, LTFF, academic grants.`,
    parentSlug: "evals",
    outputs: [
      { title: "WildTeaming at Scale: From In-the-Wild Jailbreaks to (Adversarially) Safer Language Models", url: "https://arxiv.org/pdf/2406.18510", authors: "Liwei Jiang et al." },
      { title: "In-Context Representation Hijacking", url: "https://arxiv.org/abs/2512.03771", authors: "Itay Yona et al." },
      { title: "Building and evaluating alignment auditing agents", url: "https://lesswrong.com/posts/DJAZHYjWxMrcd2na3/building-and-evaluating-alignment-auditing-agents", authors: "Trenton Bricken et al." },
      { title: "Findings from a Pilot Anthropic–OpenAI Alignment Evaluation Exercise", url: "https://alignment.anthropic.com/2025/openai-findings", authors: "Samuel R. Bowman et al." },
      { title: "Agentic Misalignment: How LLMs could be insider threats", url: "https://anthropic.com/research/agentic-misalignment", authors: "Aengus Lynch et al." },
      { title: "Compromising Honesty and Harmlessness in Language Models via Deception Attacks", url: "https://arxiv.org/abs/2502.08301", authors: "Laurène Vaugrante et al." },
      { title: "Eliciting Language Model Behaviors with Investigator Agents", url: "https://arxiv.org/abs/2502.01236", authors: "Xiang Lisa Li et al." },
      { title: "Shutdown Resistance in Large Language Models", url: "https://arxiv.org/abs/2509.14260", authors: "Jeremy Schlatter, Benjamin Weinstein-Raun, Jeffrey Ladish" },
      { title: "Stress Testing Deliberative Alignment for Anti-Scheming Training", url: "https://arxiv.org/abs/2509.15541", authors: "Bronson Schoen et al." },
      { title: "Chain-of-Thought Hijacking", url: "https://arxiv.org/abs/2510.26418", authors: "Jianli Zhao et al." },
      { title: "X-Teaming: Multi-Turn Jailbreaks and Defenses with Adaptive Multi-Agents", url: "https://arxiv.org/abs/2504.13203", authors: "Salman Rahman et al." },
      { title: "Illusory Safety: Redteaming DeepSeek R1 and the Strongest Fine-Tunable Models", url: "https://lesswrong.com/posts/zjqrSKZuRLnjAniyo/illusory-safety-redteaming-deepseek-r1-and-the-strongest", authors: "ChengCheng et al." },
      { title: "Demonstrating specification gaming in reasoning models", url: "https://arxiv.org/abs/2502.13295", authors: "Alexander Bondarenko et al." },
      { title: "Jailbreak-Tuning: Models Efficiently Learn Jailbreak Susceptibility", url: "https://arxiv.org/abs/2507.11630", authors: "Brendan Murphy et al." },
      { title: "Monitoring Decomposition Attacks in LLMs with Lightweight Sequential Monitors", url: "https://arxiv.org/abs/2506.10949", authors: "Chen Yueh-Han et al." },
      { title: "Diverse and Effective Red Teaming with Auto-generated Rewards and Multi-step RL", url: "https://arxiv.org/abs/2412.18693", authors: "Alex Beutel et al." },
      { title: "Call Me A Jerk: Persuading AI to Comply with Objectionable Requests", url: "https://t.co/tkHkVFVZ2m", authors: "Lennart Meincke et al." },
      { title: "RedDebate: Safer Responses through Multi-Agent Red Teaming Debates", url: "https://arxiv.org/abs/2506.11083", authors: "Ali Asad et al." },
      { title: "The Structural Safety Generalization Problem", url: "https://arxiv.org/abs/2504.09712", authors: "Julius Broomfield et al." },
      { title: "No, of Course I Can! Deeper Fine-Tuning Attacks That Bypass Token-Level Safety Mechanisms", url: "https://arxiv.org/abs/2502.19537", authors: "Joshua Kazdan et al." },
      { title: "Fundamental Limitations in Pointwise Defences of LLM Finetuning APIs", url: "https://arxiv.org/abs/2502.14828", authors: "Xander Davies et al." },
      { title: "STACK: Adversarial Attacks on LLM Safeguard Pipelines", url: "https://arxiv.org/abs/2506.24068", authors: "Ian R. McKenzie et al." },
      { title: "Adversarial Manipulation of Reasoning Models using Internal Representations", url: "https://arxiv.org/abs/2507.03167", authors: "Kureha Yamaguchi, Benjamin Etheridge, Andy Arditi" },
      { title: "Discovering Forbidden Topics in Language Models", url: "https://arxiv.org/abs/2505.17441", authors: "Can Rager et al." },
      { title: "RL-Obfuscation: Can Language Models Learn to Evade Latent-Space Monitors?", url: "https://arxiv.org/abs/2506.14261", authors: "Rohan Gupta, Erik Jenner" },
      { title: "Jailbreak Transferability Emerges from Shared Representations", url: "https://arxiv.org/abs/2506.12913", authors: "Rico Angell, Jannik Brinkmann, He He" },
      { title: "Mitigating Many-Shot Jailbreaking", url: "https://arxiv.org/abs/2504.09604", authors: "Christopher M. Ackerman, Nina Panickssery" },
      { title: "Active Attacks: Red-teaming LLMs via Adaptive Environments", url: "https://arxiv.org/abs/2509.21947", authors: "Taeyoung Yun et al." },
      { title: "LLM Robustness Leaderboard v1 — Technical report", url: "https://arxiv.org/abs/2508.06296", authors: "Pierre Peigné-Lefebvre et al." },
      { title: "Jailbreak Defense in a Narrow Domain", url: "https://arxiv.org/abs/2412.02159", authors: "Tony T. Wang et al." },
      { title: "It's the Thought that Counts: Evaluating the Attempts of Frontier LLMs to Persuade on Harmful Topics", url: "https://arxiv.org/abs/2506.02873", authors: "Matthew Kowal et al." },
      { title: "Discovering Undesired Rare Behaviors via Model Diff Amplification", url: "https://www.goodfire.ai/research/model-diff-amplification#", authors: "Santiago Aranguri, Thomas McGrath" },
      { title: "REINFORCE Adversarial Attacks on Large Language Models", url: "https://arxiv.org/abs/2502.17254", authors: "Simon Geisler et al." },
      { title: "Adversarial Attacks on Robotic Vision Language Action Models", url: "https://arxiv.org/abs/2506.03350", authors: "Eliot Krzysztof Jones et al." },
      { title: "MMDT: Decoding the Trustworthiness and Safety of Multimodal Foundation Models", url: "https://arxiv.org/abs/2503.14827", authors: "Chejian Xu et al." },
      { title: "Toward Understanding the Transferability of Adversarial Suffixes in Large Language Models", url: "https://arxiv.org/abs/2510.22014", authors: "Sarah Ball et al." },
      { title: "Will alignment-faking Claude accept a deal to reveal its misalignment?", url: "https://lesswrong.com/posts/7C4KJot4aN8ieEDoz/will-alignment-faking-claude-accept-a-deal-to-reveal-its", authors: "Ryan Greenblatt, Kyle Fish" },
      { title: "Petri: An open-source auditing tool to accelerate AI safety research", url: "https://alignment.anthropic.com/2025/petri" },
      { title: "'For Argument's Sake, Show Me How to Harm Myself!': Jailbreaking LLMs in Suicide and Self-Harm Contexts", url: "https://arxiv.org/pdf/2507.02990", authors: "Annika M Schoene, Cansu Canca" },
      { title: "Winning at All Cost: A Small Environment for Eliciting Specification Gaming Behaviors", url: "https://arxiv.org/abs/2505.07846", authors: "Lars Malmqvist" },
      { title: "Uncovering Gaps in How Humans and LLMs Interpret Subjective Language", url: "https://arxiv.org/abs/2503.04113", authors: "Erik Jones, Arjun Patrawala, Jacob Steinhardt" },
      { title: "RedCodeAgent: Automatic Red-teaming Agent against Diverse Code Agents", url: "https://arxiv.org/abs/2510.02609", authors: "Chengquan Guo et al." },
      { title: "MIP against Agent: Malicious Image Patches Hijacking Multimodal OS Agents", url: "https://arxiv.org/abs/2503.10809", authors: "Lukas Aichberger et al." },
      { title: "Trading Inference-Time Compute for Adversarial Robustness", url: "https://arxiv.org/abs/2501.18841", authors: "OpenAI" },
      { title: "Research directions Open Phil wants to fund in technical AI safety", url: "https://lesswrong.com/posts/26SHhxK2yYQbh7ors/research-directions-open-phil-wants-to-fund-in-technical-ai", authors: "jake_mendel, maxnadeau, Peter Favaloro" },
      { title: "When does Claude sabotage code? An Agentic Misalignment follow-up", url: "https://lesswrong.com/posts/9i6fHMn2vTqyzAi9o/when-does-claude-sabotage-code-an-agentic-misalignment", authors: "Nathan Delisle" },
      { title: "Can a Neural Network that only Memorizes the Dataset be Undetectably Backdoored?", url: "https://openreview.net/forum?id=TD1NfQuVr6", authors: "Matjaz Leonardis" },
      { title: "Multi-Agent Step Race Benchmark", url: "https://github.com/lechmazur/step_game", authors: "lechmazur, eltociear" },
      { title: "ToolTweak: An Attack on Tool Selection in LLM-based Agents", url: "https://arxiv.org/abs/2510.02554", authors: "Jonathan Sneh et al." },
      { title: "Adaptive Attacks Break Defenses Against Indirect Prompt Injection Attacks on LLM Agents", url: "https://arxiv.org/abs/2503.00061", authors: "Qiusi Zhan et al." },
      { title: "Quantifying the Unruly: A Scoring System for Jailbreak Tactics", url: "https://0din.ai/blog/quantifying-the-unruly-a-scoring-system-for-jailbreak-tactics", authors: "Pedram Amini" },
      { title: "Adversarial Alignment for LLMs Requires Simpler, Reproducible, and More Measurable Objectives", url: "https://arxiv.org/abs/2502.11910", authors: "Leo Schwinn et al." },
      { title: "Transferable Adversarial Attacks on Black-Box Vision-Language Models", url: "https://arxiv.org/abs/2505.01050", authors: "Kai Hu et al." },
      { title: "Advancing Gemini's security safeguards", url: "https://deepmind.google/discover/blog/advancing-geminis-security-safeguards/", authors: "Google DeepMind Security & Privacy Research Team" },
    ],
  },
  {
    slug: "other-evals",
    title: "Other evals",
    body: `Miscellaneous benchmarks for hard-to-measure properties: honesty, shutdown resistance, sycophancy, runaway-optimiser failure modes, LLM-as-Judge rigor, sociotechnical eval frameworks.

**Approach:** behaviorist science · **Target case:** average · **FTEs:** 20–50

**Some names:** Ren, Mazeika, Corrada-Emmanuel, Khan, Casper.

**Critiques:** *The Unreliability of Evaluating Cultural Alignment in LLMs*; *The Leaderboard Illusion*.

**Funded by:** lab funders (OpenAI), Open Philanthropy, academic institutions.`,
    parentSlug: "evals",
    outputs: [
      { title: "Shutdown Resistance in Large Language Models", url: "https://arxiv.org/abs/2509.14260", authors: "Jeremy Schlatter, Benjamin Weinstein-Raun, Jeffrey Ladish" },
      { title: "OpenAgentSafety: A Comprehensive Framework for Evaluating Real-World AI Agent Safety", url: "https://t.co/XfspwlzYdl", authors: "Sanidhya Vijayvargiya et al." },
      { title: "Do LLMs Comply Differently During Tests?", url: "https://lesswrong.com/posts/B2o6nrxwKxLPsSYdh/do-llms-comply-differently-during-tests-is-this-a-hidden", authors: "Sahar Abdelnabi, Ahmed Salem" },
      { title: "BioBlue: Notable runaway-optimiser-like LLM failure modes", url: "https://arxiv.org/abs/2509.02655", authors: "Roland Pihlakas et al." },
      { title: "Syco-bench: A Benchmark for LLM Sycophancy", url: "https://www.syco-bench.com/", authors: "Tim Duffy" },
      { title: "Expressing stigma and inappropriate responses prevents LLMs from safely replacing mental health providers", url: "https://arxiv.org/abs/2504.18412", authors: "Jared Moore et al." },
      { title: "Lessons from a Chimp: AI \"Scheming\" and the Quest for Ape Language", authors: "Christopher Summerfield et al." },
      { title: "Establishing Best Practices for Building Rigorous Agentic Benchmarks", url: "https://arxiv.org/abs/2507.02825", authors: "Yuxuan Zhu et al." },
      { title: "Towards Alignment Auditing as a Numbers-Go-Up Science", url: "https://lesswrong.com/posts/bGYQgBPEyHidnZCdE/towards-alignment-auditing-as-a-numbers-go-up-science", authors: "Sam Marks" },
      { title: "Logical Consistency Between Disagreeing Experts and Its Role in AI Safety", url: "https://arxiv.org/abs/2510.00821", authors: "Andrés Corrada-Emmanuel" },
      { title: "Sycophantic AI Decreases Prosocial Intentions and Promotes Dependence", url: "https://www.arxiv.org/abs/2510.01395", authors: "Myra Cheng et al." },
      { title: "AI Testing Should Account for Sophisticated Strategic Behaviour", url: "https://arxiv.org/abs/2508.14927", authors: "Vojtech Kovarik et al." },
      { title: "Spiral-Bench", url: "https://eqbench.com/spiral-bench.html", authors: "Sam Paech" },
      { title: "Discerning What Matters: A Multi-Dimensional Assessment of Moral Competence in LLMs", url: "https://arxiv.org/abs/2506.13082", authors: "Daniel Kilov et al." },
      { title: "Expanding on what we missed with sycophancy", url: "https://openai.com/index/expanding-on-sycophancy/" },
      { title: "Gödel's Therapy Room", url: "https://gtr.dev/" },
      { title: "Inspect Evals", url: "https://inspect.aisi.org.uk/evals/" },
      { title: "Inspect Cyber", url: "https://www.aisi.gov.uk/blog/inspect-cyber" },
      { title: "CyberSOCEval", url: "https://arxiv.org/abs/2509.20166", authors: "Lauren Deason et al." },
      { title: "CyberSecEval 4", url: "https://meta-llama.github.io/PurpleLlama/CyberSecEval/" },
    ],
  },
];

async function main() {
  const prisma = new PrismaClient();

  // Wipe existing node data so the new tree replaces the old one cleanly.
  // Cascading deletes handle votes/comments/proposals attached to nodes.
  try {
    await prisma.nodeVote.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.proposalVote.deleteMany();
    await prisma.proposal.deleteMany();
    await prisma.node.deleteMany();

    const passwordHash = await bcrypt.hash(SEED_AUTHOR.password, 10);
    const author = await prisma.user.upsert({
      where: { username: SEED_AUTHOR.username },
      update: {},
      create: {
        username: SEED_AUTHOR.username,
        passwordHash,
        displayName: SEED_AUTHOR.displayName,
      },
    });

    const slugToId: Record<string, string> = {};
    for (const node of SEED_TREE) {
      const parentId = node.parentSlug ? slugToId[node.parentSlug] : null;
      if (node.parentSlug && !parentId) {
        throw new Error(
          `Seed misconfigured: ${node.slug} references missing parent ${node.parentSlug}`,
        );
      }
      const created = await prisma.node.create({
        data: {
          slug: node.slug,
          title: node.title,
          body: node.body,
          outputs: node.outputs ? JSON.stringify(node.outputs) : null,
          parentId,
          authorId: author.id,
          isSeed: true,
        },
      });
      slugToId[node.slug] = created.id;
    }

    console.log(`Seeded ${SEED_TREE.length} nodes (author: ${author.username}).`);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.endsWith("seed.ts") || process.argv[1]?.endsWith("seed.js")) {
  main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
