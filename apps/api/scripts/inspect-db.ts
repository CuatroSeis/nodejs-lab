// Script temporal para inspeccionar el estado actual de la base de datos.
import db from "@nodejs-lab/db";

async function main() {
  const levels = (await db.query("SELECT id, order_index, title FROM levels ORDER BY order_index")) as { id: string; order_index: number; title: string }[];
  console.log("== LEVELS ==", levels.length);
  for (const l of levels) console.log(`  [${l.order_index}] ${l.id} ${l.title}`);

  const modules = (await db.query("SELECT id, level_id, order_index, title FROM modules ORDER BY level_id, order_index")) as { id: string; level_id: string; order_index: number; title: string }[];
  console.log("== MODULES ==", modules.length);
  for (const m of modules) console.log(`  ${m.id} (level=${m.level_id}) [${m.order_index}] ${m.title}`);

  const lessons = (await db.query("SELECT id, module_id, order_index, title FROM lessons ORDER BY module_id, order_index")) as { id: string; module_id: string; order_index: number; title: string }[];
  console.log("== LESSONS ==", lessons.length);
  for (const l of lessons) console.log(`  ${l.id} (module=${l.module_id}) [${l.order_index}] ${l.title}`);

  const counts = await Promise.all(
    ["lesson_progress", "attempt_results", "exercises", "exercise_test_cases", "exercise_hints", "active_days"].map(
      async (t) => {
        const rows = (await db.query(`SELECT COUNT(*) as c FROM ${t}`)) as { c: number }[];
        return [t, rows[0].c] as const;
      }
    )
  );
  console.log("== COUNTS ==");
  for (const [t, c] of counts) console.log(`  ${t}: ${c}`);
}

main()
  .catch((e) => {
    console.error("ERROR:", e instanceof Error ? (e as Error).message : e);
    process.exit(1);
  })
  .finally(() => db.close());
