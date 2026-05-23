import { Settings2 } from 'lucide-react';
import { WorkspacePage } from './WorkspacePage';

export default function SettingsPage() {
  return (
    <WorkspacePage
      title="Settings"
      eyebrow="Preferences"
      description="Tune the workspace, editor behavior, AI assistance, and notification cadence."
      icon={Settings2}
      accent="purple"
      metrics={[
        { label: 'Theme', value: 'Dark' },
        { label: 'Editor', value: 'TS' },
        { label: 'AI mode', value: 'Guide' },
      ]}
    />
  );
}
