---
name: design-portfolio-builder
description: Use when the user wants to create, build, or update a blog-style web design portfolio that showcases design projects as individual case-study pages. Covers collecting projects from Figma links or Ardot files or local image folders, conducting STAR-structured reverse interviews to extract each project's story, exporting assets, writing Markdown-driven project content, scaffolding an Astro + Content Collections site, and handing off to the impeccable skill for high-end visual design. Also use for iterating an existing portfolio (editing text via Markdown, adjusting layout via code, re-exporting Figma/Ardot assets). Not for non-design portfolios, resume-only outputs, or backend/data work.
agent_created: true
---

# Design Portfolio Builder

Build and maintain a blog-style, Markdown-driven web portfolio for design work. Each project becomes a standalone case-study page; the homepage lists all projects. Content lives in Markdown files (text, frontmatter metadata) so the user edits copy without touching code; layout, interaction, and visual design live in Astro components and are elevated by the impeccable skill. Deploys as a static site to Vercel or any static host.

## Architecture at a glance

- **Tech stack**: Astro (static output) + Content Collections + Markdown. Zero CMS, zero database.
- **Content layer**: one `.md` file per project in `src/content/projects/`. Frontmatter holds structured metadata (title, year, role, tags, cover, gallery); the Markdown body holds the narrative (supports bold, italic, strikethrough, lists, headings, inline images). Editing Markdown + rebuilding updates the page. This is the user's editing surface for all text.
- **Presentation layer**: Astro components and pages control layout, typography, interaction, motion. This is the impeccable skill's domain.
- **Assets**: project images exported from Figma or Ardot (or provided locally) live in `public/images/projects/<slug>/` and are referenced by path in Markdown.
- **Deploy**: `astro build` → static `dist/` → EdgeOne Pages (recommended, no region restrictions) or Vercel or any static host.

## Prerequisites

Before doing anything else, verify the supporting tools. Missing tools must be connected or the workflow cannot proceed.

### 1. Design source MCP — Figma or Ardot (required when projects come from a design tool)

The skill supports two design source platforms: **Figma** and **Ardot**. Discover which (if any) is connected by searching for design tools:

```
ToolSearch with queries: ["figma", "get_figma_data", "download_assets", "get_design_context", "ardot", "batch_read", "export_nodes", "capture_screenshot"]
```

#### Figma MCP

Two Figma MCP servers are supported. **Which one to recommend depends on the current platform.** Load `references/figma-mcp.md` for full details.

**Platform-aware recommendation:**

