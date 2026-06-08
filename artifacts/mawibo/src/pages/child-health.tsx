import { motion } from "framer-motion";
import { Baby, Heart, Syringe, Scale, Activity, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const children = [
  { name: "Emmanuel Johnson", age: "8 years", gender: "Male", dob: "2018-03-12", bloodGroup: "O+", weight: 28, height: 128, icon: "👦" },
  { name: "Grace Johnson", age: "5 years", gender: "Female", dob: "2021-01-22", bloodGroup: "O+", weight: 19, height: 108, icon: "👧" },
];

const growthMilestones = [
  { age: "2 months", milestone: "Smiles, follows objects with eyes", met: true },
  { age: "4 months", milestone: "Holds head steady, laughs", met: true },
  { age: "6 months", milestone: "Sits with support, babbles", met: true },
  { age: "9 months", milestone: "Crawls, waves bye-bye", met: true },
  { age: "12 months", milestone: "First steps, says 1-2 words", met: true },
  { age: "18 months", milestone: "Walks well, 10+ words", met: true },
  { age: "24 months", milestone: "Runs, 2-word phrases", met: true },
  { age: "3 years", milestone: "Dresses self, 3-word sentences", met: true },
  { age: "5 years", milestone: "Counts to 10, draws a person", met: true },
];

const vaccinesDue = [
  { name: "MMR Booster", child: "Grace (5y)", date: "2026-07-01", status: "upcoming" },
  { name: "Annual Influenza", child: "Both children", date: "2026-11-01", status: "upcoming" },
];

export default function ChildHealth() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Child Health</h1>
        <p className="text-muted-foreground">Monitor growth, development, and vaccinations for your children</p>
      </motion.div>

      {/* Children Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {children.map((child, i) => (
          <motion.div key={child.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card bg-gradient-to-br from-blue-500/10 to-purple-500/5 border-blue-500/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{child.icon}</span>
                  <div>
                    <h3 className="font-bold">{child.name}</h3>
                    <p className="text-sm text-muted-foreground">{child.age} • {child.gender} • DOB: {child.dob}</p>
                    <Badge className="text-xs bg-primary/20 text-primary border-0 mt-1">Blood: {child.bloodGroup}</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <Scale className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="font-bold">{child.weight} kg</p>
                    <p className="text-xs text-muted-foreground">Weight</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <Activity className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                    <p className="font-bold">{child.height} cm</p>
                    <p className="text-xs text-muted-foreground">Height</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-3 gap-2">
                  <Heart className="w-3 h-3" /> View Full Profile
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        <Card className="glass-card border-dashed border-white/20 flex items-center justify-center min-h-[180px] cursor-pointer hover:border-primary/30 transition-colors">
          <CardContent className="p-5 text-center">
            <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Add Child</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="milestones">
        <TabsList className="glass-card">
          <TabsTrigger value="milestones">Development</TabsTrigger>
          <TabsTrigger value="vaccines">Vaccines Due</TabsTrigger>
          <TabsTrigger value="tips">Health Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">Developmental milestone tracker (Grace, 5 years)</p>
          {growthMilestones.map((m, i) => (
            <motion.div key={m.age} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass-card">
                <CardContent className="p-3 flex items-center gap-3">
                  <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${m.met ? "text-emerald-400" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">{m.age}</p>
                    <p className="text-sm">{m.milestone}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="vaccines" className="mt-4 space-y-3">
          <h3 className="font-semibold">Upcoming Vaccinations</h3>
          {vaccinesDue.map((v, i) => (
            <Card key={i} className="glass-card border-amber-500/20">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="font-medium text-sm">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.child} • Due: {v.date}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Schedule</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tips" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { icon: "🥗", title: "Nutrition", tip: "Children need iron-rich foods like beans, meat, and dark leafy vegetables to prevent anemia, common in Liberia." },
              { icon: "🦟", title: "Malaria Prevention", tip: "Use insecticide-treated bed nets. Children under 5 are most vulnerable to severe malaria." },
              { icon: "💧", title: "Hydration", tip: "Ensure clean water access. ORS (Oral Rehydration Salts) saves lives during diarrhea episodes." },
              { icon: "📏", title: "Growth Monitoring", tip: "Weigh children monthly until age 2, then every 3 months. Consult a doctor if growth falters." },
              { icon: "🛁", title: "Hygiene", tip: "Handwashing with soap before meals and after toilet use reduces diarrheal diseases by 50%." },
              { icon: "😴", title: "Sleep", tip: "Children ages 1-2 need 11-14 hours, ages 3-5 need 10-13 hours, and school-age need 9-11 hours." },
            ].map((t, i) => (
              <Card key={t.title} className="glass-card">
                <CardContent className="p-4 flex gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{t.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t.tip}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
