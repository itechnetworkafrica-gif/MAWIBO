import { motion } from "framer-motion";
import { Syringe, CheckCircle2, Clock, AlertCircle, Shield, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const myVaccinations = [
  { name: "Yellow Fever", disease: "Yellow Fever", date: "2022-03-15", nextDue: "2032-03-15", provider: "National Vaccination Center", verified: true },
  { name: "COVID-19 (Pfizer)", disease: "COVID-19", date: "2021-08-10", nextDue: "2024-08-10", provider: "JFK Medical Center", verified: true },
  { name: "COVID-19 Booster", disease: "COVID-19", date: "2022-02-20", nextDue: null, provider: "Redemption Hospital", verified: true },
  { name: "Td Booster", disease: "Tetanus/Diphtheria", date: "2019-05-12", nextDue: "2029-05-12", provider: "Community Health Clinic", verified: true },
  { name: "Influenza", disease: "Influenza", date: "2025-11-01", nextDue: "2026-11-01", provider: "HealthPlus Pharmacy", verified: false },
];

const schedule = [
  { name: "BCG", disease: "Tuberculosis", age: "Birth", mandatory: true, status: "completed" },
  { name: "OPV", disease: "Polio", age: "Birth, 6w, 10w, 14w", mandatory: true, status: "completed" },
  { name: "Yellow Fever", disease: "Yellow Fever", age: "9 months", mandatory: true, status: "completed" },
  { name: "MMR", disease: "Measles/Rubella", age: "9 & 15 months", mandatory: true, status: "completed" },
  { name: "COVID-19", disease: "COVID-19", age: "18+ years", mandatory: false, status: "completed" },
  { name: "Influenza", disease: "Influenza", age: "Annual", mandatory: false, status: "due" },
  { name: "HPV", disease: "Human Papillomavirus", age: "9-14 years (girls)", mandatory: false, status: "na" },
  { name: "Meningitis A", disease: "Meningococcal Meningitis", age: "12-24 months", mandatory: false, status: "completed" },
];

const completedCount = schedule.filter(s => s.status === "completed").length;
const completionPct = Math.round((completedCount / schedule.length) * 100);

export default function Vaccinations() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Vaccinations</h1>
        <p className="text-muted-foreground">Track your immunization history and schedule</p>
      </motion.div>

      {/* Immunity Score */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">Immunity Shield</h2>
                  <p className="text-sm text-muted-foreground">{completedCount} of {schedule.length} vaccines completed</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-400">{completionPct}%</p>
                <p className="text-xs text-muted-foreground">Protected</p>
              </div>
            </div>
            <Progress value={completionPct} className="h-3" />
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-amber-400">1 vaccine due: Annual Influenza shot</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="my-vaccines">
        <TabsList className="glass-card">
          <TabsTrigger value="my-vaccines">My Vaccines</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="my-vaccines" className="space-y-3 mt-4">
          {myVaccinations.map((v, i) => {
            const isDue = v.nextDue && new Date(v.nextDue) <= new Date();
            return (
              <motion.div key={v.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className={`glass-card ${isDue ? "border-amber-500/30" : ""}`}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${v.verified ? "bg-emerald-500/20" : "bg-muted"}`}>
                        <Syringe className={`w-5 h-5 ${v.verified ? "text-emerald-400" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{v.name}</p>
                          {v.verified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{v.provider}</p>
                        <p className="text-xs text-muted-foreground">Given: {v.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {v.nextDue ? (
                        <div>
                          <div className="flex items-center gap-1 justify-end">
                            {isDue ? <AlertCircle className="w-3 h-3 text-amber-400" /> : <Calendar className="w-3 h-3 text-muted-foreground" />}
                            <p className={`text-xs font-medium ${isDue ? "text-amber-400" : "text-muted-foreground"}`}>
                              {isDue ? "Due now" : `Next: ${v.nextDue}`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">Lifetime</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
          <Button className="w-full" variant="outline">+ Add Vaccination Record</Button>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground">Liberia MOH / WHO recommended vaccination schedule</p>
          {schedule.map((s, i) => {
            const colors = { completed: "text-emerald-400 bg-emerald-500/20", due: "text-amber-400 bg-amber-500/20", na: "text-muted-foreground bg-muted" };
            const icons = { completed: <CheckCircle2 className="w-4 h-4" />, due: <Clock className="w-4 h-4" />, na: <span className="text-xs">N/A</span> };
            return (
              <motion.div key={s.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass-card">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors[s.status as keyof typeof colors]}`}>
                        {icons[s.status as keyof typeof icons]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{s.name}</p>
                          {s.mandatory && <Badge className="text-xs bg-primary/20 text-primary border-0">Required</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{s.disease} • {s.age}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
