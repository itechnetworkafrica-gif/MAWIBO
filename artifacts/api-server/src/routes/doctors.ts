import { Router } from "express";
import { db } from "@workspace/db";
import { doctorsTable, specialtiesTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { specialty, county, available, search } = req.query as Record<string, string>;
    const conditions: any[] = [];
    if (specialty) conditions.push(eq(doctorsTable.specialty, specialty));
    if (county) conditions.push(eq(doctorsTable.county, county));
    if (available === "true") conditions.push(eq(doctorsTable.available, true));
    if (search) conditions.push(ilike(doctorsTable.name, `%${search}%`));
    const doctors = conditions.length > 0
      ? await db.select().from(doctorsTable).where(and(...conditions))
      : await db.select().from(doctorsTable);
    res.json(doctors);
  } catch (err) {
    req.log.error({ err }, "listDoctors error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/featured", async (req, res) => {
  try {
    const doctors = await db.select().from(doctorsTable).limit(6);
    res.json(doctors);
  } catch (err) {
    req.log.error({ err }, "getFeaturedDoctors error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/specialties", async (req, res) => {
  try {
    const specialties = await db.select().from(specialtiesTable);
    res.json(specialties);
  } catch (err) {
    req.log.error({ err }, "getDoctorSpecialties error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const doctor = await db.query.doctorsTable.findFirst({ where: eq(doctorsTable.id, id) });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    req.log.error({ err }, "getDoctor error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
