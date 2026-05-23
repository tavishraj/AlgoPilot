import { CircleUserRound } from 'lucide-react';
import { WorkspacePage } from './WorkspacePage';

export default function ProfilePage() {
  return (
    <WorkspacePage
      title="Profile"
      eyebrow="Developer identity"
      description="A compact view for goals, strengths, submissions, and interview readiness."
      icon={CircleUserRound}
      metrics={[
        { label: 'Solved', value: '127' },
        { label: 'Streak', value: '14d' },
        { label: 'Topics', value: '32' },
      ]}
    />
  );
}
