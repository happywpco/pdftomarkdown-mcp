#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import fetch from "node-fetch";

const API_BASE = "https://pdftomarkdown.ai";
const API_KEY = process.env.PDFTOMARKDOWN_API_KEY;

const server = new Server(
  { name: "pdftomarkdown", version: "1.0.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "convert_pdf_to_markdown",
      description: "Convert a PDF file to clean Markdown. Use this when you need to extract text from a PDF for AI processing, note-taking, or document analysis. Returns clean, structured Markdown that works with ChatGPT, Claude, and Obsidian.",
      inputSchema: {
        type: "object",
        properties: {
          file_path: {
            type: "string",
            description: "Absolute path to the PDF file to convert",
          },
          force_ocr: {
            type: "boolean",
            description: "Enable Force OCR for scanned PDFs (default: false)",
            default: false,
          },
        },
        required: ["file_path"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "convert_pdf_to_markdown") {
    throw new Error(`Unknown tool: ${request.params.name}`);
  }

  const { file_path, force_ocr = false } = request.params.arguments;

  if (!API_KEY) {
    return {
      content: [
        {
          type: "text",
          text: "Error: PDFTOMARKDOWN_API_KEY environment variable is not set. Get your API key at https://pdftomarkdown.ai/account",
        },
      ],
      isError: true,
    };
  }

  if (!fs.existsSync(file_path)) {
    return {
      content: [{ type: "text", text: `Error: File not found: ${file_path}` }],
      isError: true,
    };
  }

  const formData = new FormData();
  formData.append("file", fs.createReadStream(file_path), {
    filename: path.basename(file_path),
    contentType: "application/pdf",
  });
  formData.append("options", JSON.stringify({ forceOcr: force_ocr }));

  const response = await fetch(`${API_BASE}/api/v1/convert`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      ...formData.getHeaders(),
    },
    body: formData,
  });

  const result = await response.json();

  if (!result.success) {
    return {
      content: [{ type: "text", text: `Conversion failed: ${result.error || "Unknown error"}` }],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: "text",
        text: `Converted ${result.pageCount} page(s). ${result.creditsUsed} credit(s) used.\n\n${result.markdown}`,
      },
    ],
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
