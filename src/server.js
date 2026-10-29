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

app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`LifeAdmin körs på http://localhost:${PORT}`);
});
