import Link from "next/link";

const reports = [
  "Executive Summary",
  "Market Analysis",
  "Customer Persona",
  "Competitive Landscape",
  "Go-to-Market Tactics",
  "Revenue Forecast",
  "Risk Mitigation",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#faf8f4] text-stone-900 flex flex-col">
      <header className="mx-auto w-full px-6 py-6 flex items-center justify-between">
        <span className="font-serif text-xl font-semibold tracking-tight">PitchPilot</span>
        <Link href="/dashboard" className="text-sm text-stone-600 hover:text-stone-900">
          Open app
        </Link>
      </header>

      <section className="mx-auto w-full  px-6 pt-16 md:pt-28 pb-20">
        <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-3xl">
          Stop wasting hours on sales decks.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-stone-600 leading-relaxed">
          Tell the agent what you sell and who you sell to. It analyzes your needs and
          builds a data-backed strategy in seconds, ready to present to your next big client.
        </p>
        <Link
          href="/dashboard"
          className="mt-10 inline-block rounded-md bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-700 transition-colors"
        >
          Build a strategy
        </Link>
      </section>

      <section className="mx-auto w-full px-6 pb-20">
        <h2 className="text-sm text-stone-500 border-b border-stone-300 pb-3">
          Every report includes
        </h2>
        <ol className="grid  sm:grid-cols-4 gap-x-12">
          {reports.map((name, i) => (
            <li key={name} className="flex gap-4 border-b border-stone-200 py-4">
              <span className="w-6 text-sm tabular-nums text-stone-400">{i + 1}</span>
              <span>{name}</span>
            </li>
          ))}
        </ol>
      </section>

      <footer className="mx-auto w-full  px-6 py-6 text-xs text-stone-500 flex justify-between">
        <span>© {new Date().getFullYear()} PitchPilot</span>
        <a
          href="https://prabhat-singh-portfolio.vercel.app"
          target="_blank"
          className="hover:text-stone-900"
        >
          Prabhat Singh
        </a>
      </footer>
    </main>
  );
}
