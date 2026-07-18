import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { withStatus, BLOCK_NAMES } from "@/lib/lessons";
import { FadeIn } from "@/components/fade-in";
import { MarkdownLite } from "@/components/markdown-lite";
import { CompleteLessonButton } from "@/components/complete-lesson-button";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lessonId = Number(id);
  if (!Number.isInteger(lessonId)) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: lessons }, { data: progress }] = await Promise.all([
    supabase.from("lessons").select("*"),
    supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user!.id),
  ]);

  if (!lessons) notFound();

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));
  const withStatuses = withStatus(lessons, completedIds);
  const lesson = withStatuses.find((l) => l.id === lessonId);

  if (!lesson) notFound();
  if (lesson.status === "locked") {
    redirect("/curso");
  }

  const nextLesson = withStatuses.find((l) => l.id === lessonId + 1);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <FadeIn className="flex flex-col gap-2">
        <Link
          href="/curso"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
        >
          <ArrowLeft size={15} />
          Voltar ao curso
        </Link>
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">
          Bloco {lesson.block} — {BLOCK_NAMES[lesson.block]}
        </p>
        <h1 className="text-2xl font-bold text-gold-light">{lesson.title}</h1>
      </FadeIn>

      <FadeIn delay={0.08} className="card p-5 md:p-6">
        <MarkdownLite content={lesson.content} />
      </FadeIn>

      <FadeIn delay={0.14} className="card border-gold/30 bg-gradient-to-br from-surface to-surface-2 p-5 md:p-6">
        <div className="mb-3 flex items-center gap-2 text-gold">
          <Dumbbell size={16} />
          <p className="text-xs font-semibold uppercase tracking-wide">
            Exercício
          </p>
        </div>
        <p className="text-sm leading-relaxed">{lesson.exercise_prompt}</p>
      </FadeIn>

      <FadeIn delay={0.2}>
        <CompleteLessonButton
          lessonId={lesson.id}
          nextLessonId={nextLesson?.id ?? null}
          alreadyCompleted={lesson.status === "completed"}
        />
      </FadeIn>
    </div>
  );
}
