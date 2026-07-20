/**
 * DEMO MODE MIDDLEWARE
 * When DATABASE_URL is not set, this intercepts all /api/* requests
 * and returns realistic mock data so the app works without a database.
 * Perfect for demos and pitches.
 */
import { type Request, type Response, type NextFunction, Router } from "express";

const DEMO_USER = {
  id: 1,
  name: "James Kollie",
  email: "demo@mawibo.com",
  phone: "+231 77 123 4567",
  county: "Montserrado",
  city: "Monrovia",
  gender: "male",
  dateOfBirth: "1990-03-15",
  avatarUrl: null,
  createdAt: new Date("2024-01-10").toISOString(),
};

const DEMO_HEALTH_PROFILE = {
  userId: 1,
  bloodGroup: "O+",
  height: 175,
  weight: 72,
  allergies: ["Penicillin"],
  chronicConditions: ["Hypertension (mild)"],
  healthScore: 82,
  bmi: 23.5,
};

const DEMO_VITALS = [
  { id: 1, userId: 1, systolic: 118, diastolic: 76, heartRate: 72, bloodSugar: 95, temperature: 36.8, oxygenSaturation: 98, weight: 72, recordedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, userId: 1, systolic: 122, diastolic: 80, heartRate: 74, bloodSugar: 98, temperature: 37.0, oxygenSaturation: 97, weight: 72.2, recordedAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 3, userId: 1, systolic: 115, diastolic: 74, heartRate: 68, bloodSugar: 92, temperature: 36.6, oxygenSaturation: 99, weight: 71.8, recordedAt: new Date(Date.now() - 259200000).toISOString() },
  { id: 4, userId: 1, systolic: 125, diastolic: 82, heartRate: 76, bloodSugar: 101, temperature: 37.1, oxygenSaturation: 97, weight: 72.5, recordedAt: new Date(Date.now() - 345600000).toISOString() },
  { id: 5, userId: 1, systolic: 119, diastolic: 78, heartRate: 71, bloodSugar: 97, temperature: 36.9, oxygenSaturation: 98, weight: 72.1, recordedAt: new Date(Date.now() - 432000000).toISOString() },
];

const DEMO_APPOINTMENTS = [
  { id: 1, userId: 1, doctorName: "Dr. Amara Sesay", specialty: "Cardiologist", facility: "JFK Medical Center", date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0], time: "09:00", status: "scheduled", notes: "Routine blood pressure check", type: "in-person" },
  { id: 2, userId: 1, doctorName: "Dr. Fatima Kamara", specialty: "General Practitioner", facility: "ELWA Hospital", date: new Date(Date.now() + 10 * 86400000).toISOString().split("T")[0], time: "14:30", status: "scheduled", notes: "Annual wellness exam", type: "in-person" },
  { id: 3, userId: 1, doctorName: "Dr. Emmanuel Weah", specialty: "Endocrinologist", facility: "Phebe Hospital", date: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0], time: "11:00", status: "completed", notes: "Blood sugar management", type: "in-person" },
  { id: 4, userId: 1, doctorName: "Dr. Miatta Johnson", specialty: "Nutritionist", facility: "Telekomunity Health", date: new Date(Date.now() + 21 * 86400000).toISOString().split("T")[0], time: "10:00", status: "scheduled", notes: "Diet plan review", type: "telemedicine" },
];

const DEMO_HEALTH_RECORDS = [
  { id: 1, userId: 1, type: "lab", title: "Complete Blood Count (CBC)", date: new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0], provider: "JFK Medical Center Lab", summary: "All values within normal range. Hemoglobin: 14.2 g/dL.", fileUrl: null, createdAt: new Date(Date.now() - 14 * 86400000).toISOString() },
  { id: 2, userId: 1, type: "prescription", title: "Amlodipine 5mg", date: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0], provider: "Dr. Amara Sesay", summary: "Once daily for hypertension management.", fileUrl: null, createdAt: new Date(Date.now() - 30 * 86400000).toISOString() },
  { id: 3, userId: 1, type: "imaging", title: "Chest X-Ray", date: new Date(Date.now() - 60 * 86400000).toISOString().split("T")[0], provider: "ELWA Hospital Radiology", summary: "No abnormalities detected. Lungs clear.", fileUrl: null, createdAt: new Date(Date.now() - 60 * 86400000).toISOString() },
  { id: 4, userId: 1, type: "lab", title: "Lipid Panel", date: new Date(Date.now() - 45 * 86400000).toISOString().split("T")[0], provider: "JFK Medical Center Lab", summary: "Total cholesterol: 185 mg/dL. HDL: 55. LDL: 110.", fileUrl: null, createdAt: new Date(Date.now() - 45 * 86400000).toISOString() },
];

