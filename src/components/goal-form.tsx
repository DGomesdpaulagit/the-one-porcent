"use client";

import { useState, useTransition } from "react";
import { Plus, Loader2 } from "lucide-react";
import { addGoal } from "@/app/(app)/metas/actions";

export function GoalForm() {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const value = text;
    setText("");
    startTransition(async () => {
      await addGoal(value);
    });
  }

  return (
    <form onSubmit={handleAdd} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ex: virar capitão do time"
        className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-gold"
      />
      <button
        type="submit"
        disabled={isPending || !text.trim()}
        className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gold-light disabled:opacity-50"
      >
        {isPending ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
        Nova meta
      </button>
    </form>
  );
}
