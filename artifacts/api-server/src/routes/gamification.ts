import { Router } from "express";
import { db } from "@workspace/db";
import { healthCoinsTable, coinTransactionsTable, badgesTable, dailyChallengesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/coins", async (req, res) => {
  try {
    let wallet = await db.query.healthCoinsTable.findFirst({ where: eq(healthCoinsTable.userId, DEFAULT_USER_ID) });
    if (!wallet) {
      const [w] = await db.insert(healthCoinsTable).values({ userId: DEFAULT_USER_ID, balance: 250, totalEarned: 250 }).returning();
      wallet = w;
    }
    const transactions = await db.select().from(coinTransactionsTable)
      .where(eq(coinTransactionsTable.userId, DEFAULT_USER_ID))
      .orderBy(desc(coinTransactionsTable.createdAt)).limit(10);
    res.json({ ...wallet, transactions });
  } catch (err) {
    req.log.error({ err }, "getCoins error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/badges", async (req, res) => {
  try {
    const badges = await db.select().from(badgesTable).where(eq(badgesTable.userId, DEFAULT_USER_ID));
    res.json(badges);
  } catch (err) {
    req.log.error({ err }, "getBadges error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/challenges", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    let challenges = await db.select().from(dailyChallengesTable)
      .where(eq(dailyChallengesTable.userId, DEFAULT_USER_ID));
    const todayChallenges = challenges.filter(c => c.date === today);
    if (todayChallenges.length === 0) {
      const defaultChallenges = [
        { userId: DEFAULT_USER_ID, challengeType: "water", title: "Hydration Champion", description: "Drink 8 glasses of water today", targetValue: 8, coinsReward: 20, date: today },
        { userId: DEFAULT_USER_ID, challengeType: "steps", title: "Step Master", description: "Walk 5,000 steps today", targetValue: 5000, coinsReward: 30, date: today },
        { userId: DEFAULT_USER_ID, challengeType: "medication", title: "Medication Hero", description: "Take all your medications on time", targetValue: 3, coinsReward: 25, date: today },
      ];
      const inserted = await db.insert(dailyChallengesTable).values(defaultChallenges).returning();
      res.json(inserted);
    } else {
      res.json(todayChallenges);
    }
  } catch (err) {
    req.log.error({ err }, "getChallenges error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/earn-coins", async (req, res) => {
  try {
    const { amount, reason, description } = req.body;
    await db.insert(coinTransactionsTable).values({ userId: DEFAULT_USER_ID, amount, type: "earn", reason, description });
    let wallet = await db.query.healthCoinsTable.findFirst({ where: eq(healthCoinsTable.userId, DEFAULT_USER_ID) });
    if (!wallet) {
      const [w] = await db.insert(healthCoinsTable).values({ userId: DEFAULT_USER_ID, balance: amount, totalEarned: amount }).returning();
      wallet = w;
    } else {
      const [w] = await db.update(healthCoinsTable)
        .set({ balance: wallet.balance + amount, totalEarned: wallet.totalEarned + amount })
        .where(eq(healthCoinsTable.userId, DEFAULT_USER_ID)).returning();
      wallet = w;
    }
    res.json(wallet);
  } catch (err) {
    req.log.error({ err }, "earnCoins error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
