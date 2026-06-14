"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  match?: (path: string) => boolean;
}

const BOTTOM_NAV: NavItem[] = [
  { href: "/", label: "ホーム", icon: "🏠", match: (p) => p === "/" },
  {
    href: "/practice/reading",
    label: "演習",
    icon: "📝",
    match: (p) => p.startsWith("/practice"),
  },
  { href: "/log", label: "記録", icon: "➕", match: (p) => p.startsWith("/log") },
  {
    href: "/analysis",
    label: "分析",
    icon: "📊",
    match: (p) => p.startsWith("/analysis"),
  },
  {
    href: "/review",
    label: "復習",
    icon: "🔁",
    match: (p) => p.startsWith("/review"),
  },
];

const SIDE_NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "ホーム",
    items: [{ href: "/", label: "ダッシュボード", icon: "🏠", match: (p) => p === "/" }],
  },
  {
    section: "演習（アプリ内）",
    items: [
      {
        href: "/practice/reading",
        label: "Reading",
        icon: "📖",
        match: (p) => p.startsWith("/practice/reading"),
      },
      {
        href: "/practice/listening",
        label: "Listening",
        icon: "🎧",
        match: (p) => p.startsWith("/practice/listening"),
      },
      {
        href: "/vocab",
        label: "単語帳",
        icon: "📚",
        match: (p) => p.startsWith("/vocab"),
      },
    ],
  },
  {
    section: "記録",
    items: [
      {
        href: "/speaking",
        label: "Cambly（Speaking）",
        icon: "🗣️",
        match: (p) => p.startsWith("/speaking"),
      },
      {
        href: "/writing",
        label: "ChatGPT（Writing）",
        icon: "✍️",
        match: (p) => p.startsWith("/writing"),
      },
      {
        href: "/log",
        label: "学習ログ",
        icon: "📒",
        match: (p) => p.startsWith("/log"),
      },
    ],
  },
  {
    section: "分析・進捗",
    items: [
      {
        href: "/analysis",
        label: "弱点分析",
        icon: "📊",
        match: (p) => p.startsWith("/analysis"),
      },
      {
        href: "/progress",
        label: "スコア進捗",
        icon: "📈",
        match: (p) => p.startsWith("/progress"),
      },
      {
        href: "/review",
        label: "復習リスト",
        icon: "🔁",
        match: (p) => p.startsWith("/review"),
      },
    ],
  },
  {
    section: "設定",
    items: [
      {
        href: "/settings",
        label: "目標・設定",
        icon: "⚙️",
        match: (p) => p.startsWith("/settings"),
      },
    ],
  },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const isActive = (item: NavItem) =>
    item.match ? item.match(pathname) : pathname === item.href;

  return (
    <div className="mx-auto flex w-full max-w-6xl">
      {/* ===== サイドナビ（PC）===== */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-surface-border bg-white px-3 py-5 lg:flex">
        <Link href="/" className="mb-6 flex items-center gap-2 px-2">
          <span className="text-xl">🎯</span>
          <div>
            <div className="text-sm font-bold leading-tight text-ink">DET 110</div>
            <div className="text-[11px] text-ink-faint">学習管理ツール</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-4 overflow-y-auto">
          {SIDE_NAV.map((group) => (
            <div key={group.section}>
              <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                {group.section}
              </div>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium transition ${
                      isActive(item)
                        ? "bg-brand-50 text-brand-700"
                        : "text-ink-soft hover:bg-surface-muted"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* ===== メイン ===== */}
      <div className="flex min-h-screen w-full flex-col">
        {/* モバイル用ヘッダー */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="text-sm font-bold text-ink">DET 110</span>
          </Link>
          <Link
            href="/settings"
            className="text-ink-faint hover:text-ink"
            aria-label="設定"
          >
            ⚙️
          </Link>
        </header>

        <main className="w-full flex-1 px-4 pb-24 pt-4 lg:px-8 lg:pb-10">
          <div className="mx-auto w-full max-w-2xl lg:max-w-3xl">{children}</div>
        </main>
      </div>

      {/* ===== ボトムナビ（モバイル）===== */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch border-t border-surface-border bg-white/95 backdrop-blur lg:hidden">
        {BOTTOM_NAV.map((item) => {
          const active = isActive(item);
          const center = item.label === "記録";
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2"
            >
              <span
                className={`flex items-center justify-center text-lg ${
                  center
                    ? "h-9 w-9 rounded-full bg-brand-600 text-white shadow-float"
                    : active
                      ? "text-brand-600"
                      : "text-ink-faint"
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${active ? "text-brand-700" : "text-ink-faint"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
