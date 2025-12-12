export interface ITote {
  id: string;
  user_id: string;
  name: string | null;
  description: string | null;
  category: string | null;
  cover_image_path?: string | null;
  created_on: string;
  updated_on: string;
}

export interface IToteImage {
  id: string;
  tote_id: string;
  user_id: string;
  file_path: string;
  created_at: string;
}

export interface IToteItem {
  id: string;
  tote_id: string;
  name: string;
  quantity: number;
  checked: boolean;
  created_at: string;
  updated_at: string;
}

export interface IToteItemImage {
  id: string;
  item_id: string;
  user_id: string;
  file_path: string;
  created_at: string;
}

export async function getTotes(): Promise<ITote[]> {
  const response = await fetch("/api/totes");
  if (!response.ok) throw new Error("Failed to fetch totes");
  return response.json() as Promise<ITote[]>;
}

export async function getTote(id: string): Promise<ITote> {
  const response = await fetch(`/api/totes/${id}`);
  if (!response.ok) throw new Error("Failed to fetch tote");
  return response.json() as Promise<ITote>;
}

export type UpdateToteData = Omit<
  ITote,
  "id" | "created_on" | "updated_on" | "user_id"
>;

export async function updateTote(
  id: string,
  updateToteData: Partial<UpdateToteData>,
): Promise<ITote> {
  const response = await fetch(`/api/totes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateToteData),
  });
  if (!response.ok) throw new Error("Failed to update tote");
  return response.json() as Promise<ITote>;
}

export async function createTote(
  tote: { name: string; description: string; category?: string | null },
  userId: string,
): Promise<ITote | null> {
  const response = await fetch("/api/totes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...tote, user_id: userId }),
  });
  if (!response.ok) throw new Error("Failed to create tote");
  return response.json() as Promise<ITote>;
}

export async function uploadToteImage(toteId: string, file: File, userId: string): Promise<IToteImage> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", userId);

  const response = await fetch(`/api/totes/${toteId}/images`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload image");
  return response.json() as Promise<IToteImage>;
}

export async function getToteImages(toteId: string): Promise<IToteImage[]> {
  const response = await fetch(`/api/totes/${toteId}/images`);
  if (!response.ok) throw new Error("Failed to fetch images");
  return response.json() as Promise<IToteImage[]>;
}

export async function deleteToteImage(imageId: string) {
  const response = await fetch(`/api/images/${imageId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete image");
}

export async function getToteImageUrl(filePath: string) {
  return `/api/images/file/${filePath}`;
}

// Items API
export async function getToteItems(toteId: string): Promise<IToteItem[]> {
  const response = await fetch(`/api/totes/${toteId}/items`);
  if (!response.ok) throw new Error("Failed to fetch tote items");
  return response.json() as Promise<IToteItem[]>;
}

export async function createToteItem(toteId: string, name: string): Promise<IToteItem> {
  const response = await fetch(`/api/totes/${toteId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Failed to create tote item");
  return response.json() as Promise<IToteItem>;
}

export async function updateToteItem(itemId: string, updates: Partial<IToteItem>): Promise<IToteItem> {
  const response = await fetch(`/api/items/${itemId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!response.ok) throw new Error("Failed to update tote item");
  return response.json() as Promise<IToteItem>;
}

export async function deleteToteItem(itemId: string) {
  const response = await fetch(`/api/items/${itemId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete tote item");
}

export async function uploadItemImage(itemId: string, file: File, userId: string): Promise<IToteItemImage> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", userId);

  const response = await fetch(`/api/items/${itemId}/images`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Failed to upload item image");
  return response.json() as Promise<IToteItemImage>;
}

export async function getItemImages(itemId: string): Promise<IToteItemImage[]> {
  const response = await fetch(`/api/items/${itemId}/images`);
  if (!response.ok) throw new Error("Failed to fetch item images");
  return response.json() as Promise<IToteItemImage[]>;
}

export async function deleteItemImage(imageId: string) {
  const response = await fetch(`/api/item-images/${imageId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete item image");
}
