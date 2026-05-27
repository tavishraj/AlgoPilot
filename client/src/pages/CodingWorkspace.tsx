import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { getProblemBySlug } from '@/data/problems';
import { WorkspaceLayout } from '@/components/features/workspace/WorkspaceLayout';
import { ROUTE_PATHS } from '@/routes/paths';
import { Loader2 } from 'lucide-react';

// ─── Coding Workspace Page ────────────────────────────────
// Entry point for /practice/:slug.
// Loads the problem from the data layer, initializes the
// workspace store, and renders the full workspace layout.

export default function CodingWorkspacePage() {
  const { slug } = useParams<{ slug: string }>();
  const loadProblem = useWorkspaceStore((s) => s.loadProblem);
  const problem = useWorkspaceStore((s) => s.problem);
  const problemSlug = useWorkspaceStore((s) => s.problemSlug);

  // Load problem when slug changes
  useEffect(() => {
    if (slug && slug !== problemSlug) {
      loadProblem(slug);
    }
  }, [slug, problemSlug, loadProblem]);

  // Invalid slug — redirect to practice list
  if (slug && !getProblemBySlug(slug)) {
    return <Navigate to={ROUTE_PATHS.practice} replace />;
  }

  // Loading state
  if (!problem) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return <WorkspaceLayout />;
}
