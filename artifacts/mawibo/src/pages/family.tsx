import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Heart, Target, ChevronRight, Baby, UserRound, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const familyMembers = [
  { name: "James Johnson", relationship: "Brother", age: 34, gender: "Male", bloodGroup: "A+", conditions: ["Asthma"], icon: "👨" },
  { name: "Mary Kollie", relationship: "Mother", age: 62, gender: "Female", bloodGroup: "B+", conditions: ["Hypertension", "Diabetes"], icon: "👩" },
  { name: "Emmanuel Johnson", relationship: "Son", age: 8, gender: "Male", bloodGroup: "O+", conditions: [], icon: "👦" },
  { name: "Grace Johnson", relationship: "Daughter", age: 5, gender: "Female", bloodGroup: "O+", conditions: [], icon: "👧" },
];

const healthGoals = [
  { title: "Lose 5kg by September", category: "fitness", progress: 40, status: "active" },
  { title: "Walk 8,000 steps daily", category: "fitness", progress: 72, status: "active" },
  { title: "Take medications consistently", category: "medication", progress: 90, status: "active" },
  { title: "Sleep 7-8 hours nightly", category: "sleep", progress: 55, status: "active" },
  { title: "Reduce blood pressure to <130/80", category: "health", progress: 65, status: "active" },
];

const catColors: Record<string, string> = {
  fitness: "text-blue-400 bg-blue-500/20",
  medication: "text-purple-400 bg-purple-500/20",
  sleep: "text-indigo-400 bg-indigo-500/20",
  health: "text-emerald-400 bg-emerald-500/20",
};

export default function Family() {
  const [tab, setTab] = useState("members");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Family Health</h1>
        <p className="text-muted-foreground">Manage health for your entire family</p>
      </motion.div>

      {/* Family Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Family Members", value: "4", icon: Users, color: "text-primary" },
          { label: "Active Goals", value: "5", icon: Target, color: "text-amber-400" },
          { label: "Chronic Conditions", value: "3", icon: Heart, color: "text-red-400" },
          { label: "Kids Under 12", value: "2", icon: Baby, color: "text-pink-400" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}>
            <Card className="glass-card">
              <CardContent className="p-4">
                <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="glass-card">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="goals">Health Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Family Members</h3>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Member</Button>
          </div>
          {familyMembers.map((m, i) => (
            <motion.div key={m.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card hover:border-primary/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{m.icon}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{m.name}</p>
                        <Badge className="text-xs bg-muted border-0">{m.relationship}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{m.age} years • {m.gender} • Blood: {m.bloodGroup}</p>
                      {m.conditions.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {m.conditions.map(c => <Badge key={c} className="text-xs bg-red-500/20 text-red-400 border-0">{c}</Badge>)}
                        </div>
                      )}
                      {m.conditions.length === 0 && <p className="text-xs text-emerald-400 mt-1">No chronic conditions ✓</p>}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="goals" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">My Health Goals</h3>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Goal</Button>
          </div>
          {healthGoals.map((g, i) => (
            <motion.div key={g.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-0.5 rounded text-xs font-medium ${catColors[g.category]}`}>{g.category}</div>
                      <p className="font-medium text-sm">{g.title}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">{g.progress}%</span>
                  </div>
                  <Progress value={g.progress} className="h-2" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
