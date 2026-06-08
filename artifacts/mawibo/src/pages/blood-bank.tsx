import { useState } from "react";
import { useListBloodRequests, useListBloodDonors } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplet, AlertCircle, Heart, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function BloodBank() {
  const [tab, setTab] = useState("requests");
  const { data: requests, isLoading: isLoadingRequests } = useListBloodRequests();
  const { data: donors, isLoading: isLoadingDonors } = useListBloodDonors();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-500 flex items-center gap-2">
            <Droplet className="h-8 w-8 fill-current" /> Blood Bank
          </h1>
          <p className="text-muted-foreground mt-1">Connect donors with those in critical need.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">Register as Donor</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">Request Blood</Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="requests" className="data-[state=active]:text-red-500">Urgent Requests</TabsTrigger>
          <TabsTrigger value="donors" className="data-[state=active]:text-red-500">Donor Directory</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {tab === "requests" && (
            <div className="grid gap-4">
              {isLoadingRequests ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
              ) : requests?.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                  <p>No active blood requests at the moment.</p>
                </div>
              ) : (
                requests?.map((req, i) => (
                  <motion.div key={req.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card className={`glass-card border-l-4 ${req.urgency === 'Critical' ? 'border-l-red-600' : 'border-l-orange-500'}`}>
                      <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-full bg-red-500/20 text-red-500 flex flex-col items-center justify-center font-bold">
                            <span className="text-xl leading-none">{req.bloodGroup}</span>
                            <span className="text-[10px] uppercase tracking-wider opacity-80 mt-1">{req.unitsNeeded} Units</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg">{req.hospital}</h3>
                              {req.urgency === 'Critical' && <Badge variant="destructive" className="animate-pulse">Critical</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {req.county || "Location not specified"}
                            </p>
                          </div>
                        </div>
                        <div className="w-full md:w-auto">
                          <Button className="w-full md:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white">
                            <Phone className="h-4 w-4" /> Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {tab === "donors" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingDonors ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)
              ) : donors?.length === 0 ? (
                <div className="col-span-full text-center py-12 glass-card rounded-xl">
                  <p>No registered donors found.</p>
                </div>
              ) : (
                donors?.map((donor, i) => (
                  <motion.div key={donor.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                    <Card className="glass-card">
                      <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-card border-2 border-red-500/30 flex items-center justify-center text-red-500 font-bold text-xl shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                          {donor.bloodGroup}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{donor.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{donor.county}</p>
                          {donor.available && <Badge variant="outline" className="mt-2 border-green-500/50 text-green-400">Available</Badge>}
                        </div>
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
