"use client"

import { useState, useRef, useEffect } from "react";
import MarkdownViewer from "./MarkdownViewer";
import { Loader, Sparkles, User, Bot, ChevronRight, Zap, Globe, History, Clock, Copy, Check, PlusCircle, FileDown } from "lucide-react";
import { jsPDF } from "jspdf";

interface HistoryItem {
    id: string;
    timestamp: number;
    industry: string;
    client: string;
    region: string;
    strategy: string;
}

export default function SalesForm() {
    const [industry, setIndustry] = useState("");
    const [client, setClient] = useState("");
    const [region, setRegion] = useState("");
    const [loading, setLoading] = useState(false);
    const [strategy, setStrategy] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [copied, setCopied] = useState(false);
    const [exporting, setExporting] = useState(false);
    const industryRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedHistory = localStorage.getItem("sales_history");
        if (savedHistory) {
            try {
                setHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const saveToHistory = (newStrategy: string, params: { industry: string; client: string; region: string }) => {
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            industry: params.industry,
            client: params.client,
            region: params.region,
            strategy: newStrategy,
        };

        const updatedHistory = [newItem, ...history].slice(0, 5);
        setHistory(updatedHistory);
        localStorage.setItem("sales_history", JSON.stringify(updatedHistory));
    };

    const loadHistoryItem = (item: HistoryItem) => {
        setIndustry(item.industry);
        setClient(item.client);
        setRegion(item.region);
        setStrategy(item.strategy);
    };

    const handleCopy = async () => {
        if (!strategy) return;
        try {
            const cleanText = strategy
                .replace(/[#*`]/g, "") // Remove #, *, `
                .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links but keep text
                .replace(/^\s*-\s/gm, "• ") // Replace list dashes with bullets
                .replace(/\n{3,}/g, "\n\n"); // Normalize newlines

            await navigator.clipboard.writeText(cleanText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleNewAnalysis = () => {
        setStrategy(null);
        setIndustry("");
        setClient("");
        setRegion("");
        setTimeout(() => industryRef.current?.focus(), 100);
    };

    const handleExportPDF = () => {
        if (!strategy) return;
        setExporting(true);

        // Small timeout to allow UI to update before heavy PDF generation blocks the thread
        setTimeout(() => {
            try {
                const doc = new jsPDF("p", "pt", "a4");

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                const marginX = 50;
                const marginY = 60;
                const contentWidth = pageWidth - marginX * 2;

                let y = marginY;

                const addPageIfNeeded = (space = 80) => {
                    if (y + space > pageHeight - 50) {
                        doc.addPage();
                        y = marginY;
                    }
                };

                doc.setFillColor(15, 23, 42);
                doc.rect(0, 0, pageWidth, 110, "F");

                doc.setFont("helvetica", "bold");
                doc.setFontSize(24);
                doc.setTextColor(255, 255, 255);
                doc.text("Sales Strategy", marginX, 55);

                doc.setFontSize(16);
                doc.text(client, marginX, 80);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(203, 213, 225);
                doc.text(
                    `Industry: ${industry.toUpperCase()}  |  Region: ${region.toUpperCase()}`,
                    marginX,
                    100
                );

                y = 150;

                type Section = {
                    title: string;
                    paragraphs: string[];
                    bullets: string[];
                };

                const parseStrategy = (markdown: string): Section[] => {
                    const sections: Section[] = [];
                    const lines = markdown.split("\n");

                    let current: Section | null = null;

                    for (const raw of lines) {
                        const line = raw.trim();
                        if (!line) continue;

                        if (line.startsWith("## ")) {
                            if (current) sections.push(current);
                            current = {
                                title: line.replace("## ", "").replace(/\*\*/g, ""),
                                paragraphs: [],
                                bullets: [],
                            };
                        } else if (line.startsWith("- ")) {
                            current?.bullets.push(line.replace("- ", "").replace(/\*\*/g, ""));
                        } else if (line.startsWith("**")) {
                            current?.paragraphs.push(
                                line.replace(/\*\*/g, "")
                            );
                        } else {
                            current?.paragraphs.push(line.replace(/\*\*/g, ""));
                        }
                    }

                    if (current) sections.push(current);
                    return sections;
                };

                const sections = parseStrategy(strategy);

                sections.forEach((section) => {
                    addPageIfNeeded(120);

                    // SECTION TITLE
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(16);
                    doc.setTextColor(30, 64, 175);
                    doc.text(section.title, marginX, y);
                    y += 10;

                    // Divider
                    doc.setDrawColor(226, 232, 240);
                    doc.line(marginX, y, pageWidth - marginX, y);
                    y += 16;

                    // PARAGRAPHS
                    section.paragraphs.forEach((p) => {
                        const wrapped = doc.splitTextToSize(p, contentWidth);
                        addPageIfNeeded(wrapped.length * 14);

                        doc.setFont("helvetica", "normal");
                        doc.setFontSize(11);
                        doc.setTextColor(51, 65, 85);
                        doc.text(wrapped, marginX, y);
                        y += wrapped.length * 14 + 10;
                    });

                    // BULLETS
                    if (section.bullets.length) {
                        section.bullets.forEach((b) => {
                            const wrapped = doc.splitTextToSize(b, contentWidth - 20);
                            addPageIfNeeded(wrapped.length * 14);

                            doc.setFillColor(30, 64, 175);
                            doc.circle(marginX + 4, y - 4, 2, "F");

                            doc.setFont("helvetica", "normal");
                            doc.setFontSize(11);
                            doc.setTextColor(51, 65, 85);
                            doc.text(wrapped, marginX + 16, y);

                            y += wrapped.length * 14 + 6;
                        });
                    }

                    y += 16;
                });

                const pageCount = doc.getNumberOfPages();

                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(9);
                    doc.setTextColor(148, 163, 184);

                    doc.text("Generated by AI Sales Agent", marginX, pageHeight - 30);
                    doc.text(
                        `Page ${i} of ${pageCount}`,
                        pageWidth - marginX - 60,
                        pageHeight - 30
                    );
                }

                doc.save(`${client.replace(/\s+/g, '_')}_Sales_Strategy.pdf`);
            } catch (error) {
                console.error("PDF Export failed", error);
                alert("Failed to generate PDF. Please try again.");
            } finally {
                setExporting(false);
            }
        }, 100);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!industry || !client || !region) return;

        setLoading(true);
        setStrategy(null);

        try {
            const res = await fetch("/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ industry, client, region }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Request failed");

            setStrategy(data.strategy_markdown);
            saveToHistory(data.strategy_markdown, { industry, client, region });

            // Clear form fields after response
            setIndustry("");
            setClient("");
            setRegion("");

            // Focus back on Industry input for convenience
            industryRef.current?.focus();
        } catch (err) {
            console.error(err);
            setStrategy("Failed to generate strategy. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full h-[90vh] max-h-[900px]">
            {/* Input Form */}
            <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6 animate-fade-in-up">
                <div className="flex-1 rounded-3xl border border-white/10 bg-gray-900/60 p-6 backdrop-blur-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
                    <div className="mb-6 flex items-center gap-4 shrink-0">
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-white/5 shadow-inner">
                            <Sparkles className="h-6 w-6 text-blue-400" />
                            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl opacity-50" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Strategy Parameters</h2>
                            <p className="text-sm text-gray-400 font-medium">Define your target for analysis</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-2 shrink-0">
                        <div className="space-y-2">
                            <div className="group space-y-2">
                                <label htmlFor="industry" className="flex items-center gap-2 text-sm font-semibold text-gray-300 group-focus-within:text-blue-400 transition-colors">
                                    <Zap className="w-4 h-4" /> Industry
                                </label>
                                <div className="relative">
                                    <input
                                        ref={industryRef}
                                        id="industry"
                                        type="text"
                                        placeholder="e.g., SaaS, Healthcare, Fintech"
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white placeholder-gray-500 transition-all focus:border-blue-500/50 focus:bg-black/40 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group space-y-2">
                                <label htmlFor="client" className="flex items-center gap-2 text-sm font-semibold text-gray-300 group-focus-within:text-purple-400 transition-colors">
                                    <User className="w-4 h-4" /> Client Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="client"
                                        type="text"
                                        placeholder="e.g., Acme Corp"
                                        value={client}
                                        onChange={(e) => setClient(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white placeholder-gray-500 transition-all focus:border-purple-500/50 focus:bg-black/40 focus:outline-none focus:ring-4 focus:ring-purple-500/10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="group space-y-2">
                                <label htmlFor="region" className="flex items-center gap-2 text-sm font-semibold text-gray-300 group-focus-within:text-pink-400 transition-colors">
                                    <Globe className="w-4 h-4" /> Target Region
                                </label>
                                <div className="relative">
                                    <input
                                        id="region"
                                        type="text"
                                        placeholder="e.g., North America, EMEA"
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white placeholder-gray-500 transition-all focus:border-pink-500/50 focus:bg-black/40 focus:outline-none focus:ring-4 focus:ring-pink-500/10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-[200%_auto] p-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed animate-gradient-x"
                            >
                                <div className="relative flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <Loader className="h-5 w-5 animate-spin" />
                                            <span>Generating Strategy...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Generate Strategy</span>
                                            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </form>

                    {/* History Section */}
                    <div className="mt-4 flex-1 flex flex-col min-h-0">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2 text-gray-400">
                                <History className="w-4 h-4" />
                                <span className="text-xs font-semibold uppercase tracking-wider">Recent History</span>
                            </div>
                            {history.length > 0 && (
                                <button
                                    onClick={() => {
                                        setHistory([]);
                                        localStorage.removeItem("sales_history");
                                    }}
                                    className="text-[10px] text-red-400 hover:text-red-300 hover:underline transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>

                        {history.length > 0 ? (
                            <div className="flex-1 overflow-y-auto pr-1 space-y-2 hide-scrollbar">
                                {history.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => loadHistoryItem(item)}
                                        className="w-full text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-200 truncate">{item.client}</span>
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span className="truncate max-w-[80px]">{item.industry}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                            <span className="truncate">{item.region}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-2 opacity-50">
                                <History className="w-8 h-8 mb-1" />
                                <span className="text-xs">No history yet</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Result Panel */}
            <div className="flex-1 flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gray-900/40 backdrop-blur-2xl shadow-2xl shadow-black/50 animate-fade-in-up [animation-delay:200ms]">
                <div className="border-b border-white/5 bg-white/5 px-6 py-4 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                <div className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-75"></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-200 tracking-wide">AI Strategy Result</span>
                        </div>
                        {strategy && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-300 transition-colors"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? "Copied" : "Copy"}
                                </button>
                                <button
                                    onClick={handleNewAnalysis}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-xs font-medium text-blue-400 transition-colors"
                                >
                                    <PlusCircle className="w-3.5 h-3.5" />
                                    New Analysis
                                </button>
                                <button
                                    onClick={handleExportPDF}
                                    disabled={exporting}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-xs font-medium text-purple-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {exporting ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
                                    {exporting ? "Exporting..." : "Export PDF"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto md:mx-8 m-4 hide-scrollbar">
                    {!strategy && !loading ? (
                        <div className="flex h-full flex-col items-center justify-center gap-6 text-center opacity-50">
                            <div className="relative rounded-full bg-white/5 p-8 ring-1 ring-white/10">
                                <Bot className="h-12 w-12 text-gray-400" />
                                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl" />
                            </div>
                            <div className="max-w-md space-y-2">
                                <h3 className="text-xl font-semibold text-white">Ready to Generate</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Fill out the form on the left to generate a comprehensive sales strategy tailored to your needs.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8 h-full">
                            {loading ? (
                                <div className="flex h-full flex-col items-center justify-center gap-4">
                                    <div className="relative">
                                        <div className="h-16 w-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles className="h-6 w-6 text-blue-400 animate-pulse" />
                                        </div>
                                    </div>
                                    <p className="text-gray-400 animate-pulse">Analyzing market data...</p>
                                </div>
                            ) : (
                                <div className="animate-fade-in-up">
                                    <MarkdownViewer markdown={strategy || ""} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
