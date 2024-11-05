import type { Metadata } from "next";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "Content Creation | GrowStack.ai",
  description:
    "A Next.js and Node.js-based workflow automation system for GrowStack, transitioning from sequential to parallel processing. This project optimizes content creation, formatting, distribution, and engagement tracking across multiple platforms, leveraging concurrency for improved efficiency and faster execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-paper">
      <body className="bg-paper">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
