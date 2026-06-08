import { Router } from "express";
import { db } from "@workspace/db";
import { insurancePlansTable, userInsuranceTable, insuranceClaimsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/plans", async (req, res) => {
  try {
    const plans = await db.select().from(insurancePlansTable).where(eq(insurancePlansTable.active, true));
    res.json(plans);
  } catch (err) {
    req.log.error({ err }, "listInsurancePlans error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/my-insurance", async (req, res) => {
  try {
    const policies = await db.select().from(userInsuranceTable).where(eq(userInsuranceTable.userId, DEFAULT_USER_ID));
    res.json(policies);
  } catch (err) {
    req.log.error({ err }, "getMyInsurance error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/claims", async (req, res) => {
  try {
    const claims = await db.select().from(insuranceClaimsTable).where(eq(insuranceClaimsTable.userId, DEFAULT_USER_ID));
    res.json(claims);
  } catch (err) {
    req.log.error({ err }, "listClaims error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
