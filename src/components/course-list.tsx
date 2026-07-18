"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain, Compass, Target, HeartPulse, Lock, CircleCheck, Circle } from "lucide-react";
import type { LessonWithStatus } from "@/lib/lessons";

const BLOCK_ICON: Record<number, typeof Brain> = {
  1: Brain,
  2: Compass,
  3: Target,
  4: HeartPulse,
};

export function CourseList({
  blocks,
}: {
  blocks: { block: number; name: string; lessons: LessonWithStatus[] }[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map(({ block, name, lessons }, blockIndex) => {
        const Icon = BLOCK_ICON[block] ?? Brain;
        const completed = lessons.filter((l) => l.status === "completed").length;

        return (
          <motion.section
            key={block}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: blockIndex * 0.08, ease: "easeOut" }}
            className="card overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-border bg-surface-2/40 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <Icon size={17} className="text-gold" />
                <h2 className="text-sm font-semibold">
                  Bloco {block} — {name}
                </h2>
              </div>
              <span className="text-xs text-muted">
                {completed}/{lessons.length}
              </span>
            </div>

            <div className="flex flex-col">
              {lessons.map((lesson, i) => {
                const isLocked = lesson.status === "locked";
                const StatusIcon =
                  lesson.status === "completed"
                    ? CircleCheck
                    : lesson.status === "locked"
                      ? Lock
                      : Circle;

                const row = (
                  <div
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isLocked ? "opacity-40" : "hover:bg-surface-2/60"
                    } ${i !== 0 ? "border-t border-border/60" : ""}`}
                  >
                    <StatusIcon
                      size={16}
                      className={
                        lesson.status === "completed"
                          ? "shrink-0 text-gold"
                          : "shrink-0 text-muted"
                      }
                    />
                    <span className="flex-1">{lesson.title}</span>
                  </div>
                );

                return isLocked ? (
                  <div key={lesson.id}>{row}</div>
                ) : (
                  <Link key={lesson.id} href={`/curso/${lesson.id}`}>
                    {row}
                  </Link>
                );
              })}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
