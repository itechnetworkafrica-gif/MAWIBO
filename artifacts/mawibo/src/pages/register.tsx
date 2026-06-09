import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Lock, User, Phone, MapPin, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import logoUrl from "@assets/file_0000000066e071fda913e7e9c0fbbd82_1780941341572.png";
import { motion } from "framer-motion";

const LIBERIA_COUNTIES = [
  "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount",
  "Grand Gedeh", "Grand Kru", "Lofa", "Margibi", "Maryland",
  "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe",
];

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

export default function Register() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    county: "Montserrado",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          county: form.county,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed");
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        login(data.token);
      }, 1200);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      <div className="flex-1 bg-primary flex flex-col items-center justify-center p-8 relative overflow-hidden hidden md:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center max-w-md"
        >
          <div className="bg-white/95 rounded-2xl p-3 mb-8 shadow-lg inline-flex">
            <img src={logoUrl} alt="MAWIBO" className="h-12 object-contain" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight text-white">Join MAWIBO</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Your personal health OS for Liberia. Access AI-powered care, track your wellness, and connect with top doctors — all in one place.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 w-full">
            {[
              { label: "Hospitals", value: "42+" },
              { label: "Doctors", value: "300+" },
              { label: "AI Tools", value: "20+" },
            ].map(stat => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="md:hidden flex justify-center mb-6">
            <img src={logoUrl} alt="MAWIBO" className="h-12 object-contain" />
          </div>
          <Card className="glass-card border-none shadow-2xl">
            <CardHeader className="space-y-1 pb-4 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
              <CardDescription>Join thousands of Liberians managing their health with MAWIBO</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="font-semibold text-lg">Account created!</p>
                  <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Amara Johnson"
                        required
                        value={form.name}
                        onChange={e => handleChange("name", e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={form.email}
                        onChange={e => handleChange("email", e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="+231 77..."
                          value={form.phone}
                          onChange={e => handleChange("phone", e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>County</Label>
                      <Select value={form.county} onValueChange={v => handleChange("county", v)}>
                        <SelectTrigger>
                          <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LIBERIA_COUNTIES.map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min. 6 characters"
                        required
                        value={form.password}
                        onChange={e => handleChange("password", e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm"
                        type="password"
                        placeholder="Repeat your password"
                        required
                        value={form.confirmPassword}
                        onChange={e => handleChange("confirmPassword", e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    By registering, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
