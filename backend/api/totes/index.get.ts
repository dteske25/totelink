import { useToteDatabase } from "~/utils/createDatabase";

export default defineEventHandler(async () => {
  const db = useToteDatabase();

  const { rows } = await db.sql`SELECT * FROM totes`;

  console.log(rows);
  return { totes: [] };
});
