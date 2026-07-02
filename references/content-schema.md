# Content Schema

The Markdown structure that powers every project case-study page. The contract between the content layer (what the user edits) and the presentation layer (what impeccable designs). Keep the responsibilities strict: frontmatter = structured data; body = narrative prose with inline images.

## File location and naming

- One file per project: `src/content/projects/<slug>.md`
- Slug rules: kebab-case, URL-safe, stable (never rename after the page is live — it breaks links). Derive from the project title (e.g. "Redesigning Checkout" → `redesigning-checkout`).
- The slug doubles as the image directory name: `public/images/projects/<slug>/`.

## Frontmatter spec

Every field below is validated by the Zod schema in `src/content.config.ts` (see the template). Optional fields can be omitted.

```yaml
---
# Required
title: "Project Title"              # string — the case-study headline
summary: "One-line summary."        # string — shown on the homepage card and as page description
year: 2025                          # number — display + sort
role: ["Product Design"]            # string[] — what the user did; 1–4 items

# Recommended
tags: ["iOS", "Fintech"]            # string[] — for filtering and SEO
cover: "/images/projects/<slug>/cover.png"  # string — hero image path (relative to public/)

# Optional
slug: "custom-slug"                 # string — overrides filename as URL slug
client: "Client Name"               # string — or "Self-initiated"
team: ["Jane Doe (PM)", "John (Eng)"]  # string[] — collaborators
duration: "3 months"                # string — free-form
order: 1                            # number — homepage display order (lower = first)
featured: true                      # boolean — highlight on homepage hero
draft: false                        # boolean — exclude from production build if true
gallery:                            # array — SMALL curated hero set (0–4 images), rendered in a grid
  - src: "/images/projects/<slug>/screen-01.png"
    alt: "Redesigned login screen"
    caption: "Reduced login abandonment by simplifying to a single field."
links:                              # array — external links (live site, case study, store)
  - label: "Live site"
    url: "https://example.com"
---
```

### Why frontmatter is structured (not prose)

The layout renders frontmatter into fixed UI regions: the hero shows `cover` + `title` + `summary`; a meta sidebar lists `year`, `client`, `role`, `team`, `duration`, `tags`; the gallery grid maps over `gallery`. Keeping these as data means the user can reorder, retag, or swap a cover by editing YAML — no code, no layout breakage. Long prose belongs in the body.

## Body conventions

The Markdown body is the narrative. It renders into a reading column on the case-study page. All standard Markdown is supported: **bold**, *italic*, ~~strikethrough~~, `inline code`, blockquotes, ordered/unordered lists, headings (`##`, `###`), and inline images.

### Recommended section structure

Use STAR-aligned headings. The exact heading labels can vary per project, but cover these beats:

```markdown
## Background

The situation before the work. Who the product was for, what problem or
opportunity triggered it.

## The challenge

What specifically needed solving. Constraints, the hardest problem.

## Approach

The process and key decisions. This is the longest section. Walk through
major decisions and *why*, anchored to the screens.

Inline images aid the story here:

![Alt text describing the image](/images/projects/<slug>/screen-02.png)

## Outcome

What shipped, what changed, what you're proud of, what you'd do differently.
```

### Image placement — critical rules

**The #1 failure mode is dumping all images in the frontmatter gallery at the bottom of the page.** Images must be placed where the narrative references them, not collected in a grid at the end.

#### Where images go

| Image type | Where it belongs | Why |
|-----------|-----------------|-----|
| Cover/hero image | frontmatter `cover` | Shown in the page hero region |
| 0–4 overview/hero screenshots | frontmatter `gallery` | Small curated set shown in a grid below the meta region |
| Detail crops, specific screens, process artifacts | **inline in the Markdown body** via `![]()` | Placed at the exact paragraph that references them |

#### Rules for inline body images

1. **Each inline image must be relevant to the surrounding text.** If a paragraph discusses a specific card design, the image immediately below it should show that card — not an unrelated screenshot. Mismatched images and captions are a failure mode.
2. **Do not include images that have no narrative purpose.** If the interview didn't discuss a particular screen, don't include it just because it was exported. Every image should connect to something the text says.
3. **Prefer detail crops over full-page screenshots.** A close-up of the specific UI element being discussed is more effective than a full-page screenshot where that element is small and surrounded by irrelevant content.
4. **Place images after the paragraph that references them**, not before. The reader encounters the text first, then sees the visual evidence.
5. **Write meaningful alt text** for every image — accessibility + the layout may render captions from it.

