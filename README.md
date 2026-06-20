# PDFtoMarkdown.ai — MCP Server

[![npm](https://img.shields.io/npm/v/@happywp/pdftomarkdown-mcp.svg)](https://www.npmjs.com/package/@happywp/pdftomarkdown-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-clay.svg)](./LICENSE)

An [MCP](https://modelcontextprotocol.io) server that lets AI agents convert **PDFs, Word, PowerPoint, Excel, images, HTML, and EPUB** into clean, structured **Markdown** — powered by [PDFtoMarkdown.ai](https://pdftomarkdown.ai).

Give Claude, Cursor, Codex, Hermes, OpenClaw, or any MCP-compatible client a `convert_pdf_to_markdown` tool so it can turn local documents into agent-ready Markdown on demand — headings, tables, and OCR text preserved — instead of choking on raw document blobs.

## Why

Models reason far better over clean Markdown than over raw PDF/Office layout. Converting a document **once** to Markdown is cheaper, faster, and higher-fidelity than making the model re-OCR it on every run.

## Features

- 🧠 **Agent-ready Markdown** — headings, lists, and tables preserved
- 📄 **Many formats** — PDF, DOCX, PPTX, XLSX, PNG/JPG, HTML, EPUB
- 🔍 **OCR** — reads scanned PDFs and images (optional Force OCR)
- 🔌 **Drop-in MCP** — one tool, works in any MCP client
- ⚡ **Fast** — most documents convert in seconds

## Prerequisites

- Node.js 18+
- A free API key from your [PDFtoMarkdown.ai account](https://pdftomarkdown.ai/account)

## Installation

```bash
npm install -g @happywp/pdftomarkdown-mcp
```

## Configuration

Add the server to your MCP client's config, using the API key from your account.

**Claude Desktop** — `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "pdftomarkdown": {
      "command": "pdftomarkdown-mcp",
      "env": {
        "PDFTOMARKDOWN_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Cursor** — `~/.cursor/mcp.json` uses the same `mcpServers` shape.

**Codex** — `~/.codex/config.toml`:

```toml
[mcp_servers.pdftomarkdown]
command = "pdftomarkdown-mcp"
env = { PDFTOMARKDOWN_API_KEY = "your-api-key-here" }
```

Restart your client so the server loads.

## Usage

Just ask your agent:

> Convert this PDF to Markdown and summarize the key points: `/path/to/document.pdf`

## Tool

### `convert_pdf_to_markdown`

| Argument | Type | Required | Description |
|---|---|---|---|
| `file_path` | string | yes | Absolute path to the document to convert |
| `force_ocr` | boolean | no | Force OCR on every page (for scanned files) |

Returns the converted Markdown, the page count, and credits used.

## Environment variables

| Variable | Description |
|---|---|
| `PDFTOMARKDOWN_API_KEY` | Your PDFtoMarkdown.ai API key ([get one free](https://pdftomarkdown.ai/account)) |

## Pricing

Pay per page — no subscription. Free to start (10 free pages with an account, no card required). See [pdftomarkdown.ai/pricing](https://pdftomarkdown.ai/pricing).

## Links

- 🌐 [PDFtoMarkdown.ai](https://pdftomarkdown.ai)
- 📚 [API & MCP docs](https://pdftomarkdown.ai/developers)
- 📦 [npm package](https://www.npmjs.com/package/@happywp/pdftomarkdown-mcp)

## License

MIT © [HappyWP](https://happywp.co)
