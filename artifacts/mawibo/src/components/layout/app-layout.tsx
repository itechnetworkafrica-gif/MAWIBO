import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  MessageSquareHeart, 
  UserRound, 
  Calendar, 
  FileText, 
  Pill,
  Building2,
  TestTube,
  Brain,
  Droplet,
  Siren,
  User,
  LogOut,
  Menu
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGetProfile } from "@workspace/api-client-react";

import logoUrl from "@assets/file_0000000066e071fda913e7e9c0fbbd82_1780941341572.png";

interface AppLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/ai-chat", label: "AI Chat", icon: MessageSquareHeart },
  { href: "/doctors", label: "Doctors", icon: UserRound },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/health-records", label: "Records", icon: FileText },
  { href: "/medications", label: "Medications", icon: Pill },
  { href: "/hospitals", label: "Hospitals", icon: Building2 },
  { href: "/labs", label: "Labs", icon: TestTube },
  { href: "/mental-health", label: "Mental Health", icon: Brain },
  { href: "/blood-bank", label: "Blood Bank", icon: Droplet },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const { data: profile } = useGetProfile();

  const NavLinks = () => (
    <>
      <div className="px-6 py-6 mb-4">
        <img src={logoUrl} alt="MAWIBO" className="h-8 object-contain" />
      </div>
      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        {navItems.map((item) => {
          const active = location === item.href || location.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                active 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}>
                <item.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
        <Link href="/emergency">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer text-destructive hover:bg-destructive/10 mt-4 font-medium border border-destructive/20 bg-destructive/5">
            <Siren className="h-5 w-5" />
            <span>Emergency</span>
          </div>
        </Link>
      </nav>
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <Avatar className="h-10 w-10 border border-white/10">
            <AvatarImage src={profile?.avatarUrl || undefined} />
            <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">ID: {profile?.id || "---"}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={logout}>
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 left-0 glass-panel z-40">
        <NavLinks />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 glass-panel border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <img src={logoUrl} alt="MAWIBO" className="h-6 object-contain" />
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-background/95 backdrop-blur-xl border-white/10 flex flex-col">
            <NavLinks />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:pl-72 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 glass-panel border-t border-white/5 h-16 flex items-center justify-around px-2 z-40 pb-safe">
        {[
          { href: "/dashboard", icon: Home },
          { href: "/ai-chat", icon: MessageSquareHeart },
          { href: "/emergency", icon: Siren, isEmergency: true },
          { href: "/doctors", icon: UserRound },
          { href: "/appointments", icon: Calendar },
        ].map((item) => {
          const active = location === item.href || location.startsWith(`${item.href}/`);
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full cursor-pointer ${
                item.isEmergency 
                  ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 -mt-6 h-14 w-14" 
                  : active ? "text-primary" : "text-muted-foreground"
              }`}>
                <item.icon className={item.isEmergency ? "h-6 w-6" : "h-5 w-5"} />
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
