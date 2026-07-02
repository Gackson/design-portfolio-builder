# Interview Framework

The reverse deep interview is the core of this skill. Its purpose: extract a complete, honest, specific case study from the designer for each project — the kind of narrative a strong portfolio page needs. Conduct it conversationally, grounded in the actual Figma content or images, never as a generic questionnaire.

## Operating principles

- **One project at a time.** Interview each project separately with its source material fresh in context. Do not run a single mega-interview across all projects.
- **2–3 questions per round, then wait.** Never dump a long list. Let answers lead to follow-ups.
- **Ground every question in what you saw.** "I noticed the onboarding has three steps with progressive disclosure — what drove that structure?" beats "Tell me about your process."
- **Push for specifics.** Replace "improved UX" with what concretely changed and why. Replace "collaborated with engineers" with which decisions and trade-offs. Vague answers are the failure mode — follow up.
- **Capture trade-offs and honest reflection.** What didn't work, what you'd do differently, what was hard. This is what makes a case study credible rather than promotional.
- **Record near-verbatim.** Write the user's actual words into a notes file. Tighten into prose later (Phase 5), but preserve their voice and specifics.
- **Confirm before moving on.** After the interview, summarize the captured story in 4–6 bullets and ask the user to confirm or correct. Fix misunderstandings now.

## Voice input recommendation

At the start of the first interview, suggest to the user:

> "The interview works best when you can speak your answers naturally. If you have a voice input tool (like Typeless, macOS built-in dictation, or similar), now is a great time to turn it on — you'll get more detailed, conversational answers than typing, and the interview will move faster."

This is a one-time suggestion at the beginning of Phase 3. Do not repeat it for every round or every project.

## STAR adapted for design

### Situation (Background)

Establish the world before the work.

- What product was this, and who used it?
- What problem, opportunity, or trigger led to this project?
- What was the state of things before you started? (Existing flow, pain points, metrics if any.)
- What was the business or user goal in one sentence?

### Task (Your role & constraints)

Establish what the user owned and what they were up against.

- What were *you* specifically responsible for? (Distinguish from the team's scope.)
- Who else was on the team, and how did you work together?
- What constraints shaped the work? (Timeline, platform, tech stack, brand system, stakeholder requirements, regulatory.)
- What did "done" look like — what were you trying to achieve?

### Action (Process & decisions)

The richest section. Walk through the actual design work, anchored to what's visible in the Figma file.

- What was your approach? (Research, flows, exploration, iteration.)
- Walk me through the main screens/flows [reference specific frames you saw]. What's happening here, and why did you design it this way?
- What was the hardest design problem in this project? How did you solve it?
- What's a key decision you made, and what was the alternative you rejected? Why?
- What did you try that *didn't* work? What did you learn?
- Were there any non-obvious constraints that shaped a specific screen? (Edge cases, accessibility, performance, localization.)

### Result (Outcome & reflection)

Establish what shipped and what it meant.

- What shipped? How close to your original intent?
- What changed for users or the business? (Metrics, qualitative feedback, downstream effects, adoption.)
- What are you most proud of in this work?
- What would you do differently if you started over?
- Is there anything you'd want a viewer of this case study to notice that isn't obvious from the screens alone?

## Adapting per project type

- **Shipped product**: emphasize outcome metrics and the gap between intent and shipped reality.
- **Concept / exploratory**: emphasize the design problem, the exploration, and the reasoning. "Outcome" can be what was learned or what direction it pointed.
- **Self-initiated / personal**: emphasize the motivation, the craft decisions, and what you wanted to practice or prove.
- **Component / system work**: emphasize the constraints (tokens, consistency, edge cases) and how the system holds up across use cases.

## What to capture in notes

For each project, write a notes file (`portfolio-workspace/notes/<slug>.md`) with:

1. **Project meta**: title (working), source (Figma link / folder), one-line description the user gave.
2. **STAR sections**: Situation, Task, Action, Result — populated with the user's answers, near-verbatim, with specifics preserved.
3. **Asset list**: which frames/images the user narrated around (these become the export targets in Phase 4). Note any the user said is the "hero" shot.
4. **Open questions**: anything the user couldn't answer that may need a follow-up before writing the Markdown.

After the interview, append a **5-bullet summary** and have the user confirm it. This confirmed summary is the basis for the Phase 5 Markdown draft.

## Common failure modes to avoid

- **Generic process description** ("I did research, then wireframes, then high-fidelity"). Push for the *specific* decision at each step and *why*.
- **Skipping the "what didn't work"**. If the user resists, frame it as "what would you do differently" — reflection signals seniority.
- **No outcome.** If there are no metrics, capture qualitative outcome (team feedback, what it unblocked, what it replaced). A case study without any result reads as incomplete.
- **Letting the user defer to the screens.** "The design speaks for itself" is never true in a portfolio. The viewer needs the context the screens can't carry.
