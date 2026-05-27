// ─── Universal Tokenizer ─────────────────────────────────
// Character-state-machine tokenizer that works across all
// 5 supported languages. Strips comments, preserves strings
// as single tokens, and classifies all tokens with position.
// No regex engine — pure character iteration for speed.

import type { Token, TokenType, SupportedLanguage, LangConfig } from '../types.js';
import { getLangConfig } from '../lang/index.js';

// ─── Tokenizer State ─────────────────────────────────────

interface TokenizerState {
  code: string;
  pos: number;
  line: number;
  col: number;
  config: LangConfig;
  tokens: Token[];
}

// ─── Public API ──────────────────────────────────────────

/**
 * Tokenizes source code into a flat Token array.
 * Strips comments, preserves strings, classifies keywords.
 * Returns tokens with line/col positions.
 */
export function tokenize(code: string, language: SupportedLanguage): Token[] {
  const config = getLangConfig(language);
  const state: TokenizerState = {
    code,
    pos: 0,
    line: 1,
    col: 1,
    config,
    tokens: [],
  };

  while (state.pos < state.code.length) {
    const ch = state.code[state.pos];

    // ── Newlines
    if (ch === '\n') {
      pushToken(state, 'newline', '\n');
      state.line++;
      state.col = 1;
      state.pos++;
      continue;
    }

    // ── Carriage return (skip, handled with \n)
    if (ch === '\r') {
      state.pos++;
      continue;
    }

    // ── Whitespace (non-newline)
    if (ch === ' ' || ch === '\t') {
      state.pos++;
      state.col++;
      continue;
    }

    // ── Comments
    if (trySkipComment(state)) continue;

    // ── String literals
    if (tryReadString(state)) continue;

    // ── Numbers
    if (isDigit(ch) || (ch === '.' && state.pos + 1 < state.code.length && isDigit(state.code[state.pos + 1]))) {
      readNumber(state);
      continue;
    }

    // ── Multi-character operators
    if (tryReadOperator(state)) continue;

    // ── Delimiters
    if (isDelimiter(ch)) {
      pushToken(state, 'delimiter', ch);
      state.pos++;
      state.col++;
      continue;
    }

    // ── Single-character operators
    if (isOperatorChar(ch)) {
      pushToken(state, 'operator', ch);
      state.pos++;
      state.col++;
      continue;
    }

    // ── Identifiers and keywords
    if (isIdentStart(ch)) {
      readIdentifier(state);
      continue;
    }

    // ── Unknown character — skip
    state.pos++;
    state.col++;
  }

  pushToken(state, 'eof', '');
  
  if (config.usesIndentation) {
    return normalizeIndentation(state.tokens);
  }
  return state.tokens;
}

// ─── Indentation Normalization ───────────────────────────

function groupTokensByLine(tokens: Token[]): Token[][] {
  const groups: Map<number, Token[]> = new Map();
  for (const token of tokens) {
    if (token.type === 'eof') continue;
    if (!groups.has(token.line)) groups.set(token.line, []);
    groups.get(token.line)!.push(token);
  }
  return [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([, tokens]) => tokens);
}

function normalizeIndentation(tokens: Token[]): Token[] {
  const lines = groupTokensByLine(tokens);
  const result: Token[] = [];
  const indentStack: number[] = [-1];

  for (const lineTokens of lines) {
    if (lineTokens.length === 0) continue;

    const firstNonWs = lineTokens.find((t) => t.type !== 'newline' && t.type !== 'eof');
    if (!firstNonWs) {
      result.push(...lineTokens);
      continue;
    }

    const indent = firstNonWs.col - 1;

    // Pop blocks that have been de-indented out of
    while (indentStack.length > 1 && indent <= indentStack[indentStack.length - 1]) {
      indentStack.pop();
      result.push({ type: 'delimiter', value: '}', line: firstNonWs.line, col: 1 });
    }

    // Check if this line ends with a colon (ignoring trailing newlines/eof)
    let lastToken = lineTokens[lineTokens.length - 1];
    if (lastToken.type === 'newline' || lastToken.type === 'eof') {
      lastToken = lineTokens.length > 1 ? lineTokens[lineTokens.length - 2] : lastToken;
    }
      
    const endsWithColon = lastToken.type === 'operator' && lastToken.value === ':';

    // Output the current line's tokens
    for (const t of lineTokens) {
      result.push(t);
      if (t === lastToken && endsWithColon) {
         // Insert virtual '{' immediately after ':'
         result.push({ type: 'delimiter', value: '{', line: lastToken.line, col: lastToken.col + 1 });
         indentStack.push(indent);
      }
    }
  }

  // Close any remaining blocks at the EOF
  const maxLine = tokens.length > 0 ? tokens[tokens.length - 1].line : 1;
  while (indentStack.length > 1) {
    indentStack.pop();
    result.push({ type: 'delimiter', value: '}', line: maxLine, col: 1 });
  }

  // Ensure EOF token is preserved at the very end
  const eof = tokens.find((t) => t.type === 'eof');
  if (eof) result.push(eof);

  return result;
}

// ─── Comment Handling ────────────────────────────────────

