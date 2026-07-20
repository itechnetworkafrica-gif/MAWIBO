/**
 * Vercel serverless entry point — standalone, no monorepo imports needed.
 * Routes all /api/* requests. Returns demo data when DATABASE_URL is absent.
 */
import type { IncomingMessage, ServerResponse } from "http";

// ─── Demo data ────────────────────────────────────────────────────────────────

const NOW = Date.now();
const ago = (days: number) => new Date(NOW - days * 86_400_000).toISOString();
const from = (days: number) => new Date(NOW + days * 86_400_000).toISOString().split("T")[0];
const agoDate = (days: number) => new Date(NOW - days * 86_400_000).toISOString().split("T")[0];
const today = new Date(NOW).toISOString().split("T")[0];

const DEMO_USER = { id: 1, name: "James Kollie", email: "demo@mawibo.com", phone: "+231 77 123 4567", county: "Montserrado", city: "Monrovia", gender: "male", dateOfBirth: "1990-03-15", avatarUrl: null };
const DEMO_HEALTH_PROFILE = { userId: 1, bloodGroup: "O+", height: 175, weight: 72, allergies: ["Penicillin"], chronicConditions: ["Hypertension (mild)"], healthScore: 82, bmi: 23.5 };
const DEMO_VITALS = [
  { id: 1, userId: 1, systolic: 118, diastolic: 76, heartRate: 72, bloodSugar: 95, temperature: 36.8, oxygenSaturation: 98, weight: 72, recordedAt: ago(1) },
  { id: 2, userId: 1, systolic: 122, diastolic: 80, heartRate: 74, bloodSugar: 98, temperature: 37.0, oxygenSaturation: 97, weight: 72.2, recordedAt: ago(2) },
  { id: 3, userId: 1, systolic: 115, diastolic: 74, heartRate: 68, bloodSugar: 92, temperature: 36.6, oxygenSaturation: 99, weight: 71.8, recordedAt: ago(3) },
];
const DEMO_APPOINTMENTS = [
  { id: 1, userId: 1, doctorName: "Dr. Amara Sesay", specialty: "Cardiologist", facility: "JFK Medical Center", date: from(3), time: "09:00", status: "scheduled", notes: "Routine blood pressure check", type: "in-person" },
  { id: 2, userId: 1, doctorName: "Dr. Fatima Kamara", specialty: "General Practitioner", facility: "ELWA Hospital", date: from(10), time: "14:30", status: "scheduled", notes: "Annual wellness exam", type: "in-person" },
  { id: 3, userId: 1, doctorName: "Dr. Emmanuel Weah", specialty: "Endocrinologist", facility: "Phebe Hospital", date: agoDate(7), time: "11:00", status: "completed", notes: "Blood sugar management", type: "in-person" },
];
const DEMO_RECORDS = [
  { id: 1, userId: 1, type: "lab", title: "Complete Blood Count (CBC)", date: agoDate(14), provider: "JFK Medical Center Lab", summary: "All values within normal range. Hemoglobin: 14.2 g/dL.", fileUrl: null, createdAt: ago(14) },
  { id: 2, userId: 1, type: "prescription", title: "Amlodipine 5mg", date: agoDate(30), provider: "Dr. Amara Sesay", summary: "Once daily for hypertension management.", fileUrl: null, createdAt: ago(30) },
  { id: 3, userId: 1, type: "imaging", title: "Chest X-Ray", date: agoDate(60), provider: "ELWA Hospital Radiology", summary: "No abnormalities detected. Lungs clear.", fileUrl: null, createdAt: ago(60) },
];
const DEMO_MEDS = [
  { id: 1, userId: 1, name: "Amlodipine", dosage: "5mg", frequency: "once daily", startDate: agoDate(30), endDate: null, prescribedBy: "Dr. Amara Sesay", status: "active", notes: "Take in the morning", refillsRemaining: 2 },
  { id: 2, userId: 1, name: "Vitamin D3", dosage: "2000 IU", frequency: "once daily", startDate: agoDate(90), endDate: null, prescribedBy: "Dr. Fatima Kamara", status: "active", notes: "Take with food", refillsRemaining: 5 },
];
const DEMO_DOCTORS = [
  { id: 1, name: "Dr. Amara Sesay", specialty: "Cardiology", facility: "JFK Medical Center", rating: 4.8, experience: 12, available: true, phone: "+231 77 234 5678" },
  { id: 2, name: "Dr. Fatima Kamara", specialty: "General Practice", facility: "ELWA Hospital", rating: 4.9, experience: 8, available: true, phone: "+231 77 345 6789" },
  { id: 3, name: "Dr. Emmanuel Weah", specialty: "Endocrinology", facility: "Phebe Hospital", rating: 4.7, experience: 15, available: false, phone: "+231 77 456 7890" },
];
const DEMO_HOSPITALS = [
  { id: 1, name: "JFK Medical Center", type: "Government", county: "Montserrado", city: "Monrovia", phone: "+231 77 000 0001", emergency: true, beds: 420 },
  { id: 2, name: "ELWA Hospital", type: "Mission", county: "Montserrado", city: "Monrovia", phone: "+231 77 000 0002", emergency: true, beds: 120 },
  { id: 3, name: "Phebe Hospital", type: "Mission", county: "Bong", city: "Ganta", phone: "+231 77 000 0003", emergency: true, beds: 200 },
];
const DEMO_PHARMACIES = [
  { id: 1, name: "Monrovia Central Pharmacy", county: "Montserrado", city: "Monrovia", phone: "+231 77 111 2222", open24h: true },
  { id: 2, name: "ELWA Pharmacy", county: "Montserrado", city: "Monrovia", phone: "+231 77 333 4444", open24h: false },
];
const DEMO_LABS = [
  { id: 1, name: "JFK Lab Services", county: "Montserrado", phone: "+231 77 555 6666", tests: ["CBC", "Lipid Panel", "Glucose", "HbA1c"] },
  { id: 2, name: "SOS Medical Lab", county: "Montserrado", phone: "+231 77 777 8888", tests: ["Malaria RDT", "Typhoid", "HIV", "Hepatitis B"] },
];
const AI_RESPONSES = [
  "Based on your health profile, your blood pressure readings are trending well. A low-sodium diet and regular moderate exercise will help keep it in the healthy range.",
  "Your recent CBC results look excellent! Hemoglobin at 14.2 g/dL is well within the normal range for adult males. Keep up your current nutrition habits.",
  "For hypertension management in Liberia's climate, staying well hydrated is especially important. Aim for your daily 2.5L water goal and avoid excessive salt in your meals.",
  "I can see you have an appointment with Dr. Sesay in 3 days. It would be good to note any symptoms or concerns you want to discuss beforehand.",
  "Your health score of 82 places you in excellent standing. Maintaining your medication schedule and annual checkups will keep you on track.",
];
let aiIdx = 0;

