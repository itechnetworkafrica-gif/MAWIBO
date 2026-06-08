import { useState } from "react";
import { useListLabs, useListLabBookings } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestTube, Calendar, MapPin, FileCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Labs() {
  const [tab, setTab] = useState("network");
  const { data: labs, isLoading: isLoadingLabs } = useListLabs();
  const { data: bookings, isLoading: isLoadingBookings } = useListLabBookings();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Diagnostic Labs</h1>
        <p className="text-muted-foreground mt-1">Find laboratories and manage your test bookings.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="network">Lab Network</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {tab === "network" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingLabs ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
              ) : (
                labs?.map((lab, i) => (
                  <motion.div key={lab.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                    <Card className="glass-card h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TestTube className="h-5 w-5 text-primary" />
                          {lab.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {lab.address || `${lab.city}, ${lab.county}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {lab.tests?.slice(0, 4).map((test, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-white/5">{test}</Badge>
                          ))}
                        </div>
                        {lab.homeCollectionAvailable && (
                          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 p-2 rounded-md">
                            <CheckCircle2 className="h-4 w-4" /> Home Collection Available
                          </div>
                        )}
                      </CardContent>
                      <div className="p-4 border-t border-white/5">
                        <Button className="w-full">Book Test</Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {tab === "bookings" && (
            <div className="space-y-4">
              {isLoadingBookings ? (
                [1, 2].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
              ) : bookings?.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p>You have no lab bookings.</p>
                </div>
              ) : (
                bookings?.map((booking, i) => (
                  <motion.div key={booking.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className="glass-card">
                      <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                            <TestTube className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{booking.testName}</h3>
                            <p className="text-muted-foreground text-sm">{booking.labName}</p>
                          </div>
                        </div>
                        <div className="flex flex-col md:items-end gap-2">
                          <Badge variant={booking.status === "Completed" ? "default" : "secondary"}>
                            {booking.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {new Date(booking.date).toLocaleDateString()} at {booking.time || "TBD"}
                          </div>
                        </div>
                        {booking.resultUrl && (
                          <Button variant="outline" className="gap-2 shrink-0 border-primary/50 text-primary">
                            <FileCheck className="h-4 w-4" /> View Results
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
