# Iteration Protocol

How to handle changes to the portfolio after it's built. The key skill: classify the change, then route it to the right surface. The content/presentation boundary must hold — text changes never require code, layout changes never hardcode copy.

## Change classification

When the user requests a change, first determine its type:

| Change type | Example | Route to | Touches code? |
|-------------|---------|----------|---------------|
| **Text** | "Reword the outcome section", "fix a typo", "add a paragraph" | Edit Markdown body in `src/content/projects/<slug>.md` | No |
| **Structured data** | "Reorder projects", "add a tag", "change the cover", "hide this project" | Edit Markdown frontmatter | No |
| **New project** | "Add a project I just finished" | Run Phases 2–5, drop in MD + images | No (content only) |
| **Asset update** | "I updated the design in Figma, re-export" | Re-run Phase 4 export for that node, overwrite image file | No |
| **Layout / visual** | "Make the gallery 2 columns", "change the heading font", "add a dark mode" | `$impeccable` commands on components | Yes (impeccable owns) |
| **New section type** | "Add a 'process' video section to case studies" | Edit schema + component + impeccable | Yes (coordinate) |
| **Structural** | "Add an About page", "add project filtering by tag" | New route/component + impeccable | Yes (coordinate) |

When the type is ambiguous, ask. When a text change seems to require code, the architecture has a gap — fix the schema or layout rather than hardcoding.

## Text changes (most common)

1. Open `src/content/projects/<slug>.md`.
2. Edit the body (or frontmatter for structured data).
3. Rebuild: `npm run build` (or the dev server hot-reloads).
4. Redeploy (Vercel auto-deploys on Git push if connected).

This is the user's primary editing surface. Encourage them to make text edits directly in the Markdown — it's faster than asking and keeps them in control of their copy.

## Structured data changes

- **Reorder projects**: edit `order` in each project's frontmatter. Lower number = earlier on homepage.
- **Change cover**: put the new image in `public/images/projects/<slug>/`, update frontmatter `cover` path.
- **Toggle visibility**: set `draft: true` to hide from production build.
- **Add/remove tags**: edit the `tags` array.
- **Feature on homepage hero**: set `featured: true`.

All frontmatter-only. Rebuild.

## New project

1. Run Phases 2–5 (read source, interview, export assets, write Markdown).
2. Create `src/content/projects/<new-slug>.md` and `public/images/projects/<new-slug>/`.
3. Set `order` for homepage position.
4. Rebuild. The Content Collection auto-discovers the new file — no route or component changes.

## Asset re-export

When a Figma design has been updated and the user wants the new version in the portfolio:

1. Re-run the Phase 4 export for the specific node(s) using the Figma MCP.
2. Overwrite the existing image file(s) in `public/images/projects/<slug>/` (same filename to keep Markdown references valid).
3. Rebuild.

If the node ID changed (frame was recreated), parse the new link for the new node ID.

## Layout / visual changes

Route through impeccable rather than hand-editing, since impeccable owns the design system:

- Spacing, rhythm, hierarchy → `$impeccable layout <target>`
- Typography → `$impeccable typeset <target>`
- Color / theme → `$impeccable colorize <target>`
- Motion → `$impeccable animate <target>`
- Full quality pass → `$impeccable polish <target>`
- Tone down / bolder → `$impeccable quieter` / `$impeccable bolder`
- Responsive fixes → `$impeccable adapt <target>`
- In-browser variant iteration → `$impeccable live`

These operate on Astro components and styles. They should not touch Markdown content. If impeccable needs a new frontmatter field to support a new layout region, add it to the Zod schema in `src/content.config.ts` first, then populate it in Markdown, then have impeccable design the region.

## New section type (coordinate content + code)

If the user wants a section type the schema doesn't support (e.g. a video embed, a before/after slider, a quote block):

1. Add an optional field to the Zod schema in `src/content.config.ts` (e.g. `video: z.string().optional()` or a richer object).
2. Populate it in the relevant project's Markdown frontmatter.
3. Have impeccable build the component/region that renders it.
4. Verify the edit-surface check: editing the new field in Markdown updates the page.

This keeps the boundary intact: the *data* is in Markdown, the *rendering* is in code.

## Structural changes (new pages, filtering)

- **About page**: create `src/pages/about.astro` (or `about.md` as a content collection). impeccable designs it.
- **Tag filtering on homepage**: add filter logic in `index.astro` reading project `tags`. impeccable styles the filter UI.
- **Project categories**: add a `category` frontmatter field + schema entry, then group/filter in the homepage component.

## Redeployment

- **EdgeOne Pages (recommended)**: deploy the `dist/` directory via the EdgeOne Pages connector (available in LearnBuddy/WorkBuddy) or the `workbuddy_cloudstudio_deploy` tool. No region access restrictions — accessible globally including China. This is the primary recommended deployment target.
- **Vercel + Git**: commit changes, push to the connected branch. Vercel auto-builds and deploys. Note: Vercel has **region access restrictions** and may be inaccessible in China without a VPN — recommend only for international audiences or as a secondary deployment.
- **Manual**: `npm run build` → deploy `dist/` to any static host.
- **Local preview**: `npm run dev` for live editing feedback before pushing.

## Audit checklist (periodic)

Every few months or after major additions:
- All project pages render without errors.
- No broken image paths (images exist where frontmatter points).
- Homepage order matches intent.
- No projects stuck in `draft: true` unintentionally.
- Production build passes clean.
- Mobile + desktop spot-check on 2–3 pages.
