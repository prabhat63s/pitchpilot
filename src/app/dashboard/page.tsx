import SalesForm from "../components/SalesForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0f] text-white selection:bg-blue-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>

            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>


            <div className="w-full px-4 py-8 sm:px-6 lg:px-8 relative z-10">
                <div className="mb-8 flex flex-col gap-2">
                    <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-400 transition-colors w-fit">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        New Strategy
                    </h1>
                    <p className="text-gray-400">
                        Configure your parameters to generate a comprehensive sales analysis.
                    </p>
                </div>

                {/* Main Content Area */}
                <div className="relative">
                    <SalesForm />
                </div>
            </div>
        </main>
    );
}
