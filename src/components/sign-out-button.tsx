"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm text-muted transition hover:border-danger/50 hover:text-danger"
    >
      <LogOut size={15} />
      Sair da conta
    </button>
  );
}
