import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { AppLayout } from "./layout/app-layout";
import { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <AppLayout>{children}</AppLayout>;
}
