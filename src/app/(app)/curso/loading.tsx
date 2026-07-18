import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-40 w-full" />
      ))}
    </div>
  );
}
