import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-3/4" />
      </div>
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-28 w-full" />
      <Skeleton className="h-10 w-48 rounded-full" />
    </div>
  );
}
