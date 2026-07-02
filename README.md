# Design Portfolio Builder

An agent skill for creating polished, Markdown-driven design portfolio sites from Figma, Ardot, or local project assets.

The skill guides an agent through project inventory, design-source reading, reverse interviews, asset export, Markdown case-study writing, Astro scaffolding, visual handoff to the `impeccable` skill, deployment, and iteration.

## What It Builds

- Blog-style design portfolio homepage
- Individual case-study pages for each project
- Markdown content files with structured frontmatter
- Curated project images stored as static assets
- Astro static site using Content Collections

## Repository Structure

```text
SKILL.md                         # Skill instructions and workflow
references/                      # Supporting guides for Figma, Ardot, interviews, content, iteration
assets/portfolio-template/       # Astro starter template copied during the build phase
```

## Install

Copy this folder into your Codex skills directory:

```bash
~/.codex/skills/design-portfolio-builder
```

Then invoke it when you want to build or update a design portfolio.

## License

MIT
