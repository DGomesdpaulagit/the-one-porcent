"use client";

import { motion } from "framer-motion";

type PositionKey = "volante" | "lateral" | "meia" | "zagueiro_libero";

const MARKERS: { key: PositionKey; label: string; points: [number, number][] }[] = [
  { key: "zagueiro_libero", label: "ZAG", points: [[150, 345]] },
  { key: "lateral", label: "LAT", points: [[45, 300], [255, 300]] },
  { key: "volante", label: "VOL", points: [[150, 250]] },
  { key: "meia", label: "MEI", points: [[150, 150]] },
];

export function PositionField({
  active,
  onSelect,
}: {
  active: PositionKey;
  onSelect: (key: PositionKey) => void;
}) {
  return (
    <svg viewBox="0 0 300 400" className="h-full w-full">
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
