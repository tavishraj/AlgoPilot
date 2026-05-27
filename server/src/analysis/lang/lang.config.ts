// ─── Per-Language Configuration ──────────────────────────
// Centralized language-specific keyword sets, comment syntax,
// block delimiter rules, and pattern recognition data.
// Single source of truth for all language-aware analysis.

import type { LangConfig, SupportedLanguage } from '../types.js';

// ─── JavaScript Configuration ────────────────────────────

const javascript: LangConfig = {
  language: 'javascript',
  keywords: new Set([
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger',
    'default', 'delete', 'do', 'else', 'export', 'extends', 'false',
    'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof',
    'let', 'new', 'null', 'of', 'return', 'super', 'switch', 'this',
    'throw', 'true', 'try', 'typeof', 'undefined', 'var', 'void',
    'while', 'with', 'yield', 'async', 'await',
  ]),
  loopKeywords: new Set(['for', 'while', 'do']),
  functionKeywords: new Set(['function']),
  conditionalKeywords: new Set(['if', 'else', 'switch', 'case']),
  classKeywords: new Set(['class']),
  singleLineComment: '//',
  multiLineComment: ['/*', '*/'],
  usesBraces: true,
  usesIndentation: false,
  dataStructurePatterns: [
    { name: 'Map', type: 'hash_map', patterns: ['Map', 'Object.create'] },
    { name: 'Set', type: 'set', patterns: ['Set'] },
    { name: 'Array', type: 'array', patterns: ['Array', '[]'] },
  ],
  sortPatterns: ['.sort(', '.toSorted('],
  declarationKeywords: ['const', 'let', 'var'],
  assignmentOps: ['=', '+=', '-=', '*=', '/='],
  equalityOps: ['===', '==', '!==', '!='],
  assignmentVsEquality: { assignment: '=', equality: ['===', '=='] },
};

// ─── TypeScript Configuration ────────────────────────────

const typescript: LangConfig = {
  ...javascript,
  language: 'typescript',
  keywords: new Set([
    ...javascript.keywords,
    'abstract', 'as', 'declare', 'enum', 'implements', 'interface',
    'module', 'namespace', 'never', 'private', 'protected', 'public',
    'readonly', 'static', 'type', 'unknown', 'any', 'number', 'string',
    'boolean', 'symbol', 'bigint', 'object', 'keyof', 'infer', 'satisfies',
  ]),
  dataStructurePatterns: [
    { name: 'Map', type: 'hash_map', patterns: ['Map', 'Record'] },
    { name: 'Set', type: 'set', patterns: ['Set'] },
    { name: 'Array', type: 'array', patterns: ['Array', '[]'] },
  ],
};

// ─── Python Configuration ────────────────────────────────

const python: LangConfig = {
  language: 'python',
  keywords: new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
    'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
    'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
    'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
    'try', 'while', 'with', 'yield',
  ]),
  loopKeywords: new Set(['for', 'while']),
  functionKeywords: new Set(['def']),
  conditionalKeywords: new Set(['if', 'elif', 'else']),
  classKeywords: new Set(['class']),
  singleLineComment: '#',
  multiLineComment: null,  // Python uses ''' or """ but they're strings, not true block comments
  usesBraces: true,        // Virtually converted by tokenizer
  usesIndentation: true,
  dataStructurePatterns: [
    { name: 'dict', type: 'hash_map', patterns: ['dict', '{}'] },
    { name: 'set', type: 'set', patterns: ['set('] },
    { name: 'list', type: 'array', patterns: ['list', '[]'] },
    { name: 'deque', type: 'queue', patterns: ['deque'] },
    { name: 'heapq', type: 'heap', patterns: ['heapq', 'heappush', 'heappop'] },
    { name: 'defaultdict', type: 'hash_map', patterns: ['defaultdict'] },
    { name: 'Counter', type: 'hash_map', patterns: ['Counter'] },
  ],
  sortPatterns: ['.sort(', 'sorted('],
  declarationKeywords: [],  // Python has no declaration keywords
  assignmentOps: ['=', '+=', '-=', '*=', '/=', '//=', '**='],
  equalityOps: ['==', '!=', 'is', 'is not'],
  assignmentVsEquality: null,  // Python doesn't confuse = and == easily
};

// ─── Java Configuration ──────────────────────────────────

