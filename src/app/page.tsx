import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-background px-6 py-12 text-center">
      <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-600 shadow-sm">
        Lead / Business Data Finder
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
        Centralize your B2B lead discovery workflow inside a refined admin
        panel.
      </h1>
      <p className="max-w-xl text-lg text-slate-600">
        Upload CSV files, explore enriched company insights, and keep your sales
        team synced with a responsive experience optimized for clarity.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/login"
          className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          Go to Login
        </Link>
        <a
          href="#features"
          className="rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          Learn more
        </a>
      </div>
      <section
        id="features"
        className="mt-16 grid w-full max-w-4xl gap-6 rounded-3xl bg-white p-8 text-left shadow-card md:grid-cols-3"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Fast uploads</h2>
          <p className="mt-2 text-sm text-slate-600">
            Parse CSV files safely in the browser and blend them with existing
            pipelines in seconds.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Powerful search</h2>
          <p className="mt-2 text-sm text-slate-600">
            Filter leads in real-time across multiple attributes without leaving
            the grid.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Team ready</h2>
          <p className="mt-2 text-sm text-slate-600">
            Keep account managers aligned with clean data visualizations and a
            thoughtful responsive layout.
          </p>
        </div>
      </section>
    </main>
  );
}
