import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function StyledMarkdownViewer({
    markdown,
}: {
    markdown: string;
}) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-6 mt-4 tracking-tight text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-purple-400 to-pink-400">
                        {children}
                    </h1>
                ),

                h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-blue-400 mt-8 mb-4 tracking-tight border-b border-blue-500/20 pb-2">
                        {children}
                    </h2>
                ),

                h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-purple-400 mt-6 mb-3">
                        {children}
                    </h3>
                ),

                p: ({ children }) => (
                    <p className="text-gray-300 text-[15px] leading-7 mb-4">
                        {children}
                    </p>
                ),

                ul: ({ children }) => (
                    <ul className="my-4 pl-6 space-y-2 list-disc marker:text-pink-500">
                        {children}
                    </ul>
                ),

                ol: ({ children }) => (
                    <ol className="my-4 pl-6 space-y-2 list-decimal marker:text-blue-500 text-gray-300">
                        {children}
                    </ol>
                ),

                li: ({ children }) => (
                    <li className="text-gray-300 leading-relaxed pl-1">
                        {children}
                    </li>
                ),

                strong: ({ children }) => (
                    <strong className="font-semibold text-teal-400">
                        {children}
                    </strong>
                ),

                blockquote: ({ children }) => (
                    <blockquote className="my-6 pl-6 border-l-4 border-blue-500 bg-blue-500/10 py-2 pr-4 rounded-r-lg text-gray-300 italic">
                        {children}
                    </blockquote>
                ),

                code: ({ children }) => (
                    <code className="bg-purple-500/15 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono border border-purple-500/20">
                        {children}
                    </code>
                ),

                pre: ({ children }) => (
                    <pre className="bg-[#1a1b26] border border-white/10 rounded-xl p-4 my-6 overflow-x-auto">
                        {children}
                    </pre>
                ),

                table: ({ children }) => (
                    <div className="my-8 overflow-x-auto rounded-xl border border-white/10 shadow-lg shadow-blue-500/5">
                        <table className="w-full text-sm text-left">
                            {children}
                        </table>
                    </div>
                ),

                thead: ({ children }) => (
                    <thead className="bg-white/5 text-blue-300 uppercase text-xs font-bold tracking-wider">
                        {children}
                    </thead>
                ),

                tbody: ({ children }) => (
                    <tbody className="divide-y divide-white/5">
                        {children}
                    </tbody>
                ),

                th: ({ children }) => (
                    <th className="px-6 py-4 font-semibold border-b border-white/10">{children}</th>
                ),

                td: ({ children }) => (
                    <td className="px-6 py-4 text-gray-400">{children}</td>
                ),

                tr: ({ children }) => (
                    <tr className="hover:bg-white/5 transition-colors">{children}</tr>
                ),

                a: ({ children, href }) => (
                    <a href={href} target="_blank" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-400/30 transition-colors">
                        {children}
                    </a>
                ),
            }}
        >
            {markdown}
        </ReactMarkdown>
    );
}
