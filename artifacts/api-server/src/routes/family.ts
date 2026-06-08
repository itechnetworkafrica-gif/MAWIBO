import { Router } from "express";
import { db } from "@workspace/db";
import { familyMembersTable, healthGoalsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/members", async (req, res) => {
  try {
    const members = await db.select().from(familyMembersTable).where(eq(familyMembersTable.userId, DEFAULT_USER_ID));
    res.json(members);
  } catch (err) {
    req.log.error({ err }, "listFamilyMembers error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/members", async (req, res) => {
  try {
    const { name, relationship, dateOfBirth, gender, bloodGroup, phone, medicalConditions, allergies, notes } = req.body;
    const [m] = await db.insert(familyMembersTable).values({ userId: DEFAULT_USER_ID, name, relationship, dateOfBirth, gender, bloodGroup, phone, medicalConditions, allergies, notes }).returning();
    res.status(201).json(m);
  } catch (err) {
    req.log.error({ err }, "addFamilyMember error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/goals", async (req, res) => {
  try {
    const goals = await db.select().from(healthGoalsTable).where(eq(healthGoalsTable.userId, DEFAULT_USER_ID));
    res.json(goals);
  } catch (err) {
    req.log.error({ err }, "listHealthGoals error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/goals", async (req, res) => {
  try {
    const { title, description, category, targetDate } = req.body;
    const [g] = await db.insert(healthGoalsTable).values({ userId: DEFAULT_USER_ID, title, description, category, targetDate }).returning();
    res.status(201).json(g);
  } catch (err) {
    req.log.error({ err }, "addHealthGoal error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/goals/:id/progress", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { progress } = req.body;
    const [g] = await db.update(healthGoalsTable).set({ progress, status: progress >= 100 ? "completed" : "active" })
      .where(eq(healthGoalsTable.id, id)).returning();
    res.json(g);
  } catch (err) {
    req.log.error({ err }, "updateGoalProgress error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
