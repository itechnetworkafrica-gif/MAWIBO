import { useParams } from "wouter";
import { useGetDoctor, useCreateAppointment } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star, Clock, Calendar as CalendarIcon, Briefcase, Award } from "lucide-react";
import { getGetDoctorQueryKey } from "@workspace/api-client-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function DoctorDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  
  const { data: doctor, isLoading } = useGetDoctor(id, {
    query: { enabled: !!id, queryKey: getGetDoctorQueryKey(id) }
  });

  const [booking, setBooking] = useState(false);
  const createAppointment = useCreateAppointment();

  const handleBook = () => {
    setBooking(true);
    createAppointment.mutate({
      data: {
        doctorId: id,
        date: new Date().toISOString().split('T')[0],
        time: "10:00 AM",
        type: "In-Person"
      }
    }, {
      onSuccess: () => {
        toast({ title: "Appointment booked successfully", description: "You will receive a confirmation shortly." });
        setBooking(false);
      },
      onError: () => {
        toast({ title: "Booking failed", description: "Please try again later.", variant: "destructive" });
        setBooking(false);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-40 col-span-2 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!doctor) return <div>Doctor not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <Card className="glass-card overflow-hidden border-none shadow-2xl">
        <div className="md:flex">
          <div className="md:w-1/3 bg-primary/5 p-8 flex flex-col items-center justify-center border-r border-white/5">
            <div className="h-40 w-40 rounded-full overflow-hidden mb-6 border-4 border-primary/20 shadow-xl">
              {doctor.imageUrl ? (
                <img src={doctor.imageUrl} alt={doctor.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl text-primary/50">{doctor.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl font-bold text-center">{doctor.name}</h1>
            <p className="text-primary font-medium text-lg mt-1">{doctor.specialty}</p>
            
            <div className="flex items-center gap-1 mt-4 bg-yellow-500/10 text-yellow-500 px-4 py-1.5 rounded-full">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-bold">{doctor.rating}</span>
              <span className="text-xs ml-1 opacity-80">({doctor.reviewCount} reviews)</span>
            </div>
          </div>
          
          <div className="md:w-2/3 p-8 flex flex-col">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">About</h3>
                <p className="leading-relaxed">{doctor.bio || "No biography available."}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{doctor.hospital}</p>
                    <p className="text-sm text-muted-foreground">{doctor.city}, {doctor.county}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{doctor.yearsExperience} Years Experience</p>
                    <p className="text-sm text-muted-foreground">Specialist</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Languages</p>
                    <p className="text-sm text-muted-foreground">{doctor.languages?.join(", ") || "English"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consultation Fee</p>
                <p className="text-3xl font-bold">${doctor.consultationFee}</p>
              </div>
              <Button size="lg" className="px-8" onClick={handleBook} disabled={booking || !doctor.available}>
                {booking ? "Booking..." : doctor.available ? "Book Appointment" : "Not Available"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
