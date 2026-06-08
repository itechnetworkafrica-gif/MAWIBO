import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, FileText, CheckCircle2, Clock, AlertCircle, Plus, CreditCard, TrendingUp, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const plans = [
  { name: "NHIS Basic", provider: "National Health Insurance Scheme", premium: 15, deductible: 50, maxCoverage: 5000, coverage: ["Primary Care","Maternity","Emergency","Medications"], color: "from-blue-500/20 to-blue-600/10", badge: "Government" },
  { name: "NHIS Premium", provider: "National Health Insurance Scheme", premium: 35, deductible: 25, maxCoverage: 20000, coverage: ["Primary Care","Specialist","Surgery","Maternity","Emergency","Dental","Vision","Medications"], color: "from-sky-500/20 to-sky-600/10", badge: "Popular", recommended: true },
  { name: "Liberty Health Gold", provider: "Liberty Insurance Liberia", premium: 75, deductible: 100, maxCoverage: 50000, coverage: ["Primary Care","Specialist","Surgery","ICU","Maternity","Emergency","Dental","Vision","Medications","Mental Health"], color: "from-amber-500/20 to-amber-600/10", badge: "Premium" },
];

const claims = [
  { id: "CLM-2024-001", service: "Cardiology Consultation", date: "2026-05-28", amount: 75, approved: 65, status: "approved", provider: "JFK Medical Center" },
  { id: "CLM-2024-002", service: "Lab Tests - CBC & Chemistry", date: "2026-04-15", amount: 45, approved: 45, status: "paid", provider: "LabQuest Diagnostics" },
  { id: "CLM-2024-003", service: "Amlodipine 30-day supply", date: "2026-06-01", amount: 32, approved: null, status: "pending", provider: "HealthPlus Pharmacy" },
];

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle2; label: string }> = {
  approved: { color: "text-emerald-400 bg-emerald-400/10", icon: CheckCircle2, label: "Approved" },
  paid: { color: "text-blue-400 bg-blue-400/10", icon: CreditCard, label: "Paid" },
  pending: { color: "text-amber-400 bg-amber-400/10", icon: Clock, label: "Pending" },
  denied: { color: "text-red-400 bg-red-400/10", icon: AlertCircle, label: "Denied" },
};

export default function Insurance() {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Health Insurance</h1>
        <p className="text-muted-foreground">Manage your coverage and claims</p>
      </motion.div>

      {/* Active Policy Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="p-5">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg">NHIS Premium</h2>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">National Health Insurance Scheme • Member ID: NHIS-2024-001847</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">$35<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground">Valid until Dec 31, 2026</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-lg font-bold">$3,240</p>
                <p className="text-xs text-muted-foreground">Used this year</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">$16,760</p>
                <p className="text-xs text-muted-foreground">Remaining</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">3</p>
                <p className="text-xs text-muted-foreground">Open claims</p>
              </div>
            </div>
            <Progress value={16} className="mt-3 h-2" />
            <p className="text-xs text-muted-foreground mt-1">16% of annual coverage used</p>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="claims">
        <TabsList className="glass-card">
          <TabsTrigger value="claims">My Claims</TabsTrigger>
          <TabsTrigger value="plans">Compare Plans</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
        </TabsList>

        <TabsContent value="claims" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Recent Claims</h3>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> File Claim
            </Button>
          </div>
          {claims.map((claim, i) => {
            const cfg = statusConfig[claim.status];
            const StatusIcon = cfg.icon;
            return (
              <motion.div key={claim.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-card hover:border-primary/30 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cfg.color}`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{claim.service}</p>
                          <p className="text-xs text-muted-foreground">{claim.provider} • {claim.date}</p>
                          <p className="text-xs text-muted-foreground">Claim #{claim.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${claim.amount}</p>
                        {claim.approved && <p className="text-xs text-emerald-400">Approved: ${claim.approved}</p>}
                        <Badge className={`text-xs mt-1 ${cfg.color} border-0`}>{cfg.label}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </TabsContent>

        <TabsContent value="plans" className="space-y-4 mt-4">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={`glass-card cursor-pointer transition-all border ${selectedPlan === plan.name ? "border-primary" : "border-white/10"} ${plan.recommended ? "ring-1 ring-primary/50" : ""}`}
                onClick={() => setSelectedPlan(plan.name)}>
                <CardContent className={`p-5 bg-gradient-to-br ${plan.color}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{plan.name}</h3>
                        <Badge className="text-xs">{plan.badge}</Badge>
                        {plan.recommended && <Badge className="text-xs bg-primary/20 text-primary border-primary/30">Recommended</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">${plan.premium}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div><span className="text-muted-foreground">Deductible: </span><span className="font-medium">${plan.deductible}</span></div>
                    <div><span className="text-muted-foreground">Max Coverage: </span><span className="font-medium">${plan.maxCoverage.toLocaleString()}</span></div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {plan.coverage.map(c => <Badge key={c} className="text-xs bg-white/5 border-white/10">{c}</Badge>)}
                  </div>
                  <Button className="w-full mt-3" size="sm" onClick={() => toast({ title: "Plan Selected", description: `You selected ${plan.name}. A MAWIBO advisor will contact you shortly.` })}>
                    {plan.name === "NHIS Premium" ? "Current Plan" : "Get This Plan"} <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="benefits" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { icon: "🏥", title: "Inpatient Care", desc: "Full hospital stays covered up to 30 days per admission" },
              { icon: "🩺", title: "Outpatient Visits", desc: "Unlimited doctor visits with $5 copay" },
              { icon: "💊", title: "Medications", desc: "Generic medications at $2 copay, brand-name at $15" },
              { icon: "🤰", title: "Maternity Care", desc: "Full antenatal and postnatal care, normal and C-section delivery" },
              { icon: "🧠", title: "Mental Health", desc: "10 therapy sessions per year covered" },
              { icon: "🦷", title: "Dental Care", desc: "2 cleanings per year, basic restorations covered 80%" },
              { icon: "👁️", title: "Vision", desc: "Annual eye exam + $100 allowance for glasses/contacts" },
              { icon: "🚑", title: "Emergency", desc: "Full emergency care coverage, including ambulance" },
            ].map((b, i) => (
              <motion.div key={b.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass-card">
                  <CardContent className="p-4 flex gap-3">
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <p className="font-medium">{b.title}</p>
                      <p className="text-sm text-muted-foreground">{b.desc}</p>
                    </div>
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
