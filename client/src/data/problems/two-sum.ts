import type { Problem } from '@/types/problem';

export const twoSum: Problem = {
  id: 'prob_001',
  title: 'Two Sum',
  slug: 'two-sum',
  order: 1,
  difficulty: 'EASY',
  status: 'PUBLISHED',
  category: 'Arrays & Hashing',
  tags: ['Array', 'Hash Table'],

  description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers* such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.

You can return the answer in any order.`,

  constraints: [
    { description: '2 ≤ nums.length ≤ 10⁴' },
    { description: '-10⁹ ≤ nums[i] ≤ 10⁹' },
    { description: '-10⁹ ≤ target ≤ 10⁹' },
    { description: 'Only one valid answer exists.' },
  ],

  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
    },
    {
      input: 'nums = [3,3], target = 6',
      output: '[0,1]',
    },
  ],

  starterCodes: [
    {
      language: 'javascript',
      functionSignature: 'function twoSum(nums, target)',
      code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your code here
}`,
    },
    {
      language: 'typescript',
      functionSignature: 'function twoSum(nums: number[], target: number): number[]',
      code: `function twoSum(nums: number[], target: number): number[] {
  // Your code here
}`,
    },
    {
      language: 'python',
      functionSignature: 'def twoSum(self, nums: List[int], target: int) -> List[int]',
      code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`,
    },
    {
      language: 'java',
      functionSignature: 'public int[] twoSum(int[] nums, int target)',
      code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
    },
    {
      language: 'cpp',
      functionSignature: 'vector<int> twoSum(vector<int>& nums, int target)',
      code: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
    },
  ],

  testCases: [
    {
      id: 'tc_001_01',
      input: '[2,7,11,15]\n9',
      expectedOutput: '[0,1]',
      isHidden: false,
      explanation: 'Basic case: first two elements sum to target.',
    },
    {
      id: 'tc_001_02',
      input: '[3,2,4]\n6',
      expectedOutput: '[1,2]',
      isHidden: false,
    },
    {
      id: 'tc_001_03',
      input: '[3,3]\n6',
      expectedOutput: '[0,1]',
      isHidden: false,
      explanation: 'Duplicate values that sum to target.',
    },
    {
      id: 'tc_001_04',
      input: '[1,5,8,3,9,2]\n11',
      expectedOutput: '[2,3]',
      isHidden: true,
    },
    {
      id: 'tc_001_05',
      input: '[-1,-2,-3,-4,-5]\n-8',
      expectedOutput: '[2,4]',
      isHidden: true,
    },
    {
      id: 'tc_001_06',
      input: '[0,4,3,0]\n0',
      expectedOutput: '[0,3]',
      isHidden: true,
    },
  ],

  xpReward: {
    solve: 50,
    optimal: 25,
    firstAttempt: 15,
  },

  aiMeta: {
    concepts: ['Hash Map', 'Complement lookup', 'Single-pass iteration'],
    approachHints: [
      'Think about what value you need to find for each element.',
      'Can you store previously seen values for O(1) lookup?',
      'A hash map lets you check if the complement exists instantly.',
    ],
    commonMistakes: [
      'Using the same element twice (same index).',
      'Returning values instead of indices.',
      'Using a brute-force O(n²) nested loop when O(n) is possible.',
    ],
    optimalTimeComplexity: 'O(n)',
    optimalSpaceComplexity: 'O(n)',
  },

  acceptanceRate: 49.2,
  totalSubmissions: 24900,
  totalAccepted: 12251,
  createdAt: '2025-01-15T00:00:00Z',
  updatedAt: '2025-01-15T00:00:00Z',
};
