import { Router } from "express";
import { db } from "@workspace/db";
import { labsTable, labBookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/", async (req, res): Promise<void> => {
  try {
    const labs = await db.select().from(labsTable);
    res.json(labs);
  } catch (err) {
    req.log.error({ err }, "listLabs error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bookings", async (req, res): Promise<void> => {
  try {
    const bookings = await db.select().from(labBookingsTable).where(eq(labBookingsTable.userId, DEFAULT_USER_ID));
    res.json(bookings);
  } catch (err) {
    req.log.error({ err }, "listLabBookings error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/bookings", async (req, res): Promise<void> => {
  try {
    const { labId, testName, date, time, homeCollection } = req.body;
    const lab = await db.query.labsTable.findFirst({ where: eq(labsTable.id, labId) });
    if (!lab) {
      res.status(404).json({ error: "Lab not found" });
      return;
    }
    const [booking] = await db.insert(labBookingsTable).values({
      userId: DEFAULT_USER_ID,
      labId,
      labName: lab.name,
      testName,
      date,
      time,
      homeCollection: homeCollection ?? false,
    }).returning();
    res.status(201).json(booking);
  } catch (err) {
    req.log.error({ err }, "createLabBooking error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
