import { motion } from "framer-motion";
import { BookOpen, Play, Clock, Star, ChevronRight, Award, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const courses = [
  { id: 1, title: "Understanding Malaria in Liberia", category: "Disease", duration: "15 min", lessons: 5, icon: "🦟", difficulty: "Beginner", rating: 4.9, enrolled: true, progress: 60 },
  { id: 2, title: "Managing High Blood Pressure", category: "Chronic Disease", duration: "22 min", lessons: 7, icon: "❤️", difficulty: "Beginner", rating: 4.8, enrolled: true, progress: 30 },
  { id: 3, title: "Diabetes Self-Management Guide", category: "Chronic Disease", duration: "35 min", lessons: 10, icon: "🩸", difficulty: "Intermediate", rating: 4.7, enrolled: false, progress: 0 },
  { id: 4, title: "Maternal Health & Safe Delivery", category: "Women's Health", duration: "28 min", lessons: 8, icon: "🤰", difficulty: "Beginner", rating: 4.9, enrolled: false, progress: 0 },
  { id: 5, title: "Child Nutrition in West Africa", category: "Child Health", duration: "20 min", lessons: 6, icon: "👶", difficulty: "Beginner", rating: 4.6, enrolled: false, progress: 0 },
  { id: 6, title: "HIV/AIDS Awareness & Prevention", category: "Infectious Disease", duration: "18 min", lessons: 5, icon: "🎗️", difficulty: "Beginner", rating: 4.8, enrolled: true, progress: 100 },
  { id: 7, title: "Mental Health First Aid", category: "Mental Health", duration: "25 min", lessons: 7, icon: "🧠", difficulty: "Beginner", rating: 4.7, enrolled: false, progress: 0 },
  { id: 8, title: "Healthy Eating with Local Foods", category: "Nutrition", duration: "20 min", lessons: 6, icon: "🥗", difficulty: "Beginner", rating: 4.5, enrolled: false, progress: 0 },
  { id: 9, title: "Understanding TB & Treatment", category: "Disease", duration: "22 min", lessons: 6, icon: "🫁", difficulty: "Intermediate", rating: 4.6, enrolled: false, progress: 0 },
  { id: 10, title: "First Aid Essentials", category: "Emergency", duration: "30 min", lessons: 9, icon: "🩹", difficulty: "Beginner", rating: 4.9, enrolled: true, progress: 45 },
];

const categories = ["All", "Disease", "Chronic Disease", "Women's Health", "Child Health", "Mental Health", "Nutrition", "Emergency", "Infectious Disease"];

export default function Education() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const { toast } = useToast();

  const filtered = courses.filter(c =>
    (cat === "All" || c.category === cat) &&
    (search === "" || c.title.toLowerCase().includes(search.toLowerCase()))
  );

  const enrolled = courses.filter(c => c.enrolled);
  const completed = enrolled.filter(c => c.progress === 100).length;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Health Education</h1>
        <p className="text-muted-foreground">Learn and earn coins with expert health courses</p>
      </motion.div>

      {/* Progress Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Enrolled", value: enrolled.length, icon: BookOpen, color: "text-primary" },
          { label: "Completed", value: completed, icon: Award, color: "text-emerald-400" },
          { label: "Coins Earned", value: `${completed * 50}`, icon: Star, color: "text-amber-400" },
        ].map((stat, i) => (
          <Card key={stat.label} className="glass-card">
            <CardContent className="p-4 text-center">
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-1`} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue Learning */}
      {enrolled.some(c => c.progress > 0 && c.progress < 100) && (
        <div>
          <h2 className="font-bold mb-3">Continue Learning</h2>
          <div className="space-y-3">
            {enrolled.filter(c => c.progress > 0 && c.progress < 100).map((c, i) => (
              <Card key={c.id} className="glass-card border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{c.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.progress}% complete</p>
                    </div>
                    <Button size="sm" className="gap-1" onClick={() => toast({ title: "Lesson Started", description: `Opening: ${c.title}` })}>
                      <Play className="w-3 h-3" /> Continue
                    </Button>
                  </div>
                  <Progress value={c.progress} className="h-1.5" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search courses..." className="pl-9 glass-card border-white/10" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground"}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass-card hover:border-primary/30 transition-all cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{c.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm leading-tight">{c.title}</h3>
                      {c.progress === 100 && <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="text-xs bg-muted border-0">{c.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {c.rating}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />{c.duration}
                      </div>
                    </div>
                    {c.enrolled && c.progress > 0 && (
                      <Progress value={c.progress} className="h-1 mt-2" />
                    )}
                    <Button size="sm" variant={c.enrolled ? "outline" : "default"} className="mt-2 w-full gap-1"
                      onClick={() => toast({ title: c.enrolled ? "Resuming..." : "Enrolled!", description: c.title })}>
                      {c.progress === 100 ? <><Award className="w-3 h-3" /> Review</> : c.enrolled ? <><Play className="w-3 h-3" /> Continue</> : <><BookOpen className="w-3 h-3" /> Enroll Free</>}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
