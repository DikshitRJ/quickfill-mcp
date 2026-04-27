# 🤖 Agent Guidelines for Quickfill

This document provides instructions for AI Agents (like Claude, GPT-4, etc.) on how to effectively use the Quickfill MCP server to provide the best user experience.

## 🧠 Core Philosophy
Quickfill is a **Generative UI** toolkit. Instead of writing code for the user to copy-paste, you should use the tools to **build and show** the interface directly.

## 🛠 Tool Usage Patterns

### 1. The Data-to-UI Pattern
When a user provides a data file (Excel, CSV, PDF):
1. Use `mount_file` to get a browser-accessible URL for the file.
2. Generate an Alpine.js dashboard that `fetch()`es that URL.
3. Use `render_interactive_ui` to display the dashboard.

### 2. The Iterative Design Pattern
Don't try to build the perfect UI in one go.
1. Start with a basic layout using `render_interactive_ui`.
2. Ask the user for feedback.
3. Update specific sections of the `html_body` in subsequent calls to `render_interactive_ui` to "hot-reload" the changes.

## 🎨 Design System: Tailwind CSS
Always use Tailwind CSS classes for styling. It is pre-injected into every Quickfill session.
- **Responsive**: Use `md:`, `lg:` classes to ensure the UI looks good in different window sizes.
- **Dark Mode**: Quickfill supports standard Tailwind dark mode patterns.

## ⚡ Interactivity: Alpine.js
Use Alpine.js for logic. It is pre-injected and lightweight.
- Use `x-data` for state.
- Use `x-on` or `@` for events.
- Use `x-init` to trigger data fetching from mounted files.

## 📦 External Libraries
Only use these if requested by the tool call:
- **excel**: Provides `XLSX` (SheetJS) for parsing spreadsheets.
- **pdf**: Provides `pdfjsLib` for rendering PDFs.
- **ocr**: Provides `Tesseract` for optical character recognition.
