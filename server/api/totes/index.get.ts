export default defineEventHandler(async () => {
  const db = useDatabase();

  const { rows } = await db.sql`SELECT * FROM totes`;

  console.log(rows);
  return { totes: [] };
});
