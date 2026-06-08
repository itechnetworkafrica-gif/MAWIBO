import { Router } from "express";
import { db } from "@workspace/db";
import { moodLogsTable, journalEntriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/mood-logs", async (req, res) => {
  try {
    const logs = await db.select().from(moodLogsTable)
      .where(eq(moodLogsTable.userId, DEFAULT_USER_ID))
      .orderBy(moodLogsTable.date);
    res.json(logs);
  } catch (err) {
    req.log.error({ err }, "listMoodLogs error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/mood-logs", async (req, res) => {
  try {
    const { mood, score, notes, factors } = req.body;
    const today = new Date().toISOString().split("T")[0];
    const [log] = await db.insert(moodLogsTable).values({
      userId: DEFAULT_USER_ID, mood, score, notes, date: today, factors: factors ?? [],
    }).returning();
    res.status(201).json(log);
  } catch (err) {
    req.log.error({ err }, "createMoodLog error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/journal", async (req, res) => {
  try {
    const entries = await db.select().from(journalEntriesTable)
      .where(eq(journalEntriesTable.userId, DEFAULT_USER_ID))
      .orderBy(journalEntriesTable.date);
    res.json(entries);
  } catch (err) {
    req.log.error({ err }, "listJournalEntries error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/journal", async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;
    const today = new Date().toISOString().split("T")[0];
    const [entry] = await db.insert(journalEntriesTable).values({
      userId: DEFAULT_USER_ID, title, content, date: today, mood, tags: tags ?? [],
    }).returning();
    res.status(201).json(entry);
  } catch (err) {
    req.log.error({ err }, "createJournalEntry error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
