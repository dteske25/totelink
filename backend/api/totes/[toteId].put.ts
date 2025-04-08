import { useToteDatabase } from "~/utils/createDatabase";

export default defineEventHandler(async () => {
  const db = useToteDatabase();
});
