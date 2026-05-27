import { RotateCcw, Minus, Plus, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

// ─── Editor Toolbar ───────────────────────────────────────
// Controls above the code editor: font size, reset code.

export function EditorToolbar() {
  const fontSize = useWorkspaceStore((s) => s.fontSize);
  const setFontSize = useWorkspaceStore((s) => s.setFontSize);
  const resetCode = useWorkspaceStore((s) => s.resetCode);

  return (
    <div className="panel-header justify-between">
      <span className="text-xs font-medium text-text-secondary">Code</span>

      <div className="flex items-center gap-1">
        {/* Font size controls */}
        <button
          onClick={() => setFontSize(Math.max(10, fontSize - 1))}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded text-text-muted',
            'transition-colors hover:bg-surface hover:text-text-secondary'
          )}
          title="Decrease font size"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-6 text-center text-xs font-mono text-text-muted">{fontSize}</span>
        <button
          onClick={() => setFontSize(Math.min(24, fontSize + 1))}
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded text-text-muted',
            'transition-colors hover:bg-surface hover:text-text-secondary'
          )}
          title="Increase font size"
        >
          <Plus className="h-3 w-3" />
        </button>

        <div className="mx-1.5 h-3 w-px bg-border" />

        {/* Reset code */}
        <button
          onClick={resetCode}
          className={cn(
            'flex h-6 items-center gap-1 rounded px-1.5 text-text-muted',
            'transition-colors hover:bg-surface hover:text-text-secondary'
          )}
          title="Reset to starter code"
        >
          <RotateCcw className="h-3 w-3" />
          <span className="text-xs">Reset</span>
        </button>

        <div className="mx-1.5 h-3 w-px bg-border" />

        {/* Settings (placeholder) */}
        <button
          className={cn(
            'flex h-6 w-6 items-center justify-center rounded text-text-muted',
            'transition-colors hover:bg-surface hover:text-text-secondary'
          )}
          title="Editor settings"
        >
          <Settings2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
