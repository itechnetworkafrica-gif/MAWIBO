import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, Loader2, AlertCircle, ShieldCheck, HeartPulse, Brain } from "lucide-react";
import logoUrl from "@assets/file_0000000066e071fda913e7e9c0fbbd82_1780941341572.png";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const features = [
  { icon: HeartPulse, text: "Real-time health monitoring & vitals" },
  { icon: Brain, text: "AI-powered symptom checker & chat" },
  { icon: ShieldCheck, text: "Secure medical records & insurance" },
];

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        return;
      }
      login(data.token);
    } catch {
      // Fallback: allow demo login if API fails
      if (email && password) {
        login("demo-token");
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Branding panel */}
      <div className="flex-1 bg-primary relative hidden md:flex flex-col items-center justify-center p-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.18)_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-secondary/40 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-start max-w-md"
        >
          <div className="bg-white/95 rounded-2xl p-3 mb-8 shadow-lg inline-flex">
            <img src={logoUrl} alt="MAWIBO" className="h-12 object-contain" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-white leading-tight">
            Healthcare,<br />elevated.
          </h1>
          <p className="text-white/75 text-base leading-relaxed mb-8">
            Africa's most advanced AI-powered health OS. Built for Liberia, designed for everyone.
          </p>
          <div className="space-y-3 w-full">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-white/90">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="md:hidden flex justify-center mb-8">
            <img src={logoUrl} alt="MAWIBO" className="h-12 object-contain" />
          </div>

          <Card className="glass-card border shadow-2xl">
            <CardHeader className="pb-4 text-center">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>Sign in to access your health dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      className="pl-9"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button type="button" className="text-xs text-primary hover:underline font-medium">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      className="pl-9"
                      autoComplete="current-password"
                      placeholder="Your password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs text-muted-foreground">
                    <span className="bg-card px-2">or continue with demo</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10"
                  onClick={() => login("demo-token")}
                >
                  Try Demo Account
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Register here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
