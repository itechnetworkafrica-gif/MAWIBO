import { useState } from "react";
import { useListPharmacies, useSearchMedicines } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, Pill, Search, MapPin, Check, X, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Pharmacies() {
  const [tab, setTab] = useState("medicines");
  const [search, setSearch] = useState("");
  
  const { data: pharmacies, isLoading: isLoadingPharmacies } = useListPharmacies();
  const { data: medicines, isLoading: isLoadingMedicines } = useSearchMedicines(
    { query: search || undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { query: { enabled: tab === "medicines" } as any }
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pharmacy & Medicines</h1>
        <p className="text-muted-foreground mt-1">Find medications and nearby pharmacies.</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="medicines">Search Medicines</TabsTrigger>
          <TabsTrigger value="pharmacies">Nearby Pharmacies</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {tab === "medicines" && (
            <div className="space-y-6">
              <div className="relative max-w-2xl">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for medications, supplements..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 bg-card/40 border-white/10"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoadingMedicines ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)
                ) : medicines?.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground glass-card rounded-xl">
                    <Pill className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No medicines found for "{search}".</p>
                  </div>
                ) : (
                  medicines?.map((med, i) => (
                    <motion.div key={med.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="glass-card">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{med.name}</CardTitle>
                              {med.genericName && <p className="text-xs text-muted-foreground mt-1">{med.genericName}</p>}
                            </div>
                            <div className="text-lg font-bold text-primary">${med.price}</div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">{med.category}</Badge>
                            {med.requiresPrescription && <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">Rx Required</Badge>}
                          </div>
                          <div className={`text-sm flex items-center gap-2 ${med.inStock ? 'text-green-400' : 'text-red-400'}`}>
                            {med.inStock ? <><Check className="h-4 w-4" /> In Stock Nearby</> : <><X className="h-4 w-4" /> Out of Stock</>}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === "pharmacies" && (
            <div className="grid gap-6 md:grid-cols-2">
              {isLoadingPharmacies ? (
                [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
              ) : (
                pharmacies?.map((pharm, i) => (
                  <motion.div key={pharm.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card className="glass-card flex flex-row items-center p-4 gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Store className="h-8 w-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{pharm.name}</h3>
                        <p className="text-sm text-muted-foreground truncate flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" /> {pharm.address || `${pharm.city}, ${pharm.county}`}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" /> {pharm.phone}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge variant={pharm.openNow ? "default" : "secondary"} className={pharm.openNow ? "bg-green-500/20 text-green-400 border-none" : ""}>
                          {pharm.openNow ? "Open" : "Closed"}
                        </Badge>
                        {pharm.deliveryAvailable && <Badge variant="outline" className="text-[10px]">Delivery</Badge>}
                      </div>
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
