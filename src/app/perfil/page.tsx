import { createClient } from "@/lib/supabase/server";
import { Nav } from "@/components/nav";
import { GoalsList } from "@/components/goals-list";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

type LessonRef = { id: number; title: string; block: number };

function lessonTitle(lessons: LessonRef | LessonRef[] | null) {
  if (!lessons) return null;
  return Array.isArray(lessons) ? lessons[0]?.title : lessons.title;
}

export default async function PerfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: goals }, { data: history }] = await Promise.all([
    supabase
      .from("user_goals")
      .select("id, text, achieved, created_at")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("user_progress")
      .select("completed_at, lessons(id, title, block)")
      .eq("user_id", user!.id)
      .order("completed_at", { ascending: false }),
  ]);

  type HistoryEntry = NonNullable<typeof history>[number];

  const groups = new Map<string, { date: string; items: HistoryEntry[] }>();
  for (const entry of history ?? []) {
    const dateKey = formatDate(entry.completed_at);
    const group = groups.get(dateKey) ?? { date: dateKey, items: [] as HistoryEntry[] };
    group.items.push(entry);
    groups.set(dateKey, group);
  }

  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-8">
        <div>
          <h1 className="text-2xl font-semibold">Perfil</h1>
          <p className="text-sm text-muted">{user?.email}</p>
        </div>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">
            Minhas metas
          </h2>
          <GoalsList goals={goals ?? []} />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gold">
            Histórico de lições concluídas
          </h2>
          {groups.size === 0 ? (
            <p className="text-sm text-muted">
              Nenhuma lição concluída ainda.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {[...groups.values()].map((group) => (
                <div key={group.date}>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted">
                    {group.date}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {group.items.map((entry, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-border bg-surface p-3 text-sm"
                      >
                        {lessonTitle(entry.lessons)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
