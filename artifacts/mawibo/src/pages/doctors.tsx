import { useState } from "react";
import { useListDoctors, useGetDoctorSpecialties, useGetFeaturedDoctors } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Search, MapPin, Star, UserRound } from "lucide-react";
import { motion } from "framer-motion";

export default function Doctors() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | undefined>(undefined);
  
  const { data: specialties } = useGetDoctorSpecialties();
  const { data: featuredDoctors, isLoading: isLoadingFeatured } = useGetFeaturedDoctors();
  const { data: doctors, isLoading: isLoadingDoctors } = useListDoctors({
    search: search || undefined,
    specialty: selectedSpecialty
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find a Doctor</h1>
        <p className="text-muted-foreground mt-1">Book an appointment with top specialists.</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search by name, specialty, or hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 bg-card/40 border-white/10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedSpecialty === undefined ? "default" : "outline"}
            className="cursor-pointer px-4 py-1.5"
            onClick={() => setSelectedSpecialty(undefined)}
          >
            All Specialties
          </Badge>
          {specialties?.map(spec => (
            <Badge 
              key={spec.id}
              variant={selectedSpecialty === spec.name ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5 bg-card/40 hover:bg-card border-white/10"
              onClick={() => setSelectedSpecialty(spec.name)}
            >
              {spec.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Featured Doctors (only show if no search/filter) */}
      {!search && !selectedSpecialty && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Featured Specialists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingFeatured ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)
            ) : featuredDoctors?.map((doc, i) => (
              <DoctorCard key={doc.id} doctor={doc} index={i} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Doctors */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{search || selectedSpecialty ? "Search Results" : "All Doctors"}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoadingDoctors ? (
            [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)
          ) : doctors?.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              <UserRound className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No doctors found matching your criteria.</p>
            </div>
          ) : (
            doctors?.map((doc, i) => (
              <DoctorCard key={doc.id} doctor={doc} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function DoctorCard({ doctor, index, featured = false }: { doctor: any, index: number, featured?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/doctors/${doctor.id}`}>
        <Card className={`glass-card h-full flex flex-col hover:border-primary/50 transition-colors cursor-pointer overflow-hidden ${featured ? 'border-primary/30 bg-primary/5' : ''}`}>
          <CardContent className="p-6 flex-1 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
              {doctor.imageUrl ? (
                <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <UserRound className="h-10 w-10 text-primary/50" />
                </div>
              )}
            </div>
            <h3 className="font-bold text-lg leading-tight">{doctor.name}</h3>
            <p className="text-primary font-medium text-sm mt-1">{doctor.specialty}</p>
            
            <div className="flex items-center gap-1 mt-2 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-bold">{doctor.rating}</span>
              <span className="text-xs text-muted-foreground ml-1">({doctor.reviewCount} reviews)</span>
            </div>
            
            <div className="mt-4 w-full space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 justify-center">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{doctor.hospital}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 border-t border-white/5 bg-black/10 flex items-center justify-between mt-auto">
            <div className="font-bold text-lg">${doctor.consultationFee}</div>
            <Button size="sm" variant={featured ? "default" : "secondary"}>Book</Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
