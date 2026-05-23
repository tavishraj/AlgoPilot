import { create } from 'zustand';

interface EditorState {
  code: string;
  language: string;
  fontSize: number;
  isRunning: boolean;
  output: string | null;

  // Actions
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setFontSize: (size: number) => void;
  setIsRunning: (isRunning: boolean) => void;
  setOutput: (output: string | null) => void;
  reset: () => void;
}

const initialState = {
  code: '',
  language: 'javascript',
  fontSize: 14,
  isRunning: false,
  output: null,
};

export const useEditorStore = create<EditorState>()((set) => ({
  ...initialState,

  setCode: (code) => set({ code }),
  setLanguage: (language) => set({ language }),
  setFontSize: (size) => set({ fontSize: size }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setOutput: (output) => set({ output }),
  reset: () => set(initialState),
}));
