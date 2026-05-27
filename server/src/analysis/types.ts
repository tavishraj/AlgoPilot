// ─── Static Analysis Type System ─────────────────────────
// Complete type definitions for the deterministic analysis engine.
// No LLM dependencies — pure heuristic analysis types.

import type { SupportedLanguage } from '../types/ai.types.js';

// ═══════════════════════════════════════════════════════════
//  TOKENIZER TYPES
// ═══════════════════════════════════════════════════════════

export type TokenType =
  | 'keyword'
  | 'identifier'
  | 'operator'
  | 'delimiter'
  | 'number'
  | 'string'
  | 'newline'
  | 'whitespace'
  | 'comment'
  | 'eof';

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

// ═══════════════════════════════════════════════════════════
//  BLOCK TREE TYPES (Lightweight AST)
// ═══════════════════════════════════════════════════════════

export type BlockType =
  | 'root'
  | 'function'
  | 'for_loop'
  | 'while_loop'
  | 'do_while_loop'
  | 'if_block'
  | 'else_block'
  | 'elif_block'
  | 'switch_block'
  | 'try_block'
  | 'catch_block'
  | 'class'
  | 'generic_block';

export interface Block {
  type: BlockType;
  /** Nesting depth from root (root = 0) */
  depth: number;
  /** Parent block reference index (-1 for root) */
  parentIndex: number;
  /** Indices of child blocks */
  childIndices: number[];
  /** Tokens belonging to this block's header (e.g. for-loop condition) */
  headerTokens: Token[];
  /** Tokens belonging to this block's body */
  bodyTokens: Token[];
  /** Source line where this block starts */
  startLine: number;
  /** Source line where this block ends */
  endLine: number;
  /** Optional label (function name, variable name, etc.) */
  label?: string;
}

/** The complete block tree — our lightweight AST */
export interface BlockTree {
  blocks: Block[];
  /** Flattened list of all tokens */
  tokens: Token[];
  /** Source language */
  language: SupportedLanguage;
}

// ═══════════════════════════════════════════════════════════
//  EXTRACTED INFO TYPES
// ═══════════════════════════════════════════════════════════

export interface LoopInfo {
  /** Loop type */
  type: 'for' | 'while' | 'do_while' | 'for_each';
  /** Nesting depth (1 = top-level loop) */
  nestingLevel: number;
  /** Whether loop body contains a break */
  hasBreak: boolean;
  /** Whether loop body contains a continue */
  hasContinue: boolean;
  /** Raw condition text (for analysis) */
  conditionText: string;
  /** Iterator variable name if detected */
  iteratorVar?: string;
  /** Whether the loop variable is mutated inside the body */
  iteratorMutated: boolean;
  /** Block index in the tree */
  blockIndex: number;
  /** Source line */
  line: number;
}

export interface FunctionInfo {
  /** Function name (or 'anonymous') */
  name: string;
  /** Parameter names */
  params: string[];
  /** Start line */
  startLine: number;
  /** End line */
  endLine: number;
  /** Whether this function calls itself */
  callsItself: boolean;
  /** Names of other functions called in the body */
  calledFunctions: string[];
  /** Whether a return statement exists */
  hasReturn: boolean;
  /** Block index in the tree */
  blockIndex: number;
}

export interface VariableInfo {
  /** Variable name */
  name: string;
  /** Declaration line */
  line: number;
  /** Whether it's ever read after declaration */
  isUsed: boolean;
  /** Whether it's reassigned after declaration */
  isMutated: boolean;
  /** Scope depth where declared */
  scopeDepth: number;
}

// ═══════════════════════════════════════════════════════════
//  ANALYSIS REPORT TYPES
// ═══════════════════════════════════════════════════════════

/** Complexity estimation result */
export interface ComplexityEstimate {
  /** Big-O time complexity (e.g. "O(n²)") */
  time: string;
  /** Big-O space complexity (e.g. "O(n)") */
  space: string;
  /** Human-readable reasoning chain */
  timeReasoning: string[];
  /** Human-readable space reasoning */
  spaceReasoning: string[];
}

/** Severity levels for diagnostics */
export type DiagnosticSeverity = 'error' | 'warning' | 'info' | 'hint';

