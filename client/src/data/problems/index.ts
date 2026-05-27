// ─── Problem Registry ─────────────────────────────────────
// Central registry for all mock problems.
// In production, this is replaced by API calls — the consuming
// code uses the same Problem/ProblemSummary interfaces either way.

import type { Problem, ProblemSummary, ProblemFilters, ProblemSortOptions } from '@/types/problem';

import { twoSum } from './two-sum';
import { reverseArray } from './reverse-array';
import { validParentheses } from './valid-parentheses';

// ─── All Problems (ordered) ──────────────────────────────

export const MOCK_PROBLEMS: Problem[] = [
  twoSum,
  reverseArray,
  validParentheses,
].sort((a, b) => a.order - b.order);

// ─── Problem Map (O(1) slug lookup) ──────────────────────

const problemsBySlug = new Map<string, Problem>(
  MOCK_PROBLEMS.map((p) => [p.slug, p])
);

const problemsById = new Map<string, Problem>(
  MOCK_PROBLEMS.map((p) => [p.id, p])
);

// ─── Projection: Full Problem → Summary ──────────────────

export function toProblemSummary(problem: Problem): ProblemSummary {
  return {
    id: problem.id,
    title: problem.title,
    slug: problem.slug,
    order: problem.order,
    difficulty: problem.difficulty,
    status: problem.status,
    tags: problem.tags,
    category: problem.category,
    acceptanceRate: problem.acceptanceRate,
    totalSubmissions: problem.totalSubmissions,
    xpReward: { solve: problem.xpReward.solve },
    createdAt: problem.createdAt,
  };
}

// ─── Query Functions ─────────────────────────────────────
// These mirror the shapes your API will return, making the
// migration from mock → real API a simple swap.

export function getProblemBySlug(slug: string): Problem | undefined {
  return problemsBySlug.get(slug);
}

export function getProblemById(id: string): Problem | undefined {
  return problemsById.get(id);
}

export function getAllProblemSummaries(): ProblemSummary[] {
  return MOCK_PROBLEMS
    .filter((p) => p.status === 'PUBLISHED')
    .map(toProblemSummary);
}

export function getFilteredProblems(
  filters?: ProblemFilters,
  sort?: ProblemSortOptions
): ProblemSummary[] {
  let results = MOCK_PROBLEMS.filter((p) => p.status === 'PUBLISHED');

  if (filters) {
    if (filters.difficulty) {
      results = results.filter((p) => p.difficulty === filters.difficulty);
    }
    if (filters.tags && filters.tags.length > 0) {
      results = results.filter((p) =>
        filters.tags!.some((tag) => p.tags.includes(tag))
      );
    }
    if (filters.category) {
      results = results.filter((p) => p.category === filters.category);
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }
  }

  const summaries = results.map(toProblemSummary);

  if (sort) {
    const dir = sort.direction === 'asc' ? 1 : -1;
    summaries.sort((a, b) => {
      switch (sort.field) {
        case 'order':
          return (a.order - b.order) * dir;
        case 'title':
          return a.title.localeCompare(b.title) * dir;
        case 'difficulty': {
          const rank = { EASY: 0, MEDIUM: 1, HARD: 2 };
          return (rank[a.difficulty] - rank[b.difficulty]) * dir;
        }
        case 'acceptanceRate':
          return (a.acceptanceRate - b.acceptanceRate) * dir;
        case 'totalSubmissions':
          return (a.totalSubmissions - b.totalSubmissions) * dir;
        default:
          return 0;
      }
    });
  }

  return summaries;
}

// ─── Helper: Get unique tags from all problems ───────────

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  MOCK_PROBLEMS.forEach((p) => p.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

// ─── Helper: Get unique categories ───────────────────────

export function getAllCategories(): string[] {
  const catSet = new Set<string>();
  MOCK_PROBLEMS.forEach((p) => catSet.add(p.category));
  return Array.from(catSet).sort();
}

// ─── Helper: Get visible test cases only ─────────────────

export function getVisibleTestCases(problem: Problem) {
  return problem.testCases.filter((tc) => !tc.isHidden);
}

// ─── Helper: Get starter code for a language ─────────────

export function getStarterCode(problem: Problem, language: string): string {
  const starter = problem.starterCodes.find((sc) => sc.language === language);
  return starter?.code ?? `// No starter code available for ${language}`;
}
