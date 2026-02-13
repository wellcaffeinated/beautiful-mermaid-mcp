#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod/v3';
import { renderMermaidAscii } from 'beautiful-mermaid';

var version = "0.1.0";
var pkg = {
	version: version};

const server = new McpServer(
  {
    name: "mermaid-ascii",
    version: pkg.version
  },
  {
    instructions: `When calling tools, the output of tools is often
    hidden from the user. Therefore it is important that the content
    returned by tools is always included in the
    final response to the user.`
  }
);
server.registerTool(
  "render-mermaid-ascii",
  {
    title: "Render Mermaid ASCII",
    description: [
      "Render a Mermaid diagram as ASCII art. Useful for visualizing",
      "flowcharts, sequence diagrams, network topologies,",
      "etc. in the terminal or a chat interface.",
      "",
      "Formatting Guide:",
      "- Use plain text, single line labels for nodes and edges. NEVER use html or markdown in labels.",
      "- Avoid complex styling or colors, as they may not render well in ASCII.",
      "- Focus on clear structure and relationships between elements."
    ].join(" "),
    // Zod schema for input validation
    inputSchema: {
      mermaidSyntax: z.string().describe("Mermaid diagram syntax, e.g. 'graph LR; A --> B --> C'")
    }
  },
  async ({ mermaidSyntax }) => {
    try {
      const ascii = await renderMermaidAscii(mermaidSyntax);
      return {
        content: [
          {
            type: "text",
            text: "Here is the rendered Mermaid diagram in ASCII:"
          },
          { type: "text", text: "```\n" + ascii + "\n```" },
          {
            type: "text",
            text: "IMPORTANT: This output is hidden from the user. Always include this diagram in the final response to the user."
          }
        ]
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [
          { type: "text", text: `Error rendering diagram: ${message}` }
        ],
        isError: true
      };
    }
  }
);
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
