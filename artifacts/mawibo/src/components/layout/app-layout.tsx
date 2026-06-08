import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Home, MessageSquareHeart, UserRound, Calendar, FileText, Pill,
  Building2, TestTube, Brain, Droplet, Siren, User, LogOut, Menu,
  Shield, Syringe, Dumbbell, Apple, Baby, Heart, Trophy, Users,
  BookOpen, Activity, Bot, Video, X, ChevronRight, Zap
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import logoUrl from "@assets/file_0000000066e071fda913e7e9c0fbbd82_1780941341572.png";

interface AppLayoutProps { children: ReactNode; }

const navGroups = [
  {
    label: "Core",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: Home },
      { href: "/ai-chat", label: "AI Health Mate", icon: MessageSquareHeart, badge: "AI" },
      { href: "/ai-hub", label: "AI Super Hub", icon: Bot, badge: "20+ AI" },
    ],
  },
  {
    label: "Medical",
    items: [
      { href: "/doctors", label: "Doctors", icon: UserRound },
      { href: "/appointments", label: "Appointments", icon: Calendar },
      { href: "/health-records", label: "Medical Records", icon: FileText },
      { href: "/medications", label: "Medications", icon: Pill },
      { href: "/telemedicine", label: "Telemedicine", icon: Video, badge: "Live" },
    ],
  },
  {
    label: "Facilities",
    items: [
      { href: "/hospitals", label: "Hospitals", icon: Building2 },
      { href: "/labs", label: "Laboratories", icon: TestTube },
      { href: "/pharmacies", label: "Pharmacies", icon: Pill },
      { href: "/blood-bank", label: "Blood Bank", icon: Droplet },
    ],
  },
  {
    label: "Health & Wellness",
    items: [
      { href: "/mental-health", label: "Mental Health", icon: Brain },
      { href: "/fitness", label: "Fitness", icon: Dumbbell },
      { href: "/nutrition", label: "Nutrition", icon: Apple },
      { href: "/womens-health", label: "Women's Health", icon: Heart },
      { href: "/child-health", label: "Child Health", icon: Baby },
      { href: "/disease-management", label: "Disease Management", icon: Activity },
    ],
  },
  {
    label: "Prevention",
    items: [
      { href: "/vaccinations", label: "Vaccinations", icon: Syringe },
      { href: "/insurance", label: "Insurance", icon: Shield },
      { href: "/family", label: "Family Health", icon: Users },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/surveillance", label: "Disease Surveillance", icon: Zap },
      { href: "/gamification", label: "Health Rewards", icon: Trophy },
      { href: "/education", label: "Education", icon: BookOpen },
    ],
  },
  {
    label: "Emergency",
    items: [
      { href: "/emergency", label: "Emergency", icon: Siren },
    ],
  },
];

// Bottom nav for mobile (most important items only)
const mobileNav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/ai-hub", label: "AI Hub", icon: Bot },
  { href: "/doctors", label: "Doctors", icon: UserRound },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/emergency", label: "SOS", icon: Siren },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src={logoUrl} alt="MAWIBO" className="h-8 object-contain" />
          <div>
            <p className="font-bold text-sm">MAWIBO</p>
            <p className="text-xs text-muted-foreground">Health OS</p>
          </div>
        </div>
      </div>

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-none">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <p className="text-xs text-muted-foreground/60 font-semibold uppercase tracking-wider px-4 py-2">{group.label}</p>
            {group.items.map((item) => {
              const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} onClick={onNavigate}>
                  <div className={`flex items-center gap-3 px-4 py-2 mx-2 rounded-lg cursor-pointer transition-all group ${isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}>
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : "group-hover:text-foreground"}`} />
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge className={`text-xs px-1.5 py-0 border-0 ${isActive ? "bg-primary/30 text-primary" : "bg-primary/20 text-primary"}`}>{item.badge}</Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom: Profile + Logout */}
      <div className="p-3 border-t border-white/5">
        <Link href="/profile" onClick={onNavigate}>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors mb-1">
            <Avatar className="w-8 h-8 bg-primary/20">
              <AvatarFallback className="text-xs text-primary font-bold bg-primary/20">AJ</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Amara Johnson</p>
              <p className="text-xs text-muted-foreground truncate">Montserrado</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Link>
        <button onClick={logout} className="flex items-center gap-3 px-2 py-2 w-full rounded-lg hover:bg-red-500/10 hover:text-red-400 text-muted-foreground text-sm transition-colors">
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 glass-panel border-r border-white/5 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-card border-white/10">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-background/80 backdrop-blur-xl flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <img src={logoUrl} alt="MAWIBO" className="h-7 object-contain" />
          <Link href="/profile">
            <Avatar className="w-8 h-8 bg-primary/20 cursor-pointer">
              <AvatarFallback className="text-xs text-primary font-bold bg-primary/20">AJ</AvatarFallback>
            </Avatar>
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl border-t border-white/10 z-40">
          <div className="flex items-center justify-around px-2 py-2">
            {mobileNav.map((item) => {
              const isActive = location === item.href;
              const isEmergency = item.href === "/emergency";
              return (
                <Link key={item.href} href={item.href}>
                  <div className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl cursor-pointer transition-all ${isEmergency ? "bg-red-500/20 text-red-400" : isActive ? "text-primary" : "text-muted-foreground"}`}>
                    <item.icon className={`w-5 h-5 ${isEmergency ? "text-red-400" : ""}`} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
