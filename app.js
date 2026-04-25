const crypto = require("crypto");
const path = require("path");
const express = require("express");
const db = require("./server/connection");

const app = express();
const publicDir = path.join(__dirname, "public");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicDir));

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function mapRecord(row) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category,
    neighborhood: row.neighborhood,
    shortDescription: row.summary,
    description: row.description,
    address: row.address,
    keywords: row.keywords ? row.keywords.split(",").map((item) => item.trim()) : [],
    url: row.url,
  };
}

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1 AS ok");
    return res.json({ ok: true, database: "connected" });
  } catch (error) {
    return res.status(503).json({
      ok: false,
      database: "disconnected",
      message: error.message,
    });
  }
});

app.get("/api/search", async (req, res) => {
  const query = (req.query.q || "").trim();
  const category = (req.query.category || "").trim();
  const limit = Math.min(Number(req.query.limit) || 8, 20);

  const filters = [];
  const params = [];
  let paramIndex = 1;

  if (query) {
    filters.push(
      `(
        title ILIKE $${paramIndex}
        OR category ILIKE $${paramIndex + 1}
        OR neighborhood ILIKE $${paramIndex + 2}
        OR summary ILIKE $${paramIndex + 3}
        OR description ILIKE $${paramIndex + 4}
        OR keywords ILIKE $${paramIndex + 5}
      )`,
    );
    const wildcard = `%${query}%`;
    params.push(wildcard, wildcard, wildcard, wildcard, wildcard, wildcard);
    paramIndex += 6;
  }

  if (category) {
    filters.push(`category = $${paramIndex}`);
    params.push(category);
    paramIndex += 1;
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const titleRankIndex = paramIndex;
  const keywordRankIndex = paramIndex + 1;
  const summaryRankIndex = paramIndex + 2;
  const limitIndex = paramIndex + 3;
  const sql = `
    SELECT id, title, slug, category, neighborhood, summary, description, address, keywords, url
    FROM seattle_places
    ${whereClause}
    ORDER BY
      CASE
        WHEN title ILIKE $${titleRankIndex} THEN 1
        WHEN keywords ILIKE $${keywordRankIndex} THEN 2
        WHEN summary ILIKE $${summaryRankIndex} THEN 3
        ELSE 4
      END,
      title ASC
    LIMIT $${limitIndex}
  `;

  const rankingWildcard = `%${query}%`;

  try {
    const results = await db.query(sql, [
      ...params,
      rankingWildcard,
      rankingWildcard,
      rankingWildcard,
      limit,
    ]);

    const categories = await db.query(
      "SELECT DISTINCT category FROM seattle_places ORDER BY category ASC",
    );

    return res.json({
      query,
      total: results.length,
      filters: {
        category: category || null,
      },
      categories: categories.map((item) => item.category),
      results: results.map(mapRecord),
    });
  } catch (error) {
    return res.status(500).json({
      message:
        "Gagal mengambil data pencarian. Pastikan schema SQL sudah di-import.",
      error: error.message,
    });
  }
});

app.get("/api/places/:slug", async (req, res) => {
  try {
    const results = await db.query(
      `SELECT id, title, slug, category, neighborhood, summary, description, address, keywords, url
       FROM seattle_places
       WHERE slug = $1
       LIMIT 1`,
      [req.params.slug],
    );

    if (!results.length) {
      return res.status(404).json({ message: "Data tempat tidak ditemukan." });
    }

    return res.json(mapRecord(results[0]));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email dan password wajib diisi." });
  }

  try {
    const existingUsers = await db.query(
      "SELECT id FROM users WHERE email = $1 LIMIT 1",
      [email],
    );

    if (existingUsers.length) {
      return res.status(409).json({ message: "Email sudah terdaftar." });
    }

    const passwordHash = hashPassword(password);
    const result = await db.pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
      [email, passwordHash],
    );

    return res.status(201).json({
      message: "Registrasi berhasil.",
      user: {
        id: result.rows[0].id,
        email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal melakukan registrasi. Pastikan tabel users sudah ada.",
      error: error.message,
    });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email dan password wajib diisi." });
  }

  try {
    const users = await db.query(
      "SELECT id, email, password_hash FROM users WHERE email = $1 LIMIT 1",
      [email],
    );

    if (!users.length) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const passwordHash = hashPassword(password);
    if (users[0].password_hash !== passwordHash) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    return res.json({
      message: "Login berhasil.",
      user: {
        id: users[0].id,
        email: users[0].email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Gagal login. Pastikan tabel users sudah ada.",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

module.exports = app;
