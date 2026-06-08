import { 
  useGetDashboardSummary, 
  useGetHealthScore, 
  useGetProfile,
  useGetActivityFeed,
  useGetWaterTracker,
  useGetUpcomingAppointments
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Activity, Calendar, HeartPulse, Droplets, 
  MessageSquareHeart, UserRound, Siren, ArrowRight, Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: profile, isLoading: isLoadingProfile } = useGetProfile();
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary();
  const { data: healthScore, isLoading: isLoadingScore } = useGetHealthScore();
  const { data: activities, isLoading: isLoadingActivities } = useGetActivityFeed();
  const { data: waterTracker } = useGetWaterTracker();
  // We'll mock upcoming appointments since there's no direct hook for just upcoming without passing params usually,
  // but there is a useGetUpcomingAppointments hook according to instructions.
  const { data: appointments, isLoading: isLoadingAppointments } = useGetUpcomingAppointments();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {getGreeting()},{' '}
            {isLoadingProfile ? (
              <Skeleton className="h-8 w-40 inline-block align-middle" />
            ) : (
              <span className="text-primary">{profile?.name?.split(' ')[0] || 'Guest'}</span>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">Here is your health overview for today.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/ai-chat">
          <Card className="glass-card hover:bg-white/5 transition-colors cursor-pointer border-primary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <MessageSquareHeart className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">AI Health Mate</h3>
                <p className="text-sm text-muted-foreground">Ask questions & check symptoms</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/doctors">
          <Card className="glass-card hover:bg-white/5 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <UserRound className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Find a Doctor</h3>
                <p className="text-sm text-muted-foreground">Book online or in-person</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/emergency">
          <Card className="glass-card hover:bg-destructive/10 transition-colors cursor-pointer border-destructive/20 bg-destructive/5">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
                <Siren className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Emergency</h3>
                <p className="text-sm text-destructive/80">Get immediate help</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Health Score & Vitals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Health Score</CardTitle>
                <CardDescription>Your overall wellness index</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                {isLoadingScore ? (
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                ) : (
                  <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                      <motion.circle 
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: 251.2 - (251.2 * (healthScore?.score || 0)) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray="251.2"
                        className="text-primary drop-shadow-[0_0_8px_rgba(93,173,226,0.5)]" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{healthScore?.score || 0}</span>
                      <span className="text-xs font-medium text-muted-foreground uppercase">{healthScore?.grade || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="glass-card h-[calc(50%-0.5rem)]">
                <CardContent className="p-4 flex items-center gap-4 h-full">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Water Intake</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-2xl font-bold">{waterTracker?.consumed || 0}</h4>
                      <span className="text-xs text-muted-foreground">/ {waterTracker?.goal || 2000} ml</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card h-[calc(50%-0.5rem)]">
                <CardContent className="p-4 flex items-center gap-4 h-full">
                  <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                    <HeartPulse className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Heart Rate</p>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-2xl font-bold">72</h4>
                      <span className="text-xs text-muted-foreground">bpm avg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                <CardDescription>Your scheduled consultations</CardDescription>
              </div>
              <Link href="/appointments">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (appointments && appointments.length > 0) ? (
                <div className="space-y-3">
                  {appointments.slice(0, 2).map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{apt.doctorName}</p>
                        <p className="text-sm text-muted-foreground truncate">{apt.specialty} • {apt.hospital}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-primary">{apt.time}</p>
                        <p className="text-xs text-muted-foreground">{new Date(apt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                  <Link href="/doctors">
                    <Button variant="outline" size="sm">Book Appointment</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
          {/* Activity Feed */}
          <Card className="glass-card h-full max-h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingActivities ? (
                <div className="space-y-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (activities && activities.length > 0) ? (
                <div className="relative border-l border-white/10 ml-4 space-y-6 pb-4">
                  {activities.map((activity, i) => (
                    <motion.div 
                      key={activity.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative pl-6"
                    >
                      <span className="absolute -left-[17px] top-1 h-8 w-8 rounded-full bg-card border-2 border-background flex items-center justify-center text-primary text-xs">
                        <Clock className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
