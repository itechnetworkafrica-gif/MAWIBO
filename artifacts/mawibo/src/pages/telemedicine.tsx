import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Phone, MessageSquare, Clock, Star, ChevronRight, Mic, MicOff, VideoOff, PhoneOff, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const availableDoctors = [
  { name: "Dr. Amara Koroma", specialty: "Cardiology", rating: 4.9, waitTime: "< 5 min", fee: 75, online: true, avatar: "AK" },
  { name: "Dr. Emmanuel Kollie", specialty: "General Practice", rating: 4.7, waitTime: "< 2 min", fee: 40, online: true, avatar: "EK" },
  { name: "Dr. Rebecca Flomo", specialty: "Dermatology", rating: 4.8, waitTime: "~ 10 min", fee: 65, online: true, avatar: "RF" },
  { name: "Dr. Samuel Dahn", specialty: "Psychiatry", rating: 4.6, waitTime: "< 3 min", fee: 70, online: true, avatar: "SD" },
  { name: "Dr. Grace Nyontee", specialty: "Ophthalmology", rating: 4.9, waitTime: "~ 15 min", fee: 80, online: false, avatar: "GN" },
];

const pastConsultations = [
  { doctor: "Dr. Emmanuel Kollie", specialty: "General Practice", date: "2026-05-28", duration: "22 min", type: "Video", rating: 5, summary: "Routine check. BP slightly elevated, advised lifestyle changes. Prescription issued." },
  { doctor: "Dr. Fatu Massaquoi", specialty: "Gynecology", date: "2026-04-15", duration: "18 min", type: "Voice", rating: 4, summary: "Monthly antenatal check-up. All indicators normal." },
];

function CallSimulator({ doctor, onEnd }: { doctor: (typeof availableDoctors)[0]; onEnd: () => void }) {
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);

  useState(() => {
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  });

  const mins = Math.floor(duration / 60).toString().padStart(2, "0");
  const secs = (duration % 60).toString().padStart(2, "0");

  return (
    <motion.div className="fixed inset-0 z-50 bg-[#0D1117] flex flex-col items-center justify-between p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="text-center mt-12">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 relative">
          <span className="text-3xl font-bold text-primary">{doctor.avatar}</span>
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" />
        </div>
        <h2 className="text-2xl font-bold">{doctor.name}</h2>
        <p className="text-muted-foreground">{doctor.specialty}</p>
        <p className="text-primary text-lg font-mono mt-2">{mins}:{secs}</p>
        <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-0">Connected</Badge>
      </div>

      <div className="flex gap-6 mb-8">
        <button onClick={() => setMuted(!muted)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${muted ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white"}`}>
          {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
        <button onClick={onEnd} className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
          <PhoneOff className="w-7 h-7 text-white" />
        </button>
        <button onClick={() => setVideoOff(!videoOff)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${videoOff ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white"}`}>
          {videoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </button>
      </div>
    </motion.div>
  );
}

export default function Telemedicine() {
  const { toast } = useToast();
  const [calling, setCalling] = useState<(typeof availableDoctors)[0] | null>(null);

  if (calling) return <CallSimulator doctor={calling} onEnd={() => { setCalling(null); toast({ title: "Call Ended", description: "Consultation summary will be available shortly." }); }} />;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Telemedicine</h1>
        <p className="text-muted-foreground">Connect with doctors instantly via video, voice, or chat</p>
      </motion.div>

      {/* Quick Connect Options */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Video, label: "Video Call", color: "from-blue-500/20 to-blue-600/10 border-blue-500/20", iconColor: "text-blue-400" },
          { icon: Phone, label: "Voice Call", color: "from-green-500/20 to-green-600/10 border-green-500/20", iconColor: "text-green-400" },
          { icon: MessageSquare, label: "Chat", color: "from-purple-500/20 to-purple-600/10 border-purple-500/20", iconColor: "text-purple-400" },
        ].map((opt, i) => (
          <motion.div key={opt.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`glass-card cursor-pointer hover:scale-105 transition-all bg-gradient-to-br ${opt.color}`} onClick={() => toast({ title: opt.label, description: "Select a doctor below to start your consultation." })}>
              <CardContent className="p-4 flex flex-col items-center gap-2">
                <opt.icon className={`w-7 h-7 ${opt.iconColor}`} />
                <p className="text-sm font-semibold">{opt.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Available Doctors */}
      <div>
        <h2 className="font-bold text-lg mb-3">Doctors Available Now</h2>
        <div className="space-y-3">
          {availableDoctors.map((doc, i) => (
            <motion.div key={doc.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="glass-card hover:border-primary/30 transition-colors">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 bg-primary/20">
                        <AvatarFallback className="text-primary font-bold bg-primary/20">{doc.avatar}</AvatarFallback>
                      </Avatar>
                      {doc.online && <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs">{doc.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{doc.waitTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-bold text-primary">${doc.fee}</p>
                    <Button size="sm" disabled={!doc.online} onClick={() => setCalling(doc)} className="gap-1">
                      <Video className="w-3 h-3" /> Consult
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Past Consultations */}
      <div>
        <h2 className="font-bold text-lg mb-3">Past Consultations</h2>
        <div className="space-y-3">
          {pastConsultations.map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm">{c.doctor}</p>
                      <p className="text-xs text-muted-foreground">{c.specialty} • {c.date} • {c.duration}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`w-3 h-3 ${j < c.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.summary}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className="text-xs bg-muted border-0">{c.type}</Badge>
                    <Badge className="text-xs bg-emerald-500/20 text-emerald-400 border-0">Completed</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
