import supabase from "./supabase";

export async function getAllTotes() {
  const { data, error } = await supabase.from("totes").select();

  return { data, error };
}
