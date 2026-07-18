"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
  const { error } = await supabase
    .from("user_goals")
    .insert({ user_id: user.id, text: trimmed });

  if (error) throw error;
  revalidatePath("/configuracoes");
}

export async function toggleGoal(goalId: string, achieved: boolean) {
  const { supabase } = await requireUser();
  const { error } = await supabase
    .from("user_goals")
    .update({ achieved })
    .eq("id", goalId);

  if (error) throw error;
  revalidatePath("/configuracoes");
}

export async function deleteGoal(goalId: string) {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("user_goals").delete().eq("id", goalId);

  if (error) throw error;
  revalidatePath("/configuracoes");
}
