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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,600;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased min-h-screen bg-[#FFFFFF] text-[#000000] font-body selection:bg-[#000000] selection:text-[#FFFFFF]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
