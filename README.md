# 🚀 Sales Agent Demo

A premium, AI-driven sales strategy generator built with **Next.js 15** and **Tailwind CSS 4**. This application empowers sales teams and business owners to generate comprehensive, data-driven sales strategies in seconds.


## ✨ Features

- **🧠 AI-Powered Analysis**: Leverages OpenAI's advanced models to generate deep market insights and strategic recommendations.
- **📊 Comprehensive Reports**: Generates detailed sections including:
  - Executive Summary
  - Market Analysis & Trends
  - Ideal Customer Personas
  - Competitive Landscape
  - Go-to-Market Tactics
  - Revenue Forecasts
  - Risk Mitigation Strategies
- **📄 Professional PDF Export**: Download your generated strategies as beautifully formatted PDF documents.
- **📜 History Management**: Automatically saves your recent analyses to local storage for quick access.
- **🎨 Premium UI/UX**: Features a modern, glassmorphic dark-themed interface with smooth animations and responsive design.
- **📋 Smart Copy**: One-click copy functionality that cleans up markdown for easy pasting into emails or documents.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/)
- **AI Integration**: [OpenAI API](https://openai.com/api/)
- **Content Rendering**: [React Markdown](https://github.com/remarkjs/react-markdown), [Remark GFM](https://github.com/remarkjs/remark-gfm)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/AI-Sales-Agent-demo.git
   cd AI-Sales-Agent-demo
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your OpenAI API key:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Open the app:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```text
src/
├── app/
│   ├── api/            # Backend API routes (AI processing)
│   ├── components/     # Reusable UI components (SalesForm, MarkdownViewer)
│   ├── dashboard/      # Main application dashboard
│   ├── layout.tsx      # Root layout with fonts and providers
│   └── page.tsx        # Landing page
├── public/             # Static assets (images, icons)
└── ...                 # Configuration files (Tailwind, TypeScript, ESLint)
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
