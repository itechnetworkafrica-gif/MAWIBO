import { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Footprints, Flame, Clock, Target, Plus, TrendingUp, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const weeklySteps = [
  { day: "Mon", steps: 6240, goal: 8000 },
  { day: "Tue", steps: 8120, goal: 8000 },
  { day: "Wed", steps: 5430, goal: 8000 },
  { day: "Thu", steps: 9200, goal: 8000 },
  { day: "Fri", steps: 7800, goal: 8000 },
  { day: "Sat", steps: 3200, goal: 8000 },
  { day: "Sun", steps: 4500, goal: 8000 },
];

const workouts = [
  { name: "Morning Walk", type: "cardio", duration: 35, calories: 180, date: "2026-06-07", icon: "🚶" },
  { name: "Bodyweight Circuit", type: "strength", duration: 40, calories: 280, date: "2026-06-06", icon: "💪" },
  { name: "Yoga Session", type: "flexibility", duration: 30, calories: 95, date: "2026-06-05", icon: "🧘" },
  { name: "Evening Jog", type: "cardio", duration: 25, calories: 210, date: "2026-06-04", icon: "🏃" },
  { name: "Resistance Bands", type: "strength", duration: 35, calories: 195, date: "2026-06-03", icon: "🎯" },
];

const goals = [
  { title: "Lose 5kg", category: "weight_loss", progress: 40, target: "5 kg", current: "2 kg lost", deadline: "2026-09-01" },
  { title: "Run 5km", category: "endurance", progress: 65, target: "5 km", current: "3.2 km best", deadline: "2026-08-01" },
  { title: "Daily 8,000 Steps", category: "activity", progress: 72, target: "8,000 steps/day", current: "5 days streak", deadline: "2026-07-01" },
];

const todaySteps = 4500;
const stepGoal = 8000;

export default function Fitness() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Fitness Tracker</h1>
        <p className="text-muted-foreground">Monitor your activity, workouts, and goals</p>
      </motion.div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Steps Today", value: todaySteps.toLocaleString(), goal: `/ ${stepGoal.toLocaleString()}`, icon: Footprints, color: "text-blue-400", pct: Math.round(todaySteps / stepGoal * 100) },
          { label: "Calories Burned", value: "485", goal: "/ 600 kcal", icon: Flame, color: "text-orange-400", pct: 81 },
          { label: "Active Minutes", value: "47", goal: "/ 60 min", icon: Clock, color: "text-purple-400", pct: 78 },
          { label: "Workouts (week)", value: "4", goal: "/ 5 planned", icon: Dumbbell, color: "text-primary", pct: 80 },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">{stat.pct}%</span>
                </div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.goal}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                <Progress value={stat.pct} className="h-1 mt-2" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="glass-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card className="glass-card">
            <CardHeader className="pb-2"><CardTitle className="text-base">Steps This Week</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklySteps}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Bar dataKey="steps" fill="#5DADE2" radius={[4,4,0,0]} />
                  <Bar dataKey="goal" fill="rgba(93,173,226,0.1)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-3 md:grid-cols-3">
            <Card className="glass-card bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
              <CardContent className="p-4 text-center">
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">1,240</p>
                <p className="text-xs text-muted-foreground">Calories this week</p>
              </CardContent>
            </Card>
            <Card className="glass-card bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="p-4 text-center">
                <Footprints className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">44,490</p>
                <p className="text-xs text-muted-foreground">Steps this week</p>
              </CardContent>
            </Card>
            <Card className="glass-card bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20">
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-2xl font-bold">68 bpm</p>
                <p className="text-xs text-muted-foreground">Avg resting heart rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Recent Workouts</h3>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Log Workout</Button>
          </div>
          {workouts.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="glass-card hover:border-primary/30 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">{w.icon}</div>
                    <div>
                      <p className="font-medium text-sm">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.date}</p>
                      <Badge className="text-xs mt-1 bg-muted border-0">{w.type}</Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-bold">{w.duration} min</p>
                    <p className="text-xs text-orange-400">{w.calories} kcal</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="goals" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Active Goals</h3>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Goal</Button>
          </div>
          {goals.map((g, i) => (
            <motion.div key={g.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold">{g.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{g.current} of {g.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{g.progress}%</p>
                      <p className="text-xs text-muted-foreground">by {g.deadline}</p>
                    </div>
                  </div>
                  <Progress value={g.progress} className="h-3" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
