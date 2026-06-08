import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Siren, Phone, MapPin, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListEmergencyContacts, useGetProfile, useGetHealthProfile } from "@workspace/api-client-react";

export default function Emergency() {
  const [isCalling, setIsCalling] = useState(false);
  const { data: contacts } = useListEmergencyContacts();
  const { data: profile } = useGetProfile();
  const { data: healthProfile } = useGetHealthProfile();

  const handleSOS = () => {
    setIsCalling(true);
    // Simulate emergency call delay
    setTimeout(() => {
      setIsCalling(false);
      alert("Emergency services have been notified of your location.");
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-destructive flex items-center justify-center gap-3">
          <Siren className="h-8 w-8" /> Emergency Assistance
        </h1>
        <p className="text-muted-foreground">Get immediate help in life-threatening situations.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSOS}
            disabled={isCalling}
            className={`relative flex items-center justify-center w-64 h-64 rounded-full text-white shadow-2xl transition-all ${
              isCalling ? "bg-red-700" : "bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600"
            }`}
          >
            {/* Ripple Effects */}
            {!isCalling && (
              <>
                <span className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                <span className="absolute inset-0 rounded-full border-4 border-red-500/20 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
              </>
            )}
            
            <div className="flex flex-col items-center">
              <Siren className={`h-16 w-16 mb-2 ${isCalling ? "animate-pulse" : ""}`} />
              <span className="text-4xl font-black tracking-widest uppercase">SOS</span>
              <span className="text-sm font-medium mt-2 opacity-90">
                {isCalling ? "Calling..." : "Tap to Call 911"}
              </span>
            </div>
          </motion.button>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="glass-card border-red-900/20">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              Your Emergency ID
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{profile?.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Blood Group</p>
                <p className="font-medium text-red-400">{healthProfile?.bloodGroup || "Unknown"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Allergies</p>
                <p className="font-medium">{healthProfile?.allergies?.join(", ") || "None recorded"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Chronic Conditions</p>
                <p className="font-medium">{healthProfile?.chronicConditions?.join(", ") || "None recorded"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-lg flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {contacts && contacts.length > 0 ? (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                    </div>
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Phone className="h-3 w-3" /> Call
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">No emergency contacts set.</p>
                <Button variant="link" className="mt-2 h-auto p-0">Add Contact</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
