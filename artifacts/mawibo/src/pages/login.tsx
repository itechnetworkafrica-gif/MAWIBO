import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Mail, Lock } from "lucide-react";
import logoUrl from "@assets/file_0000000066e071fda913e7e9c0fbbd82_1780941341572.png";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      login("demo-token");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Branding Section */}
      <div className="flex-1 bg-secondary/10 flex flex-col items-center justify-center p-8 relative overflow-hidden hidden md:flex">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background/0 to-background/0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 flex flex-col items-center text-center max-w-md"
        >
          <img src={logoUrl} alt="MAWIBO" className="h-20 mb-8 object-contain" />
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Healthcare, elevated.</h1>
          <p className="text-lg text-muted-foreground">
            Africa's most advanced AI-powered health companion. Your records, doctors, and wellness tracking in one secure platform.
          </p>
        </motion.div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="glass-card border-none shadow-2xl bg-card/40">
            <CardHeader className="space-y-1 pb-6 text-center">
              <div className="md:hidden flex justify-center mb-4">
                <img src={logoUrl} alt="MAWIBO" className="h-12 object-contain" />
              </div>
              <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your credentials to access your health dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="m.doe@example.com" 
                      required 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-black/20 border-white/10 focus-visible:ring-primary"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 bg-black/20 border-white/10 focus-visible:ring-primary"
                    />
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Activity className="mr-2 h-5 w-5 animate-pulse" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center text-sm text-muted-foreground">
              Don't have an account? <a href="#" className="text-primary ml-1 hover:underline font-medium">Register here</a>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
