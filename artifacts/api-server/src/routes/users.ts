import { Router } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  healthProfilesTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const router = Router();
const DEFAULT_USER_ID = 1;

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hash.toString("hex")}`;
}

async function verifyPassword(stored: string, supplied: string): Promise<boolean> {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const suppliedHash = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashBuffer, suppliedHash);
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone, county, city } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const existing = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email.toLowerCase()),
    });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }
    const passwordHash = await hashPassword(password);
    const [user] = await db
      .insert(usersTable)
      .values({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ?? "",
        county: county ?? "Montserrado",
        city: city ?? "Monrovia",
        passwordHash,
      })
      .returning();
    res.status(201).json({
      token: `mawibo-${user.id}`,
      userId: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    req.log.error({ err }, "register error");
    res.status(500).json({ error: "Registration failed. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email.toLowerCase().trim()),
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    if (user.passwordHash) {
      const valid = await verifyPassword(user.passwordHash, password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
    }
    res.json({
      token: `mawibo-${user.id}`,
      userId: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    req.log.error({ err }, "login error");
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

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
    const bmi =
      profile.height && profile.weight
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
        .values({
          userId: DEFAULT_USER_ID,
          bloodGroup,
          height,
          weight,
          allergies: allergies ?? [],
          chronicConditions: chronicConditions ?? [],
          healthScore: 72,
        })
        .returning();
    } else {
      [profile] = await db
        .update(healthProfilesTable)
        .set({ bloodGroup, height, weight, allergies, chronicConditions })
        .where(eq(healthProfilesTable.userId, DEFAULT_USER_ID))
        .returning();
    }
    const bmi =
      profile!.height && profile!.weight
        ? Math.round((profile!.weight / Math.pow(profile!.height / 100, 2)) * 10) / 10
        : null;
    res.json({ ...profile, bmi });
  } catch (err) {
    req.log.error({ err }, "updateHealthProfile error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
