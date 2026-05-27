import { EditorToolbar } from './EditorToolbar';
import { CodeEditor } from './CodeEditor';

// ─── Editor Panel ─────────────────────────────────────────
// Composition wrapper for the code editor and its toolbar.

export function EditorPanel() {
  return (
    <div className="flex h-full flex-col border-r border-border">
      <EditorToolbar />
      <div className="flex-1 min-h-0 bg-[#0a0c0f]">
        <CodeEditor />
      </div>
    </div>
  );
}
