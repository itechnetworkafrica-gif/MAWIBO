import { useListMoodLogs, useListJournalEntries } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Brain, Smile, Meh, Frown, BookOpen, Wind } from "lucide-react";
import { motion } from "framer-motion";

export default function MentalHealth() {
  const { data: moodLogs, isLoading: isLoadingMood } = useListMoodLogs();
  const { data: journals, isLoading: isLoadingJournal } = useListJournalEntries();

  const chartData = moodLogs?.slice().reverse().map(log => ({
    date: new Date(log.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
    score: log.score
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mental Wellness</h1>
        <p className="text-muted-foreground mt-1">Track your mood, journal, and find peace.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Check-in Card */}
        <Card className="glass-card lg:col-span-1 border-none bg-gradient-to-br from-card to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" /> Daily Check-in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center pt-4">
            <p className="text-lg font-medium">How are you feeling today?</p>
            <div className="flex justify-center gap-4">
              <Button variant="ghost" className="h-16 w-16 rounded-full hover:bg-red-500/20 hover:text-red-400">
                <Frown className="h-10 w-10" />
              </Button>
              <Button variant="ghost" className="h-16 w-16 rounded-full hover:bg-yellow-500/20 hover:text-yellow-400">
                <Meh className="h-10 w-10" />
              </Button>
              <Button variant="ghost" className="h-16 w-16 rounded-full hover:bg-green-500/20 hover:text-green-400">
                <Smile className="h-10 w-10" />
              </Button>
            </div>
            <Button className="w-full">Save Entry</Button>
          </CardContent>
        </Card>

        {/* Mood Trend */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Mood Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            {isLoadingMood ? (
              <Skeleton className="h-full w-full rounded-xl" />
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[1, 10]} hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Not enough data for chart.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Journals */}
        <Card className="glass-card h-[400px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> Journal
            </CardTitle>
            <Button variant="ghost" size="sm">New Entry</Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pt-4">
            {isLoadingJournal ? (
              [1, 2].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)
            ) : journals?.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No journal entries yet.</div>
            ) : (
              journals?.map((journal, i) => (
                <motion.div key={journal.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="font-semibold">{journal.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{journal.content}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground opacity-70">
                    <span>{new Date(journal.date).toLocaleDateString()}</span>
                    {journal.mood && <span>• {journal.mood}</span>}
                  </div>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Tools */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Exercises</h2>
          <Card className="glass-card hover:bg-white/5 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wind className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Box Breathing</h3>
                <p className="text-sm text-muted-foreground">Reduce stress in 2 minutes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card hover:bg-white/5 transition-colors cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Body Scan</h3>
                <p className="text-sm text-muted-foreground">Release physical tension</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
