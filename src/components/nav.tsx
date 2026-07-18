"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Início" },
  { href: "/curso", label: "Curso" },
  { href: "/posicoes", label: "Posições" },
  { href: "/perfil", label: "Perfil" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <span className="font-semibold tracking-wide text-gold">
          Protocolo Ouro
        </span>
        <div className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "text-gold-light"
                  : "text-muted hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-muted hover:text-foreground"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
