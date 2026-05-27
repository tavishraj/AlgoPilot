import type { Problem } from '@/types/problem';

export const reverseArray: Problem = {
  id: 'prob_002',
  title: 'Reverse Array',
  slug: 'reverse-array',
  order: 2,
  difficulty: 'EASY',
  status: 'PUBLISHED',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Two Pointers'],

  description: `Given an array of integers \`nums\`, reverse the array **in-place** and return it.

You must do this by modifying the input array directly with \`O(1)\` extra memory.`,

  constraints: [
    { description: '1 ≤ nums.length ≤ 10⁵' },
    { description: '-10⁹ ≤ nums[i] ≤ 10⁹' },
  ],

  examples: [
    {
      input: 'nums = [1,2,3,4,5]',
      output: '[5,4,3,2,1]',
      explanation: 'The array is reversed in-place.',
    },
    {
      input: 'nums = [9,7]',
      output: '[7,9]',
    },
    {
      input: 'nums = [1]',
      output: '[1]',
      explanation: 'A single-element array is already reversed.',
    },
  ],

  starterCodes: [
    {
      language: 'javascript',
      functionSignature: 'function reverseArray(nums)',
      code: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
function reverseArray(nums) {
  // Your code here
}`,
    },
    {
      language: 'typescript',
      functionSignature: 'function reverseArray(nums: number[]): number[]',
      code: `function reverseArray(nums: number[]): number[] {
  // Your code here
}`,
    },
    {
      language: 'python',
      functionSignature: 'def reverseArray(self, nums: List[int]) -> List[int]',
      code: `class Solution:
    def reverseArray(self, nums: List[int]) -> List[int]:
        # Your code here
        pass`,
    },
    {
      language: 'java',
      functionSignature: 'public int[] reverseArray(int[] nums)',
      code: `class Solution {
    public int[] reverseArray(int[] nums) {
        // Your code here
        return nums;
    }
}`,
    },
    {
      language: 'cpp',
      functionSignature: 'vector<int> reverseArray(vector<int>& nums)',
      code: `class Solution {
public:
    vector<int> reverseArray(vector<int>& nums) {
        // Your code here
        return nums;
    }
};`,
    },
  ],

  testCases: [
    {
      id: 'tc_002_01',
      input: '[1,2,3,4,5]',
      expectedOutput: '[5,4,3,2,1]',
      isHidden: false,
      explanation: 'Standard odd-length array reversal.',
    },
    {
      id: 'tc_002_02',
      input: '[9,7]',
      expectedOutput: '[7,9]',
      isHidden: false,
    },
    {
      id: 'tc_002_03',
      input: '[1]',
      expectedOutput: '[1]',
      isHidden: false,
      explanation: 'Single element — no swap needed.',
    },
    {
      id: 'tc_002_04',
      input: '[1,2,3,4]',
      expectedOutput: '[4,3,2,1]',
      isHidden: true,
    },
    {
      id: 'tc_002_05',
      input: '[-3,0,5,-8,12]',
      expectedOutput: '[12,-8,5,0,-3]',
      isHidden: true,
    },
    {
      id: 'tc_002_06',
      input: '[0,0,0,0]',
      expectedOutput: '[0,0,0,0]',
      isHidden: true,
    },
  ],

  xpReward: {
    solve: 30,
    optimal: 15,
    firstAttempt: 10,
  },

  aiMeta: {
    concepts: ['Two-pointer technique', 'In-place swap', 'Array traversal'],
    approachHints: [
      'Use two pointers — one at the start, one at the end.',
      'Swap elements and move pointers inward.',
      'Stop when the pointers meet in the middle.',
    ],
    commonMistakes: [
      'Creating a new array instead of reversing in-place.',
      'Off-by-one errors in loop termination.',
      'Forgetting to return the modified array.',
    ],
    optimalTimeComplexity: 'O(n)',
    optimalSpaceComplexity: 'O(1)',
  },

  acceptanceRate: 72.5,
  totalSubmissions: 18300,
  totalAccepted: 13268,
  createdAt: '2025-01-16T00:00:00Z',
  updatedAt: '2025-01-16T00:00:00Z',
};
