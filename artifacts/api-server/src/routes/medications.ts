import { Router } from "express";
import { db } from "@workspace/db";
import { medicationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/", async (req, res): Promise<void> => {
  try {
    const meds = await db.select().from(medicationsTable).where(eq(medicationsTable.userId, DEFAULT_USER_ID));
    res.json(meds);
  } catch (err) {
    req.log.error({ err }, "listMedications error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res): Promise<void> => {
  try {
    const { name, dosage, frequency, startDate, endDate, prescribedBy, notes, reminderTimes } = req.body;
    const [med] = await db.insert(medicationsTable).values({
      userId: DEFAULT_USER_ID, name, dosage, frequency, startDate, endDate, prescribedBy, notes, reminderTimes: reminderTimes ?? [],
    }).returning();
    res.status(201).json(med);
  } catch (err) {
    req.log.error({ err }, "createMedication error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { dosage, frequency, active, endDate, notes } = req.body;
    const [updated] = await db.update(medicationsTable).set({ dosage, frequency, active, endDate, notes }).where(eq(medicationsTable.id, id)).returning();
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "updateMedication error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(medicationsTable).where(eq(medicationsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "deleteMedication error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
