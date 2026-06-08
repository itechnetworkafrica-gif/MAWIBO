import { Router } from "express";
import { db } from "@workspace/db";
import { pharmaciesTable, medicinesTable } from "@workspace/db";
import { ilike } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pharmacies = await db.select().from(pharmaciesTable);
    res.json(pharmacies);
  } catch (err) {
    req.log.error({ err }, "listPharmacies error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/medicines", async (req, res) => {
  try {
    const { query } = req.query as Record<string, string>;
    const medicines = query
      ? await db.select().from(medicinesTable).where(ilike(medicinesTable.name, `%${query}%`))
      : await db.select().from(medicinesTable).limit(20);
    res.json(medicines);
  } catch (err) {
    req.log.error({ err }, "searchMedicines error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
