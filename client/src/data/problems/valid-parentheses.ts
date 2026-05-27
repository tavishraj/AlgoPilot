import type { Problem } from '@/types/problem';

export const validParentheses: Problem = {
  id: 'prob_003',
  title: 'Valid Parentheses',
  slug: 'valid-parentheses',
  order: 3,
  difficulty: 'EASY',
  status: 'PUBLISHED',
  category: 'Stacks',
  tags: ['Stack', 'String'],

  description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:

1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,

  constraints: [
    { description: '1 ≤ s.length ≤ 10⁴' },
    { description: 's consists of parentheses only: \'()[]{}\'.' },
  ],

  examples: [
    {
      input: 's = "()"',
      output: 'true',
    },
    {
      input: 's = "()[]{}"',
      output: 'true',
      explanation: 'All bracket types are properly opened and closed.',
    },
    {
      input: 's = "(]"',
      output: 'false',
      explanation: 'The opening \'(\' is closed by \']\' which is a mismatch.',
    },
    {
      input: 's = "([])"',
      output: 'true',
      explanation: 'Nested brackets are valid when properly matched.',
    },
  ],

  starterCodes: [
    {
      language: 'javascript',
      functionSignature: 'function isValid(s)',
      code: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your code here
}`,
    },
    {
      language: 'typescript',
      functionSignature: 'function isValid(s: string): boolean',
      code: `function isValid(s: string): boolean {
  // Your code here
}`,
    },
    {
      language: 'python',
      functionSignature: 'def isValid(self, s: str) -> bool',
      code: `class Solution:
    def isValid(self, s: str) -> bool:
        # Your code here
        pass`,
    },
    {
      language: 'java',
      functionSignature: 'public boolean isValid(String s)',
      code: `class Solution {
    public boolean isValid(String s) {
        // Your code here
        return false;
    }
}`,
    },
    {
      language: 'cpp',
      functionSignature: 'bool isValid(string s)',
      code: `class Solution {
public:
    bool isValid(string s) {
        // Your code here
        return false;
    }
};`,
    },
  ],

  testCases: [
    {
      id: 'tc_003_01',
      input: '"()"',
      expectedOutput: 'true',
      isHidden: false,
    },
    {
      id: 'tc_003_02',
      input: '"()[]{}"',
      expectedOutput: 'true',
      isHidden: false,
    },
    {
      id: 'tc_003_03',
      input: '"(]"',
      expectedOutput: 'false',
      isHidden: false,
      explanation: 'Mismatched bracket types.',
    },
    {
      id: 'tc_003_04',
      input: '"([])"',
      expectedOutput: 'true',
      isHidden: false,
      explanation: 'Properly nested brackets.',
    },
    {
      id: 'tc_003_05',
      input: '"((("',
      expectedOutput: 'false',
      isHidden: true,
    },
    {
      id: 'tc_003_06',
      input: '"{[()]}"',
      expectedOutput: 'true',
      isHidden: true,
    },
    {
      id: 'tc_003_07',
      input: '"([)]"',
      expectedOutput: 'false',
      isHidden: true,
    },
    {
      id: 'tc_003_08',
      input: '""',
      expectedOutput: 'true',
      isHidden: true,
    },
    {
      id: 'tc_003_09',
      input: '"))))"',
      expectedOutput: 'false',
      isHidden: true,
    },
  ],

  xpReward: {
    solve: 50,
    optimal: 25,
    firstAttempt: 15,
  },

  aiMeta: {
    concepts: ['Stack data structure', 'Bracket matching', 'LIFO principle'],
    approachHints: [
      'Use a stack to track opening brackets.',
      'When you encounter a closing bracket, check if the top of the stack matches.',
      'At the end, the stack should be empty for a valid string.',
    ],
    commonMistakes: [
      'Forgetting to check if the stack is empty at the end.',
      'Not handling the case where a closing bracket appears with an empty stack.',
      'Using a queue instead of a stack (FIFO vs LIFO).',
      'Not mapping each closing bracket to its corresponding opening bracket.',
    ],
    optimalTimeComplexity: 'O(n)',
    optimalSpaceComplexity: 'O(n)',
  },

  acceptanceRate: 41.3,
  totalSubmissions: 31200,
  totalAccepted: 12886,
  createdAt: '2025-01-17T00:00:00Z',
  updatedAt: '2025-01-17T00:00:00Z',
};
