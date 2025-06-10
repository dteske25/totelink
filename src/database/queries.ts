import { Database } from "./database.types";
import supabase from "./supabase";

export type Tote = Database["public"]["Tables"]["totes"]["Row"];

export async function getTotes() {
  const { data } = await supabase
    .from("totes")
    .select()
    .order("updated_on", { ascending: false });
  return data;
}

export async function getTote(id: string) {
  const { data } = await supabase.from("totes").select().eq("id", id).single();
  return data;
}

export type UpdateToteData = Omit<
  Tote,
  "id" | "created_on" | "updated_on" | "user_id"
>;

export async function updateTote(
  id: string,
  updateToteData: Partial<UpdateToteData>,
) {
  const { data, error } = await supabase
    .from("totes")
    .update({ ...updateToteData, updated_on: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating tote:", error);
    throw error;
  }
  return data;
}

export async function createTote(newToteData: Partial<UpdateToteData>) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not authenticated. Cannot create tote.");
  }

  const toteToInsert = {
    ...newToteData,
    icon: newToteData.icon ?? "Package",
    user_id: session.user.id,
  };

  const { data, error } = await supabase
    .from("totes")
    .insert(toteToInsert)
    .select()
    .single();

  if (error) {
    console.error("Error creating tote:", error);
    throw error;
  }
  return data;
}
