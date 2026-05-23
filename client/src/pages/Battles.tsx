import { Network } from 'lucide-react';
import { WorkspacePage } from './WorkspacePage';

export default function BattlesPage() {
  return (
    <WorkspacePage
      title="Battles"
      eyebrow="Realtime rooms"
      description="Structured coding rounds with calm competitive signals, live status, and reviewer-ready submissions."
      icon={Network}
      accent="purple"
      metrics={[
        { label: 'Open rooms', value: '7' },
        { label: 'Avg solve', value: '21m' },
        { label: 'Win rate', value: '64%' },
      ]}
    />
  );
}
