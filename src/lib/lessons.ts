export type Lesson = {
  id: number;
  block: number;
  order_in_block: number;
  title: string;
  content: string;
  exercise_prompt: string;
};

export type LessonStatus = "locked" | "available" | "completed";

export type LessonWithStatus = Lesson & { status: LessonStatus };

export const BLOCK_NAMES: Record<number, string> = {
  1: "Mentalidade",
  2: "Posições",
  3: "Momentos decisivos",
  4: "Retorno de lesão",
};

export function withStatus(
  lessons: Lesson[],
  completedIds: Set<number>,
): LessonWithStatus[] {
  const sorted = [...lessons].sort((a, b) => a.id - b.id);
  let previousCompleted = true;

  return sorted.map((lesson) => {
    const completed = completedIds.has(lesson.id);
    const status: LessonStatus = completed
      ? "completed"
      : previousCompleted
        ? "available"
        : "locked";
    previousCompleted = completed;
    return { ...lesson, status };
  });
}

export function groupByBlock(lessons: LessonWithStatus[]) {
  const blocks = new Map<number, LessonWithStatus[]>();
  for (const lesson of lessons) {
    const list = blocks.get(lesson.block) ?? [];
    list.push(lesson);
    blocks.set(lesson.block, list);
  }
  return [...blocks.entries()]
    .sort(([a], [b]) => a - b)
    .map(([block, items]) => ({
      block,
      name: BLOCK_NAMES[block] ?? `Bloco ${block}`,
      lessons: items.sort((a, b) => a.order_in_block - b.order_in_block),
    }));
}

export function blockProgress(lessons: LessonWithStatus[]) {
  return groupByBlock(lessons).map((group) => ({
    block: group.block,
    name: group.name,
    total: group.lessons.length,
    completed: group.lessons.filter((l) => l.status === "completed").length,
  }));
}
