import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { ErrorBoundary } from "@/components/error-boundary";
import NotFound from "@/pages/not-found";

import { ProtectedRoute } from "@/components/protected-route";

// Auth pages
import Login from "@/pages/login";
import Register from "@/pages/register";

// Core pages
import Dashboard from "@/pages/dashboard";
import Emergency from "@/pages/emergency";
import Profile from "@/pages/profile";
import AIChat from "@/pages/ai-chat";
import AIHub from "@/pages/ai-hub";

// Medical pages
import Doctors from "@/pages/doctors";
import DoctorDetail from "@/pages/doctor-detail";
import Appointments from "@/pages/appointments";
import HealthRecords from "@/pages/health-records";
import Medications from "@/pages/medications";
import Telemedicine from "@/pages/telemedicine";

// Facilities
import Hospitals from "@/pages/hospitals";
import Pharmacies from "@/pages/pharmacies";
import Labs from "@/pages/labs";
import BloodBank from "@/pages/blood-bank";

// Health & Wellness
import MentalHealth from "@/pages/mental-health";
import Fitness from "@/pages/fitness";
import Nutrition from "@/pages/nutrition";
import WomensHealth from "@/pages/womens-health";
import ChildHealth from "@/pages/child-health";
import DiseaseManagement from "@/pages/disease-management";

// Prevention
import Vaccinations from "@/pages/vaccinations";
import Insurance from "@/pages/insurance";
import Family from "@/pages/family";

// Intelligence
import Surveillance from "@/pages/surveillance";
import Gamification from "@/pages/gamification";
import Education from "@/pages/education";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function RootRoute() {
  const { isAuthenticated } = useAuth();
  return <Redirect to={isAuthenticated ? "/dashboard" : "/login"} />;
}

function P({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRoute} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Core */}
      <Route path="/dashboard"><P><Dashboard /></P></Route>
      <Route path="/ai-chat"><P><AIChat /></P></Route>
      <Route path="/ai-hub"><P><AIHub /></P></Route>

      {/* Medical */}
      <Route path="/doctors"><P><Doctors /></P></Route>
      <Route path="/doctors/:id"><P><DoctorDetail /></P></Route>
      <Route path="/appointments"><P><Appointments /></P></Route>
      <Route path="/health-records"><P><HealthRecords /></P></Route>
      <Route path="/medications"><P><Medications /></P></Route>
      <Route path="/telemedicine"><P><Telemedicine /></P></Route>

      {/* Facilities */}
      <Route path="/hospitals"><P><Hospitals /></P></Route>
      <Route path="/pharmacies"><P><Pharmacies /></P></Route>
      <Route path="/labs"><P><Labs /></P></Route>
      <Route path="/blood-bank"><P><BloodBank /></P></Route>

      {/* Health & Wellness */}
      <Route path="/mental-health"><P><MentalHealth /></P></Route>
      <Route path="/fitness"><P><Fitness /></P></Route>
      <Route path="/nutrition"><P><Nutrition /></P></Route>
      <Route path="/womens-health"><P><WomensHealth /></P></Route>
      <Route path="/child-health"><P><ChildHealth /></P></Route>
      <Route path="/disease-management"><P><DiseaseManagement /></P></Route>

      {/* Prevention */}
      <Route path="/vaccinations"><P><Vaccinations /></P></Route>
      <Route path="/insurance"><P><Insurance /></P></Route>
      <Route path="/family"><P><Family /></P></Route>

      {/* Intelligence */}
      <Route path="/surveillance"><P><Surveillance /></P></Route>
      <Route path="/gamification"><P><Gamification /></P></Route>
      <Route path="/education"><P><Education /></P></Route>

      {/* Emergency + Profile */}
      <Route path="/emergency"><P><Emergency /></P></Route>
      <Route path="/profile"><P><Profile /></P></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AuthProvider>
                <Router />
              </AuthProvider>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
