import { BrainCircuit } from 'lucide-react';
import { WorkspacePage } from './WorkspacePage';

export default function PracticeProblemPage() {
  return (
    <WorkspacePage
      title="Problem Editor"
      eyebrow="Practice with AI"
      description="The code editor, runner, AI hints, and review panel will share this workspace."
      icon={BrainCircuit}
      metrics={[
        { label: 'Language', value: 'TS' },
        { label: 'Tests', value: 'Ready' },
        { label: 'Hints', value: 'Guide' },
      ]}
    />
  );
}
