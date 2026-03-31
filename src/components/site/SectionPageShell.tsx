import type { ReactNode } from "react";
import Navbar from "@/components/sections/Navbar";

type SectionPageShellProps = {
  children: ReactNode;
};

export default function SectionPageShell({ children }: SectionPageShellProps) {
  return (
    <main className="site-shell relative min-h-screen bg-[var(--color-bg)]">
      <div className="site-ambient" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>
      <Navbar />
      <div className="relative z-10 pt-20 sm:pt-24">{children}</div>
    </main>
  );
}
