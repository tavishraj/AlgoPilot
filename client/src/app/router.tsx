import { createBrowserRouter } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { DashboardPage } from '@/pages/Dashboard';
import { ProblemsPage } from '@/pages/Problems';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'problems',
        element: <ProblemsPage />,
      },
      {
        path: 'problems/:slug',
        element: (
          <div className="text-text-secondary text-sm">
            Problem editor — coming soon. This will host the Monaco code editor,
            test runner, and AI hint panel.
          </div>
        ),
      },
      {
        path: 'submissions',
        element: (
          <div className="text-text-secondary text-sm">
            Submissions history — coming soon.
          </div>
        ),
      },
      {
        path: 'battle',
        element: (
          <div className="text-text-secondary text-sm">
            Battle arena — coming soon. Real-time coding battles with WebSocket support.
          </div>
        ),
      },
      {
        path: 'leaderboard',
        element: (
          <div className="text-text-secondary text-sm">
            Leaderboard & ranking system — coming soon.
          </div>
        ),
      },
      {
        path: 'ai',
        element: (
          <div className="text-text-secondary text-sm">
            AI Assistant — coming soon. Powered by Gemini / GPT.
          </div>
        ),
      },
      {
        path: 'settings',
        element: (
          <div className="text-text-secondary text-sm">
            Settings — coming soon.
          </div>
        ),
      },
    ],
  },
]);
