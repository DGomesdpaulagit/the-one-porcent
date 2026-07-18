"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markLessonCompleted(lessonId: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { error } = await supabase
    .from("user_progress")
    .upsert({ user_id: user.id, lesson_id: lessonId });

  if (error) {
    throw error;
  }

  revalidatePath("/curso");
  revalidatePath("/dashboard");
}