#### Example of correct image placement

```markdown
## Approach

The core insight was that users needed to see their spending categories
at a glance, not buried in a transaction list.

![Spending overview dashboard with category cards](/images/projects/budget/screen-01.png)

Each category card shows the current month's total, a trend indicator,
and a tap target to drill into individual transactions. The color coding
follows the user's own category assignments from setup.

![Category detail view with transaction list](/images/projects/budget/screen-02.png)

The hardest decision was whether to show budget limits on the overview
or reserve them for the detail view. We chose the latter to avoid
creating anxiety on the main screen.
```

#### Example of INCORRECT image placement (failure mode)

```markdown
## Approach

The core insight was that users needed to see their spending categories
at a glance.

[...3 paragraphs of text with no images...]

## Outcome

The app shipped and users loved it.

<!-- BAD: all images dumped in frontmatter gallery at the bottom -->
```

```yaml
gallery:
  - src: "/images/projects/budget/screen-01.png"
    alt: "Dashboard"
    caption: "The dashboard."  # BAD: generic caption that doesn't match any specific text
  - src: "/images/projects/budget/screen-02.png"
    alt: "Category detail"
    caption: "Category detail view."  # BAD: generic
  - src: "/images/projects/budget/screen-03.png"
    alt: "Settings"
    caption: "Settings screen."  # BAD: not referenced in the narrative at all
```

### Image sizing and dimensions

Be aware of image dimensions when exporting and referencing:

- **Hero/cover images**: should be wide aspect ratio (16:9 or similar), at least 1200px wide.
- **Inline body images**: the reading column will constrain width to ~680px, but the source image should be reasonable. 600–1000px wide is ideal.
- **Abnormal dimensions**: if an exported image is extremely tall (e.g. a full mobile screen at 375×2000), extremely wide (e.g. a panoramic view), or tiny (e.g. a 100×50 icon), either:
  - Re-export at appropriate dimensions or as a smaller crop.
  - Use CSS to constrain the display size (the layout may need adjustment for edge cases).
  - Consider whether the image adds value at its current aspect ratio — a very tall image in a reading column creates an awkward scroll experience.
- **Consistency**: images in the same section should have similar aspect ratios when possible, to avoid a jarring visual rhythm.

### Image references in the body

Reference images by absolute path from `public/`:

```markdown
![Alt text](/images/projects/<slug>/screen-01.png)
```

- Always write meaningful `alt` text (accessibility + the layout may render captions from it).
- For images that belong in the structured gallery grid (not inline in prose), use the frontmatter `gallery` array instead — but keep this to 0–4 images maximum. The majority of images should be inline in the body.
- Don't duplicate an image in both the gallery and the body.

### What belongs where (quick rules)

| Content | Where |
|---------|-------|
| Project title | frontmatter `title` |
| One-line summary | frontmatter `summary` |
| Hero/cover image | frontmatter `cover` |
| Year, client, role, tags, team, duration | frontmatter (structured) |
| 0–4 curated hero/overview screenshots | frontmatter `gallery` |
| External links | frontmatter `links` |
| Narrative paragraphs, process walkthrough, reflection | body Markdown |
| **Detail crops, specific screens, process artifacts** | **body `![]()` inline at the point of reference** |
| Sort order, draft flag, featured flag | frontmatter |

## Adding a new project later

1. Create `src/content/projects/<new-slug>.md` with frontmatter + body.
2. Add images to `public/images/projects/<new-slug>/`.
3. Set `order` to control homepage position; set `draft: true` to hide while in progress.
4. Rebuild. No code changes needed — the Content Collection auto-discovers the new file.

## Editing text later (no code)

To change any wording: edit the Markdown body. To change metadata: edit the frontmatter. Rebuild/redeploy. The layout and components are untouched. This is the primary iteration path and should always work — if a text change requires code, the schema or layout has a bug; fix that, don't hardcode copy into components.
