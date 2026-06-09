import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  Activity, Calendar, HeartPulse, Droplets, MessageSquareHeart, UserRound,
  Siren, ArrowRight, Pill, Brain, Shield, Syringe, Dumbbell, Bot,
  Trophy, Heart, Zap, Users, ChevronLeft, ChevronRight, Clock,
  TrendingUp, Flame, Wind, Stethoscope, BookOpen, Apple, Leaf,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  useGetDashboardSummary, useGetHealthScore, useGetProfile,
  useGetWaterTracker, useGetUpcomingAppointments,
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

const blogPosts = [
  {
    id: 1,
    category: "Prevention",
    title: "Malaria Season Alert: Protect Your Family This Rainy Season",
    excerpt: "With Liberia's rainy season approaching, learn the most effective prevention strategies recommended by the MOHSW.",
    date: "Jun 8, 2026",
    readTime: "4 min",
    gradient: "from-emerald-500 to-teal-700",
    icon: Shield,
  },
  {
    id: 2,
    category: "Nutrition",
    title: "Local Superfoods: Eating Healthy on a Liberian Budget",
    excerpt: "Discover affordable native foods like bitterball, cassava leaf, and moringa that pack powerful nutritional benefits.",
    date: "Jun 6, 2026",
    readTime: "5 min",
    gradient: "from-orange-500 to-amber-700",
    icon: Apple,
  },
  {
    id: 3,
    category: "Mental Health",
    title: "Breaking Stigma: Mental Health Awareness in West Africa",
    excerpt: "Community leaders and health workers share how to support those struggling with mental health challenges in Liberia.",
    date: "Jun 4, 2026",
    readTime: "6 min",
    gradient: "from-violet-500 to-purple-800",
    icon: Brain,
  },
  {
    id: 4,
    category: "Heart Health",
    title: "High Blood Pressure: The Silent Killer Affecting More Liberians",
    excerpt: "New data shows hypertension rates rising across Montserrado. Here's what you need to know and how to act.",
    date: "Jun 2, 2026",
    readTime: "5 min",
    gradient: "from-rose-500 to-red-800",
    icon: Heart,
  },
  {
    id: 5,
    category: "Child Health",
    title: "Vaccination Drive: Reaching Every Child in Rural Liberia",
    excerpt: "The National Immunization Program expands its reach to Grand Gedeh and Nimba counties this month.",
    date: "May 30, 2026",
    readTime: "3 min",
    gradient: "from-sky-500 to-blue-800",
    icon: Syringe,
  },
  {
    id: 6,
    category: "Diabetes",
    title: "Managing Type 2 Diabetes with West African Foods",
    excerpt: "Dietitians at JFK Medical Center share a culturally-adapted meal plan that keeps blood sugar in check.",
    date: "May 28, 2026",
    readTime: "7 min",
    gradient: "from-cyan-500 to-teal-800",
    icon: Stethoscope,
  },
];

const quickActions = [
  { label: "AI Health Chat", icon: MessageSquareHeart, href: "/ai-chat", gradient: "from-primary/20 to-primary/5", iconColor: "text-primary", badge: undefined },
  { label: "AI Super Hub", icon: Bot, href: "/ai-hub", gradient: "from-violet-500/20 to-violet-600/5", iconColor: "text-violet-400", badge: "20+" },
  { label: "Find Doctor", icon: UserRound, href: "/doctors", gradient: "from-emerald-500/20 to-emerald-600/5", iconColor: "text-emerald-400", badge: undefined },
  { label: "Telemedicine", icon: Stethoscope, href: "/telemedicine", gradient: "from-cyan-500/20 to-cyan-600/5", iconColor: "text-cyan-400", badge: "Live" },
  { label: "Surveillance", icon: Zap, href: "/surveillance", gradient: "from-amber-500/20 to-amber-600/5", iconColor: "text-amber-400", badge: undefined },
  { label: "Emergency", icon: Siren, href: "/emergency", gradient: "from-red-500/20 to-red-600/5", iconColor: "text-red-400", badge: "SOS" },
];

const healthModules = [
  { label: "Insurance", icon: Shield, href: "/insurance", stat: "NHIS Active", color: "text-emerald-400" },
  { label: "Vaccinations", icon: Syringe, href: "/vaccinations", stat: "1 due soon", color: "text-amber-400" },
  { label: "Family Health", icon: Users, href: "/family", stat: "4 members", color: "text-blue-400" },
  { label: "Health Rewards", icon: Trophy, href: "/gamification", stat: "2,750 pts", color: "text-amber-400" },
  { label: "Women's Health", icon: Heart, href: "/womens-health", stat: "Day 16/28", color: "text-pink-400" },
  { label: "Disease Alerts", icon: Zap, href: "/surveillance", stat: "2 active", color: "text-orange-400" },
  { label: "Nutrition", icon: Leaf, href: "/nutrition", stat: "1,310 kcal", color: "text-green-400" },
  { label: "Education", icon: BookOpen, href: "/education", stat: "3 in progress", color: "text-purple-400" },
];

