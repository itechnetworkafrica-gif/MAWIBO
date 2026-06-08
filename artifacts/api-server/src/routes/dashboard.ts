import { Router } from "express";
import { db } from "@workspace/db";
import {
  appointmentsTable, medicationsTable, healthRecordsTable, moodLogsTable,
  vitalsTable, waterLogsTable, healthProfilesTable,
} from "@workspace/db";
import { eq, and, gte, desc } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/summary", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().split("T")[0];

    const [appointments, medications, records, upcoming, moodLogs, waterLogs] = await Promise.all([
      db.select().from(appointmentsTable).where(and(eq(appointmentsTable.userId, DEFAULT_USER_ID), gte(appointmentsTable.date, monthStartStr))),
      db.select().from(medicationsTable).where(and(eq(medicationsTable.userId, DEFAULT_USER_ID), eq(medicationsTable.active, true))),
      db.select().from(healthRecordsTable).where(eq(healthRecordsTable.userId, DEFAULT_USER_ID)),
      db.select().from(appointmentsTable).where(and(eq(appointmentsTable.userId, DEFAULT_USER_ID), eq(appointmentsTable.status, "upcoming"), gte(appointmentsTable.date, today))),
      db.select().from(moodLogsTable).where(and(eq(moodLogsTable.userId, DEFAULT_USER_ID), gte(moodLogsTable.date, monthStartStr))),
      db.select().from(waterLogsTable).where(and(eq(waterLogsTable.userId, DEFAULT_USER_ID), eq(waterLogsTable.date, today))),
    ]);

    const moodAverage = moodLogs.length > 0 ? moodLogs.reduce((s, m) => s + m.score, 0) / moodLogs.length : 0;
    const waterConsumed = waterLogs.reduce((s, l) => s + l.amount, 0);
    const waterGoalProgress = Math.min((waterConsumed / 2.5) * 100, 100);

    const healthProfile = await db.query.healthProfilesTable.findFirst({ where: eq(healthProfilesTable.userId, DEFAULT_USER_ID) });

    res.json({
      healthScore: healthProfile?.healthScore ?? 72,
      appointmentsThisMonth: appointments.length,
      medicationsActive: medications.length,
      recordsCount: records.length,
      upcomingAppointments: upcoming.length,
      moodAverage: Math.round(moodAverage * 10) / 10,
      waterGoalProgress: Math.round(waterGoalProgress),
    });
  } catch (err) {
    req.log.error({ err }, "getDashboardSummary error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/health-score", async (req, res) => {
  try {
    const profile = await db.query.healthProfilesTable.findFirst({ where: eq(healthProfilesTable.userId, DEFAULT_USER_ID) });
    const score = profile?.healthScore ?? 72;
    let grade = "C";
    if (score >= 90) grade = "A+";
    else if (score >= 80) grade = "A";
    else if (score >= 70) grade = "B";
    else if (score >= 60) grade = "C";
    else grade = "D";
    res.json({
      score,
      grade,
      trend: "up",
      breakdown: { fitness: 68, nutrition: 75, sleep: 70, mentalHealth: 80, preventiveCare: 72 },
      recommendations: [
        "Increase daily water intake to 2.5 liters",
        "Schedule your annual physical exam",
        "Add 30 minutes of light exercise daily",
        "Get at least 7-8 hours of sleep each night",
      ],
    });
  } catch (err) {
    req.log.error({ err }, "getHealthScore error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/activity-feed", async (req, res) => {
  try {
    const [appointments, records, medications, moodLogs] = await Promise.all([
      db.select().from(appointmentsTable).where(eq(appointmentsTable.userId, DEFAULT_USER_ID)).orderBy(desc(appointmentsTable.createdAt)).limit(3),
      db.select().from(healthRecordsTable).where(eq(healthRecordsTable.userId, DEFAULT_USER_ID)).orderBy(desc(healthRecordsTable.createdAt)).limit(2),
      db.select().from(medicationsTable).where(eq(medicationsTable.userId, DEFAULT_USER_ID)).orderBy(desc(medicationsTable.createdAt)).limit(2),
      db.select().from(moodLogsTable).where(eq(moodLogsTable.userId, DEFAULT_USER_ID)).orderBy(desc(moodLogsTable.createdAt)).limit(2),
    ]);

    const items: any[] = [
      ...appointments.map((a, i) => ({
        id: i + 1,
        type: "appointment",
        title: `Appointment with ${a.doctorName}`,
        description: `${a.specialty} — ${a.date} at ${a.time}`,
        timestamp: a.createdAt?.toISOString?.() ?? new Date().toISOString(),
        icon: "calendar",
      })),
      ...records.map((r, i) => ({
        id: 100 + i,
        type: "record",
        title: `Health Record Added`,
        description: `${r.type}: ${r.title}`,
        timestamp: r.createdAt?.toISOString?.() ?? new Date().toISOString(),
        icon: "file-text",
      })),
      ...medications.map((m, i) => ({
        id: 200 + i,
        type: "medication",
        title: `Medication: ${m.name}`,
        description: `${m.dosage} — ${m.frequency}`,
        timestamp: m.createdAt?.toISOString?.() ?? new Date().toISOString(),
        icon: "pill",
      })),
      ...moodLogs.map((ml, i) => ({
        id: 300 + i,
        type: "mood",
        title: `Mood Check-In: ${ml.mood}`,
        description: `Score: ${ml.score}/10`,
        timestamp: ml.createdAt?.toISOString?.() ?? new Date().toISOString(),
        icon: "heart",
      })),
    ];

    items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    res.json(items.slice(0, 8));
  } catch (err) {
    req.log.error({ err }, "getActivityFeed error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/vitals", async (req, res) => {
  try {
    const entries = await db.select().from(vitalsTable)
      .where(eq(vitalsTable.userId, DEFAULT_USER_ID))
      .orderBy(vitalsTable.date)
      .limit(30);
    res.json({ entries });
  } catch (err) {
    req.log.error({ err }, "getVitalsTrend error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/vitals", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { systolic, diastolic, heartRate, bloodSugar, temperature, oxygenSaturation, weight } = req.body;
    const [vitals] = await db.insert(vitalsTable).values({
      userId: DEFAULT_USER_ID, date: today,
      systolic, diastolic, heartRate, bloodSugar, temperature, oxygenSaturation, weight,
    }).returning();
    res.status(201).json(vitals);
  } catch (err) {
    req.log.error({ err }, "logVitals error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/water-tracker", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const logs = await db.select().from(waterLogsTable)
      .where(and(eq(waterLogsTable.userId, DEFAULT_USER_ID), eq(waterLogsTable.date, today)));
    const consumed = logs.reduce((s, l) => s + l.amount, 0);
    const goal = 2.5;
    const percentage = Math.min(Math.round((consumed / goal) * 100), 100);
    res.json({
      date: today,
      consumed: Math.round(consumed * 10) / 10,
      goal,
      percentage,
      logs: logs.map(l => ({ amount: l.amount, time: l.time })),
    });
  } catch (err) {
    req.log.error({ err }, "getWaterTracker error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/water-tracker", async (req, res) => {
  try {
    const { amount } = req.body;
    const today = new Date().toISOString().split("T")[0];
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    await db.insert(waterLogsTable).values({
      userId: DEFAULT_USER_ID, date: today, amount, goal: 2.5, time,
    });
    const logs = await db.select().from(waterLogsTable)
      .where(and(eq(waterLogsTable.userId, DEFAULT_USER_ID), eq(waterLogsTable.date, today)));
    const consumed = logs.reduce((s, l) => s + l.amount, 0);
    const goal = 2.5;
    const percentage = Math.min(Math.round((consumed / goal) * 100), 100);
    res.json({
      date: today,
      consumed: Math.round(consumed * 10) / 10,
      goal,
      percentage,
      logs: logs.map(l => ({ amount: l.amount, time: l.time })),
    });
  } catch (err) {
    req.log.error({ err }, "logWaterIntake error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