function trySkipComment(state: TokenizerState): boolean {
  const { code, pos, config } = state;

  // Python # comments
  if (config.singleLineComment === '#' && code[pos] === '#') {
    skipToEndOfLine(state);
    return true;
  }

  // C-style // comments
  if (config.singleLineComment === '//' && code[pos] === '/' && code[pos + 1] === '/') {
    skipToEndOfLine(state);
    return true;
  }

  // C-style /* */ block comments
  if (config.multiLineComment && code[pos] === '/' && code[pos + 1] === '*') {
    state.pos += 2;
    state.col += 2;
    while (state.pos < code.length) {
      if (code[state.pos] === '\n') {
        state.line++;
        state.col = 1;
        state.pos++;
      } else if (code[state.pos] === '*' && code[state.pos + 1] === '/') {
        state.pos += 2;
        state.col += 2;
        break;
      } else {
        state.pos++;
        state.col++;
      }
    }
    return true;
  }

  // Python triple-quote strings used as comments (docstrings)
  if (config.language === 'python') {
    const triple = code.slice(pos, pos + 3);
    if (triple === '"""' || triple === "'''") {
      const closer = triple;
      state.pos += 3;
      state.col += 3;
      while (state.pos < code.length) {
        if (code.slice(state.pos, state.pos + 3) === closer) {
          state.pos += 3;
          state.col += 3;
          break;
        }
        if (code[state.pos] === '\n') {
          state.line++;
          state.col = 1;
        } else {
          state.col++;
        }
        state.pos++;
      }
      return true;
    }
  }

  return false;
}

function skipToEndOfLine(state: TokenizerState): void {
  while (state.pos < state.code.length && state.code[state.pos] !== '\n') {
    state.pos++;
  }
}

// ─── String Handling ─────────────────────────────────────

function tryReadString(state: TokenizerState): boolean {
  const ch = state.code[state.pos];

  // Standard quotes
  if (ch === '"' || ch === "'") {
    readQuotedString(state, ch);
    return true;
  }

  // Template literals (JS/TS)
  if (ch === '`' && (state.config.language === 'javascript' || state.config.language === 'typescript')) {
    readQuotedString(state, '`');
    return true;
  }

  return false;
}

function readQuotedString(state: TokenizerState, quote: string): void {
  const startLine = state.line;
  const startCol = state.col;
  let value = quote;
  state.pos++;
  state.col++;

  while (state.pos < state.code.length) {
    const ch = state.code[state.pos];

    // Escape character
    if (ch === '\\') {
      value += ch;
      state.pos++;
      state.col++;
      if (state.pos < state.code.length) {
        value += state.code[state.pos];
        state.pos++;
        state.col++;
      }
      continue;
    }

    // End of string
    if (ch === quote) {
      value += ch;
      state.pos++;
      state.col++;
      break;
    }

    // Newline in string
    if (ch === '\n') {
      value += ch;
      state.line++;
      state.col = 1;
      state.pos++;
      continue;
    }

    value += ch;
    state.pos++;
    state.col++;
  }

  state.tokens.push({ type: 'string', value, line: startLine, col: startCol });
}

// ─── Number Handling ─────────────────────────────────────

function readNumber(state: TokenizerState): void {
  const startCol = state.col;
  let value = '';

  while (state.pos < state.code.length) {
    const ch = state.code[state.pos];
    if (isDigit(ch) || ch === '.' || ch === 'e' || ch === 'E' || ch === 'x' || ch === 'X' ||
        ch === 'b' || ch === 'B' || ch === 'o' || ch === 'O' ||
        (value.length > 0 && (ch === '+' || ch === '-') && (value.endsWith('e') || value.endsWith('E'))) ||
        (value.startsWith('0x') && isHexDigit(ch)) ||
        ch === '_') {
      value += ch;
      state.pos++;
      state.col++;
    } else {
      break;
    }
  }

  state.tokens.push({ type: 'number', value, line: state.line, col: startCol });
}

// ─── Operator Handling ───────────────────────────────────

const MULTI_CHAR_OPS = [
  '>>>=', '===', '!==', '>>>', '<<=', '>>=', '**=',
  '==', '!=', '<=', '>=', '&&', '||', '++', '--',
  '+=', '-=', '*=', '/=', '%=', '**', '<<', '>>', '??',
  '=>', '::',  '->', '...',
];

function tryReadOperator(state: TokenizerState): boolean {
  const { code, pos } = state;
  const remaining = code.length - pos;

  // Try longest match first
  for (const op of MULTI_CHAR_OPS) {
    if (op.length <= remaining && code.slice(pos, pos + op.length) === op) {
      pushToken(state, 'operator', op);
      state.pos += op.length;
      state.col += op.length;
      return true;
    }
  }

  return false;
}

// ─── Identifier Handling ─────────────────────────────────

function readIdentifier(state: TokenizerState): void {
  const startCol = state.col;
  let value = '';

  while (state.pos < state.code.length) {
    const ch = state.code[state.pos];
    if (isIdentChar(ch)) {
      value += ch;
      state.pos++;
      state.col++;
    } else {
      break;
    }
  }

  // Check for Python's multi-word keywords
  if (state.config.language === 'python' && value === 'is' && state.pos < state.code.length) {
    // Check for "is not"
    const rest = state.code.slice(state.pos).match(/^\s+not\b/);
    if (rest) {
      value = 'is not';
      state.pos += rest[0].length;
      state.col += rest[0].length;
    }
  }

  const tokenType: TokenType = state.config.keywords.has(value) ? 'keyword' : 'identifier';
  state.tokens.push({ type: tokenType, value, line: state.line, col: startCol });
}

// ─── Helper Functions ────────────────────────────────────

function pushToken(state: TokenizerState, type: TokenType, value: string): void {
  state.tokens.push({ type, value, line: state.line, col: state.col });
}

function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

function isHexDigit(ch: string): boolean {
  return isDigit(ch) || (ch >= 'a' && ch <= 'f') || (ch >= 'A' && ch <= 'F');
}

function isIdentStart(ch: string): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_' || ch === '$';
}

function isIdentChar(ch: string): boolean {
  return isIdentStart(ch) || isDigit(ch);
}

function isDelimiter(ch: string): boolean {
  return '(){}[];,.'.includes(ch);
}

function isOperatorChar(ch: string): boolean {
  return '+-*/%=<>!&|^~?:@#'.includes(ch);
}
