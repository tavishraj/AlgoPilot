import { cn } from '@/lib/utils';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { WorkspaceToolbar } from './WorkspaceToolbar';
import { ProblemPanel } from './ProblemPanel';
import { EditorPanel } from '@/components/features/editor';
import { AiDostPanel } from '@/components/features/ai';
import { TestcasePanel } from './TestcasePanel';
import { useState } from 'react';
import { BookOpen, Code2 } from 'lucide-react';

// ─── Workspace Layout ─────────────────────────────────────
// Full-viewport CSS Grid layout for the coding workspace.
// Three columns (problem | editor | AI) + bottom panel.
// Responsive: tablets show tabbed problem/editor, mobile
// gets a full-screen editor with slide-out description.

export function WorkspaceLayout() {
  const aiPanelCollapsed = useWorkspaceStore((s) => s.aiPanelCollapsed);
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const [mobileTab, setMobileTab] = useState<'problem' | 'editor'>('editor');

  // ─── Tablet / Mobile: Tabbed View ────────────────────
  if (!isLargeScreen) {
    return (
      <div className="flex h-dvh flex-col overflow-hidden bg-background">
        <WorkspaceToolbar />

        {/* Tab switcher */}
        <div className="flex shrink-0 border-b border-border bg-background/60">
          <button
            onClick={() => setMobileTab('problem')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors relative',
              mobileTab === 'problem' ? 'text-text-primary' : 'text-text-muted'
            )}
          >
            <BookOpen className="h-3 w-3" />
            Problem
            {mobileTab === 'problem' && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-primary" />
            )}
          </button>
          <button
            onClick={() => setMobileTab('editor')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors relative',
              mobileTab === 'editor' ? 'text-text-primary' : 'text-text-muted'
            )}
          >
            <Code2 className="h-3 w-3" />
            Editor
            {mobileTab === 'editor' && (
              <span className="absolute bottom-0 left-0 right-0 h-px bg-primary" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0">
          {mobileTab === 'problem' ? <ProblemPanel /> : <EditorPanel />}
        </div>

        {/* Bottom panel */}
        <TestcasePanel />
      </div>
    );
  }

  // ─── Desktop: Full Grid Layout ───────────────────────
  return (
    <div
      className={cn('workspace-grid bg-background', aiPanelCollapsed && 'ai-collapsed')}
    >
      {/* Row 1: Toolbar */}
      <WorkspaceToolbar />

      {/* Row 2: Three panels */}
      <ProblemPanel />
      <EditorPanel />
      <AiDostPanel />

      {/* Row 3: Bottom panel */}
      <div className="col-span-full">
        <TestcasePanel />
      </div>
    </div>
  );
}
