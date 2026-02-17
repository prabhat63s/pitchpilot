import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SECTION_HEADER_REGEXES = [
    /(^|\n)##\s*1\.\s/i,
    /(^|\n)##\s*2\.\s/i,
    /(^|\n)##\s*3\.\s/i,
    /(^|\n)##\s*4\.\s/i,
    /(^|\n)##\s*5\.\s/i,
    /(^|\n)##\s*6\.\s/i,
    /(^|\n)##\s*7\.\s/i,
    /(^|\n)##\s*8\.\s/i,
    /(^|\n)##\s*9\.\s/i,
    /(^|\n)##\s*10\.\s/i,
];

function buildPrompt(industry: string, client: string, region: string, year: number) {
    return `
You are a senior enterprise sales strategist with 20+ years of experience in the ${industry} sector.

Create a comprehensive, executive-ready sales strategy for ${client} in ${region}. Output exactly 10 sections in order, using Markdown headings.

Format strictly as:
## 1. Executive Summary
## 2. Market Opportunity Overview (to ${year})
## 3. Target Customer Persona
## 4. Competitive Landscape
## 5. Value Proposition & Differentiators
## 6. Sales Funnel & Go-to-Market Tactics
## 7. Revenue Forecast & KPIs
## 8. Implementation Roadmap
## 9. Risk Mitigation Strategies
## 10. Next Steps & Recommendations

Guidelines:
- Executive tone, concise but specific.
- Use bullets where helpful.
- Include plausible metrics/KPIs and ${year} trends; state assumptions where needed.
- Avoid generic advice; provide practical actions.
`.trim();
}

function hasAllSections(markdown: string) {
    return SECTION_HEADER_REGEXES.every((re) => re.test(markdown));
}

export async function POST(request: Request) {
    try {
        const { industry, client, region } = await request.json();

        if (!industry || !client || !region) {
            return NextResponse.json(
                { error: "Missing required fields: industry, client, region" },
                { status: 400 }
            );
        }

        const currentYear = new Date().getFullYear();
        const forecastYear = currentYear + 1;
        const prompt = buildPrompt(industry, client, region, forecastYear);

        const response = await openai.responses.create({
            model: "gpt-5-mini-2025-08-07",
            input: [
                { role: "system", content: "Follow instructions exactly." },
                { role: "user", content: prompt },
            ],
            max_output_tokens: 3000,
        });

        let strategyMarkdown = response.output_text?.trim() ?? "";

        if (!strategyMarkdown) {
            console.error("Empty strategy returned from model:", response);
            return NextResponse.json(
                { error: "Empty response from model" },
                { status: 502 }
            );
        }

        if (!hasAllSections(strategyMarkdown)) {
            const repair = await openai.responses.create({
                model: "gpt-5-mini-2025-08-07",
                input: [
                    {
                        role: "system",
                        content:
                            "Fix formatting and completeness. Output 10 numbered sections only.",
                    },
                    {
                        role: "user",
                        content:
                            "Rewrite the draft to include ALL 10 sections in order using the exact headings format shown below. Preserve good content, add missing sections with reasonable assumptions.\n\nHeadings:\n## 1. Executive Summary\n## 2. Market Opportunity Overview (to " +
                            forecastYear +
                            ")\n## 3. Target Customer Persona\n## 4. Competitive Landscape\n## 5. Value Proposition & Differentiators\n## 6. Sales Funnel & Go-to-Market Tactics\n## 7. Revenue Forecast & KPIs\n## 8. Implementation Roadmap\n## 9. Risk Mitigation Strategies\n## 10. Next Steps & Recommendations\n\nDRAFT:\n" +
                            strategyMarkdown,
                    },
                ],
                max_output_tokens: 3000,
            });

            const repaired = repair.output_text?.trim() ?? "";
            if (repaired) strategyMarkdown = repaired;
        }

        return NextResponse.json({
            strategy_markdown: strategyMarkdown,
            meta: {
                generated_for_year: forecastYear,
                generated_at: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("Error generating sales strategy:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
