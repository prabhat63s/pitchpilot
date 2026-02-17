import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Load the Poppins font
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Sales Strategy Dashboard",
  description: "Generate custom AI-powered sales strategies for your clients",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased bg-white text-black`}
      >
          {children}
      </body>
    </html>
  );
}
