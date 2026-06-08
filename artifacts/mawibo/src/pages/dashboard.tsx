import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Activity, Calendar, HeartPulse, Droplets, MessageSquareHeart, UserRound,
  Siren, ArrowRight, Pill, Brain, Shield, Syringe, Dumbbell, Bot,
  TrendingUp, Trophy, Heart, Zap, AlertTriangle, Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from "recharts";
import {
  useGetDashboardSummary, useGetHealthScore, useGetProfile,
  useGetWaterTracker, useGetUpcomingAppointments
} from "@workspace/api-client-react";

const weeklyVitals = [
  { day: "Mon", systolic: 138, heartRate: 72, steps: 6240 },
  { day: "Tue", systolic: 135, heartRate: 70, steps: 8120 },
  { day: "Wed", systolic: 140, heartRate: 74, steps: 5430 },
  { day: "Thu", systolic: 132, heartRate: 69, steps: 9200 },
  { day: "Fri", systolic: 128, heartRate: 71, steps: 7800 },
  { day: "Sat", systolic: 135, heartRate: 73, steps: 3200 },
  { day: "Sun", systolic: 130, heartRate: 68, steps: 4500 },
];

const quickActions = [
  { label: "AI Health Chat", icon: MessageSquareHeart, href: "/ai-chat", color: "from-primary/20 to-primary/5 border-primary/30", iconColor: "text-primary" },
  { label: "AI Super Hub", icon: Bot, href: "/ai-hub", color: "from-purple-500/20 to-purple-600/5 border-purple-500/30", iconColor: "text-purple-400", badge: "20+ AI" },
  { label: "Find a Doctor", icon: UserRound, href: "/doctors", color: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30", iconColor: "text-emerald-400" },
  { label: "Telemedicine", icon: Activity, href: "/telemedicine", color: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30", iconColor: "text-cyan-400", badge: "Live" },
  { label: "Surveillance", icon: Zap, href: "/surveillance", color: "from-amber-500/20 to-amber-600/5 border-amber-500/30", iconColor: "text-amber-400" },
  { label: "Emergency SOS", icon: Siren, href: "/emergency", color: "from-red-500/20 to-red-600/5 border-red-500/30", iconColor: "text-red-400" },
];

const alerts = [
  { type: "medication", icon: Pill, msg: "Amlodipine 5mg due in 2 hours", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { type: "appointment", icon: Calendar, msg: "Dr. Koroma tomorrow at 10:00 AM", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { type: "vaccine", icon: Syringe, msg: "Annual Influenza shot overdue", color: "text-red-400 bg-red-500/10 border-red-500/20" },
];

function HealthScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#5DADE2" : "#f97316";
  const data = [{ value: score }, { value: 100 - score }];
  return (
    <div className="relative w-36 h-36">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={65}
            startAngle={90} endAngle={-270} paddingAngle={2}>
            <Cell fill={color} />
            <Cell fill="rgba(255,255,255,0.04)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold" style={{ color }}>{score}</p>
        <p className="text-xs text-muted-foreground">Health Score</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: profile } = useGetProfile();
  const { data: healthScore } = useGetHealthScore();
  const { data: waterTracker } = useGetWaterTracker();
  const { data: appointments } = useGetUpcomingAppointments();

  const score = (healthScore as any)?.score ?? 72;
  const waterAmount = (waterTracker as any)?.current ?? 1.4;
  const waterGoal = (waterTracker as any)?.goal ?? 2.5;
  const waterPct = Math.min(100, Math.round((waterAmount / waterGoal) * 100));

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {getGreeting()}, <span className="text-primary">{(profile as any)?.name?.split(" ")[0] ?? "Amara"}</span> 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/emergency">
            <Button variant="destructive" size="sm" className="gap-2"><Siren className="w-4 h-4" /> SOS</Button>
          </Link>
          <Link href="/ai-chat">
            <Button size="sm" className="gap-2"><MessageSquareHeart className="w-4 h-4" /> AI Chat</Button>
          </Link>
        </div>
      </motion.div>

      {/* Alerts */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-2">
        {alerts.map((a, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm ${a.color}`}>
            <a.icon className="w-4 h-4 flex-shrink-0" />
            <span>{a.msg}</span>
          </div>
        ))}
      </motion.div>

      {/* Health Score + Vitals */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card h-full">
            <CardContent className="p-5 flex flex-col items-center justify-center h-full gap-3">
              <HealthScoreRing score={score} />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {score >= 80 ? "Excellent" : score >= 70 ? "Good" : score >= 60 ? "Fair" : "Needs Attention"}
                </p>
                <p className="text-xs text-muted-foreground">+3 pts this week</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="md:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-full">
            {[
              { label: "Blood Pressure", value: "130/82", unit: "mmHg", icon: Heart, color: "text-red-400", status: "Controlled" },
              { label: "Heart Rate", value: "68", unit: "bpm", icon: Activity, color: "text-primary", status: "Normal" },
              { label: "Blood Sugar", value: "5.4", unit: "mmol/L", icon: Droplets, color: "text-amber-400", status: "Normal" },
              { label: "SpO₂", value: "98", unit: "%", icon: HeartPulse, color: "text-emerald-400", status: "Optimal" },
            ].map((stat, i) => (
              <Card key={stat.label} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-0">{stat.status}</Badge>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.unit}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>

      {/* BP Chart + Hydration */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Blood Pressure — This Week</CardTitle>
                <Link href="/disease-management">
                  <span className="text-xs text-primary hover:underline cursor-pointer">Details →</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={weeklyVitals}>
                  <defs>
                    <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5DADE2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#5DADE2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <YAxis domain={[120, 150]} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.5)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="systolic" stroke="#5DADE2" fill="url(#bpGrad)" strokeWidth={2} dot={{ r: 3 }} name="Systolic mmHg" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass-card h-full">
            <CardHeader className="pb-2"><CardTitle className="text-base">💧 Hydration</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={[{ value: waterPct }, { value: 100 - waterPct }]}
                        cx="50%" cy="50%" innerRadius={28} outerRadius={40}
                        startAngle={90} endAngle={-270}>
                        <Cell fill="#5DADE2" />
                        <Cell fill="rgba(255,255,255,0.04)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-base font-bold text-primary">{waterPct}%</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{waterAmount}L</p>
                  <p className="text-xs text-muted-foreground">of {waterGoal}L goal</p>
                </div>
                <div className="flex gap-1 w-full">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={`h-5 flex-1 rounded ${i < Math.floor((waterAmount / waterGoal) * 8) ? "bg-primary/60" : "bg-muted"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{(waterGoal - waterAmount).toFixed(1)}L remaining</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, i) => (
            <Link key={action.href} href={action.href}>
              <Card className={`glass-card cursor-pointer hover:scale-105 active:scale-95 transition-all bg-gradient-to-br ${action.color} border`}>
                <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                  <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                  <span className="text-xs font-medium leading-tight">{action.label}</span>
                  {action.badge && (
                    <Badge className="text-xs bg-primary/20 text-primary border-0 px-1.5 py-0">{action.badge}</Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Steps + Upcoming Appointments */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-primary" /> Steps This Week
                </CardTitle>
                <Link href="/fitness">
                  <span className="text-xs text-primary cursor-pointer hover:underline">See all →</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={weeklyVitals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.4)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px" }} />
                  <Bar dataKey="steps" fill="#a855f7" radius={[3, 3, 0, 0]} name="Steps" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-muted-foreground">Today: <span className="font-bold text-foreground">4,500</span></span>
                <span className="text-muted-foreground">Goal: <span className="font-bold text-primary">8,000</span></span>
              </div>
              <Progress value={56} className="h-1.5 mt-1" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> Upcoming Appointments
                </CardTitle>
                <Link href="/appointments">
                  <span className="text-xs text-primary cursor-pointer hover:underline">See all →</span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[(appointments as any)?.[0], (appointments as any)?.[1]].filter(Boolean).length > 0 ? (
                [(appointments as any)?.[0], (appointments as any)?.[1]].filter(Boolean).map((apt: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <UserRound className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{apt.doctorName ?? "Dr. Koroma"}</p>
                      <p className="text-xs text-muted-foreground">{apt.date} • {apt.time}</p>
                    </div>
                    <Badge className="text-xs bg-primary/20 text-primary border-0">{apt.type ?? "Consult"}</Badge>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"><UserRound className="w-4 h-4 text-primary" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Dr. Amara Koroma</p>
                      <p className="text-xs text-muted-foreground">Jun 9 • 10:00 AM</p>
                    </div>
                    <Badge className="text-xs bg-primary/20 text-primary border-0">Cardiology</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/20">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center"><UserRound className="w-4 h-4 text-emerald-400" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Dr. Grace Nyontee</p>
                      <p className="text-xs text-muted-foreground">Jun 15 • 2:30 PM</p>
                    </div>
                    <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-0">Eye Care</Badge>
                  </div>
                </>
              )}
              <Link href="/appointments">
                <Button variant="outline" size="sm" className="w-full gap-2 mt-1">
                  <Calendar className="w-4 h-4" /> Book Appointment <ArrowRight className="w-3 h-3 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Health Modules Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <h2 className="font-bold text-lg mb-3">All Health Modules</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Insurance", icon: Shield, href: "/insurance", stat: "NHIS Active", color: "text-emerald-400" },
            { label: "Vaccinations", icon: Syringe, href: "/vaccinations", stat: "1 due soon", color: "text-amber-400" },
            { label: "Family Health", icon: Users, href: "/family", stat: "4 members", color: "text-blue-400" },
            { label: "Health Rewards", icon: Trophy, href: "/gamification", stat: "2,750 🪙", color: "text-amber-400" },
            { label: "Women's Health", icon: Heart, href: "/womens-health", stat: "Day 16/28", color: "text-pink-400" },
            { label: "Disease Alerts", icon: Zap, href: "/surveillance", stat: "2 active", color: "text-orange-400" },
            { label: "Nutrition", icon: Droplets, href: "/nutrition", stat: "1,310 kcal", color: "text-green-400" },
            { label: "Education", icon: Brain, href: "/education", stat: "3 in progress", color: "text-purple-400" },
          ].map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <Card className="glass-card cursor-pointer hover:border-primary/30 hover:scale-[1.02] transition-all">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <mod.icon className={`w-5 h-5 ${mod.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{mod.label}</p>
                    <p className={`text-xs ${mod.color}`}>{mod.stat}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