const DEMO_MEDICATIONS = [
  { id: 1, userId: 1, name: "Amlodipine", dosage: "5mg", frequency: "once daily", startDate: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0], endDate: null, prescribedBy: "Dr. Amara Sesay", status: "active", notes: "Take in the morning", refillsRemaining: 2 },
  { id: 2, userId: 1, name: "Vitamin D3", dosage: "2000 IU", frequency: "once daily", startDate: new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0], endDate: null, prescribedBy: "Dr. Fatima Kamara", status: "active", notes: "Take with food", refillsRemaining: 5 },
  { id: 3, userId: 1, name: "Metformin", dosage: "500mg", frequency: "twice daily", startDate: new Date(Date.now() - 120 * 86400000).toISOString().split("T")[0], endDate: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0], prescribedBy: "Dr. Emmanuel Weah", status: "completed", notes: "With meals", refillsRemaining: 0 },
];

const DEMO_DASHBOARD_SUMMARY = {
  healthScore: 82,
  appointmentsThisMonth: 2,
  medicationsActive: 2,
  recordsCount: 4,
  upcomingAppointments: 3,
  moodAverage: 7.5,
  waterGoalProgress: 68,
};

const DEMO_HEALTH_SCORE = {
  score: 82,
  grade: "B+",
  trend: "up",
  breakdown: { fitness: 75, nutrition: 80, sleep: 85, mentalHealth: 88, preventiveCare: 82 },
  recommendations: [
    "Increase daily water intake to reach your 2.5L goal",
    "Schedule your overdue dental checkup",
    "Add 15 minutes of walking to your daily routine",
  ],
};

const DEMO_ACTIVITY_FEED = [
  { id: 1, type: "appointment", title: "Upcoming: Dr. Sesay", description: "Cardiology check-up in 3 days at JFK Medical Center", timestamp: new Date(Date.now() - 3600000).toISOString(), icon: "calendar" },
  { id: 2, type: "record", title: "Lab Results Ready", description: "Complete Blood Count results are available", timestamp: new Date(Date.now() - 86400000).toISOString(), icon: "file" },
  { id: 3, type: "medication", title: "Medication Reminder", description: "Amlodipine 5mg due this morning", timestamp: new Date(Date.now() - 7200000).toISOString(), icon: "pill" },
  { id: 4, type: "mood", title: "Daily Check-in", description: "You logged a 8/10 mood score yesterday", timestamp: new Date(Date.now() - 172800000).toISOString(), icon: "smile" },
  { id: 5, type: "appointment", title: "Appointment Completed", description: "Dr. Weah — Endocrinology visit last week", timestamp: new Date(Date.now() - 7 * 86400000).toISOString(), icon: "check" },
];

const DEMO_WATER = {
  date: new Date().toISOString().split("T")[0],
  consumed: 1.7,
  goal: 2.5,
  percentage: 68,
  logs: [
    { amount: 0.5, time: "07:30" },
    { amount: 0.3, time: "09:15" },
    { amount: 0.4, time: "12:00" },
    { amount: 0.5, time: "15:30" },
  ],
};

const DEMO_DOCTORS = [
  { id: 1, name: "Dr. Amara Sesay", specialty: "Cardiology", facility: "JFK Medical Center", rating: 4.8, experience: 12, available: true, phone: "+231 77 234 5678" },
  { id: 2, name: "Dr. Fatima Kamara", specialty: "General Practice", facility: "ELWA Hospital", rating: 4.9, experience: 8, available: true, phone: "+231 77 345 6789" },
  { id: 3, name: "Dr. Emmanuel Weah", specialty: "Endocrinology", facility: "Phebe Hospital", rating: 4.7, experience: 15, available: false, phone: "+231 77 456 7890" },
  { id: 4, name: "Dr. Miatta Johnson", specialty: "Nutrition & Dietetics", facility: "Telekomunity Health", rating: 4.6, experience: 6, available: true, phone: "+231 77 567 8901" },
];