/** Category of diagnostic */
export type DiagnosticCategory =
  | 'infinite_loop'
  | 'unreachable_code'
  | 'off_by_one'
  | 'missing_return'
  | 'missing_edge_case'
  | 'unused_variable'
  | 'wrong_comparison'
  | 'mutable_default'
  | 'no_base_case'
  | 'type_confusion'
  | 'integer_overflow'
  | 'global_mutation'
  | 'loop_invariant'
  | 'redundant_code';

/** A single diagnostic finding */
export interface Diagnostic {
  /** Severity level */
  severity: DiagnosticSeverity;
  /** Diagnostic category code */
  category: DiagnosticCategory;
  /** Human-readable message */
  message: string;
  /** Source line (if applicable) */
  line?: number;
  /** Beginner-friendly guidance text */
  guidance: string;
}

/** A detected algorithmic pattern */
export interface DetectedPattern {
  /** Pattern name */
  name: string;
  /** Detection confidence 0-1 */
  confidence: number;
  /** Lines where the pattern was detected */
  lines: number[];
}

/** Suggestion type */
export type SuggestionType = 'optimization' | 'quality' | 'beginner';

/** An actionable suggestion */
export interface Suggestion {
  type: SuggestionType;
  /** Human-readable suggestion */
  message: string;
  /** Priority 1 (highest) to 5 (lowest) */
  priority: number;
  /** Related line numbers */
  lines?: number[];
}

/** Quantitative code metrics */
export interface CodeMetrics {
  /** Non-empty line count */
  lineCount: number;
  /** Number of functions/methods */
  functionCount: number;
  /** Maximum nesting depth */
  maxNestingDepth: number;
  /** Estimated cyclomatic complexity */
  cyclomaticComplexity: number;
  /** Number of loops total */
  loopCount: number;
  /** Number of branches (if/else/switch) */
  branchCount: number;
}

/** The complete static analysis report */
export interface StaticAnalysisReport {
  /** Complexity estimates */
  complexity: ComplexityEstimate;
  /** Diagnostics (errors, warnings, hints) */
  diagnostics: Diagnostic[];
  /** Detected algorithmic patterns */
  patterns: DetectedPattern[];
  /** Actionable suggestions */
  suggestions: Suggestion[];
  /** Quantitative code metrics */
  metrics: CodeMetrics;
  /** Analysis execution time in ms */
  analysisTimeMs: number;
  /** Source language analyzed */
  language: SupportedLanguage;
}

// ═══════════════════════════════════════════════════════════
//  LANGUAGE CONFIGURATION TYPES
// ═══════════════════════════════════════════════════════════

export interface LangConfig {
  /** Language identifier */
  language: SupportedLanguage;
  /** All keywords for the language */
  keywords: Set<string>;
  /** Keywords that start loops */
  loopKeywords: Set<string>;
  /** Keywords that start function definitions */
  functionKeywords: Set<string>;
  /** Keywords that start conditionals */
  conditionalKeywords: Set<string>;
  /** Keywords that start class definitions */
  classKeywords: Set<string>;
  /** Single-line comment prefix */
  singleLineComment: string;
  /** Multi-line comment delimiters [open, close] */
  multiLineComment: [string, string] | null;
  /** Whether the language uses braces for blocks */
  usesBraces: boolean;
  /** Whether the language uses indentation for blocks (Python) */
  usesIndentation: boolean;
  /** Common data structure creation patterns */
  dataStructurePatterns: DataStructurePattern[];
  /** Sort function/method names */
  sortPatterns: string[];
  /** Variable declaration keywords */
  declarationKeywords: string[];
  /** Assignment operator(s) */
  assignmentOps: string[];
  /** Equality comparison operators */
  equalityOps: string[];
  /** Identity comparison for wrong-comparison detection */
  assignmentVsEquality: { assignment: string; equality: string[] } | null;
}

export interface DataStructurePattern {
  name: string;
  type: 'hash_map' | 'set' | 'array' | 'stack' | 'queue' | 'heap' | 'tree';
  /** Patterns to match (identifier or constructor names) */
  patterns: string[];
}

// ═══════════════════════════════════════════════════════════
//  RE-EXPORTS for convenience
// ═══════════════════════════════════════════════════════════

export type { SupportedLanguage } from '../types/ai.types.js';
