import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Calendar, Baby, Activity, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const cycleData = [
  { day: 1, phase: "period", flow: "heavy" }, { day: 2, phase: "period", flow: "heavy" },
  { day: 3, phase: "period", flow: "medium" }, { day: 4, phase: "period", flow: "light" },
  { day: 5, phase: "period", flow: "light" }, { day: 6, phase: "follicular" },
  { day: 7, phase: "follicular" }, { day: 8, phase: "follicular" },
  { day: 9, phase: "follicular" }, { day: 10, phase: "follicular" },
  { day: 11, phase: "fertile" }, { day: 12, phase: "fertile" },
  { day: 13, phase: "ovulation" }, { day: 14, phase: "fertile" },
  { day: 15, phase: "fertile" }, { day: 16, phase: "luteal" },
];

const phaseColors: Record<string, string> = {
  period: "bg-red-500/80",
  follicular: "bg-blue-400/50",
  fertile: "bg-emerald-500/80",
  ovulation: "bg-yellow-400",
  luteal: "bg-purple-400/50",
};

const symptoms = [
  { name: "Cramps", logged: true, severity: "moderate" },
  { name: "Bloating", logged: true, severity: "mild" },
  { name: "Mood swings", logged: false, severity: null },
  { name: "Headache", logged: false, severity: null },
  { name: "Fatigue", logged: true, severity: "severe" },
];

const healthChecks = [
  { name: "Pap Smear", lastDone: "2025-06-15", nextDue: "2026-06-15", status: "upcoming", desc: "Cervical cancer screening every 1-3 years" },
  { name: "Breast Self-Exam", lastDone: "2026-06-01", nextDue: "2026-07-01", status: "ok", desc: "Monthly self-examination" },
  { name: "Mammogram", lastDone: "Never", nextDue: "Due now (age 35+)", status: "overdue", desc: "Annual breast cancer screening" },
  { name: "Bone Density Scan", lastDone: "Never", nextDue: "At menopause", status: "na", desc: "Osteoporosis screening" },
];

const today = 16;

export default function WomensHealth() {
  const [activePhase] = useState("luteal");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Women's Health</h1>
        <p className="text-muted-foreground">Cycle tracking, maternal health, and wellness</p>
      </motion.div>

      {/* Cycle Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card bg-gradient-to-r from-pink-500/10 to-rose-600/5 border-pink-500/20">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-bold text-lg">Cycle Tracker</h2>
                <p className="text-sm text-muted-foreground">Day {today} of 28 • Luteal Phase</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-pink-400">Next period in</p>
                <p className="text-2xl font-bold">12 days</p>
              </div>
            </div>
            <div className="grid grid-cols-16 gap-0.5 mb-3" style={{ gridTemplateColumns: `repeat(16, 1fr)` }}>
              {cycleData.map((d, i) => (
                <div key={d.day} className={`h-6 rounded-sm ${phaseColors[d.phase]} ${d.day === today ? "ring-2 ring-white" : ""} transition-all`}
                  title={`Day ${d.day}: ${d.phase}`} />
              ))}
            </div>
            <div className="flex gap-3 flex-wrap text-xs">
              {Object.entries(phaseColors).map(([phase, color]) => (
                <div key={phase} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-sm ${color}`} />
                  <span className="text-muted-foreground capitalize">{phase}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="symptoms">
        <TabsList className="glass-card">
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="checkups">Health Checks</TabsTrigger>
          <TabsTrigger value="pregnancy">Pregnancy Info</TabsTrigger>
        </TabsList>

        <TabsContent value="symptoms" className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Today's Symptoms</h3>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Log Symptom</Button>
          </div>
          {symptoms.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="glass-card">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {s.logged ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />}
                    <span className="font-medium text-sm">{s.name}</span>
                  </div>
                  {s.logged && s.severity && (
                    <Badge className={`text-xs border-0 ${s.severity === "severe" ? "bg-red-500/20 text-red-400" : s.severity === "moderate" ? "bg-orange-500/20 text-orange-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                      {s.severity}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="checkups" className="mt-4 space-y-3">
          {healthChecks.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={`glass-card ${c.status === "overdue" ? "border-red-500/30" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{c.name}</h3>
                        <Badge className={`text-xs border-0 ${c.status === "ok" ? "bg-emerald-500/20 text-emerald-400" : c.status === "overdue" ? "bg-red-500/20 text-red-400" : c.status === "upcoming" ? "bg-amber-500/20 text-amber-400" : "bg-muted text-muted-foreground"}`}>
                          {c.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{c.desc}</p>
                      <p className="text-xs text-muted-foreground">Last: {c.lastDone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Next due</p>
                      <p className="text-xs font-medium">{c.nextDue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="pregnancy" className="mt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { week: "Weeks 1-12", phase: "First Trimester", icon: "🌱", desc: "Baby's organs are forming. Morning sickness, fatigue common. Start prenatal vitamins with folic acid.", tips: ["Take folic acid 400mcg daily", "Avoid alcohol & raw fish", "First antenatal visit by week 8"] },
              { week: "Weeks 13-26", phase: "Second Trimester", icon: "🌿", desc: "Baby is growing rapidly. Most women feel better. Baby movements felt around week 18-20.", tips: ["Glucose screening test", "Anomaly scan at 20 weeks", "Iron supplements if anemic"] },
              { week: "Weeks 27-40", phase: "Third Trimester", icon: "🌳", desc: "Baby is almost ready. Monitor movements daily. Prepare for labor and delivery.", tips: ["Weekly antenatal visits", "Birth plan preparation", "Watch for preeclampsia signs"] },
            ].map((tri, i) => (
              <motion.div key={tri.phase} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{tri.icon}</span>
                      <div>
                        <p className="font-bold text-sm">{tri.phase}</p>
                        <p className="text-xs text-muted-foreground">{tri.week}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{tri.desc}</p>
                    <ul className="space-y-1">
                      {tri.tips.map(tip => (
                        <li key={tip} className="flex items-start gap-1.5 text-xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
