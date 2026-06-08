import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";

import { ProtectedRoute } from "@/components/protected-route";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Emergency from "@/pages/emergency";
import Profile from "@/pages/profile";
import AIChat from "@/pages/ai-chat";
import Doctors from "@/pages/doctors";
import DoctorDetail from "@/pages/doctor-detail";
import Appointments from "@/pages/appointments";
import HealthRecords from "@/pages/health-records";
import Medications from "@/pages/medications";
import Hospitals from "@/pages/hospitals";
import Pharmacies from "@/pages/pharmacies";
import Labs from "@/pages/labs";
import MentalHealth from "@/pages/mental-health";
import BloodBank from "@/pages/blood-bank";

const queryClient = new QueryClient();

function RootRoute() {
  const { isAuthenticated } = useAuth();
  return <Redirect to={isAuthenticated ? "/dashboard" : "/login"} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RootRoute} />
      <Route path="/login" component={Login} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      </Route>
      <Route path="/ai-chat">
        <ProtectedRoute><AIChat /></ProtectedRoute>
      </Route>
      <Route path="/doctors">
        <ProtectedRoute><Doctors /></ProtectedRoute>
      </Route>
      <Route path="/doctors/:id">
        <ProtectedRoute><DoctorDetail /></ProtectedRoute>
      </Route>
      <Route path="/appointments">
        <ProtectedRoute><Appointments /></ProtectedRoute>
      </Route>
      <Route path="/health-records">
        <ProtectedRoute><HealthRecords /></ProtectedRoute>
      </Route>
      <Route path="/medications">
        <ProtectedRoute><Medications /></ProtectedRoute>
      </Route>
      <Route path="/hospitals">
        <ProtectedRoute><Hospitals /></ProtectedRoute>
      </Route>
      <Route path="/pharmacies">
        <ProtectedRoute><Pharmacies /></ProtectedRoute>
      </Route>
      <Route path="/labs">
        <ProtectedRoute><Labs /></ProtectedRoute>
      </Route>
      <Route path="/mental-health">
        <ProtectedRoute><MentalHealth /></ProtectedRoute>
      </Route>
      <Route path="/blood-bank">
        <ProtectedRoute><BloodBank /></ProtectedRoute>
      </Route>
      <Route path="/emergency">
        <ProtectedRoute><Emergency /></ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute><Profile /></ProtectedRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
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
  );
}

export default App;
