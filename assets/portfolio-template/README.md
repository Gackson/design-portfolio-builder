# Design Portfolio Builder Template

A Markdown-driven, blog-style design portfolio built with Astro Content Collections.

## How it works

- **Content layer**: one Markdown file per project in `src/content/projects/`. Frontmatter holds structured metadata (title, year, role, tags, cover, gallery); the Markdown body holds the narrative case study.
- **Presentation layer**: Astro components and pages control layout and design. Elevated by the `impeccable` skill.
- **Editing**: change text by editing Markdown. Change layout/visuals via Astro components. No CMS, no database.

## Quick start

```bash
npm install
npm run dev
```

The homepage lists all projects at `/`. Each project renders at `/projects/<slug>/`.

## Add a project

1. Create `src/content/projects/<slug>.md` (see `example-project.md` for the format).
2. Add images to `public/images/projects/<slug>/`.
3. Set `order` in frontmatter to control homepage position.
4. The dev server hot-reloads; rebuild for production.

## Edit content

- **Text**: edit the Markdown body in any project file.
- **Metadata** (year, tags, cover, etc.): edit the frontmatter.
- **Reorder**: change the `order` field.
- **Hide**: set `draft: true`.

## Build & deploy

```bash
npm run build      # outputs static files to dist/
```

Deploy `dist/` to Vercel (auto-detects Astro), Netlify, GitHub Pages, or any static host. The included `vercel.json` configures Vercel deployment.

## Structure

```
src/
  content.config.ts          # projects collection schema (Zod)
  content/projects/          # one .md per project
  layouts/Base.astro         # HTML shell, header, footer
  pages/
    index.astro              # homepage — lists all projects
    projects/[...slug].astro # case-study page — renders one project
  styles/global.css          # baseline styles (impeccable replaces these)
public/
  images/projects/<slug>/    # project images
  favicon.svg
```

## Design elevation

This template ships with neutral baseline styles. Run `$impeccable craft portfolio site` to establish a full design system (typography, color, motion, responsive) on top of the content architecture. See the design-portfolio-builder skill's `references/impeccable-handoff.md`.
