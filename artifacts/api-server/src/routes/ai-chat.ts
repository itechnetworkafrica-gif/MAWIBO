import { Router } from "express";
import { db } from "@workspace/db";
import { chatSessionsTable, chatMessagesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const DEFAULT_USER_ID = 1;

router.get("/sessions", async (req, res) => {
  try {
    const sessions = await db.select().from(chatSessionsTable)
      .where(eq(chatSessionsTable.userId, DEFAULT_USER_ID))
      .orderBy(chatSessionsTable.createdAt);
    const result = await Promise.all(sessions.map(async (s) => {
      const messages = await db.select().from(chatMessagesTable).where(eq(chatMessagesTable.sessionId, s.id));
      return {
        ...s,
        messageCount: messages.length,
        lastMessage: messages.length > 0 ? messages[messages.length - 1].content.slice(0, 80) : null,
      };
    }));
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "listChatSessions error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/sessions", async (req, res) => {
  try {
    const { topic } = req.body;
    const [session] = await db.insert(chatSessionsTable).values({ userId: DEFAULT_USER_ID, topic }).returning();
    res.status(201).json({ ...session, messageCount: 0, lastMessage: null });
  } catch (err) {
    req.log.error({ err }, "createChatSession error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sessions/:id/messages", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const messages = await db.select().from(chatMessagesTable)
      .where(eq(chatMessagesTable.sessionId, id))
      .orderBy(chatMessagesTable.createdAt);
    res.json(messages);
  } catch (err) {
    req.log.error({ err }, "getChatMessages error");
    res.status(500).json({ error: "Internal server error" });
  }
});

const AI_RESPONSES: Record<string, string> = {
  default: "Thank you for sharing that with me. Based on what you've described, I'd recommend consulting with a healthcare professional for a proper evaluation. In the meantime, make sure to stay hydrated and get adequate rest.",
  headache: "Headaches can have many causes including dehydration, stress, poor sleep, or eye strain. If your headache is severe, sudden, or accompanied by fever or stiff neck, please seek immediate medical attention. Otherwise, try resting in a quiet dark room and staying well hydrated.",
  fever: "A fever is your body's natural defense against infection. For adults, a temperature above 38.5°C (101.3°F) warrants attention. Stay hydrated, rest, and take paracetamol if needed. Seek immediate care if fever exceeds 40°C (104°F) or is accompanied by difficulty breathing.",
  cough: "Coughs can be caused by infections, allergies, or environmental factors. Stay hydrated, use honey for soothing, and avoid irritants. A persistent cough lasting more than 3 weeks or accompanied by blood should be evaluated by a doctor.",
  malaria: "Malaria is common in Liberia. Symptoms include fever, chills, headache, and fatigue. If you suspect malaria, please visit a healthcare facility immediately for a rapid diagnostic test. Early treatment is crucial. We can help you find the nearest clinic.",
  diabetes: "Managing diabetes requires regular monitoring of blood sugar, a healthy diet, regular exercise, and medication adherence. It's important to track your readings daily. Would you like me to help you log your blood sugar or find a diabetes specialist near you?",
};

function generateAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("headache") || lower.includes("head pain")) return AI_RESPONSES.headache;
  if (lower.includes("fever") || lower.includes("temperature")) return AI_RESPONSES.fever;
  if (lower.includes("cough")) return AI_RESPONSES.cough;
  if (lower.includes("malaria")) return AI_RESPONSES.malaria;
  if (lower.includes("diabetes") || lower.includes("blood sugar")) return AI_RESPONSES.diabetes;
  return AI_RESPONSES.default;
}

router.post("/sessions/:id/messages", async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { content } = req.body;

    await db.insert(chatMessagesTable).values({ sessionId, role: "user", content });

    const aiContent = generateAIResponse(content);
    const [aiMessage] = await db.insert(chatMessagesTable).values({ sessionId, role: "assistant", content: aiContent }).returning();

    res.json(aiMessage);
  } catch (err) {
    req.log.error({ err }, "sendChatMessage error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
