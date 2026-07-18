"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Lock,
  Trophy,
  Repeat,
  X,
  ChevronDown,
} from "lucide-react";
import { toggleGoal, deleteGoal, toggleStep } from "@/app/(app)/metas/actions";

type Step = {
  id: string;
  kind: "milestone" | "practice";
  order_index: number;
  title: string;
  description: string;
  completed: boolean;
};

type Goal = {
  id: string;
  text: string;
  achieved: boolean;
  created_at: string;
};

export function GoalCard({ goal, steps }: { goal: Goal; steps: Step[] }) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(!goal.achieved);

  const milestones = steps
    .filter((s) => s.kind === "milestone")
    .sort((a, b) => a.order_index - b.order_index);
  const practices = steps
    .filter((s) => s.kind === "practice")
    .sort((a, b) => a.order_index - b.order_index);

  const completedCount = milestones.filter((m) => m.completed).length;
  let unlockedNext = true;

  return (
    <motion.div layout className="card overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex flex-1 items-center gap-3 text-left"
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              goal.achieved ? "bg-gold text-black" : "bg-surface-2 text-gold"
            }`}
          >
            <Trophy size={15} />
          </span>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium ${goal.achieved ? "text-muted line-through" : ""}`}>
              {goal.text}
            </p>
            {milestones.length > 0 && (
              <p className="text-xs text-muted">
                {completedCount}/{milestones.length} etapas concluídas
              </p>
            )}
          </div>
          <ChevronDown
            size={16}
            className={`shrink-0 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
        <button
          onClick={() => startTransition(() => deleteGoal(goal.id))}
          className="shrink-0 text-muted transition hover:text-danger"
          aria-label="Remover meta"
        >
          <X size={15} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-5 border-t border-border p-4">
              {milestones.length > 0 && (
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gold">
                    Seu caminho até lá
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {milestones.map((m) => {
                      const isUnlocked = unlockedNext;
                      if (!m.completed) unlockedNext = false;
                      const Icon = m.completed ? CheckCircle2 : isUnlocked ? Circle : Lock;

                      return (
                        <li
                          key={m.id}
                          className={`flex gap-3 rounded-lg border p-3 transition ${
                            m.completed
                              ? "border-gold/30 bg-gold/5"
                              : isUnlocked
                                ? "border-border-light bg-surface-2/40"
                                : "border-border opacity-40"
                          }`}
                        >
                          <button
                            disabled={!isUnlocked || isPending}
                            onClick={() =>
                              startTransition(() => toggleStep(m.id, !m.completed))
                            }
                            className="mt-0.5 shrink-0 disabled:cursor-not-allowed"
                          >
                            <Icon
                              size={17}
                              className={m.completed ? "text-gold" : isUnlocked ? "text-muted" : "text-muted-2"}
                            />
                          </button>
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{m.title}</p>
                            {isUnlocked && (
                              <p className="mt-0.5 text-xs leading-relaxed text-muted">
                                {m.description}
                              </p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {practices.length > 0 && (
                <div>
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
                    <Repeat size={12} />
                    Práticas contínuas
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {practices.map((p) => (
                      <li
                        key={p.id}
                        className="rounded-lg border border-border bg-surface-2/40 p-3"
                      >
                        <p className="text-sm font-medium">{p.title}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted">
                          {p.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!goal.achieved && (
                <button
                  onClick={() => startTransition(() => toggleGoal(goal.id, true))}
                  className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold text-gold-light transition hover:bg-gold/10"
                >
                  <Trophy size={13} />
                  Marcar meta como conquistada
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
