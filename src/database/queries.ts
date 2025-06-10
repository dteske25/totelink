import { Database } from "./database.types";
import supabase from "./supabase";

export type Tote = Database["public"]["Tables"]["totes"]["Row"];
export type ToteImage = Database["public"]["Tables"]["tote_images"]["Row"];

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

export async function getToteImages(toteId: string) {
  const { data, error } = await supabase
    .from("tote_images")
    .select()
    .eq("tote_id", toteId)
    .order("created_on", { ascending: true });
  if (error) {
    console.error("Error fetching tote images:", error);
    throw error;
  }
  return data;
}

export async function getToteImageUrl(filePath: string, expiresIn = 60 * 60) {
  const { data, error } = await supabase.storage
    .from("tote-images")
    .createSignedUrl(filePath, expiresIn);
  if (error) {
    console.error("Error generating image URL:", error);
    throw error;
  }
  return data?.signedUrl || "";
}

export async function uploadToteImages(toteId: string, files: File[]) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not authenticated. Cannot upload images.");
  }

  const uploaded: ToteImage[] = [];
  for (const file of files) {
    const filePath = `${session.user.id}/${toteId}/${crypto.randomUUID()}_${file.name}`;
    const { error: uploadError } = await supabase
      .storage
      .from("tote-images")
      .upload(filePath, file);
    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      throw uploadError;
    }

    const { data, error } = await supabase
      .from("tote_images")
      .insert({
        tote_id: toteId,
        user_id: session.user.id,
        file_path: filePath,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving image record:", error);
      throw error;
    }

    if (data) {
      uploaded.push(data);
    }
  }

  return uploaded;
}
