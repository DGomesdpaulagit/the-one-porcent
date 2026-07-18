import { Target } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/fade-in";
import { GoalForm } from "@/components/goal-form";
import { GoalCard } from "@/components/goal-card";

export default async function MetasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: goals }, { data: steps }] = await Promise.all([
    supabase
      .from("user_goals")
      .select("id, text, achieved, created_at")
      .eq("user_id", user!.id)
      .order("achieved", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("goal_steps")
      .select("id, goal_id, kind, order_index, title, description, completed")
      .order("order_index", { ascending: true }),
  ]);

  const stepsByGoal = new Map<string, typeof steps>();
  for (const step of steps ?? []) {
    const list = stepsByGoal.get(step.goal_id) ?? [];
    list.push(step);
    stepsByGoal.set(step.goal_id, list);
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <FadeIn>
        <h1 className="flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <Target size={26} className="text-gold" />
          Metas
        </h1>
        <p className="mt-1 text-sm text-muted">
          Toda meta nova vem com um caminho: etapas pra seguir em ordem e
          práticas pra manter sempre. Vai com calma — é processo, não é da
          noite pro dia.
        </p>
      </FadeIn>

      <FadeIn delay={0.05}>
        <GoalForm />
      </FadeIn>

      {!goals || goals.length === 0 ? (
        <FadeIn delay={0.1} className="card p-6 text-center text-sm text-muted">
          Nenhuma meta ainda. Que tal começar com algo como &ldquo;virar
          capitão do time&rdquo; ou &ldquo;ser o cobrador oficial de
          falta&rdquo;?
        </FadeIn>
      ) : (
        <div className="flex flex-col gap-3">
          {goals.map((goal, i) => (
            <FadeIn key={goal.id} delay={0.1 + i * 0.05}>
              <GoalCard goal={goal} steps={stepsByGoal.get(goal.id) ?? []} />
            </FadeIn>
          ))}
        </div>
      )}
    </div>
  );
}
