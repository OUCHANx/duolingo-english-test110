import type { Metadata, Viewport } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "DET 110 — 学習管理",
  description:
    "Duolingo English Test 110達成のための毎日の学習管理・弱点分析・進捗管理アプリ",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="font-sans text-ink antialiased">
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