// ─── Route table ──────────────────────────────────────────────────────────────

function getResponse(path: string, method: string): { status: number; body: unknown } | null {
  const m = method.toUpperCase();

  if (path === "/health") return { status: 200, body: { status: "ok", mode: "demo" } };

  // Auth
  if (path === "/users/login" && m === "POST") return { status: 200, body: { token: "demo-token", userId: 1, name: DEMO_USER.name, email: DEMO_USER.email } };
  if (path === "/users/register" && m === "POST") return { status: 201, body: { token: "demo-token", userId: 1, name: DEMO_USER.name, email: DEMO_USER.email } };
  if (path === "/users/profile" && m === "GET") return { status: 200, body: DEMO_USER };
  if (path === "/users/profile" && (m === "PUT" || m === "PATCH")) return { status: 200, body: DEMO_USER };
  if (path === "/users/health-profile" && m === "GET") return { status: 200, body: DEMO_HEALTH_PROFILE };
  if (path === "/users/health-profile" && (m === "PUT" || m === "PATCH")) return { status: 200, body: DEMO_HEALTH_PROFILE };

  // Dashboard
  if (path === "/dashboard/summary") return { status: 200, body: { healthScore: 82, appointmentsThisMonth: 2, medicationsActive: 2, recordsCount: 3, upcomingAppointments: 2, moodAverage: 7.5, waterGoalProgress: 68 } };
  if (path === "/dashboard/health-score") return { status: 200, body: { score: 82, grade: "B+", trend: "up", breakdown: { fitness: 75, nutrition: 80, sleep: 85, mentalHealth: 88, preventiveCare: 82 }, recommendations: ["Increase daily water intake to reach your 2.5L goal", "Add 15 minutes of walking to your daily routine", "Schedule your overdue dental checkup"] } };
  if (path === "/dashboard/activity-feed") return { status: 200, body: [
    { id: 1, type: "appointment", title: "Upcoming: Dr. Sesay", description: "Cardiology check-up in 3 days at JFK Medical Center", timestamp: ago(0.04), icon: "calendar" },
    { id: 2, type: "record", title: "Lab Results Ready", description: "Complete Blood Count results are available", timestamp: ago(1), icon: "file" },
    { id: 3, type: "medication", title: "Medication Reminder", description: "Amlodipine 5mg due this morning", timestamp: ago(0.08), icon: "pill" },
  ]};
  if (path === "/dashboard/vitals" && m === "GET") return { status: 200, body: { entries: DEMO_VITALS } };
  if (path === "/dashboard/vitals" && m === "POST") return { status: 201, body: { id: 99, userId: 1, recordedAt: new Date().toISOString() } };
  if (path === "/dashboard/water-tracker" && m === "GET") return { status: 200, body: { date: today, consumed: 1.7, goal: 2.5, percentage: 68, logs: [{ amount: 0.5, time: "07:30" }, { amount: 0.3, time: "09:15" }, { amount: 0.4, time: "12:00" }, { amount: 0.5, time: "15:30" }] } };
  if (path === "/dashboard/water-tracker" && m === "POST") return { status: 200, body: { date: today, consumed: 2.0, goal: 2.5, percentage: 80, logs: [] } };

  // Appointments
  if (path === "/appointments" && m === "GET") return { status: 200, body: DEMO_APPOINTMENTS };
  if (path === "/appointments/upcoming") return { status: 200, body: DEMO_APPOINTMENTS.filter(a => a.status === "scheduled") };
  if (path === "/appointments" && m === "POST") return { status: 201, body: { id: 99, userId: 1, status: "scheduled", ...DEMO_APPOINTMENTS[0] } };
  if (path.startsWith("/appointments/") && m === "GET") return { status: 200, body: DEMO_APPOINTMENTS[0] };
  if (path.startsWith("/appointments/") && (m === "PATCH" || m === "PUT")) return { status: 200, body: DEMO_APPOINTMENTS[0] };

  // Health records
  if (path === "/health-records" && m === "GET") return { status: 200, body: DEMO_RECORDS };
  if (path === "/health-records" && m === "POST") return { status: 201, body: { id: 99, userId: 1, createdAt: new Date().toISOString(), ...DEMO_RECORDS[0] } };
  if (path.startsWith("/health-records/") && m === "GET") return { status: 200, body: DEMO_RECORDS[0] };
  if (path.startsWith("/health-records/") && m === "DELETE") return { status: 204, body: null };

  // Medications
  if (path === "/medications" && m === "GET") return { status: 200, body: DEMO_MEDS };
  if (path === "/medications" && m === "POST") return { status: 201, body: { id: 99, userId: 1, status: "active", ...DEMO_MEDS[0] } };
  if (path.startsWith("/medications/") && m === "PATCH") return { status: 200, body: DEMO_MEDS[0] };
  if (path.startsWith("/medications/") && m === "DELETE") return { status: 204, body: null };

  // Doctors, Hospitals, Pharmacies, Labs
  if (path === "/doctors" && m === "GET") return { status: 200, body: DEMO_DOCTORS };
  if (path.startsWith("/doctors/")) return { status: 200, body: DEMO_DOCTORS[0] };
  if (path === "/hospitals" && m === "GET") return { status: 200, body: DEMO_HOSPITALS };
  if (path.startsWith("/hospitals/")) return { status: 200, body: DEMO_HOSPITALS[0] };
  if (path === "/pharmacies") return { status: 200, body: DEMO_PHARMACIES };
  if (path === "/labs") return { status: 200, body: DEMO_LABS };

  // Misc health modules
  if (path === "/vaccinations") return { status: 200, body: [
    { id: 1, userId: 1, vaccine: "Yellow Fever", date: "2022-06-10", status: "completed", provider: "JFK Medical Center" },
    { id: 2, userId: 1, vaccine: "COVID-19 (Booster)", date: "2023-02-14", status: "completed", provider: "ELWA Hospital" },
    { id: 3, userId: 1, vaccine: "Typhoid", date: "2021-09-01", nextDue: "2024-09-01", status: "due", provider: "Redemption Hospital" },
  ]};
  if (path === "/fitness") return { status: 200, body: { steps: 6420, caloriesBurned: 312, activeMinutes: 38, weeklyGoal: 150, weeklyProgress: 112 } };
  if (path === "/mental-health") return { status: 200, body: { moodLogs: [{ id: 1, userId: 1, mood: 8, note: "Feeling good today", date: agoDate(1) }, { id: 2, userId: 1, mood: 7, note: "A bit tired", date: agoDate(2) }] } };
  if (path === "/gamification") return { status: 200, body: { points: 1250, level: 5, badges: ["Early Bird", "Hydration Hero", "Streak 7"], streak: 7 } };
  if (path === "/family") return { status: 200, body: { members: [] } };
  if (path === "/blood-bank") return { status: 200, body: { bloodType: "O+", lastDonation: "2023-11-20", nextEligible: "2024-05-20", centers: [{ name: "JFK Blood Bank", phone: "+231 77 000 0001" }] } };
  if (path === "/insurance") return { status: 200, body: { plans: [], enrolled: null } };
  if (path === "/emergency") return { status: 200, body: { number: "911", hospitals: DEMO_HOSPITALS } };
  if (path === "/surveillance") return { status: 200, body: { alerts: [] } };

  // AI Chat sessions list / create
  if (path === "/ai-chat/sessions" && m === "GET") return { status: 200, body: [{ id: 1, userId: 1, title: "General Health Query", createdAt: ago(1), messageCount: 2, lastMessage: "How can I help you today?" }] };
  if (path === "/ai-chat/sessions" && m === "POST") return { status: 201, body: { id: 2, userId: 1, title: "New Chat", createdAt: new Date().toISOString(), messageCount: 0, lastMessage: null } };
  if (path.match(/\/ai-chat\/sessions\/\d+\/messages/) && m === "GET") return { status: 200, body: [{ id: 1, sessionId: 1, role: "assistant", content: "Hello! I'm MAWIBO AI, your personal health assistant. How can I help you today?", createdAt: ago(1) }] };

  // AI tools list
  if (path === "/ai-tools" && m === "GET") return { status: 200, body: { tools: [] } };

  return null;
}

