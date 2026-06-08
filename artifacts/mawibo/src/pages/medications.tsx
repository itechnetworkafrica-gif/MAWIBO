import { useListMedications } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pill, Plus, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Medications() {
  const { data: medications, isLoading } = useListMedications();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medications</h1>
          <p className="text-muted-foreground mt-1">Track your prescriptions and reminders.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Med
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full rounded-xl" />)
        ) : medications?.length === 0 ? (
          <div className="col-span-full text-center py-16 glass-card rounded-xl">
            <Pill className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-medium">No active medications</h3>
            <p className="text-muted-foreground mt-1 mb-4">You are not tracking any medications currently.</p>
            <Button>Add Medication</Button>
          </div>
        ) : (
          medications?.map((med, i) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`glass-card h-full flex flex-col ${med.active ? 'border-l-4 border-l-primary' : 'opacity-70'}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{med.name}</CardTitle>
                    <Badge variant={med.active ? "default" : "secondary"}>
                      {med.active ? "Active" : "Completed"}
                    </Badge>
                  </div>
                  <p className="text-sm text-primary font-medium">{med.dosage}</p>
                </CardHeader>
                <CardContent className="flex-1 py-2 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{med.frequency}</span>
                  </div>
                  {med.reminderTimes && med.reminderTimes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {med.reminderTimes.map((time, idx) => (
                        <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-md border border-white/5">
                          {time}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
                {med.active && (
                  <CardFooter className="pt-2">
                    <Button variant="outline" className="w-full gap-2 text-green-500 hover:text-green-400 border-white/10 bg-white/5">
                      <CheckCircle2 className="h-4 w-4" /> Mark Taken
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
