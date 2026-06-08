import { motion } from "framer-motion";
import { Activity, AlertTriangle, MapPin, TrendingUp, Users, Building2, Droplet, Baby } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

const counties = [
  { county: "Montserrado", malaria: 180, typhoid: 42, tb: 28, hiv: 35, population: 1118241, facilities: 18, alertLevel: "watch" },
  { county: "Nimba", malaria: 142, typhoid: 31, tb: 19, hiv: 22, population: 462026, facilities: 9, alertLevel: "normal" },
  { county: "Bong", malaria: 98, typhoid: 18, tb: 12, hiv: 14, population: 333481, facilities: 7, alertLevel: "normal" },
  { county: "Lofa", malaria: 120, typhoid: 25, tb: 15, hiv: 17, population: 276863, facilities: 6, alertLevel: "warning" },
  { county: "Grand Bassa", malaria: 76, typhoid: 14, tb: 8, hiv: 11, population: 221693, facilities: 5, alertLevel: "normal" },
  { county: "Margibi", malaria: 89, typhoid: 20, tb: 11, hiv: 13, population: 209923, facilities: 5, alertLevel: "normal" },
  { county: "Maryland", malaria: 65, typhoid: 12, tb: 7, hiv: 9, population: 135938, facilities: 4, alertLevel: "normal" },
  { county: "Grand Cape Mount", malaria: 72, typhoid: 16, tb: 9, hiv: 10, population: 127076, facilities: 3, alertLevel: "normal" },
];

const weeklyTrend = [
  { week: "W1", malaria: 1240, typhoid: 320, tb: 180 },
  { week: "W2", malaria: 1180, typhoid: 290, tb: 165 },
  { week: "W3", malaria: 1320, typhoid: 340, tb: 175 },
  { week: "W4", malaria: 1080, typhoid: 280, tb: 158 },
  { week: "W5", malaria: 1150, typhoid: 310, tb: 162 },
  { week: "W6", malaria: 1420, typhoid: 360, tb: 188 },
];

const alerts = [
  { title: "Malaria Surge in Lofa County", disease: "Malaria", county: "Lofa", severity: "warning", desc: "Cases increased 35% vs last month. Additional RDT kits being distributed.", date: "2026-06-05" },
  { title: "Cholera Watch: Grand Cape Mount", disease: "Cholera", county: "Grand Cape Mount", severity: "watch", desc: "3 suspected cases near Robertsport. Water samples collected for testing.", date: "2026-06-03" },
  { title: "TB Outbreak Investigation", disease: "Tuberculosis", county: "Montserrado", severity: "watch", desc: "Cluster of 8 cases in West Point community. Contact tracing underway.", date: "2026-06-01" },
];

const alertColors: Record<string, string> = {
  normal: "bg-emerald-500/20 text-emerald-400",
  watch: "bg-amber-500/20 text-amber-400",
  warning: "bg-orange-500/20 text-orange-400",
  emergency: "bg-red-500/20 text-red-400",
};

const kpis = [
  { label: "Total Population", value: "5.4M", icon: Users, color: "text-blue-400" },
  { label: "Health Facilities", value: "342", icon: Building2, color: "text-purple-400" },
  { label: "Vaccination Coverage", value: "67%", icon: Activity, color: "text-emerald-400" },
  { label: "Active Outbreaks", value: "2", icon: AlertTriangle, color: "text-amber-400" },
  { label: "Blood Units Available", value: "143", icon: Droplet, color: "text-red-400" },
  { label: "Maternal Mortality", value: "1,072/100k", icon: Baby, color: "text-pink-400" },
];

export default function Surveillance() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Disease Surveillance</h1>
            <p className="text-muted-foreground text-sm">National Health Intelligence Center — Liberia</p>
          </div>
        </div>
      </motion.div>

      {/* National KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="glass-card">
              <CardContent className="p-3 text-center">
                <kpi.icon className={`w-5 h-5 ${kpi.color} mx-auto mb-1`} />
                <p className="text-lg font-bold">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Alerts */}
      <div className="space-y-3">
        <h2 className="font-bold text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" /> Active Alerts
        </h2>
        {alerts.map((alert, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`glass-card border-l-4 ${alert.severity === "warning" ? "border-l-orange-500" : "border-l-amber-400"}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{alert.title}</h3>
                      <Badge className={`text-xs border-0 ${alertColors[alert.severity]}`}>{alert.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <MapPin className="w-3 h-3" /> {alert.county}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="county">
        <TabsList className="glass-card">
          <TabsTrigger value="county">County Map</TabsTrigger>
          <TabsTrigger value="trends">Disease Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="county" className="mt-4">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base">County-by-County Disease Load (2026)</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground text-xs border-b border-white/10">
                      <th className="text-left py-2 pr-4">County</th>
                      <th className="text-right py-2 px-2">🦟 Malaria</th>
                      <th className="text-right py-2 px-2">🌡 Typhoid</th>
                      <th className="text-right py-2 px-2">🫁 TB</th>
                      <th className="text-right py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counties.map((c, i) => (
                      <motion.tr key={c.county} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-2.5 pr-4 font-medium">{c.county}</td>
                        <td className="py-2.5 px-2 text-right text-red-400">{c.malaria}</td>
                        <td className="py-2.5 px-2 text-right text-orange-400">{c.typhoid}</td>
                        <td className="py-2.5 px-2 text-right text-purple-400">{c.tb}</td>
                        <td className="py-2.5 text-right">
                          <Badge className={`text-xs border-0 ${alertColors[c.alertLevel]}`}>{c.alertLevel}</Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-4">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-base">National Disease Trend (6-Week)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={weeklyTrend}>
                  <defs>
                    <linearGradient id="malaria" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="typhoid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="tb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="malaria" stroke="#ef4444" fill="url(#malaria)" strokeWidth={2} name="Malaria" />
                  <Area type="monotone" dataKey="typhoid" stroke="#f97316" fill="url(#typhoid)" strokeWidth={2} name="Typhoid" />
                  <Area type="monotone" dataKey="tb" stroke="#a855f7" fill="url(#tb)" strokeWidth={2} name="Tuberculosis" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-4 justify-center mt-2">
                {[{c:"#ef4444",l:"Malaria"},{c:"#f97316",l:"Typhoid"},{c:"#a855f7",l:"Tuberculosis"}].map(k => (
                  <div key={k.l} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: k.c }} />
                    <span className="text-xs text-muted-foreground">{k.l}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
