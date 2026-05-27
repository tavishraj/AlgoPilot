// ─── Block Parser ────────────────────────────────────────
// Builds a BlockTree (lightweight AST) from a token stream.
// For brace languages: tracks {/} depth.
// For Python: tracks indentation levels.
// Extracts FunctionInfo, LoopInfo, VariableInfo per scope.

import type {
  Token,
  Block,
  BlockType,
  BlockTree,
  FunctionInfo,
  LoopInfo,
  VariableInfo,
  SupportedLanguage,
  LangConfig,
} from '../types.js';
import { getLangConfig } from '../lang/index.js';

// ─── Public API ──────────────────────────────────────────

/**
 * Parses a token stream into a BlockTree.
 * Handles both brace-based and indentation-based languages.
 */
export function parseBlocks(tokens: Token[], language: SupportedLanguage): BlockTree {
  const config = getLangConfig(language);

  const root: Block = {
    type: 'root',
    depth: 0,
    parentIndex: -1,
    childIndices: [],
    headerTokens: [],
    bodyTokens: [],
    startLine: 1,
    endLine: getMaxLine(tokens),
    label: 'root',
  };

  const blocks: Block[] = [root];

  parseBraceBlocks(tokens, blocks, config);

  return { blocks, tokens, language };
}

/**
 * Extracts function information from the block tree.
 */
export function extractFunctions(tree: BlockTree): FunctionInfo[] {
  const functions: FunctionInfo[] = [];

  for (let i = 0; i < tree.blocks.length; i++) {
    const block = tree.blocks[i];
    if (block.type !== 'function') continue;

    const name = block.label || 'anonymous';
    const params = extractParams(block.headerTokens);
    const calledFunctions = extractCalledFunctions(block.bodyTokens);
    const callsItself = calledFunctions.includes(name);
    const hasReturn = block.bodyTokens.some(
      (t) => t.type === 'keyword' && t.value === 'return'
    );

    functions.push({
      name,
      params,
      startLine: block.startLine,
      endLine: block.endLine,
      callsItself,
      calledFunctions,
      hasReturn,
      blockIndex: i,
    });
  }

  return functions;
}

/**
 * Extracts loop information from the block tree.
 */
export function extractLoops(tree: BlockTree): LoopInfo[] {
  const loops: LoopInfo[] = [];

  for (let i = 0; i < tree.blocks.length; i++) {
    const block = tree.blocks[i];
    if (!isLoopBlock(block)) continue;

    const conditionText = block.headerTokens
      .filter((t) => t.type !== 'keyword' || !['for', 'while', 'do'].includes(t.value))
      .map((t) => t.value)
      .join(' ')
      .trim();

    const hasBreak = block.bodyTokens.some(
      (t) => t.type === 'keyword' && t.value === 'break'
    );
    const hasContinue = block.bodyTokens.some(
      (t) => t.type === 'keyword' && t.value === 'continue'
    );

    const iteratorVar = extractIteratorVar(block.headerTokens, tree.language);
    const iteratorMutated = iteratorVar
      ? block.bodyTokens.some(
          (t) => t.type === 'identifier' && t.value === iteratorVar
        ) && block.bodyTokens.some(
          (t) => t.type === 'operator' && ['++', '--', '+=', '-=', '*=', '/=', '='].includes(t.value)
        )
      : false;

    const nestingLevel = countLoopAncestors(i, tree.blocks);

    loops.push({
      type: mapLoopType(block.type),
      nestingLevel,
      hasBreak,
      hasContinue,
      conditionText,
      iteratorVar: iteratorVar || undefined,
      iteratorMutated,
      blockIndex: i,
      line: block.startLine,
    });
  }

  return loops;
}

/**
 * Extracts variable declarations from the block tree.
 */
