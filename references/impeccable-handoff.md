# impeccable Handoff

How to delegate the portfolio's visual build to the impeccable skill while preserving the Markdown-driven content architecture. Load this in Phase 7.

## The boundary

The portfolio skill owns the **content layer**: Astro project, Content Collections, the `projects` schema, Markdown files, images, and routing. impeccable owns the **presentation layer**: components, layouts, typography, color, motion, responsive behavior. The handoff gives impeccable a working, content-complete site to elevate — not a blank canvas.

impeccable must NOT:
- Move case-study copy into components (copy stays in Markdown).
- Change the Content Collection schema or routing without reason.
- Replace Markdown body rendering with hardcoded HTML.

impeccable SHOULD:
- Redesign `Base.astro`, `index.astro`, `[...slug].astro`, and components.
- Establish the type system, color palette, spacing scale, motion.
- Build the gallery grid, hero, meta sidebar, and reading column layouts.
- Apply its production-quality bar (typography, contrast, responsive, states).

## Step A — Scaffold the content layer (before invoking impeccable)

1. Copy `assets/portfolio-template/` to the workspace project root.
2. Place all project Markdown files in `src/content/projects/`.
3. Place all images in `public/images/projects/<slug>/`.
4. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
5. Verify: the homepage lists all projects with covers; each project page renders title, meta, gallery, and body. Fix any broken image paths or schema validation errors now — impeccable should receive a clean build.

## Step B — Write PRODUCT.md

impeccable's setup reads `PRODUCT.md` at the project root. Write it before invoking craft. Use this template, filled from the Phase 6 style brief and Phase 1 identity:

```markdown
# Product

## Register

brand

## Users

Recruiters, design peers, potential clients, and collaborators viewing a
design portfolio. They scan quickly on the homepage, then dive into 1–3
case studies in detail. They want to understand the designer's thinking and
craft, not just see pretty screens.

## Product Purpose

A blog-style design portfolio that presents each project as a narrative
case study. The homepage lists all projects; each project has a dedicated
case-study page with hero, structured metadata, image gallery, and a
readable narrative. Content is Markdown-driven so the designer edits copy
without touching code.

## Brand Personality

[From Phase 6: 3-word personality + emotional goals. e.g. "Considered,
confident, crafted. The portfolio should feel like the designer's best work
presented with the same care they put into the projects."]

## Anti-references

[From Phase 6: what it should NOT look like. Be specific. e.g. "Not the
saturated SaaS-cream template. Not identical card grids. Not gradient text.
Not the 01/02/03 numbered-section scaffold."]

## Design Principles

[3–5 strategic principles from the conversation. e.g. "Let the work breathe —
generous whitespace around images.", "Typography leads; color supports.",
"Every case study earns its length — no padding.", "The reading experience
on mobile is as important as desktop."]

## Accessibility & Inclusion

WCAG AA. Sufficient contrast on all text (≥4.5:1 body). Reduced-motion
respected. Keyboard-navigable. Meaningful alt text on all images (sourced
from Markdown). No motion that blocks reading.
```

### Optional: DESIGN.md seed

If Phase 6 pulled design tokens from a Figma/Ardot reference project (Figma official MCP `get_variable_defs` / Ardot `fetch_variables`), write a starter `DESIGN.md` capturing the colors, type, and spacing feel. This gives impeccable a committed palette to build around rather than generating fresh. If no tokens were pulled, omit DESIGN.md and let impeccable's palette step (`palette.mjs`) generate a seed — identity preservation wins when committed colors exist, generation wins when they don't.

### CRITICAL — Always confirm style with the user before building

After impeccable generates a style direction (palette, typography, mood), **always present it to the user for explicit confirmation before proceeding with the build.** The user may have their own style preferences that differ from what was generated.

Present to the user:
- The proposed color palette (with hex/OKLCH values)
- The typography direction (font families, weights)
- The overall mood/personality
- Any specific design decisions (dark/light, spacing scale, motion energy)

Ask: "Does this visual direction feel right to you? Would you like to adjust anything — colors, fonts, mood, or layout approach?"

Only proceed to the full build after the user confirms. If the user wants changes, iterate on the style brief and re-confirm.

## Step C — Invoke impeccable

After PRODUCT.md is written and the content layer builds, invoke impeccable to craft the visual layer:

```
$impeccable craft portfolio site
```

Or, if the user wants to plan the UX before building:

```
$impeccable shape portfolio site
```

then `craft` after the shape brief is confirmed.

### What to communicate to impeccable

impeccable's craft flow will read PRODUCT.md, detect the existing Astro project (Step 0), and proceed through shape → visual direction → build. Reinforce these constraints in the handoff prompt:

- **Existing framework**: Astro is already set up. Use it. Do not scaffold a parallel project.
- **Content is Markdown-driven**: case-study pages render Markdown body content into a designed reading column. Frontmatter fields populate a hero, meta sidebar, and gallery grid. The Content Collection schema in `src/content.config.ts` is the contract — design the layout around it, don't bypass it.
- **Homepage**: lists all projects from `getCollection('projects')`, sorted by `order`. Each card shows cover, title, summary, year, and tags. This is a blog-style index, not a SaaS landing page.
- **Case-study page** (`/projects/<slug>`): hero with cover + title + summary; a meta region (year, client, role, team, duration, tags); a small gallery grid (from frontmatter `gallery`, 0–4 images max, each with caption); and the Markdown body as a reading column with **inline images placed at the point they're referenced in the narrative**. Design these regions; the data comes from Markdown.
- **Register is brand**: a portfolio is a brand surface (design IS the product). Load impeccable's `reference/brand.md`, not `product.md`.
- **Images are real**: the exported Figma/Ardot images are the actual project screenshots. Do not replace them with placeholder cards, CSS scenery, or decorative panels. Use them as the visual centerpiece.
- **Inline images in prose**: the majority of images are inline in the Markdown body (`![]()`), not in the frontmatter gallery. The reading column must render these inline images at appropriate sizes — not full-width by default, but sized to complement the text. Watch for abnormally sized images (very tall, very wide, or tiny) and constrain them with CSS.
- **No gallery dumps**: do not design the case-study page to show all images in a grid at the bottom. The frontmatter gallery is a small hero set (0–4 images); the rest are inline in the reading flow.

### Gate awareness

impeccable's craft has multiple user gates (shape confirmation, direction questions, palette confirmation, mock approval) when native image generation is available, or collapses to a brief-driven flow when it isn't. Let impeccable run its own gates — do not try to compress them. The portfolio skill's job is to provide the content layer and PRODUCT.md; impeccable owns the visual decision flow.

## Step D — Verify after impeccable builds

After impeccable completes the build:

1. **Build check**: `npm run build` succeeds, producing `dist/`.
2. **Content check**: homepage lists all projects; each case-study page shows hero, meta, gallery, and full narrative body. No Markdown rendering errors.
3. **Image check**: all images load; no broken paths; alt text present. **Inline body images appear at the correct positions in the reading flow** (not dumped at the bottom in a gallery). **No abnormally sized images** (check for extremely tall, wide, or tiny images that break the reading rhythm). **Each image's content matches the surrounding text** — no mismatched screenshots and captions.
4. **Responsive check**: mobile, tablet, desktop all render correctly.
5. **Edit-surface check**: change a word in one Markdown file, rebuild, confirm the change appears on the page. This validates the content/presentation boundary is intact.

If the edit-surface check fails (text change didn't propagate), the layout is likely hardcoding content — fix it before declaring done.
