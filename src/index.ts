#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod/v3'
import { renderMermaidAscii } from 'beautiful-mermaid'
import pkg from '../package.json' with { type: 'json' }
import exampleDiagrams from './example-diagrams.js'

const server = new McpServer({
  name: 'mermaid-ascii',
  version: pkg.version,
})

// Define a tool the LLM can invoke
server.registerTool(
  'render-mermaid-ascii',
  {
    title: 'Render Mermaid ASCII',
    description: [
      'Render a Mermaid diagram as ASCII art. Useful for visualizing',
      'flowcharts, sequence diagrams, network topologies,',
      'etc. in the terminal or a chat interface.',
      'The output should be relayed back to the use as-is without any additional formatting.',
      'Do not summarize or describe the diagram — show the ASCII output directly.',
    ].join(' '),
    // Zod schema for input validation
    inputSchema: {
      mermaidSyntax: z
        .string()
        .describe("Mermaid diagram syntax, e.g. 'graph LR; A --> B --> C'"),
    },
  },
  async ({ mermaidSyntax }) => {
    try {
      const ascii = await renderMermaidAscii(mermaidSyntax)
      return {
        content: [{ type: 'text', text: ascii }],
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      return {
        content: [
          { type: 'text', text: `Error rendering diagram: ${message}` },
        ],
        isError: true,
      }
    }
  }
)

// Create resources for example diagrams
exampleDiagrams.forEach(({ name, text }) => {
  server.registerResource(
    'example',
    `example://${name}`,
    {
      title: `Example Mermaid Diagram: ${name}`,
      description: `An example Mermaid diagram of type ${name}.`,
      mimeType: 'text/plain',
    },
    async () => ({
      contents: [{ uri: `example://${name}`, text }],
    })
  )
})

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  console.error('Server error:', error)
  process.exit(1)
})