export function extractVariables(tree: BlockTree): VariableInfo[] {
  const config = getLangConfig(tree.language);
  const variables: VariableInfo[] = [];
  const allTokens = tree.tokens.filter((t) => t.type !== 'newline' && t.type !== 'eof');

  for (let i = 0; i < allTokens.length; i++) {
    const token = allTokens[i];

    // Check for declaration keyword followed by identifier
    if (config.declarationKeywords.includes(token.value) && i + 1 < allTokens.length) {
      const next = allTokens[i + 1];
      if (next.type === 'identifier') {
        const name = next.value;
        const isUsed = allTokens.some(
          (t, j) => j !== i + 1 && t.type === 'identifier' && t.value === name
        );
        const isMutated = allTokens.some(
          (t, j) =>
            j > i + 1 &&
            t.type === 'identifier' &&
            t.value === name &&
            j + 1 < allTokens.length &&
            allTokens[j + 1].type === 'operator' &&
            ['=', '+=', '-=', '*=', '/=', '++', '--'].includes(allTokens[j + 1].value)
        );

        variables.push({
          name,
          line: next.line,
          isUsed,
          isMutated,
          scopeDepth: 0,
        });
      }
    }

    // Python: assignment is declaration (simple heuristic)
    if (
      config.language === 'python' &&
      token.type === 'identifier' &&
      i + 1 < allTokens.length &&
      allTokens[i + 1].type === 'operator' &&
      allTokens[i + 1].value === '=' &&
      (i === 0 || allTokens[i - 1].type === 'newline' || allTokens[i - 1].type === 'delimiter')
    ) {
      const name = token.value;
      // Avoid duplicates
      if (!variables.some((v) => v.name === name)) {
        const isUsed = allTokens.some(
          (t, j) => j !== i && t.type === 'identifier' && t.value === name
        );
        variables.push({ name, line: token.line, isUsed, isMutated: true, scopeDepth: 0 });
      }
    }
  }

  return variables;
}

// ─── Brace-Based Block Parsing ───────────────────────────

function parseBraceBlocks(tokens: Token[], blocks: Block[], config: LangConfig): void {
  const blockStack: number[] = [0]; // Stack of block indices
  let headerBuffer: Token[] = [];
  let pendingType: BlockType = 'generic_block';
  let pendingLabel: string | undefined;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'newline' || token.type === 'eof') continue;

    // Detect block type from keywords
    if (token.type === 'keyword') {
      const blockTypeInfo = classifyKeyword(token.value, config);
      if (blockTypeInfo) {
        pendingType = blockTypeInfo;
        headerBuffer = [token];

        // Try to extract label (function name, class name)
        if (blockTypeInfo === 'function' || blockTypeInfo === 'class') {
          const nameToken = findNextIdentifier(tokens, i + 1);
          pendingLabel = nameToken?.value;
        }
        continue;
      }
    }

    // Open brace: start new block
    if (token.type === 'delimiter' && token.value === '{') {
      const parentIdx = blockStack[blockStack.length - 1];
      
      let resolvedType = pendingType;
      let resolvedLabel = pendingLabel;
      let resolvedHeader = [...headerBuffer];

      if ((resolvedType === 'generic_block' || resolvedType === 'function') && (config.language === 'javascript' || config.language === 'typescript')) {
        const sig = detectFunctionSignature(tokens, i);
        if (sig.isFunction) {
          resolvedType = 'function';
          if (sig.name) resolvedLabel = sig.name;
          resolvedHeader = tokens.slice(sig.startIndex, i);
        }
      }

      const newBlock: Block = {
        type: resolvedType,
        depth: blockStack.length,
        parentIndex: parentIdx,
        childIndices: [],
        headerTokens: resolvedHeader,
        bodyTokens: [],
        startLine: resolvedHeader.length > 0 ? resolvedHeader[0].line : token.line,
        endLine: token.line,
        label: resolvedLabel,
      };

      const newIdx = blocks.length;
      blocks.push(newBlock);
      blocks[parentIdx].childIndices.push(newIdx);
      blockStack.push(newIdx);

      // Reset pending
      headerBuffer = [];
      pendingType = 'generic_block';
      pendingLabel = undefined;
      continue;
    }

    // Close brace: end current block
    if (token.type === 'delimiter' && token.value === '}') {
      if (blockStack.length > 1) {
        const closingIdx = blockStack.pop()!;
        blocks[closingIdx].endLine = token.line;
      }
      continue;
    }

    // Accumulate header tokens if we're between a keyword and {
    if (headerBuffer.length > 0) {
      headerBuffer.push(token);
    }

    // Add token to current block's body
    const currentIdx = blockStack[blockStack.length - 1];
    blocks[currentIdx].bodyTokens.push(token);
  }
}


