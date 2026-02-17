import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-800 text-white px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl text-center space-y-10 py-20">

        {/* Badge */}
        <div className="inline-block animate-fade-in-up">
          <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-300 backdrop-blur-sm shadow-lg shadow-blue-500/10">
            New Strategy Generator v2.0
          </span>
        </div>

        {/* Hero Text */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-blue-100 to-gray-400 pb-2 leading-tight">
            Master Your Market <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">with AI Precision</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Leverage AI to create comprehensive, data-driven sales strategies.
            Unlock insights on market opportunities, customer personas, and revenue forecasts tailored to your business.
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center items-center">
          <Link
            href="/dashboard"
            className="group relative px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 flex items-center gap-2 overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] hover:bg-white/20 hover:border-white/40"
          >
            <span className="relative z-10">Get Started Now</span>
            <span className="transition-transform group-hover:translate-x-1 relative z-10">→</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
          </Link>
        </div>

        {/* Feature Tags */}
        <div className="pt-8 border-t border-white/5 mt-12">
          <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-medium">Generates Comprehensive Reports Including</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Executive Summary",
              "Market Analysis",
              "Customer Persona",
              "Competitive Landscape",
              "Go-to-Market Tactics",
              "Revenue Forecast",
              "Risk Mitigation"
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-gray-300 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-6 w-full flex items-center justify-center text-xs text-gray-600">
        <span>© {new Date().getFullYear()} SalesAI</span>
        <span className="mx-2">•</span>
        <a href="https://prabhat-singh-portfolio.vercel.app" target="_blank" className="text-gray-500 hover:text-white cursor-pointer transition-colors">Prabhat Singh</a>
      </footer>
    </main>
  );
}
