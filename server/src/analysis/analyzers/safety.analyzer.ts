// ─── Safety Analyzer ─────────────────────────────────────
// Detects infinite loop risks, unreachable code, and
// recursion without base case. All checks are deterministic.

import type {
  BlockTree,
  Block,
  LoopInfo,
  FunctionInfo,
  Diagnostic,
} from '../types.js';

// ─── Public API ──────────────────────────────────────────

/**
 * Detects safety issues: infinite loops, unreachable code,
 * and missing base cases in recursion.
 */
export function analyzeSafety(
  tree: BlockTree,
  loops: LoopInfo[],
  functions: FunctionInfo[]
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  detectInfiniteLoops(tree, loops, diagnostics);
  detectUnreachableCode(tree, diagnostics);
  detectMissingBaseCase(tree, functions, diagnostics);

  return diagnostics;
}

// ─── Infinite Loop Detection ─────────────────────────────

function detectInfiniteLoops(
  tree: BlockTree,
  loops: LoopInfo[],
  diagnostics: Diagnostic[]
): void {
  for (const loop of loops) {
    const block = tree.blocks[loop.blockIndex];
    if (!block) continue;

    // ── while(true) / while(1) / while True — without break
    if (loop.type === 'while' || loop.type === 'do_while') {
      const cond = loop.conditionText.trim().toLowerCase();
      const isTrueLiteral =
        cond === 'true' ||
        cond === '( true )' ||
        cond === '(true)' ||
        cond === '1' ||
        cond === '( 1 )' ||
        cond === '(1)';

      if (isTrueLiteral && !loop.hasBreak) {
        diagnostics.push({
          severity: 'error',
          category: 'infinite_loop',
          message: 'Infinite loop: while(true) without a break statement.',
          line: loop.line,
          guidance:
            'This loop will run forever because the condition is always true and there\'s no break. ' +
            'Add a break statement with a condition to exit the loop, or change the loop condition.',
        });
        continue;
      }
    }

    // ── while loop where condition variable is never modified in body
    if (loop.type === 'while' && !loop.hasBreak) {
      const conditionVars = extractConditionVariables(block.headerTokens);

      if (conditionVars.length > 0) {
        const bodyModifiedVars = extractModifiedVariables(block.bodyTokens);
        const anyCondVarModified = conditionVars.some((v) => bodyModifiedVars.has(v));

        if (!anyCondVarModified) {
          diagnostics.push({
            severity: 'warning',
            category: 'infinite_loop',
            message: `Potential infinite loop: condition variable(s) [${conditionVars.join(', ')}] not modified in loop body.`,
            line: loop.line,
            guidance:
              'The variables in your while-loop condition are never changed inside the loop. ' +
              'This means the condition will always be the same, causing an infinite loop. ' +
              'Make sure to update the condition variable inside the loop body.',
          });
        }
      }
    }

    // ── for loop where iterator isn't standard (might not terminate)
    if (loop.type === 'for' && loop.iteratorVar) {
      // Check for unusual patterns like for(i=0; i<n; i--)
      const headerStr = block.headerTokens.map((t) => t.value).join(' ');
      const hasDecrement = headerStr.includes('--') || headerStr.includes('-=');
      const hasLessThan = headerStr.includes('<');

      if (hasDecrement && hasLessThan) {
        diagnostics.push({
          severity: 'warning',
          category: 'infinite_loop',
          message: 'Suspicious loop: incrementing toward a less-than condition with decrement.',
          line: loop.line,
          guidance:
            'Your for-loop decrements the counter but uses a less-than condition. ' +
            'This will never terminate because the counter gets further from the bound. ' +
            'Check if you meant to use ++ instead of --, or > instead of <.',
        });
      }
    }
  }
}

// ─── Unreachable Code Detection ──────────────────────────

