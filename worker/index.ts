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
    "SELECT * FROM totes ORDER BY updated_on DESC"
  ).all();
  return c.json(results);
});

app.post('/api/totes', async (c) => {
  try {
    const body = await c.req.json() as any;
    const { user_id, name, description, icon } = body;

    if (!user_id) {
      return c.text("Unauthorized", 401);
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await c.env.DB.prepare(
      "INSERT INTO totes (id, user_id, name, description, icon, created_on, updated_on) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).bind(id, user_id, name, description, icon || "Package", now, now).run();

    const { results } = await c.env.DB.prepare(
      "SELECT * FROM totes WHERE id = ?"
    ).bind(id).all();

    return c.json(results[0]);
  } catch (err: any) {
    return c.json({ error: err.message || "Unknown error" }, 500);
  }
});



app.patch('/api/totes/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json() as any;
  const { name, description, icon } = body;
  const now = new Date().toISOString();

  // Dynamic update query
  const updates: string[] = [];
  const values: any[] = [];

  if (name !== undefined) {
    updates.push("name = ?");
    values.push(name);
  }
  if (description !== undefined) {
    updates.push("description = ?");
    values.push(description);
  }
  if (icon !== undefined) {
    updates.push("icon = ?");
    values.push(icon);
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
  const object = await c.env.IMAGES.get(path);

  if (!object) {
    return c.text("Not Found", 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);

  return new Response(object.body, {
    headers,
  });
});

export default app;
