import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { AnimatedPage } from '@/components/common/AnimatedPage';
import { Button } from '@/components/ui/button';
import { ROUTE_PATHS } from '@/routes/paths';

export default function NotFoundPage() {
  return (
    <AnimatedPage>
      <section className="grid min-h-[520px] place-items-center">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 grid h-10 w-10 place-items-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
            <Compass className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Workspace not found
          </h1>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            This route is not part of the current AlgoPilot workspace map.
          </p>
          <Button asChild className="mt-5" size="lg">
            <Link to={ROUTE_PATHS.dashboard}>Return to dashboard</Link>
          </Button>
        </div>
      </section>
    </AnimatedPage>
  );
}
