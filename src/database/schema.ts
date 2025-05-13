import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
export const totes = pgTable("totes", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  toteName: text("tote_name"),
  toteDescription: text("tote_description"),
  userId: uuid("user_id"),
});
