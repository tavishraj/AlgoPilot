import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * A lightweight, dependency-free Markdown renderer.
 * Supports:
 * - Code blocks: \`\`\`lang ... \`\`\`
 * - Inline code: \`code\`
 * - Bold: **bold**
 * - Headers: ### Header
 * - Lists: - Item
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;

  // Split content by code blocks first to avoid parsing inside them
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className={cn('text-sm space-y-3 leading-relaxed', className)}>
      {blocks.map((block, index) => {
        // Is it a code block?
        if (block.startsWith('```') && block.endsWith('```')) {
          const lines = block.slice(3, -3).trim().split('\n');
          const lang = lines[0]?.trim();
          const code = lines.slice(lang ? 1 : 0).join('\n');

          return (
            <div key={index} className="my-3 overflow-hidden rounded-md border border-border/50 bg-surface">
              {lang && (
                <div className="bg-surface-hover/50 px-3 py-1.5 text-xs text-text-muted border-b border-border/50 uppercase tracking-wider">
                  {lang}
                </div>
              )}
              <pre className="overflow-x-auto p-3 text-[13px] text-text-secondary">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // It's normal text, parse inline styles and blocks
        return (
          <div key={index} className="space-y-2">
            {block.split('\n\n').map((paragraph, pIdx) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Check if it's a list
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const listItems = trimmed.split('\n').map(line => line.replace(/^[-*]\s+/, ''));
                return (
                  <ul key={pIdx} className="list-inside list-disc space-y-1 pl-1 marker:text-text-muted/50">
                    {listItems.map((item, iIdx) => (
                      <li key={iIdx} className="text-text-secondary">
                        <InlineMarkdown text={item} />
                      </li>
                    ))}
                  </ul>
                );
              }

              // Check if it's a header
              if (trimmed.startsWith('### ')) {
                return <h3 key={pIdx} className="font-semibold text-text-primary mt-4 mb-2">{trimmed.replace('### ', '')}</h3>;
              }
              if (trimmed.startsWith('## ')) {
                return <h2 key={pIdx} className="font-bold text-text-primary mt-5 mb-2">{trimmed.replace('## ', '')}</h2>;
              }

              // Normal paragraph
              return (
                <p key={pIdx} className="text-text-secondary">
                  <InlineMarkdown text={trimmed} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── Inline Markdown Parser ────────────────────────────────

function InlineMarkdown({ text }: { text: string }) {
  // Split by bold (**bold**)
  const parts = text.split(/(\*\*[\s\S]*?\*\*|`[^`]+`)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold text-text-primary">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="rounded bg-surface-hover/80 px-1.5 py-0.5 text-[13px] font-mono text-primary-light">
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
