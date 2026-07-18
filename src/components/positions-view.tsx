"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Compass,
  Wrench,
  AlertTriangle,
  Dumbbell,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PositionField, type SectionKind } from "@/components/position-field";

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
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const activeRows = rows
    .filter((r) => r.position === active)
    .sort((a, b) => a.order_in_position - b.order_in_position);

  useEffect(() => {
    setStep(0);
  }, [active]);

  const current = activeRows[step];
  const meta = current
    ? (SECTION_META[current.section] ?? { label: current.section, icon: Compass })
    : null;

  function goTo(next: number) {
    if (next < 0 || next >= activeRows.length) return;
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  function selectPosition(pos: PositionKey) {
    setDirection(1);
    setActive(pos);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex flex-col items-center gap-4 p-5 md:flex-row md:items-stretch">
        <div className="mx-auto w-full max-w-[220px] md:mx-0 md:w-56 md:shrink-0">
          <PositionField
            active={active}
            sectionKind={(current?.section as SectionKind) ?? "funcao_tatica"}
            onSelect={selectPosition}
          />
        </div>

        <div className="flex flex-1 flex-wrap content-center gap-2">
          {POSITIONS.map((pos) => (
            <button
              key={pos}
              onClick={() => selectPosition(pos)}
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

      {current && meta && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-1.5">
            {activeRows.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir para etapa ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-6 bg-gold" : "w-1.5 bg-border-light"
                }`}
              />
            ))}
          </div>

          <div className="relative flex items-center gap-2">
            <button
              onClick={() => goTo(step - 1)}
              disabled={step === 0}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition hover:border-gold hover:text-gold-light disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${active}-${step}`}
                  custom={direction}
                  initial={{ opacity: 0, x: 40 * direction }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 * direction }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="card min-h-[220px] p-5 md:p-7"
                >
                  <div className="mb-4 flex items-center gap-2.5 text-gold">
                    <meta.icon size={20} />
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-muted">
                        Etapa {step + 1} de {activeRows.length}
                      </p>
                      <p className="text-sm font-semibold uppercase tracking-wide">
                        {meta.label}
                      </p>
                    </div>
                  </div>
                  <p className="text-[15px] leading-relaxed text-foreground/90">
                    {current.content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={() => goTo(step + 1)}
              disabled={step === activeRows.length - 1}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted transition hover:border-gold hover:text-gold-light disabled:pointer-events-none disabled:opacity-0"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