- **If running on a platform listed in the [Figma MCP Catalog](https://www.figma.com/mcp-catalog/)** (Claude, Claude Code, Codex by OpenAI, Cursor, VS Code, Kiro, Windsurf, Warp, ChatGPT, Xcode, GitHub Copilot CLI, Factory, Augment, Devin, Antigravity CLI, Replit, Rovo Studio, Android Studio, Amazon Q, OpenHands, Zed, etc.) → recommend the **Official Figma MCP** (remote connector at `https://mcp.figma.com/mcp`, OAuth-based, no personal token needed).
- **If running on CodeBuddy / WorkBuddy / LearnBuddy or another platform not in the catalog** → recommend **Framelink MCP** (`figma-developer-mcp`, requires a Figma Personal Access Token). See `references/figma-mcp.md` for setup.
- **If you cannot determine the current platform** → present both options with a brief description of each, and let the user choose. List the platforms that support the official connector so the user can self-identify.

If no Figma MCP tool is discoverable, STOP and guide the user through setup using `references/figma-mcp.md`. Do not attempt to read Figma via raw API calls — the MCP is the supported path.

#### Ardot MCP

**Ardot** is a design platform that provides its own MCP server with tools for reading designs, taking screenshots, and exporting assets. If the user's projects come from Ardot instead of Figma, load `references/ardot-mcp.md` for connection and usage instructions.

Ardot MCP provides: `fetch_editor_state`, `fetch_file_info`, `batch_read`, `capture_screenshot`, `export_nodes`, `scan_exportable_resources`, `fetch_variables`, `fetch_guidelines`, and more. The workflow is analogous to Figma — read the design structure, view screenshots, export specific nodes as images.

If neither Figma nor Ardot MCP is connected and the user's projects come only from local image folders (no design tool), the design MCP is not required and this check can be skipped.

### 2. impeccable skill (required for the build phase)

Verify the impeccable skill is installed at `~/.agents/skills/impeccable/` (or the project's `.agents/skills/impeccable/`). The visual build phase delegates to `$impeccable craft`. If missing, instruct the user to install it; see `references/impeccable-handoff.md`.

### 3. Node.js runtime

Astro needs Node.js. Confirm a Node runtime is available. If not, install one before the build phase.

## Workflow

The workflow has eight phases. Run them in order. Phases 2–5 repeat per project. Do not batch all projects' interviews at once — the reverse interview is most effective one project at a time, with the design content fresh in context.

### Phase 1 — Project inventory

Collect the full list of projects the user wants in the portfolio. Ask the user for either:

- **Figma source**: one or more Figma file/frame/selection links. For each, paste the link to a specific frame or selection (right-click → "Copy link to selection" in Figma). A whole-file link works but expect to drill into specific frames.
- **Ardot source**: one or more Ardot file links or file IDs. The user can provide a URL like `https://ardot.tencent.com/file/<id>?node_id=<nid>` or just the file ID.
- **Local source**: one or more folders containing project images (screenshots, exports, mockups).

Record a working list: project working title, source type (Figma link / Ardot link / folder path), and any one-line context the user gives offhand. This list drives the rest of the workflow. Confirm the order with the user (this becomes the homepage display order, though it is editable later via frontmatter `order`).

Also ask now for the user's name/brand and a one-line tagline for the homepage header — these seed the site identity. If the user doesn't have a tagline ready, note it and come back to it after the interviews when you understand them better.

**Voice input tip**: At the start of the interview process, suggest to the user: "If you have a voice input tool (like Typeless, macOS dictation, or similar), now is a great time to use it — the interview flows much more naturally when you can speak your answers rather than typing them." This significantly improves interview quality and speed.

### Phase 2 — Read each project's source (per project)

For each project in the inventory, gather the raw material before interviewing.

**Figma source**: use the connected Figma MCP to understand the project. Load `references/figma-mcp.md` for the exact tool calls, but the pattern is:

1. Extract the `fileKey` and `nodeId` from the Figma URL (the URL contains `node-id=<id>`; convert `-` to `:` for the API node ID).
2. Get the structure: official MCP → `get_metadata` with the node; Framelink → `get_figma_data` with fileKey + nodeId. This reveals the frame hierarchy, names, and what screens/components exist.
3. Get a visual: official MCP → `get_screenshot` (or `get_screenshot` with base64); Framelink → `get_figma_data` already includes image refs. The goal is for you to *see* the design so the interview questions are grounded in the actual work, not generic.
4. Optionally pull design tokens (`get_variable_defs`) if the user later wants to reference this project's visual style for the portfolio's own theme.

Do not export final assets yet (Phase 4). This phase is about understanding, not harvesting.

**Ardot source**: use the connected Ardot MCP to understand the project. Load `references/ardot-mcp.md` for the exact tool calls, but the pattern is:

1. Use `fetch_file_info` to confirm the file is open and get basic info.
2. Use `fetch_editor_state` to understand the current page and selection.
3. Use `batch_read` to read the node tree structure — start with top-level nodes, then drill into specific frames.
4. Use `capture_screenshot` to view specific frames/screens so interview questions are grounded in the actual design.
5. Optionally use `fetch_variables` to pull design tokens.

**Local folder source**: list the folder contents and view the key images (read them so the interview is grounded). Note filenames and what each image appears to depict.

### Phase 3 — Reverse deep interview (per project)

This is the heart of the skill. For each project, conduct a structured reverse interview to extract the story a portfolio needs. The goal is a complete, honest case study — not marketing fluff. Load `references/interview-framework.md` for the full question bank and methodology; the summary below is the operating model.

Use the STAR structure (Situation → Task → Action → Result) adapted for design work. Conduct the interview conversationally, **2–3 questions per round**, then wait. Never dump a long questionnaire. Ground every question in what you already saw in the Figma/Ardot file or images — this signals you actually looked and produces specific answers.

**Round structure** (adapt to what the user gives freely; skip answered questions):

- **Situation / Background**: What was the product, who was it for, what problem or opportunity triggered this work? What was the state before?
- **Task / Your role**: What were you responsible for specifically? Who else was on the team? What constraints (time, tech, brand, stakeholders)?
- **Action / Process**: What was your approach? Key decisions and *why* you made them. What did you try that didn't work? What was the hardest design problem? Walk through the major screens/flows visible in the design file.
- **Result / Outcome**: What shipped? What changed for users or the business (metrics, qualitative feedback, downstream effects)? What are you proud of? What would you do differently?

Probe for specifics: replace "improved the experience" with what concretely changed and why it mattered. Capture trade-offs and honest reflection — these are what make a case study credible.

Record the user's answers verbatim or near-verbatim in a working notes file (e.g. `portfolio-workspace/notes/<slug>.md`). After the interview, summarize the captured story back to the user in 4–6 bullets and confirm it's accurate before moving on. Correct misunderstandings now, not in the Markdown draft.

After all projects are interviewed, before building, confirm with the user: "Here are the N projects and their one-line stories. Ready for me to build the Markdown case studies and the site?"

### Phase 4 — Export assets (per project)

Export the images the case study pages will display. **Curate carefully — quality over quantity.** Each image must serve the narrative, not fill space.

**Figma source**: use the Figma MCP to export. Load `references/figma-mcp.md` for exact calls. The pattern:

- Identify which specific frames/components to export from the interview (the ones the user narrated around). **Do not export entire presentation slides or full pages by default** — instead, identify the specific UI screens, component details, or visual elements that the narrative references.
- **Granular export strategy**: Rather than exporting whole slides/pages (which often contain irrelevant surrounding content), identify and export the specific sub-frames, component groups, or detail crops that the case study narrative actually discusses. For example, if the narrative mentions a specific card design, export that card — not the entire page it sits on.
- Official MCP → `download_assets` with the node IDs, `defaultFormat: "png"`, `defaultScale: 2` (retina). Up to 20 nodes per call; batch if needed. Save outputs to `public/images/projects/<slug>/`.
- Framelink → `download_figma_images` with fileKey, nodes array (`{nodeId, fileName}`), `localPath` pointing at `public/images/projects/<slug>/`, and `format: "png"`.
- **Large frame handling**: large frames (e.g. 1920×1080 presentation slides) may cause MCP timeouts. Export smaller sub-frames or individual components instead. If a full-page export is needed, try one node at a time with `pngScale: 1` to reduce processing time.
- Export a cover image (the single most representative frame) and 3–8 supporting images per project. More is not better; curate.
- For vector logos/icons, export as SVG.
- **Figma-Use (if available)**: If the Figma MCP connection supports design context extraction (official MCP `get_design_context`), you can use the extracted component data to recombine and rearrange design elements for optimal portfolio presentation — not just raw screenshots. This allows creating composed detail views that highlight specific aspects of the design.

**Ardot source**: use the Ardot MCP to export. Load `references/ardot-mcp.md` for exact calls. The pattern:

- Use `scan_exportable_resources` to identify all exportable image and SVG nodes in the design.
- Use `export_nodes` to export specific nodes as PNG/JPEG/WEBP/SVG. Export no more than 5 nodes per batch for image formats (PNG/JPEG/WEBP); SVG has no limit.
- Use `capture_screenshot` to verify what a node looks like before exporting it.
- Apply the same granular export strategy as Figma — export specific components and detail crops, not entire canvases.

**Local folder source**: copy the selected images into `public/images/projects/<slug>/` with clean, sequential filenames (`cover.png`, `screen-01.png`, ...).

Name one image `cover.png` (or reference it via frontmatter `cover`). Write descriptive alt text for each during Phase 5.

### Phase 5 — Write the Markdown project file (per project)

Create one Markdown file per project at `src/content/projects/<slug>.md`. The slug is URL-safe and stable (kebab-case). Load `references/content-schema.md` for the full frontmatter spec and body conventions; the essentials:

```markdown
---
title: "Project Title"
summary: "One-line summary for the homepage card."
year: 2025
client: "Client or self-initiated"
role: ["Product Design", "Prototyping"]
tags: ["iOS", "Fintech"]
cover: "/images/projects/<slug>/cover.png"
gallery:
  - src: "/images/projects/<slug>/screen-01.png"
    alt: "Redesigned login screen"
    caption: "Reduced login abandonment by simplifying to a single field."
order: 1
featured: true
draft: false
---

## Background

Narrative from the interview. Supports **bold**, *italic*, ~~strikethrough~~,
and lists. Write in the user's voice but tightened.

## The challenge

...

## Approach

...with inline image references where they aid the story:

![Alt text](/images/projects/<slug>/screen-02.png)

## Outcome

...
```

**Image placement in the narrative — critical rules:**

- **Do NOT dump all images in a gallery at the bottom of the page.** The frontmatter `gallery` array is for a small curated set (0–4 images) of hero/overview shots. The majority of images should be **inline in the Markdown body**, placed at the exact paragraph where the narrative references them.
- **Each inline image must be relevant to the surrounding text.** If a paragraph discusses a specific screen, the image below it should show that screen — not an unrelated one. Mismatched images and captions are a failure mode.
- **Do not include images that have no narrative purpose.** If the interview didn't discuss a particular screen, don't include it just because it was exported. Every image should connect to something the text says.
- **Image sizing**: use appropriate image dimensions. A full-width hero image may be 1600px wide, but a detail crop shown inline should be smaller (e.g. 600–800px). If the exported image has abnormal dimensions (very tall, very wide, or tiny), either re-export at appropriate dimensions or use CSS to constrain it. The case-study layout's reading column will constrain width, but be aware of images that are disproportionately tall or have extreme aspect ratios — they may need to be exported as smaller crops or displayed differently.
- Keep frontmatter and body responsibilities separate: frontmatter = data, body = prose. Do not put long prose in frontmatter or structured data in the body.

Write each case study from the interview notes, not from imagination. Every claim should trace to something the user said. If the interview was thin on a section, write a short honest version and flag it for the user to expand.

### Phase 6 — Style direction

Before the build, establish the portfolio's visual direction. This feeds the impeccable handoff.

Ask the user for style preferences. Two paths:

- **Reference a design project**: if the user points to one of their Figma/Ardot projects whose aesthetic they want the portfolio to echo, pull its design tokens (Figma official MCP `get_variable_defs` / Ardot `fetch_variables`) and a screenshot. Use the colors, type, and spacing *feel* — not a copy — as the design seed.
- **Describe a direction**: ask for 2–3 reference sites/designers they admire and what specifically about them fits, plus what the portfolio should NOT look like (anti-references). Capture a one-paragraph style brief.

Either way, produce a concise style brief: register (always `brand` for a portfolio — design IS the product), personality, color strategy, type direction, motion energy, and anti-references.

**CRITICAL — Always confirm the style with the user before building.** After producing the style brief (whether from impeccable's palette generation or from user references), present it to the user explicitly and ask for confirmation. The user may have their own style preferences that differ from what was generated. Never proceed to the build phase without explicit user sign-off on the visual direction. Present: the proposed color palette, typography direction, overall mood, and ask "Does this direction feel right to you? Would you like to adjust anything?"

### Phase 7 — Build the site (impeccable handoff)

Scaffold the content layer, then delegate the visual build to impeccable.

**Step A — Scaffold from the template.** Copy `assets/portfolio-template/` into the workspace as the project root (or initialize a fresh Astro project and replicate the structure — the template is the reliable path). This gives a working Astro project with the `projects` Content Collection, Zod schema, `index.astro` (homepage listing), `src/pages/projects/[...slug].astro` (case-study route), and a base layout. Place all project Markdown files in `src/content/projects/` and all images in `public/images/projects/`. Verify it builds: install deps and run the dev server; confirm the homepage lists projects and each project page renders.

**Step B — Seed impeccable context.** Write `PRODUCT.md` at the project root with: `Register: brand`, users (recruiters/peers/clients viewing the portfolio), product purpose, brand personality, the style brief from Phase 6, anti-references, and accessibility needs. If the user has committed brand colors (e.g. from a Figma/Ardot token pull), include them; otherwise let impeccable's palette step generate a seed. Load `references/impeccable-handoff.md` for the exact PRODUCT.md template and handoff protocol.

**Step C — Invoke impeccable.** Run `$impeccable craft portfolio site` (or describe the build target per the handoff reference). impeccable will: read PRODUCT.md, load the brand register, shape the design, establish visual direction with the user, and build the homepage and case-study layouts to production quality — applying its typography, color, layout, and motion standards to the Astro components. The Markdown-driven content architecture stays intact; impeccable elevates the presentation layer.

Because the content layer is already wired (Content Collections + routes), impeccable works on components and styles, not content plumbing. Emphasize to impeccable that the case-study page layout must render Markdown body content into a designed reading column while placing frontmatter-driven gallery images in a responsive grid — content from Markdown, layout from code.

**Step D — Verify.** After impeccable's build, confirm: homepage lists all projects with covers; each project page shows hero, meta, gallery, and readable narrative; **inline body images appear at the correct positions in the reading flow** (not dumped at the bottom); responsive at mobile/tablet/desktop; no broken images; no abnormally sized images; `astro build` succeeds producing `dist/`.

### Phase 8 — Deploy and iterate

**Deploy**: prefer **EdgeOne Pages** (腾讯 EdgeOne Pages) as the primary deployment target — it has no region access restrictions and is available as a connector in LearnBuddy/WorkBuddy. Use the `workbuddy_cloudstudio_deploy` tool or the EdgeOne Pages connector to deploy the `dist/` directory. Alternatively, Vercel auto-detects Astro and supports static output, but note that Vercel has **region access restrictions** (may be inaccessible in China without a VPN) — recommend Vercel only as a secondary option or for international audiences. The template includes a `vercel.json` with sane defaults for Vercel deployment if needed.

**Iterate** — this is the long-term operating mode. Load `references/iteration.md` for the full protocol. The split:

- **Text changes** (wording, new paragraph, fixing a typo, swapping a caption): edit the Markdown file in `src/content/projects/`. Rebuild/redeploy. No code touched. This is the user's primary editing surface.
- **Structured changes** (reorder projects, add tags, change cover, toggle draft): edit the Markdown frontmatter. Rebuild.
- **Layout / visual / interaction changes** (new section type, gallery layout, motion, theme): edit Astro components via `$impeccable` commands (`layout`, `typeset`, `colorize`, `polish`, etc.) — not by hand-editing if impeccable owns the design.
- **New project**: run Phases 2–5 for the new project, drop the Markdown + images in, rebuild. No other changes needed.
- **Re-export a design asset**: if the design updated in Figma/Ardot, re-run the Phase 4 export for that node, overwriting the image file. Rebuild.

When the user asks for a change, first classify it (text / structured / layout / asset). Route accordingly. When ambiguous, ask.

## Resource index

| Resource | When to load |
|----------|-------------|
| `references/figma-mcp.md` | Phase 1 (prereq check) and Phases 2 & 4 (read + export from Figma). Contains both MCP servers' tool catalogs, platform-aware recommendation logic, URL parsing, granular export guidance, and Figma-Use integration. |
| `references/ardot-mcp.md` | Phase 1 (prereq check) and Phases 2 & 4 (read + export from Ardot). Contains Ardot MCP tool catalog, connection instructions, and export call patterns. |
| `references/interview-framework.md` | Phase 3. Full STAR question bank adapted for design, interview conduct rules, and how to record notes. |
| `references/content-schema.md` | Phase 5. Complete frontmatter spec, body conventions, slug rules, image placement rules, and how frontmatter maps to the page layout. |
| `references/impeccable-handoff.md` | Phase 7. PRODUCT.md template, craft invocation, and how to keep the content/presentation boundary clean. |
| `references/iteration.md` | Phase 8. Change classification, routing rules, and common edit patterns. |
| `assets/portfolio-template/` | Phase 7 Step A. Copy this as the project root. Self-contained Astro starter with Content Collections wired. |

## Notes for execution

- The reverse interview is the differentiator. Generic portfolio text is the failure mode. Push for specifics, trade-offs, and honest reflection in every project.
- **Suggest voice input tools** at the start of the interview phase — the interview quality improves dramatically when users can speak rather than type.
- Keep the content/presentation boundary sacrosanct. If a text change needs code, the architecture is wrong — fix the schema or layout, don't hardcode copy into components.
- **Image curation is critical.** Every image must connect to the narrative text. Mismatched images, irrelevant screenshots, and gallery dumps at the bottom of the page are failure modes. Inline images in the prose at the point they're referenced; use the frontmatter gallery only for a small hero set.
- **Always confirm visual style with the user** before building — never assume the generated direction is what they want.
- Always confirm the dev server renders correctly before handing to impeccable, and confirm the production build passes before declaring done.
