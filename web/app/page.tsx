/**
 * Home Page
 * Landing page with project overview and navigation links.
 */

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 px-6">
      <div className="max-w-2xl space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Simple Finance Dashboard
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Track Your Monthly Finances
          </h1>
          <p className="text-base text-muted-foreground">
            A beginner-friendly full-stack application built with Next.js,
            MongoDB, and shadcn/ui. Register to start tracking your income and
            expenses.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="/register"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Log In
          </a>
        </div>

        <div className="pt-8 text-sm text-muted-foreground">
          <p>Built with:</p>
          <p className="font-medium">
            Next.js • TypeScript • MongoDB • Tailwind CSS • shadcn/ui
          </p>
        </div>
      </div>
    </main>
  );
}
