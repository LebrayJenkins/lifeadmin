import express from "express";
import { DatabaseSync } from "node:sqlite";

const app = express();
const PORT = 8000;

const db = new DatabaseSync("src/lifeadmin.db");

db.exec(`
    CREATE TABLE IF NOT EXISTS agreements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        monthly_cost REAL NOT NULL,
        reference_number TEXT NOT NULL,
        description TEXT NOT NULL
    )
`);

app.use(express.json());
app.use(express.static("public"));

// GET - Hämta alla avtal
app.get("/api/agreements", (req, res) => {
  const agreements = db.prepare("SELECT * FROM agreements").all();
  res.json(agreements);
});

// DELETE - Radera ett avtal
app.delete("/api/agreements/:id", (req, res) => {
  const id = req.params.id;

  if (!/^[1-9]\d*$/.test(id)) {
    return res.status(400).json({ error: "Ogiltigt avtals-ID" });
  }

  const statement = db.prepare("DELETE FROM agreements WHERE id = ?");
  const result = statement.run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Avtalet hittades inte" });
  }

  res.sendStatus(204);
});

// POST - Registrera ett nytt avtal
app.post("/api/agreements", (req, res) => {
  const newAgreement = req.body;

  if (
    !newAgreement ||
    typeof newAgreement !== "object" ||
    Array.isArray(newAgreement)
  ) {
    return res.status(400).json({ error: "Ogiltiga avtalsuppgifter" });
  }

  const { name, monthlyCost, referenceNumber, description } = newAgreement;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Ange ett giltigt avtalsnamn" });
  }

  if (
    typeof monthlyCost !== "number" ||
    !Number.isFinite(monthlyCost) ||
    monthlyCost <= 0
  ) {
    return res
      .status(400)
      .json({ error: "Månadskostnaden måste vara större än 0" });
  }

  if (typeof referenceNumber !== "string" || referenceNumber.trim() === "") {
    return res.status(400).json({ error: "Ange ett giltigt referensnummer" });
  }

  if (typeof description !== "string" || description.trim() === "") {
    return res.status(400).json({ error: "Ange en giltig beskrivning" });
  }

  const statement = db.prepare(`
    INSERT INTO agreements (name, monthly_cost, reference_number, description)
    VALUES (?, ?, ?, ?)
  `);

  const result = statement.run(name, monthlyCost, referenceNumber, description);

  res.status(201).json({
    id: Number(result.lastInsertRowid),
    name,
    monthlyCost,
    referenceNumber,
    description,
  });
});

app.listen(PORT, () => {
  console.log(`LifeAdmin körs på http://localhost:${PORT}`);
});
