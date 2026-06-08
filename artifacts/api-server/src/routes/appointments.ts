import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable, doctorsTable } from "@workspace/db";
import { eq, and, gte } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/", async (req, res) => {
  try {
    const { status } = req.query as Record<string, string>;
    const conditions = [eq(appointmentsTable.userId, DEFAULT_USER_ID)];
    if (status) conditions.push(eq(appointmentsTable.status, status));
    const appointments = await db.select().from(appointmentsTable).where(and(...conditions)).orderBy(appointmentsTable.date);
    res.json(appointments);
  } catch (err) {
    req.log.error({ err }, "listAppointments error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { doctorId, date, time, type, notes } = req.body;
    const doctor = await db.query.doctorsTable.findFirst({ where: eq(doctorsTable.id, doctorId) });
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    const [appointment] = await db.insert(appointmentsTable).values({
      userId: DEFAULT_USER_ID,
      doctorId,
      doctorName: doctor.name,
      doctorImageUrl: doctor.imageUrl,
      specialty: doctor.specialty,
      hospital: doctor.hospital,
      date,
      time,
      type: type ?? "in-person",
      notes,
      fee: doctor.consultationFee,
    }).returning();
    res.status(201).json(appointment);
  } catch (err) {
    req.log.error({ err }, "createAppointment error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/upcoming", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const appointments = await db.select().from(appointmentsTable)
      .where(and(
        eq(appointmentsTable.userId, DEFAULT_USER_ID),
        eq(appointmentsTable.status, "upcoming"),
        gte(appointmentsTable.date, today)
      ))
      .orderBy(appointmentsTable.date)
      .limit(5);
    res.json(appointments);
  } catch (err) {
    req.log.error({ err }, "getUpcomingAppointments error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const appointment = await db.query.appointmentsTable.findFirst({ where: eq(appointmentsTable.id, id) });
    if (!appointment) return res.status(404).json({ error: "Not found" });
    res.json(appointment);
  } catch (err) {
    req.log.error({ err }, "getAppointment error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status, date, time, notes } = req.body;
    const [updated] = await db.update(appointmentsTable).set({ status, date, time, notes }).where(eq(appointmentsTable.id, id)).returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "updateAppointment error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
