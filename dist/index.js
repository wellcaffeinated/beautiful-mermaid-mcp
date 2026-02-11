#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod/v3';
import { renderMermaidAscii } from 'beautiful-mermaid';

var version = "0.1.0";
var pkg = {
	version: version};

const flowchart = `graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Process]
  B -->|No| D[End]
  C --> D`;
const stateDiagram = `stateDiagram-v2
  [*] --> Idle
  Idle --> Processing: start
  Processing --> Complete: done
  Complete --> [*]`;
const sequenceDiagram = `sequenceDiagram
  Alice->>Bob: Hello Bob!
  Bob-->>Alice: Hi Alice!
  Alice->>Bob: How are you?
  Bob-->>Alice: Great, thanks!`;
const classDiagram = `classDiagram
  Animal <|-- Duck
  Animal <|-- Fish
  Animal: +int age
  Animal: +String gender
  Animal: +isMammal() bool
  Duck: +String beakColor
  Duck: +swim()
  Duck: +quack()`;
const erDiagram = `erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ LINE_ITEM : contains
  PRODUCT ||--o{ LINE_ITEM : "is in"`;
var exampleDiagrams = [
  { name: "flowchart", text: flowchart },
  { name: "stateDiagram", text: stateDiagram },
  { name: "sequenceDiagram", text: sequenceDiagram },
  { name: "classDiagram", text: classDiagram },
  { name: "erDiagram", text: erDiagram }
];

const server = new McpServer({
  name: "mermaid-ascii",
  version: pkg.version
});
server.registerTool(
  "render-mermaid-ascii",
  {
    title: "Render Mermaid ASCII",
    description: [
      "Render a Mermaid diagram as ASCII art. Useful for visualizing",
      "flowcharts, sequence diagrams, network topologies,",
      "etc. in the terminal or a chat interface.",
      "The output should be relayed back to the use as-is without any additional formatting.",
      "Do not summarize or describe the diagram \u2014 show the ASCII output directly."
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
        content: [{ type: "text", text: ascii }]
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
exampleDiagrams.forEach(({ name, text }) => {
  server.registerResource(
    "example",
    `example://${name}`,
    {
      title: `Example Mermaid Diagram: ${name}`,
      description: `An example Mermaid diagram of type ${name}.`,
      mimeType: "text/plain"
    },
    async () => ({
      contents: [{ uri: `example://${name}`, text }]
    })
  );
});
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
