import { useNavigate } from 'react-router-dom';
import { AnimatedPage } from '@/components/common/AnimatedPage';
import { ProblemList } from '@/components/features/problems/ProblemList';
import type { ProblemSummary } from '@/types/problem';

// ─── Mock Data (replace with useProblems() React Query hook) ──
const mockProblems: ProblemSummary[] = [
  {
    id: '1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'EASY',
    tags: ['Array', 'Hash Table'],
    acceptanceRate: 49.2,
    totalAttempts: 12450,
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    slug: 'add-two-numbers',
    difficulty: 'MEDIUM',
    tags: ['Linked List', 'Math'],
    acceptanceRate: 39.8,
    totalAttempts: 8930,
    createdAt: '2025-01-16',
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating',
    difficulty: 'MEDIUM',
    tags: ['String', 'Sliding Window'],
    acceptanceRate: 33.5,
    totalAttempts: 10200,
    createdAt: '2025-01-17',
  },
  {
    id: '4',
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'HARD',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    acceptanceRate: 35.1,
    totalAttempts: 7680,
    createdAt: '2025-01-18',
  },
  {
    id: '5',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'EASY',
    tags: ['Stack', 'String'],
    acceptanceRate: 41.3,
    totalAttempts: 15600,
    createdAt: '2025-01-19',
  },
  {
    id: '6',
    title: 'Merge K Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'HARD',
    tags: ['Linked List', 'Heap', 'Divide and Conquer'],
    acceptanceRate: 47.2,
    totalAttempts: 6540,
    createdAt: '2025-01-20',
  },
  {
    id: '7',
    title: 'LRU Cache',
    slug: 'lru-cache',
    difficulty: 'MEDIUM',
    tags: ['Hash Table', 'Linked List', 'Design'],
    acceptanceRate: 40.1,
    totalAttempts: 9100,
    createdAt: '2025-01-21',
  },
  {
    id: '8',
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'MEDIUM',
    tags: ['Array', 'Dynamic Programming'],
    acceptanceRate: 50.3,
    totalAttempts: 11200,
    createdAt: '2025-01-22',
  },
  {
    id: '9',
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'EASY',
    tags: ['Dynamic Programming', 'Math'],
    acceptanceRate: 51.8,
    totalAttempts: 14300,
    createdAt: '2025-01-23',
  },
  {
    id: '10',
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'HARD',
    tags: ['Array', 'Two Pointers', 'Stack'],
    acceptanceRate: 57.6,
    totalAttempts: 5890,
    createdAt: '2025-01-24',
  },
];

export function ProblemsPage() {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-text-primary">Problems</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Practice DSA problems — filter by difficulty or search by topic.
          </p>
        </div>

        <ProblemList
          problems={mockProblems}
          onProblemClick={(slug) => navigate(`/problems/${slug}`)}
        />
      </div>
    </AnimatedPage>
  );
}
