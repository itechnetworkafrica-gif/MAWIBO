import { useState } from "react";
import { motion } from "framer-motion";
import { Apple, Plus, Flame, Droplets, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useToast } from "@/hooks/use-toast";

const macros = [
  { name: "Protein", value: 82, goal: 120, color: "#5DADE2", unit: "g" },
  { name: "Carbs", value: 245, goal: 300, color: "#F97316", unit: "g" },
  { name: "Fat", value: 54, goal: 65, color: "#A855F7", unit: "g" },
  { name: "Fiber", value: 22, goal: 30, color: "#22C55E", unit: "g" },
];

const meals = [
  { type: "Breakfast", items: ["Rice porridge", "Boiled egg", "Banana"], calories: 420, time: "7:30 AM", icon: "🌅" },
  { type: "Lunch", items: ["Jollof rice", "Grilled fish", "Garden salad"], calories: 680, time: "1:00 PM", icon: "☀️" },
  { type: "Snack", items: ["Groundnuts", "Orange"], calories: 210, time: "4:00 PM", icon: "🌤" },
  { type: "Dinner", items: ["Cassava leaf soup", "Rice", "Chicken"], calories: 750, time: "", icon: "🌙", planned: true },
];

const weeklyCalories = [
  { day: "Mon", calories: 1820, goal: 2000 },
  { day: "Tue", calories: 2150, goal: 2000 },
  { day: "Wed", calories: 1740, goal: 2000 },
  { day: "Thu", calories: 2080, goal: 2000 },
  { day: "Fri", calories: 1960, goal: 2000 },
  { day: "Sat", calories: 2340, goal: 2000 },
  { day: "Sun", calories: 1310, goal: 2000 },
];

const caloriesConsumed = meals.filter(m => !m.planned).reduce((s, m) => s + m.calories, 0);
const calorieGoal = 2000;

export default function Nutrition() {
  const { toast } = useToast();

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Nutrition Tracker</h1>
        <p className="text-muted-foreground">Track meals, macros, and nutrition goals</p>
      </motion.div>

      {/* Calorie Ring + Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="glass-card h-full">
            <CardContent className="p-5 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ value: caloriesConsumed }, { value: Math.max(0, calorieGoal - caloriesConsumed) }]}
                      dataKey="value"
                      cx="50%" cy="50%" innerRadius={48} outerRadius={60} startAngle={90} endAngle={-270} paddingAngle={2}>
                      <Cell fill="#5DADE2" />
                      <Cell fill="rgba(255,255,255,0.05)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold">{caloriesConsumed}</p>
                  <p className="text-xs text-muted-foreground">kcal</p>
                </div>
              </div>
              <p className="font-semibold mt-2">Today's Calories</p>
              <p className="text-xs text-muted-foreground">{calorieGoal - caloriesConsumed} kcal remaining</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="md:col-span-2">
          <Card className="glass-card h-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Macronutrients</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {macros.map(m => (
                <div key={m.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{m.name}</span>
                    <span className="text-muted-foreground">{m.value}{m.unit} / {m.goal}{m.unit}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (m.value / m.goal) * 100)}%`, backgroundColor: m.color }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="meals">
        <TabsList className="glass-card">
          <TabsTrigger value="meals">Today's Meals</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Report</TabsTrigger>
          <TabsTrigger value="local">Local Foods</TabsTrigger>
        </TabsList>

        <TabsContent value="meals" className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Meal Log</h3>
            <Button size="sm" className="gap-2"><Plus className="w-4 h-4" /> Add Meal</Button>
          </div>
          {meals.map((meal, i) => (
            <motion.div key={meal.type} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className={`glass-card ${meal.planned ? "opacity-60 border-dashed" : ""}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meal.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{meal.type}</p>
                        {meal.planned && <Badge className="text-xs bg-muted border-0">Planned</Badge>}
                        {meal.time && <span className="text-xs text-muted-foreground">{meal.time}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{meal.items.join(", ")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="font-bold text-sm">{meal.calories}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          <Card className="glass-card">
            <CardHeader><CardTitle className="text-sm">Calorie Intake This Week</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklyCalories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#161B22", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  <Bar dataKey="calories" fill="#5DADE2" radius={[4,4,0,0]} name="Calories" />
                  <Bar dataKey="goal" fill="rgba(93,173,226,0.15)" radius={[4,4,0,0]} name="Goal" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { food: "Jollof Rice (1 cup)", cal: 340, protein: 7, carbs: 68, fat: 6, icon: "🍚" },
              { food: "Cassava Leaf Soup (1 bowl)", cal: 180, protein: 12, carbs: 8, fat: 11, icon: "🥬" },
              { food: "Fufu (1 ball)", cal: 310, protein: 2, carbs: 74, fat: 1, icon: "🫙" },
              { food: "Grilled Tilapia (200g)", cal: 220, protein: 40, carbs: 0, fat: 5, icon: "🐟" },
              { food: "Groundnuts (30g)", cal: 170, protein: 8, carbs: 5, fat: 14, icon: "🥜" },
              { food: "Plantain (1 medium)", cal: 120, protein: 1, carbs: 31, fat: 0, icon: "🍌" },
              { food: "Palm Oil (1 tbsp)", cal: 120, protein: 0, carbs: 0, fat: 14, icon: "🫙" },
              { food: "Egusi Soup (1 bowl)", cal: 290, protein: 18, carbs: 10, fat: 22, icon: "🍲" },
            ].map((item, i) => (
              <motion.div key={item.food} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="glass-card">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{item.food}</p>
                        <p className="text-xs text-muted-foreground">P:{item.protein}g C:{item.carbs}g F:{item.fat}g</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span className="text-sm font-bold">{item.cal}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">Nutritional data for common Liberian & West African foods</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
