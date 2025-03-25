"use client"

import { Markdown } from "@/components/ui/markdown"

export function MarkdownExample() {
  const exampleMarkdown = `
# Markdown Example

This is a simple example of using **Markdown** with *styling*.

## Features

- GitHub Flavored Markdown support
- Syntax highlighting
- Responsive tables
- Dark mode support

## Code Example

\`\`\`typescript
function hello(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table Example

| Name | Type | Description |
|------|------|-------------|
| id | string | Unique identifier |
| title | string | The title of the item |
| created | Date | When the item was created |

> This is a blockquote with a [link](https://example.com)
`

  return (
    <div className="container py-8">
      <Markdown content={exampleMarkdown} />
    </div>
  )
}

