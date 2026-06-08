import { useState } from "react";
import { useListAppointments } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Video, UserRound } from "lucide-react";
import { motion } from "framer-motion";

export default function Appointments() {
  const [tab, setTab] = useState("upcoming");
  const { data: appointments, isLoading } = useListAppointments({ status: tab === "upcoming" ? "Scheduled" : "Completed" });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground mt-1">Manage your upcoming and past medical visits.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
            </div>
          ) : appointments?.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-medium">No appointments found</h3>
              <p className="text-muted-foreground mt-1">You don't have any {tab} appointments.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {appointments?.map((apt, i) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card h-full flex flex-col">
                    <CardHeader className="pb-3 flex flex-row items-start justify-between border-b border-white/5">
                      <div className="flex gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                          {apt.doctorImageUrl ? (
                            <img src={apt.doctorImageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserRound className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base">{apt.doctorName}</CardTitle>
                          <p className="text-sm text-primary">{apt.specialty}</p>
                        </div>
                      </div>
                      <Badge variant={apt.status === "Scheduled" ? "default" : "secondary"}>
                        {apt.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="py-4 space-y-3 flex-1">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{new Date(apt.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{apt.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {apt.type === "In-Person" ? <MapPin className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                        <span>{apt.type} • {apt.hospital || "Online"}</span>
                      </div>
                    </CardContent>
                    {tab === "upcoming" && (
                      <CardFooter className="pt-0 pb-4 flex gap-2">
                        <Button variant="outline" className="w-full">Reschedule</Button>
                        <Button variant="destructive" className="w-full bg-destructive/20 text-destructive border-transparent hover:bg-destructive/30">Cancel</Button>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