// ─── SSE stream ───────────────────────────────────────────────────────────────

function streamText(res: ServerResponse, text: string): void {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const words = text.split(" ");
  let i = 0;
  const tick = setInterval(() => {
    if (i < words.length) {
      res.write(`data: ${JSON.stringify({ content: (i === 0 ? "" : " ") + words[i] })}\n\n`);
      i++;
    } else {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      clearInterval(tick);
      res.end();
    }
  }, 40);
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = req.url ?? "/";
  const method = req.method ?? "GET";
  // Strip /api prefix so paths match the route table
  const path = url.replace(/^\/api/, "").split("?")[0] || "/";

  // CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // SSE: AI chat message
  if (path.match(/^\/ai-chat\/sessions\/\d+\/messages$/) && method === "POST") {
    const reply = AI_RESPONSES[aiIdx % AI_RESPONSES.length]; aiIdx++;
    streamText(res, reply); return;
  }
  // SSE: AI tools
  if (path.match(/^\/ai-tools\/.+/) && method === "POST") {
    streamText(res, "This tool provides AI-powered health insights. In production it connects to OpenAI for personalized analysis based on your complete health profile and medical history."); return;
  }

  // Standard JSON routes
  const result = getResponse(path, method);
  if (result === null) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }
  if (result.status === 204) {
    res.writeHead(204); res.end(); return;
  }
  res.writeHead(result.status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(result.body));
}
