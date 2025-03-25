"use client"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn("prose dark:prose-invert", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Override default components for custom styling if needed
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-primary hover:text-primary/80 underline underline-offset-4"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={cn("bg-muted block p-4 rounded-md overflow-x-auto", className)} {...props}>
                {children}
              </code>
            )
          },
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-muted pl-4 italic my-4" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-border" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => <th className="px-4 py-2 text-left font-medium" {...props} />,
          td: ({ node, ...props }) => <td className="px-4 py-2 border-t border-border" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

