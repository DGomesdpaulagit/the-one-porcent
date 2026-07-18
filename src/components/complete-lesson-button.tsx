"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { markLessonCompleted } from "@/app/(app)/curso/[id]/actions";
import { playSuccessChime, primeAudio } from "@/lib/sound";

export function CompleteLessonButton({
  lessonId,
  nextLessonId,
  alreadyCompleted,
}: {
  lessonId: number;
  nextLessonId: number | null;
  alreadyCompleted: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(alreadyCompleted);

  function handleClick() {
    primeAudio();
    startTransition(async () => {
      await markLessonCompleted(lessonId);
      setDone(true);
      playSuccessChime();
      router.refresh();
    });
  }

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 text-gold-light">
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
            >
              <CheckCircle2 size={20} />
            </motion.span>
            <p className="text-sm font-medium">Lição concluída</p>
          </div>
          {nextLessonId && (
            <button
              onClick={() => router.push(`/curso/${nextLessonId}`)}
              className="group inline-flex w-fit items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gold-light"
            >
              Próxima lição
              <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          )}
        </motion.div>
      ) : (
        <motion.button
          key="pending"
          onClick={handleClick}
          disabled={isPending}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gold-light disabled:opacity-60"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          {isPending ? "Salvando..." : "Marcar como concluída"}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