const java: LangConfig = {
  language: 'java',
  keywords: new Set([
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch',
    'char', 'class', 'const', 'continue', 'default', 'do', 'double',
    'else', 'enum', 'extends', 'false', 'final', 'finally', 'float',
    'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int',
    'interface', 'long', 'native', 'new', 'null', 'package', 'private',
    'protected', 'public', 'return', 'short', 'static', 'strictfp',
    'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
    'transient', 'true', 'try', 'void', 'volatile', 'while', 'var',
  ]),
  loopKeywords: new Set(['for', 'while', 'do']),
  functionKeywords: new Set([]),  // Java uses return-type + name pattern
  conditionalKeywords: new Set(['if', 'else', 'switch', 'case']),
  classKeywords: new Set(['class', 'interface', 'enum']),
  singleLineComment: '//',
  multiLineComment: ['/*', '*/'],
  usesBraces: true,
  usesIndentation: false,
  dataStructurePatterns: [
    { name: 'HashMap', type: 'hash_map', patterns: ['HashMap', 'TreeMap', 'LinkedHashMap', 'Hashtable'] },
    { name: 'HashSet', type: 'set', patterns: ['HashSet', 'TreeSet', 'LinkedHashSet'] },
    { name: 'ArrayList', type: 'array', patterns: ['ArrayList', 'LinkedList', 'Vector'] },
    { name: 'Stack', type: 'stack', patterns: ['Stack', 'ArrayDeque'] },
    { name: 'Queue', type: 'queue', patterns: ['Queue', 'PriorityQueue', 'Deque', 'ArrayDeque', 'LinkedList'] },
  ],
  sortPatterns: ['Arrays.sort(', 'Collections.sort(', '.sort('],
  declarationKeywords: ['int', 'long', 'double', 'float', 'char', 'boolean', 'byte', 'short', 'String', 'var'],
  assignmentOps: ['=', '+=', '-=', '*=', '/=', '%='],
  equalityOps: ['==', '!='],
  assignmentVsEquality: { assignment: '=', equality: ['=='] },
};

// ─── C++ Configuration ───────────────────────────────────

const cpp: LangConfig = {
  language: 'cpp',
  keywords: new Set([
    'alignas', 'alignof', 'and', 'asm', 'auto', 'bool', 'break', 'case',
    'catch', 'char', 'class', 'const', 'constexpr', 'continue', 'decltype',
    'default', 'delete', 'do', 'double', 'dynamic_cast', 'else', 'enum',
    'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend',
    'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new',
    'noexcept', 'not', 'nullptr', 'operator', 'or', 'private', 'protected',
    'public', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
    'static_cast', 'struct', 'switch', 'template', 'this', 'throw', 'true',
    'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using',
    'virtual', 'void', 'volatile', 'while', 'string', 'vector', 'map',
    'set', 'pair', 'cout', 'cin', 'endl', 'include',
  ]),
  loopKeywords: new Set(['for', 'while', 'do']),
  functionKeywords: new Set([]),  // C++ uses return-type + name pattern
  conditionalKeywords: new Set(['if', 'else', 'switch', 'case']),
  classKeywords: new Set(['class', 'struct']),
  singleLineComment: '//',
  multiLineComment: ['/*', '*/'],
  usesBraces: true,
  usesIndentation: false,
  dataStructurePatterns: [
    { name: 'unordered_map', type: 'hash_map', patterns: ['unordered_map', 'map'] },
    { name: 'unordered_set', type: 'set', patterns: ['unordered_set', 'set'] },
    { name: 'vector', type: 'array', patterns: ['vector', 'array'] },
    { name: 'stack', type: 'stack', patterns: ['stack'] },
    { name: 'queue', type: 'queue', patterns: ['queue', 'deque', 'priority_queue'] },
  ],
  sortPatterns: ['sort(', 'std::sort('],
  declarationKeywords: ['int', 'long', 'double', 'float', 'char', 'bool', 'short', 'unsigned', 'auto', 'string', 'void'],
  assignmentOps: ['=', '+=', '-=', '*=', '/=', '%='],
  equalityOps: ['==', '!='],
  assignmentVsEquality: { assignment: '=', equality: ['=='] },
};

// ─── Configuration Registry ──────────────────────────────

const LANG_CONFIGS: Record<SupportedLanguage, LangConfig> = {
  javascript,
  typescript,
  python,
  java,
  cpp,
};

/**
 * Returns the language configuration for the given language.
 */
export function getLangConfig(language: SupportedLanguage): LangConfig {
  return LANG_CONFIGS[language];
}

export { LANG_CONFIGS };
