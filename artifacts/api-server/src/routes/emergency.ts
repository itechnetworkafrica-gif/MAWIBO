import { Router } from "express";
import { db } from "@workspace/db";
import { emergencyContactsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/contacts", async (req, res) => {
  try {
    const contacts = await db.select().from(emergencyContactsTable)
      .where(eq(emergencyContactsTable.userId, DEFAULT_USER_ID));
    res.json(contacts);
  } catch (err) {
    req.log.error({ err }, "listEmergencyContacts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/contacts", async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;
    const [contact] = await db.insert(emergencyContactsTable).values({
      userId: DEFAULT_USER_ID, name, phone, relationship,
    }).returning();
    res.status(201).json(contact);
  } catch (err) {
    req.log.error({ err }, "createEmergencyContact error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/contacts/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(emergencyContactsTable).where(eq(emergencyContactsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "deleteEmergencyContact error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
