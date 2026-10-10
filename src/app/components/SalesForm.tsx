"use client"

import { useState, useRef, useEffect } from "react";
import MarkdownViewer from "./MarkdownViewer";
import Link from "next/link";
import { Loader, Copy, Check, Plus, ArrowUp, FileDown } from "lucide-react";
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
    const [prompt, setPrompt] = useState<{ industry: string; client: string; region: string } | null>(null);
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
        setPrompt({ industry: item.industry, client: item.client, region: item.region });
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
        setPrompt(null);
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
        setPrompt({ industry, client, region });

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

    const fieldCls =
        "w-full bg-transparent px-3 py-2 text-sm text-stone-900 placeholder-stone-400 focus:outline-none";
    const iconBtn =
        "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors disabled:opacity-50";

    return (
        <div className="flex h-screen bg-white text-stone-900">
            {/* Sidebar */}
            <aside className="hidden md:flex w-65 shrink-0 flex-col bg-stone-50 border-r border-stone-200 p-3">
                <Link href="/" className="px-3 py-2 font-serif text-lg font-semibold">PitchPilot</Link>
                <button
                    onClick={handleNewAnalysis}
                    className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-stone-200/60 transition-colors"
                >
                    <Plus className="h-4 w-4" /> New strategy
                </button>

                <div className="mt-6 flex items-center justify-between px-3 text-xs text-stone-500">
                    <span>Recent</span>
                    {history.length > 0 && (
                        <button
                            onClick={() => {
                                setHistory([]);
                                localStorage.removeItem("sales_history");
                            }}
                            className="hover:text-red-600 transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <div className="mt-1 flex-1 overflow-y-auto hide-scrollbar">
                    {history.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => loadHistoryItem(item)}
                            className="w-full truncate rounded-lg px-3 py-2 text-left text-sm hover:bg-stone-200/60 transition-colors"
                        >
                            {item.client} · {item.industry}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Chat */}
            <section className="flex min-w-0 flex-1 flex-col">
                <div className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-3xl px-4 py-8">
                        {!prompt ? (
                            <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">
                                <h1 className="font-serif text-3xl md:text-4xl">What are we pitching today?</h1>
                                <p className="mt-3 text-stone-500">
                                    Enter an industry, client and region below to build a sales strategy.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex justify-end">
                                    <div className="max-w-[80%] rounded-3xl bg-stone-100 px-5 py-3 text-[15px]">
                                        Build a sales strategy for <b>{prompt.client}</b> in the{" "}
                                        <b>{prompt.industry}</b> industry, targeting <b>{prompt.region}</b>.
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="flex items-center gap-2 text-sm text-stone-500">
                                        <Loader className="h-4 w-4 animate-spin" /> Analyzing market data...
                                    </div>
                                ) : (
                                    strategy && (
                                        <div>
                                            <MarkdownViewer markdown={strategy} />
                                            <div className="mt-2 flex gap-1">
                                                <button onClick={handleCopy} className={iconBtn}>
                                                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                                    {copied ? "Copied" : "Copy"}
                                                </button>
                                                <button onClick={handleExportPDF} disabled={exporting} className={iconBtn}>
                                                    {exporting ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <FileDown className="h-3.5 w-3.5" />}
                                                    {exporting ? "Exporting..." : "Export PDF"}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Composer */}
                <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl px-4 pb-6">
                    <div className="flex items-center gap-2 rounded-3xl border border-stone-300 bg-white py-2 pl-3 pr-2 shadow-sm focus-within:border-stone-400">
                        <div className="grid flex-1 divide-stone-200 sm:grid-cols-3 sm:divide-x">
                            <input
                                ref={industryRef}
                                aria-label="Industry"
                                placeholder="Industry, e.g. SaaS"
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className={fieldCls}
                                required
                            />
                            <input
                                aria-label="Client name"
                                placeholder="Client, e.g. Acme Corp"
                                value={client}
                                onChange={(e) => setClient(e.target.value)}
                                className={fieldCls}
                                required
                            />
                            <input
                                aria-label="Target region"
                                placeholder="Region, e.g. EMEA"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className={fieldCls}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            aria-label="Generate strategy"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white hover:bg-stone-700 transition-colors disabled:opacity-40"
                        >
                            <ArrowUp className="h-4 w-4" />
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