function detectUnreachableCode(tree: BlockTree, diagnostics: Diagnostic[]): void {
  for (const block of tree.blocks) {
    if (block.type === 'root') continue;

    const bodyTokens = block.bodyTokens;

    // Find early terminators: return, break, continue, throw
    let i = 0;
    while (i < bodyTokens.length) {
      const token = bodyTokens[i];

      if (
        token.type === 'keyword' &&
        ['return', 'break', 'continue', 'throw'].includes(token.value)
      ) {
        // Check if there's meaningful code on subsequent lines
        const terminatorLine = token.line;
        const codeAfter = bodyTokens.slice(i + 1).filter(
          (t) =>
            t.type !== 'newline' &&
            t.type !== 'eof' &&
            t.type !== 'whitespace' &&
            !(t.type === 'delimiter' && ['}', ')'].includes(t.value)) &&
            t.line > terminatorLine
        );

        if (codeAfter.length > 0) {
          // Make sure it's not in a nested block (like an if inside the current block)
          const afterLine = codeAfter[0].line;
          const isInNestedBlock = block.childIndices.some((ci) => {
            const child = tree.blocks[ci];
            return child && afterLine >= child.startLine && afterLine <= child.endLine;
          });

          if (!isInNestedBlock) {
            diagnostics.push({
              severity: 'warning',
              category: 'unreachable_code',
              message: `Unreachable code after '${token.value}' statement.`,
              line: afterLine,
              guidance:
                `Code after a ${token.value} statement will never execute. ` +
                'Either remove the unreachable code or restructure your logic ' +
                `so the ${token.value} is inside a conditional.`,
            });
          }
        }
        break; // Only report once per block
      }
      i++;
    }
  }
}

// ─── Missing Base Case in Recursion ──────────────────────

function detectMissingBaseCase(
  tree: BlockTree,
  functions: FunctionInfo[],
  diagnostics: Diagnostic[]
): void {
  const recursiveFns = functions.filter((f) => f.callsItself);

  for (const fn of recursiveFns) {
    const block = tree.blocks[fn.blockIndex];
    if (!block) continue;

    // A base case typically has: if/return before the recursive call
    // Check if there's a conditional (if) block as a child
    const hasConditionalChild = block.childIndices.some((ci) => {
      const child = tree.blocks[ci];
      return child && ['if_block'].includes(child.type);
    });

    // Check if there's a return before the recursive call
    const bodyTokens = block.bodyTokens;
    let firstRecursiveCallLine = -1;
    let hasReturnBefore = false;

    for (let i = 0; i < bodyTokens.length; i++) {
      const token = bodyTokens[i];

      if (token.type === 'keyword' && token.value === 'return') {
        if (firstRecursiveCallLine === -1) {
          hasReturnBefore = true;
        }
      }

      if (
        token.type === 'identifier' &&
        token.value === fn.name &&
        i + 1 < bodyTokens.length &&
        bodyTokens[i + 1].type === 'delimiter' &&
        bodyTokens[i + 1].value === '('
      ) {
        if (firstRecursiveCallLine === -1) {
          firstRecursiveCallLine = token.line;
        }
      }
    }

    if (!hasConditionalChild && !hasReturnBefore) {
      diagnostics.push({
        severity: 'error',
        category: 'no_base_case',
        message: `Recursive function '${fn.name}' may lack a base case.`,
        line: fn.startLine,
        guidance:
          'Every recursive function needs a base case — a condition where it stops calling itself ' +
          'and returns a value directly. Without one, the function will recurse infinitely and crash ' +
          'with a stack overflow. Add an if-statement that returns a value for the simplest input.',
      });
    }
  }
}

// ─── Helper Functions ────────────────────────────────────

/**
 * Extracts variable names from a condition expression (header tokens).
 */
function extractConditionVariables(headerTokens: { type: string; value: string }[]): string[] {
  const vars: string[] = [];
  let inParen = false;

  for (const token of headerTokens) {
    if (token.type === 'delimiter' && token.value === '(') { inParen = true; continue; }
    if (token.type === 'delimiter' && token.value === ')') { inParen = false; continue; }
    if (inParen && token.type === 'identifier') {
      vars.push(token.value);
    }
  }

  // If no parens found, just grab all identifiers from header
  if (vars.length === 0) {
    for (const token of headerTokens) {
      if (token.type === 'identifier' && !['while', 'for', 'do'].includes(token.value)) {
        vars.push(token.value);
      }
    }
  }

  return [...new Set(vars)];
}

/**
 * Extracts variable names that are modified (assigned to) in a token list.
 */
function extractModifiedVariables(tokens: { type: string; value: string }[]): Set<string> {
  const modified = new Set<string>();

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // identifier followed by assignment operator
    if (
      token.type === 'identifier' &&
      i + 1 < tokens.length &&
      tokens[i + 1].type === 'operator' &&
      ['=', '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '|=', '^='].includes(tokens[i + 1].value)
    ) {
      modified.add(token.value);
    }

    // identifier preceded by ++ or --
    if (
      token.type === 'operator' &&
      (token.value === '++' || token.value === '--')
    ) {
      if (i > 0 && tokens[i - 1].type === 'identifier') {
        modified.add(tokens[i - 1].value);
      }
      if (i + 1 < tokens.length && tokens[i + 1].type === 'identifier') {
        modified.add(tokens[i + 1].value);
      }
    }
  }

  return modified;
}
