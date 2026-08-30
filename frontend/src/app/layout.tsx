import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "AI Career Copilot — AI-Powered Job Search Cockpit",
  description: "Next-generation career intelligence platform: multi-version ATS resume scoring, semantic job matching, zero-hallucination bullet optimization, and Kanban application tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased min-h-screen bg-[#070A0F] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
