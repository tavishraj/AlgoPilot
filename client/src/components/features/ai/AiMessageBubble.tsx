import { motion } from 'framer-motion';
import { Bot, User, Sparkles, AlertTriangle, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/common/MarkdownRenderer';

export type MessageRole = 'user' | 'assistant';
export type MessageType = 'chat' | 'hint' | 'explain' | 'debug' | 'concept';

export interface AiMessage {
  id: string;
  role: MessageRole;
  content: string;
  type?: MessageType;
}

interface AiMessageBubbleProps {
  message: AiMessage;
}

export function AiMessageBubble({ message }: AiMessageBubbleProps) {
  const isAi = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('flex gap-3', isAi ? 'flex-row' : 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border',
          isAi
            ? 'border-primary/20 bg-primary/10 text-primary'
            : 'border-border bg-surface text-text-muted'
        )}
      >
        {isAi ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'flex max-w-[85%] flex-col gap-1',
          !isAi && 'items-end'
        )}
      >
        {/* Optional Context Badge */}
        {isAi && message.type && message.type !== 'chat' && (
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            <BadgeIcon type={message.type} />
            {message.type}
          </div>
        )}

        {/* Message Content */}
        <div
          className={cn(
            'rounded-xl px-3.5 py-2.5',
            isAi
              ? 'rounded-tl-sm border border-border/40 bg-surface/40'
              : 'rounded-tr-sm bg-primary/15 text-primary-light'
          )}
        >
          {isAi ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <p className="text-[13px] leading-relaxed">{message.content}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function BadgeIcon({ type }: { type: MessageType }) {
  switch (type) {
    case 'hint':
      return <Sparkles className="h-3 w-3 text-warning" />;
    case 'debug':
      return <AlertTriangle className="h-3 w-3 text-error" />;
    case 'explain':
      return <Code2 className="h-3 w-3 text-info" />;
    default:
      return null;
  }
}

// ─── Loading State Bubble ─────────────────────────────────

export function AiLoadingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-primary/20 bg-primary/10 text-primary">
        <Bot className="h-3.5 w-3.5" />
      </div>
      <div className="flex items-center gap-1 rounded-xl rounded-tl-sm border border-border/40 bg-surface/40 px-4 py-3.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted/50 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted/50 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-text-muted/50" />
      </div>
    </motion.div>
  );
}
