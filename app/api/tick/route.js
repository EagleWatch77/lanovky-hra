import { createClient } from "@supabase/supabase-js";
import { spracujStanicu } from "../../../lib/vypocetEkonomiky";

export const maxDuration = 60;

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  const ocakavane = `Bearer ${process.env.TICK_SECRET}`;
  if (!process.env.TICK_SECRET || authHeader !== ocakavane) {
    return Response.json({ error: "Neautorizované" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: vsetkyStanice, error } = await supabase.from("stanice").select("id");
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  let uspesne = 0;
  let chyby = 0;
  const chybneId = [];

  for (const s of vsetkyStanice || []) {
    try {
      await spracujStanicu(supabase, s.id);
      uspesne++;
    } catch (e) {
      chyby++;
      chybneId.push({ id: s.id, chyba: String(e?.message || e) });
    }
  }

  return Response.json({
    spracovanychCelkom: vsetkyStanice?.length || 0,
    uspesne,
    chyby,
    chybneId,
    cas: new Date().toISOString(),
  });
}
