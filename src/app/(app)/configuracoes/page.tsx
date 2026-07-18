import Link from "next/link";
import { User, Target, History, Info, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/fade-in";
import { SignOutButton } from "@/components/sign-out-button";

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

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count: goalsCount }, { data: history }] = await Promise.all([
    supabase
      .from("user_goals")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user!.id),
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <FadeIn>
        <h1 className="text-2xl font-bold md:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-muted">
          Sua conta, atalhos e histórico de progresso.
        </p>
      </FadeIn>

      <FadeIn delay={0.05} className="card flex items-center justify-between p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
            <User size={18} />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-muted">Conta</p>
          </div>
        </div>
        <SignOutButton />
      </FadeIn>

      <FadeIn delay={0.1}>
        <Link
          href="/metas"
          className="card card-hover flex items-center justify-between p-5"
        >
          <div className="flex items-center gap-3">
            <Target size={18} className="text-gold" />
            <div>
              <p className="text-sm font-medium">Minhas metas</p>
              <p className="text-xs text-muted">
                {goalsCount ?? 0} meta{goalsCount === 1 ? "" : "s"} — planos e
                acompanhamento
              </p>
            </div>
          </div>
          <ChevronRight size={16} className="text-muted" />
        </Link>
      </FadeIn>

      <FadeIn delay={0.15} className="card p-5 md:p-6">
        <div className="mb-3 flex items-center gap-2 text-gold">
          <History size={16} />
          <h2 className="text-xs font-semibold uppercase tracking-wide">
            Histórico de lições concluídas
          </h2>
        </div>
        {groups.size === 0 ? (
          <p className="text-sm text-muted">Nenhuma lição concluída ainda.</p>
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
                      className="rounded-lg border border-border bg-surface-2/40 p-3 text-sm"
                    >
                      {lessonTitle(entry.lessons)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </FadeIn>

      <FadeIn delay={0.2} className="card flex items-center gap-3 p-5 text-sm text-muted">
        <Info size={16} className="text-gold" />
        THE ONE PORCENT — v1.3.0
      </FadeIn>
    </div>
  );
}
