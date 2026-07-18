"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setMessage(
        "Conta criada. Verifique seu e-mail para confirmar antes de entrar.",
      );
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="card w-full max-w-sm p-7"
      >
        <h1 className="mb-1 text-2xl font-extrabold tracking-tight">
          <span className="gold-text-gradient">THE ONE</span> PORCENT
        </h1>
        <p className="mb-6 text-sm text-muted">
          {mode === "signin" ? "Entre na sua conta" : "Crie sua conta"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-gold"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-gold"
          />

          {error && <p className="text-sm text-danger">{error}</p>}
          {message && <p className="text-sm text-gold-light">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-3 py-2.5 text-sm font-semibold text-black transition hover:bg-gold-light disabled:opacity-50"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading
              ? "Aguarde..."
              : mode === "signin"
                ? "Entrar"
                : "Criar conta"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setMessage(null);
          }}
          className="mt-4 text-sm text-muted transition hover:text-foreground"
        >
          {mode === "signin"
            ? "Não tem conta? Criar uma"
            : "Já tem conta? Entrar"}
        </button>
      </motion.div>
    </div>
  );
}