const DEMO_HOSPITALS = [
  { id: 1, name: "JFK Medical Center", type: "Government", county: "Montserrado", city: "Monrovia", phone: "+231 77 000 0001", emergency: true, beds: 420 },
  { id: 2, name: "ELWA Hospital", type: "Mission", county: "Montserrado", city: "Monrovia", phone: "+231 77 000 0002", emergency: true, beds: 120 },
  { id: 3, name: "Phebe Hospital", type: "Mission", county: "Bong", city: "Ganta", phone: "+231 77 000 0003", emergency: true, beds: 200 },
  { id: 4, name: "Redemption Hospital", type: "Government", county: "Montserrado", city: "Monrovia", phone: "+231 77 000 0004", emergency: true, beds: 300 },
];

const DEMO_AI_SESSION = { id: 1, userId: 1, title: "General Health Query", createdAt: new Date(Date.now() - 86400000).toISOString(), messageCount: 2, lastMessage: "How can I help you today?" };

const AI_DEMO_RESPONSES = [
  "Based on your health profile, your blood pressure readings are trending well. Maintaining a low-sodium diet and regular moderate exercise will help keep it in the healthy range.",
  "Your recent CBC results look excellent! Hemoglobin at 14.2 g/dL is well within the normal range for adult males. Keep up your current nutrition habits.",
  "For hypertension management in Liberia's climate, staying well hydrated is especially important. Aim for your daily 2.5L water goal, and avoid excessive salt in your meals.",
  "I can see you have an appointment with Dr. Sesay in 3 days. It would be good to note any symptoms or concerns you want to discuss beforehand.",
];

let aiResponseIndex = 0;

