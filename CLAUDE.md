# Quickfill Project Rules

This file provides Claude with instructions on how to use the Quickfill Generative UI toolkit.

## 🛠 MCP Tools
Quickfill provides two core tools:
- `mcp_quickfill_render_interactive_ui`: Renders HTML/Alpine.js/Tailwind code to a live browser window.
- `mcp_quickfill_mount_file`: Exposes a local file to the web server for browser parsing.

## 🎨 Generative UI Standards
When using Quickfill to render UIs:
1. **Always use Tailwind CSS**: It is pre-injected. Use it for all styling.
2. **Always use Alpine.js**: It is pre-injected. Use it for reactivity and logic.
3. **Lazy Fetching**: If the user provides a data file, `mount_file` it first, then use `fetch()` in the Alpine.js `x-init` block to load and parse it.
4. **WASM Support**: Mention `excel`, `pdf`, or `ocr` in the `required_libs` array of `render_interactive_ui` if you need to parse those file types.

## 🧠 Strategic Advice
- **Proactive Visuals**: If the user asks for data analysis, don't just output text. Proactively build a dashboard using `render_interactive_ui`.
- **Iterative Updates**: Update the UI frequently based on user feedback. The server supports hot-reloading.
- **Portability**: Use relative paths (e.g., `./filename.csv`) for mounted files in your UI code.
