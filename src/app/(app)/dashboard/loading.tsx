import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-[auto_auto_1fr]">
        <Skeleton className="h-44 w-full md:w-44" />
        <Skeleton className="h-24 w-full md:h-44 md:w-32" />
        <Skeleton className="h-44 w-full" />
      </div>

      <Skeleton className="h-40 w-full" />

      <div>
        <Skeleton className="mb-3 h-3 w-32" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}
