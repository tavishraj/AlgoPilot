// ─── Static Analysis Module — Public API ─────────────────
// Entry point for all analysis operations.

// Core analysis functions
export { analyzeCodeStatic, analyzeCodeCompat } from './engine.js';

// Types
export type {
  StaticAnalysisReport,
  ComplexityEstimate,
  Diagnostic,
  DiagnosticSeverity,
  DiagnosticCategory,
  DetectedPattern,
  Suggestion,
  SuggestionType,
  CodeMetrics,
  Token,
  TokenType,
  Block,
  BlockType,
  BlockTree,
  LoopInfo,
  FunctionInfo,
  VariableInfo,
  LangConfig,
  SupportedLanguage,
} from './types.js';

// Sub-modules (for advanced usage)
export { tokenize } from './parsers/index.js';
export { parseBlocks, extractFunctions, extractLoops, extractVariables } from './parsers/index.js';
export { getLangConfig } from './lang/index.js';
