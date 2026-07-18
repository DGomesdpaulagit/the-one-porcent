import Link from "next/link";
import { ArrowLeftRight, Brain, ChevronRight, Flame, Shield, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { withStatus, blockProgress } from "@/lib/lessons";
import { computeStreak } from "@/lib/streak";
import { FadeIn } from "@/components/fade-in";
import { RadialProgress } from "@/components/radial-progress";

const POSITIONS = [
  { key: "volante", label: "Volante", icon: Shield },
  { key: "lateral", label: "Lateral", icon: ArrowLeftRight },
  { key: "meia", label: "Meia", icon: Brain },
  { key: "zagueiro_libero", label: "Zagueiro / Líbero", icon: ShieldCheck },
];

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: lessons }, { data: progress }, { data: goals }] = await Promise.all([
    supabase.from("lessons").select("*"),
    supabase
      .from("user_progress")
      .select("lesson_id, completed_at")
      .eq("user_id", user!.id),
    supabase
      .from("user_goals")
      .select("id, text, achieved")
      .eq("user_id", user!.id)
      .eq("achieved", false)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const completedIds = new Set((progress ?? []).map((p) => p.lesson_id));
  const withStatuses = withStatus(lessons ?? [], completedIds);
  const total = withStatuses.length;
  const completedCount = withStatuses.filter((l) => l.status === "completed").length;
  const nextLesson = withStatuses.find((l) => l.status === "available");
  const progressPct = total > 0 ? (completedCount / total) * 100 : 0;
  const blocks = blockProgress(withStatuses);
  const streak = computeStreak((progress ?? []).map((p) => p.completed_at));

  const firstName = user?.email?.split("@")[0];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <FadeIn>
        <h1 className="text-2xl font-bold md:text-3xl">
          {completedCount === 0 ? (
            <>Bem-vindo, <span className="gold-text-gradient">{firstName}</span></>
          ) : (
            <>Bora continuar, <span className="gold-text-gradient">{firstName}</span></>
          )}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Seu painel de progresso no THE ONE PORCENT.
        </p>
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-[auto_auto_1fr]">
        <FadeIn delay={0.05} className="card flex flex-col items-center justify-center gap-3 p-6">
          <RadialProgress percent={progressPct} label="do curso" />
          <p className="text-sm text-muted">
            {completedCount} de {total} lições concluídas
          </p>
        </FadeIn>

        <FadeIn
          delay={0.08}
          className="card flex flex-row items-center justify-center gap-3 p-6 md:flex-col md:justify-center"
        >
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-full ${
              streak > 0 ? "bg-gold/10 text-gold" : "bg-surface-2 text-muted"
            }`}
          >
            <Flame size={24} className={streak > 0 ? "fill-gold/20" : ""} />
          </span>
          <div className="text-center">
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-[11px] text-muted">
              {streak === 1 ? "dia seguido" : "dias seguidos"}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1} className="card flex flex-col justify-between gap-4 p-6">
          {nextLesson ? (
            <>
              <div>
                <p className="text-xs uppercase tracking-wide text-gold">
                  Próxima lição
                </p>
                <p className="mt-2 text-lg font-semibold">{nextLesson.title}</p>
              </div>
              <Link
                href={`/curso/${nextLesson.id}`}
                className="group inline-flex w-fit items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gold-light"
              >
                Continuar
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </>
          ) : (
            <div>
              <p className="text-lg font-semibold text-gold-light">
                Você concluiu todas as lições. Parabéns.
              </p>
              <p className="mt-1 text-sm text-muted">
                Revisite qualquer bloco no Curso ou explore as Posições.
              </p>
            </div>
          )}
        </FadeIn>
      </div>

      <FadeIn delay={0.15} className="card p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gold">
          Progresso por bloco
        </p>
        <div className="flex flex-col gap-4">
          {blocks.map((b) => {
            const pct = b.total > 0 ? (b.completed / b.total) * 100 : 0;
            return (
              <div key={b.block}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span>
                    {b.block}. {b.name}
                  </span>
                  <span className="text-muted">
                    {b.completed}/{b.total}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-dim to-gold transition-[width] duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gold">
          Entenda as posições
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {POSITIONS.map(({ key, label, icon: Icon }) => (
            <Link
              key={key}
              href={`/posicoes?pos=${key}`}
              className="card card-hover flex flex-col items-center gap-2 p-4 text-center"
            >
              <Icon size={22} className="text-gold" />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </FadeIn>

      {goals && goals.length > 0 && (
        <FadeIn delay={0.25} className="card p-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              Suas metas
            </p>
            <Link
              href="/metas"
              className="text-xs text-muted hover:text-foreground"
            >
              Ver todas
            </Link>
          </div>
          <ul className="flex flex-col gap-2">
            {goals.map((goal) => (
              <li key={goal.id} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {goal.text}
              </li>
            ))}
          </ul>
        </FadeIn>
      )}
    </div>
  );
}
