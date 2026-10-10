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
                    <h1 className="font-serif text-3xl font-semibold mb-6 mt-4 tracking-tight text-stone-900">
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className="font-serif text-2xl font-semibold text-stone-900 mt-8 mb-4 border-b border-stone-200 pb-2">
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-stone-900 mt-6 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                    <p className="text-stone-700 text-[15px] leading-7 mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                    <ul className="my-4 pl-6 space-y-2 list-disc marker:text-stone-400">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="my-4 pl-6 space-y-2 list-decimal marker:text-stone-400 text-stone-700">{children}</ol>
                ),
                li: ({ children }) => (
                    <li className="text-stone-700 leading-relaxed pl-1">{children}</li>
                ),
                strong: ({ children }) => (
                    <strong className="font-semibold text-stone-900">{children}</strong>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="my-6 pl-5 border-l-2 border-stone-400 text-stone-600 italic">
                        {children}
                    </blockquote>
                ),
                code: ({ children }) => (
                    <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded text-sm font-mono">
                        {children}
                    </code>
                ),
                pre: ({ children }) => (
                    <pre className="bg-stone-100 border border-stone-200 rounded-md p-4 my-6 overflow-x-auto">
                        {children}
                    </pre>
                ),
                table: ({ children }) => (
                    <div className="my-8 overflow-x-auto rounded-md border border-stone-200">
                        <table className="w-full text-sm text-left">{children}</table>
                    </div>
                ),
                thead: ({ children }) => (
                    <thead className="bg-stone-50 text-stone-600 text-xs font-semibold">{children}</thead>
                ),
                tbody: ({ children }) => (
                    <tbody className="divide-y divide-stone-200">{children}</tbody>
                ),
                th: ({ children }) => (
                    <th className="px-4 py-3 font-semibold border-b border-stone-200">{children}</th>
                ),
                td: ({ children }) => <td className="px-4 py-3 text-stone-700">{children}</td>,
                tr: ({ children }) => <tr>{children}</tr>,
                a: ({ children, href }) => (
                    <a href={href} target="_blank" className="text-stone-900 underline underline-offset-4 decoration-stone-400 hover:decoration-stone-900 transition-colors">
                        {children}
                    </a>
                ),
            }}
        >
            {markdown}
        </ReactMarkdown>
    );
}
