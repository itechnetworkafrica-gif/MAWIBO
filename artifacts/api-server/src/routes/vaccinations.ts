import { Router } from "express";
import { db } from "@workspace/db";
import { vaccinationsTable, vaccinationScheduleTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/", async (req, res) => {
  try {
    const vaccinations = await db.select().from(vaccinationsTable).where(eq(vaccinationsTable.userId, DEFAULT_USER_ID));
    res.json(vaccinations);
  } catch (err) {
    req.log.error({ err }, "listVaccinations error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, disease, dateAdministered, nextDueDate, provider, batchNumber, notes } = req.body;
    const [v] = await db.insert(vaccinationsTable).values({
      userId: DEFAULT_USER_ID, name, disease, dateAdministered, nextDueDate, provider, batchNumber, notes,
    }).returning();
    res.status(201).json(v);
  } catch (err) {
    req.log.error({ err }, "addVaccination error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/schedule", async (req, res) => {
  try {
    const schedule = await db.select().from(vaccinationScheduleTable);
    res.json(schedule);
  } catch (err) {
    req.log.error({ err }, "getSchedule error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
