import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
}

const app = new Hono<{ Bindings: Env }>();

app.use('/api/*', cors());

app.get('/api/totes', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT t.*, (SELECT file_path FROM tote_images WHERE tote_id = t.id LIMIT 1) as cover_image_path 
     FROM totes t 
     ORDER BY t.updated_on DESC`
  ).all();
  return c.json(results);
});

app.post('/api/totes', async (c) => {
  try {
    const body = await c.req.json() as { user_id?: string; name: string; description?: string; category?: string };
    const { user_id, name, description, category } = body;

    if (!user_id) {
      return c.text("Unauthorized", 401);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await c.env.DB.prepare(
      "INSERT INTO totes (id, user_id, name, description, category, created_on, updated_on) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, user_id, name, description, category || null, now, now).run();

    const { results } = await c.env.DB.prepare(
      "SELECT * FROM totes WHERE id = ?"
    ).bind(id).all();

    return c.json(results[0]);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});



app.patch('/api/totes/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json() as { name?: string; description?: string; category?: string };
  const { name, description, category } = body;
  const now = new Date().toISOString();

  // Dynamic update query
  const updates: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (name !== undefined) {
    updates.push("name = ?");
    values.push(name);
  }
  if (category !== undefined) {
    updates.push("category = ?");
    values.push(category);
  }
  if (description !== undefined) {
    updates.push("description = ?");
    values.push(description);
  }


  if (updates.length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }

  updates.push("updated_on = ?");
  values.push(now);
  values.push(id); // For WHERE clause

  await c.env.DB.prepare(
    `UPDATE totes SET ${updates.join(", ")} WHERE id = ?`
  ).bind(...values).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM totes WHERE id = ?"
  ).bind(id).all();

  return c.json(results[0]);
});

app.get('/api/totes/:id', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM totes WHERE id = ?"
  ).bind(id).all();

  if (!results.length) {
    return c.text("Not Found", 404);
  }

  return c.json(results[0]);
});

app.get('/api/totes/:id/images', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM tote_images WHERE tote_id = ? ORDER BY created_at DESC"
  ).bind(id).all();
  return c.json(results);
});

app.post('/api/totes/:id/images', async (c) => {
  const toteId = c.req.param('id');
  const formData = await c.req.formData();
  const file = formData.get('file') as unknown as File;
  const userId = formData.get('user_id') as string;

  if (!file || !userId) {
    return c.text("Missing file or user_id", 400);
  }

  const id = crypto.randomUUID();
  const extension = file.name.split('.').pop();
  const filePath = `${toteId}/${id}.${extension}`;

  await c.env.IMAGES.put(filePath, file);

  await c.env.DB.prepare(
    "INSERT INTO tote_images (id, tote_id, user_id, file_path) VALUES (?, ?, ?, ?)"
  ).bind(id, toteId, userId, filePath).run();

  return c.json({ id, tote_id: toteId, user_id: userId, file_path: filePath });
});

app.delete('/api/images/:id', async (c) => {
  const id = c.req.param('id');

  const { results } = await c.env.DB.prepare(
    "SELECT file_path FROM tote_images WHERE id = ?"
  ).bind(id).all();

  if (!results.length) {
    return c.text("Not Found", 404);
  }

  const filePath = results[0].file_path as string;

  await c.env.IMAGES.delete(filePath);

  await c.env.DB.prepare(
    "DELETE FROM tote_images WHERE id = ?"
  ).bind(id).run();

  return c.body(null, 204);
});

app.get('/api/images/file/:path{.+}', async (c) => {
  const path = c.req.param('path');
  console.log("Attempting to fetch image at path:", path);
  const object = await c.env.IMAGES.get(path);

  if (!object) {
    console.log("Image not found in R2 bucket:", path);
    return c.text("Not Found", 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return new Response(object.body, {
    headers,
  });
});

// Items Endpoints
app.get('/api/totes/:id/items', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM items WHERE tote_id = ? ORDER BY created_at ASC"
  ).bind(id).all();
  return c.json(results);
});

app.post('/api/totes/:id/items', async (c) => {
  const toteId = c.req.param('id');
  const { name } = await c.req.json() as { name: string };
  
  if (!name) return c.json({ error: "Name is required" }, 400);

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await c.env.DB.prepare(
    "INSERT INTO items (id, tote_id, name, quantity, checked, created_at, updated_at) VALUES (?, ?, ?, 1, 0, ?, ?)"
  ).bind(id, toteId, name, now, now).run();

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM items WHERE id = ?"
  ).bind(id).all();

  return c.json(results[0]);
});

app.patch('/api/items/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json() as { name?: string; quantity?: number; checked?: boolean };
  const { name, quantity, checked } = body;
  const now = new Date().toISOString();

  const updates: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (name !== undefined) {
    updates.push("name = ?");
    values.push(name);
  }
  if (quantity !== undefined) {
    updates.push("quantity = ?");
    values.push(quantity);
  }
  if (checked !== undefined) {
    updates.push("checked = ?");
    values.push(checked ? 1 : 0);
  }

  if (updates.length > 0) {
    updates.push("updated_at = ?");
    values.push(now);
    values.push(id);
    
    await c.env.DB.prepare(
      `UPDATE items SET ${updates.join(", ")} WHERE id = ?`
    ).bind(...values).run();
  }

  const { results } = await c.env.DB.prepare(
    "SELECT * FROM items WHERE id = ?"
  ).bind(id).all();

  return c.json(results[0]);
});

app.delete('/api/items/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare("DELETE FROM items WHERE id = ?").bind(id).run();
  return c.body(null, 204);
});

app.get('/api/items/:id/images', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(
    "SELECT * FROM item_images WHERE item_id = ? ORDER BY created_at DESC"
  ).bind(id).all();
  return c.json(results);
});

app.post('/api/items/:id/images', async (c) => {
  const itemId = c.req.param('id');
  const formData = await c.req.formData();
  const file = formData.get('file') as unknown as File;
  const userId = formData.get('user_id') as string;

  if (!file || !userId) {
    return c.text("Missing file or user_id", 400);
  }

  const id = crypto.randomUUID();
  const extension = file.name.split('.').pop();
  const filePath = `items/${itemId}/${id}.${extension}`;

  await c.env.IMAGES.put(filePath, file);

  await c.env.DB.prepare(
    "INSERT INTO item_images (id, item_id, user_id, file_path) VALUES (?, ?, ?, ?)"
  ).bind(id, itemId, userId, filePath).run();

  return c.json({ id, item_id: itemId, user_id: userId, file_path: filePath });
});

app.delete('/api/item-images/:id', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(
    "SELECT file_path FROM item_images WHERE id = ?"
  ).bind(id).all();

  if (!results.length) {
    return c.text("Not Found", 404);
  }

  const filePath = results[0].file_path as string;
  await c.env.IMAGES.delete(filePath);
  await c.env.DB.prepare("DELETE FROM item_images WHERE id = ?").bind(id).run();
  
  return c.body(null, 204);
});

export default app;
