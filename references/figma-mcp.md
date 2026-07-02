# Figma MCP Reference

Complete guide to reading Figma projects and exporting assets via MCP. The skill supports two Figma MCP servers. Discover which is connected at runtime; the patterns below cover both.

## Discovery

At the start of any Figma-dependent phase, search for available tools:

```
ToolSearch with queries: ["figma", "get_figma_data", "download_assets", "get_design_context", "get_metadata"]
```

Match the results to determine the server:

- Tools named `get_metadata`, `get_design_context`, `download_assets`, `get_screenshot`, `get_variable_defs` → **Official Figma MCP**.
- Tools named `get_figma_data`, `download_figma_images` → **Framelink MCP** (`figma-developer-mcp`).

If neither set is discoverable, the Figma MCP is not connected. Guide the user to connect it (see "Setup" below) before proceeding. If the user is sourcing projects from local folders only, Figma MCP is not needed.

## Platform-aware MCP recommendation

**Which Figma MCP to recommend depends on the platform the user is running on.** This is important because the official Figma MCP is only directly supported on specific platforms.

### Platforms that support the Official Figma MCP

The following platforms are listed in the [Figma MCP Catalog](https://www.figma.com/mcp-catalog/) and support the official Figma remote connector:

**Full read/write access**: Claude, Claude Code, Codex by OpenAI, Cursor, VS Code, Kiro, Windsurf, Warp, ChatGPT, GitHub Copilot CLI, Factory, Augment, Devin

**Read-only access**: Antigravity CLI, Replit, Rovo Studio, Android Studio, Amazon Q, OpenHands, Zed, ServiceNow Build Agent, Xcode (Beta), Notion, Slack

If the user is on any of these platforms → recommend the **Official Figma MCP** (OAuth-based, no personal token needed).

### Platforms that should use Framelink MCP

CodeBuddy, WorkBuddy, LearnBuddy, and any platform NOT in the catalog above → recommend **Framelink MCP** (`figma-developer-mcp`, requires a Figma Personal Access Token).

### When you cannot determine the platform

If you cannot determine which platform the user is on, present both options:

> "You have two ways to connect Figma:
>
> **Option A — Official Figma MCP** (recommended if you're on Claude, Cursor, VS Code, Kiro, Windsurf, Codex, or another platform listed at figma.com/mcp-catalog). OAuth-based, no token needed.
>
> **Option B — Framelink MCP** (recommended for CodeBuddy/WorkBuddy/LearnBuddy or platforms not in the catalog). Needs a Figma Personal Access Token.
>
> Which platform are you using?"

## URL parsing

A Figma link looks like:

```
https://www.figma.com/design/<fileKey>/<name>?node-id=<nodeId>
https://www.figma.com/file/<fileKey>/<name>?node-id=<nodeId>
```

- `fileKey`: the long alphanumeric segment after `/design/` or `/file/`.
- `nodeId`: the value of `node-id` in the query string. Figma URLs use `-` as the separator (e.g. `1:2:3` appears as `1-2-3`). Convert `-` back to `:` when passing to the API/MCP.

If the user provides a link without a `node-id` (a whole file), the first call should list top-level pages/frames, then drill into the relevant frame.

## Official Figma MCP (preferred when platform supports it)

Remote connector endpoint: `https://mcp.figma.com/mcp`. OAuth-based (no personal access token). Connects through the platform's connector system.

### Reading a project (Phase 2)

1. **Get structure** — call `get_metadata` with the node ID. With no `nodeId`, returns the document's top-level pages (each with page id + name). With a valid `nodeId`, returns a sparse XML outline of that node's children: layer IDs, names, types, positions, sizes. Use this to understand what screens/sections exist before requesting detailed context.
2. **Get a screenshot** — call `get_screenshot` with the node ID to render a PNG of the selection. Set `enableBase64Response: true` to receive the image inline so you can view it directly. This is how you *see* the design to ground interview questions. For large frames, screenshot individual screens rather than the whole canvas.
3. **Get design context** (for style reference in Phase 6, and for Figma-Use recombination in Phase 4) — call `get_design_context` with the node link. Returns code-generation data (default React + Tailwind). More useful is `get_variable_defs`, which returns the color/spacing/type variables used in the selection — the design tokens. Use these when the user wants the portfolio's theme to echo this project.
4. **Figma-Use recombination** — if `get_design_context` is available, the extracted component/element data can be used to recombine and rearrange design elements for optimal portfolio presentation. Instead of just taking raw screenshots, you can compose detail views that highlight specific aspects: extract a specific card design, isolate a color palette, or compose a before/after comparison. This produces more intentional portfolio images than raw full-page exports.

### Exporting assets (Phase 4)

Call `download_assets` to export nodes as images:

- **Parameters**: node ID(s) (up to 20 per call), `defaultFormat` (`png` | `jpg` | `svg` | `pdf`), `defaultScale` (0.01–4; use `2` for retina raster).
- **Output**: returns temporary URLs for each exported image. Fetch each URL and save the file to `public/images/projects/<slug>/<filename>`.
- **Two modes**: "Export render" re-renders the node to the requested format/scale (use this for screen exports). "Raw source images" returns the original uploaded image files without re-render (use when the node is a placed photo you want at full fidelity; max 20 per call, `rawImagesTruncated: true` means more remain).
- **Batching**: if a project has >20 frames to export, split into multiple calls.

## Framelink MCP (`figma-developer-mcp`)

Community server (npm: `figma-developer-mcp`). Requires a Figma Personal Access Token.

### Reading a project (Phase 2)

Call `get_figma_data` with `fileKey` and `nodeId`. Returns simplified design data (layout, styles, hierarchy) plus image references. The server compresses Figma API responses ~90% for token efficiency. The image references it returns can be fetched to view the design.

**Handling large files**: `get_figma_data` results can be very large (100KB–300KB+) for complex design files. The tool saves oversized output to a file. Use `python3` or similar to parse the JSON and extract: frame names, text content, node IDs, and image references. This lets you understand the design structure without reading the entire raw output.

### Exporting assets (Phase 4)

Call `download_figma_images`:

- **Parameters**: `fileKey`, `nodes` (array of `{ nodeId, fileName }`), `localPath` (relative path within the MCP server's image directory, e.g. `sancichicun`), and `pngScale` (default 2).
- **Behavior**: downloads each node as the named file in the specified format directly to the server's image directory. The absolute path is typically `/Users/<user>/.learnbuddy/logs/mcp-runtime/custom-mcp_figma-<id>/<localPath>/`.
- **Large frame handling**: large frames (e.g. 1920×1080 presentation slides) may cause MCP request timeouts. Strategies:
  - Export one node at a time rather than batching.
  - Use `pngScale: 1` instead of `2` for large frames.
  - Export specific sub-frames or component groups rather than full pages.
  - Note: even when a timeout error is returned, the export may have partially succeeded — check the output directory for downloaded files.
- Batch nodes per project; name them `cover.png`, `screen-01.png`, etc. via the `fileName` field.

## Granular export strategy (critical for portfolio quality)

**Do not export entire presentation slides or full design pages by default.** Presentation slides and full canvases often contain irrelevant surrounding content (titles, page numbers, decorative elements) that clutters the portfolio. Instead:

1. **Identify specific sub-frames** that the interview narrative references. If the user talked about a specific card design, export that card — not the entire slide it sits on.
2. **Export component-level detail crops** that highlight the design decisions discussed in the interview. A close-up of a navigation bar, a specific form interaction, or a color system is more valuable than a full-page screenshot.
3. **Match images to narrative**: every exported image should correspond to something the case study text discusses. If the text doesn't mention a screen, don't include it.
4. **Use screenshots for understanding, exports for the portfolio**: use `get_screenshot` / `get_figma_data` to understand the design during Phase 2, but for Phase 4 exports, be selective and intentional.
5. **Figma-Use recombination** (official MCP only): use `get_design_context` to extract component data, then compose intentional detail views rather than raw screenshots.

Recommended export set per project:
- 1 cover image (the single most representative frame or a composed hero), PNG @2x.
- 3–8 supporting images — **specific components, detail crops, or individual screens** that the narrative references. Named sequentially (`screen-01.png`, `screen-02.png`, ...).
- SVG for any logos or icons the case study references.

## Setup guidance (when MCP is missing)

### Official Figma MCP

Connect through the platform's native connector system. The remote server needs no personal token — it authenticates via Figma OAuth. Available on platforms listed at [figma.com/mcp-catalog](https://www.figma.com/mcp-catalog/). After connecting, the Figma tools appear in ToolSearch results. If tools don't appear, verify the connector is trusted/enabled.

### Framelink MCP

For CodeBuddy/WorkBuddy/LearnBuddy and other platforms not in the Figma MCP catalog. Configure in the platform's MCP config file (e.g. `~/.learnbuddy/mcp.json` for LearnBuddy, `~/.workbuddy/mcp.json` for WorkBuddy):

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_FIGMA_TOKEN", "--stdio"]
    }
  }
}
```

If using a managed Node runtime, use the full path to `npx` in the `command` field.

The user generates a Personal Access Token in Figma: Settings → Security → Personal access tokens, with **File content** and **Dev resources** read scopes. After writing the config, instruct the user to trust/enable the new server in the connector management UI.

## Troubleshooting

- **Tools not discoverable**: the connector isn't connected or isn't trusted. Re-check connector status; for Framelink, verify the token has the right scopes.
- **`download_assets` returns URLs that fail to fetch**: the temporary URLs expire quickly. Fetch and save them immediately after the call; don't batch many calls before downloading.
- **Large frames export at low resolution**: increase `defaultScale` (up to 4x). The long-edge cap is ~4096px at scale 1.
- **Wrong node exported**: confirm the node ID. Figma's right-click "Copy link to selection" gives the precise node. Re-parse the URL if the `-`/`:` conversion was missed.
- **Rate limits**: the official server has per-window limits. If a call is throttled, wait and retry rather than hammering.
- **MCP request timeouts on large frames**: export smaller sub-frames one at a time with `pngScale: 1`. Check if files were partially downloaded despite the timeout error.
