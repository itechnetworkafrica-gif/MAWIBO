import { useState } from "react";
import { useListHospitals } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Search, MapPin, Phone, Star, Siren } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Hospitals() {
  const [search, setSearch] = useState("");
  const { data: hospitals, isLoading } = useListHospitals({ search: search || undefined });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hospitals & Clinics</h1>
        <p className="text-muted-foreground mt-1">Find top healthcare facilities near you.</p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search by name, county, or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12 bg-card/40 border-white/10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {isLoading ? (
          [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)
        ) : hospitals?.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground glass-card rounded-xl">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No facilities found matching your search.</p>
          </div>
        ) : (
          hospitals?.map((hospital, i) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="glass-card h-full flex flex-col hover:border-white/20 transition-colors">
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                  <div className="h-16 w-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl line-clamp-1">{hospital.name}</CardTitle>
                    <CardDescription className="text-primary font-medium mt-1">{hospital.type}</CardDescription>
                  </div>
                  {hospital.emergencyAvailable && (
                    <Badge variant="destructive" className="animate-pulse bg-destructive text-white flex-shrink-0">
                      Emergency
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="flex-1 space-y-4 pt-2">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{hospital.address || `${hospital.city}, ${hospital.county}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{hospital.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-bold">{hospital.rating}</span>
                      <span className="text-xs text-muted-foreground ml-1">({hospital.reviewCount} reviews)</span>
                    </div>
                  </div>
                  
                  {hospital.services && hospital.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                      {hospital.services.slice(0, 4).map((service, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground">
                          {service}
                        </span>
                      ))}
                      {hospital.services.length > 4 && (
                        <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-muted-foreground">
                          +{hospital.services.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
                <div className="p-4 border-t border-white/5 flex gap-2">
                  <Button variant="default" className="flex-1">Directions</Button>
                  <Button variant="secondary" className="flex-1">Details</Button>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
