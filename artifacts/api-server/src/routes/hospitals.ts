import { Router } from "express";
import { db } from "@workspace/db";
import { hospitalsTable, pharmaciesTable, medicinesTable, labsTable, labBookingsTable } from "@workspace/db";
import { eq, and, ilike } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

// Hospitals
router.get("/", async (req, res) => {
  try {
    const { county, type, search } = req.query as Record<string, string>;
    const conditions: any[] = [];
    if (county) conditions.push(eq(hospitalsTable.county, county));
    if (type) conditions.push(eq(hospitalsTable.type, type));
    if (search) conditions.push(ilike(hospitalsTable.name, `%${search}%`));
    const hospitals = conditions.length > 0
      ? await db.select().from(hospitalsTable).where(and(...conditions))
      : await db.select().from(hospitalsTable);
    res.json(hospitals);
  } catch (err) {
    req.log.error({ err }, "listHospitals error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const hospital = await db.query.hospitalsTable.findFirst({ where: eq(hospitalsTable.id, id) });
    if (!hospital) return res.status(404).json({ error: "Not found" });
    res.json(hospital);
  } catch (err) {
    req.log.error({ err }, "getHospital error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