// ─── Helper Functions ────────────────────────────────────

function classifyKeyword(keyword: string, config: LangConfig): BlockType | null {
  if (config.loopKeywords.has(keyword)) {
    if (keyword === 'for') return 'for_loop';
    if (keyword === 'while') return 'while_loop';
    if (keyword === 'do') return 'do_while_loop';
  }
  if (config.functionKeywords.has(keyword)) return 'function';
  if (keyword === 'if') return 'if_block';
  if (keyword === 'else') return 'else_block';
  if (keyword === 'elif') return 'elif_block';
  if (keyword === 'switch') return 'switch_block';
  if (keyword === 'try') return 'try_block';
  if (keyword === 'catch' || keyword === 'except') return 'catch_block';
  if (config.classKeywords.has(keyword)) return 'class';
  return null;
}

function detectFunctionSignature(tokens: Token[], braceIdx: number): { isFunction: boolean; name?: string; startIndex: number } {
  let i = braceIdx - 1;
  while (i >= 0 && (tokens[i].type === 'newline' || tokens[i].type === 'whitespace' || tokens[i].type === 'comment')) {
    i--;
  }

  if (i < 0) return { isFunction: false, startIndex: 0 };

  const lastToken = tokens[i];

  // Pattern 1: Arrow function `=> {`
  if (lastToken.type === 'operator' && lastToken.value === '=>') {
    const { name, startIndex } = findAssignedName(tokens, i);
    return { isFunction: true, name, startIndex };
  }

  // Pattern 2: `function (...) {` or `method(...) {`
  if (lastToken.type === 'delimiter' && lastToken.value === ')') {
    let parens = 1;
    let j = i - 1;
    while (j >= 0 && parens > 0) {
      if (tokens[j].type === 'delimiter' && tokens[j].value === ')') parens++;
      if (tokens[j].type === 'delimiter' && tokens[j].value === '(') parens--;
      j--;
    }

    while (j >= 0 && (tokens[j].type === 'newline' || tokens[j].type === 'whitespace')) j--;

    if (j >= 0) {
      if (tokens[j].type === 'keyword' && tokens[j].value === 'function') {
        const { name, startIndex } = findAssignedName(tokens, j);
        return { isFunction: true, name, startIndex };
      }

      if (tokens[j].type === 'identifier') {
        const name = tokens[j].value;
        let k = j - 1;
        while (k >= 0 && (tokens[k].type === 'newline' || tokens[k].type === 'whitespace')) k--;
        
        let startIndex = j;
        if (k >= 0 && tokens[k].type === 'keyword' && tokens[k].value === 'function') {
           startIndex = k;
           const assigned = findAssignedName(tokens, k);
           return { isFunction: true, name: assigned.name || name, startIndex: assigned.startIndex };
        }
        
        return { isFunction: true, name, startIndex };
      }
    }
  }

  return { isFunction: false, startIndex: 0 };
}

function findAssignedName(tokens: Token[], endIdx: number): { name?: string; startIndex: number } {
  let i = endIdx - 1;
  let startIndex = endIdx;
  let name: string | undefined;

  while (i >= 0) {
    const t = tokens[i];
    if (t.type === 'delimiter' && t.value === '{') break;
    if (t.type === 'delimiter' && t.value === ';') break;
    
    if (t.type === 'operator' && (t.value === '=' || t.value === ':')) {
      let j = i - 1;
      while (j >= 0 && (tokens[j].type === 'newline' || tokens[j].type === 'whitespace')) j--;
      if (j >= 0 && tokens[j].type === 'identifier') {
        name = tokens[j].value;
        startIndex = j;
        let k = j - 1;
        while (k >= 0 && (tokens[k].type === 'newline' || tokens[k].type === 'whitespace')) k--;
        while (k >= 0 && tokens[k].type === 'keyword' && ['let', 'const', 'var', 'export', 'async'].includes(tokens[k].value)) {
          startIndex = k;
          k--;
          while (k >= 0 && (tokens[k].type === 'newline' || tokens[k].type === 'whitespace')) k--;
        }
      }
      break;
    }
    i--;
  }

  if (!name) {
    let j = endIdx - 1;
    while (j >= 0 && (tokens[j].type === 'newline' || tokens[j].type === 'whitespace')) j--;
    if (j >= 0 && tokens[j].type === 'identifier' && endIdx > 0 && tokens[endIdx].type === 'operator' && tokens[endIdx].value === '=>') {
         startIndex = j;
    } else {
        let parens = 0;
        let k = endIdx;
        while (k >= 0) {
          if (tokens[k].type === 'delimiter' && tokens[k].value === ')') parens++;
          if (tokens[k].type === 'delimiter' && tokens[k].value === '(') parens--;
          if (parens === 0 && tokens[k].value === '(') {
            startIndex = k;
            break;
          }
          k--;
        }
    }
  }

  return { name, startIndex };
}

