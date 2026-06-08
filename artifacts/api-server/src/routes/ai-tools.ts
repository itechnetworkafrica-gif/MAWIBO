import { Router } from "express";
import OpenAI from "openai";

const router = Router();

function getOpenAI() {
  return new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });
}

async function callAI(systemPrompt: string, userMessage: string, maxTokens = 600): Promise<string> {
  const res = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: maxTokens,
  });
  return res.choices[0]?.message?.content ?? "Unable to generate response.";
}

// AI Symptom Checker
router.post("/symptom-checker", async (req, res) => {
  try {
    const { symptoms, age, gender, duration } = req.body;
    const system = `You are an expert AI symptom checker for West Africa/Liberia. Analyze symptoms and provide:
1. Most likely conditions (3-5, ranked by likelihood)
2. Urgency level (Emergency/Urgent/Routine)
3. Recommended action (ER now, doctor within 24h, home care, monitor)
4. Red flag symptoms to watch for
5. Basic home care if applicable
Format as JSON with keys: conditions (array of {name, likelihood}), urgency, action, redFlags, homeCare.
Consider tropical diseases common in Liberia: malaria, typhoid, cholera.`;
    const userMsg = `Patient: ${age || "adult"} year old ${gender || "person"}. Symptoms: ${symptoms}. Duration: ${duration || "unknown"}.`;
    const result = await callAI(system, userMsg, 800);
    let parsed;
    try { parsed = JSON.parse(result); } catch { parsed = { raw: result }; }
    res.json({ result: parsed, tool: "symptom-checker" });
  } catch (err) {
    req.log.error({ err }, "symptomChecker error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Drug Interaction Checker
router.post("/drug-interaction", async (req, res) => {
  try {
    const { medications } = req.body;
    const system = `You are a clinical pharmacist AI. Check drug interactions and provide:
1. Interaction severity for each pair (None/Minor/Moderate/Major/Contraindicated)
2. Clinical effects of each interaction
3. Management recommendations
4. Monitoring parameters
Format as JSON: { interactions: [{drug1, drug2, severity, effect, management}], overallRisk, summary }`;
    const result = await callAI(system, `Check interactions for: ${medications?.join(", ")}`, 800);
    let parsed;
    try { parsed = JSON.parse(result); } catch { parsed = { raw: result }; }
    res.json({ result: parsed, tool: "drug-interaction" });
  } catch (err) {
    req.log.error({ err }, "drugInteraction error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Lab Interpreter
router.post("/lab-interpreter", async (req, res) => {
  try {
    const { testName, values, patientAge, patientGender } = req.body;
    const system = `You are a clinical laboratory specialist AI. Interpret lab results and provide:
1. Whether each value is normal, low, or high
2. Clinical significance
3. Possible causes for abnormal values
4. Recommended follow-up tests
5. Urgency of medical attention needed
Format as JSON: { interpretation: [{parameter, value, status, significance}], overallAssessment, urgency, followUp }`;
    const result = await callAI(system, `Test: ${testName}. Patient: ${patientAge}y ${patientGender}. Values: ${JSON.stringify(values)}`, 800);
    let parsed;
    try { parsed = JSON.parse(result); } catch { parsed = { raw: result }; }
    res.json({ result: parsed, tool: "lab-interpreter" });
  } catch (err) {
    req.log.error({ err }, "labInterpreter error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Health Risk Analyzer
router.post("/health-risk", async (req, res) => {
  try {
    const { age, gender, bmi, bloodPressure, bloodSugar, smoker, familyHistory, lifestyle } = req.body;
    const system = `You are an expert preventive medicine AI. Analyze health risk factors and provide:
1. 10-year cardiovascular risk (percentage)
2. Diabetes risk (Low/Moderate/High)
3. Top 5 health risks with probability
4. Biological age estimate
5. Prioritized lifestyle interventions
Format as JSON: { cardiovascularRisk, diabetesRisk, biologicalAge, risks: [{condition, risk, probability}], interventions: [{priority, action, impact}] }`;
    const data = { age, gender, bmi, bloodPressure, bloodSugar, smoker, familyHistory, lifestyle };
    const result = await callAI(system, `Analyze risk for: ${JSON.stringify(data)}`, 900);
    let parsed;
    try { parsed = JSON.parse(result); } catch { parsed = { raw: result }; }
    res.json({ result: parsed, tool: "health-risk" });
  } catch (err) {
    req.log.error({ err }, "healthRisk error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Nutritionist
router.post("/nutritionist", async (req, res) => {
  try {
    const { query, age, weight, height, goals, conditions } = req.body;
    const system = `You are an expert AI nutritionist specializing in West African cuisine and available foods in Liberia. 
Consider local foods: rice, cassava, plantain, groundnuts, palm oil, fish, beans, green vegetables.
Provide practical, affordable nutritional advice relevant to the Liberian context.`;
    const userMsg = `Patient: ${age}y, ${weight}kg, ${height}cm. Goals: ${goals}. Conditions: ${conditions}. Question: ${query}`;
    const result = await callAI(system, userMsg, 700);
    res.json({ result, tool: "nutritionist" });
  } catch (err) {
    req.log.error({ err }, "nutritionist error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Fitness Coach
router.post("/fitness-coach", async (req, res) => {
  try {
    const { query, fitnessLevel, goals, equipment, conditions } = req.body;
    const system = `You are an expert AI fitness coach. Create practical workout plans considering:
- Available equipment (or no equipment)
- Local climate (tropical West Africa)
- Health conditions and limitations
- Progressive overload principles
Provide specific exercises, sets, reps, and rest periods.`;
    const result = await callAI(system, `Level: ${fitnessLevel}, Goals: ${goals}, Equipment: ${equipment}, Conditions: ${conditions}. ${query}`, 700);
    res.json({ result, tool: "fitness-coach" });
  } catch (err) {
    req.log.error({ err }, "fitnessCoach error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Mental Health Coach
router.post("/mental-health-coach", async (req, res) => {
  try {
    const { message, mood, stressLevel } = req.body;
    const system = `You are a compassionate AI mental health support specialist with cultural sensitivity to West African/Liberian context.
Provide evidence-based coping strategies (CBT, mindfulness, behavioral activation).
If there are signs of crisis (suicidal ideation, self-harm), always direct to immediate professional help and emergency contacts.
Be warm, empathetic, and non-judgmental. Do not replace professional therapy.`;
    const result = await callAI(system, `Mood: ${mood}/10, Stress: ${stressLevel}/10. Message: ${message}`, 700);
    res.json({ result, tool: "mental-health-coach" });
  } catch (err) {
    req.log.error({ err }, "mentalHealthCoach error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Pregnancy Coach
router.post("/pregnancy-coach", async (req, res) => {
  try {
    const { question, weeksPregnant } = req.body;
    const system = `You are an expert AI maternal health advisor for West Africa. Provide guidance on:
- Pregnancy symptoms and what's normal by trimester
- Nutrition during pregnancy (with locally available West African foods)
- Danger signs requiring immediate medical attention
- Antenatal care schedule
- Preparation for delivery
Always emphasize importance of professional antenatal care.`;
    const result = await callAI(system, `${weeksPregnant} weeks pregnant. Question: ${question}`, 700);
    res.json({ result, tool: "pregnancy-coach" });
  } catch (err) {
    req.log.error({ err }, "pregnancyCoach error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Vaccination Advisor
router.post("/vaccination-advisor", async (req, res) => {
  try {
    const { age, gender, existingVaccinations, travelPlans } = req.body;
    const system = `You are an expert AI immunization advisor for West Africa/Liberia. Provide:
1. Required vaccinations for age group per WHO and Liberian MOH schedule
2. Recommended travel vaccines if applicable
3. Catch-up schedule for missed vaccines
4. Important vaccines for Liberia: Yellow Fever, Meningitis, Hepatitis B, Polio, Measles, COVID-19
Format as JSON: { required: [], recommended: [], catchUp: [], travelVaccines: [], nextScheduled }`;
    const result = await callAI(system, `Age: ${age}, Gender: ${gender}, Has: ${existingVaccinations?.join(", ")}. Travel: ${travelPlans}`, 800);
    let parsed;
    try { parsed = JSON.parse(result); } catch { parsed = { raw: result }; }
    res.json({ result: parsed, tool: "vaccination-advisor" });
  } catch (err) {
    req.log.error({ err }, "vaccinationAdvisor error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Disease Predictor (based on vitals & history)
router.post("/disease-predictor", async (req, res) => {
  try {
    const { vitals, symptoms, history } = req.body;
    const system = `You are an expert clinical AI for West Africa. Based on patient data, predict disease risks:
1. Immediate concerns requiring investigation
2. Chronic disease risks in 5-10 years
3. Preventive actions
4. Recommended screenings
Consider diseases common in West Africa: malaria, hypertension, diabetes, TB, HIV, sickle cell.
Format as JSON: { immediateConcerns: [], chronicRisks: [{disease, risk, timeline}], preventiveActions: [], screenings: [] }`;
    const result = await callAI(system, `Vitals: ${JSON.stringify(vitals)}. Symptoms: ${symptoms}. History: ${history}`, 800);
    let parsed;
    try { parsed = JSON.parse(result); } catch { parsed = { raw: result }; }
    res.json({ result: parsed, tool: "disease-predictor" });
  } catch (err) {
    req.log.error({ err }, "diseasePredictor error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Prescription Reader
router.post("/prescription-reader", async (req, res) => {
  try {
    const { prescriptionText } = req.body;
    const system = `You are an expert clinical pharmacist AI. Analyze a prescription and provide:
1. Each medication: full name, dosage, frequency, route, duration
2. What each medication treats
3. Common side effects to watch for
4. Drug interactions between prescribed medications
5. Patient counseling points
6. Any concerns (unclear dosing, potentially dangerous combinations)
Format as JSON: { medications: [{name, dosage, frequency, indication, sideEffects, counseling}], interactions, concerns, summary }`;
    const result = await callAI(system, `Prescription: ${prescriptionText}`, 900);
    let parsed;
    try { parsed = JSON.parse(result); } catch { parsed = { raw: result }; }
    res.json({ result: parsed, tool: "prescription-reader" });
  } catch (err) {
    req.log.error({ err }, "prescriptionReader error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Medical Translator
router.post("/medical-translator", async (req, res) => {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;
    const system = `You are an expert medical translator. Translate medical text accurately while:
1. Preserving clinical meaning
2. Using appropriate medical terminology in the target language
3. Providing explanations for complex medical terms
4. Noting any untranslatable terms with explanations
Supported: English, French, Kpelle, Bassa, Kru (provide phonetic transliterations for local languages)`;
    const result = await callAI(system, `Translate from ${sourceLanguage || "English"} to ${targetLanguage}: "${text}"`, 600);
    res.json({ result, tool: "medical-translator" });
  } catch (err) {
    req.log.error({ err }, "medicalTranslator error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Health Report Generator
router.post("/health-report", async (req, res) => {
  try {
    const { userData } = req.body;
    const system = `You are an expert health data analyst. Generate a comprehensive personal health report with:
1. Executive health summary
2. Key health metrics analysis
3. Trend analysis (improving/declining)
4. Top 5 health wins this period
5. Top 5 areas needing attention
6. Personalized recommendations
7. Goals for next month
Write in a professional but accessible tone for the patient.`;
    const result = await callAI(system, `Patient health data: ${JSON.stringify(userData)}`, 1000);
    res.json({ result, tool: "health-report" });
  } catch (err) {
    req.log.error({ err }, "healthReport error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Sleep Coach
router.post("/sleep-coach", async (req, res) => {
  try {
    const { sleepData, concerns } = req.body;
    const system = `You are an expert AI sleep medicine specialist. Analyze sleep patterns and provide:
1. Sleep quality assessment
2. Identified sleep disorders (if any)
3. Sleep hygiene recommendations
4. Cognitive Behavioral Therapy for Insomnia (CBT-I) techniques
5. Environmental modifications
6. When to seek professional help`;
    const result = await callAI(system, `Sleep data: ${JSON.stringify(sleepData)}. Concerns: ${concerns}`, 700);
    res.json({ result, tool: "sleep-coach" });
  } catch (err) {
    req.log.error({ err }, "sleepCoach error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Emergency Assistant
router.post("/emergency-guide", async (req, res) => {
  try {
    const { situation } = req.body;
    const system = `You are an emergency first aid AI. For the described emergency provide IMMEDIATE step-by-step instructions.
ALWAYS start with: "CALL EMERGENCY SERVICES IMMEDIATELY if life-threatening."
Provide: 1) Immediate actions, 2) What NOT to do, 3) Signs of worsening, 4) What to tell emergency services.
Be clear, numbered, and urgent. This may be read aloud in an emergency.`;
    const result = await callAI(system, `Emergency: ${situation}`, 600);
    res.json({ result, tool: "emergency-guide" });
  } catch (err) {
    req.log.error({ err }, "emergencyGuide error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Chronic Disease Coach
router.post("/chronic-disease-coach", async (req, res) => {
  try {
    const { disease, currentManagement, question } = req.body;
    const system = `You are an expert chronic disease management AI for West Africa. Conditions you specialize in:
Diabetes, Hypertension, Sickle Cell, HIV/AIDS, TB, Asthma, Heart Disease, Kidney Disease, Arthritis.
Provide practical management advice considering local resources, medications available in Liberia, and cultural context.`;
    const result = await callAI(system, `Disease: ${disease}. Current management: ${currentManagement}. Question: ${question}`, 700);
    res.json({ result, tool: "chronic-disease-coach" });
  } catch (err) {
    req.log.error({ err }, "chronicDiseaseCoach error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Mood Predictor / Mental Health Screener
router.post("/mental-health-screener", async (req, res) => {
  try {
    const { responses } = req.body; // PHQ-9 / GAD-7 style responses
    const system = `You are a mental health screening AI. Analyze screening responses and provide:
1. Depression screening result (PHQ-9 interpretation if applicable)
2. Anxiety screening result (GAD-7 interpretation if applicable)
3. Risk level (Minimal/Mild/Moderate/Severe)
4. Recommended level of care
5. Immediate resources if high risk
6. Psychoeducation points
Format as JSON: { depressionScore, anxietyScore, riskLevel, recommendedCare, resources, psychoeducation }
IMPORTANT: If responses indicate suicidal ideation, always recommend immediate crisis support.`;
    const result = await callAI(system, `Screening responses: ${JSON.stringify(responses)}`, 700);
    let parsed;
    try { parsed = JSON.parse(result); } catch { parsed = { raw: result }; }
    res.json({ result: parsed, tool: "mental-health-screener" });
  } catch (err) {
    req.log.error({ err }, "mentalHealthScreener error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Longevity Coach
router.post("/longevity-coach", async (req, res) => {
  try {
    const { profile } = req.body;
    const system = `You are an expert longevity and preventive medicine AI. Based on patient profile, provide:
1. Estimated biological age vs chronological age
2. Key longevity factors present
3. Top 5 evidence-based interventions to increase healthspan
4. Personalized preventive screening schedule
5. Lifestyle optimization recommendations (diet, exercise, sleep, stress, social connection)
Consider African/Liberian context and available resources.`;
    const result = await callAI(system, `Profile: ${JSON.stringify(profile)}`, 800);
    res.json({ result, tool: "longevity-coach" });
  } catch (err) {
    req.log.error({ err }, "longevityCoach error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Diabetes Coach
router.post("/diabetes-coach", async (req, res) => {
  try {
    const { bloodSugar, hba1c, medications, diet, question } = req.body;
    const system = `You are an expert diabetes management AI for West Africa. Provide guidance on:
- Blood sugar interpretation and targets (fasting, post-meal, HbA1c)
- Medication management (Metformin, insulin, etc.)
- Diet adjustments using locally available foods
- Exercise guidance for diabetics
- Hypoglycemia/hyperglycemia recognition and management
- Foot care, eye care, kidney monitoring`;
    const result = await callAI(system, `BS: ${bloodSugar}, HbA1c: ${hba1c}, Meds: ${medications}, Diet: ${diet}. Q: ${question}`, 700);
    res.json({ result, tool: "diabetes-coach" });
  } catch (err) {
    req.log.error({ err }, "diabetesCoach error");
    res.status(500).json({ error: "AI service error" });
  }
});

// AI Hypertension Coach
router.post("/hypertension-coach", async (req, res) => {
  try {
    const { readings, medications, lifestyle, question } = req.body;
    const system = `You are an expert hypertension management AI. Provide:
- Blood pressure reading interpretation (JNC/AHA/WHO guidelines)
- DASH diet modifications with local West African foods
- Medication management guidance
- Lifestyle modifications: salt reduction, exercise, stress management
- When to seek emergency care (hypertensive crisis)
- Target blood pressure goals`;
    const result = await callAI(system, `Readings: ${JSON.stringify(readings)}, Meds: ${medications}, Lifestyle: ${lifestyle}. Q: ${question}`, 700);
    res.json({ result, tool: "hypertension-coach" });
  } catch (err) {
    req.log.error({ err }, "hypertensionCoach error");
    res.status(500).json({ error: "AI service error" });
  }
});

export default router;
