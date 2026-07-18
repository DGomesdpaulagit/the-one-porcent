import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { FadeIn } from "@/components/fade-in";
import { PositionsView } from "@/components/positions-view";

export default async function PosicoesPage() {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("positions_content")
    .select("position, section, order_in_position, content")
    .neq("position", "geral");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10">
      <FadeIn>
        <h1 className="text-2xl font-bold md:text-3xl">Posições</h1>
        <p className="mt-1 text-sm text-muted">
          Consulta rápida, disponível a qualquer momento — antes ou depois do
          treino. Toque numa posição no campo ou nos botões.
        </p>
      </FadeIn>

      <Suspense>
        <PositionsView rows={rows ?? []} />
      </Suspense>
    </div>
  );
}