function makeDemoRouter(): Router {
  const demo = Router();

  // ─── Auth ─────────────────────────────────────────────────────────────────
  demo.post("/users/login", (req: Request, res: Response) => {
    const { email, name } = req.body as { email?: string; name?: string };
    res.json({ token: "demo-token", userId: 1, name: name ?? DEMO_USER.name, email: email ?? DEMO_USER.email });
  });

  demo.post("/users/register", (req: Request, res: Response) => {
    const { email = "demo@mawibo.com", name = "Demo User" } = req.body as { email?: string; name?: string };
    res.status(201).json({ token: "demo-token", userId: 1, name, email });
  });

  demo.get("/users/profile", (_req: Request, res: Response) => res.json(DEMO_USER));
  demo.put("/users/profile", (req: Request, res: Response) => res.json({ ...DEMO_USER, ...(req.body as object) }));
  demo.get("/users/health-profile", (_req: Request, res: Response) => res.json(DEMO_HEALTH_PROFILE));
  demo.put("/users/health-profile", (req: Request, res: Response) => res.json({ ...DEMO_HEALTH_PROFILE, ...(req.body as object) }));

  // ─── Dashboard ────────────────────────────────────────────────────────────
  demo.get("/dashboard/summary", (_req: Request, res: Response) => res.json(DEMO_DASHBOARD_SUMMARY));
  demo.get("/dashboard/health-score", (_req: Request, res: Response) => res.json(DEMO_HEALTH_SCORE));
  demo.get("/dashboard/activity-feed", (_req: Request, res: Response) => res.json(DEMO_ACTIVITY_FEED));
  demo.get("/dashboard/vitals", (_req: Request, res: Response) => res.json({ entries: DEMO_VITALS }));
  demo.post("/dashboard/vitals", (req: Request, res: Response) => res.status(201).json({ id: 99, userId: 1, recordedAt: new Date().toISOString(), ...(req.body as object) }));
  demo.get("/dashboard/water-tracker", (_req: Request, res: Response) => res.json(DEMO_WATER));
  demo.post("/dashboard/water-tracker", (req: Request, res: Response) => res.json({ ...DEMO_WATER, ...(req.body as object) }));

  // ─── Appointments ─────────────────────────────────────────────────────────
  demo.get("/appointments", (_req: Request, res: Response) => res.json(DEMO_APPOINTMENTS));
  demo.get("/appointments/upcoming", (_req: Request, res: Response) => res.json(DEMO_APPOINTMENTS.filter(a => a.status === "scheduled").slice(0, 5)));
  demo.post("/appointments", (req: Request, res: Response) => res.status(201).json({ id: 99, userId: 1, status: "scheduled", ...(req.body as object) }));
  demo.get("/appointments/:id", (req: Request, res: Response) => {
    const appt = DEMO_APPOINTMENTS.find(a => a.id === Number(req.params["id"]));
    appt ? res.json(appt) : res.status(404).json({ error: "Not found" });
  });
  demo.patch("/appointments/:id", (req: Request, res: Response) => {
    const appt = DEMO_APPOINTMENTS.find(a => a.id === Number(req.params["id"])) ?? DEMO_APPOINTMENTS[0];
    res.json({ ...appt, ...(req.body as object) });
  });

  // ─── Health Records ───────────────────────────────────────────────────────
  demo.get("/health-records", (_req: Request, res: Response) => res.json(DEMO_HEALTH_RECORDS));
  demo.post("/health-records", (req: Request, res: Response) => res.status(201).json({ id: 99, userId: 1, createdAt: new Date().toISOString(), ...(req.body as object) }));
  demo.get("/health-records/:id", (req: Request, res: Response) => {
    const r = DEMO_HEALTH_RECORDS.find(x => x.id === Number(req.params["id"]));
    r ? res.json(r) : res.status(404).json({ error: "Not found" });
  });
  demo.delete("/health-records/:id", (_req: Request, res: Response) => res.status(204).end());

  // ─── Medications ──────────────────────────────────────────────────────────
  demo.get("/medications", (_req: Request, res: Response) => res.json(DEMO_MEDICATIONS));
  demo.post("/medications", (req: Request, res: Response) => res.status(201).json({ id: 99, userId: 1, status: "active", ...(req.body as object) }));
  demo.patch("/medications/:id", (req: Request, res: Response) => {
    const med = DEMO_MEDICATIONS.find(m => m.id === Number(req.params["id"])) ?? DEMO_MEDICATIONS[0];
    res.json({ ...med, ...(req.body as object) });
  });
  demo.delete("/medications/:id", (_req: Request, res: Response) => res.status(204).end());

  // ─── Doctors ──────────────────────────────────────────────────────────────
  demo.get("/doctors", (_req: Request, res: Response) => res.json(DEMO_DOCTORS));
  demo.get("/doctors/:id", (req: Request, res: Response) => {
    const d = DEMO_DOCTORS.find(x => x.id === Number(req.params["id"]));
    d ? res.json(d) : res.status(404).json({ error: "Not found" });
  });

  // ─── Hospitals ────────────────────────────────────────────────────────────
  demo.get("/hospitals", (_req: Request, res: Response) => res.json(DEMO_HOSPITALS));
  demo.get("/hospitals/:id", (req: Request, res: Response) => {
    const h = DEMO_HOSPITALS.find(x => x.id === Number(req.params["id"]));
    h ? res.json(h) : res.status(404).json({ error: "Not found" });
  });

  // ─── AI Chat (SSE stream) ─────────────────────────────────────────────────
  demo.get("/ai-chat/sessions", (_req: Request, res: Response) => res.json([DEMO_AI_SESSION]));
  demo.post("/ai-chat/sessions", (_req: Request, res: Response) => res.status(201).json({ ...DEMO_AI_SESSION, id: Date.now(), messageCount: 0, lastMessage: null }));
  demo.get("/ai-chat/sessions/:id/messages", (_req: Request, res: Response) => res.json([
    { id: 1, sessionId: 1, role: "assistant", content: "Hello! I'm MAWIBO AI, your personal health assistant. How can I help you today?", createdAt: new Date(Date.now() - 86400000).toISOString() },
  ]));
  demo.post("/ai-chat/sessions/:id/messages", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const response = AI_DEMO_RESPONSES[aiResponseIndex % AI_DEMO_RESPONSES.length];
    aiResponseIndex++;
    const words = response.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        res.write(`data: ${JSON.stringify({ content: (i === 0 ? "" : " ") + words[i] })}\n\n`);
        i++;
      } else {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        clearInterval(interval);
        res.end();
      }
    }, 40);
  });

  // ─── AI Tools ─────────────────────────────────────────────────────────────
  demo.get("/ai-tools", (_req: Request, res: Response) => res.json({ tools: [] }));
  demo.post("/ai-tools/:tool", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.flushHeaders?.();
    const msg = `Demo response for tool: ${req.params["tool"]}. In the full version, this connects to OpenAI for intelligent health insights.`;
    const words = msg.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        res.write(`data: ${JSON.stringify({ content: (i === 0 ? "" : " ") + words[i] })}\n\n`);
        i++;
      } else {
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        clearInterval(interval);
        res.end();
      }
    }, 40);
  });

  // ─── Other endpoints ──────────────────────────────────────────────────────
  demo.get("/pharmacies", (_req: Request, res: Response) => res.json([
    { id: 1, name: "Monrovia Central Pharmacy", county: "Montserrado", city: "Monrovia", phone: "+231 77 111 2222", open24h: true },
    { id: 2, name: "ELWA Pharmacy", county: "Montserrado", city: "Monrovia", phone: "+231 77 333 4444", open24h: false },
  ]));
  demo.get("/labs", (_req: Request, res: Response) => res.json([
    { id: 1, name: "JFK Lab Services", county: "Montserrado", phone: "+231 77 555 6666", tests: ["CBC", "Lipid Panel", "Glucose", "HbA1c"] },
    { id: 2, name: "SOS Medical Lab", county: "Montserrado", phone: "+231 77 777 8888", tests: ["Malaria RDT", "Typhoid", "HIV", "Hepatitis B"] },
  ]));
  demo.get("/emergency", (_req: Request, res: Response) => res.json({ number: "911", hospitals: DEMO_HOSPITALS.filter(h => h.emergency) }));
  demo.get("/insurance", (_req: Request, res: Response) => res.json({ plans: [], enrolled: null }));
  demo.get("/vaccinations", (_req: Request, res: Response) => res.json([
    { id: 1, userId: 1, vaccine: "Yellow Fever", date: "2022-06-10", nextDue: null, provider: "JFK Medical Center", status: "completed" },
    { id: 2, userId: 1, vaccine: "COVID-19 (Booster)", date: "2023-02-14", nextDue: null, provider: "ELWA Hospital", status: "completed" },
    { id: 3, userId: 1, vaccine: "Typhoid", date: "2021-09-01", nextDue: "2024-09-01", provider: "Redemption Hospital", status: "due" },
  ]));
  demo.get("/fitness", (_req: Request, res: Response) => res.json({ steps: 6420, caloriesBurned: 312, activeMinutes: 38, weeklyGoal: 150, weeklyProgress: 112 }));
  demo.get("/mental-health", (_req: Request, res: Response) => res.json({ moodLogs: [
    { id: 1, userId: 1, mood: 8, note: "Feeling good today", date: new Date(Date.now() - 86400000).toISOString().split("T")[0] },
    { id: 2, userId: 1, mood: 7, note: "A bit tired", date: new Date(Date.now() - 172800000).toISOString().split("T")[0] },
  ]}));
  demo.get("/gamification", (_req: Request, res: Response) => res.json({ points: 1250, level: 5, badges: ["Early Bird", "Hydration Hero", "Streak 7"], streak: 7 }));
  demo.get("/family", (_req: Request, res: Response) => res.json({ members: [] }));
  demo.get("/blood-bank", (_req: Request, res: Response) => res.json({ bloodType: "O+", lastDonation: "2023-11-20", nextEligible: "2024-05-20", centers: [{ name: "JFK Blood Bank", phone: "+231 77 000 0001" }] }));
  demo.get("/surveillance", (_req: Request, res: Response) => res.json({ alerts: [] }));
  demo.get("/health", (_req: Request, res: Response) => res.json({ status: "ok", mode: "demo" }));

  // Catch-all for any unmapped demo route
  demo.use((_req: Request, res: Response) => res.json({ data: [], message: "Demo mode — no data configured for this endpoint" }));

  return demo;
}

export function demoMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!process.env["DATABASE_URL"]) {
    // Strip the /api prefix so the demo router sees clean paths
    req.url = req.url.replace(/^\/api/, "") || "/";
    makeDemoRouter()(req, res, next);
    return;
  }
  next();
}
