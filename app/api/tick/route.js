import { createClient } from "@supabase/supabase-js";
import { spracujStanicu } from "../../../lib/vypocetEkonomiky";

export const maxDuration = 60;

export async function GET(request) {
const { searchParams } = new URL(request.url);
  const klucZUrl = searchParams.get("key");
  const authHeader = request.headers.get("authorization");
  const ocakavane = `Bearer ${process.env.TICK_SECRET}`;
const ocistenyTajnyKluc = (process.env.TICK_SECRET || "").trim();
  const jeAutorizovane = authHeader === `Bearer ${ocistenyTajnyKluc}` || (klucZUrl || "").trim() === ocistenyTajnyKluc;
  if (!process.env.TICK_SECRET || !jeAutorizovane) {
    return Response.json({ error: "Neautorizované" }, { status: 401 });
  }

const { searchParams: sp2 } = new URL(request.url);
  if (sp2.get("debug") === "1") {
    const kluc = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
    let rola = null;
    try {
      const casti = kluc.split(".");
      const payload = JSON.parse(Buffer.from(casti[1], "base64").toString("utf8"));
      rola = payload.role;
    } catch (e) {
      rola = "chyba pri dekódovaní: " + e.message;
    }
    return Response.json({
      dlzkaKlucaZnakov: kluc.length,
      rolaVKluci: rola,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
  }

  const supabase = createClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim(),
    (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim()
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
