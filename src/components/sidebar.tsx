"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BookOpen, Compass, Target, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Início", mobileLabel: "Início", icon: Home },
  { href: "/curso", label: "Curso", mobileLabel: "Curso", icon: BookOpen },
  { href: "/posicoes", label: "Posições", mobileLabel: "Posições", icon: Compass },
  { href: "/metas", label: "Metas", mobileLabel: "Metas", icon: Target },
  { href: "/configuracoes", label: "Configurações", mobileLabel: "Config.", icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:shrink-0 md:flex-col md:border-r md:border-border md:bg-surface/40 md:backdrop-blur-sm">
        <div className="px-5 py-6">
          <span className="text-lg font-extrabold tracking-tight">
            <span className="gold-text-gradient">THE ONE</span>{" "}
            <span className="text-foreground">PORCENT</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors"
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-gold/10 ring-1 ring-gold/30"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon
                  size={18}
                  className={`relative ${active ? "text-gold-light" : "text-muted"}`}
                />
                <span
                  className={`relative ${active ? "font-medium text-gold-light" : "text-foreground/80"}`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-3 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile top brand bar */}
      <header className="flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <span className="text-base font-extrabold tracking-tight">
          <span className="gold-text-gradient">THE ONE</span> PORCENT
        </span>
        <button
          onClick={handleLogout}
          aria-label="Sair"
          className="text-muted hover:text-foreground"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-surface/95 backdrop-blur md:hidden">
        {links.map((link) => {
          const active = isActive(pathname, link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px]"
            >
              {active && (
                <motion.span
                  layoutId="mobile-active"
                  className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-gold"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <Icon size={20} className={active ? "text-gold-light" : "text-muted"} />
              <span className={`truncate ${active ? "text-gold-light" : "text-muted"}`}>
                {link.mobileLabel}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
