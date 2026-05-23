import { Trophy } from 'lucide-react';
import { WorkspacePage } from './WorkspacePage';

export default function LeaderboardPage() {
  return (
    <WorkspacePage
      title="Leaderboard"
      eyebrow="Ranking system"
      description="Track rating, consistency, and topic depth without turning the workspace into a noisy scoreboard."
      icon={Trophy}
      metrics={[
        { label: 'Global rank', value: '#342' },
        { label: 'Percentile', value: '95%' },
        { label: 'Rating', value: '1847' },
      ]}
    />
  );
}
