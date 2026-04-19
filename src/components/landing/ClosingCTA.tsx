import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * Centered closing block. Radial-gradient glow gets applied in the theming pass.
 */
export function ClosingCTA() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold">Ready to start researching?</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The workbench is one click away. No signup, no setup.
        </p>
        <div className="mt-6">
          <Button asChild size="lg">
            <Link to="/workbench">Open the workbench →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
