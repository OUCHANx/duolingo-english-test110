"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-700",
  secondary:
    "bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-100",
  ghost: "bg-transparent text-ink-soft hover:bg-surface-muted",
  danger: "bg-danger text-white hover:opacity-90",
  success: "bg-accent-500 text-white hover:bg-accent-600",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  leftIcon,
  children,
  className = "",
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {leftIcon}
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  fullWidth,
  leftIcon,
  children,
  className = "",
}: BaseProps & { href: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {leftIcon}
      {children}
    </Link>
  );
}
