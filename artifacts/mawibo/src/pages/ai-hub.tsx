import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Brain, Heart, Pill, FlaskConical, Stethoscope, Baby, Activity, Moon, Apple, Dumbbell, Shield, Zap, AlertTriangle, Search, ChevronRight, Loader2, X, Send, Syringe, Eye, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { apiUrl } from "@/lib/api-url";

const AI_TOOLS = [
  { id: "symptom-checker", name: "Symptom Checker", desc: "Analyze symptoms and get likely conditions", icon: Stethoscope, color: "from-red-500/20 to-rose-600/10 border-red-500/20", iconColor: "text-red-400", category: "Diagnosis", fields: [{ key: "symptoms", label: "Describe your symptoms", type: "textarea" }, { key: "age", label: "Age", type: "text" }, { key: "gender", label: "Gender", type: "text" }, { key: "duration", label: "Duration (e.g., 3 days)", type: "text" }] },
  { id: "drug-interaction", name: "Drug Interaction Checker", desc: "Check for dangerous medication combinations", icon: Pill, color: "from-orange-500/20 to-orange-600/10 border-orange-500/20", iconColor: "text-orange-400", category: "Medication", fields: [{ key: "medications", label: "Medications (comma separated)", type: "text" }] },
  { id: "lab-interpreter", name: "Lab Result Interpreter", desc: "Understand your lab results in plain language", icon: FlaskConical, color: "from-purple-500/20 to-purple-600/10 border-purple-500/20", iconColor: "text-purple-400", category: "Diagnosis", fields: [{ key: "testName", label: "Test name (e.g., CBC)", type: "text" }, { key: "values", label: "Results (JSON or description)", type: "textarea" }, { key: "patientAge", label: "Age", type: "text" }, { key: "patientGender", label: "Gender", type: "text" }] },
  { id: "health-risk", name: "Health Risk Analyzer", desc: "Assess your 10-year disease risks and biological age", icon: Activity, color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/20", iconColor: "text-yellow-400", category: "Prevention", fields: [{ key: "age", label: "Age", type: "text" }, { key: "gender", label: "Gender", type: "text" }, { key: "bmi", label: "BMI", type: "text" }, { key: "bloodPressure", label: "Blood Pressure (e.g., 130/85)", type: "text" }, { key: "smoker", label: "Smoker? (yes/no)", type: "text" }, { key: "familyHistory", label: "Family history of diseases", type: "text" }] },
  { id: "nutritionist", name: "AI Nutritionist", desc: "Personalized nutrition advice with local West African foods", icon: Apple, color: "from-green-500/20 to-green-600/10 border-green-500/20", iconColor: "text-green-400", category: "Lifestyle", fields: [{ key: "query", label: "Your nutrition question", type: "textarea" }, { key: "age", label: "Age", type: "text" }, { key: "weight", label: "Weight (kg)", type: "text" }, { key: "height", label: "Height (cm)", type: "text" }, { key: "goals", label: "Goals (e.g., lose weight)", type: "text" }] },
  { id: "fitness-coach", name: "AI Fitness Coach", desc: "Custom workout plans for your level and goals", icon: Dumbbell, color: "from-blue-500/20 to-blue-600/10 border-blue-500/20", iconColor: "text-blue-400", category: "Lifestyle", fields: [{ key: "query", label: "What do you need help with?", type: "textarea" }, { key: "fitnessLevel", label: "Fitness level (beginner/intermediate/advanced)", type: "text" }, { key: "goals", label: "Goals", type: "text" }, { key: "equipment", label: "Equipment available", type: "text" }] },
  { id: "mental-health-coach", name: "Mental Health Coach", desc: "Compassionate AI support and coping strategies", icon: Brain, color: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/20", iconColor: "text-indigo-400", category: "Mental Health", fields: [{ key: "message", label: "What's on your mind?", type: "textarea" }, { key: "mood", label: "Mood score (1-10)", type: "text" }, { key: "stressLevel", label: "Stress level (1-10)", type: "text" }] },
  { id: "pregnancy-coach", name: "Pregnancy Coach", desc: "Expert guidance for every stage of pregnancy", icon: Baby, color: "from-pink-500/20 to-pink-600/10 border-pink-500/20", iconColor: "text-pink-400", category: "Women's Health", fields: [{ key: "question", label: "Your pregnancy question", type: "textarea" }, { key: "weeksPregnant", label: "Weeks pregnant", type: "text" }] },
  { id: "sleep-coach", name: "AI Sleep Coach", desc: "Improve sleep quality with personalized strategies", icon: Moon, color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/20", iconColor: "text-cyan-400", category: "Lifestyle", fields: [{ key: "concerns", label: "Sleep concerns or problems", type: "textarea" }, { key: "sleepData", label: "Sleep hours, schedule (e.g., 11pm-6am)", type: "text" }] },
  { id: "prescription-reader", name: "Prescription Reader", desc: "Decode any prescription in simple language", icon: Eye, color: "from-teal-500/20 to-teal-600/10 border-teal-500/20", iconColor: "text-teal-400", category: "Medication", fields: [{ key: "prescriptionText", label: "Paste prescription text or describe it", type: "textarea" }] },
  { id: "vaccination-advisor", name: "Vaccination Advisor", desc: "Know which vaccines you need based on age and travel", icon: Syringe, color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20", iconColor: "text-emerald-400", category: "Prevention", fields: [{ key: "age", label: "Age", type: "text" }, { key: "gender", label: "Gender", type: "text" }, { key: "existingVaccinations", label: "Vaccines already received (comma separated)", type: "text" }, { key: "travelPlans", label: "Travel plans (countries)", type: "text" }] },
  { id: "disease-predictor", name: "Disease Predictor", desc: "Predict disease risks from your health data", icon: Zap, color: "from-amber-500/20 to-amber-600/10 border-amber-500/20", iconColor: "text-amber-400", category: "Prevention", fields: [{ key: "symptoms", label: "Current symptoms", type: "textarea" }, { key: "history", label: "Medical history", type: "text" }] },
  { id: "emergency-guide", name: "Emergency First Aid", desc: "Step-by-step emergency guidance for any situation", icon: AlertTriangle, color: "from-red-600/20 to-red-700/10 border-red-600/20", iconColor: "text-red-500", category: "Emergency", fields: [{ key: "situation", label: "Describe the emergency", type: "textarea" }] },
  { id: "chronic-disease-coach", name: "Chronic Disease Coach", desc: "Manage diabetes, hypertension, sickle cell and more", icon: Heart, color: "from-rose-500/20 to-rose-600/10 border-rose-500/20", iconColor: "text-rose-400", category: "Disease Management", fields: [{ key: "disease", label: "Disease (e.g., Diabetes)", type: "text" }, { key: "currentManagement", label: "Current management/medications", type: "text" }, { key: "question", label: "Your question", type: "textarea" }] },
  { id: "diabetes-coach", name: "Diabetes Coach", desc: "Expert blood sugar management and lifestyle advice", icon: Activity, color: "from-blue-600/20 to-blue-700/10 border-blue-600/20", iconColor: "text-blue-500", category: "Disease Management", fields: [{ key: "bloodSugar", label: "Recent blood sugar readings", type: "text" }, { key: "hba1c", label: "HbA1c (if known)", type: "text" }, { key: "medications", label: "Current medications", type: "text" }, { key: "question", label: "Your question", type: "textarea" }] },
  { id: "hypertension-coach", name: "Hypertension Coach", desc: "Blood pressure management and DASH diet guidance", icon: Heart, color: "from-purple-600/20 to-purple-700/10 border-purple-600/20", iconColor: "text-purple-500", category: "Disease Management", fields: [{ key: "readings", label: "Recent BP readings (e.g., 145/92)", type: "text" }, { key: "medications", label: "Current medications", type: "text" }, { key: "question", label: "Your question", type: "textarea" }] },
  { id: "medical-translator", name: "Medical Translator", desc: "Translate medical documents and terms", icon: Users, color: "from-slate-500/20 to-slate-600/10 border-slate-500/20", iconColor: "text-slate-400", category: "Tools", fields: [{ key: "text", label: "Text to translate", type: "textarea" }, { key: "targetLanguage", label: "Target language (e.g., French, Kpelle)", type: "text" }, { key: "sourceLanguage", label: "Source language", type: "text" }] },
  { id: "mental-health-screener", name: "Mental Health Screener", desc: "PHQ-9 & GAD-7 depression and anxiety screening", icon: Brain, color: "from-violet-500/20 to-violet-600/10 border-violet-500/20", iconColor: "text-violet-400", category: "Mental Health", fields: [{ key: "responses", label: "Describe your mood and symptoms over past 2 weeks", type: "textarea" }] },
  { id: "longevity-coach", name: "Longevity Coach", desc: "Optimize your healthspan and biological age", icon: Shield, color: "from-gold-500/20 to-yellow-600/10 border-yellow-500/20", iconColor: "text-yellow-500", category: "Prevention", fields: [{ key: "profile", label: "Describe your lifestyle, diet, sleep, exercise habits", type: "textarea" }] },
  { id: "health-risk", name: "Health Report Generator", desc: "Generate a comprehensive personal health report", icon: Activity, color: "from-sky-500/20 to-sky-600/10 border-sky-500/20", iconColor: "text-sky-400", category: "Tools", fields: [{ key: "query", label: "What aspects of your health to include in the report?", type: "textarea" }] },
];

const CATEGORIES = ["All", "Diagnosis", "Prevention", "Medication", "Mental Health", "Lifestyle", "Disease Management", "Women's Health", "Emergency", "Tools"];

interface ToolField { key: string; label: string; type: string; }
interface Tool { id: string; name: string; desc: string; icon: any; color: string; iconColor: string; category: string; fields: ToolField[]; }

function ToolModal({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const Icon = tool.icon;

  async function run() {
    setLoading(true);
    setResult("");
    try {
      const body: Record<string, any> = {};
      for (const f of tool.fields) {
        if (f.key === "medications" || f.key === "existingVaccinations") {
          body[f.key] = (formData[f.key] || "").split(",").map(s => s.trim());
        } else if (f.key === "values" || f.key === "responses" || f.key === "profile" || f.key === "sleepData") {
          try { body[f.key] = JSON.parse(formData[f.key] || "{}"); } catch { body[f.key] = formData[f.key] || ""; }
        } else {
          body[f.key] = formData[f.key] || "";
        }
      }
      const resp = await fetch(apiUrl(`/ai-tools/${tool.id}`), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await resp.json();
      const r = data.result;
      if (typeof r === "string") setResult(r);
      else setResult(JSON.stringify(r, null, 2));
    } catch {
      setResult("Error calling AI tool. Please try again.");
    }
    setLoading(false);
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-white/10 p-6"
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${tool.iconColor}`} />
            </div>
            <div>
              <h2 className="font-bold text-lg">{tool.name}</h2>
              <p className="text-sm text-muted-foreground">{tool.desc}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <div className="space-y-3 mb-4">
          {tool.fields.map(field => (
            <div key={field.key}>
              <label className="text-sm font-medium mb-1 block">{field.label}</label>
              {field.type === "textarea" ? (
                <Textarea value={formData[field.key] || ""} onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))} className="bg-muted/30 border-white/10 min-h-[80px]" />
              ) : (
                <Input value={formData[field.key] || ""} onChange={e => setFormData(p => ({ ...p, [field.key]: e.target.value }))} className="bg-muted/30 border-white/10" />
              )}
            </div>
          ))}
        </div>

        <Button className="w-full gap-2 mb-4" onClick={run} disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Send className="w-4 h-4" /> Run AI Analysis</>}
        </Button>

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-muted/30 rounded-xl p-4 border border-white/10 text-sm whitespace-pre-wrap font-mono leading-relaxed max-h-80 overflow-y-auto">
            {result}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function AIHub() {
  const [selected, setSelected] = useState<Tool | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = AI_TOOLS.filter(t =>
    (category === "All" || t.category === category) &&
    (search === "" || t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Health Super Hub</h1>
            <p className="text-muted-foreground text-sm">20+ specialized AI health tools powered by GPT-4</p>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search AI tools..." className="pl-9 glass-card border-white/10" />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${category === cat ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool, i) => {
          const Icon = tool.icon;
          return (
            <motion.div key={tool.id + tool.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className={`glass-card cursor-pointer hover:scale-[1.02] active:scale-[0.99] transition-all border bg-gradient-to-br ${tool.color}`}
                onClick={() => setSelected(tool)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{tool.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{tool.desc}</p>
                      <Badge className="text-xs mt-2 bg-black/20 border-0">{tool.category}</Badge>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && <ToolModal tool={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
