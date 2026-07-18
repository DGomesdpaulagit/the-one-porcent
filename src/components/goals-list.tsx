"use client";

import { useState, useTransition } from "react";
import { addGoal, toggleGoal, deleteGoal } from "@/app/perfil/actions";

type Goal = {
  id: string;
  text: string;
  achieved: boolean;
  created_at: string;
};

export function GoalsList({ goals }: { goals: Goal[] }) {
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
    <div className="flex flex-col gap-3">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex: virar capitão do time"
          className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={isPending || !text.trim()}
          className="rounded bg-gold px-4 py-2 text-sm font-semibold text-black transition hover:bg-gold-light disabled:opacity-50"
        >
          Adicionar
        </button>
      </form>

      {goals.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma meta ainda.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {goals.map((goal) => (
            <li
              key={goal.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <label className="flex flex-1 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={goal.achieved}
                  onChange={(e) =>
                    startTransition(() => toggleGoal(goal.id, e.target.checked))
                  }
                  className="h-4 w-4 accent-gold"
                />
                <span className={goal.achieved ? "text-muted line-through" : ""}>
                  {goal.text}
                </span>
              </label>
              <button
                onClick={() => startTransition(() => deleteGoal(goal.id))}
                className="text-xs text-muted hover:text-foreground"
                aria-label="Remover meta"
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
