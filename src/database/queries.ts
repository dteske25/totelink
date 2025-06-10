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

// Image upload and management functions
export async function uploadToteImage(
  toteId: string,
  file: File,
): Promise<ToteImage> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    throw new Error("User not authenticated. Cannot upload image.");
  }

  // Create unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `tote-images/${session.user.id}/${fileName}`;

  // Upload file to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from("tote-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error uploading file:", uploadError);
    throw uploadError;
  }

  // Save image record to database
  const { data, error } = await supabase
    .from("tote_images")
    .insert({
      tote_id: toteId,
      user_id: session.user.id,
      file_path: filePath,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving image record:", error);
    throw error;
  }

  return data;
}

export async function getToteImages(toteId: string): Promise<ToteImage[]> {
  const { data, error } = await supabase
    .from("tote_images")
    .select("*")
    .eq("tote_id", toteId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tote images:", error);
    throw error;
  }

  return data || [];
}

export async function deleteToteImage(imageId: string): Promise<void> {
  // First get the image record to get the file path
  const { data: imageRecord, error: fetchError } = await supabase
    .from("tote_images")
    .select("file_path")
    .eq("id", imageId)
    .single();

  if (fetchError) {
    console.error("Error fetching image record:", fetchError);
    throw fetchError;
  }

  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from("tote-images")
    .remove([imageRecord.file_path]);

  if (storageError) {
    console.error("Error deleting file from storage:", storageError);
    throw storageError;
  }

  // Delete record from database
  const { error: dbError } = await supabase
    .from("tote_images")
    .delete()
    .eq("id", imageId);

  if (dbError) {
    console.error("Error deleting image record:", dbError);
    throw dbError;
  }
}

export function getToteImageUrl(filePath: string): string {
  const { data } = supabase.storage.from("tote-images").getPublicUrl(filePath);

  return data.publicUrl;
}
