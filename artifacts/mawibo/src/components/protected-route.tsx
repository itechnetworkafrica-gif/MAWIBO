import { AppLayout } from "./layout/app-layout";
import { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
