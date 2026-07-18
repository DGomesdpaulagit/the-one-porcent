"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  Wrench,
  AlertTriangle,
  Dumbbell,
  Brain,
} from "lucide-react";
import { PositionField } from "@/components/position-field";

type PositionContent = {
  position: string;
  section: string;
  order_in_position: number;
  content: string;
};

type PositionKey = "volante" | "lateral" | "meia" | "zagueiro_libero";

const POSITIONS: PositionKey[] = ["volante", "lateral", "meia", "zagueiro_libero"];

const POSITION_LABEL: Record<PositionKey, string> = {
  volante: "Volante",
  lateral: "Lateral",
  meia: "Meia",
  zagueiro_libero: "Zagueiro / Líbero",
};

const SECTION_META: Record<string, { label: string; icon: typeof Compass }> = {
  funcao_tatica: { label: "Função tática", icon: Compass },
  fundamentos_tecnicos: { label: "Fundamentos técnicos", icon: Wrench },
  erros_comuns: { label: "Erros comuns e correção", icon: AlertTriangle },
  treino: { label: "Exercícios de treino", icon: Dumbbell },
  mentalidade: { label: "Aspectos mentais da posição", icon: Brain },
};

export function PositionsView({ rows }: { rows: PositionContent[] }) {
  const searchParams = useSearchParams();
  const initial = searchParams.get("pos");
  const [active, setActive] = useState<PositionKey>(
    POSITIONS.includes(initial as PositionKey) ? (initial as PositionKey) : POSITIONS[0],
  );

  const activeRows = rows
    .filter((r) => r.position === active)
    .sort((a, b) => a.order_in_position - b.order_in_position);

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex flex-col items-center gap-4 p-5 md:flex-row md:items-stretch">
        <div className="mx-auto w-full max-w-[220px] md:mx-0 md:w-56 md:shrink-0">
          <PositionField active={active} onSelect={setActive} />
        </div>

        <div className="flex flex-1 flex-wrap content-center gap-2">
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              onClick={() => setActive(pos)}
              className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm transition ${
                active === pos
                  ? "border-gold bg-gold font-semibold text-black"
                  : "border-border text-muted hover:border-border-light hover:text-foreground"
              }`}
            >
              {POSITION_LABEL[pos]}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          {activeRows.map((row, i) => {
            const meta = SECTION_META[row.section] ?? { label: row.section, icon: Compass };
            const Icon = meta.icon;
            return (
              <motion.div
                key={row.section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="card p-4 md:p-5"
              >
                <div className="mb-2.5 flex items-center gap-2 text-gold">
                  <Icon size={16} />
                  <p className="text-xs font-semibold uppercase tracking-wide">
                    {meta.label}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {row.content}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
