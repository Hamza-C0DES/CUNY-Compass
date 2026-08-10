import "dotenv/config";
import express from "express";
import cors from "cors"; 

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3000;

app.get('/', (req, res) => res.send('Root route working!')); 

// Health check — confirms the server is running.
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// TODO: implement the CUNY Compass routes.
// The capstone requires full CRUD (create, read, update, delete) on at least
// one core resource, plus a data model with relationships between tables.
//
// To talk to the database, run `yarn prisma:migrate` first (generates the
// client into src/generated/prisma), then wire it up with the pg adapter.
// See this API's README ("Using Prisma in code") for the exact db.ts snippet.

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
