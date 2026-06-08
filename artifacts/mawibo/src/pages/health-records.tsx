import { useState } from "react";
import { useListHealthRecords } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Plus, FileImage, Stethoscope, Beaker, FileBox } from "lucide-react";
import { motion } from "framer-motion";

export default function HealthRecords() {
  const [type, setType] = useState<string>("All");
  const { data: records, isLoading } = useListHealthRecords(type !== "All" ? { type } : undefined);

  const getIcon = (type: string) => {
    switch (type) {
      case "Diagnosis": return <Stethoscope className="h-5 w-5" />;
      case "Prescription": return <FileText className="h-5 w-5" />;
      case "Lab Result": return <Beaker className="h-5 w-5" />;
      case "Imaging": return <FileImage className="h-5 w-5" />;
      default: return <FileBox className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Records</h1>
          <p className="text-muted-foreground mt-1">Your complete medical history, digitized and secure.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Record
        </Button>
      </div>

      <Tabs value={type} onValueChange={setType} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start p-0">
          {["All", "Diagnosis", "Prescription", "Lab Result", "Imaging"].map(t => (
            <TabsTrigger 
              key={t} 
              value={t}
              className="glass-card data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
            >
              {t}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
            </div>
          ) : records?.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-xl">
              <FileBox className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-medium">No records found</h3>
              <p className="text-muted-foreground mt-1 mb-4">No documents matching the selected category.</p>
              <Button variant="outline">Upload Document</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {records?.map((record, i) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass-card hover:bg-white/5 transition-colors cursor-pointer group">
                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        {getIcon(record.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg truncate">{record.title}</h3>
                          <Badge variant="outline" className="text-xs">{record.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{record.provider}</p>
                      </div>
                      <div className="text-right sm:text-right w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t border-white/5 sm:border-0">
                        <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                        <Button variant="link" size="sm" className="px-0 text-primary h-auto mt-1">View Details</Button>
                      </div>
                    </CardContent>
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
