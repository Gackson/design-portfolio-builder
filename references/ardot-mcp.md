# Ardot MCP Reference

Complete guide to reading Ardot design files and exporting assets via the Ardot MCP. Ardot is a design platform (https://ardot.tencent.com/) that provides its own MCP server with tools for reading designs, taking screenshots, and exporting assets.

## Discovery

At the start of any Ardot-dependent phase, search for available tools:

```
ToolSearch with queries: ["ardot", "batch_read", "export_nodes", "capture_screenshot", "fetch_editor_state", "fetch_file_info"]
```

If Ardot MCP tools are discoverable, the connection is active. If not, guide the user through setup (see "Setup" below).

## Connection setup

Ardot MCP is a local server that runs alongside the Ardot desktop client. To connect:

### Prerequisites
1. Download and install the **Ardot desktop client** from https://ardot.tencent.com/
2. Log in to Ardot in the desktop client
3. Open or create a design file in Ardot (the MCP only works when a file is open)

### MCP configuration

In the Ardot desktop client:
1. Open **MCP 高级设置** (MCP Advanced Settings)
2. Click **一键复制 MCP 配置** (Copy MCP config) — this copies a JSON config snippet

In your platform's connector management (e.g. LearnBuddy 连接器):
1. Open the connector management page
2. Click **自定义连接器** (Custom Connector)
3. Click **配置 MCP** (Configure MCP)
4. Paste the copied Ardot MCP config
5. Rename the server (e.g. `ardot-design` — do not keep the default name)
6. Enable/trust the new connector

The Ardot MCP config typically looks like:

```json
{
  "mcpServers": {
    "ardot-design": {
      "url": "http://127.0.0.1:50501/api/v1/mcp"
    }
  }
}
```

### Critical prerequisites
- The Ardot desktop client **must be running** and a **file must be open** for MCP commands to work.
- Verify the MCP connection status shows "MCP 已连接" (MCP Connected) in the Ardot client.
- If MCP is configured but commands fail, try **restarting both Ardot and your platform** (e.g. LearnBuddy), then retry.

## Tool catalog

The Ardot MCP provides the following tools. Key tools for the portfolio workflow:

### Reading designs (Phase 2)

- **`fetch_file_info`** — get basic info about the currently active design file (name, URL, file ID, permissions). Use this first to confirm the file is open.
- **`fetch_editor_state`** — get the currently active canvas editor, user selection, and design info. Use this to understand what page/canvas is active.
- **`batch_read`** — retrieve nodes by searching for patterns or by node IDs. This is the primary tool for understanding the design structure. Start with top-level children of the document, then drill into specific frames.
  - Use `searchDepth` to control traversal depth.
  - Use `properties` array to request specific properties only.
  - When a node has >500 children, child info is compressed (ID, name, type only).
- **`capture_screenshot`** — get screenshots of specific nodes. Use this to *see* the design so interview questions are grounded. Pass up to 10 node IDs per call. Avoid screenshotting nodes wider/taller than 2000px — screenshot sections individually instead.
- **`fetch_variables`** — get the design variables (colors, spacing, typography) defined in the file. Use for style reference in Phase 6.
- **`fetch_guidelines`** — get design guidelines and rules. Available topics: `table`, `landing-page`, `web-app`, `mobile-app`, `slides`, `code`, `tailwind`.
- **`fetch_component_lib`** — get components and component sets from the component library.
- **`capture_layout`** — check the layout structure and identify layout problems (overlapping elements, clipped content, text lineHeight issues).

### Exporting assets (Phase 4)

- **`scan_exportable_resources`** — scan a node tree and return all exportable resource nodes, categorized as "image" (nodes with image fills → PNG/JPEG/WEBP) and "svg" (vector/shape-only nodes → SVG). Use this BEFORE exporting to determine which nodes to export and in what format.
- **`export_nodes`** — export nodes to image files (PNG/JPEG/WEBP/SVG/PDF).
  - For PNG/JPEG/WEBP: max 5 nodes per batch.
  - For SVG: no limit per batch.
  - For PDF: all Frame nodes are merged into a single PDF file.
  - Default scale is 2x; SVG always exports at 1x.
  - Files are named by node ID (or document name for PDF).

## URL parsing

An Ardot link looks like:

```
https://ardot.tencent.com/file/<fileId>?node_id=<nodeId>
```

- `fileId`: the numeric ID in the URL path.
- `nodeId`: the `node_id` query parameter.

If the user provides just a file ID, use `fetch_file_info` and `fetch_editor_state` to discover the file's structure.

## Reading a project (Phase 2)

1. **Confirm file is open** — call `fetch_file_info` to verify the active file and get basic info.
2. **Get editor state** — call `fetch_editor_state` to see the active page and current selection.
3. **Read structure** — call `batch_read` with no specific nodeIds to get top-level children of the document. This reveals pages, frames, and their names.
4. **Drill into frames** — call `batch_read` again with specific node IDs from the top-level results to see the children of key frames.
5. **Screenshot key screens** — call `capture_screenshot` with up to 10 node IDs to visually see the design. This grounds interview questions in the actual work.
6. **Optional: pull design tokens** — call `fetch_variables` to get the color/spacing/type variables for style reference.

## Exporting assets (Phase 4)

### Step 1: Scan exportable resources

Call `scan_exportable_resources` with the root node ID (or omit nodeId to scan the current page). This returns a categorized list of:
- **Image nodes** (have image fills → export as PNG/JPEG/WEBP)
- **SVG nodes** (vector/shape only → export as SVG)

### Step 2: Export specific nodes

Call `export_nodes` with the node IDs you want to export:

- For PNG screenshots: export at scale 2, max 5 nodes per call.
- For SVG logos/icons: no limit per call.
- Save outputs to `public/images/projects/<slug>/`.

### Granular export strategy

Apply the same granular export strategy as Figma:
- Export specific components and detail crops, not entire canvases.
- Each image must connect to the narrative text.
- Curate 3–8 supporting images plus 1 cover — quality over quantity.
- Use `capture_screenshot` to verify what a node looks like before exporting it.

## Troubleshooting

- **MCP tools not discoverable**: Ardot client not running, no file open, or connector not trusted. Verify all three.
- **Commands fail despite MCP configured**: restart both Ardot client and your platform (LearnBuddy/WorkBuddy), then retry.
- **`batch_read` returns too much data**: use `searchDepth` to limit traversal depth, or use `properties` to request only specific properties.
- **`capture_screenshot` on oversized nodes**: avoid nodes wider/taller than 2000px. Screenshot sections individually.
- **`export_nodes` fails**: check node IDs are valid. Use `batch_read` or `scan_exportable_resources` to confirm node IDs before exporting.
