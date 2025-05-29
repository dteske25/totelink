import { Database } from "./database.types";
import supabase from "./supabase";

export type Tote = Database["public"]["Tables"]["totes"]["Row"];

export async function getTotes() {
  const { data } = await supabase.from("totes").select();
  return data;
}

export async function getTote(id: string) {
  const { data } = await supabase.from("totes").select().eq("id", id).single();
  return data;
}
