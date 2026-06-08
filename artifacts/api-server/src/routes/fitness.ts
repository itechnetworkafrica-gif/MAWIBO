import { Router } from "express";
import { db } from "@workspace/db";
import { workoutsTable, stepsLogsTable, fitnessGoalsTable } from "@workspace/db";
import { eq, desc, gte, and } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/workouts", async (req, res) => {
  try {
    const workouts = await db.select().from(workoutsTable)
      .where(eq(workoutsTable.userId, DEFAULT_USER_ID))
      .orderBy(desc(workoutsTable.date)).limit(20);
    res.json(workouts);
  } catch (err) {
    req.log.error({ err }, "listWorkouts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/workouts", async (req, res) => {
  try {
    const { name, type, duration, caloriesBurned, date, notes } = req.body;
    const today = date || new Date().toISOString().split("T")[0];
    const [w] = await db.insert(workoutsTable).values({ userId: DEFAULT_USER_ID, name, type, duration, caloriesBurned, date: today, notes }).returning();
    res.status(201).json(w);
  } catch (err) {
    req.log.error({ err }, "logWorkout error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/steps", async (req, res) => {
  try {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const steps = await db.select().from(stepsLogsTable)
      .where(and(eq(stepsLogsTable.userId, DEFAULT_USER_ID), gte(stepsLogsTable.date, weekAgo.toISOString().split("T")[0])))
      .orderBy(stepsLogsTable.date);
    const todayStr = new Date().toISOString().split("T")[0];
    const today = steps.find(s => s.date === todayStr);
    res.json({ weeklyData: steps, today: today ?? { steps: 0, distanceKm: 0, activeMinutes: 0 }, goal: 8000 });
  } catch (err) {
    req.log.error({ err }, "getSteps error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/steps", async (req, res) => {
  try {
    const { steps, distanceKm, activeMinutes } = req.body;
    const today = new Date().toISOString().split("T")[0];
    const [s] = await db.insert(stepsLogsTable).values({ userId: DEFAULT_USER_ID, date: today, steps, distanceKm, activeMinutes }).returning();
    res.status(201).json(s);
  } catch (err) {
    req.log.error({ err }, "logSteps error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/goals", async (req, res) => {
  try {
    const goals = await db.select().from(fitnessGoalsTable).where(eq(fitnessGoalsTable.userId, DEFAULT_USER_ID));
    res.json(goals);
  } catch (err) {
    req.log.error({ err }, "listFitnessGoals error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const [workouts, goals] = await Promise.all([
      db.select().from(workoutsTable).where(and(eq(workoutsTable.userId, DEFAULT_USER_ID), gte(workoutsTable.date, weekAgo.toISOString().split("T")[0]))),
      db.select().from(fitnessGoalsTable).where(eq(fitnessGoalsTable.userId, DEFAULT_USER_ID)),
    ]);
    const totalCalories = workouts.reduce((s, w) => s + (w.caloriesBurned ?? 0), 0);
    const totalMinutes = workouts.reduce((s, w) => s + w.duration, 0);
    res.json({ workoutsThisWeek: workouts.length, totalCaloriesBurned: totalCalories, totalActiveMinutes: totalMinutes, activeGoals: goals.filter(g => !g.achieved).length });
  } catch (err) {
    req.log.error({ err }, "fitnessSummary error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
