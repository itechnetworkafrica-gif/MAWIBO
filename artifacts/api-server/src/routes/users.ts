import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  healthProfilesTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

const DEFAULT_USER_ID = 1;

router.get("/profile", async (req, res) => {
  try {
    let user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, DEFAULT_USER_ID),
    });
    if (!user) {
      [user] = await db
        .insert(usersTable)
        .values({
          id: DEFAULT_USER_ID,
          name: "Amara Johnson",
          email: "amara.johnson@mawibo.lr",
          phone: "+231-555-0100",
          county: "Montserrado",
          city: "Monrovia",
          gender: "female",
          dateOfBirth: "1992-03-15",
        })
        .returning();
    }
    res.json(user);
  } catch (err) {
    req.log.error({ err }, "getProfile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const { name, phone, county, city, dateOfBirth, gender, avatarUrl } = req.body;
    const [updated] = await db
      .update(usersTable)
      .set({ name, phone, county, city, dateOfBirth, gender, avatarUrl })
      .where(eq(usersTable.id, DEFAULT_USER_ID))
      .returning();
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "updateProfile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/health-profile", async (req, res) => {
  try {
    let profile = await db.query.healthProfilesTable.findFirst({
      where: eq(healthProfilesTable.userId, DEFAULT_USER_ID),
    });
    if (!profile) {
      [profile] = await db
        .insert(healthProfilesTable)
        .values({
          userId: DEFAULT_USER_ID,
          bloodGroup: "O+",
          height: 165,
          weight: 65,
          allergies: ["Penicillin"],
          chronicConditions: [],
          healthScore: 78,
        })
        .returning();
    }
    const bmi = profile.height && profile.weight
      ? Math.round((profile.weight / Math.pow(profile.height / 100, 2)) * 10) / 10
      : null;
    res.json({ ...profile, bmi });
  } catch (err) {
    req.log.error({ err }, "getHealthProfile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/health-profile", async (req, res) => {
  try {
    const { bloodGroup, height, weight, allergies, chronicConditions } = req.body;
    let profile = await db.query.healthProfilesTable.findFirst({
      where: eq(healthProfilesTable.userId, DEFAULT_USER_ID),
    });
    if (!profile) {
      [profile] = await db
        .insert(healthProfilesTable)
        .values({ userId: DEFAULT_USER_ID, bloodGroup, height, weight, allergies: allergies ?? [], chronicConditions: chronicConditions ?? [], healthScore: 72 })
        .returning();
    } else {
      [profile] = await db
        .update(healthProfilesTable)
        .set({ bloodGroup, height, weight, allergies, chronicConditions })
        .where(eq(healthProfilesTable.userId, DEFAULT_USER_ID))
        .returning();
    }
    const bmi = profile!.height && profile!.weight
      ? Math.round((profile!.weight / Math.pow(profile!.height / 100, 2)) * 10) / 10
      : null;
    res.json({ ...profile, bmi });
  } catch (err) {
    req.log.error({ err }, "updateHealthProfile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
