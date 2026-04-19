import { Link } from "react-router-dom";

/**
 * Centered closing block with a soft radial gradient glow behind.
 */
export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-64 max-w-2xl -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/20 via-purple-500/15 to-pink-500/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-2xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Ready to start researching?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          The workbench is one click away. No signup, no setup.
        </p>
        <div className="mt-7">
          <Link
            to="/workbench"
            className="shadow-cta hover-lift inline-flex rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Open the workbench →
          </Link>
        </div>
      </div>
    </section>
  );
}
