"use client";

import { motion } from "framer-motion";

type PositionKey = "volante" | "lateral" | "meia" | "zagueiro_libero";
export type SectionKind =
  | "funcao_tatica"
  | "fundamentos_tecnicos"
  | "erros_comuns"
  | "treino"
  | "mentalidade";

const MARKERS: { key: PositionKey; label: string; points: [number, number][] }[] = [
  { key: "zagueiro_libero", label: "ZAG", points: [[150, 345]] },
  { key: "lateral", label: "LAT", points: [[45, 300], [255, 300]] },
  { key: "volante", label: "VOL", points: [[150, 250]] },
  { key: "meia", label: "MEI", points: [[150, 150]] },
];

function SectionMotif({ x, y, kind }: { x: number; y: number; kind: SectionKind }) {
  switch (kind) {
    case "fundamentos_tecnicos":
      return (
        <motion.g
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [-2, -34], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        >
          <line x1={x} y1={y} x2={x} y2={y - 26} stroke="var(--gold-light)" strokeWidth={2.5} />
          <polygon
            points={`${x - 5},${y - 24} ${x + 5},${y - 24} ${x},${y - 32}`}
            fill="var(--gold-light)"
          />
        </motion.g>
      );
    case "erros_comuns":
      return (
        <motion.g
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx={x + 18} cy={y - 18} r={9} fill="var(--danger)" opacity={0.15} />
          <text
            x={x + 18}
            y={y - 14}
            textAnchor="middle"
            fontSize="12"
            fontWeight={800}
            fill="var(--danger)"
          >
            !
          </text>
        </motion.g>
      );
    case "treino":
      return (
        <motion.g
          style={{ transformOrigin: `${x}px ${y}px` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <circle cx={x} cy={y - 24} r={2.5} fill="var(--gold-light)" />
          <circle cx={x + 21} cy={y + 12} r={2.5} fill="var(--gold-light)" opacity={0.6} />
          <circle cx={x - 21} cy={y + 12} r={2.5} fill="var(--gold-light)" opacity={0.3} />
        </motion.g>
      );
    case "mentalidade":
      return (
        <motion.circle
          cx={x}
          cy={y}
          r={16}
          fill="none"
          stroke="var(--gold-light)"
          strokeWidth={1.5}
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.9, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
      );
    case "funcao_tatica":
    default:
      return null;
  }
}

export function PositionField({
  active,
  sectionKind,
  onSelect,
}: {
  active: PositionKey;
  sectionKind: SectionKind;
  onSelect: (key: PositionKey) => void;
}) {
  return (
    <svg viewBox="0 0 300 400" className="h-full w-full overflow-visible">
      {/* pitch */}
      <rect
        x="10"
        y="10"
        width="280"
        height="380"
        rx="6"
        fill="var(--surface)"
        stroke="var(--border-light)"
        strokeWidth="2"
      />
      <line x1="10" y1="200" x2="290" y2="200" stroke="var(--border-light)" strokeWidth="1.5" />
      <circle cx="150" cy="200" r="42" fill="none" stroke="var(--border-light)" strokeWidth="1.5" />
      <circle cx="150" cy="200" r="2.5" fill="var(--border-light)" />
      {/* own goal box (bottom) */}
      <rect x="90" y="330" width="120" height="60" fill="none" stroke="var(--border-light)" strokeWidth="1.5" />
      <rect x="120" y="368" width="60" height="22" fill="none" stroke="var(--border-light)" strokeWidth="1.5" />
      {/* attacking goal box (top) */}
      <rect x="90" y="10" width="120" height="60" fill="none" stroke="var(--border-light)" strokeWidth="1.5" />

      {MARKERS.map(({ key, label, points }) =>
        points.map(([x, y], i) => {
          const isActive = key === active;
          return (
            <g
              key={`${key}-${i}`}
              onClick={() => onSelect(key)}
              className="cursor-pointer"
            >
              {isActive && (
                <motion.circle
                  cx={x}
                  cy={y}
                  r={22}
                  fill="var(--gold)"
                  opacity={0.15}
                  animate={{ r: [18, 26, 18] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
              {isActive && <SectionMotif x={x} y={y} kind={sectionKind} />}
              <motion.circle
                layout
                cx={x}
                cy={y}
                r={isActive ? 16 : 12}
                fill={isActive ? "var(--gold)" : "var(--surface-2)"}
                stroke={isActive ? "var(--gold-light)" : "var(--border-light)"}
                strokeWidth={isActive ? 2 : 1.5}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              <text
                x={x}
                y={y + 3.5}
                textAnchor="middle"
                fontSize="8"
                fontWeight={isActive ? 700 : 500}
                fill={isActive ? "#0a0a0a" : "var(--muted)"}
              >
                {label}
              </text>
            </g>
          );
        }),
      )}
    </svg>
  );
}
