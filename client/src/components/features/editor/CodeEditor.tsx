import { useRef, useCallback } from 'react';
import Editor, { type OnMount, type OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { Loader2 } from 'lucide-react';

// ─── AlgoPilot Monaco Theme ──────────────────────────────
// Matches the app's dark design tokens precisely.

function defineAlgoPilotTheme(monaco: Parameters<OnMount>[1]) {
  monaco.editor.defineTheme('algopilot', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '686873', fontStyle: 'italic' },
      { token: 'keyword', foreground: 'c4b5fd' },
      { token: 'string', foreground: '34d399' },
      { token: 'number', foreground: 'fbbf24' },
      { token: 'type', foreground: '67e8f9' },
      { token: 'function', foreground: 'a5f3fc' },
      { token: 'variable', foreground: 'f4f7fa' },
      { token: 'operator', foreground: '8c8c97' },
    ],
    colors: {
      'editor.background': '#0a0c0f',
      'editor.foreground': '#f4f7fa',
      'editor.lineHighlightBackground': '#ffffff08',
      'editor.selectionBackground': '#67e8f920',
      'editor.inactiveSelectionBackground': '#67e8f910',
      'editorCursor.foreground': '#67e8f9',
      'editorLineNumber.foreground': '#686873',
      'editorLineNumber.activeForeground': '#c4c4cc',
      'editor.selectionHighlightBackground': '#67e8f915',
      'editorIndentGuide.background': '#ffffff08',
      'editorIndentGuide.activeBackground': '#ffffff14',
      'editorWidget.background': '#0d0f12',
      'editorWidget.border': '#ffffff14',
      'editorSuggestWidget.background': '#0d0f12',
      'editorSuggestWidget.border': '#ffffff14',
      'editorSuggestWidget.selectedBackground': '#ffffff0d',
      'scrollbar.shadow': '#00000000',
      'scrollbarSlider.background': '#ffffff14',
      'scrollbarSlider.hoverBackground': '#ffffff22',
      'scrollbarSlider.activeBackground': '#ffffff2e',
    },
  });
}

// ─── Language → Monaco Language ID ────────────────────────

const MONACO_LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
};

// ─── Code Editor Component ────────────────────────────────

export function CodeEditor() {
  const code = useWorkspaceStore((s) => s.code);
  const language = useWorkspaceStore((s) => s.language);
  const fontSize = useWorkspaceStore((s) => s.fontSize);
  const setCode = useWorkspaceStore((s) => s.setCode);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    defineAlgoPilotTheme(monaco);
    monaco.editor.setTheme('algopilot');
    editor.focus();
  }, []);

  const handleChange: OnChange = useCallback(
    (value) => {
      if (value !== undefined) {
        setCode(value);
      }
    },
    [setCode]
  );

  return (
    <Editor
      height="100%"
      language={MONACO_LANGUAGE_MAP[language] ?? 'javascript'}
      value={code}
      onMount={handleMount}
      onChange={handleChange}
      loading={
        <div className="flex h-full items-center justify-center gap-2 text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading editor...</span>
        </div>
      }
      options={{
        fontSize,
        fontFamily: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
        fontLigatures: true,
        lineHeight: 1.7,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderLineHighlight: 'line',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        smoothScrolling: true,
        padding: { top: 16, bottom: 16 },
        overviewRulerBorder: false,
        hideCursorInOverviewRuler: true,
        overviewRulerLanes: 0,
        scrollbar: {
          vertical: 'auto',
          horizontal: 'auto',
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
        bracketPairColorization: { enabled: true },
        guides: {
          indentation: true,
          bracketPairs: true,
        },
        wordWrap: 'off',
        tabSize: 2,
        automaticLayout: true,
        contextmenu: true,
        suggest: {
          showMethods: true,
          showFunctions: true,
          showVariables: true,
          showWords: true,
        },
      }}
    />
  );
}
