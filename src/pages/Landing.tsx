import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b px-6 py-4">
        <div className="max-w-5xl mx-auto">
          <strong>Header</strong>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl py-20 text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">
            Start Researching your stocks.
          </h1>
          <p className="text-lg text-muted-foreground">
            Description here.
          </p>
          <Button asChild size="lg">
            <Link to="/workbench">Open the workbench →</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
