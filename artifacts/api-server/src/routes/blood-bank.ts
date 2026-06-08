import { Router } from "express";
import { db } from "@workspace/db";
import { bloodDonorsTable, bloodRequestsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/donors", async (req, res) => {
  try {
    const { bloodGroup, county } = req.query as Record<string, string>;
    const conditions: any[] = [];
    if (bloodGroup) conditions.push(eq(bloodDonorsTable.bloodGroup, bloodGroup));
    if (county) conditions.push(eq(bloodDonorsTable.county, county));
    const donors = conditions.length > 0
      ? await db.select().from(bloodDonorsTable).where(and(...conditions))
      : await db.select().from(bloodDonorsTable);
    res.json(donors);
  } catch (err) {
    req.log.error({ err }, "listBloodDonors error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/donors", async (req, res) => {
  try {
    const { bloodGroup, county, phone } = req.body;
    const [donor] = await db.insert(bloodDonorsTable).values({
      name: "Anonymous Donor",
      bloodGroup, county, phone,
    }).returning();
    res.status(201).json(donor);
  } catch (err) {
    req.log.error({ err }, "registerBloodDonor error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/requests", async (req, res) => {
  try {
    const requests = await db.select().from(bloodRequestsTable).orderBy(bloodRequestsTable.createdAt);
    res.json(requests);
  } catch (err) {
    req.log.error({ err }, "listBloodRequests error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/requests", async (req, res) => {
  try {
    const { bloodGroup, unitsNeeded, hospital, county, urgency, patientName, contactPhone } = req.body;
    const [request] = await db.insert(bloodRequestsTable).values({
      bloodGroup, unitsNeeded, hospital, county: county ?? "Montserrado", urgency, patientName, contactPhone,
    }).returning();
    res.status(201).json(request);
  } catch (err) {
    req.log.error({ err }, "createBloodRequest error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
