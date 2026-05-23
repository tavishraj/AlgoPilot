import { useQuery } from '@tanstack/react-query';
import { problemsService, type ProblemsQueryParams } from '@/services/problems.service';

export function useProblems(params?: ProblemsQueryParams) {
  return useQuery({
    queryKey: ['problems', params],
    queryFn: () => problemsService.getAll(params),
  });
}

export function useProblem(slug: string) {
  return useQuery({
    queryKey: ['problem', slug],
    queryFn: () => problemsService.getBySlug(slug),
    enabled: !!slug,
  });
}
