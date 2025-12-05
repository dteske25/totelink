DROP TABLE IF EXISTS tote_images;
DROP TABLE IF EXISTS totes;

CREATE TABLE totes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT,
  description TEXT,
  icon TEXT,
  created_on TEXT DEFAULT (datetime('now')),
  updated_on TEXT DEFAULT (datetime('now'))
);

CREATE TABLE tote_images (
  id TEXT PRIMARY KEY,
  tote_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  file_path TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tote_id) REFERENCES totes(id) ON DELETE CASCADE
);
