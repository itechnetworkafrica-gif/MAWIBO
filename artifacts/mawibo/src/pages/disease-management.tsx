import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Heart, Droplets, Stethoscope, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const conditions = [
  { name: "Hypertension", stage: "Stage 1", controlled: true, icon: "❤️", color: "from-red-500/20", meds: ["Amlodipine 5mg"], lastReading: "130/82", target: "<130/80" },
  { name: "Type 2 Diabetes", stage: "Mild", controlled: false, icon: "🩸", color: "from-blue-500/20", meds: ["Metformin 500mg"], lastReading: "HbA1c: 7.2%", target: "HbA1c <7%" },
];

const bpData = [
  { date: "Jun 1", systolic: 138, diastolic: 88 },
  { date: "Jun 2", systolic: 135, diastolic: 85 },
  { date: "Jun 3", systolic: 140, diastolic: 90 },
  { date: "Jun 4", systolic: 132, diastolic: 82 },
  { date: "Jun 5", systolic: 128, diastolic: 80 },
  { date: "Jun 6", systolic: 135, diastolic: 84 },
  { date: "Jun 7", systolic: 130, diastolic: 81 },
];

const bsData = [
  { date: "Jun 1", fasting: 7.8, postMeal: 10.2 },
  { date: "Jun 2", fasting: 7.2, postMeal: 9.8 },
  { date: "Jun 3", fasting: 8.1, postMeal: 11.0 },
  { date: "Jun 4", fasting: 6.9, postMeal: 9.2 },
  { date: "Jun 5", fasting: 7.0, postMeal: 9.5 },
  { date: "Jun 6", fasting: 7.5, postMeal: 10.1 },
  { date: "Jun 7", fasting: 6.8, postMeal: 9.0 },
];

export default function DiseaseManagement() {
  const [selected, setSelected] = useState("hypertension");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Disease Management</h1>
        <p className="text-muted-foreground">Track and manage your chronic conditions</p>
      </motion.div>

      {/* Active Conditions */}
      <div className="grid gap-4 md:grid-cols-2">
        {conditions.map((c, i) => (
          <motion.div key={c.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`glass-card bg-gradient-to-br ${c.color} cursor-pointer hover:border-primary/30 transition-colors`}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <h3 className="font-bold">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.stage}</p>
                    </div>
                  </div>
                  <Badge className={`${c.controlled ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}>
                    {c.controlled ? "Controlled" : "Needs Attention"}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Reading</span>
                    <span className="font-medium">{c.lastReading}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Target</span>
                    <span className="font-medium text-primary">{c.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medications</span>
                    <span className="font-medium">{c.meds.join(", ")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="bp-tracker">
        <TabsList className="glass-card">
          <TabsTrigger value="bp-tracker">BP Tracker</TabsTrigger>
          <TabsTrigger value="sugar-tracker">Blood Sugar</TabsTrigger>
          <TabsTrigger value="tips">Management Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="bp-tracker" className="mt-4 space-y-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Blood Pressure — 7 Days</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={bpData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <YAxis domain={[60, 160]} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <ReferenceLine y={130} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Target", fill: "#22c55e", fontSize: 10 }} />
                  <Line type="monotone" dataKey="systolic" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Systolic" />
                  <Line type="monotone" dataKey="diastolic" stroke="#5DADE2" strokeWidth={2} dot={{ r: 4 }} name="Diastolic" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center mt-2 text-xs">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-muted-foreground">Systolic</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-primary" /><span className="text-muted-foreground">Diastolic</span></div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Average Systolic", value: "134 mmHg", trend: "down", good: true },
              { label: "Average Diastolic", value: "84 mmHg", trend: "down", good: true },
              { label: "Readings in Range", value: "71%", trend: "up", good: true },
            ].map(s => (
              <Card key={s.label} className="glass-card">
                <CardContent className="p-3 text-center">
                  <p className="text-sm font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sugar-tracker" className="mt-4 space-y-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Blood Sugar — 7 Days (mmol/L)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={bsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <YAxis domain={[4, 13]} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <ReferenceLine y={7} stroke="#22c55e" strokeDasharray="4 4" label={{ value: "Fasting Target", fill: "#22c55e", fontSize: 10 }} />
                  <Line type="monotone" dataKey="fasting" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} name="Fasting" />
                  <Line type="monotone" dataKey="postMeal" stroke="#a855f7" strokeWidth={2} dot={{ r: 4 }} name="Post-Meal" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { title: "DASH Diet for BP", icon: "🥗", tips: ["Reduce salt to <5g/day", "Eat more fruits and vegetables", "Limit red meat", "Choose whole grains", "Avoid palm oil excess"] },
              { title: "Diabetes-Friendly Foods", icon: "🍽️", tips: ["Choose brown rice over white", "Eat beans and lentils daily", "Limit sugary drinks", "Eat small frequent meals", "Monitor portions carefully"] },
              { title: "Exercise Guidelines", icon: "🏃", tips: ["30 min moderate exercise daily", "Walk after meals for 10 minutes", "Avoid sitting for long periods", "Swimming and cycling are excellent", "Monitor BP before/after exercise"] },
              { title: "Medication Adherence", icon: "💊", tips: ["Never skip doses", "Use MAWIBO reminders", "Report side effects early", "Don't stop without doctor advice", "Refill before running out"] },
            ].map((section, i) => (
              <Card key={section.title} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{section.icon}</span>
                    <h3 className="font-semibold">{section.title}</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {section.tips.map(tip => (
                      <li key={tip} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
