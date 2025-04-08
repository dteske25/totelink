import { useToteDatabase } from "~/utils/createDatabase";

export default defineEventHandler(async (event) => {
  const db = useToteDatabase();

  const body = await readBody(event);

  const toteName = body.toteName;

  db.sql`INSERT INTO totes (tote_name) VALUES ('${toteName}')`;
  
  return { updated: true };
});
