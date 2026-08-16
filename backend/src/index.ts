import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import fs from "fs/promises";
import path from "path";
import {
  createSession,
  deleteSession,
  getSessionUser,
  hashPassword,
  requireAuth,
  requireAdmin,
} from "./auth.js";
import { pool } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "/var/www/n-tiv/uploads";
const SESSION_COOKIE = "n-tiv-session";

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production" ? ["https://n-tiv.ru", "https://www.n-tiv.ru"] : true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(UPLOAD_DIR));

// Auth middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[SESSION_COOKIE];
  if (token) {
    req.user = await getSessionUser(token);
  }
  next();
});

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const leadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth routes
app.post("/api/auth/login", authLimiter, async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userRes = await pool.query(
    "SELECT id, email, password_hash, role FROM admin_users WHERE email = $1",
    [email],
  );
  const user = userRes.rows[0];
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = await createSession(user.id);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ user: { id: user.id, email: user.email, role: user.role } });
});

app.post("/api/auth/logout", async (req: Request, res: Response) => {
  const token = req.cookies[SESSION_COOKIE];
  if (token) await deleteSession(token);
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

app.get("/api/auth/me", async (req: Request, res: Response) => {
  res.json({ user: req.user || null });
});

// Public routes
app.get("/api/works", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM works ORDER BY featured DESC, created_at DESC");
  res.json(result.rows);
});

app.get("/api/works/:slug", async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM works WHERE slug = $1", [req.params.slug]);
  if (!result.rows.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(result.rows[0]);
});

app.get("/api/exhibitions", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM exhibitions ORDER BY created_at DESC");
  res.json(result.rows);
});

app.get("/api/events", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM events ORDER BY created_at DESC");
  res.json(result.rows);
});

app.get("/api/workshops", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM workshops ORDER BY created_at DESC");
  res.json(result.rows);
});

app.get("/api/characters", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM characters ORDER BY created_at DESC");
  res.json(result.rows);
});

app.get("/api/posts", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM posts ORDER BY created_at DESC");
  res.json(result.rows);
});

app.get("/api/pages/:slug", async (req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM pages WHERE slug = $1 AND published = true", [
    req.params.slug,
  ]);
  if (!result.rows.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(result.rows[0]);
});

app.get("/api/texts", async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT key, value FROM page_texts");
  const texts: Record<string, string> = {};
  result.rows.forEach((row) => {
    texts[row.key] = row.value;
  });
  res.json(texts);
});

app.post("/api/leads", leadLimiter, async (req: Request, res: Response) => {
  const { workId, workTitle, name, phone, email, message } = req.body;
  await pool.query(
    `INSERT INTO leads (work_id, work_title, name, phone, email, message)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [workId || "", workTitle || "", name, phone, email, message || ""],
  );
  res.json({ ok: true });
});

// Admin CRUD
const ADMIN_TABLES: Record<string, string> = {
  works: "works",
  exhibitions: "exhibitions",
  events: "events",
  workshops: "workshops",
  characters: "characters",
  posts: "posts",
  pages: "pages",
};

app.get("/api/admin/leads", requireAuth, async (_req: Request, res: Response) => {
  const result = await pool.query("SELECT * FROM leads ORDER BY created_at DESC");
  res.json(result.rows);
});

app.post("/api/admin/:entity", requireAuth, async (req: Request, res: Response) => {
  const table = ADMIN_TABLES[req.params.entity];
  if (!table) {
    res.status(400).json({ error: "Unknown entity" });
    return;
  }
  const data = req.body;
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
  const result = await pool.query(
    `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
    values,
  );
  res.json(result.rows[0]);
});

app.put("/api/admin/:entity/:id", requireAuth, async (req: Request, res: Response) => {
  const table = ADMIN_TABLES[req.params.entity];
  if (!table) {
    res.status(400).json({ error: "Unknown entity" });
    return;
  }
  const data = req.body;
  const columns = Object.keys(data);
  const values = Object.values(data);
  const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(", ");
  const result = await pool.query(
    `UPDATE ${table} SET ${setClause}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`,
    [...values, req.params.id],
  );
  if (!result.rows.length) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(result.rows[0]);
});

app.delete("/api/admin/:entity/:id", requireAuth, async (req: Request, res: Response) => {
  const table = ADMIN_TABLES[req.params.entity];
  if (!table) {
    res.status(400).json({ error: "Unknown entity" });
    return;
  }
  await pool.query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
  res.json({ ok: true });
});

app.post("/api/admin/upload", requireAuth, async (req: Request, res: Response) => {
  const { filename, data } = req.body;
  if (!filename || !data) {
    res.status(400).json({ error: "Missing filename or data" });
    return;
  }
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = path.join(UPLOAD_DIR, safeName);
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(data, "base64");
  await fs.writeFile(filePath, buffer);
  res.json({ url: `/uploads/${safeName}` });
});

app.put("/api/admin/texts", requireAuth, async (req: Request, res: Response) => {
  const texts = req.body;
  for (const [key, value] of Object.entries(texts)) {
    await pool.query(
      "INSERT INTO page_texts (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [key, value],
    );
  }
  res.json({ ok: true });
});

// Admin user management (admin only)
app.post("/api/admin/users", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const hash = await hashPassword(password);
  const result = await pool.query(
    "INSERT INTO admin_users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role",
    [email, hash, role || "editor"],
  );
  res.json(result.rows[0]);
});

app.get("/api/admin/users", requireAuth, requireAdmin, async (_req: Request, res: Response) => {
  const result = await pool.query(
    "SELECT id, email, role, created_at FROM admin_users ORDER BY created_at DESC",
  );
  res.json(result.rows);
});

app.delete(
  "/api/admin/users/:id",
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response) => {
    await pool.query("DELETE FROM admin_users WHERE id = $1", [req.params.id]);
    res.json({ ok: true });
  },
);

// Health check
app.get("/api/health", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Health check failed: database is unreachable:", message);
    res.status(503).json({ ok: false, error: message });
  }
});


async function main() {
  app.listen(PORT, () => {
    console.log(`n-tiv API listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