function findNextIdentifier(tokens: Token[], startIdx: number): Token | null {
  for (let i = startIdx; i < tokens.length && i < startIdx + 5; i++) {
    if (tokens[i].type === 'identifier') return tokens[i];
    if (tokens[i].type === 'delimiter' && tokens[i].value === '{') break;
  }
  return null;
}

function extractParams(headerTokens: Token[]): string[] {
  const params: string[] = [];
  let inParens = false;
  let seenParens = false;

  for (const token of headerTokens) {
    if (token.type === 'delimiter' && token.value === '(') {
      inParens = true;
      seenParens = true;
      continue;
    }
    if (token.type === 'delimiter' && token.value === ')') {
      inParens = false;
      continue; // keep iterating in case there are multiple paren groups (unlikely in headers)
    }
    if (inParens && token.type === 'identifier') {
      params.push(token.value);
    }
  }

  // Fallback for single-param arrow functions like `x => {`
  if (!seenParens && headerTokens.length >= 2) {
    const last = headerTokens[headerTokens.length - 1];
    if (last.type === 'operator' && last.value === '=>') {
       const prev = headerTokens[headerTokens.length - 2];
       if (prev.type === 'identifier') {
         params.push(prev.value);
       }
    }
  }

  return params;
}

function extractCalledFunctions(bodyTokens: Token[]): string[] {
  const calls: string[] = [];

  for (let i = 0; i < bodyTokens.length - 1; i++) {
    if (
      bodyTokens[i].type === 'identifier' &&
      bodyTokens[i + 1].type === 'delimiter' &&
      bodyTokens[i + 1].value === '('
    ) {
      calls.push(bodyTokens[i].value);
    }
  }

  return [...new Set(calls)];
}

function extractIteratorVar(headerTokens: Token[], language: SupportedLanguage): string | null {
  if (language === 'python') {
    // for VAR in ...
    const forIdx = headerTokens.findIndex((t) => t.value === 'for');
    if (forIdx >= 0 && forIdx + 1 < headerTokens.length) {
      const next = headerTokens[forIdx + 1];
      if (next.type === 'identifier') return next.value;
    }
    return null;
  }

  // C-style: for (let VAR = ...; ...; ...)
  // Look for first identifier after opening paren or declaration keyword
  let seenParen = false;
  for (const token of headerTokens) {
    if (token.type === 'delimiter' && token.value === '(') {
      seenParen = true;
      continue;
    }
    if (seenParen && token.type === 'identifier') {
      return token.value;
    }
    if (token.type === 'keyword' && ['let', 'var', 'const', 'int', 'long', 'auto'].includes(token.value)) {
      continue; // skip declaration keyword
    }
  }
  return null;
}

function isLoopBlock(block: Block): boolean {
  return ['for_loop', 'while_loop', 'do_while_loop'].includes(block.type);
}

function mapLoopType(blockType: BlockType): LoopInfo['type'] {
  switch (blockType) {
    case 'for_loop': return 'for';
    case 'while_loop': return 'while';
    case 'do_while_loop': return 'do_while';
    default: return 'for';
  }
}

function countLoopAncestors(blockIndex: number, blocks: Block[]): number {
  let count = 1; // Count self
  let current = blocks[blockIndex].parentIndex;
  while (current > 0) {
    if (isLoopBlock(blocks[current])) count++;
    current = blocks[current].parentIndex;
  }
  return count;
}

function getMaxLine(tokens: Token[]): number {
  let max = 1;
  for (const t of tokens) {
    if (t.line > max) max = t.line;
  }
  return max;
}


