"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { matchGoalTemplate } from "@/lib/goal-templates";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return { supabase, user };
}

export async function addGoal(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const { supabase, user } = await requireUser();
  const { data: goal, error } = await supabase
    .from("user_goals")
    .insert({ user_id: user.id, text: trimmed })
    .select("id")
    .single();

  if (error) throw error;

  const draftSteps = matchGoalTemplate(trimmed);
  let milestoneOrder = 0;
  let practiceOrder = 0;
  const rows = draftSteps.map((step) => {
    const order_index = step.kind === "milestone" ? milestoneOrder++ : practiceOrder++;
    return {
      goal_id: goal.id,
      kind: step.kind,
      order_index,
      title: step.title,
      description: step.description,
    };
  });

  const { error: stepsError } = await supabase.from("goal_steps").insert(rows);
  if (stepsError) throw stepsError;

  revalidatePath("/metas");
  revalidatePath("/dashboard");
}

export async function toggleGoal(goalId: string, achieved: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("user_goals")
    .update({ achieved })
    .eq("id", goalId);

  if (error) throw error;
  revalidatePath("/metas");
  revalidatePath("/dashboard");
}

export async function deleteGoal(goalId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("user_goals").delete().eq("id", goalId);

  if (error) throw error;
  revalidatePath("/metas");
  revalidatePath("/dashboard");
}

export async function toggleStep(stepId: string, completed: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("goal_steps")
    .update({ completed })
    .eq("id", stepId);

  if (error) throw error;
  revalidatePath("/metas");
}
