import { Router } from "express";
import { db } from "@workspace/db";
import { chatSessionsTable, chatMessagesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import OpenAI from "openai";

const router = Router();
const DEFAULT_USER_ID = 1;

const openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });

const SYSTEM_PROMPT = `You are MAWIBO Health Mate, an expert AI health assistant for Liberia and West Africa. You are knowledgeable about:
- Tropical diseases common in West Africa: malaria, typhoid, cholera, tuberculosis, HIV, hepatitis
- Local healthcare facilities in Liberia (JFK Medical Center, Redemption Hospital, Phebe Hospital, ELWA Hospital)
- Liberian health context, culture, and available treatments
- General medicine, symptoms, medications, nutrition, and wellness
- When to refer patients to emergency care vs. routine visits

Guidelines:
- Always be empathetic, clear, and culturally sensitive
- For emergencies (chest pain, stroke symptoms, severe bleeding, difficulty breathing), ALWAYS advise immediate emergency care first
- Do not diagnose definitively — recommend professional consultation for serious concerns
- Reference local Liberian hospitals and resources when relevant
- Keep responses concise but thorough (2-4 paragraphs max)
- Use simple, accessible language appropriate for a general audience`;

router.get("/sessions", async (req, res) => {
  try {
    const sessions = await db.select().from(chatSessionsTable)
      .where(eq(chatSessionsTable.userId, DEFAULT_USER_ID))
      .orderBy(desc(chatSessionsTable.createdAt));
    const result = await Promise.all(sessions.map(async (s) => {
      const messages = await db.select().from(chatMessagesTable)
        .where(eq(chatMessagesTable.sessionId, s.id))
        .orderBy(desc(chatMessagesTable.createdAt))
        .limit(1);
      return {
        ...s,
        lastMessage: messages[0]?.content?.slice(0, 80) ?? null,
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

router.post("/sessions/:id/messages", async (req, res) => {
  try {
    const sessionId = parseInt(req.params.id);
    const { content } = req.body;

    await db.insert(chatMessagesTable).values({ sessionId, role: "user", content });

    const history = await db.select().from(chatMessagesTable)
      .where(eq(chatMessagesTable.sessionId, sessionId))
      .orderBy(chatMessagesTable.createdAt)
      .limit(20);

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...history.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    ];

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      stream: true,
      max_tokens: 1024,
    });

    let fullResponse = "";
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content;
      if (text) {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      }
    }

    await db.insert(chatMessagesTable).values({ sessionId, role: "assistant", content: fullResponse });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "sendChatMessage error");
    res.write(`data: ${JSON.stringify({ error: "AI service error" })}\n\n`);
    res.end();
  }
});

export default router;
