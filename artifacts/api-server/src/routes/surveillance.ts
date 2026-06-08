import { Router } from "express";
import { db } from "@workspace/db";
import { diseaseReportsTable, outbreakAlertsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";

const router = Router();

router.get("/disease-reports", async (req, res) => {
  try {
    const reports = await db.select().from(diseaseReportsTable).orderBy(desc(diseaseReportsTable.reportDate)).limit(50);
    res.json(reports);
  } catch (err) {
    req.log.error({ err }, "listDiseaseReports error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/outbreak-alerts", async (req, res) => {
  try {
    const alerts = await db.select().from(outbreakAlertsTable).where(eq(outbreakAlertsTable.active, 1)).orderBy(desc(outbreakAlertsTable.createdAt));
    res.json(alerts);
  } catch (err) {
    req.log.error({ err }, "listOutbreakAlerts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/county-stats", async (req, res) => {
  try {
    const counties = [
      "Montserrado","Margibi","Grand Bassa","Bong","Nimba","Lofa",
      "Maryland","Grand Cape Mount","Sinoe","Rivercess","Grand Gedeh","River Gee","Gbarpolu"
    ];
    const stats = counties.map(county => ({
      county,
      malariaCases: Math.floor(Math.random() * 200 + 20),
      typhoidCases: Math.floor(Math.random() * 50 + 5),
      tbCases: Math.floor(Math.random() * 30 + 2),
      hivCases: Math.floor(Math.random() * 40 + 3),
      population: Math.floor(Math.random() * 500000 + 50000),
      healthFacilities: Math.floor(Math.random() * 20 + 2),
      alertLevel: ["normal","watch","warning"][Math.floor(Math.random() * 3)],
    }));
    res.json(stats);
  } catch (err) {
    req.log.error({ err }, "countyStats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/national-kpis", async (req, res) => {
  try {
    res.json({
      totalPopulation: 5413000,
      registeredUsers: 12847,
      activeProviders: 342,
      consultationsToday: 89,
      vaccinationCoverage: 67,
      maternalMortalityRate: 1072, // per 100,000 live births
      infantMortalityRate: 78, // per 1,000 live births
      activeOutbreaks: 2,
      bloodUnitsAvailable: 143,
      activeDoctors: 48,
    });
  } catch (err) {
    req.log.error({ err }, "nationalKpis error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
