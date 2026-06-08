import { useGetProfile, useGetHealthProfile } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Activity, Edit3, Settings } from "lucide-react";

export default function Profile() {
  const { data: profile, isLoading: isLoadingProfile } = useGetProfile();
  const { data: healthProfile, isLoading: isLoadingHealth } = useGetHealthProfile();

  if (isLoadingProfile || isLoadingHealth) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal and health information.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" /> Settings
        </Button>
      </div>

      <Card className="glass-card overflow-hidden border-none shadow-2xl">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/30 to-secondary/30 relative">
          <div className="absolute -bottom-12 left-8">
            <Avatar className="h-24 w-24 border-4 border-card shadow-xl">
              <AvatarImage src={profile?.avatarUrl || undefined} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{profile?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        <CardContent className="pt-16 pb-8 px-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                {profile?.email} • {profile?.county}, {profile?.city}
              </p>
            </div>
            <Button className="gap-2 w-full md:w-auto">
              <Edit3 className="h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="health" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="health" className="gap-2">
            <Activity className="h-4 w-4" /> Health Profile
          </TabsTrigger>
          <TabsTrigger value="personal" className="gap-2">
            <User className="h-4 w-4" /> Personal Info
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="health" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Medical Vitals</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Blood Group</p>
                    <p className="text-2xl font-bold text-red-400">{healthProfile?.bloodGroup || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Height (cm)</p>
                    <p className="text-2xl font-bold">{healthProfile?.height || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Weight (kg)</p>
                    <p className="text-2xl font-bold">{healthProfile?.weight || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-sm text-muted-foreground mb-1">BMI</p>
                    <p className="text-2xl font-bold">{healthProfile?.bmi || "-"}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {healthProfile?.allergies && healthProfile.allergies.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                        {healthProfile.allergies.map((allergy, i) => (
                          <li key={i}>{allergy}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No known allergies.</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Chronic Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {healthProfile?.chronicConditions && healthProfile.chronicConditions.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                        {healthProfile.chronicConditions.map((condition, i) => (
                          <li key={i}>{condition}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No chronic conditions.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <Card className="glass-card h-full bg-gradient-to-b from-card to-primary/5">
                <CardHeader>
                  <CardTitle className="text-center">Health Score</CardTitle>
                  <CardDescription className="text-center">Your overall wellness</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center pt-4">
                  <div className="text-6xl font-black text-primary mb-2 drop-shadow-[0_0_10px_rgba(93,173,226,0.3)]">
                    {healthProfile?.healthScore || 0}
                  </div>
                  <p className="text-sm text-muted-foreground text-center max-w-[200px] mt-4">
                    Maintain your daily logs and keep up with appointments to improve your score.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="personal" className="mt-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your contact details and address.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={profile?.name} className="bg-black/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={profile?.email} readOnly className="bg-black/10 opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={profile?.phone} className="bg-black/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" defaultValue={profile?.dateOfBirth?.split('T')[0] || ""} className="bg-black/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="county">County</Label>
                    <Input id="county" defaultValue={profile?.county} className="bg-black/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue={profile?.city} className="bg-black/20" />
                  </div>
                </div>
                <Button type="button" className="w-full sm:w-auto">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
