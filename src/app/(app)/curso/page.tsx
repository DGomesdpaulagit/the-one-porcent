import { createClient } from "@/lib/supabase/server";
import { withStatus, groupByBlock } from "@/lib/lessons";
import { FadeIn } from "@/components/fade-in";
import { CourseList } from "@/components/course-list";

export default async function CursoPage() {
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

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));
  const blocks = groupByBlock(withStatus(lessons ?? [], completedIds));

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <FadeIn>
        <h1 className="text-2xl font-bold md:text-3xl">Curso</h1>
        <p className="mt-1 text-sm text-muted">
          20 lições em 4 blocos — cada uma libera a próxima ao ser concluída.
        </p>
      </FadeIn>

      <CourseList blocks={blocks} />
    </div>
  );
}