const alerts = [
  { icon: Pill, msg: "Amlodipine 5mg due in 2 hours", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { icon: Calendar, msg: "Dr. Koroma appointment tomorrow at 10:00 AM", color: "text-primary bg-primary/10 border-primary/20" },
  { icon: Syringe, msg: "Annual Influenza shot is overdue", color: "text-red-500 bg-red-500/10 border-red-500/20" },
];

function HealthScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#5DADE2" : "#f97316";
  const data = [{ value: score }, { value: 100 - score }];
  return (
    <div className="relative w-32 h-32">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={46} outerRadius={60}
            startAngle={90} endAngle={-270} paddingAngle={2} dataKey="value">
            <Cell fill={color} />
            <Cell fill="rgba(128,128,128,0.1)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-2xl font-bold" style={{ color }}>{score}</p>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Health Score</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: profile } = useGetProfile();
  const { data: healthScore } = useGetHealthScore();
  const { data: waterTracker } = useGetWaterTracker();
  const { data: appointments } = useGetUpcomingAppointments();
  const blogScrollRef = useRef<HTMLDivElement>(null);

  const score = (healthScore as any)?.score ?? 72;
  const waterAmount = (waterTracker as any)?.current ?? 1.4;
  const waterGoal = (waterTracker as any)?.goal ?? 2.5;
  const waterPct = Math.min(100, Math.round((waterAmount / waterGoal) * 100));
  const firstName = (profile as any)?.name?.split(" ")[0] ?? "Amara";

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const scrollBlog = (dir: "left" | "right") => {
    if (!blogScrollRef.current) return;
    blogScrollRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">

      {/* ─── Hero Greeting ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary via-primary to-secondary p-5 md:p-6 shadow-xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm font-medium">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-0.5">
              {getGreeting()}, {firstName}
            </h1>
            <p className="text-white/75 text-sm mt-1 max-w-xs">
              Your health is looking good today. Keep up the great work!
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <HealthScoreRing score={score} />
            <div className="hidden md:block">
              <p className="text-white/70 text-xs mb-1">Status</p>
              <Badge className="bg-white/20 text-white border-0 text-xs">
                {score >= 80 ? "Excellent" : score >= 70 ? "Good" : score >= 60 ? "Fair" : "Needs Attention"}
              </Badge>
              <p className="text-white/60 text-xs mt-2">+3 pts this week</p>
            </div>
          </div>
        </div>

        {/* Stat pills */}
        <div className="relative z-10 mt-4 flex gap-2 flex-wrap">
          {[
            { icon: HeartPulse, label: "130/82 mmHg", sub: "Blood Pressure" },
            { icon: Activity, label: "68 bpm", sub: "Heart Rate" },
            { icon: Wind, label: "98%", sub: "SpO₂" },
            { icon: Droplets, label: "5.4 mmol/L", sub: "Blood Sugar" },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-1.5">
              <stat.icon className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
              <div>
                <p className="text-white text-xs font-semibold leading-none">{stat.label}</p>
                <p className="text-white/60 text-[10px] leading-none mt-0.5">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Smart Alerts ─── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="space-y-2"
      >
        {alerts.map((a, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium ${a.color}`}>
            <a.icon className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{a.msg}</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />
          </div>
        ))}
      </motion.div>

      {/* ─── Quick Actions ─── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="font-bold text-base mb-3 flex items-center gap-2 text-foreground">
          <Zap className="w-4 h-4 text-primary" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2.5">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className={`glass-card cursor-pointer hover:scale-105 active:scale-95 transition-all bg-gradient-to-br ${action.gradient} border-border hover:border-primary/30`}>
                <CardContent className="p-3 flex flex-col items-center gap-2 text-center">
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                  <span className="text-xs font-medium leading-tight text-foreground">{action.label}</span>
                  {action.badge && (
                    <Badge className="text-[10px] px-1.5 py-0 h-3.5 bg-primary/20 text-primary border-0 leading-none">{action.badge}</Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ─── Health Blog Carousel ─── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base flex items-center gap-2 text-foreground">
            <BookOpen className="w-4 h-4 text-primary" />
            Health Insights
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scrollBlog("left")}
              className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => scrollBlog("right")}
              className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div
          ref={blogScrollRef}
          className="flex gap-3 overflow-x-auto scroll-snap-x pb-2 scrollbar-none"
        >
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="scroll-snap-item flex-shrink-0 w-64 md:w-72 cursor-pointer group"
            >
              <Card className="glass-card overflow-hidden h-full hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-0.5">
                {/* Gradient header */}
                <div className={`h-28 bg-gradient-to-br ${post.gradient} relative flex items-end p-3`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <post.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <Badge className="text-[10px] bg-white/20 text-white border-0 backdrop-blur-sm">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="font-semibold text-sm leading-tight mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime} read</span>
                    <span className="ml-auto">{post.date}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Charts Row ─── */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="md:col-span-2">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Blood Pressure — This Week
                </CardTitle>
                <Link href="/disease-management">
                  <span className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={weeklyVitals}>
                  <defs>
                    <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5DADE2" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#5DADE2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} />
                  <YAxis domain={[120, 150]} tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "10px", fontSize: "12px" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area type="monotone" dataKey="systolic" stroke="#5DADE2" fill="url(#bpGrad)" strokeWidth={2} dot={{ r: 3, fill: "#5DADE2" }} name="Systolic (mmHg)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hydration */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="glass-card h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" />
                Hydration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: waterPct }, { value: 100 - waterPct }]}
                        cx="50%" cy="50%" innerRadius={28} outerRadius={40}
                        startAngle={90} endAngle={-270} dataKey="value"
                      >
                        <Cell fill="#5DADE2" />
                        <Cell fill="rgba(128,128,128,0.1)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-base font-bold text-primary">{waterPct}%</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-primary">{waterAmount}L</p>
                  <p className="text-xs text-muted-foreground">of {waterGoal}L daily goal</p>
                </div>
                <div className="flex gap-1 w-full">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 flex-1 rounded-sm transition-colors ${i < Math.floor((waterAmount / waterGoal) * 8) ? "bg-primary/70" : "bg-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{(waterGoal - waterAmount).toFixed(1)}L remaining</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── Steps + Appointments ─── */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-primary" />
                  Steps This Week
                </CardTitle>
                <Link href="/fitness">
                  <span className="text-xs text-primary cursor-pointer hover:underline flex items-center gap-1">
                    See all <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={weeklyVitals}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "currentColor", opacity: 0.4 }} />
                  <YAxis tick={{ fontSize: 10, fill: "currentColor", opacity: 0.4 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "10px", fontSize: "12px" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="steps" fill="#a855f7" radius={[3, 3, 0, 0]} name="Steps" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className="text-muted-foreground">Today: <span className="font-bold text-foreground">4,500</span></span>
                <span className="text-muted-foreground">Goal: <span className="font-bold text-primary">8,000</span></span>
              </div>
              <Progress value={56} className="h-1.5 mt-1.5" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Upcoming Appointments
                </CardTitle>
                <Link href="/appointments">
                  <span className="text-xs text-primary cursor-pointer hover:underline flex items-center gap-1">
                    See all <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[(appointments as any)?.[0], (appointments as any)?.[1]].filter(Boolean).length > 0 ? (
                [(appointments as any)?.[0], (appointments as any)?.[1]].filter(Boolean).map((apt: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30">
                    <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <UserRound className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{apt.doctorName ?? "Dr. Koroma"}</p>
                      <p className="text-xs text-muted-foreground">{apt.date} • {apt.time}</p>
                    </div>
                    <Badge className="text-xs bg-primary/15 text-primary border-0">{apt.type ?? "Consult"}</Badge>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30">
                    <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                      <UserRound className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Dr. Amara Koroma</p>
                      <p className="text-xs text-muted-foreground">Jun 9 • 10:00 AM</p>
                    </div>
                    <Badge className="text-xs bg-primary/15 text-primary border-0">Cardiology</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                      <UserRound className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Dr. Grace Nyontee</p>
                      <p className="text-xs text-muted-foreground">Jun 15 • 2:30 PM</p>
                    </div>
                    <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-0">Eye Care</Badge>
                  </div>
                </>
              )}
              <Link href="/appointments">
                <Button variant="outline" size="sm" className="w-full gap-2 mt-1 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  Book New Appointment
                  <ArrowRight className="w-3 h-3 ml-auto" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ─── All Health Modules ─── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          All Health Modules
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {healthModules.map((mod) => (
            <Link key={mod.href} href={mod.href}>
              <Card className="glass-card cursor-pointer hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <mod.icon className={`w-4 h-4 ${mod.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs truncate">{mod.label}</p>
                    <p className={`text-xs ${mod.color} truncate`}>{mod.stat}</p>
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
