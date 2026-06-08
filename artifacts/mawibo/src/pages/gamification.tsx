import { motion } from "framer-motion";
import { Coins, Trophy, Target, Zap, Star, Gift, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const badges = [
  { name: "Early Bird", desc: "Logged vitals 7 days in a row", icon: "🌅", category: "Consistency", earned: true },
  { name: "Blood Hero", desc: "Donated blood for the first time", icon: "🩸", category: "Community", earned: true },
  { name: "Hydration Master", desc: "Hit water goal 30 days in a row", icon: "💧", category: "Wellness", earned: true },
  { name: "Pill Perfect", desc: "Never missed a medication for 2 weeks", icon: "💊", category: "Medication", earned: true },
  { name: "Step Champion", desc: "Walked 50,000 steps in a week", icon: "👟", category: "Fitness", earned: false },
  { name: "Health Scholar", desc: "Completed 10 health education modules", icon: "📚", category: "Education", earned: false },
  { name: "Social Healer", desc: "Referred 5 friends to MAWIBO", icon: "🤝", category: "Social", earned: false },
  { name: "Marathon Mind", desc: "30-day mental wellness streak", icon: "🧠", category: "Mental Health", earned: false },
];

const challenges = [
  { type: "water", title: "Hydration Champion", desc: "Drink 8 glasses of water today", current: 5, target: 8, reward: 20, icon: "💧" },
  { type: "steps", title: "Step Master", desc: "Walk 5,000 steps today", current: 3200, target: 5000, reward: 30, icon: "👟" },
  { type: "medication", title: "Medication Hero", desc: "Take all medications on time", current: 2, target: 3, reward: 25, icon: "💊" },
  { type: "mood", title: "Mental Check-In", desc: "Log your mood once today", current: 0, target: 1, reward: 15, icon: "🧠" },
];

const leaderboard = [
  { rank: 1, name: "James K.", county: "Montserrado", coins: 4820, badge: "🏆" },
  { rank: 2, name: "Fanta M.", county: "Bong", coins: 3960, badge: "🥈" },
  { rank: 3, name: "David W.", county: "Nimba", coins: 3540, badge: "🥉" },
  { rank: 4, name: "Amara J.", county: "Montserrado", coins: 2750, badge: "⭐", isMe: true },
  { rank: 5, name: "Grace T.", county: "Margibi", coins: 2310, badge: "" },
  { rank: 6, name: "Peter D.", county: "Montserrado", coins: 1980, badge: "" },
];

const rewards = [
  { name: "Free Lab Test", cost: 500, desc: "Redeem for one basic lab test at partner labs", icon: "🧪" },
  { name: "10% Pharmacy Discount", cost: 300, desc: "10% off at MAWIBO partner pharmacies", icon: "💊" },
  { name: "Doctor Consultation", cost: 800, desc: "Free 30-minute telemedicine consultation", icon: "👨‍⚕️" },
  { name: "Blood Sugar Monitor", cost: 2000, desc: "Free glucometer from MAWIBO store", icon: "📊" },
];

export default function Gamification() {
  const { toast } = useToast();
  const coinBalance = 2750;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Health Rewards</h1>
        <p className="text-muted-foreground">Earn coins for healthy habits and redeem amazing rewards</p>
      </motion.div>

      {/* Coin Wallet */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="glass-card bg-gradient-to-r from-amber-500/20 to-yellow-600/10 border-amber-500/30">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center text-3xl">🪙</div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Health Coins</p>
                  <p className="text-4xl font-bold text-amber-400">{coinBalance.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Lifetime earned: 3,890 coins</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-sm px-3 py-1">Level 4</Badge>
                <p className="text-xs text-muted-foreground mt-2">250 coins to Level 5</p>
                <Progress value={75} className="w-24 h-1.5 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Challenges */}
      <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /> Today's Challenges</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {challenges.map((ch, i) => {
            const pct = Math.round((ch.current / ch.target) * 100);
            const done = pct >= 100;
            return (
              <motion.div key={ch.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className={`glass-card ${done ? "border-emerald-500/30" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{ch.icon}</span>
                        <div>
                          <p className="font-semibold text-sm">{ch.title}</p>
                          <p className="text-xs text-muted-foreground">{ch.desc}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {done ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Clock className="w-5 h-5 text-muted-foreground" />}
                        <span className="text-xs font-bold text-amber-400">+{ch.reward} 🪙</span>
                      </div>
                    </div>
                    <Progress value={pct} className={`h-2 ${done ? "[&>div]:bg-emerald-500" : ""}`} />
                    <p className="text-xs text-muted-foreground mt-1">{ch.current} / {ch.target} {done ? "✅ Complete!" : ""}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /> Achievement Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {badges.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className={`glass-card text-center ${!b.earned ? "opacity-40" : ""}`}>
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{b.icon}</div>
                  <p className="font-semibold text-xs">{b.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{b.desc}</p>
                  {b.earned && <Badge className="mt-2 bg-amber-500/20 text-amber-400 border-0 text-xs">Earned</Badge>}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> Leaderboard</h2>
        <Card className="glass-card">
          <CardContent className="p-4">
            {leaderboard.map((user, i) => (
              <motion.div key={user.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                className={`flex items-center gap-3 py-2.5 ${i < leaderboard.length - 1 ? "border-b border-white/5" : ""} ${user.isMe ? "bg-primary/10 -mx-4 px-4 rounded-lg" : ""}`}>
                <div className="w-8 text-center font-bold text-sm">
                  {user.badge || `#${user.rank}`}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user.name} {user.isMe && <Badge className="text-xs bg-primary/20 text-primary border-0 ml-1">You</Badge>}</p>
                  <p className="text-xs text-muted-foreground">{user.county}</p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-amber-400">{user.coins.toLocaleString()}</span>
                  <span className="text-amber-400">🪙</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Rewards */}
      <div>
        <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Gift className="w-5 h-5 text-emerald-400" /> Redeem Rewards</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {rewards.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card">
                <CardContent className="p-4 flex items-center gap-3">
                  <span className="text-3xl">{r.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.desc}</p>
                  </div>
                  <Button size="sm" variant={coinBalance >= r.cost ? "default" : "outline"}
                    onClick={() => coinBalance >= r.cost ? toast({ title: "Reward Redeemed!", description: `${r.name} has been added to your account.` }) : toast({ title: "Insufficient Coins", description: `You need ${r.cost - coinBalance} more coins.` })}>
                    {r.cost} 🪙
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
