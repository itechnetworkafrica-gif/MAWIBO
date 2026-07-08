import { Router } from "express";
import { db } from "@workspace/db";
import { healthRecordsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/", async (req, res): Promise<void> => {
  try {
    const { type } = req.query as Record<string, string>;
    const conditions = [eq(healthRecordsTable.userId, DEFAULT_USER_ID)];
    if (type) conditions.push(eq(healthRecordsTable.type, type));
    const records = await db.select().from(healthRecordsTable).where(and(...conditions)).orderBy(healthRecordsTable.date);
    res.json(records);
  } catch (err) {
    req.log.error({ err }, "listHealthRecords error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res): Promise<void> => {
  try {
    const { type, title, date, provider, description, tags } = req.body;
    const [record] = await db.insert(healthRecordsTable).values({
      userId: DEFAULT_USER_ID, type, title, date, provider, description, tags: tags ?? [],
    }).returning();
    res.status(201).json(record);
  } catch (err) {
    req.log.error({ err }, "createHealthRecord error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const record = await db.query.healthRecordsTable.findFirst({ where: eq(healthRecordsTable.id, id) });
    if (!record) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(record);
  } catch (err) {
    req.log.error({ err }, "getHealthRecord error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(healthRecordsTable).where(eq(healthRecordsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "deleteHealthRecord error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
