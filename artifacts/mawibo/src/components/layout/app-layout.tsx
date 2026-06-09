import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Home, MessageSquareHeart, UserRound, Calendar, FileText, Pill,
  Building2, TestTube, Brain, Droplet, Siren, LogOut, Menu,
  Shield, Syringe, Dumbbell, Apple, Baby, Heart, Trophy, Users,
  BookOpen, Activity, Bot, Video, ChevronRight, Zap, Sun, Moon,
  Bell, Search, X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
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
      { href: "/ai-hub", label: "AI Super Hub", icon: Bot, badge: "20+" },
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
      { href: "/disease-management", label: "Disease Mgmt", icon: Activity },
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
      { href: "/emergency", label: "Emergency SOS", icon: Siren },
    ],
  },
];

const mobileNav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/ai-hub", label: "AI Hub", icon: Bot },
  { href: "/doctors", label: "Doctors", icon: UserRound },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/emergency", label: "SOS", icon: Siren },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl transition-colors hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  const { logout } = useAuth();

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo + Theme Toggle */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <Link href="/dashboard" onClick={onNavigate}>
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <img src={logoUrl} alt="MAWIBO" className="h-5 object-contain" />
            </div>
            <div>
              <p className="font-bold text-sm text-sidebar-foreground leading-none">MAWIBO</p>
              <p className="text-xs text-sidebar-foreground/60 leading-none mt-0.5">Health OS</p>
            </div>
          </div>
        </Link>
        <ThemeToggle />
      </div>

      {/* Nav Groups */}
      <div className="flex-1 overflow-y-auto py-3 scrollbar-none px-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-2">
            <p className="text-xs text-sidebar-foreground/50 font-semibold uppercase tracking-wider px-3 py-1.5">
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive =
                location === item.href ||
                (item.href !== "/dashboard" && location.startsWith(item.href));
              const isEmergency = item.href === "/emergency";
              return (
                <Link key={item.href} href={item.href} onClick={onNavigate}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all mb-0.5 group ${
                      isEmergency
                        ? "bg-red-500/20 text-red-200 hover:bg-red-500/30"
                        : isActive
                        ? "bg-white/20 text-sidebar-foreground font-semibold shadow-sm"
                        : "text-sidebar-foreground/70 hover:bg-white/10 hover:text-sidebar-foreground"
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isEmergency ? "text-red-300" : isActive ? "text-sidebar-foreground" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                      }`}
                    />
                    <span className="text-sm flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <Badge className="text-[10px] px-1.5 py-0 h-4 border-0 bg-white/20 text-sidebar-foreground font-medium">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Profile + Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <Link href="/profile" onClick={onNavigate}>
          <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-colors mb-1">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="text-xs font-bold bg-white/20 text-sidebar-foreground">
                AJ
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-sidebar-foreground">Amara Johnson</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Montserrado County</p>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-sidebar-foreground/50 flex-shrink-0" />
          </div>
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-xl hover:bg-red-500/20 hover:text-red-300 text-sidebar-foreground/60 text-sm transition-colors"
        >
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
  const { theme, toggleTheme } = useTheme();

  const currentPage = navGroups
    .flatMap(g => g.items)
    .find(i => location === i.href || (i.href !== "/dashboard" && location.startsWith(i.href)));

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 border-0">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar (always visible) */}
        <header className="flex items-center justify-between px-4 h-14 border-b border-border bg-sidebar text-sidebar-foreground flex-shrink-0 shadow-sm">
          {/* Mobile: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5 text-sidebar-foreground" />
            </button>
            <div className="md:hidden">
              <img src={logoUrl} alt="MAWIBO" className="h-6 object-contain" />
            </div>
            {/* Desktop: page title */}
            <div className="hidden md:block">
              <p className="font-semibold text-sm text-sidebar-foreground">
                {currentPage?.label ?? "MAWIBO"}
              </p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl hover:bg-white/10 transition-colors relative">
              <Bell className="w-4 h-4 text-sidebar-foreground/80" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
            </button>
            <div className="md:hidden">
              <ThemeToggle />
            </div>
            <Link href="/profile">
              <Avatar className="w-7 h-7 cursor-pointer ml-1">
                <AvatarFallback className="text-[10px] font-bold bg-white/20 text-sidebar-foreground">
                  AJ
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-40">
          <div className="flex items-center justify-around px-2 py-2">
            {mobileNav.map((item) => {
              const isActive = location === item.href;
              const isEmergency = item.href === "/emergency";
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                      isEmergency
                        ? "bg-red-500/15 text-red-500"
                        : isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.label}</span>
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
